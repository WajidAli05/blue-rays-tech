import express from "express";
const router = express.Router();

import {
    createAnnouncement,
    getAnnouncements,
    editAnnouncement,
    deleteAnnouncement
} from "../../controllers/announcementBarController.mjs";
import { validateToken } from '../../middlewares/accessTokenHandler.js';
import { validateRole } from '../../middlewares/roleAuth.js';

router.post("/announcement", validateToken, validateRole(['admin', 'superadmin']), createAnnouncement);
router.get("/announcement", validateToken, validateRole(), getAnnouncements);
router.put("/announcements/:announcementId/messages/:messageId", validateToken, validateRole(['admin', 'superadmin']), editAnnouncement);
router.delete('/announcement/:announcementId/messages/:messageId', validateToken, validateRole(['admin', 'superadmin']), deleteAnnouncement);

export default router;