const {
  getReviews,
  getReviewById,
  patchReviewById,
  deleteReviewById,
} = require("../controllers/reviews-controller");

const {
  getCommentsByReviewId,
  postCommentsByReviewId,
} = require("../controllers/comments-controller");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewById)
  .delete(deleteReviewById);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentsByReviewId);

module.exports = reviewsRouter;
