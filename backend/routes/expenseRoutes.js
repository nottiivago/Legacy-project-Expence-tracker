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
router.get("/allExpenses/:category", getAllExpenses); //===> to retrieve all expenses data
router.post("/addNewExpense", addNewExpense); //===> add new expense
router.get("/:id", getExpenseById); //===> to retrieve one expense by id
router.put("/updateExpense/:id", updateExpense); //===> update expense
router.delete("/deleteExpense/:id", deleteExpense); //===> delete one expense
router.delete("/deleteAllExpenses", deleteAllExpenses); //===> delete all expenses

module.exports = router;
