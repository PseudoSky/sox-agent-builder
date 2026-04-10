import { AgentSpec } from '@/lib/types/agent';

/**
 * Prompt Builder
 * Generates XML-structured system prompts from agent specs
 * Follows Anthropic best practices + ReAct pattern
 */

export class PromptBuilder {
  /**
   * Build a complete system prompt from an agent spec
   */
  static buildSystemPrompt(spec: Partial<AgentSpec>): string {
    const sections: string[] = [];

    // 1. Role & Context
    if (spec.role || spec.purpose) {
      sections.push(this.buildRoleSection(spec));
    }

    // 2. Tasks & Responsibilities
    if (spec.primary_tasks && spec.primary_tasks.length > 0) {
      sections.push(this.buildTasksSection(spec));
    }

    // 3. Tool Definitions
    if (spec.tools && spec.tools.length > 0) {
      sections.push(this.buildToolsSection(spec));
    }

    // 4. Rules & Constraints
    if ((spec.hard_rules && spec.hard_rules.length > 0) ||
        (spec.soft_guidelines && spec.soft_guidelines.length > 0) ||
        (spec.safety_boundaries && spec.safety_boundaries.length > 0)) {
      sections.push(this.buildRulesSection(spec));
    }

    // 5. Reasoning Pattern (ReAct if applicable)
    if (spec.reasoning_pattern || spec.reasoning_pattern === 'react') {
      sections.push(this.buildReasoningSection(spec));
    }

    // 6. Output Format Requirements
    if (spec.output_format) {
      sections.push(this.buildOutputFormatSection(spec));
    }

    return sections.join('\n\n');
  }

  /**
   * Build role and context section
   */
  private static buildRoleSection(spec: Partial<AgentSpec>): string {
    const role = spec.role || 'AI Assistant';
    const purpose = spec.purpose || 'to assist with tasks';
    const domains = spec.expertise_domains?.join(', ') || '';

    let section = `<role>
You are a ${role} designed to ${purpose}.`;

    if (domains) {
      section += `\nYour expertise is in: ${domains}.`;
    }

    section += '\n</role>';
    return section;
  }

  /**
   * Build tasks and responsibilities section
   */
  private static buildTasksSection(spec: Partial<AgentSpec>): string {
    const tasks = spec.primary_tasks || [];
    const criteria = spec.success_criteria || [];

    let section = '<tasks>\nYour primary responsibilities are:\n';
    tasks.forEach((task, idx) => {
      section += `${idx + 1}. ${task}\n`;
    });

    if (criteria.length > 0) {
      section += '\nSuccess criteria:\n';
      criteria.forEach((criterion, idx) => {
        section += `- ${criterion}\n`;
      });
    }

    section += '</tasks>';
    return section;
  }

  /**
   * Build tool definitions section (MCP-compatible format)
   */
  private static buildToolsSection(spec: Partial<AgentSpec>): string {
    const tools = spec.tools || [];

    if (tools.length === 0) return '';

    let section = '<tools>\nAvailable tools:\n\n';

    tools.forEach(tool => {
      section += `**${tool.name}**\n`;
      section += `Description: ${tool.description}\n`;
      section += `When to use: ${tool.when_to_use}\n`;

      if (tool.parameters) {
        section += `Parameters:\n`;
        for (const [paramName, paramDef] of Object.entries(tool.parameters)) {
          section += `  - ${paramName} (${paramDef.type}): ${paramDef.description}`;
          if (paramDef.required) section += ' [REQUIRED]';
          section += '\n';
        }
      }

      if (tool.example) {
        section += `Example: ${tool.example}\n`;
      }

      section += '\n';
    });

    section += '</tools>';
    return section;
  }

  /**
   * Build rules and constraints section
   */
  private static buildRulesSection(spec: Partial<AgentSpec>): string {
    const hardRules = spec.hard_rules || [];
    const guidelines = spec.soft_guidelines || [];
    const boundaries = spec.safety_boundaries || [];

    let section = '<rules>\n';

    if (hardRules.length > 0) {
      section += 'CRITICAL RULES (you MUST follow these):\n';
      hardRules.forEach((rule, idx) => {
        section += `${idx + 1}. ${rule}\n`;
      });
      section += '\n';
    }

    if (guidelines.length > 0) {
      section += 'GUIDELINES (best practices):\n';
      guidelines.forEach((guideline, idx) => {
        section += `- ${guideline}\n`;
      });
      section += '\n';
    }

    if (boundaries.length > 0) {
      section += 'SAFETY BOUNDARIES:\n';
      boundaries.forEach((boundary) => {
        section += `⚠️  ${boundary}\n`;
      });
    }

    section += '</rules>';
    return section;
  }

  /**
   * Build reasoning pattern section (ReAct pattern)
   */
  private static buildReasoningSection(spec: Partial<AgentSpec>): string {
    const pattern = spec.reasoning_pattern || 'react';

    if (pattern === 'react') {
      return `<reasoning>
For complex tasks, use this reasoning pattern:

<thought>
Analyze the problem and determine which tools or approach is needed.
</thought>

<action>
If needed, invoke a tool or take a direct action.
Include the tool name and all required parameters.
</action>

<observation>
Analyze the result of the action. Does it help progress toward the goal?
Determine if you need additional actions or can now provide the final answer.
</observation>

Repeat this cycle until you have enough information to provide a complete answer.
</reasoning>`;
    }

    if (pattern === 'chain-of-thought') {
      return `<reasoning>
Break down complex problems step-by-step:

1. Understand the problem
2. Identify relevant information or tools
3. Plan your approach
4. Execute the plan
5. Verify the result

Always show your reasoning clearly.
</reasoning>`;
    }

    return '';
  }

  /**
   * Build output format section
   */
  private static buildOutputFormatSection(spec: Partial<AgentSpec>): string {
    const format = spec.output_format || 'clear and structured';

    let section = `<output_format>
Always structure your responses as:
${format}`;

    if (spec.response_structure) {
      section += '\n\nStructure:\n';
      section += JSON.stringify(spec.response_structure, null, 2);
    }

    section += '\n</output_format>';
    return section;
  }

  /**
   * Validate that prompt covers essential sections
   */
  static validatePrompt(prompt: string): { valid: boolean; missingSections: string[] } {
    const missingSections: string[] = [];
    const requiredSections = ['role', 'tasks', 'rules', 'output_format'];

    for (const section of requiredSections) {
      const pattern = new RegExp(`<${section}>`, 'i');
      if (!pattern.test(prompt)) {
        missingSections.push(section);
      }
    }

    return {
      valid: missingSections.length === 0,
      missingSections
    };
  }

  /**
   * Extract just the plain text from XML sections (for display)
   */
  static stripXmlTags(prompt: string): string {
    return prompt.replace(/<[^>]+>/g, '').trim();
  }

  /**
   * Get a summary of what the prompt covers
   */
  static getSummary(prompt: string): Record<string, boolean> {
    return {
      has_role: /<role>/i.test(prompt),
      has_tasks: /<tasks>/i.test(prompt),
      has_tools: /<tools>/i.test(prompt),
      has_rules: /<rules>/i.test(prompt),
      has_reasoning: /<reasoning>/i.test(prompt),
      has_output_format: /<output_format>/i.test(prompt),
    };
  }
}
