const {
  getReviews,
  getReviewById,
  patchReviewById,
} = require("../controllers/reviews-controller");

const {
  getCommentsByReviewId,
  postCommentsByReviewId,
} = require("../controllers/comments-controller");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews);
reviewsRouter.route("/:id").get(getReviewById).patch(patchReviewById);
reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentsByReviewId);

module.exports = reviewsRouter;
