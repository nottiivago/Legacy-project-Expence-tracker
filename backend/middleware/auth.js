const jwt = require("jsonwebtoken");
const User = require("../schemas/userSchema");

// verify the token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(req.headers.authorization);
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized, Token not found" });
  }

  // Check for Bearer format
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, Token format is invalid" });
  }

  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    console.error("Secret key is not defined.");
    return res.status(500).json({ message: "Server configuration error." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    // console.log(decoded)
    req.user = await User.findById(decoded.id); // Attach user information to the request object
    next(); // Pass control to the next middleware
  } catch (error) {
    console.error(`JWT Error: ${error.name} - ${error.message}`);
    res
      .status(401)
      .json({ message: "Unauthorized, Token is invalid or expired" });
  }
};

module.exports = verifyToken;
