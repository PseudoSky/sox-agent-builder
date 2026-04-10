'use client';

import { useState, useEffect } from 'react';
import { AgentConfigurator } from '@/lib/configurator';
import { UseConfiguratorReturn } from './hooks/useConfigurator';

interface ConfiguratorProps {
  configurator: UseConfiguratorReturn['configurator'];
  onAnswer: (topic: string, answer: string) => void;
  onNext: () => void;
  onSkip: () => void;
}

export function Configurator({
  configurator,
  onAnswer,
  onNext,
  onSkip
}: ConfiguratorProps) {
  const [userInput, setUserInput] = useState('');
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [loadingFollowUps, setLoadingFollowUps] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string>('');

  const question = configurator.getCurrentQuestion();
  const isComplete = configurator.isComplete();

  // Generate follow-up questions when user submits an answer
  const handleSubmitAnswer = async () => {
    if (!userInput.trim() || !question) return;

    const topic = 'topic' in question ? question.topic : '';
    setCurrentTopic(topic);
    onAnswer(topic, userInput);

    // Generate follow-up questions
    if (configurator.isFollowUpPhase()) {
      setLoadingFollowUps(true);
      try {
        const response = await fetch('/api/claude/generate-followups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic,
            user_answer: userInput,
            current_round: Math.floor(configurator.getState().step / 3),
            previous_answers: configurator.getAnswers()
          })
        });

        if (response.ok) {
          const data = await response.json();
          setFollowUps(data.follow_ups || []);
        }
      } catch (error) {
        console.error('Error generating follow-ups:', error);
        setFollowUps(['Tell me more about your answer...', 'What are the specific requirements?']);
      } finally {
        setLoadingFollowUps(false);
      }
    }

    setUserInput('');
    onNext();
  };

  if (isComplete) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">✅ Configuration Complete!</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your agent specification is ready. Review the preview, validate, and export!
          </p>
          <button
            onClick={() => {
              configurator.reset();
              setUserInput('');
              setFollowUps([]);
            }}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  const questionText = 'question' in question ? question.question : '';
  const hint = 'hint' in question ? question.hint : '';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
          {'topic' in question ? question.topic : 'Question'}
        </h3>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {questionText}
        </h2>
        {hint && (
          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
            💡 {hint}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your answer here..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSubmitAnswer();
            }
          }}
          className="w-full min-h-28 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSubmitAnswer}
            disabled={!userInput.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Submit Answer
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors"
          >
            Skip
          </button>
        </div>
      </div>

      {loadingFollowUps && (
        <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded text-slate-600 dark:text-slate-400 text-sm">
          ⏳ Generating follow-up questions...
        </div>
      )}

      {followUps.length > 0 && !loadingFollowUps && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Follow-up questions:
          </p>
          <ul className="space-y-2">
            {followUps.map((followUp, idx) => (
              <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                {idx + 1}. {followUp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
