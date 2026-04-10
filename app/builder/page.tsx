'use client';

import { useConfigurator } from '@/app/components/hooks/useConfigurator';
import { Configurator } from '@/app/components/Configurator';
import { Preview } from '@/app/components/Preview';
import { SpecInspector } from '@/app/components/SpecInspector';
import { ValidationResults } from '@/app/components/ValidationResults';
import { useState } from 'react';

type ViewMode = 'question' | 'preview' | 'spec' | 'validation';

export default function BuilderPage() {
  const configurator = useConfigurator();
  const [viewMode, setViewMode] = useState<ViewMode>('question');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleSaveSpec = async () => {
    const specName = configurator.partialSpec.name || 'My Agent';
    const id = await configurator.saveSpec(specName);
    if (id) {
      alert(`Spec saved with ID: ${id}`);
    }
  };

  const handleExport = (format: 'yaml' | 'json') => {
    const content = format === 'yaml' ? configurator.exportAsYAML() : configurator.exportAsJSON();
    const specName = (configurator.partialSpec.name || 'agent').replace(/\s+/g, '-').toLowerCase();
    const filename = `${specName}.${format}`;

    // Download file
    const blob = new Blob([content], { type: format === 'yaml' ? 'text/yaml' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Spec Builder</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Progress: {configurator.progress}%
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveSpec}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                💾 Save Spec
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors"
                >
                  ⬇️ Export
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleExport('yaml')}
                      className="block w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-lg"
                    >
                      Export as YAML
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="block w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 last:rounded-b-lg"
                    >
                      Export as JSON
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Configurator */}
          <div className="lg:col-span-1">
            <Configurator
              configurator={configurator.configurator}
              onAnswer={configurator.recordAnswer}
              onNext={configurator.nextQuestion}
              onSkip={configurator.skipFollowUps}
            />
          </div>

          {/* Right Column - Preview and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Tabs */}
            <div className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex-1 py-2 px-3 rounded transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                📝 Preview
              </button>
              <button
                onClick={() => setViewMode('spec')}
                className={`flex-1 py-2 px-3 rounded transition-colors ${
                  viewMode === 'spec'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                ⚙️ Spec
              </button>
              <button
                onClick={() => setViewMode('validation')}
                className={`flex-1 py-2 px-3 rounded transition-colors ${
                  viewMode === 'validation'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                ✅ Validation
              </button>
            </div>

            {/* Content Area */}
            {viewMode === 'preview' && <Preview prompt={configurator.systemPrompt} />}
            {viewMode === 'spec' && <SpecInspector spec={configurator.partialSpec} />}
            {viewMode === 'validation' && configurator.validation && (
              <ValidationResults validation={configurator.validation} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
