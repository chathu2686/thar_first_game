exports.isIntegerOverZero = (data) => {
  if (!Number(data) || Number(data) % 1 !== 0 || Number(data) < 0) {
    return Promise.reject({
      status: 400,
      msg: "Oh Dear, bad request!",
    });
  }
};

exports.isOrderValid = (order) => {
  const orderArr = ["ASC", "DESC"];

  if (!orderArr.includes(order.toUpperCase())) {
    return Promise.reject({
      status: 400,
      msg: "Oh Dear, Invalid order value!",
    });
  }
};

exports.pagination = (dataArr, limit, pageNumber) => {
  const arrLength = dataArr.length;
  const trimStart = (pageNumber - 1) * limit;
  let trimEnd = 0;

  if (arrLength <= trimStart + limit) {
    trimEnd += arrLength;
  } else {
    trimEnd += trimStart + limit;
  }
  return dataArr.slice(trimStart, trimEnd);
};
