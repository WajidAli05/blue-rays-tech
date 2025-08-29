import { Router, json } from "express";
import {
    createPaymentIntent,
    createCheckoutSession
} from "../../controllers/stripeController.js";

const router = Router();

// PaymentIntent (one-time payments)
router.post("/payment-intent", json() ,createPaymentIntent);

// Checkout Session (subscription or one-time checkout)
router.post("/checkout-session", json(), createCheckoutSession);

export default router;