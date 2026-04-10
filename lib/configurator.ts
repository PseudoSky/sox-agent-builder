import { ConfiguratorState, ConversationTurn, AgentSpec, InitialQuestion } from '@/lib/types/agent';
import { INITIAL_QUESTIONS, TOPIC_TO_FIELD } from '@/lib/initial-questions';

/**
 * Configurator State Machine
 * Manages the conversation flow and answer accumulation
 */

export class AgentConfigurator {
  private state: ConfiguratorState;

  constructor(initialState?: Partial<ConfiguratorState>) {
    this.state = {
      step: 0,
      answers: {},
      conversation_history: [],
      partial_spec: {},
      follow_ups_remaining: 2,
      ...initialState
    };
  }

  /**
   * Get the current question (either initial or follow-up)
   */
  getCurrentQuestion(): InitialQuestion | { id: string; topic: string; question: string } | null {
    const questions = INITIAL_QUESTIONS;
    const currentIndex = Math.floor(this.state.step / 3); // 3 interactions per topic: initial + 2 follow-ups

    if (currentIndex >= questions.length) {
      return null; // All initial questions answered
    }

    return questions[currentIndex];
  }

  /**
   * Get initial questions
   */
  getInitialQuestions(): InitialQuestion[] {
    return INITIAL_QUESTIONS;
  }

  /**
   * Check if we're still in follow-up rounds
   */
  isFollowUpPhase(): boolean {
    const topicIndex = Math.floor(this.state.step / 3);
    const stepInTopic = this.state.step % 3;
    return stepInTopic > 0; // Steps 1 and 2 are follow-ups
  }

  /**
   * Record a user answer
   */
  recordAnswer(topic: string, answer: string): void {
    this.state.answers[topic] = answer;
    this.state.conversation_history.push({
      type: 'answer',
      content: answer,
      timestamp: new Date().toISOString(),
      topic
    });
  }

  /**
   * Move to next question
   */
  nextQuestion(): void {
    this.state.step++;
  }

  /**
   * Skip remaining follow-ups for current topic
   */
  skipFollowUps(): void {
    const currentIndex = Math.floor(this.state.step / 3);
    const nextTopicStart = (currentIndex + 1) * 3;
    this.state.step = nextTopicStart;
  }

  /**
   * Check if all initial questions have been answered
   */
  isComplete(): boolean {
    return this.state.step >= INITIAL_QUESTIONS.length * 3;
  }

  /**
   * Get accumulated answers for a topic
   */
  getAnswers(topic?: string): Record<string, unknown> {
    if (topic) {
      return { [topic]: this.state.answers[topic] };
    }
    return this.state.answers;
  }

  /**
   * Build partial spec from current answers
   */
  buildPartialSpec(): Partial<AgentSpec> {
    const spec: Partial<AgentSpec> = {};

    // Map answers to spec fields based on topic
    for (const [topic, answer] of Object.entries(this.state.answers)) {
      const fields = TOPIC_TO_FIELD[topic];
      if (!fields) continue;

      // Handle different answer types
      switch (topic) {
        case 'purpose':
          spec.purpose = answer as string;
          spec.role = (answer as string).split('\n')[0]; // First line as role
          break;

        case 'tasks':
          // Parse as list if contains newlines/commas
          spec.primary_tasks = parseList(answer as string);
          break;

        case 'tools':
          // Will be processed by tool parser
          spec.tools = [];
          break;

        case 'rules':
          spec.hard_rules = parseList(answer as string);
          break;

        case 'workflow':
          // Parse workflow pattern
          const workflowLower = (answer as string).toLowerCase();
          if (workflowLower.includes('parallel')) {
            spec.workflow_pattern = 'parallel';
          } else if (workflowLower.includes('adaptive')) {
            spec.workflow_pattern = 'adaptive';
          } else {
            spec.workflow_pattern = 'sequential';
          }

          // Check for reasoning pattern
          if (workflowLower.includes('react')) {
            spec.reasoning_pattern = 'react';
          } else if (workflowLower.includes('chain')) {
            spec.reasoning_pattern = 'chain-of-thought';
          }
          break;

        case 'output':
          spec.output_format = answer as string;
          break;
      }
    }

    this.state.partial_spec = spec;
    return spec;
  }

  /**
   * Get current state
   */
  getState(): ConfiguratorState {
    return { ...this.state };
  }

  /**
   * Load from saved state
   */
  setState(newState: Partial<ConfiguratorState>): void {
    this.state = { ...this.state, ...newState };
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.state = {
      step: 0,
      answers: {},
      conversation_history: [],
      partial_spec: {},
      follow_ups_remaining: 2
    };
  }

  /**
   * Get progress as percentage
   */
  getProgress(): number {
    const totalSteps = INITIAL_QUESTIONS.length * 3;
    return Math.round((this.state.step / totalSteps) * 100);
  }

  /**
   * Get which topics have been answered
   */
  getAnsweredTopics(): string[] {
    return Object.keys(this.state.answers);
  }
}

/**
 * Helper: Parse a string into a list (handles newlines, commas, bullets)
 */
function parseList(input: string): string[] {
  return input
    .split(/[,\n•-]/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
}
