const { agenda } = require("@worker");
const { filterAsync } = require("node-filter-async");
const { Boss } = require("@strategies");
const { toBinanceName } = require("@helpers");

const botController = {};

botController.get = async (req, res) => {};
botController.getAll = async (req, res) => {
  const bots = await agenda.jobs({});
  const count = bots.length;
  res.json({ success: true, bots, count });
};

botController.getAllActive = async (req, res) => {
  const bots = await agenda.jobs({ disabled: null });
  const count = bots.length;
  res.json({ success: true, bots, count });
};

botController.delete = async (req, res) => {};

botController.deleteAll = async (req, res) => {
  const count = await agenda.cancel({});
  res.json({ success: true, count });
};

/**
 * Create a bot to run boss method (lb > bb && lb > pb)
 *
 * * Before creating the bot, check to see if LB is already greater than BB && PB
 * * If this is true, do not create the bot, send a message back to the browser
 *
 * * If this conditional statement fails, create a new bot
 * @param {Object} req
 * @param {Object} res
 */
botController.create = async (req, res) => {
  const strategy = new Boss({ market: toBinanceName(req.body.marketName) });
  await strategy.all();
  const qualified = strategy.qualified();

  if (!qualified) {
    return res.json({
      success: false,
      message: "Little Bear is already greater than Big Bear OR Papa Bear"
    });
  }

  // if conditional statement above is not triggered, then we KNOW that LB is below BB && LB
  // so we create the bot
  const job = agenda.create("BuyBot", req.body).repeatEvery("1 hour");
  const bot = await job.save();
  res.json({ success: true, bot });
};

botController.createMultiple = async (req, res) => {
  const { markets, ...rest } = req.body;

  const precheckedItems = await filterAsync(markets, async market => {
    const strategy = new Boss({ market: toBinanceName(market) });
    await strategy.all();
    return strategy.qualified();
  });

  const jobs = precheckedItems.map(market =>
    agenda
      .create("BuyBot", {
        marketName: market,
        ...rest
      })
      .repeatEvery("1 hour")
      .save()
  );

  const bots = await Promise.all(jobs);
  res.json({ success: true, bots });
};

module.exports = botController;
