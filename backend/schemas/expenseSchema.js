const mongoose = require("mongoose");

// Define the schema with properties like 'todo' and 'content'
const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: String, required: true, unique: true, lowerCase: true },
    category: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true, // This option automatically adds 'createdAt' and 'updatedAt' fields to your documents
  }
);

// Create a model named 'Todo' using the defined schema
const Expense = mongoose.model("Expense", expenseSchema);

// Export the 'Todo' model for use in your server.js file
module.exports = Expense;
