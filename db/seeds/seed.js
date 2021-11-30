const db = require("../connection");
const format = require("pg-format");
const { values } = require("../data/development-data/comments");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  return (
    db
      // dropping tables >>>>>>>>>>>
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
      // creating tables >>>>>>>>>>>>>
      .then(() => {
        return db.query(`
     CREATE TABLE categories (
       slug VARCHAR(40) PRIMARY KEY,
       description TEXT NOT NULL
       )
       ;`);
      })
      .then(() => {
        return db.query(
          `CREATE TABLE users (
        username VARCHAR(40) PRIMARY KEY,
        avatar_url VARCHAR(300),
        name TEXT NOT NULL
      )
      ;`
        );
      })
      .then(() => {
        return db.query(
          `CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        review_body TEXT NOT NULL,
        designer VARCHAR(255) NOT NULL,
        review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg' NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        category VARCHAR(40) REFERENCES categories(slug) ON DELETE CASCADE NOT NULL,
        owner VARCHAR(40) REFERENCES users(username) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
      ;`
        );
      })
      .then(() => {
        return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(40) NOT NULL,
        review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE NOT NULL,
        votes INT default 0 NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        body TEXT NOT NULL
      )
      ;`);
      })
      // inserting data into tables >>>>>>>>>>>>>>>>>>>>
      .then(() => {
        const formattedCategoryData = categoryData.map((category) => {
          return [category.slug, category.description];
        });

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
        const formattedUserData = userData.map((user) => {
          return [user.username, user.avatar_url, user.name];
        });

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
        const formattedReviewData = reviewData.map((review) => {
          return [
            review.title,
            review.review_body,
            review.designer,
            review.review_img_url,
            review.votes,
            review.category,
            review.owner,
            review.created_at,
          ];
        });

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
        const formattedCommentData = commentData.map((comment) => {
          return [
            comment.author,
            comment.review_id,
            comment.votes,
            comment.created_at,
            comment.body,
          ];
        });

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
  );
};

module.exports = seed;
