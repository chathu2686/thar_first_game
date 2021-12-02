const apiRouter = require("express").Router();

const usersRouter = require("./usersRouter");
const categoriesRouter = require("./categoriesRouter");
const reviewsRouter = require("./reviewsRouter");
const commentsRouter = require("./commentsRouter");
const { getEndpoints } = require("../controllers/api-controller");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
