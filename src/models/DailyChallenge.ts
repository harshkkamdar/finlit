import mongoose, { Schema, model, models } from "mongoose";

const DailyChallengeSchema = new Schema({
  date: { type: String, default: null },
  type: {
    type: String,
    enum: ["quiz", "scenario", "mini-simulation"],
    required: true,
  },
  title: { type: String, required: true },
  content: { type: Schema.Types.Mixed, default: {} },
  xpReward: { type: Number, required: true },
  requiredChaptersCompleted: { type: Number, default: 0 },
});

const DailyChallenge =
  models.DailyChallenge || model("DailyChallenge", DailyChallengeSchema);

export default DailyChallenge;
