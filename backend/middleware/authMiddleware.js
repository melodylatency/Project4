import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

//Protect routes function
const protect = asyncHandler(async (req, res, next) => {
  let token;
  // read jwt from jwt cookie
  token = req.cookies.operation;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, wrong token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, omae wa kuso hito");
  }
});

// Admin routes function
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not admin");
  }
};

export { protect, admin };
