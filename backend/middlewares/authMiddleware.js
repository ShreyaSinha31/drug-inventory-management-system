
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, please log in" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(verified.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found, token invalid" });
    }

    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
});

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

