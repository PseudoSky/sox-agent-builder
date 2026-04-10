/**
 * Team Builder Page
 * Main interface for creating and editing teams
 */

'use client';

import { useState } from 'react';
import { TeamSpec } from '@/lib/types/team';
import { supportTeamSpec } from '@/lib/examples/customer-support-team';
import { TeamCompositionDesigner } from '@/app/components/TeamCompositionDesigner';
import { WorkflowEditor } from '@/app/components/WorkflowEditor';

export default function TeamBuilderPage() {
  const [team, setTeam] = useState<TeamSpec>(supportTeamSpec);
  const [activeTab, setActiveTab] = useState<'composition' | 'workflow' | 'settings'>(
    'composition'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    // Save team spec
    try {
      const response = await fetch('/api/specs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(team),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save team:', error);
    }
  };

  const handleExport = () => {
    // Export as JSON
    const json = JSON.stringify(team, null, 2);
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(json)
    );
    element.setAttribute('download', `${team.name}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{team.name}</h1>
              <p className="text-gray-600">{team.description}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                ↓ Export
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                💾 Save
              </button>
            </div>
          </div>

          {saved && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
              ✓ Team saved successfully
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0">
            {(['composition', 'workflow', 'settings'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 border-b-2 font-medium transition ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'composition' && (
          <TeamCompositionDesigner
            composition={team.team_config.composition}
            onChange={(composition) => {
              setTeam({
                ...team,
                team_config: { ...team.team_config, composition },
              });
            }}
          />
        )}

        {activeTab === 'workflow' && (
          <div className="space-y-6">
            {team.team_config.workflows.map(workflow => (
              <WorkflowEditor
                key={workflow.id}
                workflow={workflow}
                onChange={(updated) => {
                  setTeam({
                    ...team,
                    team_config: {
                      ...team.team_config,
                      workflows: team.team_config.workflows.map(w =>
                        w.id === workflow.id ? updated : w
                      ),
                    },
                  });
                }}
              />
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Team Settings</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Team Name</label>
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) => setTeam({ ...team, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Purpose</label>
                  <input
                    type="text"
                    value={team.purpose}
                    onChange={(e) => setTeam({ ...team, purpose: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={team.description || ''}
                  onChange={(e) => setTeam({ ...team, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Team Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Task Completion Rate</p>
                  <p className="text-2xl font-bold">
                    {(
                      team.team_config.composition.expected_metrics
                        .task_completion_rate * 100
                    ).toFixed(0)}
                    %
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Cost per Interaction</p>
                  <p className="text-2xl font-bold">
                    $
                    {team.team_config.composition.expected_metrics.cost_per_interaction.toFixed(
                      4
                    )}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold">
                    {
                      team.team_config.composition.expected_metrics
                        .average_response_time
                    }
                    s
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Quality Score</p>
                  <p className="text-2xl font-bold">
                    {team.team_config.composition.expected_metrics.quality_score}
                    /100
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
