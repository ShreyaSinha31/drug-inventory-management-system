import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },
  pfp: { type: String },
}, { timestamps: true });

//export default mongoose.model("User", userSchema);
export const User = mongoose.model("User", userSchema);

