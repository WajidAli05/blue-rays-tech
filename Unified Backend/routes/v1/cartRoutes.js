import express from "express";
import {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
} from "../../controllers/cartController.mjs";
import { validateToken } from '../../middlewares/accessTokenHandler.js';
import { validateRole } from '../../middlewares/roleAuth.js';

const router = express.Router();

router.post("/cart/add", validateToken, addToCart);
router.delete("/cart/remove", validateToken, removeFromCart);
router.patch("/cart/increase", validateToken, increaseQuantity);
router.patch("/cart/decrease", validateToken, decreaseQuantity);

export default router;
