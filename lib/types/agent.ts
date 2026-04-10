/**
 * Agent Specification Type (v1)
 * Describes a single AI agent with its configuration, tools, and behavior
 */

export interface AgentTool {
  name: string;
  description: string;
  when_to_use: string;
  parameters?: Record<string, {
    type: string;
    description: string;
    required?: boolean;
  }>;
  example?: string;
}

export interface AgentSpec {
  // Metadata
  id?: string;
  name: string;
  description?: string;
  version?: string;
  created_at?: string;
  updated_at?: string;

  // Core Configuration
  role: string;
  purpose: string;
  expertise_domains: string[];

  // Tasks & Responsibilities
  primary_tasks: string[];
  success_criteria?: string[];

  // Tools & Integrations
  tools: AgentTool[];
  tool_usage_strategy?: string;

  // Rules & Constraints
  hard_rules: string[];
  soft_guidelines?: string[];
  safety_boundaries?: string[];

  // Workflow & Behavior
  workflow_pattern: 'sequential' | 'parallel' | 'adaptive';
  reasoning_pattern?: 'react' | 'chain-of-thought' | 'custom';
  error_handling?: string;

  // Output Configuration
  output_format: string;
  response_structure?: Record<string, unknown>;
  output_language?: string;

  // Model Configuration (optional, for runtime)
  model_config?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
  };

  // System Prompt (generated)
  system_prompt?: string;

  // Additional metadata
  tags?: string[];
  parent_team?: string; // For v2 multi-agent support
}

/**
 * Configurator State - tracks the conversation and accumulated answers
 */
export interface ConfiguratorState {
  step: number;
  current_question?: string;
  answers: Record<string, unknown>;
  conversation_history: ConversationTurn[];
  partial_spec: Partial<AgentSpec>;
  follow_ups_remaining: number;
}

export interface ConversationTurn {
  type: 'question' | 'answer' | 'followup';
  content: string;
  timestamp: string;
  topic?: string;
}

/**
 * Initial questions structure
 */
export interface InitialQuestion {
  id: string;
  topic: string;
  question: string;
  hint?: string;
  follow_up_template?: string;
}
