/**
 * Teams Hub Page
 * Lists all teams and provides access to team builder and templates
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TeamSpec } from '@/lib/types/team';
import { supportTeamSpec } from '@/lib/examples/customer-support-team';
import { engineeringTeamSpec } from '@/lib/examples/engineering-team';
import { salesTeamSpec } from '@/lib/examples/sales-team';
import { researchTeamSpec } from '@/lib/examples/research-team';

const TEAM_TEMPLATES = [
  supportTeamSpec,
  engineeringTeamSpec,
  salesTeamSpec,
  researchTeamSpec,
];

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamSpec[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load teams from localStorage
    const stored = localStorage.getItem('teams');
    if (stored) {
      setTeams(JSON.parse(stored));
    } else {
      // Start with customer support example
      setTeams([supportTeamSpec]);
    }
    setLoading(false);
  }, []);

  const handleCreateFromTemplate = (template: TeamSpec) => {
    const newTeam = {
      ...template,
      id: `team-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
  };

  const handleDelete = (teamId: string) => {
    const updatedTeams = teams.filter(t => t.id !== teamId);
    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Teams</h1>
          <p className="text-gray-600">
            Create and manage AI agent teams that replace or augment human teams
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Your Teams */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Teams</h2>
            <Link
              href="/teams/builder"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Create New Team
            </Link>
          </div>

          {teams.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">No teams yet.</p>
              <Link
                href="/teams/builder"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Your First Team
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teams.map(team => (
                <div
                  key={team.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{team.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{team.description}</p>

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Agents:</span>
                        <span className="font-semibold">
                          {team.team_config.composition.agents.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost/Interaction:</span>
                        <span className="font-semibold">
                          $
                          {team.team_config.composition.expected_metrics.cost_per_interaction.toFixed(
                            4
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="font-semibold">
                          {(
                            team.team_config.composition.expected_metrics
                              .task_completion_rate * 100
                          ).toFixed(0)}
                          %
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href="/teams/builder"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/teams/${team.id}/metrics`}
                        className="flex-1 px-4 py-2 border rounded text-center hover:bg-gray-50 text-sm"
                      >
                        Metrics
                      </Link>
                      <button
                        onClick={() => handleDelete(team.id || '')}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Templates */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Team Templates</h2>
          <p className="text-gray-600 mb-6">
            Start with a pre-configured team template and customize it for your needs
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TEAM_TEMPLATES.map(template => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="p-6">
                  <div className="text-3xl mb-2">
                    {template.name === 'Customer Support Team'
                      ? '📞'
                      : template.name === 'Engineering Team'
                        ? '⚙️'
                        : template.name === 'Sales Team'
                          ? '💼'
                          : '🔬'}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                  <div className="space-y-1 mb-6 text-xs text-gray-600">
                    <div>
                      • {template.team_config.composition.agents.length} agents
                    </div>
                    <div>
                      • {template.team_config.workflows.length} workflow
                      {template.team_config.workflows.length !== 1 ? 's' : ''}
                    </div>
                    <div>
                      • Pre-configured roles & tools
                    </div>
                  </div>

                  <button
                    onClick={() => handleCreateFromTemplate(template)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
