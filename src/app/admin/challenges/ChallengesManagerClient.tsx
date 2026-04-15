'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Plus,
  Pencil,
  Trash2,
  X,
  Calendar,
  Loader2,
  Save,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

interface Challenge {
  _id: string;
  type: 'quiz' | 'scenario' | 'mini-simulation';
  title: string;
  content: Record<string, unknown>;
  xpReward: number;
  date: string | null;
  requiredChaptersCompleted: number;
}

interface ChallengeForm {
  title: string;
  type: 'quiz' | 'scenario' | 'mini-simulation';
  date: string;
  xpReward: number;
  requiredChaptersCompleted: number;
  // Exercise-like content
  prompt: string;
  options: Array<{ text: string; isCorrect: boolean }>;
  explanation: string;
}

const emptyForm: ChallengeForm = {
  title: '',
  type: 'quiz',
  date: '',
  xpReward: 25,
  requiredChaptersCompleted: 0,
  prompt: '',
  options: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
  ],
  explanation: '',
};

const typeVariant: Record<string, 'success' | 'warning' | 'info'> = {
  quiz: 'success',
  scenario: 'warning',
  'mini-simulation': 'info',
};

export default function ChallengesManagerClient() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ChallengeForm>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/challenges');
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  function openCreateForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(challenge: Challenge) {
    const content = challenge.content || {};
    setForm({
      title: challenge.title,
      type: challenge.type,
      date: challenge.date || '',
      xpReward: challenge.xpReward,
      requiredChaptersCompleted: challenge.requiredChaptersCompleted,
      prompt: (content as Record<string, string>).prompt || '',
      options: (content as Record<string, Array<{ text: string; isCorrect: boolean }>>).options || [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
      ],
      explanation: (content as Record<string, string>).explanation || '',
    });
    setEditingId(challenge._id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  function updateFormOption(index: number, field: string, value: unknown) {
    const newOptions = [...form.options];
    if (field === 'text') newOptions[index] = { ...newOptions[index], text: value as string };
    if (field === 'isCorrect') newOptions[index] = { ...newOptions[index], isCorrect: value as boolean };
    setForm({ ...form, options: newOptions });
  }

  function addFormOption() {
    setForm({ ...form, options: [...form.options, { text: '', isCorrect: false }] });
  }

  function removeFormOption(index: number) {
    setForm({ ...form, options: form.options.filter((_, i) => i !== index) });
  }

  async function handleSave() {
    if (!form.title || !form.type || !form.xpReward) return;

    setSaving(true);
    try {
      const body = {
        title: form.title,
        type: form.type,
        date: form.date || null,
        xpReward: form.xpReward,
        requiredChaptersCompleted: form.requiredChaptersCompleted,
        content: {
          prompt: form.prompt,
          options: form.options,
          explanation: form.explanation,
        },
      };

      let res: Response;

      if (editingId) {
        res = await fetch(`/api/admin/challenges/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/admin/challenges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        closeForm();
        fetchChallenges();
      }
    } catch {
      // Silently fail
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this challenge?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/challenges/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchChallenges();
      }
    } catch {
      // Silently fail
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Swords className="w-7 h-7 text-primary" />
            <h1 className="font-display text-2xl font-bold text-dark">
              Daily Challenges
            </h1>
          </div>
          <p className="text-muted font-body text-sm">
            Manage daily challenges for learners
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreateForm}>
          <Plus className="w-4 h-4" />
          New Challenge
        </Button>
      </div>

      {/* Form modal/overlay */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card variant="elevated" className="!p-6 border-2 border-primary/20">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-base font-semibold text-dark">
                  {editingId ? 'Edit Challenge' : 'Create Challenge'}
                </h3>
                <button onClick={closeForm} className="p-1 text-muted hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Challenge title"
                />

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-dark/80 font-body block mb-1.5">
                      Type
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value as ChallengeForm['type'] })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="quiz">Quiz</option>
                      <option value="scenario">Scenario</option>
                      <option value="mini-simulation">Mini Simulation</option>
                    </select>
                  </div>
                  <Input
                    label="Date (optional)"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                  <Input
                    label="XP Reward"
                    type="number"
                    value={form.xpReward}
                    onChange={(e) =>
                      setForm({ ...form, xpReward: Number(e.target.value) })
                    }
                  />
                  <Input
                    label="Req. Chapters"
                    type="number"
                    value={form.requiredChaptersCompleted}
                    onChange={(e) =>
                      setForm({ ...form, requiredChaptersCompleted: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-dark/80 font-body block mb-1.5">
                    Prompt / Question
                  </label>
                  <textarea
                    value={form.prompt}
                    onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                    placeholder="What question or scenario should learners tackle?"
                  />
                </div>

                {/* Options */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-dark/80 font-body">
                      Answer Options
                    </label>
                    <button
                      onClick={addFormOption}
                      className="text-xs text-primary font-body font-medium hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={(e) => updateFormOption(i, 'isCorrect', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30 shrink-0"
                          title="Correct answer"
                        />
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => updateFormOption(i, 'text', e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <button
                          onClick={() => removeFormOption(i)}
                          className="p-1 text-error/40 hover:text-error shrink-0"
                          disabled={form.options.length <= 2}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-dark/80 font-body block mb-1.5">
                    Explanation
                  </label>
                  <textarea
                    value={form.explanation}
                    onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                    placeholder="Why is this the correct answer?"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" onClick={closeForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    {editingId ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-muted animate-spin" />
        </div>
      )}

      {/* List */}
      {!loading && (
        <Card variant="default" className="!p-0 overflow-hidden">
          {challenges.length === 0 ? (
            <div className="text-center py-12">
              <Swords className="w-8 h-8 text-muted/30 mx-auto mb-3" />
              <p className="text-sm text-muted font-body">
                No challenges created yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {challenges.map((challenge) => (
                <div
                  key={challenge._id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Type badge */}
                  <Badge variant={typeVariant[challenge.type] || 'default'}>
                    {challenge.type}
                  </Badge>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-dark truncate">
                      {challenge.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {challenge.date && (
                        <span className="text-xs text-muted font-body flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {challenge.date}
                        </span>
                      )}
                      {challenge.requiredChaptersCompleted > 0 && (
                        <span className="text-xs text-muted font-body">
                          Req: {challenge.requiredChaptersCompleted} ch.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* XP */}
                  <span className="font-mono text-sm font-bold text-accent tabular-nums shrink-0">
                    {challenge.xpReward} XP
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditForm(challenge)}
                      className="p-2 rounded-md text-muted hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(challenge._id)}
                      disabled={deleting === challenge._id}
                      className="p-2 rounded-md text-muted hover:text-error hover:bg-error/5 transition-colors disabled:opacity-50"
                    >
                      {deleting === challenge._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
