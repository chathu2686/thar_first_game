const { response } = require("express");
const express = require("express");
const apiRouter = require("./routes/apiRouter");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use((err, res, req, next) => {
  if (err.status || err.msg) {
    res.status(err.status).send({ errorMessage: err.msg });
  } else {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
});

module.exports = app;
