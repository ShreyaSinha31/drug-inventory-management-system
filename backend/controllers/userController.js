import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin, pfp } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const pfpURL = "https://avatar.iran.liara.run/public/boy";
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin,
      pfp:pfpURL
    });

    // generate token for cookie
    const token = generateToken(user.id);
    // send httpOnly cookie
    res.cookie("token",token,{
      path:"/",
      httpOnly:true,
      expires: new Date(Date.now()+1000*86400), //1d
      sameSite:"none",
      secure: true
    })
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//LogIn user 
export const loginUser = async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });

  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate token after verifying user
    const token = generateToken(user.id);

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pfp:user.pfp,
      message: "Login successful",
    });
  } else {
    res.status(401).json({ message: "Invalid name or password" });
  }
};

//log out user
export const logOutUser = async (req,res) => {
  res.cookie("token","",{
    path:"/",
    httpOnly:true,
    expires: new Date(0), 
    sameSite:"none",
    secure: true
  });
  return res.status(200).json({
    message:"User logged out successfully"
  })
};

// Get current user profile

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      //console.log("User profile fetched:", user);

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pfp: user.pfp
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

