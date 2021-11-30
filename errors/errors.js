exports.handle400Error = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Oh Dear, bad request!" });
  } else {
    next(err);
  }
};

exports.handle404Error = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle500Error = (err, req, res, next) => {
  res.status(500).send("Oh Dear, Internal server error!");
};
