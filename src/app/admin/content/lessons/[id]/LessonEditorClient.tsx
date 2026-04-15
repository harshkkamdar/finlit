'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

interface ContentBlock {
  type: 'text' | 'callout' | 'key-term' | 'image' | 'interactive';
  data: Record<string, unknown>;
}

interface ExerciseOption {
  text: string;
  isCorrect: boolean;
}

interface Exercise {
  type: 'mcq-single' | 'mcq-multi' | 'true-false' | 'scenario' | 'sorting' | 'calculator';
  prompt: string;
  options: ExerciseOption[];
  explanation: string;
  xpValue: number;
}

interface LessonData {
  _id: string;
  chapterId: string;
  lessonNumber: string;
  title: string;
  content: { blocks: ContentBlock[] };
  exercises: Exercise[];
  estimatedMinutes: number;
  order: number;
}

const blockTypes: ContentBlock['type'][] = ['text', 'callout', 'key-term', 'image', 'interactive'];
const exerciseTypes: Exercise['type'][] = ['mcq-single', 'mcq-multi', 'true-false', 'scenario', 'sorting', 'calculator'];

export default function LessonEditorClient({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Editable state
  const [title, setTitle] = useState('');
  const [lessonNumber, setLessonNumber] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(5);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Expanded state for accordions
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set());
  const [expandedExercises, setExpandedExercises] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch(`/api/admin/lessons/${lessonId}`);
        if (res.ok) {
          const data = await res.json();
          setLesson(data);
          setTitle(data.title);
          setLessonNumber(data.lessonNumber);
          setEstimatedMinutes(data.estimatedMinutes);
          setBlocks(data.content?.blocks || []);
          setExercises(data.exercises || []);
        } else {
          setError('Failed to load lesson');
        }
      } catch {
        setError('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [lessonId]);

  function toggleBlock(index: number) {
    setExpandedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function toggleExercise(index: number) {
    setExpandedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  // Block operations
  function addBlock() {
    const newBlock: ContentBlock = { type: 'text', data: { body: '' } };
    setBlocks([...blocks, newBlock]);
    setExpandedBlocks((prev) => new Set(prev).add(blocks.length));
  }

  function removeBlock(index: number) {
    setBlocks(blocks.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: 'up' | 'down') {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  }

  function updateBlock(index: number, field: string, value: unknown) {
    const newBlocks = [...blocks];
    if (field === 'type') {
      newBlocks[index] = { ...newBlocks[index], type: value as ContentBlock['type'] };
    } else {
      newBlocks[index] = {
        ...newBlocks[index],
        data: { ...newBlocks[index].data, [field]: value },
      };
    }
    setBlocks(newBlocks);
  }

  // Exercise operations
  function addExercise() {
    const newExercise: Exercise = {
      type: 'mcq-single',
      prompt: '',
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
      ],
      explanation: '',
      xpValue: 10,
    };
    setExercises([...exercises, newExercise]);
    setExpandedExercises((prev) => new Set(prev).add(exercises.length));
  }

  function removeExercise(index: number) {
    setExercises(exercises.filter((_, i) => i !== index));
  }

  function updateExercise(index: number, field: string, value: unknown) {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  }

  function addOption(exerciseIndex: number) {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].options.push({ text: '', isCorrect: false });
    setExercises(newExercises);
  }

  function removeOption(exerciseIndex: number, optionIndex: number) {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].options = newExercises[exerciseIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setExercises(newExercises);
  }

  function updateOption(exerciseIndex: number, optionIndex: number, field: string, value: unknown) {
    const newExercises = [...exercises];
    const opt = { ...newExercises[exerciseIndex].options[optionIndex] };
    if (field === 'text') opt.text = value as string;
    if (field === 'isCorrect') opt.isCorrect = value as boolean;
    newExercises[exerciseIndex].options[optionIndex] = opt;
    setExercises(newExercises);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError('');

    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          lessonNumber,
          estimatedMinutes,
          content: { blocks },
          exercises,
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

  if (error && !lesson) {
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
          <Button variant="secondary" size="sm" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4" />
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Preview mode */}
      {showPreview && (
        <Card variant="elevated" className="!p-6">
          <h2 className="font-display text-xl font-bold text-dark mb-1">{title}</h2>
          <p className="text-sm text-muted font-body mb-4">
            Lesson {lessonNumber} | {estimatedMinutes} min
          </p>
          <div className="space-y-4">
            {blocks.map((block, i) => (
              <div key={i} className="text-sm font-body text-dark">
                <Badge variant="default" className="mb-1">{block.type}</Badge>
                <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-auto mt-1">
                  {JSON.stringify(block.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
          {exercises.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-display text-base font-semibold text-dark mb-3">
                Exercises ({exercises.length})
              </h3>
              {exercises.map((ex, i) => (
                <div key={i} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="info" className="mb-2">{ex.type}</Badge>
                  <p className="text-sm font-body font-medium">{ex.prompt}</p>
                  <ul className="mt-2 space-y-1">
                    {ex.options.map((opt, j) => (
                      <li key={j} className={`text-xs font-body ${opt.isCorrect ? 'text-primary font-semibold' : 'text-muted'}`}>
                        {opt.isCorrect ? '* ' : '  '}{opt.text}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted mt-2 italic">{ex.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Edit mode */}
      {!showPreview && (
        <>
          {/* Basic fields */}
          <Card variant="default" className="!p-5">
            <h3 className="font-display text-sm font-semibold text-dark mb-4 uppercase tracking-wide">
              Lesson Details
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Input
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Lesson #"
                  value={lessonNumber}
                  onChange={(e) => setLessonNumber(e.target.value)}
                />
                <Input
                  label="Est. Minutes"
                  type="number"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                />
              </div>
            </div>
          </Card>

          {/* Content Blocks */}
          <Card variant="default" className="!p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-semibold text-dark uppercase tracking-wide">
                Content Blocks ({blocks.length})
              </h3>
              <Button variant="secondary" size="sm" onClick={addBlock}>
                <Plus className="w-4 h-4" />
                Add Block
              </Button>
            </div>

            <div className="space-y-3">
              {blocks.map((block, index) => {
                const isExpanded = expandedBlocks.has(index);

                return (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-lg overflow-hidden"
                  >
                    {/* Block header */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50/50 cursor-pointer"
                      onClick={() => toggleBlock(index)}
                    >
                      <GripVertical className="w-4 h-4 text-muted/40 shrink-0" />
                      <Badge variant="default">{block.type}</Badge>
                      <span className="flex-1 text-xs text-muted font-mono truncate">
                        {block.data?.body
                          ? String(block.data.body).substring(0, 60) + '...'
                          : block.data?.term
                            ? String(block.data.term)
                            : 'Empty block'}
                      </span>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }}
                          disabled={index === 0}
                          className="p-1 rounded text-muted/40 hover:text-muted disabled:opacity-30"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }}
                          disabled={index === blocks.length - 1}
                          className="p-1 rounded text-muted/40 hover:text-muted disabled:opacity-30"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeBlock(index); }}
                          className="p-1 rounded text-error/40 hover:text-error"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Block content */}
                    {isExpanded && (
                      <div className="px-4 py-4 space-y-3 border-t border-gray-100">
                        <div>
                          <label className="text-xs font-medium text-muted font-body block mb-1">
                            Block Type
                          </label>
                          <select
                            value={block.type}
                            onChange={(e) => updateBlock(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                          >
                            {blockTypes.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        {/* Dynamic data fields based on type */}
                        {block.type === 'text' && (
                          <div>
                            <label className="text-xs font-medium text-muted font-body block mb-1">Body</label>
                            <textarea
                              value={String(block.data?.body || '')}
                              onChange={(e) => updateBlock(index, 'body', e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                            />
                          </div>
                        )}

                        {block.type === 'callout' && (
                          <>
                            <Input
                              label="Title"
                              value={String(block.data?.title || '')}
                              onChange={(e) => updateBlock(index, 'title', e.target.value)}
                            />
                            <div>
                              <label className="text-xs font-medium text-muted font-body block mb-1">Body</label>
                              <textarea
                                value={String(block.data?.body || '')}
                                onChange={(e) => updateBlock(index, 'body', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                              />
                            </div>
                          </>
                        )}

                        {block.type === 'key-term' && (
                          <>
                            <Input
                              label="Term"
                              value={String(block.data?.term || '')}
                              onChange={(e) => updateBlock(index, 'term', e.target.value)}
                            />
                            <div>
                              <label className="text-xs font-medium text-muted font-body block mb-1">Definition</label>
                              <textarea
                                value={String(block.data?.definition || '')}
                                onChange={(e) => updateBlock(index, 'definition', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                              />
                            </div>
                          </>
                        )}

                        {block.type === 'image' && (
                          <>
                            <Input
                              label="Image URL"
                              value={String(block.data?.url || '')}
                              onChange={(e) => updateBlock(index, 'url', e.target.value)}
                            />
                            <Input
                              label="Alt Text"
                              value={String(block.data?.alt || '')}
                              onChange={(e) => updateBlock(index, 'alt', e.target.value)}
                            />
                            <Input
                              label="Caption"
                              value={String(block.data?.caption || '')}
                              onChange={(e) => updateBlock(index, 'caption', e.target.value)}
                            />
                          </>
                        )}

                        {block.type === 'interactive' && (
                          <>
                            <Input
                              label="Interactive Type"
                              value={String(block.data?.interactiveType || '')}
                              onChange={(e) => updateBlock(index, 'interactiveType', e.target.value)}
                              placeholder="e.g., slider, toggle, calculator"
                            />
                            <div>
                              <label className="text-xs font-medium text-muted font-body block mb-1">Config (JSON)</label>
                              <textarea
                                value={JSON.stringify(block.data?.config || {}, null, 2)}
                                onChange={(e) => {
                                  try {
                                    updateBlock(index, 'config', JSON.parse(e.target.value));
                                  } catch {
                                    // Invalid JSON, keep text
                                  }
                                }}
                                rows={4}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Exercises */}
          <Card variant="default" className="!p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-semibold text-dark uppercase tracking-wide">
                Exercises ({exercises.length})
              </h3>
              <Button variant="secondary" size="sm" onClick={addExercise}>
                <Plus className="w-4 h-4" />
                Add Exercise
              </Button>
            </div>

            <div className="space-y-3">
              {exercises.map((exercise, exIndex) => {
                const isExpanded = expandedExercises.has(exIndex);

                return (
                  <div
                    key={exIndex}
                    className="border border-gray-100 rounded-lg overflow-hidden"
                  >
                    {/* Exercise header */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50/50 cursor-pointer"
                      onClick={() => toggleExercise(exIndex)}
                    >
                      <Badge variant="info">{exercise.type}</Badge>
                      <span className="flex-1 text-sm text-dark font-body truncate">
                        {exercise.prompt || 'Untitled exercise'}
                      </span>
                      <span className="text-xs font-mono text-accent shrink-0">
                        {exercise.xpValue} XP
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeExercise(exIndex); }}
                        className="p-1 rounded text-error/40 hover:text-error shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Exercise content */}
                    {isExpanded && (
                      <div className="px-4 py-4 space-y-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-muted font-body block mb-1">
                              Exercise Type
                            </label>
                            <select
                              value={exercise.type}
                              onChange={(e) =>
                                updateExercise(exIndex, 'type', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                              {exerciseTypes.map((t) => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                          <Input
                            label="XP Value"
                            type="number"
                            value={exercise.xpValue}
                            onChange={(e) =>
                              updateExercise(exIndex, 'xpValue', Number(e.target.value))
                            }
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted font-body block mb-1">
                            Prompt
                          </label>
                          <textarea
                            value={exercise.prompt}
                            onChange={(e) => updateExercise(exIndex, 'prompt', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                          />
                        </div>

                        {/* Options */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-muted font-body">
                              Options
                            </label>
                            <button
                              onClick={() => addOption(exIndex)}
                              className="text-xs text-primary font-body font-medium hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Add
                            </button>
                          </div>
                          <div className="space-y-2">
                            {exercise.options.map((opt, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={opt.isCorrect}
                                  onChange={(e) =>
                                    updateOption(exIndex, optIndex, 'isCorrect', e.target.checked)
                                  }
                                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30 shrink-0"
                                  title="Correct answer"
                                />
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) =>
                                    updateOption(exIndex, optIndex, 'text', e.target.value)
                                  }
                                  placeholder={`Option ${optIndex + 1}`}
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                <button
                                  onClick={() => removeOption(exIndex, optIndex)}
                                  className="p-1 text-error/40 hover:text-error shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted font-body block mb-1">
                            Explanation
                          </label>
                          <textarea
                            value={exercise.explanation}
                            onChange={(e) => updateExercise(exIndex, 'explanation', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </motion.div>
  );
}
