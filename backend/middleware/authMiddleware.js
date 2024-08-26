import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt || null;
  // console.log(token, "protect");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, Invalid token");
    }
  } else {
    // console.log("here")
    res.status(401);
    throw new Error("Not authorized, No token");
  }
});

const isAdmin = asyncHandler ( async (req, res, next) => {
  let token;
  token = req.cookies.jwt || null;
  // console.log(token, "isAdmin");
  if(token){
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.userId)
      // console.log(user?.role)
      if(user?.role === "admin" || user?.role === "dev"){
        next()
      }else{
        res.status(401);
        throw new Error("No Access, Don't have the permission")
      }
    }catch(error){
      res.status(401);
      throw new Error("Not authorized, No token");
    }
  }
});

const isManager = asyncHandler ( async (req, res, next) => {
  let token;
  token = req.cookies.jwt || null;
  if(token){
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.userId)
      if(user?.role === "manager" || user?.role === "admin" || user?.role === "dev"){
        next()
      }else{
        res.status(401);
        throw new Error("No Access, Don't have the permission")
      }
    }catch(error){
      res.status(401);
      throw new Error("Not authorized, No token");
    }
  }
});

const isChef = asyncHandler ( async (req, res, next) => {
  let token;
  token = req.cookies.jwt || null;
  if(token){
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.userId)
      if(user?.role === "chef" || user?.role === "admin" || user?.role === "dev"){
        next()
      }else{
        res.status(401);
        throw new Error("No Access, Don't have the permission")
      }
    }catch(error){
      res.status(401);
      throw new Error("Not authorized, No token");
    }
  }
});

const isWaiter = asyncHandler ( async (req, res, next) => {
  let token;
  token = req.cookies.jwt || null;
  if(token){
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.userId)
      if(user?.role === "waiter" || user?.role === "admin" || user?.role === "dev"){
        next()
      }else{
        res.status(401);
        throw new Error("No Access, Don't have the permission")
      }
    }catch(error){
      res.status(401);
      throw new Error("Not authorized, No token");
    }
  }
});

export { protect, isAdmin, isChef, isManager, isWaiter };
