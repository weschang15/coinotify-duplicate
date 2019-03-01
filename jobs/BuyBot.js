const { Order } = require("@models");
const { toBinanceName, withCatch } = require("@helpers");
const { Boss } = require("@strategies");
const { Bittrex, winston } = require("@services");

module.exports = agenda => {
  agenda.define("BuyBot", async (job, done) => {
    const { marketName, units, gainGoal, stopLoss } = job.attrs.data;
    winston.log(`Bot: ${marketName} - ${JSON.stringify(job)}`);

    // Sanity check to make sure we have thet critical piece of data
    if (!marketName) {
      job.disable();
      return done(new Error("A market name has not been provided."));
    }

    // create a new Bittrex service that contains helper functions
    const btx = new Bittrex({
      apiKey: process.env.BITTREX_API_KEY,
      apiSecret: process.env.BITTREX_API_SECRET
    });

    // create a new Boss strategy (similar to a service) that contains helper functions
    const strategy = new Boss({ market: toBinanceName(marketName) });
    // request market indicators and price of crypto
    const { lb, bb, pb, price: rate } = await strategy.all();

    let buyOrder = null;

    const createOrder = async () => {
      // The amount of DESIRED crypto to buy that will equal the amount of BTC that we want to invest
      const quantity = units / rate;

      // make request to bittrex to initiate a real BUYLIMIT order
      const { success, message, result } = await btx.createOrder({
        type: "buylimit",
        market: marketName,
        quantity,
        rate
      });

      winston.error(`Job ID: ${job.id} - ${JSON.stringify(result)}`);

      // cancel out of process early if creating the Bittrex order failed to prevent wasting CPU resources
      if (!success) {
        throw new Error(`${marketName} - Could not execute order. ${message}`);
      }

      const { uuid } = result;

      // create a new Order record for internal usage (for our DB) that contains detailed information about the BUYLIMIT
      buyOrder = new Order({
        name: marketName,
        type: "BUY",
        status: "PENDING",
        gainGoal,
        stopLoss,
        units: quantity,
        movingAverages: {
          littleBear: lb,
          bigBear: bb,
          papaBear: pb
        },
        prices: {
          bid: rate
        }
      });

      // execute BOTH bittrex order status request and internal order concurrently for speed
      const [btxOrderDetails] = await Promise.all([
        btx.getOrder({ uuid }),
        buyOrder.save()
      ]);

      // sanity check - cancel out of job process if we aren't able to retrieve order status
      if (!btxOrderDetails.success) {
        throw new Error(`Could not get order status: ${message}`);
      }

      // we can proceed with our bot process by immediately creating a SellBot since
      // the order status is closed
      const { IsOpen } = btxOrderDetails.results;
      if (!IsOpen) {
        buyOrder.status = "COMPLETED";
        const sellBot = agenda
          .create("SellBot", { orderId: buyOrder._id })
          .repeatEvery("1 hour");

        await Promise.all([buyOrder.save(), sellBot.save()]);
      } else {
        // Create CheckOrderStatus bot to run in 5 minutes (this will execute a several checks and/or initiate bots)
        const orderStatusCheck = await agenda.schedule(
          "in 5 minutes",
          "CheckOrderStatus",
          {
            oderType: buyOrder.type,
            orderId: buyOrder._id,
            _btxOrderId: uuid
          }
        );
      }
      job.disable();
      return { buyOrder, _btxOrderId: uuid };
    };

    // This entire process will run every hour only if indicators are met
    // this is where our formula works its magic
    // ... code to run forumla and execute async function above
  });
};
