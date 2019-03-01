const { Order } = require("@models");
const { withCatch } = require("@helpers");
const { Bittrex, winston } = require("@services");

module.exports = agenda => {
  agenda.define("CheckOrderStatus", async (job, done) => {
    const { orderType, orderId, _btxOrderId: uuid } = job.attrs.data;

    // Sanity check to make sure we have thet critical piece of data
    if (!uuid) {
      job.disable();
      return done(new Error("Bittrex order ID not provided."));
    }

    // create a new Bittrex service that contains helper functions
    const btx = new Bittrex({
      apiKey: process.env.BITTREX_API_KEY,
      apiSecret: process.env.BITTREX_API_SECRET
    });

    const cancelOrderIfOpen = async () => {
      // Find the MongoDB document that is paired to Bittrex Order
      const order = await Order.findOne({ _id: orderId });

      // Get the current status of the Bittrex order
      const { success, message, result } = await btx.getOrder({ uuid });

      // sanity check - cancel out of job process if we aren't able to retrieve order status
      if (!success) {
        throw new Error(`Could not get order status: ${message}`);
      }

      // Helper method to cancel Bittrex order and update MongoDB document status
      const cancel = async () => {
        order.status = "CANCELLED";

        const [cancelled] = await Promise.all([
          btx.cancelOrder({ uuid }),
          order.save()
        ]);

        if (!cancelled.success) {
          throw new Error(`Something went wrong. ${cancelled.message}`);
        }
      };

      const { IsOpen } = result;

      // Handle Bittrex order differently based on type of order
      if (orderType === "BUY") {
        // if the order is fulfilled, we want to initiate a SellBot and update the MongoDB order status
        if (!IsOpen) {
          order.status = "COMPLETED";
          const sellBot = agenda
            .create("SellBot", { orderId: order._id })
            .repeatEvery("1 hour");

          await Promise.all([order.save(), sellBot.save()]);
        } else {
          await cancel();
        }
      } else {
        if (IsOpen) {
          await cancel();
        }
      }

      return order;
    };

    const [error] = await withCatch(cancelOrderIfOpen());

    if (error) {
      winston.error(`Job ID: ${job.id} - ${error.message}`);
      return done(error);
    }

    return done();
  });
};
