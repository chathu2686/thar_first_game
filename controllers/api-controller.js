const { fetchEndpoints } = require("../models/api-model");
const { editReviewById } = require("../models/reviews-model");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((endPoints) => {
      res.status(200).send(endPoints);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
