const crypto = require("crypto");
const axios = require("axios");
const { parameterize } = require("@helpers");

const btxClient = ({ base, apiKey, apiSecret }) => {
  const signature = challenge => {
    return crypto
      .createHmac("sha512", apiSecret)
      .update(challenge)
      .digest("hex");
  };

  const instance = axios.create({ baseURL: base });

  instance.interceptors.request.use(
    config => {
      const challenge =
        config.baseURL + config.url + parameterize(config.params);
      const sign = signature(challenge);

      config.params["apikey"] = apiKey;
      config.params["nonce"] = Date.now();
      config.headers.apisign = sign;

      return config;
    },
    error => Promise.reject(error)
  );

  return instance;
};

module.exports = { btxClient };
