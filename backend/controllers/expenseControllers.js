const mongoose = require("mongoose");
const Expense = require("../schemas/expenseSchema.js");

// _________________get all expenses_______________
let getAllExpenses = async (req, res) => {
  const category = req.params.category;
  try {
    const userId = req.user._id;
    let allExpenses;
    if (category === "all") {
      allExpenses = await Expense.find({ creator: userId }).populate("creator");
      return res.json(allExpenses);
    } else {
      allExpenses = await Expense.find({ category, creator: userId }).populate(
        "creator"
      );
      return res.json(allExpenses);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({
      message: `Failed to retrieve all expenses, please try again later`,
    });
  }
};

// _________________get expenses by date range_______________
let getExpensesByDate = async (req, res) => {
  try {
    console.log("Received query parameters:", req.query); // Debugging

    const userId = req.user._id; // Ensure this is passed from middleware
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      console.log("Missing date range");
      return res
        .status(400)
        .json({ message: "Please provide a valid date range." });
    }

    // Validate dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
      console.error("Invalid date format:", { startDate, endDate });
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Build the filter
    const filter = {
      creator: new mongoose.Types.ObjectId(userId), // Use `new` to instantiate ObjectId
      date: {
        $gte: parsedStartDate,
        $lte: parsedEndDate,
      },
    };

    console.log("Filter for expenses:", filter); // Debugging filter

    // Query the database
    const expenses = await Expense.find(filter).populate("creator");
    console.log("Fetched expenses:", expenses); // Debugging result

    res.status(200).json(expenses);
  } catch (error) {
    console.error(`Error fetching expenses by date: ${error.message}`, error);
    res.status(500).json({ message: "Failed to fetch expenses by date." });
  }
};


// _________________get one expense by id__________________________
let getExpenseById = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense ID." });
    }

    const expense = await Expense.findOne({
      _id: mongoose.Types.ObjectId(id),
      creator: mongoose.Types.ObjectId(userId),
    }).populate("creator");

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }
    res.status(200).json(expense);
  } catch (error) {
    console.error(`Error fetching expense by ID: ${error}`);
    res.status(500).json({ message: "Failed to fetch expense." });
  }
};

// _________________create new expense_______________
let addNewExpense = async (req, res) => {
  try {
    console.log("Data received in backend:", req.body); // Debugging line
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newExpense = {
      title,
      amount,
      category,
      date: new Date(date),
      creator: req.user._id,
    };

    const createdExpense = await Expense.create(newExpense);
    res.status(201).json({
      message: "Expense created successfully",
      data: createdExpense,
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ message: "Failed to create a new expense." });
  }
};

// _________________update expense data_______________
let updateExpense = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  const updatedExpense = req.body;

  try {
    console.log("Updating expense:", updatedExpense); // Debugging
    console.log("Expense ID:", id); // Debugging
    console.log("User ID:", userId); // Debugging

    // Validate Expense ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense ID." });
    }

    // Update the expense
    const oldExpense = await Expense.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id), // Use `new` here
        creator: new mongoose.Types.ObjectId(userId), // Use `new` here
      },
      updatedExpense, // Updated fields
      { new: true, runValidators: true } // Return updated document and validate data
    ).populate("creator");

    if (!oldExpense) {
      console.error("Expense not found for update:", id);
      return res.status(404).json({ message: "Expense not found." });
    }

    res.status(200).json({
      message: "Expense updated successfully.",
      data: oldExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error.message, error);
    res.status(500).json({
      message: "Failed to update expense.",
    });
  }
};


// _________________delete expense_______________________
let deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    console.log("Attempting to delete expense with ID:", id); // Debugging
    console.log("Authenticated User ID:", userId);

    // Validate Expense ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense ID." });
    }

    // Use `new` keyword for ObjectId
    const expenseToDelete = await Expense.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id), // Fixed
      creator: new mongoose.Types.ObjectId(userId), // Fixed
    });

    if (!expenseToDelete) {
      console.error("Expense not found with ID:", id);
      return res.status(404).json({ message: "Expense not found." });
    }

    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (error) {
    console.error("Error deleting expense:", error.message, error);
    res.status(500).json({ message: "Failed to delete expense." });
  }
};


// _________________delete all expenses ____________________
let deleteAllExpenses = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Expense.deleteMany({ creator: mongoose.Types.ObjectId(userId) });

    res.status(200).json({
      message: "All expenses deleted successfully",
      deletedCount: `${result.deletedCount} expenses deleted`,
    });
  } catch (error) {
    console.error(`Error deleting expenses: ${error}`);
    res.status(500).json({
      message: "Error deleting expenses, try again later!",
    });
  }
};

// _________________get chart data__________________________
const getChartData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    console.log("Received Dates:", { startDate, endDate });

    const chartData = await Expense.aggregate([
      {
        $match: {
          creator: mongoose.Types.ObjectId(userId),
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: { _id: "$category", totalAmount: { $sum: "$amount" } },
      },
      {
        $project: { category: "$_id", totalAmount: 1, _id: 0 },
      },
    ]);

    console.log("Chart Data:", chartData);

    if (chartData.length === 0) {
      return res.status(200).json({ categories: [], amounts: [] });
    }

    res.status(200).json({
      categories: chartData.map((data) => data.category),
      amounts: chartData.map((data) => data.totalAmount),
    });
  } catch (error) {
    console.error(`Error fetching chart data: ${error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getAllExpenses,
  getExpensesByDate,
  getExpenseById,
  addNewExpense,
  updateExpense,
  deleteExpense,
  deleteAllExpenses,
  getChartData,
};
