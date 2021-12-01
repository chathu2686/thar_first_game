const { fetchCommentsByReviewId } = require("../models/comments-model");
const { checkReviewIdExists } = require("../models/reviews-model");

exports.getCommentsByReviewId = (req, res, next) => {
  const reviewId = req.params.review_id;
  Promise.all([
    fetchCommentsByReviewId(reviewId),
    checkReviewIdExists(reviewId),
  ])
    .then((result) => {
      res.status(200).send({ comments: result[0] });
    })
    .catch(next);
};
