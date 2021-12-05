const { request } = require("express");

const {
  isSortByValid,
  fetchReviews,
  fetchReviewById,
  editReviewById,
  removeReviewById,
} = require("../models/reviews-model");

const { isValidCategory } = require("../models/categories-model");

const { isIntegerOverZero, isOrderValid } = require("../utils/utils");

exports.getReviews = (req, res, next) => {
  const reqSortBy = req.query.sort_by || "created_at";
  const reqOrder = req.query.order || "DESC";
  const reqCategory = req.query.category || "%";
  const reqLimit = req.query.limit || 10;
  const reqPage = req.query.p || 1;

  fetchReviews(reqCategory, reqSortBy, reqOrder, reqLimit, reqPage)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  console.log(reviewId);
  fetchReviewById(reviewId)
    .then((result) => {
      res.status(200).send({ review: result });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.patchReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  const newVotes = req.body.inc_votes || 0;
  editReviewById(reviewId, newVotes)
    .then((result) => {
      res.status(200).send({ updatedReview: result });
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

// `SELECT reviewData.*, (SELECT COUNT(*)::INT FROM commentData WHERE commentData.review_id=reviewData.review_id) AS comment_count FROM reviewData WHERE category LIKE '${category}' ORDER BY ${sortBy} ${order.toUpperCase()} LIMIT ${limit} OFFSET ${
//   (page - 1) * limit
// }`;
