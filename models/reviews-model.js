const db = require("../db/connection");
const format = require("pg-format");

exports.checkReviewIdExists = (id) => {
  return db
    .query(
      `
        SELECT * FROM reviews
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

exports.checkQueryValue = (valueArr, value) => {};

exports.fetchReviews = (sortBy = "created_at", order = "DESC", category) => {
  console.log(category);

  const categoryArr = [
    "euro game",
    "social deduction",
    "dexterity",
    "children's games",
  ];
  const orderArr = ["ASC", "DESC"];

  const sortByColumnsArr = [
    "created_at",
    "owner",
    "review_id",
    "category",
    "votes",
    "comment_count",
  ];

  let queryStr = `
   SELECT reviews.*, (SELECT COUNT(*) FROM comments WHERE comments.review_id=reviews.review_id) AS comment_count FROM reviews
  `;

  if (category && categoryArr.includes(category)) {
    console.log(queryStr);
    queryStr += ` WHERE category LIKE '${category}'`;
    console.log(queryStr);
  } else if (category !== undefined) {
    return Promise.reject({
      status: 404,
      msg: "Oh Dear, Invalid category!",
    });
  }
  if (!sortByColumnsArr.includes(sortBy)) {
    return Promise.reject({
      status: 404,
      msg: "Oh Dear, Invalid sort_by value!",
    });
  } else {
    queryStr += `ORDER BY ${sortBy}`;
  }
  if (!orderArr.includes(order.toUpperCase())) {
    return Promise.reject({
      status: 404,
      msg: "Oh Dear, Invalid order value!",
    });
  } else {
    if (order.toUpperCase() === "ASC") {
      queryStr += ` ASC`;
    } else {
      queryStr += ` DESC`;
    }
  }

  return db.query(queryStr).then((result) => {
    console.log(result.rows);
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
  UPDATE reviews
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
