const db = require("../db/connection");
const format = require("pg-format");
const {
  isIntegerOverZero,
  isOrderValid,
  pagination,
} = require("../utils/utils");
const { isValidCategory } = require("./categories-model");

exports.checkReviewIdExists = (id) => {
  return db
    .query(
      `SELECT * FROM reviewData
        WHERE review_id = $1
    ;`,
      [id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Oh Dear, review_id does not exist!",
        });
      }
    });
};

const isSortByValid = (query) => {
  const arr = [
    "created_at",
    "owner",
    "review_id",
    "category",
    "votes",
    "comment_count",
  ];

  if (!arr.includes(query)) {
    return Promise.reject({
      status: 400,
      msg: `Oh Dear, Invalid sort_by value!`,
    });
  }
};

exports.fetchReviews = (category, sortBy, order, limit, page) => {
  return Promise.all([
    isValidCategory(category),
    isSortByValid(sortBy),
    isOrderValid(order),
    isIntegerOverZero(limit),
    isIntegerOverZero(page),
  ])
    .then(() => {
      // SQLinjection has been blocked through the above functions inside promise.all
      const editedCategory = category.split("'").join("''");

      return db.query(
        `SELECT 
        reviewData.review_id, 
        title, 
        reviewData.designer, 
        reviewData.owner,
        reviewData.review_img_url, 
        reviewData.category, 
        reviewData.created_at,
        reviewData.votes, 
        COUNT(commentData.review_id)::INT AS comment_count
        FROM reviewData
        LEFT JOIN commentData ON commentData.review_id = reviewData.review_id
        WHERE reviewData.category LIKE $1
        GROUP BY reviewData.review_id
        ORDER BY ${sortBy} ${order}
        ;`,
        [editedCategory]
      );
    })
    .then(({ rows }) => {
      const result = pagination(rows, Number(limit), Number(page));

      return { reviews: result, total_count: rows.length };
    });
};

exports.fetchReviewById = (review_id) => {
  return db
    .query(
      `SELECT 
        reviewData.review_id, 
        title, 
        reviewData.designer, 
        reviewData.owner,
        reviewData.review_img_url, 
        reviewData.category, 
        reviewData.created_at,
        reviewData.votes, 
        reviewData.review_body, 
        COUNT(commentData.review_id)::INT AS comment_count
        FROM reviewData
        LEFT JOIN commentData ON commentData.review_id = reviewData.review_id
        WHERE reviewData.review_id = $1
        GROUP BY reviewData.review_id
  ;`,
      [review_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Oh Dear, review_id does not exist!",
        });
      } else {
        return result.rows[0];
      }
    });
};

exports.editReviewById = (review_id, newVotes) => {
  return db
    .query(
      `
  UPDATE reviewData
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *
    ;`,
      [newVotes, review_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Oh Dear, review_id does not exist!",
        });
      } else {
        return result.rows[0];
      }
    });
};

exports.removeReviewById = (id) => {
  return db
    .query(
      `
  DELETE FROM reviewData
  WHERE review_id = $1
  RETURNING *
  ;`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Oh Dear, review_id does not exist!",
        });
      } else {
        return rows[0];
      }
    });
};
