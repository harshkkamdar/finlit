import { redirect, notFound } from 'next/navigation';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { auth } from '@/lib/auth';
import Simulation from '@/models/Simulation';
import Chapter from '@/models/Chapter';
import SimulationPageClient from '@/components/simulation/SimulationPage';
import type { SimulationNode } from '@/types';

export default async function SimulationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await dbConnect();

  const simulation = await Simulation.findById(id).lean();

  if (!simulation) {
    notFound();
  }

  const chapter = await Chapter.findById(simulation.chapterId)
    .select('_id number title colorAccent')
    .lean();

  if (!chapter) {
    notFound();
  }

  // Deep-serialize the entire simulation document for the client.
  // JSON round-trip strips Mongoose internals, ObjectId wrappers, etc.
  const raw = JSON.parse(JSON.stringify(simulation));

  const simulationData = {
    _id: raw._id as string,
    title: raw.title as string,
    description: raw.description as string,
    startingWallet: (raw.startingWallet ?? null) as number | null,
    optimalWalletOutcome: (raw.optimalWalletOutcome ?? null) as number | null,
    startNodeId: raw.startNodeId as string,
    badgeThreshold: (raw.badgeThreshold ?? {}) as Record<string, unknown>,
    nodes: raw.nodes as SimulationNode[],
    // Ch0
    walletLabel: (raw.walletLabel ?? null) as string | null,
    startingInventory: (raw.startingInventory ?? null) as string | null,
    // Ch1
    availableStocks: (raw.availableStocks ?? null) as Record<string, unknown> | null,
    // Ch3
    biasTracker: (raw.biasTracker ?? null) as Record<string, unknown> | null,
    // Ch5
    creditLimit: (raw.creditLimit ?? null) as number | null,
    creditBalance: (raw.creditBalance ?? null) as number | null,
    monthlyIncome: (raw.monthlyIncome ?? null) as number | null,
    // Ch6
    scoringType: (raw.scoringType ?? 'wallet') as 'wallet' | 'points',
    startingScore: (raw.startingScore ?? null) as number | null,
    maxScore: (raw.maxScore ?? null) as number | null,
    // Badge
    badgeId: (raw.badgeId ?? null) as string | null,
    badgeName: (raw.badgeName ?? null) as string | null,
  };

  const chapterData = {
    _id: (chapter._id as { toString(): string }).toString(),
    number: chapter.number as number,
    title: chapter.title as string,
    colorAccent: (chapter.colorAccent ?? '#F5A623') as string,
  };

  return (
    <SimulationPageClient
      simulation={simulationData}
      chapter={chapterData}
    />
  );
}
