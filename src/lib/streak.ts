// ── IST Timezone Helpers ──────────────────────────────────────────────

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // UTC+5:30

function toISTDate(date: Date): Date {
  return new Date(date.getTime() + IST_OFFSET_MS);
}

function getISTDateString(date: Date): string {
  const ist = toISTDate(date);
  return ist.toISOString().split("T")[0];
}

function daysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
}

// ── Streak Update ─────────────────────────────────────────────────────

interface StreakInput {
  currentStreak: number;
  longestStreak: number;
  graceAvailable: boolean;
  lastActiveDate: Date | null;
}

interface StreakOutput {
  currentStreak: number;
  longestStreak: number;
  graceAvailable: boolean;
  lastActiveDate: Date;
}

export function updateStreak(user: StreakInput): StreakOutput {
  const now = new Date();
  const todayIST = getISTDateString(now);

  let { currentStreak, longestStreak, graceAvailable } = user;

  // First ever activity
  if (!user.lastActiveDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(longestStreak, 1),
      graceAvailable,
      lastActiveDate: now,
    };
  }

  const lastActiveDateIST = getISTDateString(user.lastActiveDate);
  const diff = daysDifference(todayIST, lastActiveDateIST);

  if (diff === 0) {
    // Already active today -- no change
    return {
      currentStreak,
      longestStreak,
      graceAvailable,
      lastActiveDate: now,
    };
  }

  if (diff === 1) {
    // Active yesterday -- increment streak
    currentStreak += 1;
    longestStreak = Math.max(longestStreak, currentStreak);

    // Grace regenerates after 7 consecutive active days
    if (currentStreak >= 7) {
      graceAvailable = true;
    }

    return {
      currentStreak,
      longestStreak,
      graceAvailable,
      lastActiveDate: now,
    };
  }

  if (diff === 2 && graceAvailable) {
    // Missed one day but grace is available -- freeze streak (no increment)
    graceAvailable = false;

    return {
      currentStreak,
      longestStreak,
      graceAvailable,
      lastActiveDate: now,
    };
  }

  // Missed too many days -- reset streak
  return {
    currentStreak: 1,
    longestStreak,
    graceAvailable: false,
    lastActiveDate: now,
  };
}
