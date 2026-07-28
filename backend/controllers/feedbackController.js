import { Feedback } from "../models/feedbackModel.js";

// Submit new feedback
export const submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, title, description } = req.body;

    if (!name || !email || !rating || !title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = await Feedback.create({
      name,
      email,
      rating: Number(rating),
      title,
      description,
      date: new Date()
    });

    return res.status(201).json({
      message: "Thank you! Your feedback has been submitted successfully.",
      feedback
    });
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    return res.status(500).json({ message: error.message || "Failed to submit feedback" });
  }
};

// Get all feedbacks
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Get Feedbacks Error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch feedbacks" });
  }
};
