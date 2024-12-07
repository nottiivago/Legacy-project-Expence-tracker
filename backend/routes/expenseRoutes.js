const express = require("express");
const router = express.Router();

const {
  getAllExpenses,
  addNewExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
  deleteAllExpenses,
  getExpensesByDate, // Import the date range method
} = require("../controllers/expenseControllers.js");

const verifyToken = require("../middleware/auth.js");

// Routes require verify token
router.get("/byDate", verifyToken, getExpensesByDate); // Fetch expenses by date range (place this BEFORE the dynamic :id route)
router.get("/allExpenses/:category", verifyToken, getAllExpenses); // Retrieve all expenses data
router.post("/addNewExpense", verifyToken, addNewExpense); // Add new expense
router.get("/:id", verifyToken, getExpenseById); // Retrieve one expense by id
router.put("/updateExpense/:id", verifyToken, updateExpense); // Update expense
router.delete("/deleteExpense/:id", verifyToken, deleteExpense); // Delete one expense
router.delete("/deleteAllExpenses", verifyToken, deleteAllExpenses); // Delete all expenses

module.exports = router;
