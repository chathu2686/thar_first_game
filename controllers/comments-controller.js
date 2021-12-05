const {
  editCommentById,
  fetchCommentsByReviewId,
  addCommentByReviewId,
  removeCommentById,
} = require("../models/comments-model");

exports.getCommentsByReviewId = (req, res, next) => {
  const reviewId = req.params.review_id;
  const limit = req.query.limit || 10;
  const pageNumber = req.query.p || 1;
  fetchCommentsByReviewId(reviewId, limit, pageNumber)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentsByReviewId = (req, res, next) => {
  const reviewId = req.params.review_id;
  addCommentByReviewId(req.body, reviewId)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;

  removeCommentById(commentId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  const newVotes = req.body.inc_votes || 0;
  editCommentById(commentId, newVotes)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};
