import mongoose, { Schema, model, models } from "mongoose";

const ExerciseOptionSchema = new Schema(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const ExerciseSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "mcq-single",
        "mcq-multi",
        "true-false",
        "scenario",
        "sorting",
        "calculator",
      ],
      required: true,
    },
    prompt: { type: String, required: true },
    options: { type: [ExerciseOptionSchema], default: undefined },
    explanation: { type: String, required: true },
    xpValue: { type: Number, required: true },
    // Scenario type
    scenario: { type: String, default: null },
    // True-false type (normalized to options during seed, but keep for reference)
    correctAnswer: { type: Schema.Types.Mixed, default: null },
    // Sorting type
    categories: { type: [String], default: undefined },
    items: { type: Schema.Types.Mixed, default: null },
    // Calculator type
    title: { type: String, default: null },
    inputs: { type: Schema.Types.Mixed, default: null },
    formula: { type: String, default: null },
    outputLabel: { type: String, default: null },
    followUpQuestion: { type: Schema.Types.Mixed, default: null },
  },
  { _id: false }
);

const ContentBlockSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["text", "callout", "key-term", "image", "interactive", "dialogue"],
      required: true,
    },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const LessonSchema = new Schema({
  chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
  lessonNumber: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
  content: {
    blocks: [ContentBlockSchema],
  },
  exercises: [ExerciseSchema],
  estimatedMinutes: { type: Number, required: true },
  order: { type: Number, required: true },
});

const Lesson = models.Lesson || model("Lesson", LessonSchema);

export default Lesson;
