import express from "express";
import { loginAdmin, logoutAdmin } from "../../controllers/adminController.mjs";
import { validateToken } from "../../middlewares/accessTokenHandler.js";

const router = express.Router();

router.post("/admin-login", loginAdmin);
router.post("/admin-logout", validateToken, logoutAdmin);
    
export default router;