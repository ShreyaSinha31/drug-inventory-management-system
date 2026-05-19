
import jwt from "jsonwebtoken";
import {User} from "../models/userModel.js";
import asyncHandler from "express-async-handler";

// export const protect = async (req, res, next) => {
//   console.log("Cookies received in protect middleware:", req.cookies); // Debugging

//   const token = req.cookies?.token;

//   if (!token) {
//     console.log("No token found in cookies!");
//     return res.status(401).json({ message: "Not authorized, please log in" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");

//     console.log("Authenticated user:", req.user);
//     next();
//   } catch (error) {
//     console.error("JWT Verification Error:", error);
//     return res.status(401).json({ message: "Not authorized, invalid token" });
//   }
// };



export const protect = asyncHandler(async (req, res, next) => {
  try {
    //console.log("Cookies in protect middleware:", req.cookies);
    const token = req.cookies.token;
    if(!token){
      res.status(401).json({
        message:"Not authorized, please login"
      })}
    //verify token
    const verified = await jwt.verify(token, process.env.JWT_SECRET)
    //get user from user id
    req.user = await User.findById(verified.id).select("-password");
    //req.loggedInId = verified.id;
    //console.log(req.user.id);
    //console.log(req.user._id);
    
    
    next();
    
  } catch (error) {
    console.error("Error in auth middleware:", error);
      res.status(401).json({ message: "Not authorized, invalid token" });
  }
});

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};
