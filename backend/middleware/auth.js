require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../schemas/userSchema");

// Verify the token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and has a valid Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.error("Authorization header is missing or invalid:", authHeader);
    return res.status(401).json({ message: "Unauthorized, Token not found" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

  if (!token) {
    console.error("Token format is invalid:", authHeader);
    return res
      .status(401)
      .json({ message: "Unauthorized, Token format is invalid" });
  }

  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    console.error("Secret key is not defined in environment variables.");
    return res.status(500).json({ message: "Server configuration error." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    // Validate the decoded user ID
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      console.error("Invalid User ID in Token:", decoded.id);
      return res.status(400).json({ message: "Invalid user ID in token." });
    }

    // Fetch the user from the database
    const user = await User.findById(decoded.id);
    if (!user) {
      console.error("User not found for ID:", decoded.id);
      return res.status(404).json({ message: "User not found." });
    }

    // Attach the user to the request object
    req.user = { _id: user._id }; // Attach only the ID for simplicity
    next();
  } catch (error) {
    // Handle token verification errors
    console.error(`JWT Error: ${error.name} - ${error.message}`);
    res
      .status(401)
      .json({ message: "Unauthorized, token is invalid or expired." });
  }
};

module.exports = verifyToken;
