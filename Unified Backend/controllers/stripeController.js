import Stripe from "stripe";
import Order from "../models/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// PaymentIntent (manual payments if needed)
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd", customer_email } = req.body;

    if (!Number.isInteger(amount) || amount < 1) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      receipt_email: customer_email,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating PaymentIntent:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Checkout Session
const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, shippingData } = req.body;

    if (!cartItems?.length || !shippingData?.email) {
      return res.status(400).json({ error: "Cart or email missing" });
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.productId.price,
      0
    );
    const shippingCost = 9.99;
    const tax = subtotal * 0.08;
    const totalAmount = subtotal + shippingCost + tax;

    // Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        // Cart products
        ...cartItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: { name: item.productId.name },
            unit_amount: Math.round(item.productId.price * 100),
          },
          quantity: item.quantity,
        })),
        // Shipping
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Shipping" },
            unit_amount: Math.round(shippingCost * 100),
          },
          quantity: 1,
        },
        // Tax
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Tax" },
            unit_amount: Math.round(tax * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: shippingData.email,
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // Save pending order
    const orderItems = cartItems.map((item) => ({
      productId: item.productId._id.toString(),
      name: item.productId.name,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const order = new Order({
      stripeSessionId: session.id,
      customerEmail: shippingData.email,
      amount: totalAmount,
      currency: "usd",
      status: "pending",
      items: orderItems,
    });

    await order.save();

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Stripe Webhook
const handleWebhook = async (req, res) => {
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

  const sessionId = event.data?.object?.id;
  let update = {};

  switch (event.type) {
    case "payment_intent.succeeded":
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      update = { status: "paid" };
      console.log(`Payment succeeded: ${sessionId}`);
      break;

    case "payment_intent.canceled":
      update = { status: "canceled" };
      console.log(`Payment canceled: ${sessionId}`);
      break;

    case "checkout.session.async_payment_failed":
      update = { status: "failed" };
      console.log(`Async payment failed: ${sessionId}`);
      break;

    case "checkout.session.expired":
      update = { status: "expired" };
      console.log(`Checkout session expired: ${sessionId}`);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Update the order in DB if we have a status change
  if (Object.keys(update).length > 0) {
    try {
      const order = await Order.findOneAndUpdate(
        { stripeSessionId: sessionId },
        update,
        { new: true }
      );
      console.log("Order updated:", order?._id || "Not found");
    } catch (err) {
      console.error("Order update failed:", err.message);
    }
  }

  res.json({ received: true });
};

export {
  createPaymentIntent,
  createCheckoutSession,
  handleWebhook,
};