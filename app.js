const express = require("express");
const {
  handle500Error,
  handleCustomError,
  handle400Error,
  handle404Error,
} = require("./errors/errors");
const apiRouter = require("./routes/apiRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const reviewsRouter = require("./routes/reviewsRouter");
const commentsRouter = require("./routes/commentsRouter");
const usersRouter = require("./routes/usersRouter");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Tharaka's game-data API!");
});

app.use("/api", apiRouter);
app.use("/categories", categoriesRouter);
app.use("/reviews", reviewsRouter);
app.use("/comments", commentsRouter);
app.use("/users", usersRouter);

app.use(handle400Error);
app.use(handle404Error);
app.use(handleCustomError);
app.use(handle500Error);

module.exports = app;
