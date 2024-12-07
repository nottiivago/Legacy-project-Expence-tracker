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
    console.log(`Error: ${error}`);
    res
      .status(500)
      .send(`Backend: Failed to retrieve all expenses, please try again later`);
  }
};

// _________________get expenses by date range_______________
let getExpensesByDate = async (req, res) => {
  try {
    console.log("Received query parameters:", req.query); // Debugging

    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    if (!startDate && !endDate) {
      return res.status(400).json({ message: "Please provide a valid date range." });
    }

    const filter = { creator: userId };

    // Handle optional dates
    if (startDate) {
      const parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate)) {
        return res.status(400).json({ message: "Invalid startDate format." });
      }
      filter.date = { $gte: parsedStartDate };
    }

    if (endDate) {
      const parsedEndDate = new Date(endDate);
      if (isNaN(parsedEndDate)) {
        return res.status(400).json({ message: "Invalid endDate format." });
      }
      filter.date = { ...(filter.date || {}), $lte: parsedEndDate };
    }

    const expenses = await Expense.find(filter).populate("creator");
    res.status(200).json(expenses);
  } catch (error) {
    console.error(`Error fetching expenses by date: ${error}`);
    res.status(500).json({ message: "Failed to fetch expenses by date." });
  }
};




// _________________get one expense by id__________________________
let getExpenseById = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    const expense = await Expense.findById({
      _id: id,
      creator: userId,
    }).populate("creator");

    if (!expense) {
      return res.status(404).json({ message: "Expense doesn't exist" });
    }
    return res.status(200).json({ message: "Here is the expense!", expense });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json(`Backend: Expense not found, please try again later`);
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
          date: new Date(date), // Ensure the date is parsed correctly
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
    const oldExpense = await Expense.findByIdAndUpdate(
      { _id: id, creator: userId },
      updatedExpense,
      { new: true } // Return the updated document
    ).populate("creator");

    if (!oldExpense) {
      console.log(`Expense does not exist`);
      return res.status(404).json({ message: "Expense does not exist" });
    }

    res.status(200).json({
      message: "Expense updated successfully",
      data: oldExpense,
    });
  } catch (error) {
    console.error(`Error updating expense: ${error}`);
    res.status(500).json({
      message: "Backend: Error updating expense, try again later!",
    });
  }
};

// _________________delete expense_______________________
let deleteExpense = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  try {
    const expenseToDelete = await Expense.findByIdAndDelete({
      _id: id,
      creator: userId,
    });

    if (!expenseToDelete) {
      console.log(`Expense does not exist`);
      return res.status(404).json({ message: "Expense does not exist" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(`Error deleting expense: ${error}`);
    res.status(500).json({
      message: "Backend: Error deleting expense, try again later!",
    });
  }
};

// _________________delete all expenses ____________________
let deleteAllExpenses = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Expense.deleteMany({ creator: userId });

    res.status(200).json({
      message: "All expenses deleted successfully",
      deletedCount: `${result.deletedCount} expenses deleted`,
    });
  } catch (error) {
    console.error(`Error deleting expenses: ${error}`);
    res.status(500).json({
      message: "Backend: Error deleting expenses, try again later!",
    });
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
};
