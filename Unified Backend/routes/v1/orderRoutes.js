import express from "express";
import { getOrders, 
        getOrderByUserId, 
        deleteOrderById,
        totalAmountOfOrdersTillDate,
        getOrderTrends,
        getOrderByUserEmail
    } from "../../controllers/orderController.mjs";
import { validateToken } from "../../middlewares/accessTokenHandler.js";
import { validateRole } from "../../middlewares/roleAuth.js";

const router = express.Router();

router.get("/all-orders", validateToken, validateRole(["superadmin", "admin"]), getOrders);
router.get("/total-amount-of-orders", validateToken, validateRole(["superadmin", "admin"]), totalAmountOfOrdersTillDate);
router.get("/order-trends", validateToken, validateRole(["superadmin", "admin"]), getOrderTrends);
router.get("/user/:email/orders", validateToken, validateRole(["superadmin", "admin"]), getOrderByUserEmail);
router.get("/:user-id/orders", validateToken, getOrderByUserId);
router.delete("/:orderId", validateToken, validateRole(["admin", "superadmin"]), deleteOrderById );


export default router;