/**
 * Workflow Editor Component
 * Visual editor for workflow steps and connections
 */

'use client';

import { useState } from 'react';
import { TeamWorkflow, WorkflowStep } from '@/lib/types/team';

interface WorkflowEditorProps {
  workflow: TeamWorkflow;
  onChange: (workflow: TeamWorkflow) => void;
}

export function WorkflowEditor({ workflow, onChange }: WorkflowEditorProps) {
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [showAddStep, setShowAddStep] = useState(false);

  const handleAddStep = (step: WorkflowStep) => {
    const updated = {
      ...workflow,
      steps: [...workflow.steps, step],
    };
    onChange(updated);
    setShowAddStep(false);
  };

  const handleUpdateStep = (step: WorkflowStep) => {
    const updated = {
      ...workflow,
      steps: workflow.steps.map(s => (s.id === step.id ? step : s)),
    };
    onChange(updated);
    setEditingStep(null);
  };

  const handleRemoveStep = (stepId: string) => {
    const updated = {
      ...workflow,
      steps: workflow.steps.filter(s => s.id !== stepId),
    };
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{workflow.name}</h2>
          <p className="text-sm text-gray-600">
            {workflow.steps.length} steps
          </p>
        </div>
        <button
          onClick={() => setShowAddStep(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Step
        </button>
      </div>

      {/* Visual Workflow */}
      <div className="mb-8 bg-gray-50 rounded p-6 min-h-96">
        <div className="space-y-4">
          {workflow.steps.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>No steps yet. Add one to start building your workflow.</p>
            </div>
          ) : (
            workflow.steps.map((step, idx) => (
              <div key={step.id}>
                <WorkflowStepCard
                  step={step}
                  onEdit={() => setEditingStep(step)}
                  onDelete={() => handleRemoveStep(step.id)}
                />
                {idx < workflow.steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-1 h-8 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Step Details */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded p-4">
          <h3 className="font-semibold mb-3">Step Summary</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Total Steps:</span> {workflow.steps.length}
            </div>
            <div>
              <span className="font-medium">Agent Tasks:</span>{' '}
              {workflow.steps.filter(s => s.type === 'agent-task').length}
            </div>
            <div>
              <span className="font-medium">Decision Gates:</span>{' '}
              {workflow.steps.filter(s => s.type === 'decision').length}
            </div>
            <div>
              <span className="font-medium">Quality Gates:</span>{' '}
              {workflow.steps.filter(s => s.type === 'quality-gate').length}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded p-4">
          <h3 className="font-semibold mb-3">SLA & Constraints</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Max Total Time:</span>{' '}
              {workflow.sla?.max_total_time || 'Not set'} sec
            </div>
            <div>
              <span className="font-medium">Per-Step Max:</span>{' '}
              {workflow.sla?.max_per_step || 'Not set'} sec
            </div>
            <div>
              <span className="font-medium">Context Propagation:</span>{' '}
              {workflow.shared_context.context_propagation}
            </div>
            <div>
              <span className="font-medium">Max Context Size:</span>{' '}
              {workflow.shared_context.max_context_size} tokens
            </div>
          </div>
        </div>
      </div>

      {/* Step Editor Modal */}
      {(showAddStep || editingStep) && (
        <StepEditorModal
          step={editingStep}
          onSave={(step) => {
            if (editingStep) {
              handleUpdateStep(step);
            } else {
              handleAddStep(step);
            }
          }}
          onCancel={() => {
            setShowAddStep(false);
            setEditingStep(null);
          }}
        />
      )}
    </div>
  );
}

/**
 * Workflow Step Card
 */
function WorkflowStepCard({
  step,
  onEdit,
  onDelete,
}: {
  step: WorkflowStep;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const typeColors: Record<string, string> = {
    'agent-task': 'bg-blue-100 text-blue-700',
    decision: 'bg-purple-100 text-purple-700',
    'quality-gate': 'bg-green-100 text-green-700',
    parallel: 'bg-orange-100 text-orange-700',
    'human-input': 'bg-red-100 text-red-700',
    'error-recovery': 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div
      className="border rounded-lg p-4 bg-white hover:shadow-md cursor-pointer transition"
      onClick={onEdit}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                typeColors[step.type] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {step.type.replace('-', ' ').toUpperCase()}
            </span>
            <h4 className="font-bold text-lg">{step.name}</h4>
          </div>

          <p className="text-sm text-gray-600 mb-3">{step.task_description}</p>

          <div className="grid grid-cols-4 gap-2 text-xs">
            {step.assigned_to.length > 0 && (
              <div>
                <span className="font-medium">Agents:</span>
                <p className="text-gray-600">{step.assigned_to.join(', ')}</p>
              </div>
            )}
            <div>
              <span className="font-medium">Timeout:</span>
              <p className="text-gray-600">{step.timeout_seconds}s</p>
            </div>
            <div>
              <span className="font-medium">Retries:</span>
              <p className="text-gray-600">{step.max_retries}</p>
            </div>
            <div>
              <span className="font-medium">On Failure:</span>
              <p className="text-gray-600">{step.on_failure}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Step Editor Modal
 */
function StepEditorModal({
  step,
  onSave,
  onCancel,
}: {
  step: WorkflowStep | null;
  onSave: (step: WorkflowStep) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<WorkflowStep>>(
    step || {
      id: `step-${Date.now()}`,
      name: '',
      type: 'agent-task',
      assigned_to: [],
      inputs: [],
      outputs: [],
      task_description: '',
      success_criteria: '',
      timeout_seconds: 30,
      max_retries: 1,
      on_failure: 'escalate',
    }
  );

  const handleSubmit = () => {
    if (!form.name || !form.id) return;

    onSave(form as WorkflowStep);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-96 overflow-y-auto p-6">
        <h3 className="text-xl font-bold mb-4">
          {step ? 'Edit Step' : 'Add New Step'}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Step Name *</label>
              <input
                type="text"
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Intake & Categorization"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={form.type || ''}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="agent-task">Agent Task</option>
                <option value="decision">Decision Gate</option>
                <option value="quality-gate">Quality Gate</option>
                <option value="parallel">Parallel</option>
                <option value="human-input">Human Input</option>
                <option value="error-recovery">Error Recovery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Task Description *
            </label>
            <textarea
              value={form.task_description || ''}
              onChange={(e) =>
                setForm({ ...form, task_description: e.target.value })
              }
              placeholder="What should happen in this step?"
              rows={2}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Success Criteria
            </label>
            <textarea
              value={form.success_criteria || ''}
              onChange={(e) =>
                setForm({ ...form, success_criteria: e.target.value })
              }
              placeholder="How do we know this step succeeded?"
              rows={2}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Timeout (seconds)
              </label>
              <input
                type="number"
                value={form.timeout_seconds || 30}
                onChange={(e) =>
                  setForm({ ...form, timeout_seconds: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Retries</label>
              <input
                type="number"
                value={form.max_retries || 1}
                onChange={(e) =>
                  setForm({ ...form, max_retries: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">On Failure</label>
              <select
                value={form.on_failure || ''}
                onChange={(e) => setForm({ ...form, on_failure: e.target.value as any })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="escalate">Escalate</option>
                <option value="parallel-agent">Parallel Agent</option>
                <option value="skip">Skip</option>
                <option value="human-input">Human Input</option>
              </select>
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
              {step ? 'Save Changes' : 'Add Step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
