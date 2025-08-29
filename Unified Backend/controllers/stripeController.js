import Stripe from "stripe";
import Order from "../models/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ PaymentIntent (one-time payments)
const createPaymentIntent = (req, res) => {
  const { amount, currency = "usd", customer_email } = req.body;

  if (!Number.isInteger(amount) || amount < 1) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  stripe.paymentIntents
    .create({
      amount,
      currency,
      receipt_email: customer_email,
      automatic_payment_methods: { enabled: true },
    })
    .then((paymentIntent) => {
      res.json({ clientSecret: paymentIntent.client_secret });
    })
    .catch((err) => {
      console.error("Error creating PaymentIntent:", err.message);
      res.status(500).json({ error: err.message });
    });
};

// ✅ Checkout Session (subscription / one-time checkout)
export const createCheckoutSession = (req, res) => {
  const { cartItems, shippingData } = req.body;

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.quantity * item.productId.price;
  }, 0);

  const shippingCost = 9.99;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal + shippingCost + tax;

  stripe.checkout.sessions
    .create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productId.name,
          },
          unit_amount: Math.round(item.productId.price * 100),
        },
        quantity: item.quantity,
      })),
      customer_email: shippingData?.email,
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    })
    .then((session) => {
      // ✅ Transform cartItems to match Order schema
      const orderItems = cartItems.map((item) => ({
        productId: item.productId._id.toString(),
        name: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
      }));

      const order = new Order({
        stripeSessionId: session.id,
        customerEmail: shippingData?.email,
        amount: totalAmount,
        currency: "usd",
        status: "pending",
        items: orderItems,
      });

      return order.save().then(() => {
        res.json({ url: session.url });
      });
    })
    .catch((err) => {
      console.error("Stripe error:", err.message);
      res.status(500).json({ error: err.message });
    });
};

// ✅ Stripe Webhook
const handleWebhook = (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("✅ Checkout session completed:", session.id);

      // Update order to "paid"
      Order.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          paymentStatus: "paid",
          customerEmail: session.customer_details?.email,
          amount: session.amount_total / 100,
          currency: session.currency,
        },
        { new: true }
      )
        .then((order) =>
          console.log("Order updated to paid:", order?._id || "Not found")
        )
        .catch((err) => console.error("Order update failed:", err.message));

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

export default {
  createPaymentIntent,
  createCheckoutSession,
  handleWebhook,
};