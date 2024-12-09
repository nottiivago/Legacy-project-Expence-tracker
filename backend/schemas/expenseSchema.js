const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String }, // Optional title
    amount: { type: Number, required: true }, // Required amount field
    category: {
      type: String,
      required: true,
      enum: ["income", "core", "flow", "overflow"], // Add allowed categories
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Must be linked to a valid user
    },
    date: { type: Date, required: true }, // Required date field
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
