const mongoose = require("mongoose");

// Define the schema with properties like 'todo' and 'content'
const expenseSchema = new mongoose.Schema(
  {
    title: { type: String }, // Renamed to 'title' for better clarity
    amount: { type: Number, required: true }, // Made 'amount' required
    category: { type: String, required: true }, // Made 'category' required
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Made 'creator' required
    date: { type: Date, required: true }, // Added 'date' field for expense tracking
  },
  {
    timestamps: true, // This option automatically adds 'createdAt' and 'updatedAt' fields to your documents
  }
);

// Create a model named 'Expense' using the defined schema
const Expense = mongoose.model("Expense", expenseSchema);

// Export the 'Expense' model for use in your server.js file
module.exports = Expense;
