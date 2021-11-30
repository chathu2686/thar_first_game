const { response } = require("express");
const express = require("express");
const {
  handle500Error,
  handle404Error,
  handle400Error,
} = require("./errors/errors");
const apiRouter = require("./routes/apiRouter");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(handle400Error);
app.use(handle404Error);
app.use(handle500Error);

module.exports = app;
