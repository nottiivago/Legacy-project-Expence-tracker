const mongoose = require("mongoose");

// Define the schema with properties like 'todo' and 'content'
const expenseSchema = new mongoose.Schema(
  {
    tittle: { type: String },
    amount: { type: Number },
    category: { type: String },
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