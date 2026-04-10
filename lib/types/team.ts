/**
 * Team Specification Type (v2+)
 * Describes a team of AI agents with shared resources and coordination
 * This is a placeholder for future implementation
 */

export interface TeamSpec {
  id: string;
  name: string;
  description?: string;

  // Team members
  agents: {
    id: string;
    role: string;
    specialization: string;
  }[];

  // Shared resources
  shared_tools?: string[];
  shared_knowledge_base?: string;

  // Coordination rules
  coordination_pattern?: 'hierarchical' | 'collaborative' | 'voting';
  decision_making_process?: string;

  // Interaction protocols
  message_format?: string;
  approval_gates?: string[];

  metadata?: Record<string, unknown>;
}
