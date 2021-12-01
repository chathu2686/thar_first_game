const { request } = require("express");
const {
  fetchReviews,
  fetchReviewById,
  checkReviewIdExists,
  editReviewById,
} = require("../models/reviews-model");

const { notNumber } = require("../utils/utils");

exports.getReviews = (req, res, next) => {
  fetchReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

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
  const newVotes = req.body.inc_votes;
  Promise.all([
    editReviewById(reviewId, newVotes),
    checkReviewIdExists(reviewId),
    notNumber(newVotes),
  ])
    .then((result) => {
      res.status(201).send({ updatedReview: result[0] });
    })
    .catch(next);
};
