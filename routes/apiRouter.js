const apiRouter = require("express").Router();

const categoriesRouter = require("./categoriesRouter");

apiRouter.use("/categories", categoriesRouter);

module.exports = apiRouter;
