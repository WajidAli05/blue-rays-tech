import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "usd",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    items: [
      {
        productId: String,
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;