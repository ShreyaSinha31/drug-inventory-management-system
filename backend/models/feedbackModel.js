import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
