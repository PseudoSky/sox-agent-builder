import { NextRequest, NextResponse } from 'next/server';
import { ServerPersistence } from '@/lib/persistence';
import { SpecBuilder } from '@/lib/spec-builder';
import { AgentSpec } from '@/lib/types/agent';

/**
 * GET /api/specs/[id] - Load a specific spec
 */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!ServerPersistence.exists(id)) {
      return NextResponse.json(
        { error: 'Specification not found' },
        { status: 404 }
      );
    }

    const spec = ServerPersistence.loadSpec(id);
    if (!spec) {
      return NextResponse.json(
        { error: 'Failed to load specification' },
        { status: 500 }
      );
    }

    return NextResponse.json({ spec });

  } catch (error) {
    console.error('Error loading spec:', error);
    return NextResponse.json(
      { error: 'Failed to load specification' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/specs/[id] - Update a spec
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const body = await request.json() as Partial<AgentSpec>;

    // Check if spec exists
    if (!ServerPersistence.exists(id)) {
      return NextResponse.json(
        { error: 'Specification not found' },
        { status: 404 }
      );
    }

    // Validate
    const validation = SpecBuilder.validate(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid specification', details: validation.errors },
        { status: 400 }
      );
    }

    // Load existing spec and merge
    const existing = ServerPersistence.loadSpec(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Failed to load specification' },
        { status: 500 }
      );
    }

    const updated = SpecBuilder.createSpec(
      { ...existing, ...body },
      { id, updated_at: new Date().toISOString() }
    );

    ServerPersistence.saveSpec(updated);

    return NextResponse.json({
      success: true,
      spec: updated
    });

  } catch (error) {
    console.error('Error updating spec:', error);
    return NextResponse.json(
      { error: 'Failed to update specification' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/specs/[id] - Delete a spec
 */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!ServerPersistence.exists(id)) {
      return NextResponse.json(
        { error: 'Specification not found' },
        { status: 404 }
      );
    }

    const success = ServerPersistence.deleteSpec(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete specification' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting spec:', error);
    return NextResponse.json(
      { error: 'Failed to delete specification' },
      { status: 500 }
    );
  }
}
