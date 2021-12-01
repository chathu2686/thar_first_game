const { fetchCommentsByReviewId } = require("../models/comments-model");

exports.getCommentsByReviewId = (req, res, next) => {
  const reviewId = req.params.review_id;
  fetchCommentsByReviewId(reviewId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
