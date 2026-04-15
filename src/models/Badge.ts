import mongoose, { Schema, model, models } from "mongoose";

const BadgeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  unlockCondition: {
    type: { type: String, required: true },
    params: { type: Schema.Types.Mixed, default: {} },
  },
  isSecret: { type: Boolean, default: false },
  category: { type: String, required: true },
  order: { type: Number, required: true },
});

const Badge = models.Badge || model("Badge", BadgeSchema);

export default Badge;
