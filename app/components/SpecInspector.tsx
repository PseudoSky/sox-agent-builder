'use client';

import { AgentSpec } from '@/lib/types/agent';
import { SpecBuilder } from '@/lib/spec-builder';

interface SpecInspectorProps {
  spec: Partial<AgentSpec>;
}

export function SpecInspector({ spec }: SpecInspectorProps) {
  if (!spec || Object.keys(spec).length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          Spec structure will appear here as you answer questions...
        </p>
      </div>
    );
  }

  const yamlOutput = SpecBuilder.toYAML(SpecBuilder.createSpec(spec));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Specification (YAML Format)
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This is your agent specification in declarative YAML format. Can be exported and used with any framework.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 overflow-auto max-h-96 border border-slate-200 dark:border-slate-700">
        <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono break-words">
          {yamlOutput}
        </pre>
      </div>

      <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>💾 Copy and save as .yaml file</span>
        <span>•</span>
        <span>🔄 JSON format also available in export</span>
      </div>
    </div>
  );
}
