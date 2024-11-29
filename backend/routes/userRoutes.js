const express = require("express");
const router = express.Router();

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
router.get("/allUsers", getAllUsers); //===> to retrieve all users data (just admin)
router.get("/:id", getUserById); //===> to retrieve one user by id
router.put("/updateUser/:id", updateUserData); //===> update user data
router.delete("/deleteUser/:id", deleteUser); //===> delete user profile (or account)
router.delete("/deleteAllUsers", deleteAllUsers); //===> delete all users (just admin)

// public routes
router.post("/login", logIn); //===> log in
router.post("/register", addNewUser); //===> register

module.exports = router;
