const db = require("../db/connection");
const format = require("pg-format");

exports.fetchCommentsByReviewId = (id) => {
  return db
    .query(
      `
        SELECT 
        commentData.comment_id, 
        commentData.votes, 
        commentData.created_at, 
        commentData.author, 
        commentData.body 
        FROM commentData
        WHERE commentData.review_id = $1    
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
    INSERT INTO commentData
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
    DELETE FROM commentData
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
