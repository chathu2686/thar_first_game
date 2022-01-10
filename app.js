const express = require("express");
const cors = require("cors");
const {
  handle500Error,
  handleCustomError,
  handle400Error,
  handle404Error,
} = require("./errors/errors");
const apiRouter = require("./routes/apiRouter");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(200)
    .send("Welcome to Tharaka's game-data API deployed through CI!");
});

app.use("/api", apiRouter);

app.use(handle400Error);
app.use(handle404Error);
app.use(handleCustomError);
app.use(handle500Error);

module.exports = app;
