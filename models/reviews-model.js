const db = require("../db/connection");
const format = require("pg-format");

exports.checkReviewIdExists = (review_id) => {
  return db
    .query(
      `
    SELECT * FROM reviews
    WHERE review_id = $1
  ;`,
      [review_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Oh Dear, review_id does not exist!",
        });
      }
    });
};

exports.fetchReviewById = (review_id) => {
  return db
    .query(
      `
    SELECT reviews.*, COUNT(comments.*)::INT AS comment_count  FROM comments 
    JOIN reviews on comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
  ;`,
      [review_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
