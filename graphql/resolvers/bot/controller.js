const { filterAsync } = require("node-filter-async");
const { agenda } = require("@worker");
const { Boss } = require("@strategies");
const { extractErrors, withCatch } = require("@helpers");
const bot = {};

bot.createOne = async (root, args, context, info) => {
  const { marketName } = args;
  const createBot = async () => {
    const strategy = new Boss({ market: marketName });
    const results = await strategy.all();
    const qualified = strategy.qualified();
    if (!qualified) {
      throw new Error("Market indicators fail BOSS preliminary check.");
    }

    return await agenda
      .create("BuyBot", args)
      .repeatEvery("1 hour")
      .save();
  };

  const [err, { attrs } = {}] = await withCatch(createBot());
  const { _id, data } = attrs;
  const response = err
    ? { ok: false, errors: extractErrors(err) }
    : { ok: true, bot: { id: _id.toString(), ...data } };

  return response;
};

bot.createMultiple = async (root, args, context, info) => {
  const { markets, ...rest } = args;
  const createBots = async () => {
    const qualified = await filterAsync(markets, async market => {
      const strategy = new Boss({ market });
      const results = await strategy.all();
      return strategy.qualified();
    });

    const jobs = qualified.map(market =>
      agenda
        .create("BuyBot", {
          marketName: market,
          ...rest
        })
        .repeatEvery("1 hour")
        .save()
    );

    const bots = await Promise.all(jobs);
    return bots;
  };

  const [err, bots] = await withCatch(createBots());
  const response = err
    ? { ok: false, errors: extractErrors(err) }
    : { ok: true, bots };

  return response;
};

module.exports = bot;
