import express from "express";
import {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
} from "../../controllers/cartController.mjs";

const router = express.Router();

router.post("/cart/add", addToCart);
router.delete("/cart/remove", removeFromCart);
router.patch("/cart/increase", increaseQuantity);
router.patch("/cart/decrease", decreaseQuantity);

export default router;
