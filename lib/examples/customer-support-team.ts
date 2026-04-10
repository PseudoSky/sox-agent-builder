/**
 * Example: Customer Support Team
 *
 * This demonstrates a 3-agent team that handles support requests:
 * 1. Intake Agent - Analyzes and categorizes incoming requests
 * 2. Specialist Agent - Handles the specific issue
 * 3. QA Agent - Validates the response before sending to customer
 */

import {
  TeamComposition,
  TeamWorkflow,
  AgentRole,
  TeamSpec,
  Specialization,
} from '../types/team';

/**
 * Define the agents in the team
 */
export const supportTeamAgents: AgentRole[] = [
  {
    id: 'intake-agent',
    name: 'Support Intake Specialist',
    description: 'Analyzes customer requests and routes to appropriate specialist',
    specializations: [
      {
        domain: 'triage',
        proficiency: 'expert',
        description: 'Quickly categorize issues by type and urgency',
      },
      {
        domain: 'classification',
        proficiency: 'advanced',
        description: 'Determine issue category and priority',
      },
    ],
    responsibilities: [
      'Analyze incoming support requests',
      'Extract key information from customer message',
      'Categorize issue type (technical, billing, general)',
      'Determine priority level',
      'Route to appropriate specialist',
    ],
    tools_available: [
      {
        name: 'customer-database',
        description: 'Look up customer history and profile',
        when_to_use: 'When you need context about the customer',
      },
      {
        name: 'knowledge-base',
        description: 'Search company documentation and FAQs',
        when_to_use: 'When answering common questions',
      },
    ],
    knowledge_access: {
      shared_knowledge_base: true,
      conversation_history: true,
      entity_memory: true,
      decision_logs: true,
    },
    constraints: {
      max_context_tokens: 2000,
      max_responses_per_hour: 1000,
      parallel_tasks: 5,
    },
  },

  {
    id: 'technical-agent',
    name: 'Technical Support Specialist',
    description: 'Resolves technical issues',
    specializations: [
      {
        domain: 'debugging',
        proficiency: 'expert',
        description: 'Diagnose and solve technical problems',
      },
      {
        domain: 'documentation',
        proficiency: 'advanced',
        description: 'Reference technical documentation',
      },
    ],
    responsibilities: [
      'Diagnose technical issues',
      'Provide step-by-step solutions',
      'Reference documentation and guides',
      'Escalate if beyond scope',
    ],
    tools_available: [
      {
        name: 'knowledge-base',
        description: 'Search technical documentation',
        when_to_use: 'To reference guides and troubleshooting steps',
      },
      {
        name: 'system-logs',
        description: 'Access customer system logs',
        when_to_use: 'When diagnosing technical issues',
      },
    ],
    knowledge_access: {
      shared_knowledge_base: true,
      conversation_history: true,
      entity_memory: true,
      decision_logs: true,
    },
    constraints: {
      max_context_tokens: 3000,
      max_responses_per_hour: 100,
      parallel_tasks: 3,
    },
  },

  {
    id: 'billing-agent',
    name: 'Billing Support Specialist',
    description: 'Handles billing and account questions',
    specializations: [
      {
        domain: 'billing',
        proficiency: 'expert',
        description: 'Handle invoices, payments, subscriptions',
      },
      {
        domain: 'refunds',
        proficiency: 'advanced',
        description: 'Process refunds and adjustments',
      },
    ],
    responsibilities: [
      'Answer billing questions',
      'Process refunds and credits',
      'Update account information',
      'Handle subscription changes',
    ],
    tools_available: [
      {
        name: 'billing-system',
        description: 'Access billing and account data',
        when_to_use: 'To view invoices and manage accounts',
      },
      {
        name: 'refund-processor',
        description: 'Issue refunds and credits',
        when_to_use: 'To process refunds or apply credits',
      },
    ],
    knowledge_access: {
      shared_knowledge_base: true,
      conversation_history: true,
      entity_memory: true,
      decision_logs: true,
    },
    constraints: {
      max_context_tokens: 2000,
      max_responses_per_hour: 200,
      parallel_tasks: 5,
    },
  },

  {
    id: 'qa-agent',
    name: 'Quality Assurance Specialist',
    description: 'Validates responses before sending to customers',
    specializations: [
      {
        domain: 'quality-assurance',
        proficiency: 'expert',
        description: 'Review and validate responses',
      },
      {
        domain: 'consistency',
        proficiency: 'advanced',
        description: 'Ensure team consistency',
      },
    ],
    responsibilities: [
      'Review responses for quality',
      'Check accuracy and completeness',
      'Ensure professional tone',
      'Identify areas for improvement',
    ],
    tools_available: [
      {
        name: 'knowledge-base',
        description: 'Reference for validation',
        when_to_use: 'To validate technical accuracy',
      },
    ],
    knowledge_access: {
      shared_knowledge_base: true,
      conversation_history: true,
      entity_memory: true,
      decision_logs: true,
    },
    constraints: {
      max_context_tokens: 2000,
      max_responses_per_hour: 500,
      parallel_tasks: 10,
    },
  },
];

/**
 * Define the team composition
 */
export const supportTeamComposition: TeamComposition = {
  id: 'support-team-v1',
  name: 'Customer Support Team',
  purpose: 'Handle customer support requests 24/7 with specialization',

  agents: supportTeamAgents,

  team_structure: {
    type: 'hierarchical',
    manager_agent: 'intake-agent',
    decision_authority: {
      'intake-agent': ['routing', 'triage'],
      'technical-agent': ['technical-decisions'],
      'billing-agent': ['billing-decisions', 'refunds'],
      'qa-agent': ['quality-validation'],
    },
  },

  team_size_range: { min: 3, max: 5 },
  essential_roles: ['intake-agent', 'technical-agent', 'billing-agent', 'qa-agent'],

  expected_metrics: {
    task_completion_rate: 0.95,
    average_response_time: 30,
    cost_per_interaction: 0.008,
    quality_score: 95,
  },
};

/**
 * Define the workflow that the team executes
 */
export const supportTeamWorkflow: TeamWorkflow = {
  id: 'support-workflow-v1',
  name: 'Support Request Handling',

  trigger: {
    type: 'user-request',
    config: { endpoint: '/api/support' },
  },

  steps: [
    {
      id: 'step-intake',
      name: 'Intake & Categorization',
      type: 'agent-task',
      assigned_to: ['intake-agent'],
      inputs: ['user_input'],
      outputs: ['category', 'priority', 'summary'],
      task_description:
        'Analyze the customer support request and categorize it by type (technical, billing, or general)',
      success_criteria:
        'Issue is clearly categorized and priority is assigned',
      timeout_seconds: 30,
      max_retries: 2,
      on_failure: 'escalate',
    },

    {
      id: 'step-route',
      name: 'Route to Specialist',
      type: 'decision',
      assigned_to: [],
      inputs: ['category'],
      outputs: [],
      task_description: 'Route to appropriate specialist based on category',
      success_criteria: 'Correct agent is selected',
      timeout_seconds: 5,
      max_retries: 0,
      on_failure: 'escalate',
      condition: {
        field: 'category',
        type: 'equals',
        value: 'technical',
        branches: {
          technical: 'step-technical-handler',
          billing: 'step-billing-handler',
          general: 'step-general-handler',
        },
      },
    },

    {
      id: 'step-technical-handler',
      name: 'Technical Issue Resolution',
      type: 'agent-task',
      assigned_to: ['technical-agent'],
      inputs: ['summary', 'category'],
      outputs: ['solution'],
      task_description:
        'Resolve the technical issue and provide clear step-by-step guidance',
      success_criteria:
        'Provide actionable technical solution with clear steps',
      timeout_seconds: 60,
      fallback_agent: 'intake-agent',
      max_retries: 1,
      on_failure: 'escalate',
    },

    {
      id: 'step-billing-handler',
      name: 'Billing Issue Resolution',
      type: 'agent-task',
      assigned_to: ['billing-agent'],
      inputs: ['summary', 'category'],
      outputs: ['solution'],
      task_description:
        'Handle the billing question or process the requested adjustment',
      success_criteria: 'Clear answer provided or action taken',
      timeout_seconds: 45,
      fallback_agent: 'intake-agent',
      max_retries: 1,
      on_failure: 'escalate',
    },

    {
      id: 'step-general-handler',
      name: 'General Question Resolution',
      type: 'agent-task',
      assigned_to: ['technical-agent'],
      inputs: ['summary', 'category'],
      outputs: ['solution'],
      task_description: 'Answer the general question using available resources',
      success_criteria: 'Provide helpful and accurate answer',
      timeout_seconds: 45,
      fallback_agent: 'intake-agent',
      max_retries: 1,
      on_failure: 'escalate',
    },

    {
      id: 'step-qa-validation',
      name: 'Quality Assurance Review',
      type: 'quality-gate',
      assigned_to: ['qa-agent'],
      inputs: ['solution'],
      outputs: ['final_response'],
      task_description: 'Review the response for quality and accuracy',
      success_criteria:
        'Response is professional, accurate, and complete. Addresses all customer concerns.',
      timeout_seconds: 30,
      max_retries: 1,
      on_failure: 'escalate',
    },
  ],

  shared_context: {
    shared_fields: ['user_input', 'category', 'priority', 'summary', 'solution', 'final_response'],
    context_propagation: 'selective',
    max_context_size: 4000,
    entity_tracking: [
      {
        entity_type: 'customer',
        fields: ['id', 'name', 'account_type', 'history'],
        persistence: 'permanent',
      },
      {
        entity_type: 'issue',
        fields: ['category', 'priority', 'status'],
        persistence: 'session',
      },
    ],
  },

  quality_gates: [
    {
      step_id: 'step-qa-validation',
      validation_agent: 'qa-agent',
      criteria: [
        'Response is professional and courteous',
        'All customer concerns are addressed',
        'Technical accuracy verified',
        'Action items clearly stated',
      ],
      on_failure: 'loop-back',
    },
  ],

  escalation_policy: {
    conditions: [
      'Task cannot be completed by assigned agent',
      'Multiple failed attempts',
      'Complex issue requiring human judgment',
      'Customer escalation requested',
    ],
    escalate_to: 'human',
    max_escalations: 3,
  },

  sla: {
    max_total_time: 120, // 2 minutes total
    max_per_step: 60, // 1 minute per step
  },
};

/**
 * Complete team specification
 */
export const supportTeamSpec: TeamSpec = {
  id: 'support-team-spec-v1',
  name: 'Customer Support Team Specification',
  description: 'A 3-4 agent team that replaces a human support department',
  version: '2.0',
  is_team: true,
  is_individual_agent: false,

  role: 'Support Team',
  purpose: 'Provide comprehensive customer support across technical, billing, and general inquiries',
  expertise_domains: ['customer-support', 'technical-issues', 'billing', 'general-help'],

  primary_tasks: [
    'Handle incoming support requests',
    'Categorize and triage issues',
    'Provide solutions or escalate appropriately',
    'Maintain high quality and customer satisfaction',
  ],

  tools: supportTeamAgents.flatMap(a => a.tools_available),

  hard_rules: [
    'Always be professional and courteous',
    'Verify solutions before providing',
    'Escalate when uncertain',
    'Document all interactions',
  ],

  workflow_pattern: 'sequential',
  reasoning_pattern: 'react',
  output_format: 'Structured response with clear action items',

  tags: ['support', 'multi-agent', 'team-v2', 'customer-service'],
  parent_team: undefined,

  team_config: {
    composition: supportTeamComposition,
    communication: [
      {
        from_agent: 'intake-agent',
        to_agent: 'technical-agent',
        protocol: 'request-response',
        message_types: [
          {
            type: 'route-technical-issue',
            schema: { summary: 'string', priority: 'string' },
          },
        ],
        frequency: 'on-demand',
      },
      {
        from_agent: 'intake-agent',
        to_agent: 'billing-agent',
        protocol: 'request-response',
        message_types: [
          {
            type: 'route-billing-issue',
            schema: { summary: 'string', priority: 'string' },
          },
        ],
        frequency: 'on-demand',
      },
      {
        from_agent: 'technical-agent',
        to_agent: 'qa-agent',
        protocol: 'request-response',
        message_types: [
          {
            type: 'validate-response',
            schema: { response: 'string' },
          },
        ],
        frequency: 'on-demand',
      },
      {
        from_agent: 'billing-agent',
        to_agent: 'qa-agent',
        protocol: 'request-response',
        message_types: [
          {
            type: 'validate-response',
            schema: { response: 'string' },
          },
        ],
        frequency: 'on-demand',
      },
    ],
    workflows: [supportTeamWorkflow],
    shared_context: {
      knowledge_base: {
        type: 'vector-db',
        contents: [
          'Product documentation',
          'FAQ database',
          'Troubleshooting guides',
          'Billing policies',
        ],
      },
      conversation_history: {
        retention_days: 90,
        accessibility: 'all-agents',
      },
      entity_memory: {
        enabled: true,
        storage_backend: 'memory',
        ttl_days: 30,
      },
      decision_logs: {
        enabled: true,
        what_to_track: ['routing_decision', 'resolution_type', 'escalation_reason'],
      },
    },
    escalation_policy: {
      conditions: ['unresolvable_issue', 'customer_request', 'repeated_failure'],
      escalate_to: 'human',
      sla_minutes: 15,
    },
    observability: {
      log_all_interactions: true,
      track_agent_metrics: true,
      trace_decisions: true,
    },
  },
};
