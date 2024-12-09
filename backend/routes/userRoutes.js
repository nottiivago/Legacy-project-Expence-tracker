const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload.image.jsx')

const {
  getAllUsers,
  addNewUser,
  logIn,
  getUserById,
  updateUserData,
  deleteUser,
  deleteAllUsers,
} = require("../controllers/userControllers.js");
const verifyToken = require("../middleware/auth.js");

// routes require verify token
router.get("/allUsers", verifyToken, getAllUsers); //===> to retrieve all users data (just admin)
router.get("/:id", verifyToken, getUserById); //===> to retrieve one user by id
router.put("/updateUser/:id", verifyToken, updateUserData); //===> update user data
router.delete("/deleteUser/:id", verifyToken, deleteUser); //===> delete user profile (or account)
router.delete("/deleteAllUsers", verifyToken, deleteAllUsers); //===> delete all users (just admin)

// public routes
router.post("/login", logIn); //===> log in
router.post("/register",upload, addNewUser); //===> register






module.exports = router;