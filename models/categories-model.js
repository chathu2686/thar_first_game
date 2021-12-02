const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categoryData`).then((response) => {
    return response.rows;
  });
};

exports.addCategory = (newCategory) => {
  return db
    .query(
      `
    INSERT INTO categoryData
    (slug, description)
    VALUES
    ($1, $2)
    returning *
  ;`,
      [newCategory.slug, newCategory.description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
