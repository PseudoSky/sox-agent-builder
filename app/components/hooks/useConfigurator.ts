'use client';

import { useState, useCallback, useEffect } from 'react';
import { AgentConfigurator } from '@/lib/configurator';
import { PromptBuilder } from '@/lib/prompt-builder';
import { SpecBuilder } from '@/lib/spec-builder';
import { PromptValidator } from '@/lib/validation';
import { AgentSpec, InitialQuestion } from '@/lib/types/agent';
import { ClientPersistence } from '@/lib/persistence';

export interface UseConfiguratorReturn {
  // State
  currentQuestion: InitialQuestion | { id: string; topic: string; question: string } | null;
  answers: Record<string, unknown>;
  progress: number;
  isComplete: boolean;
  partialSpec: Partial<AgentSpec>;
  systemPrompt: string;
  validation: ReturnType<typeof PromptValidator.fullValidation> | null;

  // Actions
  recordAnswer: (topic: string, answer: string) => void;
  nextQuestion: () => void;
  skipFollowUps: () => void;
  reset: () => void;
  saveSpec: (name?: string) => Promise<string | null>;
  loadSpec: (id: string) => void;
  generateSystemPrompt: () => void;
  validateSpec: () => void;
  exportAsYAML: () => string;
  exportAsJSON: () => string;

  // State machine
  configurator: AgentConfigurator;
}

export function useConfigurator(initialSpecId?: string): UseConfiguratorReturn {
  const [configurator] = useState(() => new AgentConfigurator());
  const [partialSpec, setPartialSpec] = useState<Partial<AgentSpec>>({});
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [validation, setValidation] = useState<ReturnType<typeof PromptValidator.fullValidation> | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InitialQuestion | { id: string; topic: string; question: string } | null>(null);

  // Initialize
  useEffect(() => {
    const question = configurator.getCurrentQuestion();
    setCurrentQuestion(question);

    // If we have an initial spec ID, load it
    if (initialSpecId) {
      loadSpec(initialSpecId);
    }
  }, []);

  const recordAnswer = useCallback((topic: string, answer: string) => {
    configurator.recordAnswer(topic, answer);

    // Regenerate prompt and spec
    const updated = configurator.buildPartialSpec();
    setPartialSpec(updated);
    generateSystemPrompt();
  }, []);

  const nextQuestion = useCallback(() => {
    configurator.nextQuestion();
    const question = configurator.getCurrentQuestion();
    setCurrentQuestion(question);
  }, []);

  const skipFollowUps = useCallback(() => {
    configurator.skipFollowUps();
    const question = configurator.getCurrentQuestion();
    setCurrentQuestion(question);
  }, []);

  const reset = useCallback(() => {
    configurator.reset();
    setPartialSpec({});
    setSystemPrompt('');
    setValidation(null);
    const question = configurator.getCurrentQuestion();
    setCurrentQuestion(question);
  }, []);

  const generateSystemPrompt = useCallback(() => {
    const prompt = PromptBuilder.buildSystemPrompt(partialSpec);
    setSystemPrompt(prompt);

    // Auto-validate after generating prompt
    validateSpec();
  }, [partialSpec]);

  const validateSpec = useCallback(() => {
    const specWithPrompt = { ...partialSpec, system_prompt: systemPrompt };
    const result = PromptValidator.fullValidation(specWithPrompt);
    setValidation(result);
  }, [partialSpec, systemPrompt]);

  const saveSpec = useCallback(async (name?: string): Promise<string | null> => {
    const spec = SpecBuilder.createSpec({
      ...partialSpec,
      system_prompt: systemPrompt,
      name: name || partialSpec.name || 'Unnamed Agent'
    });

    try {
      ClientPersistence.saveSpec(spec);
      return spec.id || null;
    } catch (error) {
      console.error('Failed to save spec:', error);
      return null;
    }
  }, [partialSpec, systemPrompt]);

  const loadSpec = useCallback((id: string) => {
    const spec = ClientPersistence.loadSpec(id);
    if (spec) {
      setPartialSpec(spec);
      if (spec.system_prompt) {
        setSystemPrompt(spec.system_prompt);
      }
      generateSystemPrompt();
    }
  }, []);

  const exportAsYAML = useCallback((): string => {
    const spec = SpecBuilder.createSpec({
      ...partialSpec,
      system_prompt: systemPrompt
    });
    return SpecBuilder.toYAML(spec);
  }, [partialSpec, systemPrompt]);

  const exportAsJSON = useCallback((): string => {
    const spec = SpecBuilder.createSpec({
      ...partialSpec,
      system_prompt: systemPrompt
    });
    return SpecBuilder.toJSON(spec);
  }, [partialSpec, systemPrompt]);

  return {
    currentQuestion,
    answers: configurator.getAnswers(),
    progress: configurator.getProgress(),
    isComplete: configurator.isComplete(),
    partialSpec,
    systemPrompt,
    validation,
    recordAnswer,
    nextQuestion,
    skipFollowUps,
    reset,
    saveSpec,
    loadSpec,
    generateSystemPrompt,
    validateSpec,
    exportAsYAML,
    exportAsJSON,
    configurator
  };
}
