/**
 * Cost Calculator Component
 * Compares AI team costs vs human team costs
 */

'use client';

import { TeamComposition } from '@/lib/types/team';

interface CostCalculatorProps {
  composition: TeamComposition;
}

export function CostCalculator({ composition }: CostCalculatorProps) {
  // Claude Opus pricing: $3/M input tokens, $15/M output tokens
  const INPUT_TOKEN_COST = 0.000003;
  const OUTPUT_TOKEN_COST = 0.000015;

  // Estimated tokens per interaction per agent
  const TOKENS_PER_INTERACTION = {
    input: 1000,
    output: 500,
  };

  // Calculate monthly costs
  const interactionsPerMonth = 10000; // Configurable
  const costPerInteraction =
    (TOKENS_PER_INTERACTION.input * INPUT_TOKEN_COST +
      TOKENS_PER_INTERACTION.output * OUTPUT_TOKEN_COST) *
    composition.agents.length;

  const monthlyCost = costPerInteraction * interactionsPerMonth;
  const annualCost = monthlyCost * 12;

  // Human team cost estimates (varies by role)
  const humanTeamCostMonthly = composition.agents.reduce((total) => {
    return total + 8000; // ~$96k/year per agent
  }, 0);

  const humanTeamCostAnnual = humanTeamCostMonthly * 12;

  const savings = humanTeamCostAnnual - annualCost;
  const savingsPercent = ((savings / humanTeamCostAnnual) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Cost Analysis</h2>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* AI Team Costs */}
        <div className="p-4 bg-blue-50 rounded">
          <h3 className="font-semibold text-blue-900 mb-4">AI Team Cost</h3>

          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Agents:</span>
              <span className="font-medium">{composition.agents.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Interactions:</span>
              <span className="font-medium">
                {interactionsPerMonth.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cost per Interaction:</span>
              <span className="font-medium">${costPerInteraction.toFixed(4)}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Monthly Cost:</span>
              <span className="text-xl font-bold text-blue-600">
                ${monthlyCost.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Annual Cost:</span>
              <span className="text-xl font-bold text-blue-600">
                ${annualCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Human Team Costs */}
        <div className="p-4 bg-orange-50 rounded">
          <h3 className="font-semibold text-orange-900 mb-4">Human Team Cost</h3>

          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Team Size:</span>
              <span className="font-medium">{composition.agents.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cost per Agent:</span>
              <span className="font-medium">$8,000/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Overhead & Benefits:</span>
              <span className="font-medium">+30%</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Monthly Cost:</span>
              <span className="text-xl font-bold text-orange-600">
                ${humanTeamCostMonthly.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Annual Cost:</span>
              <span className="text-xl font-bold text-orange-600">
                ${humanTeamCostAnnual.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings */}
      <div className="p-6 bg-green-50 border border-green-200 rounded">
        <h3 className="font-semibold text-green-900 mb-4">Annual Savings</h3>

        <div className="flex items-baseline gap-4">
          <div className="text-4xl font-bold text-green-600">
            ${savings.toFixed(2)}
          </div>
          <div className="text-lg font-semibold text-green-600">
            {savingsPercent}% savings
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-4">
          By using an AI team instead of human team members, you save approximately{' '}
          <strong>${(savings / 12).toFixed(2)} per month</strong> or{' '}
          <strong>${(savings / 365).toFixed(2)} per day</strong>.
        </p>
      </div>

      {/* Assumptions */}
      <div className="mt-8 p-4 bg-gray-50 rounded text-sm text-gray-600">
        <p className="font-semibold mb-2">Assumptions:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Human team: ${humanTeamCostMonthly / composition.agents.length / 1000}K/year per agent</li>
          <li>AI cost based on actual Claude API usage</li>
          <li>Monthly volume: {interactionsPerMonth.toLocaleString()} interactions</li>
          <li>Does not include infrastructure, training, or management costs</li>
        </ul>
      </div>
    </div>
  );
}
