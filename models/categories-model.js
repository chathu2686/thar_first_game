const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categoryData`).then((response) => {
    return response.rows;
  });
};
