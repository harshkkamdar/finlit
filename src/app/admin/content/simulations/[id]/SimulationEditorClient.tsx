'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GitBranch,
  Loader2,
  Flag,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

interface SimulationChoice {
  text: string;
  nextNodeId: string;
  walletImpact: number;
  feedback: string;
}

interface SimulationNode {
  nodeId: string;
  narrative: string;
  timeSkip: string | null;
  choices: SimulationChoice[];
  isEnd: boolean;
}

interface SimulationData {
  _id: string;
  chapterId: string;
  title: string;
  description: string;
  startingWallet: number | null;
  optimalWalletOutcome: number | null;
  startNodeId: string;
  nodes: SimulationNode[];
}

export default function SimulationEditorClient({
  simulationId,
}: {
  simulationId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Editable state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingWallet, setStartingWallet] = useState<number>(0);
  const [optimalWalletOutcome, setOptimalWalletOutcome] = useState<number>(0);
  const [startNodeId, setStartNodeId] = useState('');
  const [nodes, setNodes] = useState<SimulationNode[]>([]);

  // Expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchSimulation() {
      try {
        const res = await fetch(`/api/admin/simulations/${simulationId}`);
        if (res.ok) {
          const data: SimulationData = await res.json();
          setTitle(data.title);
          setDescription(data.description);
          setStartingWallet(data.startingWallet || 0);
          setOptimalWalletOutcome(data.optimalWalletOutcome || 0);
          setStartNodeId(data.startNodeId);
          setNodes(data.nodes || []);
        } else {
          setError('Failed to load simulation');
        }
      } catch {
        setError('Failed to load simulation');
      } finally {
        setLoading(false);
      }
    }

    fetchSimulation();
  }, [simulationId]);

  // List of node IDs for dropdowns
  const nodeIdOptions = useMemo(
    () => nodes.map((n) => n.nodeId),
    [nodes]
  );

  function toggleNode(index: number) {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  // Node operations
  function addNode() {
    const newNodeId = `node_${nodes.length + 1}`;
    const newNode: SimulationNode = {
      nodeId: newNodeId,
      narrative: '',
      timeSkip: null,
      choices: [],
      isEnd: false,
    };
    setNodes([...nodes, newNode]);
    setExpandedNodes((prev) => new Set(prev).add(nodes.length));
  }

  function removeNode(index: number) {
    setNodes(nodes.filter((_, i) => i !== index));
  }

  function updateNode(index: number, field: string, value: unknown) {
    const newNodes = [...nodes];
    newNodes[index] = { ...newNodes[index], [field]: value };
    setNodes(newNodes);
  }

  // Choice operations
  function addChoice(nodeIndex: number) {
    const newNodes = [...nodes];
    newNodes[nodeIndex].choices.push({
      text: '',
      nextNodeId: '',
      walletImpact: 0,
      feedback: '',
    });
    setNodes(newNodes);
  }

  function removeChoice(nodeIndex: number, choiceIndex: number) {
    const newNodes = [...nodes];
    newNodes[nodeIndex].choices = newNodes[nodeIndex].choices.filter(
      (_, i) => i !== choiceIndex
    );
    setNodes(newNodes);
  }

  function updateChoice(
    nodeIndex: number,
    choiceIndex: number,
    field: string,
    value: unknown
  ) {
    const newNodes = [...nodes];
    const choice = { ...newNodes[nodeIndex].choices[choiceIndex] };
    if (field === 'text') choice.text = value as string;
    if (field === 'nextNodeId') choice.nextNodeId = value as string;
    if (field === 'walletImpact') choice.walletImpact = value as number;
    if (field === 'feedback') choice.feedback = value as string;
    newNodes[nodeIndex].choices[choiceIndex] = choice;
    setNodes(newNodes);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError('');

    try {
      const res = await fetch(`/api/admin/simulations/${simulationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          startingWallet,
          optimalWalletOutcome,
          startNodeId,
          nodes,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save');
      }
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-muted animate-spin" />
      </div>
    );
  }

  if (error && nodes.length === 0 && !title) {
    return (
      <div className="text-center py-20">
        <p className="text-error font-body">{error}</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push('/admin/content')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Content
        </Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/content')}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-primary font-body font-medium"
            >
              Saved!
            </motion.span>
          )}
          {error && !saving && (
            <span className="text-sm text-error font-body">{error}</span>
          )}
          <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Basic fields */}
      <Card variant="default" className="!p-5">
        <h3 className="font-display text-sm font-semibold text-dark mb-4 uppercase tracking-wide">
          Simulation Details
        </h3>
        <div className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>
            <label className="text-sm font-medium text-dark/80 font-body block mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Starting Wallet"
              type="number"
              value={startingWallet}
              onChange={(e) => setStartingWallet(Number(e.target.value))}
            />
            <Input
              label="Optimal Wallet Outcome"
              type="number"
              value={optimalWalletOutcome}
              onChange={(e) => setOptimalWalletOutcome(Number(e.target.value))}
            />
            <div>
              <label className="text-sm font-medium text-dark/80 font-body block mb-1.5">
                Start Node
              </label>
              <select
                value={startNodeId}
                onChange={(e) => setStartNodeId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select...</option>
                {nodeIdOptions.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Visual node map */}
      <Card variant="bordered" className="!p-4">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className="w-4 h-4 text-primary" />
          <h3 className="font-display text-sm font-semibold text-dark">
            Node Map
          </h3>
          <Badge variant="default">{nodes.length} nodes</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {nodes.map((node, i) => (
            <button
              key={i}
              onClick={() => {
                setExpandedNodes((prev) => new Set(prev).add(i));
                document.getElementById(`node-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors
                ${node.nodeId === startNodeId
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : node.isEnd
                    ? 'bg-accent/10 border-accent/30 text-accent'
                    : 'bg-gray-50 border-gray-200 text-muted hover:border-primary/30'
                }
              `}
            >
              {node.nodeId}
              {node.isEnd && <Flag className="w-3 h-3 inline ml-1" />}
            </button>
          ))}
        </div>
      </Card>

      {/* Nodes */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-dark uppercase tracking-wide">
          Nodes ({nodes.length})
        </h3>
        <Button variant="secondary" size="sm" onClick={addNode}>
          <Plus className="w-4 h-4" />
          Add Node
        </Button>
      </div>

      <div className="space-y-3">
        {nodes.map((node, nodeIndex) => {
          const isExpanded = expandedNodes.has(nodeIndex);

          return (
            <Card
              key={nodeIndex}
              id={`node-${nodeIndex}`}
              variant="default"
              className="!p-0 overflow-hidden"
            >
              {/* Node header */}
              <div
                className="flex items-center gap-3 px-4 py-3 bg-gray-50/50 cursor-pointer"
                onClick={() => toggleNode(nodeIndex)}
              >
                <span className="font-mono text-xs font-bold text-primary">
                  {node.nodeId}
                </span>
                {node.isEnd && (
                  <Badge variant="warning">End Node</Badge>
                )}
                {node.nodeId === startNodeId && (
                  <Badge variant="success">Start</Badge>
                )}
                <span className="flex-1 text-xs text-muted font-body truncate">
                  {node.narrative?.substring(0, 80) || 'No narrative'}
                </span>
                <span className="text-xs text-muted/60 font-mono shrink-0">
                  {node.choices.length} choice{node.choices.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeNode(nodeIndex); }}
                  className="p-1 text-error/40 hover:text-error shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted/40 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted/40 shrink-0" />
                )}
              </div>

              {/* Node content */}
              {isExpanded && (
                <div className="px-4 py-4 space-y-4 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="Node ID"
                      value={node.nodeId}
                      onChange={(e) => updateNode(nodeIndex, 'nodeId', e.target.value)}
                    />
                    <Input
                      label="Time Skip"
                      value={node.timeSkip || ''}
                      onChange={(e) => updateNode(nodeIndex, 'timeSkip', e.target.value || null)}
                      placeholder="e.g., 1 month later"
                    />
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 pb-2.5">
                        <input
                          type="checkbox"
                          checked={node.isEnd}
                          onChange={(e) => updateNode(nodeIndex, 'isEnd', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                        />
                        <span className="text-sm font-body text-dark">End Node</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-dark/80 font-body block mb-1.5">
                      Narrative
                    </label>
                    <textarea
                      value={node.narrative}
                      onChange={(e) => updateNode(nodeIndex, 'narrative', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                    />
                  </div>

                  {/* Choices */}
                  {!node.isEnd && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-dark/80 font-body">
                          Choices ({node.choices.length})
                        </label>
                        <button
                          onClick={() => addChoice(nodeIndex)}
                          className="text-xs text-primary font-body font-medium hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Choice
                        </button>
                      </div>

                      <div className="space-y-3">
                        {node.choices.map((choice, choiceIndex) => (
                          <div
                            key={choiceIndex}
                            className="p-3 bg-gray-50 rounded-lg space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono text-muted">
                                Choice {choiceIndex + 1}
                              </span>
                              <button
                                onClick={() => removeChoice(nodeIndex, choiceIndex)}
                                className="p-1 text-error/40 hover:text-error"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <Input
                              label="Text"
                              value={choice.text}
                              onChange={(e) =>
                                updateChoice(nodeIndex, choiceIndex, 'text', e.target.value)
                              }
                            />

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-medium text-muted font-body block mb-1">
                                  Next Node
                                </label>
                                <select
                                  value={choice.nextNodeId}
                                  onChange={(e) =>
                                    updateChoice(nodeIndex, choiceIndex, 'nextNodeId', e.target.value)
                                  }
                                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                  <option value="">Select...</option>
                                  {nodeIdOptions
                                    .filter((id) => id !== node.nodeId)
                                    .map((id) => (
                                      <option key={id} value={id}>{id}</option>
                                    ))}
                                </select>
                              </div>
                              <Input
                                label="Wallet Impact"
                                type="number"
                                value={choice.walletImpact}
                                onChange={(e) =>
                                  updateChoice(nodeIndex, choiceIndex, 'walletImpact', Number(e.target.value))
                                }
                              />
                            </div>

                            <div>
                              <label className="text-xs font-medium text-muted font-body block mb-1">
                                Feedback
                              </label>
                              <textarea
                                value={choice.feedback}
                                onChange={(e) =>
                                  updateChoice(nodeIndex, choiceIndex, 'feedback', e.target.value)
                                }
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
