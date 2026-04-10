import { NextRequest, NextResponse } from 'next/server';
import { FollowUpGeneratorFactory, type FollowUpRequest, type FollowUpResponse } from '@/lib/followup-generator';

/**
 * Generate follow-up questions based on user's answer
 * Supports both Anthropic API and Claude CLI backends
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

    // Get the appropriate generator based on environment config
    const config = FollowUpGeneratorFactory.getConfigFromEnv();
    const generator = FollowUpGeneratorFactory.create(config);

    // Generate follow-ups
    const result = await generator.generate({
      topic,
      user_answer,
      current_round,
      previous_answers
    });

    return NextResponse.json(result as FollowUpResponse);

  } catch (error) {
    console.error('Error generating follow-ups:', error);

    // Check for API key issue
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Claude API key not configured. Please set ANTHROPIC_API_KEY.' },
        { status: 500 }
      );
    }

    if (error instanceof Error && error.message.includes('CLI')) {
      return NextResponse.json(
        { error: 'Claude CLI not available and API not configured.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate follow-up questions' },
      { status: 500 }
    );
  }
}
