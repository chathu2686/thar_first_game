const { fetchUsers, fetchUserById } = require("../models/users-model");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  const userName = req.params.username;

  fetchUserById(userName)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
