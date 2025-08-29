import { Router } from "express";
import stripeController from "../../controllers/stripeController.js";

const router = Router();

// PaymentIntent (one-time payments)
router.post("/payment-intent", stripeController.createPaymentIntent);

// Checkout Session (subscription or one-time checkout)
router.post("/checkout-session", stripeController.createCheckoutSession);

export default router;