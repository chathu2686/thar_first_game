const {
  fetchCommentsByReviewId,
  addCommentsByReviewId,
} = require("../models/comments-model");
const { checkReviewIdExists } = require("../models/reviews-model");

const { notNumber } = require("../utils/utils");

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

exports.postCommentsByReviewId = (req, res, next) => {
  const reviewId = req.params.review_id;
  const username = req.body.username;
  addCommentsByReviewId(req.body, reviewId)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
