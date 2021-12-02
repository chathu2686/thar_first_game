const db = require("../db/connection");

exports.checkUsernameExists = (username) => {
  return db
    .query(
      `
    SELECT * from userData
    WHERE username LIKE $1
    ;`,
      [username]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Oh Dear, username does not exist!",
        });
      }
    });
};

exports.fetchUsers = () => {
  return db
    .query(
      `
  SELECT * FROM userData
  ;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchUserById = (userName) => {
  return db
    .query(
      `
  SELECT * FROM userData
  WHERE username LIKE $1
  ;`,
      [userName]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Oh Dear, user does not exist!",
        });
      } else {
        return rows[0];
      }
    });
};
