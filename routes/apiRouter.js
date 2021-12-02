const apiRouter = require("express").Router();

const categoriesRouter = require("./categoriesRouter");
const reviewsRouter = require("./reviewsRouter");
const commentsRouter = require("./commentsRouter");

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
