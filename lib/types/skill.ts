/**
 * Skill Type (v2+)
 * Describes a reusable capability that can be shared across agents
 * This is a placeholder for future implementation
 */

export interface Skill {
  id: string;
  name: string;
  description: string;

  // Capability definition
  category: string;
  prompt_template?: string;
  tools_required?: string[];

  // Usage instructions
  how_to_use?: string;
  when_applicable?: string;
  examples?: string[];

  // Metadata
  version?: string;
  author?: string;
  tags?: string[];

  // Performance metrics (future)
  success_rate?: number;
  avg_execution_time?: number;
}
