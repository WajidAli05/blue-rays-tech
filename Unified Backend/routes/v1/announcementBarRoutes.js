import express from "express";
const router = express.Router();

import {
    createAnnouncement,
    getAnnouncements
} from "../../controllers/announcementBarController.mjs";
import { validateToken } from '../../middlewares/accessTokenHandler.js';
import { validateRole } from '../../middlewares/roleAuth.js';

router.post("/announcement", validateToken, validateRole(['admin', 'superadmin']), createAnnouncement);
router.get("/announcement", validateToken, validateRole(), getAnnouncements);

export default router;