const { fetchCategories, addCategory } = require("../models/categories-model");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.postCategory = (req, res, next) => {
  const newCat = req.body;
  addCategory(newCat)
    .then((newCategory) => {
      res.status(201).send({ newCategory });
    })
    .catch(next);
};
