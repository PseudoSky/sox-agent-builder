import { NextRequest, NextResponse } from 'next/server';
import { PromptValidator } from '@/lib/validation';
import { AgentSpec } from '@/lib/types/agent';

/**
 * POST /api/validate - Validate a spec for quality and completeness
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as Partial<AgentSpec>;

    // Run full validation
    const validation = PromptValidator.fullValidation(body);

    return NextResponse.json({
      success: true,
      validation
    });

  } catch (error) {
    console.error('Error validating spec:', error);
    return NextResponse.json(
      { error: 'Failed to validate specification' },
      { status: 500 }
    );
  }
}
