/**
 * Team Metrics & Performance Dashboard
 * Shows team performance, cost analysis, and ROI
 */

'use client';

import { useState } from 'react';
import { supportTeamSpec } from '@/lib/examples/customer-support-team';
import { CostCalculator } from '@/app/components/CostCalculator';

export default function TeamMetricsPage() {
  const team = supportTeamSpec;
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly' | 'annual'>(
    'monthly'
  );

  const metrics = team.team_config.composition.expected_metrics;

  // Calculate metrics based on timeframe
  const getProjection = (monthly: number) => {
    switch (timeframe) {
      case 'quarterly':
        return monthly * 3;
      case 'annual':
        return monthly * 12;
      default:
        return monthly;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">{team.name} - Metrics & ROI</h1>
          <p className="text-gray-600">Performance analysis and cost comparison</p>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4">
            {(['monthly', 'quarterly', 'annual'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded font-medium transition ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Task Completion Rate"
            value={`${(metrics.task_completion_rate * 100).toFixed(0)}%`}
            subtitle="Tasks handled without escalation"
            trend="↑ 5% from last period"
            color="blue"
          />

          <MetricCard
            title="Avg Response Time"
            value={`${metrics.average_response_time}s`}
            subtitle="Average per interaction"
            trend="↓ 8% faster"
            color="green"
          />

          <MetricCard
            title="Quality Score"
            value={`${metrics.quality_score}/100`}
            subtitle="Output quality rating"
            trend="Consistent"
            color="purple"
          />

          <MetricCard
            title="Cost per Interaction"
            value={`$${metrics.cost_per_interaction.toFixed(4)}`}
            subtitle="Average AI cost"
            trend="↓ 3% optimization"
            color="orange"
          />
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Success Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Success Metrics</h2>

            <div className="space-y-6">
              <ProgressBar
                label="Task Completion Rate"
                value={metrics.task_completion_rate * 100}
                target={95}
              />

              <ProgressBar
                label="Quality Score"
                value={metrics.quality_score}
                target={100}
              />

              <ProgressBar
                label="Uptime"
                value={99.5}
                target={99.5}
              />

              <ProgressBar
                label="Customer Satisfaction"
                value={88}
                target={95}
              />
            </div>
          </div>

          {/* Volume & Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Activity Volume</h2>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total Interactions</span>
                  <span className="text-2xl font-bold">
                    {timeframe === 'monthly'
                      ? '10,000'
                      : timeframe === 'quarterly'
                        ? '30,000'
                        : '120,000'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {timeframe} volume
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Successful Resolutions</span>
                  <span className="text-2xl font-bold">
                    {timeframe === 'monthly'
                      ? '9,500'
                      : timeframe === 'quarterly'
                        ? '28,500'
                        : '114,000'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Without escalation
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Escalations</span>
                  <span className="text-2xl font-bold">
                    {timeframe === 'monthly'
                      ? '500'
                      : timeframe === 'quarterly'
                        ? '1,500'
                        : '6,000'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Requiring human review
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Calculator */}
        <CostCalculator composition={team.team_config.composition} />

        {/* Agent Performance Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Agent Performance</h2>

          <div className="space-y-4">
            {team.team_config.composition.agents.map(agent => (
              <div
                key={agent.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{agent.name}</h4>
                    <p className="text-sm text-gray-600">{agent.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">94%</div>
                    <p className="text-xs text-gray-600">Success Rate</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Tasks</p>
                    <p className="font-bold">2,350</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Avg Time</p>
                    <p className="font-bold">
                      {agent.constraints?.max_responses_per_hour || 100}ms
                    </p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Quality</p>
                    <p className="font-bold">96/100</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Cost</p>
                    <p className="font-bold">$0.008</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Summary */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Return on Investment</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-gray-600 mb-2">Annual Savings vs Human Team</p>
              <p className="text-3xl font-bold text-green-600">$1,144,000</p>
              <p className="text-sm text-gray-600 mt-2">92% cost reduction</p>
            </div>

            <div>
              <p className="text-gray-600 mb-2">Payback Period</p>
              <p className="text-3xl font-bold text-blue-600">&lt;1 month</p>
              <p className="text-sm text-gray-600 mt-2">
                Typical system pays for itself in weeks
              </p>
            </div>

            <div>
              <p className="text-gray-600 mb-2">Productivity Increase</p>
              <p className="text-3xl font-bold text-purple-600">24/7</p>
              <p className="text-sm text-gray-600 mt-2">
                Round-the-clock availability vs 8 hours
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-700">
            * Estimates based on: $96K/year human salary + 30% overhead per agent,
            10,000 monthly interactions, and current Claude API pricing.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Metric Card Component
 */
function MetricCard({
  title,
  value,
  subtitle,
  trend,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div className={`border rounded-lg p-6 ${colors[color]}`}>
      <p className="text-sm font-medium mb-2 opacity-75">{title}</p>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className="text-xs opacity-60 mb-2">{subtitle}</p>
      <p className="text-xs font-medium">{trend}</p>
    </div>
  );
}

/**
 * Progress Bar Component
 */
function ProgressBar({
  label,
  value,
  target,
}: {
  label: string;
  value: number;
  target: number;
}) {
  const percentage = (value / target) * 100;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium">{label}</span>
        <span className="text-sm font-semibold">
          {value.toFixed(1)}/{target}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
