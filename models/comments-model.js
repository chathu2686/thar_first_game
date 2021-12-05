const db = require("../db/connection");
const format = require("pg-format");
const { checkReviewIdExists } = require("../models/reviews-model");
const { checkUsernameExists } = require("./users-model");
const { isIntegerOverZero, pagination } = require("../utils/utils");

exports.fetchCommentsByReviewId = (id, limit, pageNumber) => {
  return Promise.all([
    checkReviewIdExists(id),
    isIntegerOverZero(limit),
    isIntegerOverZero(pageNumber),
  ])
    .then(() => {
      return db.query(
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
      );
    })
    .then(({ rows }) => {
      const result = pagination(rows, Number(limit), Number(pageNumber));
      return result;
    });
};

exports.addCommentByReviewId = (comment, reviewId) => {
  if (!comment.username || !comment.body) {
    return Promise.reject({
      status: 400,
      msg: "Oh Dear, comment is incomeplete!",
    });
  }
  return checkUsernameExists(comment.username)
    .then(() => {
      return db.query(
        `
    INSERT INTO commentData
    (author, review_id, votes, body)
    VALUES
    ($1, $2, 0, $3)
    RETURNING *
  ;`,
        [comment.username, reviewId, comment.body]
      );
    })
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

exports.editCommentById = (id, newVotes) => {
  return db
    .query(
      `
  UPDATE commentData
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *
  ;`,
      [newVotes, id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Oh Dear, comment id does not exist!",
        });
      } else {
        return rows[0];
      }
    });
};
