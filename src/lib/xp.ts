// ── Constants ─────────────────────────────────────────────────────────

export const LESSON_COMPLETION_XP = 10;
export const DAILY_CHALLENGE_CORRECT_XP = 25;
export const DAILY_CHALLENGE_ATTEMPT_XP = 10;
export const STREAK_7_BONUS = 50;
export const STREAK_30_BONUS = 200;

// ── Exercise XP ───────────────────────────────────────────────────────

export function calculateExerciseXP(score: number, maxScore: number): number {
  if (maxScore === 0) return 0;

  const pct = (score / maxScore) * 100;

  if (pct >= 100) return 50;
  if (pct >= 90) return 40;
  if (pct >= 70) return 30;
  if (pct >= 50) return 20;
  return 10;
}

// ── Simulation XP ─────────────────────────────────────────────────────

export function calculateSimulationXP(
  walletFinal: number,
  optimalWallet: number,
  badgeThreshold: number
): { xp: number; earnedBadge: boolean } {
  const earnedBadge = walletFinal >= badgeThreshold;

  if (earnedBadge) {
    return { xp: 100, earnedBadge: true };
  }

  return { xp: 50, earnedBadge: false };
}

// ── League Calculation ────────────────────────────────────────────────

export function calculateLeague(totalXP: number): string {
  if (totalXP >= 4000) return "Diamond";
  if (totalXP >= 1500) return "Gold";
  if (totalXP >= 500) return "Silver";
  return "Bronze";
}
