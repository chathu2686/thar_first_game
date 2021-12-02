const { request } = require("express");
const {
  isReviewQueryValid,
  fetchReviews,
  fetchReviewById,
  editReviewById,
  removeReviewById,
} = require("../models/reviews-model");

const { notNumber } = require("../utils/utils");

exports.getReviews = (req, res, next) => {
  const reqSortBy = req.query.sort_by || "created_at";
  const reqOrder = req.query.order || "DESC";
  const reqCategory = req.query.category || "%";

  Promise.all([
    fetchReviews(reqSortBy, reqOrder, reqCategory),
    isReviewQueryValid("category", reqCategory),
    isReviewQueryValid("order", reqOrder),
    isReviewQueryValid("sort_by", reqSortBy),
  ])
    .then((result) => {
      res.status(200).send({ reviews: result[0] });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  fetchReviewById(reviewId)
    .then((result) => {
      res.status(200).send({ review: result });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  const newVotes = req.body.inc_votes;
  Promise.all([editReviewById(reviewId, newVotes), notNumber(newVotes)])
    .then((result) => {
      res.status(201).send({ updatedReview: result[0] });
    })
    .catch(next);
};

exports.deleteReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  removeReviewById(reviewId)
    .then((result) => {
      res.status(204).send();
    })
    .catch(next);
};
