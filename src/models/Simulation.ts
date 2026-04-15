import mongoose, { Schema, model, models } from "mongoose";

const SimulationChoiceSchema = new Schema(
  {
    text: { type: String, required: true },
    nextNodeId: { type: String, required: true },
    walletImpact: { type: Number, default: 0 },
    creditImpact: { type: Number, default: 0 },
    scoreImpact: { type: Number, default: 0 },
    feedback: { type: String, default: null },
    // Ch1 stock trading
    stocksBought: { type: Schema.Types.Mixed, default: null },
    stocksSold: { type: Schema.Types.Mixed, default: null },
  },
  { _id: false }
);

const SimulationNodeSchema = new Schema(
  {
    nodeId: { type: String, required: true },
    narrative: { type: String, required: true },
    timeSkip: { type: String, default: null },
    choices: [SimulationChoiceSchema],
    isEnd: { type: Boolean, default: false },
    // Ch6 message type
    type: { type: String, default: null },
    // Ch0 Chip's comment
    chipComment: { type: String, default: null },
    // Ch1 time label
    timeLabel: { type: String, default: null },
    // Ch5 monthly tracking
    month: { type: Number, default: null },
    walletBalance: { type: Number, default: null },
    creditBalance: { type: Number, default: null },
    // End node outcome
    outcome: { type: Schema.Types.Mixed, default: null },
    outcomeType: { type: String, default: null },
  },
  { _id: false }
);

const SimulationSchema = new Schema({
  chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  startingWallet: { type: Number, default: null },
  optimalWalletOutcome: { type: Number, default: null },
  badgeThreshold: { type: Schema.Types.Mixed, default: {} },
  startNodeId: { type: String, required: true },
  nodes: [SimulationNodeSchema],
  // Ch0 special fields
  walletLabel: { type: String, default: null },
  startingInventory: { type: String, default: null },
  // Ch1 stock trading
  availableStocks: { type: Schema.Types.Mixed, default: null },
  // Ch3 bias tracking
  biasTracker: { type: Schema.Types.Mixed, default: null },
  // Ch5 credit tracking
  creditLimit: { type: Number, default: null },
  creditBalance: { type: Number, default: null },
  monthlyIncome: { type: Number, default: null },
  // Ch6 points-based scoring
  scoringType: { type: String, enum: ["wallet", "points"], default: "wallet" },
  startingScore: { type: Number, default: null },
  maxScore: { type: Number, default: null },
  // Badge info from JSON
  badgeId: { type: String, default: null },
  badgeName: { type: String, default: null },
});

const Simulation =
  models.Simulation || model("Simulation", SimulationSchema);

export default Simulation;
