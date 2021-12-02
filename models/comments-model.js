const db = require("../db/connection");
const format = require("pg-format");

exports.fetchCommentsByReviewId = (id) => {
  return db
    .query(
      `
        SELECT 
        comments.comment_id, 
        comments.votes, 
        comments.created_at, 
        comments.author, 
        comments.body 
        FROM comments
        WHERE comments.review_id = $1    
    ;`,
      [id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.addCommentsByReviewId = (comment, reviewId) => {
  return db
    .query(
      `
    INSERT INTO comments
    (author, review_id, votes, body)
    VALUES
    ($1, $2, 0, $3)
    RETURNING *
  ;`,
      [comment.username, reviewId, comment.body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentById = (id) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    returning *
  ;`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Oh Dear, comment id does not exist!",
        });
      }
    });
};
