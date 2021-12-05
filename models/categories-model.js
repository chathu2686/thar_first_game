const db = require("../db/connection");

exports.isValidCategory = (category) => {
  return db
    .query(
      `
    SELECT slug from categoryData
  ;`
    )
    .then(({ rows }) => {
      const categoryArr = rows.map((category) => (category = category.slug));
      if (!categoryArr.includes(category) && category !== "%") {
        return Promise.reject({
          status: 404,
          msg: "Oh Dear, category does not exist!",
        });
      }
    });
};

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categoryData`).then((response) => {
    return response.rows;
  });
};

exports.addCategory = (newCategory) => {
  if (!newCategory.slug || !newCategory.description) {
    return Promise.reject({
      status: 400,
      msg: "Oh Dear, category information incomplete!",
    });
  }
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
