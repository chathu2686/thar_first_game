const { fetchEndpoints } = require("../models/api-model");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((endPoints) => {
      //   console.log(endPoints);

      res.status(200).send({ endPoints });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
