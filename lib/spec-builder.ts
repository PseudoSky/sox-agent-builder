import { AgentSpec } from '@/lib/types/agent';
import * as yaml from 'js-yaml';

/**
 * Spec Builder
 * Converts agent configuration to YAML or JSON specs
 */

export class SpecBuilder {
  /**
   * Create a complete spec from partial data
   */
  static createSpec(partial: Partial<AgentSpec>, overrides?: Partial<AgentSpec>): AgentSpec {
    const now = new Date().toISOString();

    const spec: AgentSpec = {
      id: this.generateId(),
      name: partial.name || 'Untitled Agent',
      description: partial.description || '',
      version: '1.0.0',
      created_at: now,
      updated_at: now,

      // Required fields (with defaults)
      role: partial.role || 'AI Assistant',
      purpose: partial.purpose || 'To assist with tasks',
      expertise_domains: partial.expertise_domains || [],

      // Tasks
      primary_tasks: partial.primary_tasks || [],
      success_criteria: partial.success_criteria,

      // Tools
      tools: partial.tools || [],
      tool_usage_strategy: partial.tool_usage_strategy,

      // Rules
      hard_rules: partial.hard_rules || [],
      soft_guidelines: partial.soft_guidelines,
      safety_boundaries: partial.safety_boundaries,

      // Workflow
      workflow_pattern: partial.workflow_pattern || 'sequential',
      reasoning_pattern: partial.reasoning_pattern,
      error_handling: partial.error_handling,

      // Output
      output_format: partial.output_format || 'Plain text',
      response_structure: partial.response_structure,
      output_language: partial.output_language || 'English',

      // System prompt (to be generated separately)
      system_prompt: partial.system_prompt,

      // Metadata
      tags: partial.tags || []
    };

    // Apply overrides
    if (overrides) {
      return { ...spec, ...overrides };
    }

    return spec;
  }

  /**
   * Export spec to YAML format (human-readable, versionable)
   */
  static toYAML(spec: AgentSpec): string {
    // Create a spec object optimized for YAML (exclude internal fields)
    const yamlSpec: Record<string, unknown> = {
      name: spec.name,
      description: spec.description,
      version: spec.version,
      role: spec.role,
      purpose: spec.purpose,
      expertise_domains: spec.expertise_domains,
      primary_tasks: spec.primary_tasks,
    };

    if (spec.success_criteria?.length) {
      yamlSpec.success_criteria = spec.success_criteria;
    }

    if (spec.tools?.length) {
      yamlSpec.tools = spec.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        when_to_use: tool.when_to_use,
        ...(tool.parameters && { parameters: tool.parameters }),
        ...(tool.example && { example: tool.example })
      }));
    }

    if (spec.hard_rules?.length) {
      yamlSpec.hard_rules = spec.hard_rules;
    }

    if (spec.soft_guidelines?.length) {
      yamlSpec.soft_guidelines = spec.soft_guidelines;
    }

    if (spec.safety_boundaries?.length) {
      yamlSpec.safety_boundaries = spec.safety_boundaries;
    }

    yamlSpec.workflow_pattern = spec.workflow_pattern;

    if (spec.reasoning_pattern) {
      yamlSpec.reasoning_pattern = spec.reasoning_pattern;
    }

    if (spec.error_handling) {
      yamlSpec.error_handling = spec.error_handling;
    }

    yamlSpec.output_format = spec.output_format;

    if (spec.output_language && spec.output_language !== 'English') {
      yamlSpec.output_language = spec.output_language;
    }

    if (spec.tags?.length) {
      yamlSpec.tags = spec.tags;
    }

    if (spec.system_prompt) {
      yamlSpec.system_prompt = spec.system_prompt;
    }

    return yaml.dump(yamlSpec, {
      lineWidth: 200,
      noRefs: true,
      sortKeys: false
    });
  }

  /**
   * Export spec to JSON format
   */
  static toJSON(spec: AgentSpec): string {
    return JSON.stringify(spec, null, 2);
  }

  /**
   * Parse YAML to spec
   */
  static fromYAML(yamlString: string): Partial<AgentSpec> {
    try {
      const parsed = yaml.load(yamlString) as Record<string, unknown>;
      return this.normalizeSpec(parsed);
    } catch (error) {
      throw new Error(`Failed to parse YAML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse JSON to spec
   */
  static fromJSON(jsonString: string): Partial<AgentSpec> {
    try {
      const parsed = JSON.parse(jsonString) as Record<string, unknown>;
      return this.normalizeSpec(parsed);
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Normalize a parsed object to AgentSpec shape
   */
  private static normalizeSpec(obj: Record<string, unknown>): Partial<AgentSpec> {
    return {
      name: obj.name as string,
      description: obj.description as string,
      role: obj.role as string,
      purpose: obj.purpose as string,
      expertise_domains: (obj.expertise_domains as string[]) || [],
      primary_tasks: (obj.primary_tasks as string[]) || [],
      success_criteria: obj.success_criteria as string[] | undefined,
      tools: (obj.tools as any[]) || [],
      hard_rules: (obj.hard_rules as string[]) || [],
      soft_guidelines: obj.soft_guidelines as string[] | undefined,
      safety_boundaries: obj.safety_boundaries as string[] | undefined,
      workflow_pattern: (obj.workflow_pattern as any) || 'sequential',
      reasoning_pattern: obj.reasoning_pattern as any | undefined,
      error_handling: obj.error_handling as string | undefined,
      output_format: obj.output_format as string,
      output_language: obj.output_language as string | undefined,
      system_prompt: obj.system_prompt as string | undefined,
      tags: obj.tags as string[] | undefined
    };
  }

  /**
   * Generate a unique ID
   */
  private static generateId(): string {
    return `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate spec has required fields
   */
  static validate(spec: Partial<AgentSpec>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!spec.name || spec.name.trim() === '') {
      errors.push('Spec must have a name');
    }

    if (!spec.role || spec.role.trim() === '') {
      errors.push('Spec must define a role');
    }

    if (!spec.purpose || spec.purpose.trim() === '') {
      errors.push('Spec must have a clear purpose');
    }

    if (!spec.output_format || spec.output_format.trim() === '') {
      errors.push('Spec must specify output format');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
