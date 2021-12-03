const express = require("express");
const {
  handle500Error,
  handleCustomError,
  handle400Error,
  handle404Error,
} = require("./errors/errors");
const apiRouter = require("./routes/apiRouter");

const app = express();
app.use(express.json());

app.use("/", (req, res) => {
  res.status(200).send("Welcome to Tharaka's game-data API!");
});

app.use("/api", apiRouter);

app.use(handle400Error);
app.use(handle404Error);
app.use(handleCustomError);
app.use(handle500Error);

module.exports = app;
