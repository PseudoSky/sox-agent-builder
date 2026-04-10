import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-blue-400">⚙️</span>
            Agent Spec Builder
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Introduction */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Build Perfect Agent Specs
            </h2>
            <p className="text-xl text-slate-300">
              Interactive, AI-guided agent specification builder. Get intelligent
              follow-up questions, real-time system prompt synthesis, and automatic
              validation.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <h3 className="font-semibold">AI-Guided Questions</h3>
                  <p className="text-slate-400">Claude asks intelligent follow-ups to refine your spec</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🔄</span>
                <div>
                  <h3 className="font-semibold">Live Preview</h3>
                  <p className="text-slate-400">See your system prompt update in real-time</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-semibold">Smart Validation</h3>
                  <p className="text-slate-400">Ensure tools are actually used in your prompt</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">💾</span>
                <div>
                  <h3 className="font-semibold">Save & Export</h3>
                  <p className="text-slate-400">YAML and JSON export for any framework</p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <Link
                href="/builder"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Start Building →
              </Link>
              <Link
                href="#specs"
                className="border border-slate-600 hover:bg-slate-700/50 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                View Specs
              </Link>
            </div>
          </div>

          {/* Right side - Feature highlight */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">How It Works</h3>
            <ol className="space-y-4 text-slate-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</span>
                <span>Answer 6 initial questions about your agent's purpose, tasks, and requirements</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</span>
                <span>Claude generates 2-3 smart follow-up questions per topic to refine details</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</span>
                <span>Watch your system prompt build in real-time with XML-structured sections</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">4</span>
                <span>Validate that tools are actually mentioned and used in your prompt</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">5</span>
                <span>Export as YAML or JSON and use with any framework</span>
              </li>
            </ol>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-400 text-sm">
          <p>Agent Spec Builder - Framework-agnostic, spec-first agent configuration</p>
        </div>
      </footer>
    </div>
  );
}
