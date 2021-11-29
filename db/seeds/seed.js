const db = require("../connection");
const format = require("pg-format");
const { dataFormatter } = require("../../utils/utils");
const { values } = require("../data/development-data/comments");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories;`);
    })
    .then(() => {
      return db.query(`
     CREATE TABLE categories (
       slug VARCHAR(40) PRIMARY KEY NOT NULL,
       description TEXT NOT NULL)
       ;`);
    })
    .then(() => {
      console.log("categories table created!");
      return db.query(
        `CREATE TABLE users (
        username VARCHAR(40) PRIMARY KEY NOT NULL,
        avatar_url TEXT,
        name VARCHAR(40) NOT NULL
      )
      ;`
      );
    })
    .then(() => {
      console.log("users table created!");
      return db.query(
        `CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        review_body TEXT NOT NULL,
        designer VARCHAR(40) NOT NULL,
        review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        votes INT DEFAULT 0,
        category VARCHAR(40) REFERENCES categories(slug) ON DELETE SET NULL,
        owner VARCHAR(40) REFERENCES users(username) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
      ;`
      );
    })
    .then(() => {
      console.log("categories table created!");
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(40) NOT NULL,
        review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE,
        votes INT default 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        body TEXT NOT NULL
      )
      ;`);
    })
    .then(() => {
      console.log("comments table created!");

      const formattedCategoryData = dataFormatter(
        categoryData,
        "slug",
        "description"
      );

      return db.query(
        format(
          `INSERT INTO categories
      (slug, description)
      VALUES
      %L RETURNING *;`,
          formattedCategoryData
        )
      );
    })
    .then((response) => {
      console.log("data inserted into categories table!");

      const formattedUserData = dataFormatter(
        userData,
        "username",
        "avatar_url",
        "name"
      );

      return db.query(
        format(
          `INSERT INTO users
      (username, avatar_url, name)
      VALUES
      %L RETURNING *;`,
          formattedUserData
        )
      );
    })
    .then((response) => {
      console.log("data inserted into users table!");

      const formattedReviewData = dataFormatter(
        reviewData,
        "title",
        "review_body",
        "designer",
        "review_img_url",
        "votes",
        "category",
        "owner",
        "created_at"
      );

      return db.query(
        format(
          `INSERT INTO reviews
      ( title,
        review_body,
        designer,
        review_img_url,
        votes,
        category,
        owner,
        created_at)
      VALUES
      %L RETURNING *;`,
          formattedReviewData
        )
      );
    })
    .then((response) => {
      console.log("data inserted into reviews table!");

      const formattedCommentData = dataFormatter(
        commentData,
        "author",
        "review_id",
        "votes",
        "created_at",
        "body"
      );

      return db.query(
        format(
          `INSERT INTO comments
      ( author,
        review_id,
        votes,
        created_at,
        body)
      VALUES
      %L RETURNING *;`,
          formattedCommentData
        )
      );
    })
    .then((response) => {
      console.log("data inserted into comments table!");
    });
};

module.exports = seed;
