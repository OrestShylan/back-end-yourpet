const app = require("./app");
const mongoose = require("mongoose");
const DB_HOST =
  "mongodb+srv://Orest:iXa821IJF5owWMlr@cluster0.dffktss.mongodb.net/pets?retryWrites=true&w=majority";

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
