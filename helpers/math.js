const isNumber = input => typeof input === "number";

exports.percentChange = (original, updated) => {
  let a, b;

  if (!isNumber(original)) {
    a = parseFloat(original);
  }

  if (!isNumber(updated)) {
    b = parseFloat(updated);
  }

  return (100 * Math.abs(a - b)) / ((a + b) / 2);
};
