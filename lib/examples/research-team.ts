/**
 * Example: Research Team
 * AI team for research, analysis, and knowledge synthesis
 */

import { TeamSpec } from '../types/team';

export const researchTeamSpec: TeamSpec = {
  id: 'research-team-v1',
  name: 'Research Team',
  description: 'AI team for research, analysis, and knowledge synthesis',
  version: '2.0',
  is_team: true,
  is_individual_agent: false,

  role: 'Research Team',
  purpose:
    'Conduct research, analyze data, and synthesize knowledge for decision making',
  expertise_domains: ['research', 'analysis', 'data-synthesis', 'knowledge-management'],

  primary_tasks: [
    'Research topics and gather information',
    'Analyze data and identify patterns',
    'Synthesize findings into reports',
    'Answer research questions comprehensively',
  ],

  tools: [
    {
      name: 'web-search',
      description: 'Search the web for information',
      when_to_use: 'To find sources and data on topics',
    },
    {
      name: 'data-analyzer',
      description: 'Analyze datasets and statistical information',
      when_to_use: 'To examine and visualize data',
    },
    {
      name: 'knowledge-base',
      description: 'Access curated knowledge and sources',
      when_to_use: 'To reference reliable information',
    },
    {
      name: 'report-generator',
      description: 'Generate formatted research reports',
      when_to_use: 'To create final deliverables',
    },
  ],

  hard_rules: [
    'Always cite sources for information',
    'Distinguish between fact and opinion',
    'Cross-reference findings with multiple sources',
    'Disclose limitations and assumptions',
  ],

  workflow_pattern: 'sequential',
  reasoning_pattern: 'react',
  output_format: 'Research report with findings, analysis, and recommendations',

  tags: ['research', 'analysis', 'knowledge', 'team-v2'],

  team_config: {
    composition: {
      id: 'research-composition',
      name: 'Research Team',
      purpose: 'Conduct comprehensive research and analysis',
      agents: [
        {
          id: 'researcher-agent',
          name: 'Research Analyst',
          description: 'Conducts research and gathers information',
          specializations: [
            {
              domain: 'research',
              proficiency: 'expert',
              description: 'Conduct thorough research on topics',
            },
            {
              domain: 'source-evaluation',
              proficiency: 'advanced',
              description: 'Evaluate source credibility',
            },
          ],
          responsibilities: [
            'Research topics',
            'Gather relevant information',
            'Evaluate source quality',
            'Organize findings',
          ],
          tools_available: [
            {
              name: 'web-search',
              description: 'Search for information',
              when_to_use: 'To find sources on topics',
            },
            {
              name: 'knowledge-base',
              description: 'Access curated sources',
              when_to_use: 'To find reliable information',
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
            max_responses_per_hour: 30,
            parallel_tasks: 3,
          },
        },
        {
          id: 'data-analyst',
          name: 'Data Analyst',
          description: 'Analyzes data and identifies patterns',
          specializations: [
            {
              domain: 'data-analysis',
              proficiency: 'expert',
              description: 'Analyze data and find patterns',
            },
            {
              domain: 'statistics',
              proficiency: 'advanced',
              description: 'Apply statistical methods',
            },
          ],
          responsibilities: [
            'Analyze research data',
            'Identify patterns and trends',
            'Calculate statistics',
            'Visualize findings',
          ],
          tools_available: [
            {
              name: 'data-analyzer',
              description: 'Analyze datasets',
              when_to_use: 'To examine and visualize data',
            },
            {
              name: 'statistics-tool',
              description: 'Calculate statistical measures',
              when_to_use: 'To perform statistical analysis',
            },
          ],
          knowledge_access: {
            shared_knowledge_base: true,
            conversation_history: true,
            entity_memory: true,
            decision_logs: true,
          },
          constraints: {
            max_context_tokens: 3500,
            max_responses_per_hour: 20,
            parallel_tasks: 2,
          },
        },
        {
          id: 'synthesis-agent',
          name: 'Knowledge Synthesizer',
          description: 'Synthesizes findings into reports',
          specializations: [
            {
              domain: 'synthesis',
              proficiency: 'expert',
              description: 'Synthesize findings into coherent narratives',
            },
            {
              domain: 'communication',
              proficiency: 'advanced',
              description: 'Communicate complex findings clearly',
            },
          ],
          responsibilities: [
            'Synthesize research findings',
            'Create comprehensive reports',
            'Provide recommendations',
            'Present findings clearly',
          ],
          tools_available: [
            {
              name: 'report-generator',
              description: 'Create formatted reports',
              when_to_use: 'To produce final deliverables',
            },
            {
              name: 'knowledge-base',
              description: 'Reference for context',
              when_to_use: 'To support recommendations',
            },
          ],
          knowledge_access: {
            shared_knowledge_base: true,
            conversation_history: true,
            entity_memory: true,
            decision_logs: true,
          },
          constraints: {
            max_context_tokens: 4000,
            max_responses_per_hour: 25,
            parallel_tasks: 2,
          },
        },
      ],
      team_structure: {
        type: 'peer-review',
        decision_authority: {
          'researcher-agent': ['source-selection'],
          'data-analyst': ['analytical-approach'],
          'synthesis-agent': ['conclusions'],
        },
      },
      team_size_range: { min: 3, max: 4 },
      essential_roles: ['researcher-agent', 'data-analyst', 'synthesis-agent'],
      expected_metrics: {
        task_completion_rate: 0.92,
        average_response_time: 120,
        cost_per_interaction: 0.018,
        quality_score: 95,
      },
    },
    communication: [
      {
        from_agent: 'researcher-agent',
        to_agent: 'data-analyst',
        protocol: 'request-response',
        message_types: [
          {
            type: 'research-data',
            schema: {
              findings: 'string',
              sources: 'array',
              data_sets: 'array',
            },
          },
        ],
        frequency: 'on-demand',
      },
      {
        from_agent: 'data-analyst',
        to_agent: 'synthesis-agent',
        protocol: 'request-response',
        message_types: [
          {
            type: 'analysis-results',
            schema: {
              patterns: 'string',
              statistics: 'object',
              visualizations: 'array',
            },
          },
        ],
        frequency: 'on-demand',
      },
    ],
    workflows: [
      {
        id: 'research-workflow',
        name: 'Research & Analysis Pipeline',
        trigger: {
          type: 'user-request',
          config: { endpoint: '/api/research' },
        },
        steps: [
          {
            id: 'conduct-research',
            name: 'Conduct Research',
            type: 'agent-task',
            assigned_to: ['researcher-agent'],
            inputs: ['research_question', 'domain', 'scope'],
            outputs: ['research_findings', 'sources', 'data_collected'],
            task_description:
              'Conduct comprehensive research on the given topic',
            success_criteria:
              'At least 10 credible sources found and documented',
            timeout_seconds: 300,
            max_retries: 1,
            on_failure: 'escalate',
          },
          {
            id: 'analyze-data',
            name: 'Analyze Data',
            type: 'agent-task',
            assigned_to: ['data-analyst'],
            inputs: ['research_findings', 'data_collected'],
            outputs: ['analysis_results', 'patterns', 'statistics'],
            task_description:
              'Analyze collected data and identify patterns',
            success_criteria:
              'Key patterns and trends identified with statistical support',
            timeout_seconds: 240,
            max_retries: 1,
            on_failure: 'escalate',
          },
          {
            id: 'synthesize-report',
            name: 'Synthesize Report',
            type: 'agent-task',
            assigned_to: ['synthesis-agent'],
            inputs: ['research_findings', 'analysis_results', 'sources'],
            outputs: ['final_report', 'recommendations'],
            task_description:
              'Synthesize findings into comprehensive report',
            success_criteria:
              'Comprehensive report with findings, analysis, and recommendations',
            timeout_seconds: 180,
            max_retries: 1,
            on_failure: 'escalate',
          },
        ],
        shared_context: {
          shared_fields: [
            'research_findings',
            'sources',
            'analysis_results',
            'final_report',
          ],
          context_propagation: 'selective',
          max_context_size: 6000,
          entity_tracking: [
            {
              entity_type: 'source',
              fields: ['url', 'credibility', 'relevance'],
              persistence: 'permanent',
            },
            {
              entity_type: 'finding',
              fields: ['statement', 'source', 'confidence'],
              persistence: 'permanent',
            },
          ],
        },
        quality_gates: [
          {
            step_id: 'synthesize-report',
            validation_agent: 'synthesis-agent',
            criteria: [
              'All findings are cited',
              'Limitations are disclosed',
              'Recommendations are actionable',
              'Report is well-organized',
            ],
            on_failure: 'loop-back',
          },
        ],
        escalation_policy: {
          conditions: [
            'insufficient sources found',
            'conflicting data',
            'unclear patterns',
          ],
          escalate_to: 'human',
          max_escalations: 1,
        },
        sla: { max_total_time: 1200, max_per_step: 600 },
      },
    ],
    shared_context: {
      knowledge_base: {
        type: 'vector-db',
        contents: [
          'Research methodology guide',
          'Source evaluation criteria',
          'Statistical methods',
          'Report writing standards',
        ],
      },
      conversation_history: {
        retention_days: 180,
        accessibility: 'all-agents',
      },
      entity_memory: {
        enabled: true,
        storage_backend: 'memory',
        ttl_days: 90,
      },
      decision_logs: {
        enabled: true,
        what_to_track: ['source_selection', 'analysis_method', 'conclusion'],
      },
    },
    escalation_policy: {
      conditions: [
        'insufficient information',
        'conflicting sources',
        'unclear analysis',
      ],
      escalate_to: 'human',
      sla_minutes: 60,
    },
    observability: {
      log_all_interactions: true,
      track_agent_metrics: true,
      trace_decisions: true,
    },
  },
};
