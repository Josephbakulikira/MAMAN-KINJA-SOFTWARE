import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user/set token
// route    POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(req.body)

  if (!email || !password) {
    res.status(400);
    throw new Error("Fill in all fields");
  }
  // console.log("here", req.body, email)

  const user = await User.findOne({"email": email });
  // console.log(user);
  if (user && await user.matchPassword(password)) {
    generateToken(res, user._id);
    res.status(200).json({
      success: true,
      user: user,
      _id: user._id,
      email: user.email,
      name: user.name
    });
  } else {
    // console.log("here")
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Register a new user
// route    POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Fill in all fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });

  if (user) {
    generateToken(res, user._id);
    res.status(200).json({
      success: true,
      user: user,
      _id: user._id,
      email: user.email,
      name: user.name
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user
// route    POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ success: true, message: "User logged out" });
});

// @desc    Get user profile
// route    GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };

  res.status(200).json({success: true, user});
});

// @desc    Update user profile
// route    PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user role
// route    PUT /api/users/role
// @access  Private admin dev only
const updateUserRole = asyncHandler(async (req, res, next) => {

  if(req.body.role === "dev"){
    res.status(400);
    throw new Error("Erreur! Vous avez pas la permission !")
  }
  const user = await User.findById(req.body.id);

  if (user) {
    if(user.role === "dev"){
      res.status(400);
      throw new Error("Erreur! Vous avez pas la permission !")
    }
    user.role = req.body.role || user.role

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    get users 
// route    GET /api/users/all
// @access  Private admin dev
const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  if(users){
    // console.log(users);
    res.status(200).json({success: true, users: users});  }
  else{
    res.status(400);
    throw new Error("Erreur! Verifier votre connexion")
  }

});

// @desc    get user by id
// route    GET /api/users/all/:id
// @access  Private admin dev
const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({success: true, user: user})
});


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUser,
  getUsers,
  updateUserRole
};
