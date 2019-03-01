const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      uppercase: true,
      index: true
    },
    type: {
      type: String,
      enum: ["BUY", "SELL"],
      trim: true
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETE", "CANCELLED"],
      trim: true,
      index: true
    },
    gainGoal: Number,
    stopLoss: Number,
    movingAverages: {
      littleBear: {
        type: Number
      },
      bigBear: {
        type: Number
      },
      papaBear: {
        type: Number
      }
    },
    units: {
      type: Number
    },
    prices: {
      bid: {
        type: Number
      },
      ask: {
        type: Number
      }
    },
    _creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
