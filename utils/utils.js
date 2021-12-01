exports.dataFormatter = (data, ...keys) => {
  const result = [];
  if (!data.length) return result;

  for (item of data) {
    const arr = [];
    keys.forEach((key) => {
      arr.push(item[key]);
    });
    result.push(arr);
  }
  return result;
};

exports.notNumber = (data) => {
  if (isNaN(data) || data % 1 !== 0) {
    return Promise.reject({
      status: 422,
      msg: "Oh Dear, inc_votes needs to be a positive whole number!",
    });
  }
  return "is a number";
};
