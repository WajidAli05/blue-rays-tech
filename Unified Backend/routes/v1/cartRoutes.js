import express from "express";
import {
    addToCart,
    getCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
} from "../../controllers/cartController.mjs";
import { validateToken } from '../../middlewares/accessTokenHandler.js';

const router = express.Router();

router.post("/cart/add", validateToken, addToCart);
router.get("/cart", validateToken, getCart);
router.delete("/cart/remove", validateToken, removeFromCart);
router.patch("/cart/increase", validateToken, increaseQuantity);
router.patch("/cart/decrease", validateToken, decreaseQuantity);

export default router;
