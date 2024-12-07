const mongoose = require("mongoose");
require('dotenv').config();


const URI =  process.env.MONGO_URI;

main()
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log(`Error from connection ${err}`));

async function main() {
  await mongoose.connect(URI);
}

module.exports = main();
