'use client';

interface PreviewProps {
  prompt: string;
}

export function Preview({ prompt }: PreviewProps) {
  if (!prompt) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          Your system prompt will appear here as you answer questions...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          System Prompt Preview
        </h3>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 overflow-auto max-h-96 border border-slate-200 dark:border-slate-700">
          <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono break-words">
            {prompt}
          </pre>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Preview updates automatically as you answer questions.
          XML tags organize prompt into semantic sections.
        </div>
      </div>
    </div>
  );
}
