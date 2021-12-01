const db = require("../db/connection");
const format = require("pg-format");

const reviewIdNotExist = () => {
  return Promise.reject({
    status: 404,
    msg: "Oh Dear, review_id does not exist!",
  });
};

exports.fetchReviews = () => {
  return db
    .query(
      `
   SELECT reviews.*, COUNT(comments.*)::INT AS comment_count  FROM comments
   RIGHT JOIN reviews on comments.review_id = reviews.review_id 
   GROUP BY reviews.review_id
  ;`
    )
    .then((result) => {
      return result.rows;
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
      if (!result.rows.length) {
        return reviewIdNotExist();
      } else {
        return result.rows[0];
      }
    });
};

exports.editReviewById = (review_id, newVotes) => {
  return db
    .query(
      `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *
    ;`,
      [newVotes, review_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return reviewIdNotExist();
      } else {
        return result.rows[0];
      }
    });
};
