'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Play,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface LessonItem {
  _id: string;
  chapterId: string;
  lessonNumber: string;
  title: string;
  estimatedMinutes: number;
  order: number;
}

interface ChapterItem {
  _id: string;
  number: number;
  title: string;
  colorAccent: string;
  lessons: string[];
  simulationId: string | null;
}

interface SimulationItem {
  _id: string;
  title: string;
  description: string;
  chapterId: string;
}

type Tab = 'lessons' | 'simulations';

export default function AdminContentClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('lessons');
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [simulations, setSimulations] = useState<SimulationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const chaptersRes = await fetch('/api/chapters');
      if (chaptersRes.ok) {
        const chaptersData = await chaptersRes.json();
        setChapters(chaptersData);

        // Fetch all lessons per chapter
        const lessonPromises = chaptersData.map(async (ch: ChapterItem) => {
          const res = await fetch(`/api/chapters/${ch._id}`);
          if (res.ok) {
            const data = await res.json();
            return (data.lessons || []).map((l: LessonItem) => ({
              ...l,
              chapterId: ch._id,
            }));
          }
          return [];
        });

        const allLessons = (await Promise.all(lessonPromises)).flat();
        setLessons(allLessons);

        // Gather simulations from chapters
        const sims: SimulationItem[] = [];
        for (const ch of chaptersData) {
          if (ch.simulationId) {
            try {
              const simRes = await fetch(`/api/simulations/${ch.simulationId}`);
              if (simRes.ok) {
                const simData = await simRes.json();
                sims.push({ ...simData, chapterId: ch._id });
              }
            } catch {
              // Skip failed simulations
            }
          }
        }
        setSimulations(sims);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Group lessons by chapter
  const chapterMap = new Map<string, ChapterItem>();
  for (const ch of chapters) {
    chapterMap.set(ch._id, ch);
  }

  const lessonsByChapter = new Map<string, LessonItem[]>();
  for (const lesson of lessons) {
    const chId = lesson.chapterId;
    if (!lessonsByChapter.has(chId)) {
      lessonsByChapter.set(chId, []);
    }
    lessonsByChapter.get(chId)!.push(lesson);
  }

  // Sort lessons within each chapter by order
  for (const [, chLessons] of lessonsByChapter) {
    chLessons.sort((a, b) => a.order - b.order);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="w-7 h-7 text-primary" />
          <h1 className="font-display text-2xl font-bold text-dark">
            Content Management
          </h1>
        </div>
        <p className="text-muted font-body text-sm">
          Edit lessons, exercises, and simulations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab('lessons')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-body font-medium transition-colors
            ${tab === 'lessons' ? 'bg-white text-dark shadow-sm' : 'text-muted hover:text-dark'}
          `}
        >
          <BookOpen className="w-4 h-4" />
          Lessons
        </button>
        <button
          onClick={() => setTab('simulations')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-body font-medium transition-colors
            ${tab === 'simulations' ? 'bg-white text-dark shadow-sm' : 'text-muted hover:text-dark'}
          `}
        >
          <Play className="w-4 h-4" />
          Simulations
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-muted animate-spin" />
        </div>
      )}

      {/* Lessons Tab */}
      {!loading && tab === 'lessons' && (
        <div className="space-y-6">
          {chapters
            .sort((a, b) => a.number - b.number)
            .map((ch) => {
              const chLessons = lessonsByChapter.get(ch._id) || [];

              return (
                <Card key={ch._id} variant="default" className="!p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white"
                      style={{ backgroundColor: ch.colorAccent }}
                    >
                      {ch.number}
                    </div>
                    <h3 className="font-display text-base font-semibold text-dark">
                      {ch.title}
                    </h3>
                    <Badge variant="default">
                      {chLessons.length} lesson{chLessons.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  {chLessons.length === 0 ? (
                    <p className="text-sm text-muted/60 font-body pl-9">
                      No lessons found
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {chLessons.map((lesson) => (
                        <motion.div
                          key={lesson._id}
                          whileHover={{ x: 2 }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ml-6"
                          onClick={() =>
                            router.push(`/admin/content/lessons/${lesson._id}`)
                          }
                        >
                          <span className="text-xs font-mono text-muted w-10 shrink-0">
                            {lesson.lessonNumber}
                          </span>
                          <span className="flex-1 text-sm font-body text-dark truncate">
                            {lesson.title}
                          </span>
                          <span className="text-xs text-muted font-body shrink-0">
                            {lesson.estimatedMinutes} min
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted/40 shrink-0" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
        </div>
      )}

      {/* Simulations Tab */}
      {!loading && tab === 'simulations' && (
        <Card variant="default" className="!p-0 overflow-hidden">
          {simulations.length === 0 ? (
            <div className="text-center py-12">
              <Play className="w-8 h-8 text-muted/30 mx-auto mb-3" />
              <p className="text-sm text-muted font-body">
                No simulations found
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {simulations.map((sim) => {
                const ch = chapterMap.get(sim.chapterId);

                return (
                  <motion.div
                    key={sim._id}
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() =>
                      router.push(`/admin/content/simulations/${sim._id}`)
                    }
                  >
                    <Play className="w-5 h-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-medium text-dark truncate">
                        {sim.title}
                      </p>
                      <p className="text-xs text-muted font-body truncate">
                        {sim.description}
                      </p>
                    </div>
                    {ch && (
                      <Badge variant="default">
                        Ch {ch.number}
                      </Badge>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted/40 shrink-0" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
