import { InitialQuestion } from '@/lib/types/agent';

/**
 * Initial 6 questions that guide agent spec building
 * Each topic will have Claude-generated follow-up questions
 */

export const INITIAL_QUESTIONS: InitialQuestion[] = [
  {
    id: 'purpose',
    topic: 'Purpose & Role',
    question: 'What is the primary purpose of this agent? What type of work does it do?',
    hint: 'e.g., customer support, data analysis, content creation, research assistant',
    follow_up_template: 'Based on {{answer}}, I have a follow-up question...'
  },
  {
    id: 'tasks',
    topic: 'Tasks & Responsibilities',
    question: 'What are the specific tasks or responsibilities this agent should perform?',
    hint: 'e.g., answering questions, processing requests, generating reports',
    follow_up_template: 'To better understand {{answer}}, could you clarify...'
  },
  {
    id: 'tools',
    topic: 'Tools & Integrations',
    question: 'What tools, APIs, or integrations might this agent need access to?',
    hint: 'e.g., database queries, external APIs, file systems, web search',
    follow_up_template: 'Regarding {{answer}}, I\'d like to know more about...'
  },
  {
    id: 'rules',
    topic: 'Rules & Constraints',
    question: 'What rules, constraints, or safety boundaries should this agent follow?',
    hint: 'e.g., data privacy, budget limits, content policies, ethical guidelines',
    follow_up_template: 'For {{answer}}, could you elaborate on...'
  },
  {
    id: 'workflow',
    topic: 'Workflow & Patterns',
    question: 'How should this agent approach problem-solving? Should it reason step-by-step?',
    hint: 'e.g., ReAct (Thought→Action→Observation), chain-of-thought, direct execution',
    follow_up_template: 'For the {{answer}} approach, I\'d like to understand...'
  },
  {
    id: 'output',
    topic: 'Output Format',
    question: 'How should this agent structure and format its output or responses?',
    hint: 'e.g., JSON, markdown, plain text, structured format with sections',
    follow_up_template: 'Regarding {{answer}}, could you specify...'
  }
];

/**
 * Map topics to spec fields
 */
export const TOPIC_TO_FIELD: Record<string, string[]> = {
  purpose: ['role', 'purpose', 'expertise_domains'],
  tasks: ['primary_tasks', 'success_criteria'],
  tools: ['tools'],
  rules: ['hard_rules', 'soft_guidelines', 'safety_boundaries'],
  workflow: ['workflow_pattern', 'reasoning_pattern'],
  output: ['output_format', 'response_structure']
};
