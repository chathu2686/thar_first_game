const fs = require("fs/promises");

exports.fetchEndpoints = () => {
  //   return fs.readFile("../endpoints.json", "utf-8").then((res) => {
  //     console.log(res);

  return fs.readFile("./endpoints.json").then((result) => {
    console.log(result.toString());
    return result.toString();
  });
};
