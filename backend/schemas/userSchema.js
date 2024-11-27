const mongoose = require("mongoose");

// Define the schema with properties like 'todo' and 'content'
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowerCase: true },
    password: { type: String, required: true },
    income: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true, // This option automatically adds 'createdAt' and 'updatedAt' fields to your documents
  }
);

// Create a model named 'Todo' using the defined schema
const User = mongoose.model("User", userSchema);

// Export the 'Todo' model for use in your server.js file
module.exports = User;
