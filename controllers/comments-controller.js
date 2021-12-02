const {
  fetchCommentsByReviewId,
  addCommentsByReviewId,
  removeCommentById,
} = require("../models/comments-model");
const { checkReviewIdExists } = require("../models/reviews-model");
const { checkUsernameExists } = require("../models/users-model");
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
  Promise.all([
    addCommentsByReviewId(req.body, reviewId),
    checkUsernameExists(username),
  ])
    .then((result) => {
      res.status(201).send({ comment: result[0] });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.id;

  removeCommentById(commentId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
