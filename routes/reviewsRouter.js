const {
  getReviewById,
  patchReviewById,
} = require("../controllers/reviews-controller");
const reviewsRouter = require("express").Router();

reviewsRouter.route("/:id").get(getReviewById).patch(patchReviewById);

module.exports = reviewsRouter;
