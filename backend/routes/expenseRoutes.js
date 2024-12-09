const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
  getAllExpenses,
  addNewExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
  deleteAllExpenses,
  getExpensesByDate,
  getChartData, // Import the new controller
} = require("../controllers/expenseControllers");

router.get("/byDate", verifyToken, getExpensesByDate);
router.get("/allExpenses/:category", verifyToken, getAllExpenses);
router.post("/addNewExpense", verifyToken, addNewExpense);
router.get("/:id", verifyToken, getExpenseById);
router.put("/updateExpense/:id", verifyToken, updateExpense);
router.delete("/deleteExpense/:id", verifyToken, deleteExpense);
router.delete("/deleteAllExpenses", verifyToken, deleteAllExpenses);

// New chart data route
router.get("/chart-data", verifyToken, getChartData);

module.exports = router;
