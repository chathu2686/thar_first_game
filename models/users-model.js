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
