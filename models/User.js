const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { AppError } = require("@errors");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "A first name must be provided."],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, "A last name must be provided."],
      trim: true
    },
    email: {
      type: String,
      required: [true, "An email must be provided."],
      trim: true,
      unique: true,
      validate: {
        validator: function(v) {
          return isEmail(v);
        },
        message: props => `${props.value} is not a valid email.`
      },
      index: true
    },
    password: {
      type: String,
      required: [true, "A password must be provided"],
      minlength: 8,
      maxlength: 1024
    },
    settings: {
      bittrex: {
        ak: {
          type: String,
          trim: true
        },
        sk: {
          type: String,
          trim: true
        }
      }
    }
  },
  { timestamps: true }
);

UserSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "_creator"
});

UserSchema.pre("save", async function(next) {
  if (!this.isNew) {
    return next();
  }

  const hashPassword = async ({ password }) => {
    if (!password) {
      throw new AppError("Undefined argument `password`.", 422, false);
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };

  this.password = await hashPassword({ password: this.password });
  next();
});

UserSchema.pre("findOneAndUpdate", async function(next) {
  console.log(this.getQuery());
  next();
});

UserSchema.methods.validatePassword = async function({ password }) {
  if (!password) {
    throw new AppError("Undefined argument `password`.", 422, false);
  }

  const isValid = await bcrypt.compare(password, this.password);
  if (!isValid) {
    throw new AppError("Invalid email or password.", 401, false);
  }

  return isValid;
};

module.exports = mongoose.model("User", UserSchema);
