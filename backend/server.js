const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const expenseRoutes = require("./routes/expenseRoutes.js");

const connection = require("./config/connection.js");
const port = 8080;

// middleware
const app = express();
app.use(express.json());
app.use(cors());

// user and recipes routes
app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);



app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
