import { AgentSpec } from '@/lib/types/agent';

/**
 * Prompt-Tool Alignment Validation
 * Ensures that declared tools are actually mentioned and explained in the system prompt
 * This is a unique feature to prevent tools from being unused
 */

export interface ValidationResult {
  valid: boolean;
  toolAlignmentIssues: ToolAlignmentIssue[];
  warnings: string[];
  suggestions: string[];
}

export interface ToolAlignmentIssue {
  toolName: string;
  severity: 'error' | 'warning';
  message: string;
  suggestion?: string;
}

export class PromptValidator {
  /**
   * Validate that tools declared in spec are mentioned in system prompt
   */
  static validateToolAlignment(spec: Partial<AgentSpec>): ValidationResult {
    const issues: ToolAlignmentIssue[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // If no tools, skip validation
    if (!spec.tools || spec.tools.length === 0) {
      return { valid: true, toolAlignmentIssues: [], warnings, suggestions };
    }

    const prompt = spec.system_prompt || '';
    const promptLower = prompt.toLowerCase();

    // Check each tool
    for (const tool of spec.tools) {
      const toolNameLower = tool.name.toLowerCase();
      const toolDescLower = tool.description.toLowerCase();

      // Check if tool name is mentioned
      if (!promptLower.includes(toolNameLower)) {
        issues.push({
          toolName: tool.name,
          severity: 'warning',
          message: `Tool "${tool.name}" is defined but not mentioned in the system prompt`,
          suggestion: `Add instructions on when and how to use "${tool.name}" in the <tools> section of the prompt`
        });
      }

      // Check if tool has usage instructions
      const hasUsageContext = this.hasToolContext(prompt, tool.name, tool.when_to_use);
      if (!hasUsageContext) {
        warnings.push(`Tool "${tool.name}" lacks clear usage context in the prompt`);
      }
    }

    // Suggest improvements
    if (spec.tools.length > 0 && !prompt.includes('<tools>')) {
      suggestions.push('Wrap tool definitions in <tools></tools> XML tags for clarity');
    }

    return {
      valid: issues.filter(i => i.severity === 'error').length === 0,
      toolAlignmentIssues: issues,
      warnings,
      suggestions
    };
  }

  /**
   * Check if tool has adequate context explaining when to use it
   */
  private static hasToolContext(prompt: string, toolName: string, whenToUse?: string): boolean {
    const promptLower = prompt.toLowerCase();
    const toolLower = toolName.toLowerCase();

    // Look for the tool name
    const toolIndex = promptLower.indexOf(toolLower);
    if (toolIndex === -1) return false;

    // Check if there's explanatory text near the tool name (within 200 chars)
    const contextStart = Math.max(0, toolIndex - 100);
    const contextEnd = Math.min(prompt.length, toolIndex + toolName.length + 100);
    const context = prompt.substring(contextStart, contextEnd).toLowerCase();

    const contextKeywords = ['when', 'use', 'call', 'invoke', 'example', 'if', 'should'];
    return contextKeywords.some(kw => context.includes(kw));
  }

  /**
   * Validate overall spec completeness
   */
  static validateSpecCompleteness(spec: Partial<AgentSpec>): { complete: boolean; missingFields: string[] } {
    const missingFields: string[] = [];

    if (!spec.role) missingFields.push('role');
    if (!spec.purpose) missingFields.push('purpose');
    if (!spec.primary_tasks || spec.primary_tasks.length === 0) missingFields.push('primary_tasks');
    if (!spec.output_format) missingFields.push('output_format');

    // Hard rules are recommended but not required
    if (!spec.hard_rules || spec.hard_rules.length === 0) {
      missingFields.push('hard_rules (recommended)');
    }

    return {
      complete: missingFields.filter(f => !f.includes('recommended')).length === 0,
      missingFields
    };
  }

  /**
   * Generate improvement suggestions based on spec
   */
  static generateSuggestions(spec: Partial<AgentSpec>): string[] {
    const suggestions: string[] = [];

    // Check reasoning pattern
    if (!spec.reasoning_pattern || spec.reasoning_pattern === 'custom') {
      suggestions.push('Consider enabling ReAct (Thought→Action→Observation) pattern for complex tasks');
    }

    // Check for error handling
    if (!spec.error_handling) {
      suggestions.push('Add error handling instructions for failed tool calls or unexpected inputs');
    }

    // Check for examples in prompt
    if (!spec.system_prompt || !spec.system_prompt.includes('<examples>')) {
      suggestions.push('Add 1-2 examples in the prompt to demonstrate expected behavior (few-shot learning)');
    }

    // Check tool complexity
    if (spec.tools && spec.tools.length > 5) {
      suggestions.push(`You have ${spec.tools.length} tools - consider if all are necessary or if some can be combined`);
    }

    // Check hard rules
    if (!spec.hard_rules || spec.hard_rules.length === 0) {
      suggestions.push('Add hard rules (constraints the agent MUST follow) for safety and consistency');
    }

    // Check output structure
    if (spec.output_format && spec.output_format.length < 20) {
      suggestions.push('Output format is very brief - consider adding more detail about expected structure');
    }

    return suggestions;
  }

  /**
   * Full validation report
   */
  static fullValidation(spec: Partial<AgentSpec>): {
    alignment: ValidationResult;
    completeness: ReturnType<typeof PromptValidator.validateSpecCompleteness>;
    suggestions: string[];
    overallScore: number;
  } {
    const alignment = this.validateToolAlignment(spec);
    const completeness = this.validateSpecCompleteness(spec);
    const suggestions = this.generateSuggestions(spec);

    // Calculate score (0-100)
    let score = 100;

    // Deduct for issues
    score -= alignment.toolAlignmentIssues.filter(i => i.severity === 'error').length * 10;
    score -= alignment.toolAlignmentIssues.filter(i => i.severity === 'warning').length * 5;
    score -= completeness.missingFields.filter(f => !f.includes('recommended')).length * 15;
    score -= suggestions.length * 3;

    score = Math.max(0, Math.min(100, score));

    return {
      alignment,
      completeness,
      suggestions,
      overallScore: score
    };
  }
}
