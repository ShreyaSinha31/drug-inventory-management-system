import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register User
export const registerUser = async (req, res) => {
  try {
    console.log("========== REGISTER API ==========");
    console.log("Request Body:", req.body);

    const { name, email, password, isAdmin } = req.body;

    // Check existing user
    const userExists = await User.findOne({ email });
    console.log("User Exists:", userExists);

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    console.log("Salt Generated");

    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password Hashed");

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin,
      pfp: "https://avatar.iran.liara.run/public/boy",
    });

    console.log("User Created:", user);

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("Sending Response...");

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (error) {
    console.error("REGISTER ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pfp: user.pfp,
      createdAt: user.createdAt,
      token,
      message: "Login Successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Logout
export const logOutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    expires: new Date(0),
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

// User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pfp: user.pfp,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.pfp) {
        user.pfp = req.body.pfp;
      }
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        pfp: updatedUser.pfp,
        createdAt: updatedUser.createdAt,
        message: "Profile updated successfully",
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: error.message });
  }
};