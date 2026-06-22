import mongoose, { Schema, model, models } from "mongoose";

const ExerciseResultSchema = new Schema(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    xpEarned: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const SimulationResultSchema = new Schema(
  {
    simulationId: {
      type: Schema.Types.ObjectId,
      ref: "Simulation",
      required: true,
    },
    score: { type: Number, required: true },
    walletFinal: { type: Number, required: true },
    path: [{ type: String }],
  },
  { _id: false }
);

const BadgeEarnedSchema = new Schema(
  {
    badgeId: { type: Schema.Types.ObjectId, ref: "Badge", required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DailyChallengeResultSchema = new Schema(
  {
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "DailyChallenge",
      required: true,
    },
    date: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    age: { type: Number, required: true },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    // Internal QA/test accounts. Excluded from every user-facing surface
    // (leaderboards) and from aggregate analytics so they can rack up any
    // amount of XP/badges without polluting real data. Still visible in the
    // admin user-management list so they remain manageable.
    isTestAccount: { type: Boolean, default: false },
    avatarSeed: { type: String, default: () => Math.random().toString(36).substring(2, 10) },
    xp: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
    graceAvailable: { type: Boolean, default: true },
    league: { type: String, default: "Bronze" },
    moneyPersonality: { type: String, default: null },
    chaptersCompleted: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
    lessonsCompleted: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
    simulationsCompleted: [SimulationResultSchema],
    exerciseResults: [ExerciseResultSchema],
    badges: [BadgeEarnedSchema],
    dailyChallengesCompleted: [DailyChallengeResultSchema],
    certificateId: { type: String, default: null },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
