const {
  getReviews,
  getReviewById,
  patchReviewById,
} = require("../controllers/reviews-controller");

const { getCommentsByReviewId } = require("../controllers/comments-controller");

const reviews = require("../db/data/test-data/reviews");
const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews);
reviewsRouter.route("/:id").get(getReviewById).patch(patchReviewById);
reviewsRouter.route("/:review_id/comments").get(getCommentsByReviewId);

module.exports = reviewsRouter;
