/**
 * Example: Engineering Team
 * AI team for code review, testing, and deployment
 */

import { TeamSpec } from '../types/team';

export const engineeringTeamSpec: TeamSpec = {
  id: 'engineering-team-v1',
  name: 'Engineering Team',
  description: 'AI team for code review, testing, and deployment automation',
  version: '2.0',
  is_team: true,
  is_individual_agent: false,

  role: 'Engineering Team',
  purpose:
    'Automate code review, testing, and deployment with quality assurance',
  expertise_domains: ['code-review', 'testing', 'deployment', 'debugging'],

  primary_tasks: [
    'Review pull requests for quality and security',
    'Run automated tests and identify failures',
    'Deploy code to production with safety checks',
    'Debug production issues and provide solutions',
  ],

  tools: [
    {
      name: 'code-analyzer',
      description: 'Analyze code for quality, security, and best practices',
      when_to_use: 'During code review to check for issues',
    },
    {
      name: 'test-runner',
      description: 'Execute test suites and report results',
      when_to_use: 'To validate code changes',
    },
    {
      name: 'deployment-manager',
      description: 'Deploy code to staging and production',
      when_to_use: 'To roll out approved changes',
    },
    {
      name: 'monitoring-dashboard',
      description: 'Monitor production system health',
      when_to_use: 'To track performance after deployment',
    },
  ],

  hard_rules: [
    'Never merge code without tests passing',
    'Always run security checks before deployment',
    'Require approval from QA agent',
    'Maintain 90%+ test coverage',
  ],

  workflow_pattern: 'sequential',
  reasoning_pattern: 'react',
  output_format: 'Code review report or deployment status',

  tags: ['engineering', 'devops', 'automation', 'team-v2'],

  team_config: {
    composition: {
      id: 'engineering-composition',
      name: 'Engineering Team',
      purpose: 'Automate code quality and deployment',
      agents: [
        {
          id: 'code-reviewer',
          name: 'Code Review Specialist',
          description: 'Reviews code for quality and security',
          specializations: [
            {
              domain: 'code-review',
              proficiency: 'expert',
              description: 'Review code for quality, security, best practices',
            },
            {
              domain: 'architecture',
              proficiency: 'advanced',
              description: 'Evaluate system design and architecture',
            },
          ],
          responsibilities: [
            'Review pull requests',
            'Check code quality',
            'Identify security issues',
            'Suggest improvements',
          ],
          tools_available: [
            {
              name: 'code-analyzer',
              description: 'Analyze code for issues',
              when_to_use: 'During code review',
            },
            {
              name: 'knowledge-base',
              description: 'Reference coding standards',
              when_to_use: 'To validate against standards',
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
        {
          id: 'test-engineer',
          name: 'Test Engineer',
          description: 'Manages automated testing',
          specializations: [
            {
              domain: 'testing',
              proficiency: 'expert',
              description: 'Run and analyze test suites',
            },
            {
              domain: 'quality-assurance',
              proficiency: 'advanced',
              description: 'Ensure code quality metrics',
            },
          ],
          responsibilities: [
            'Run test suites',
            'Report test results',
            'Identify failing tests',
            'Track coverage metrics',
          ],
          tools_available: [
            {
              name: 'test-runner',
              description: 'Execute tests',
              when_to_use: 'To validate code changes',
            },
            {
              name: 'coverage-analyzer',
              description: 'Analyze test coverage',
              when_to_use: 'To check coverage metrics',
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
            max_responses_per_hour: 100,
            parallel_tasks: 5,
          },
        },
        {
          id: 'devops-engineer',
          name: 'DevOps Engineer',
          description: 'Manages deployment and infrastructure',
          specializations: [
            {
              domain: 'deployment',
              proficiency: 'expert',
              description: 'Deploy code safely and reliably',
            },
            {
              domain: 'infrastructure',
              proficiency: 'advanced',
              description: 'Manage cloud infrastructure',
            },
          ],
          responsibilities: [
            'Deploy code to environments',
            'Monitor deployment health',
            'Rollback if needed',
            'Maintain deployment pipelines',
          ],
          tools_available: [
            {
              name: 'deployment-manager',
              description: 'Deploy code',
              when_to_use: 'To release approved code',
            },
            {
              name: 'monitoring-dashboard',
              description: 'Monitor system health',
              when_to_use: 'To track production',
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
            max_responses_per_hour: 20,
            parallel_tasks: 2,
          },
        },
      ],
      team_structure: {
        type: 'peer-review',
        decision_authority: {
          'code-reviewer': ['code-quality'],
          'test-engineer': ['test-validation'],
          'devops-engineer': ['deployment'],
        },
      },
      team_size_range: { min: 3, max: 4 },
      essential_roles: ['code-reviewer', 'test-engineer', 'devops-engineer'],
      expected_metrics: {
        task_completion_rate: 0.95,
        average_response_time: 45,
        cost_per_interaction: 0.012,
        quality_score: 98,
      },
    },
    communication: [
      {
        from_agent: 'code-reviewer',
        to_agent: 'test-engineer',
        protocol: 'request-response',
        message_types: [
          {
            type: 'run-tests',
            schema: { code_sha: 'string', test_suite: 'string' },
          },
        ],
        frequency: 'on-demand',
      },
      {
        from_agent: 'test-engineer',
        to_agent: 'devops-engineer',
        protocol: 'request-response',
        message_types: [
          {
            type: 'tests-passed',
            schema: { coverage: 'number', all_pass: 'boolean' },
          },
        ],
        frequency: 'on-demand',
      },
    ],
    workflows: [
      {
        id: 'code-review-workflow',
        name: 'Code Review & Deployment',
        trigger: { type: 'webhook', config: { event: 'pull_request' } },
        steps: [
          {
            id: 'review-code',
            name: 'Code Review',
            type: 'agent-task',
            assigned_to: ['code-reviewer'],
            inputs: ['code_changes', 'pr_description'],
            outputs: ['review_comments', 'approval_status'],
            task_description:
              'Review the pull request for code quality, security, and best practices',
            success_criteria:
              'Code review completed with clear approval or rejection',
            timeout_seconds: 120,
            fallback_agent: undefined,
            max_retries: 1,
            on_failure: 'escalate',
          },
          {
            id: 'run-tests-decision',
            name: 'Check If Approved',
            type: 'decision',
            assigned_to: [],
            inputs: ['approval_status'],
            outputs: [],
            task_description: 'Check if code was approved',
            success_criteria: 'Approval status determined',
            timeout_seconds: 5,
            max_retries: 0,
            on_failure: 'escalate',
            condition: {
              field: 'approval_status',
              type: 'equals',
              value: 'approved',
              branches: {
                approved: 'run-tests',
                rejected: 'end-rejected',
              },
            },
          },
          {
            id: 'run-tests',
            name: 'Run Test Suite',
            type: 'agent-task',
            assigned_to: ['test-engineer'],
            inputs: ['code_changes'],
            outputs: ['test_results', 'coverage_report'],
            task_description:
              'Run automated tests and report results',
            success_criteria:
              'All tests pass with >90% coverage',
            timeout_seconds: 180,
            fallback_agent: undefined,
            max_retries: 1,
            on_failure: 'escalate',
          },
          {
            id: 'deploy-code',
            name: 'Deploy to Production',
            type: 'agent-task',
            assigned_to: ['devops-engineer'],
            inputs: ['code_changes', 'test_results'],
            outputs: ['deployment_status', 'deployment_id'],
            task_description:
              'Deploy approved code to production',
            success_criteria:
              'Code deployed successfully with health checks passing',
            timeout_seconds: 300,
            fallback_agent: undefined,
            max_retries: 0,
            on_failure: 'escalate',
          },
        ],
        shared_context: {
          shared_fields: [
            'code_changes',
            'review_comments',
            'test_results',
            'deployment_status',
          ],
          context_propagation: 'selective',
          max_context_size: 5000,
        },
        quality_gates: [],
        escalation_policy: {
          conditions: [
            'code_review fails',
            'tests fail',
            'deployment fails',
          ],
          escalate_to: 'human',
          max_escalations: 2,
        },
        sla: { max_total_time: 600, max_per_step: 300 },
      },
    ],
    shared_context: {
      knowledge_base: {
        type: 'vector-db',
        contents: [
          'Coding standards',
          'Architecture guidelines',
          'Testing best practices',
          'Deployment procedures',
        ],
      },
      conversation_history: {
        retention_days: 30,
        accessibility: 'all-agents',
      },
      entity_memory: { enabled: true, storage_backend: 'memory', ttl_days: 14 },
      decision_logs: {
        enabled: true,
        what_to_track: ['review_decision', 'test_result', 'deployment_action'],
      },
    },
    escalation_policy: {
      conditions: ['code review fails', 'tests fail', 'deployment fails'],
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
