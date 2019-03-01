const { createHmac } = require("crypto");

exports.toBinanceName = str =>
  str
    .split("-")
    .reverse()
    .join("");

exports.parameterize = params => {
  return Object.keys(params)
    .map(key => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");
};

exports.createApiSign = url => {
  const hmac = createHmac("sha512", process.env.BITTREX_API_SECRET);
  return hmac.update(url).digest("hex");
};
