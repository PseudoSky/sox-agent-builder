/**
 * Team Composition Designer Component
 * Allows users to add/remove agents and configure roles
 */

'use client';

import { useState } from 'react';
import { AgentRole, TeamComposition } from '@/lib/types/team';

interface TeamCompositionDesignerProps {
  composition: TeamComposition;
  onChange: (composition: TeamComposition) => void;
}

export function TeamCompositionDesigner({
  composition,
  onChange,
}: TeamCompositionDesignerProps) {
  const [editingAgent, setEditingAgent] = useState<AgentRole | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddAgent = (agent: AgentRole) => {
    const updated = {
      ...composition,
      agents: [...composition.agents, agent],
    };
    onChange(updated);
    setShowAddForm(false);
  };

  const handleRemoveAgent = (agentId: string) => {
    const updated = {
      ...composition,
      agents: composition.agents.filter(a => a.id !== agentId),
    };
    onChange(updated);
  };

  const handleUpdateAgent = (agent: AgentRole) => {
    const updated = {
      ...composition,
      agents: composition.agents.map(a => (a.id === agent.id ? agent : a)),
    };
    onChange(updated);
    setEditingAgent(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Team Composition</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Agent
        </button>
      </div>

      {/* Team Structure */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-3">Team Structure</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={composition.team_structure.type}
              onChange={(e) =>
                onChange({
                  ...composition,
                  team_structure: {
                    ...composition.team_structure,
                    type: e.target.value as any,
                  },
                })
              }
              className="w-full px-3 py-2 border rounded"
            >
              <option value="flat">Flat</option>
              <option value="hierarchical">Hierarchical</option>
              <option value="peer-review">Peer Review</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {composition.team_structure.type === 'hierarchical' && (
            <div>
              <label className="block text-sm font-medium mb-2">Manager</label>
              <select
                value={composition.team_structure.manager_agent || ''}
                onChange={(e) =>
                  onChange({
                    ...composition,
                    team_structure: {
                      ...composition.team_structure,
                      manager_agent: e.target.value || undefined,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select manager...</option>
                {composition.agents.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Agents List */}
      <div className="space-y-3">
        <h3 className="font-semibold">Agents ({composition.agents.length})</h3>

        {composition.agents.length === 0 ? (
          <p className="text-gray-500 italic">No agents yet. Add one to get started.</p>
        ) : (
          composition.agents.map(agent => (
            <div
              key={agent.id}
              className="border rounded p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setEditingAgent(agent)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold">{agent.name}</h4>
                  <p className="text-sm text-gray-600">{agent.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {agent.specializations.map(s => (
                      <span
                        key={s.domain}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {s.domain} ({s.proficiency})
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveAgent(agent.id);
                  }}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Agent Modal */}
      {(showAddForm || editingAgent) && (
        <AgentEditorModal
          agent={editingAgent}
          onSave={(agent) => {
            if (editingAgent) {
              handleUpdateAgent(agent);
            } else {
              handleAddAgent(agent);
            }
          }}
          onCancel={() => {
            setShowAddForm(false);
            setEditingAgent(null);
          }}
        />
      )}
    </div>
  );
}

/**
 * Agent Editor Modal
 */
function AgentEditorModal({
  agent,
  onSave,
  onCancel,
}: {
  agent: AgentRole | null;
  onSave: (agent: AgentRole) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<AgentRole>>(
    agent || {
      id: `agent-${Date.now()}`,
      name: '',
      description: '',
      specializations: [],
      responsibilities: [],
      tools_available: [],
      knowledge_access: {
        shared_knowledge_base: true,
        conversation_history: true,
        entity_memory: true,
        decision_logs: true,
      },
      constraints: {
        max_context_tokens: 2000,
        parallel_tasks: 5,
      },
    }
  );

  const handleSubmit = () => {
    if (!form.name || !form.id) return;

    onSave(form as AgentRole);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto p-6">
        <h3 className="text-xl font-bold mb-4">
          {agent ? 'Edit Agent' : 'Add New Agent'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Agent Name *</label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Technical Support Specialist"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does this agent do?"
              rows={2}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Specializations
            </label>
            <div className="space-y-2 mb-2">
              {form.specializations?.map((spec, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={spec.domain}
                    placeholder="Domain (e.g., debugging)"
                    className="flex-1 px-3 py-1 border rounded text-sm"
                    disabled
                  />
                  <select
                    value={spec.proficiency}
                    className="px-3 py-1 border rounded text-sm"
                    disabled
                  >
                    <option>expert</option>
                    <option>advanced</option>
                    <option>intermediate</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {agent ? 'Save Changes' : 'Add Agent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
