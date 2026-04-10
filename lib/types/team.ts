/**
 * Team Specification Type (v2+)
 * Describes a team of AI agents with shared resources and coordination
 * Based on Phase 2 Architecture research
 */

import { AgentSpec, AgentTool } from './agent';

/**
 * Agent role definition within a team
 * Extends individual agent concept with team-specific attributes
 */
export interface AgentRole {
  id: string;
  name: string;
  description: string;
  specializations: Specialization[];
  responsibilities: string[];

  // Tool & capability definitions (MCP-compatible)
  tools_available: AgentTool[];

  // Knowledge & memory access control
  knowledge_access: {
    shared_knowledge_base: boolean;
    conversation_history: boolean;
    entity_memory: boolean;
    decision_logs: boolean;
  };

  // Constraints (prevent token explosion and coordination saturation)
  constraints: {
    max_context_tokens?: number;
    max_responses_per_hour?: number;
    cost_limit?: number;
    parallel_tasks?: number;
  };
}

export interface Specialization {
  domain: string;
  proficiency: 'expert' | 'advanced' | 'intermediate';
  description: string;
}

/**
 * Team composition - defines what the team looks like
 * Critical: Topology becomes essential beyond 5 agents
 */
export interface TeamComposition {
  id: string;
  name: string;
  purpose: string;

  // Agents in this team
  agents: AgentRole[];

  // Team structure (prevents coordination chaos)
  team_structure: {
    type: 'flat' | 'hierarchical' | 'peer-review' | 'mixed';
    manager_agent?: string;
    decision_authority: Record<string, string[]>;
  };

  // Team sizing guidance
  team_size_range: { min: number; max: number };
  essential_roles: string[];

  // Success metrics (compare to human teams)
  expected_metrics: {
    task_completion_rate: number;
    average_response_time: number;
    cost_per_interaction: number;
    quality_score: number;
  };
}

/**
 * Communication protocol - prevents message overload
 * Research: Coordination saturation occurs beyond critical thresholds
 */
export interface AgentCommunication {
  from_agent: string;
  to_agent: string;

  protocol: 'request-response' | 'broadcast' | 'event-driven' | 'query';

  message_types: {
    type: string;
    schema: object;
    frequency_limit?: number;
  }[];

  frequency: 'on-demand' | 'continuous' | 'periodic';
  triggers?: string[];
}

/**
 * Workflow step - part of a DAG-based workflow
 * Supports decision gates, parallel execution, error recovery
 */
export interface WorkflowStep {
  id: string;
  name: string;

  type: 'agent-task' | 'decision' | 'parallel' | 'quality-gate' | 'human-input' | 'error-recovery';

  assigned_to: string[];

  inputs: string[];
  outputs: string[];

  task_description: string;
  success_criteria: string;

  // Error handling (prevents single-point failures)
  timeout_seconds: number;
  fallback_agent?: string;
  max_retries: number;
  on_failure: 'escalate' | 'parallel-agent' | 'skip' | 'human-input';

  // Conditional branching
  condition?: {
    field: string;
    type: 'equals' | 'contains' | 'greater_than' | 'matches_regex';
    value: any;
    branches: Record<string, string>;
  };
}

/**
 * Team workflow - DAG with cycles
 * Enables iteration and complex coordination
 */
export interface TeamWorkflow {
  id: string;
  name: string;

  trigger: {
    type: 'user-request' | 'scheduled' | 'event' | 'webhook';
    config: object;
  };

  steps: WorkflowStep[];

  // Context management
  shared_context: {
    shared_fields: string[];
    context_propagation: 'full' | 'selective' | 'none';
    max_context_size: number;
    entity_tracking?: {
      entity_type: string;
      fields: string[];
      persistence: 'session' | 'permanent';
    }[];
  };

  // Quality gates
  quality_gates: {
    step_id: string;
    validation_agent: string;
    criteria: string[];
    on_failure: 'fix' | 'escalate' | 'loop-back';
  }[];

  // Escalation policy
  escalation_policy: {
    conditions: string[];
    escalate_to: 'human' | 'senior_agent';
    max_escalations: number;
  };

  sla?: {
    max_total_time: number;
    max_per_step: number;
  };
}

/**
 * Complete team specification
 * Extends AgentSpec for team-level features
 */
export interface TeamSpec extends AgentSpec {
  is_team: true;
  is_individual_agent: false;

  team_config: {
    composition: TeamComposition;
    communication: AgentCommunication[];
    workflows: TeamWorkflow[];
    shared_context: SharedContextConfig;
    escalation_policy: EscalationPolicy;
    observability: {
      log_all_interactions: boolean;
      track_agent_metrics: boolean;
      trace_decisions: boolean;
    };
  };
}

/**
 * Shared context across team
 */
export interface SharedContextConfig {
  knowledge_base: {
    type: 'vector-db' | 'graph-db' | 'hybrid';
    contents: string[];
    sync_interval?: number;
  };

  conversation_history: {
    retention_days: number;
    accessibility: 'all-agents' | 'role-based' | 'decision-gate';
  };

  entity_memory: {
    enabled: boolean;
    storage_backend: string;
    ttl_days: number;
  };

  decision_logs: {
    enabled: boolean;
    what_to_track: string[];
  };
}

/**
 * Escalation policy
 */
export interface EscalationPolicy {
  conditions: string[];
  escalate_to: string;
  sla_minutes: number;
}
