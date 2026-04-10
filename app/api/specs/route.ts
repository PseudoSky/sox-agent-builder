import { NextRequest, NextResponse } from 'next/server';
import { ServerPersistence } from '@/lib/persistence';
import { SpecBuilder } from '@/lib/spec-builder';
import { AgentSpec } from '@/lib/types/agent';

/**
 * GET /api/specs - List all saved specs
 */
export async function GET(): Promise<NextResponse> {
  try {
    const specs = ServerPersistence.getSpecsSummary();
    return NextResponse.json({ specs });
  } catch (error) {
    console.error('Error listing specs:', error);
    return NextResponse.json(
      { error: 'Failed to list specifications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/specs - Save a new spec or update existing
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as Partial<AgentSpec>;

    // Validate spec
    const validation = SpecBuilder.validate(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid specification', details: validation.errors },
        { status: 400 }
      );
    }

    // Create complete spec
    const spec = SpecBuilder.createSpec(body);

    // Save
    ServerPersistence.saveSpec(spec);

    return NextResponse.json({
      success: true,
      spec: {
        id: spec.id,
        name: spec.name,
        created_at: spec.created_at
      }
    });

  } catch (error) {
    console.error('Error saving spec:', error);
    return NextResponse.json(
      { error: 'Failed to save specification' },
      { status: 500 }
    );
  }
}
