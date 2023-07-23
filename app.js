const express = require("express");
const logger = require("morgan");
const cors = require("cors");
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

require("dotenv").config();
const RequestError = require("./helpers/RequestError");
const contactsRouter = require("./routes/api/pets");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/pets", contactsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err instanceof RequestError) {
    res.status(err.status).json({ message: err.message });
  } else {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
  }
});

module.exports = app;
