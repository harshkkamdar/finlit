import mongoose, { Schema, model, models } from "mongoose";

const ChapterSchema = new Schema({
  number: { type: Number, required: true, min: 0, max: 6 },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  colorAccent: { type: String, required: true },
  iconUrl: { type: String, required: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  simulationId: { type: Schema.Types.ObjectId, ref: "Simulation", default: null },
  order: { type: Number, required: true },
  personalityQuiz: { type: Schema.Types.Mixed, default: null },
});

const Chapter = models.Chapter || model("Chapter", ChapterSchema);

export default Chapter;
