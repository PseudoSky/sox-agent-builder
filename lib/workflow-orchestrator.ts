/**
 * Workflow Orchestrator
 * Executes multi-agent workflows with:
 * - DAG-based execution model
 * - State passing between steps
 * - Decision gates and branching
 * - Error recovery and fallbacks
 * - Full observability/tracing
 *
 * Prototype: Simple state machine (mimics LangGraph behavior)
 */

import { TeamWorkflow, WorkflowStep, TeamComposition } from './types/team';
import { Anthropic } from '@anthropic-ai/sdk';

export interface WorkflowState {
  [key: string]: any;
  _step_history: string[];
  _agent_messages: AgentMessage[];
  _validation_issues: string[];
}

export interface AgentMessage {
  from_agent: string;
  to_agent: string;
  type: string;
  content: object;
  timestamp: number;
}

export interface StepExecution {
  step_id: string;
  agent_id: string;
  started_at: number;
  completed_at: number;
  inputs: object;
  outputs: object;
  tokens_used: number;
  cost: number;
}

export interface ExecutionTrace {
  started_at: number;
  steps: StepExecution[];
  errors: any[];
  total_tokens_used: number;
  total_cost: number;
}

export interface ExecutionResult {
  output: any;
  execution_trace: ExecutionTrace;
  cost: number;
  latency_ms: number;
  success: boolean;
}

/**
 * Agent-to-agent communication middleware
 * Enforces communication constraints and message routing
 */
export class AgentCommunicationMiddleware {
  private messageLog: AgentMessage[] = [];
  private messageQueues: Map<string, AgentMessage[]> = new Map();

  constructor(private composition: TeamComposition) {
    // Initialize message queue for each agent
    for (const agent of composition.agents) {
      this.messageQueues.set(agent.id, []);
    }
  }

  /**
   * Send a message from one agent to another
   * Validates communication channels and constraints
   */
  async sendMessage(message: AgentMessage): Promise<void> {
    // Check if agent exists
    const fromAgent = this.composition.agents.find(a => a.id === message.from_agent);
    const toAgent = this.composition.agents.find(a => a.id === message.to_agent);

    if (!fromAgent || !toAgent) {
      throw new Error(`Invalid agent IDs: ${message.from_agent} → ${message.to_agent}`);
    }

    // Log message
    this.messageLog.push(message);

    // Queue message for recipient
    const queue = this.messageQueues.get(message.to_agent);
    if (queue) {
      queue.push(message);
    }
  }

  /**
   * Get messages directed to a specific agent
   */
  getMessagesFor(agentId: string): AgentMessage[] {
    const queue = this.messageQueues.get(agentId) || [];
    const messages = [...queue];
    this.messageQueues.set(agentId, []); // Clear after retrieval
    return messages;
  }

  /**
   * Get all messages from execution
   */
  getMessageLog(): AgentMessage[] {
    return this.messageLog;
  }
}

/**
 * Context Manager
 * Manages shared context across team execution
 */
export class ContextManager {
  private conversationHistory: any[] = [];
  private entityMemory: Map<string, any> = new Map();
  private decisionLog: any[] = [];

  /**
   * Record an agent interaction
   */
  recordInteraction(
    agentId: string,
    input: string,
    output: string,
    stepId: string
  ): void {
    this.conversationHistory.push({
      agent_id: agentId,
      step_id: stepId,
      input,
      output,
      timestamp: Date.now(),
    });
  }

  /**
   * Record a decision
   */
  recordDecision(
    agentId: string,
    decision: string,
    reasoning: string
  ): void {
    this.decisionLog.push({
      agent_id: agentId,
      decision,
      reasoning,
      timestamp: Date.now(),
    });
  }

  /**
   * Get context for next agent
   * Selectively includes relevant conversation history
   */
  getContextFor(stepInputs: string[], state: WorkflowState): string {
    let context = '';

    // Include recent conversation history
    if (this.conversationHistory.length > 0) {
      const recentTurns = this.conversationHistory.slice(-5);
      context += '## Team Discussion So Far\n';
      for (const turn of recentTurns) {
        context += `${turn.agent_id}: ${turn.output}\n`;
      }
      context += '\n';
    }

    // Include decision log for consistency
    if (this.decisionLog.length > 0) {
      context += '## Team Decisions\n';
      for (const decision of this.decisionLog.slice(-3)) {
        context += `- ${decision.decision} (reasoning: ${decision.reasoning})\n`;
      }
      context += '\n';
    }

    return context;
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  getDecisionLog() {
    return this.decisionLog;
  }
}

/**
 * Workflow Orchestrator
 * Executes TeamWorkflow with multi-agent coordination
 */
export class WorkflowOrchestrator {
  private client: Anthropic;
  private communication: AgentCommunicationMiddleware;
  private context: ContextManager;
  private executionTrace: ExecutionTrace;

  constructor(
    private workflow: TeamWorkflow,
    private composition: TeamComposition
  ) {
    this.client = new Anthropic();
    this.communication = new AgentCommunicationMiddleware(composition);
    this.context = new ContextManager();
    this.executionTrace = {
      started_at: Date.now(),
      steps: [],
      errors: [],
      total_tokens_used: 0,
      total_cost: 0,
    };
  }

  /**
   * Execute the workflow
   */
  async execute(userInput: string): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Initialize state
      const state: WorkflowState = {
        user_input: userInput,
        final_output: '',
        _step_history: [],
        _agent_messages: [],
        _validation_issues: [],
      };

      // Execute steps in order
      let currentStepId = this.workflow.steps[0].id;
      let stepCount = 0;
      const maxSteps = 20; // Prevent infinite loops

      while (currentStepId && stepCount < maxSteps) {
        const step = this.workflow.steps.find(s => s.id === currentStepId);
        if (!step) break;

        stepCount++;

        try {
          // Execute the step
          const result = await this.executeStep(step, state);

          // Update state
          Object.assign(state, result);
          state._step_history.push(step.id);

          // Determine next step
          if (step.type === 'decision' && step.condition) {
            const value = state[step.condition.field];
            const branch = this.evaluateCondition(value, step.condition);
            currentStepId = step.condition.branches[branch];
          } else {
            // Find next step after this one
            const currentIndex = this.workflow.steps.findIndex(s => s.id === currentStepId);
            if (currentIndex < this.workflow.steps.length - 1) {
              currentStepId = this.workflow.steps[currentIndex + 1].id;
            } else {
              currentStepId = '';
            }
          }
        } catch (error) {
          // Handle step error with fallback
          const step = this.workflow.steps.find(s => s.id === currentStepId)!;

          if (step.fallback_agent) {
            // Try fallback agent
            console.log(`Step ${step.id} failed, trying fallback agent: ${step.fallback_agent}`);
            const fallbackStep = { ...step, assigned_to: [step.fallback_agent] };
            const result = await this.executeStep(fallbackStep, state);
            Object.assign(state, result);
          } else {
            throw error;
          }
        }
      }

      // Calculate final metrics
      const latency = Date.now() - startTime;
      const totalCost = this.executionTrace.total_cost;

      return {
        output: state.final_output || state,
        execution_trace: this.executionTrace,
        cost: totalCost,
        latency_ms: latency,
        success: true,
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        output: { error: String(error) },
        execution_trace: this.executionTrace,
        cost: this.executionTrace.total_cost,
        latency_ms: latency,
        success: false,
      };
    }
  }

  /**
   * Execute a single workflow step
   */
  private async executeStep(
    step: WorkflowStep,
    state: WorkflowState
  ): Promise<Partial<WorkflowState>> {
    if (step.type === 'agent-task') {
      return this.executeAgentTask(step, state);
    } else if (step.type === 'decision') {
      return {};
    } else if (step.type === 'quality-gate') {
      return this.executeQualityGate(step, state);
    } else if (step.type === 'parallel') {
      return this.executeParallel(step, state);
    }

    return {};
  }

  /**
   * Execute an agent task
   */
  private async executeAgentTask(
    step: WorkflowStep,
    state: WorkflowState
  ): Promise<Partial<WorkflowState>> {
    const agentId = step.assigned_to[0];
    const agent = this.composition.agents.find(a => a.id === agentId);

    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Extract inputs from state
    const inputs: Record<string, any> = {};
    for (const inputKey of step.inputs) {
      inputs[inputKey] = state[inputKey];
    }

    // Build system prompt for this agent
    const systemPrompt = this.buildAgentPrompt(agent, step, state);

    // Call Claude
    const stepStartTime = Date.now();

    const response = await this.client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Task: ${step.task_description}\n\nContext: ${JSON.stringify(inputs, null, 2)}`,
        },
      ],
    });

    const stepDuration = Date.now() - stepStartTime;
    const usage = response.usage;

    // Extract response text
    const responseText =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Record interaction
    this.context.recordInteraction(
      agentId,
      step.task_description,
      responseText,
      step.id
    );

    // Update metrics
    const inputTokens = usage.input_tokens || 0;
    const outputTokens = usage.output_tokens || 0;
    const totalTokens = inputTokens + outputTokens;
    const cost = (inputTokens * 0.000003 + outputTokens * 0.000015); // Claude Opus pricing

    this.executionTrace.steps.push({
      step_id: step.id,
      agent_id: agentId,
      started_at: stepStartTime,
      completed_at: Date.now(),
      inputs,
      outputs: { response: responseText },
      tokens_used: totalTokens,
      cost,
    });

    this.executionTrace.total_tokens_used += totalTokens;
    this.executionTrace.total_cost += cost;

    // Update state with outputs
    const result: Partial<WorkflowState> = {
      final_output: responseText,
      [step.id]: responseText,
    };

    // Extract any structured outputs from response
    for (const outputKey of step.outputs) {
      result[outputKey] = this.extractOutput(responseText, outputKey);
    }

    return result;
  }

  /**
   * Execute quality gate step
   */
  private async executeQualityGate(
    step: WorkflowStep,
    state: WorkflowState
  ): Promise<Partial<WorkflowState>> {
    const validatorId = step.assigned_to[0];
    const validator = this.composition.agents.find(a => a.id === validatorId);

    if (!validator) {
      throw new Error(`Validator ${validatorId} not found`);
    }

    const lastOutput = state.final_output || '';

    const systemPrompt = `
You are a quality assurance specialist. Review the following output against these criteria:
${step.success_criteria}

Respond with:
1. PASS or FAIL
2. If FAIL: specific issues
3. Confidence level: high/medium/low
`;

    const response = await this.client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Output to validate:\n\n${lastOutput}`,
        },
      ],
    });

    const responseText =
      response.content[0].type === 'text' ? response.content[0].text : '';

    const isValid = responseText.includes('PASS');

    if (!isValid) {
      const issues = this.extractIssuesFromValidation(responseText);
      return {
        _validation_issues: issues,
      };
    }

    return {};
  }

  /**
   * Execute parallel steps
   */
  private async executeParallel(
    step: WorkflowStep,
    state: WorkflowState
  ): Promise<Partial<WorkflowState>> {
    const tasks = step.assigned_to.map(agentId => {
      const agent = this.composition.agents.find(a => a.id === agentId);
      if (!agent) return Promise.reject(new Error(`Agent ${agentId} not found`));

      return this.executeAgentTask(
        { ...step, assigned_to: [agentId] },
        state
      );
    });

    const results = await Promise.all(tasks);

    // Merge results
    const merged: Partial<WorkflowState> = {};
    for (const result of results) {
      Object.assign(merged, result);
    }

    return merged;
  }

  /**
   * Build system prompt for an agent
   */
  private buildAgentPrompt(
    agent: any,
    step: WorkflowStep,
    state: WorkflowState
  ): string {
    const contextInfo = this.context.getContextFor(step.inputs, state);

    return `
<role>
You are a ${agent.name} on a team.

Your expertise:
${agent.specializations.map((s: any) => `- ${s.domain} (${s.proficiency})`).join('\n')}

Your responsibilities:
${agent.responsibilities.join('\n')}
</role>

<current_task>
${step.task_description}

Success criteria: ${step.success_criteria}
</current_task>

<team_context>
${contextInfo}
</team_context>

<output_format>
Provide a clear, structured response.
If you need help from other agents, indicate "@agent_name: question".
Always state your confidence level: high/medium/low.
</output_format>
`;
  }

  /**
   * Evaluate a condition for branching
   */
  private evaluateCondition(
    value: any,
    condition: any
  ): string {
    switch (condition.type) {
      case 'equals':
        return value === condition.value ? 'true' : 'false';
      case 'contains':
        return String(value).includes(condition.value) ? 'true' : 'false';
      case 'greater_than':
        return value > condition.value ? 'true' : 'false';
      case 'matches_regex':
        return new RegExp(condition.value).test(String(value)) ? 'true' : 'false';
      default:
        return 'false';
    }
  }

  /**
   * Extract output from response text
   */
  private extractOutput(responseText: string, outputKey: string): string {
    // Simple extraction: look for pattern like "key: value"
    const regex = new RegExp(`${outputKey}\\s*[:\\-]\\s*([^\\n]+)`, 'i');
    const match = responseText.match(regex);
    return match ? match[1].trim() : '';
  }

  /**
   * Extract issues from validation response
   */
  private extractIssuesFromValidation(responseText: string): string[] {
    const issues: string[] = [];

    // Look for issues section
    const issuesMatch = responseText.match(/(?:issues?|problems?)[:\\n]+([\s\S]*?)(?:\n|$)/i);
    if (issuesMatch) {
      const issueText = issuesMatch[1];
      const issueLines = issueText.split('\n').filter(l => l.trim());
      issues.push(...issueLines);
    }

    return issues;
  }

  /**
   * Get execution metrics
   */
  getMetrics() {
    return {
      total_steps: this.executionTrace.steps.length,
      total_tokens: this.executionTrace.total_tokens_used,
      total_cost: this.executionTrace.total_cost,
      messages_exchanged: this.communication.getMessageLog().length,
      conversation_history: this.context.getConversationHistory(),
    };
  }
}
