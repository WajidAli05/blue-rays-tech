import express from "express";
import { loginAdmin, logoutAdmin, checkAdminAuth } from "../../controllers/adminController.mjs";
import { validateToken } from "../../middlewares/accessTokenHandler.js";
import { validateRole } from "../../middlewares/roleAuth.js";

const router = express.Router();

router.post("/admin-login", loginAdmin);
router.post("/admin-logout", validateToken, logoutAdmin);
router.get("/admin-auth", validateToken, validateRole(['admin', 'superadmin']), checkAdminAuth);
    
export default router;