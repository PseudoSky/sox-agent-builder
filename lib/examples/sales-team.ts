/**
 * Example: Sales Team
 * AI team for lead generation, qualification, and deal management
 */

import { TeamSpec } from '../types/team';

export const salesTeamSpec: TeamSpec = {
  id: 'sales-team-v1',
  name: 'Sales Team',
  description: 'AI team for lead generation, qualification, and deal management',
  version: '2.0',
  is_team: true,
  is_individual_agent: false,

  role: 'Sales Team',
  purpose:
    'Automate lead generation, qualification, and deal management to increase revenue',
  expertise_domains: ['lead-generation', 'sales', 'qualification', 'negotiation'],

  primary_tasks: [
    'Generate and identify sales leads',
    'Qualify leads based on criteria',
    'Manage customer relationships',
    'Close deals and manage contracts',
  ],

  tools: [
    {
      name: 'lead-database',
      description: 'Access and search lead information',
      when_to_use: 'To find and research potential customers',
    },
    {
      name: 'crm-system',
      description: 'Manage customer relationships and deals',
      when_to_use: 'To track sales activity and customer info',
    },
    {
      name: 'email-outreach',
      description: 'Send personalized emails to prospects',
      when_to_use: 'To contact qualified leads',
    },
    {
      name: 'contract-generator',
      description: 'Generate and manage contracts',
      when_to_use: 'To create deals for closing',
    },
  ],

  hard_rules: [
    'Always qualify leads before outreach',
    'Personalize all customer communications',
    'Never make promises you cannot deliver',
    'Follow all compliance and legal requirements',
  ],

  workflow_pattern: 'sequential',
  reasoning_pattern: 'react',
  output_format: 'Lead report, qualification summary, or deal status',

  tags: ['sales', 'leads', 'crm', 'team-v2'],

  team_config: {
    composition: {
      id: 'sales-composition',
      name: 'Sales Team',
      purpose: 'Increase revenue through automation',
      agents: [
        {
          id: 'lead-gen-agent',
          name: 'Lead Generation Specialist',
          description: 'Identifies and generates sales leads',
          specializations: [
            {
              domain: 'lead-generation',
              proficiency: 'expert',
              description: 'Find and identify potential customers',
            },
            {
              domain: 'market-research',
              proficiency: 'advanced',
              description: 'Research market and competitor data',
            },
          ],
          responsibilities: [
            'Search for potential customers',
            'Research lead information',
            'Score lead quality',
            'Pass qualified leads to SDR',
          ],
          tools_available: [
            {
              name: 'lead-database',
              description: 'Search for leads',
              when_to_use: 'To find potential customers',
            },
            {
              name: 'web-scraper',
              description: 'Gather public company information',
              when_to_use: 'To research potential customers',
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
            parallel_tasks: 10,
          },
        },
        {
          id: 'sdr-agent',
          name: 'Sales Development Rep',
          description: 'Qualifies leads and books meetings',
          specializations: [
            {
              domain: 'qualification',
              proficiency: 'expert',
              description: 'Qualify leads based on fit',
            },
            {
              domain: 'outreach',
              proficiency: 'advanced',
              description: 'Engage prospects via email/calls',
            },
          ],
          responsibilities: [
            'Qualify inbound leads',
            'Conduct discovery calls',
            'Book meetings with AE',
            'Update CRM with lead status',
          ],
          tools_available: [
            {
              name: 'crm-system',
              description: 'Manage lead info',
              when_to_use: 'To track qualification progress',
            },
            {
              name: 'email-outreach',
              description: 'Send outreach emails',
              when_to_use: 'To contact prospects',
            },
          ],
          knowledge_access: {
            shared_knowledge_base: true,
            conversation_history: true,
            entity_memory: true,
            decision_logs: true,
          },
          constraints: {
            max_context_tokens: 2500,
            max_responses_per_hour: 100,
            parallel_tasks: 5,
          },
        },
        {
          id: 'ae-agent',
          name: 'Account Executive',
          description: 'Manages customer relationships and closes deals',
          specializations: [
            {
              domain: 'negotiation',
              proficiency: 'expert',
              description: 'Negotiate and close deals',
            },
            {
              domain: 'relationship-management',
              proficiency: 'advanced',
              description: 'Build customer relationships',
            },
          ],
          responsibilities: [
            'Conduct sales demos',
            'Negotiate terms',
            'Close deals',
            'Build customer relationships',
          ],
          tools_available: [
            {
              name: 'crm-system',
              description: 'Manage deals',
              when_to_use: 'To track deal progress',
            },
            {
              name: 'contract-generator',
              description: 'Generate contracts',
              when_to_use: 'To create deal documents',
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
            max_responses_per_hour: 50,
            parallel_tasks: 3,
          },
        },
      ],
      team_structure: {
        type: 'hierarchical',
        manager_agent: 'ae-agent',
        decision_authority: {
          'lead-gen-agent': ['lead-scoring'],
          'sdr-agent': ['qualification'],
          'ae-agent': ['deal-closing'],
        },
      },
      team_size_range: { min: 3, max: 4 },
      essential_roles: ['lead-gen-agent', 'sdr-agent', 'ae-agent'],
      expected_metrics: {
        task_completion_rate: 0.85,
        average_response_time: 60,
        cost_per_interaction: 0.015,
        quality_score: 85,
      },
    },
    communication: [
      {
        from_agent: 'lead-gen-agent',
        to_agent: 'sdr-agent',
        protocol: 'request-response',
        message_types: [
          {
            type: 'new-qualified-lead',
            schema: {
              lead_id: 'string',
              company: 'string',
              fit_score: 'number',
            },
          },
        ],
        frequency: 'continuous',
      },
      {
        from_agent: 'sdr-agent',
        to_agent: 'ae-agent',
        protocol: 'request-response',
        message_types: [
          {
            type: 'meeting-booked',
            schema: { lead_id: 'string', meeting_date: 'string' },
          },
        ],
        frequency: 'on-demand',
      },
    ],
    workflows: [
      {
        id: 'lead-to-revenue',
        name: 'Lead to Revenue Pipeline',
        trigger: { type: 'scheduled', config: { interval: '1h' } },
        steps: [
          {
            id: 'generate-leads',
            name: 'Generate Leads',
            type: 'agent-task',
            assigned_to: ['lead-gen-agent'],
            inputs: ['target_market', 'company_criteria'],
            outputs: ['leads', 'lead_scores'],
            task_description:
              'Identify and score potential customers from target market',
            success_criteria:
              'At least 10 qualified leads identified with scores > 70',
            timeout_seconds: 300,
            max_retries: 1,
            on_failure: 'skip',
          },
          {
            id: 'qualify-leads',
            name: 'Qualify Leads',
            type: 'agent-task',
            assigned_to: ['sdr-agent'],
            inputs: ['leads', 'lead_scores'],
            outputs: ['qualified_leads', 'meetings_booked'],
            task_description:
              'Reach out to leads and qualify them for sales',
            success_criteria:
              'Book meetings with at least 3 qualified prospects',
            timeout_seconds: 600,
            max_retries: 1,
            on_failure: 'escalate',
          },
          {
            id: 'manage-sales',
            name: 'Close Deals',
            type: 'agent-task',
            assigned_to: ['ae-agent'],
            inputs: ['qualified_leads', 'meetings_booked'],
            outputs: ['deals_closed', 'revenue'],
            task_description:
              'Conduct demos and close deals with qualified prospects',
            success_criteria:
              'Close deals worth target revenue amount',
            timeout_seconds: 1800,
            max_retries: 0,
            on_failure: 'escalate',
          },
        ],
        shared_context: {
          shared_fields: ['leads', 'qualified_leads', 'deals_closed', 'revenue'],
          context_propagation: 'selective',
          max_context_size: 4000,
        },
        quality_gates: [],
        escalation_policy: {
          conditions: [
            'lead_generation fails',
            'qualification fails',
            'deal closing fails',
          ],
          escalate_to: 'human',
          max_escalations: 1,
        },
        sla: { max_total_time: 3600, max_per_step: 1800 },
      },
    ],
    shared_context: {
      knowledge_base: {
        type: 'vector-db',
        contents: [
          'Product information',
          'Pricing and packages',
          'Sales playbook',
          'Customer success stories',
        ],
      },
      conversation_history: {
        retention_days: 90,
        accessibility: 'all-agents',
      },
      entity_memory: { enabled: true, storage_backend: 'memory', ttl_days: 60 },
      decision_logs: {
        enabled: true,
        what_to_track: ['lead_score', 'qualification_decision', 'deal_value'],
      },
    },
    escalation_policy: {
      conditions: ['lead quality low', 'qualification fails', 'deal stalls'],
      escalate_to: 'human',
      sla_minutes: 30,
    },
    observability: {
      log_all_interactions: true,
      track_agent_metrics: true,
      trace_decisions: true,
    },
  },
};
