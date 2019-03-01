const { Order } = require("@models");
const { percentChange, toBinanceName, withCatch } = require("@helpers");
const { Bittrex, winston } = require("@services");
const { Boss } = require("@strategies");

module.exports = agenda => {
  agenda.define("SellBot", async (job, done) => {
    const { orderId } = job.attrs.data;

    // Sanity check to ensure that we have order information (goals, pricing, etc)
    if (!orderId) {
      job.disable();
      return done(new Error("Job was not provided with an order ID."));
    }

    // create a new Bittrex service that contains helper functions
    const btx = new Bittrex({
      apiKey: process.env.BITTREX_API_KEY,
      apiSecret: process.env.BITTREX_API_SECRET
    });

    let sellOrder = null;

    const { gainGoal, stopLoss, prices, name, units } = await Order.findOne({
      _id: orderId
    });

    const strategy = new Boss({ market: toBinanceName(name) });
    const { lb, bb, pb, price } = await strategy.all();

    // calculate the percentage difference between purchase price and current market value
    const percentDiff = percentChange(prices.bid, price);

    const createOrder = async () => {
      const { success, message, result } = await btx.createOrder({
        type: "selllimit",
        market: name,
        quantity: units,
        rate: price
      });

      if (!success) {
        throw new Error(`${name} - Could not execute order. ${message}`);
      }

      sellOrder = new Order({
        name,
        type: "SELL",
        status: "PENDING",
        gainGoal,
        stopLoss,
        units,
        movingAverages: {
          littleBear: lb,
          bigBear: bb,
          papaBear: pb
        },
        prices: {
          bid: prices.bid,
          ask: price
        }
      });

      const [btxOrderDetails] = await Promise.all([
        btx.getOrder({ uuid: result.uuid }),
        sellOrder.save()
      ]);

      if (!btxOrderDetails.success) {
        throw new Error(`Could not get order status: ${message}`);
      }

      const { IsOpen } = btxOrderDetails.results;
      if (!IsOpen) {
        sellOrder.status = "COMPLETED";
        await sellOrder.save();
      } else {
        const orderStatusCheck = await agenda.schedule(
          "in 5 minutes",
          "CheckOrderStatus",
          {
            oderType: sellOrder.type,
            orderId: sellOrder._id,
            _bittrexOrderId: result.uuid
          }
        );
      }

      job.disable();
      return sellOrder;
    };

    // This entire process will run every hour only if indicators are met
    // this is where our formula works its magic
    // ... code to run forumla and execute async function above
  });
};
