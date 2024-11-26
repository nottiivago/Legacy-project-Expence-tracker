const express = require("express");
const router = express.Router();

const {
  getAllExpenses,
  addNewExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
  deleteAllExpenses,
} = require("../controllers/expenseControllers.js");
const verifyToken = require("../middleware/auth.js");

// routes require verify token
router.get("/allExpenses", verifyToken, getAllExpenses); //===> to retrieve all expenses data
router.get("/addNewExpense", verifyToken, addNewExpense); //===> add new expense
router.get("/:id", verifyToken, getExpenseById); //===> to retrieve one expense by id
router.put("/updateExpense/:id", verifyToken, updateExpense); //===> update expense
router.delete("/deleteExpense/:id", verifyToken, deleteExpense); //===> delete one expense
router.delete("/deleteAllExpenses", verifyToken, deleteAllExpenses); //===> delete all expenses

module.exports = router;
