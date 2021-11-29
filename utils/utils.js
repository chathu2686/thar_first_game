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
