const { request } = require("express");
const {
  fetchReviews,
  fetchReviewById,
  editReviewById,
} = require("../models/reviews-model");

const { notNumber } = require("../utils/utils");

exports.getReviews = (req, res, next) => {
  const reqSortBy = req.query.sort_by;
  const reqOrder = req.query.order;
  const reqCategory = req.query.category;

  fetchReviews(reqSortBy, reqOrder, reqCategory)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.id;
  fetchReviewById(reviewId)
    .then((result) => {
      res.status(200).send({ review: result });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const reviewId = req.params.id;
  const newVotes = req.body.inc_votes;
  Promise.all([editReviewById(reviewId, newVotes), notNumber(newVotes)])
    .then((result) => {
      res.status(201).send({ updatedReview: result[0] });
    })
    .catch(next);
};
