'use client';

import { PromptValidator } from '@/lib/validation';

interface ValidationResultsProps {
  validation: ReturnType<typeof PromptValidator.fullValidation>;
}

export function ValidationResults({ validation }: ValidationResultsProps) {
  if (!validation) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          Validation results will appear here...
        </p>
      </div>
    );
  }

  const scoreColor = validation.overallScore >= 80 ? 'text-green-600' : validation.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600';
  const scoreLabel = validation.overallScore >= 80 ? '✅ Excellent' : validation.overallScore >= 60 ? '⚠️ Good' : '❌ Needs Work';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-6">
      {/* Overall Score */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Overall Quality Score</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Based on alignment, completeness, and best practices</p>
        </div>
        <div className="text-right">
          <p className={`text-4xl font-bold ${scoreColor}`}>
            {validation.overallScore}
          </p>
          <p className={`text-sm font-semibold ${scoreColor}`}>
            {scoreLabel}
          </p>
        </div>
      </div>

      {/* Tool Alignment Issues */}
      {validation.alignment.toolAlignmentIssues.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">Tool Alignment Issues</h4>
          <div className="space-y-2">
            {validation.alignment.toolAlignmentIssues.map((issue, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  issue.severity === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                }`}
              >
                <p className={`font-semibold ${issue.severity === 'error' ? 'text-red-900 dark:text-red-300' : 'text-yellow-900 dark:text-yellow-300'}`}>
                  {issue.toolName}: {issue.message}
                </p>
                {issue.suggestion && (
                  <p className={`text-sm mt-1 ${issue.severity === 'error' ? 'text-red-800 dark:text-red-400' : 'text-yellow-800 dark:text-yellow-400'}`}>
                    💡 {issue.suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completeness */}
      {validation.completeness.missingFields.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">Missing Fields</h4>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <ul className="space-y-1 text-sm text-amber-900 dark:text-amber-300">
              {validation.completeness.missingFields.map((field, idx) => (
                <li key={idx}>• {field}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {validation.suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">Suggestions for Improvement</h4>
          <div className="space-y-2">
            {validation.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                <span className="flex-shrink-0">💡</span>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {validation.alignment.toolAlignmentIssues.length === 0 &&
        validation.completeness.missingFields.length === 0 &&
        validation.suggestions.length === 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
          <p className="font-semibold text-green-900 dark:text-green-300">
            ✅ Perfect! Your agent spec is ready to use.
          </p>
        </div>
      )}
    </div>
  );
}
