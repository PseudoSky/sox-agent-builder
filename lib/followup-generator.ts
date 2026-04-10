/**
 * Follow-up Question Generator
 * Supports both Anthropic API and Claude CLI backends
 */

export interface FollowUpGeneratorConfig {
  backend: 'api' | 'cli';
  apiKey?: string;
}

export interface FollowUpRequest {
  topic: string;
  user_answer: string;
  current_round: number;
  previous_answers?: Record<string, string>;
}

export interface FollowUpResponse {
  follow_ups: string[];
  analysis?: string;
  backend: 'api' | 'cli';
}

/**
 * Base interface for follow-up generators
 */
export interface IFollowUpGenerator {
  generate(request: FollowUpRequest): Promise<FollowUpResponse>;
}

/**
 * Anthropic API-based generator
 */
export class AnthropicFollowUpGenerator implements IFollowUpGenerator {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(request: FollowUpRequest): Promise<FollowUpResponse> {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({ apiKey: this.apiKey });

    const { topic, user_answer, current_round, previous_answers } = request;

    let contextStr = '';
    if (previous_answers && Object.keys(previous_answers).length > 0) {
      contextStr = 'Previous answers:\n';
      for (const [key, value] of Object.entries(previous_answers)) {
        contextStr += `- ${key}: ${value}\n`;
      }
    }

    const systemPrompt = `You are an expert AI system architect helping users design agent specifications.
Your task is to generate 2-3 intelligent follow-up questions based on their answer about a specific topic.

The user is building an AI agent specification. They've answered a question about: ${topic}

Generate follow-up questions that:
1. Clarify ambiguous answers
2. Dig deeper into technical requirements
3. Explore edge cases or constraints
4. Help define the specification more precisely

Make questions concise, specific, and actionable. Number them (1., 2., 3.).
Avoid generic questions. Reference their answer directly when relevant.

${contextStr}`;

    const userMessage = `Topic: ${topic}
Their answer: "${user_answer}"
This is follow-up round: ${current_round}

Generate 2-3 follow-up questions to refine the specification further.`;

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const followUpText = content.text;
    const followUps = parseFollowUps(followUpText);

    return {
      follow_ups: followUps,
      analysis: followUpText,
      backend: 'api'
    };
  }
}

/**
 * Claude CLI-based generator (uses local Claude CLI)
 */
export class ClaudeCliFollowUpGenerator implements IFollowUpGenerator {
  async generate(request: FollowUpRequest): Promise<FollowUpResponse> {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    const { topic, user_answer, current_round, previous_answers } = request;

    let contextStr = '';
    if (previous_answers && Object.keys(previous_answers).length > 0) {
      contextStr = 'Previous answers:\n';
      for (const [key, value] of Object.entries(previous_answers)) {
        contextStr += `- ${key}: ${value}\n`;
      }
    }

    const prompt = `You are an expert AI system architect helping users design agent specifications.
Your task is to generate 2-3 intelligent follow-up questions based on their answer about a specific topic.

The user is building an AI agent specification. They've answered a question about: ${topic}

Generate follow-up questions that:
1. Clarify ambiguous answers
2. Dig deeper into technical requirements
3. Explore edge cases or constraints
4. Help define the specification more precisely

Make questions concise, specific, and actionable. Number them (1., 2., 3.).
Avoid generic questions. Reference their answer directly when relevant.

${contextStr}

Topic: ${topic}
Their answer: "${user_answer}"
This is follow-up round: ${current_round}

Generate 2-3 follow-up questions to refine the specification further.`;

    try {
      // Use claude CLI if available
      const { stdout } = await execAsync(
        `echo '${prompt.replace(/'/g, "'\\''")}'  | claude --no-stream`,
        { maxBuffer: 10 * 1024 * 1024 } // 10MB buffer for large responses
      );

      const followUps = parseFollowUps(stdout);

      return {
        follow_ups: followUps,
        analysis: stdout,
        backend: 'cli'
      };
    } catch (error) {
      // Fallback to generic follow-ups if CLI fails
      console.error('Claude CLI error:', error);
      const fallbackFollowUps = generateFallbackFollowUps(topic, user_answer);

      return {
        follow_ups: fallbackFollowUps,
        analysis: 'Using fallback questions (Claude CLI unavailable)',
        backend: 'cli'
      };
    }
  }
}

/**
 * Factory for creating the appropriate generator
 */
export class FollowUpGeneratorFactory {
  static create(config: FollowUpGeneratorConfig): IFollowUpGenerator {
    if (config.backend === 'cli') {
      return new ClaudeCliFollowUpGenerator();
    } else {
      const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY not provided');
      }
      return new AnthropicFollowUpGenerator(apiKey);
    }
  }

  static getConfigFromEnv(): FollowUpGeneratorConfig {
    const backend = (process.env.FOLLOWUP_BACKEND || 'api') as 'api' | 'cli';
    return {
      backend,
      apiKey: process.env.ANTHROPIC_API_KEY
    };
  }
}

/**
 * Parse Claude's response to extract individual follow-up questions
 */
function parseFollowUps(text: string): string[] {
  const lines = text.split('\n');
  const followUps: string[] = [];

  let currentQuestion = '';
  for (const line of lines) {
    const trimmed = line.trim();

    if (/^\d+\./.test(trimmed)) {
      if (currentQuestion) {
        followUps.push(currentQuestion.trim());
      }
      currentQuestion = trimmed.replace(/^\d+\.\s*/, '');
    } else if (trimmed && currentQuestion) {
      currentQuestion += ' ' + trimmed;
    }
  }

  if (currentQuestion) {
    followUps.push(currentQuestion.trim());
  }

  return followUps.filter(q => q.length > 10);
}

/**
 * Generate fallback follow-up questions when AI is unavailable
 */
function generateFallbackFollowUps(topic: string, answer: string): string[] {
  const fallbacks: Record<string, string[]> = {
    purpose: [
      'What specific problems does this agent solve?',
      'Who are the primary users of this agent?',
      'What makes this agent different from existing solutions?'
    ],
    tasks: [
      'How often will users need each of these tasks?',
      'Are any tasks dependent on others?',
      'What are the most critical tasks to get right first?'
    ],
    tools: [
      'Do all these tools need to be available simultaneously?',
      'What happens if a tool fails or is unavailable?',
      'Are there any tools that are optional or rarely used?'
    ],
    rules: [
      'How should violations of these rules be handled?',
      'Are there exceptions to any of these rules?',
      'How will you monitor compliance with these rules?'
    ],
    workflow: [
      'How long should each task typically take?',
      'Should the agent ask for confirmation before major actions?',
      'How should the agent handle ambiguous or unclear requests?'
    ],
    output: [
      'Should the agent include reasoning in its output?',
      'Are there specific fields that must always be present?',
      'How detailed should explanations be in the output?'
    ]
  };

  return fallbacks[topic] || [
    'Can you provide more details about your previous answer?',
    'What are the key constraints you mentioned?',
    'How would you measure success for this aspect?'
  ];
}
