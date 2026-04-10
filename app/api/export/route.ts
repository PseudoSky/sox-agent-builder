import { NextRequest, NextResponse } from 'next/server';
import { SpecBuilder } from '@/lib/spec-builder';
import { AgentSpec } from '@/lib/types/agent';

interface ExportRequest {
  spec: Partial<AgentSpec>;
  format: 'yaml' | 'json';
}

/**
 * POST /api/export - Export a spec to YAML or JSON
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as ExportRequest;
    const { spec, format } = body;

    if (!spec || !format) {
      return NextResponse.json(
        { error: 'Missing required fields: spec, format' },
        { status: 400 }
      );
    }

    // Validate format
    if (format !== 'yaml' && format !== 'json') {
      return NextResponse.json(
        { error: 'Invalid format. Must be "yaml" or "json"' },
        { status: 400 }
      );
    }

    // Create complete spec
    const completeSpec = SpecBuilder.createSpec(spec);

    // Export in requested format
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'yaml') {
      content = SpecBuilder.toYAML(completeSpec);
      mimeType = 'text/yaml';
      filename = `${completeSpec.name.replace(/\s+/g, '-').toLowerCase()}.yaml`;
    } else {
      content = SpecBuilder.toJSON(completeSpec);
      mimeType = 'application/json';
      filename = `${completeSpec.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    }

    // Return the content
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      }
    });

  } catch (error) {
    console.error('Error exporting spec:', error);
    return NextResponse.json(
      { error: 'Failed to export specification' },
      { status: 500 }
    );
  }
}
