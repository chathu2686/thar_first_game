const {
  fetchReviewById,
  checkReviewIdExists,
} = require("../models/reviews-model");

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.id;
  Promise.all([fetchReviewById(reviewId), checkReviewIdExists(reviewId)])
    .then((result) => {
      res.status(200).send({ review: result[0] });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const reviewId = req.params.id;
  Promise.all([editReviewById(reviewId), checkReviewIdExists(reviewId)])
    .then((result) => {
      res.status(201).send({ updatedReview: result[0] });
    })
    .catch(next);
};
