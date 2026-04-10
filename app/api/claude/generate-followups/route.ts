import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

interface FollowUpRequest {
  topic: string;
  user_answer: string;
  current_round: number;
  previous_answers?: Record<string, string>;
}

interface FollowUpResponse {
  follow_ups: string[];
  analysis?: string;
}

/**
 * Generate follow-up questions based on user's answer
 * Uses Claude to intelligently narrow down the agent spec
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as FollowUpRequest;
    const { topic, user_answer, current_round, previous_answers } = body;

    // Validate input
    if (!topic || !user_answer) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, user_answer' },
        { status: 400 }
      );
    }

    // Build context from previous answers
    let contextStr = '';
    if (previous_answers && Object.keys(previous_answers).length > 0) {
      contextStr = 'Previous answers:\n';
      for (const [key, value] of Object.entries(previous_answers)) {
        contextStr += `- ${key}: ${value}\n`;
      }
    }

    // Create the system prompt for Claude to generate good follow-up questions
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

    // Call Claude API
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

    // Extract follow-up questions from response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const followUpText = content.text;
    const followUps = parseFollowUps(followUpText);

    // Return the follow-up questions
    return NextResponse.json({
      follow_ups: followUps,
      analysis: followUpText
    } as FollowUpResponse);

  } catch (error) {
    console.error('Error generating follow-ups:', error);

    // Check for API key issue
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Claude API key not configured. Please set ANTHROPIC_API_KEY.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate follow-up questions' },
      { status: 500 }
    );
  }
}

/**
 * Parse Claude's response to extract individual follow-up questions
 */
function parseFollowUps(text: string): string[] {
  // Split by numbered patterns (1., 2., 3., etc.)
  const lines = text.split('\n');
  const followUps: string[] = [];

  let currentQuestion = '';
  for (const line of lines) {
    const trimmed = line.trim();

    // Check if line starts with a number (1., 2., 3., etc.)
    if (/^\d+\./.test(trimmed)) {
      if (currentQuestion) {
        followUps.push(currentQuestion.trim());
      }
      // Remove the number and bullet
      currentQuestion = trimmed.replace(/^\d+\.\s*/, '');
    } else if (trimmed && currentQuestion) {
      // Continuation of current question
      currentQuestion += ' ' + trimmed;
    }
  }

  // Don't forget the last question
  if (currentQuestion) {
    followUps.push(currentQuestion.trim());
  }

  // Filter out empty and very short responses
  return followUps.filter(q => q.length > 10);
}
