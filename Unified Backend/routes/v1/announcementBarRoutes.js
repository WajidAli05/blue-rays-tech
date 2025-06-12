import express from "express";
const router = express.Router();

import {
    createAnnouncement,
    getAnnouncements,
    editAnnouncement,
    deleteAnnouncement,
    deactivateAnnouncement,
    activateAnnouncement
} from "../../controllers/announcementBarController.mjs";
import { validateToken } from '../../middlewares/accessTokenHandler.js';
import { validateRole } from '../../middlewares/roleAuth.js';

router.post("/announcement", validateToken, validateRole(['admin', 'superadmin']), createAnnouncement);
router.get("/announcement", validateToken, validateRole(), getAnnouncements);
router.put("/announcements/:messageId", validateToken, validateRole(['admin', 'superadmin']), editAnnouncement);
router.delete('/announcement/:messageId', validateToken, validateRole(['admin', 'superadmin']), deleteAnnouncement);
router.patch('/announcement/deactivate/:messageId', validateToken, validateRole(['admin', 'superadmin']), deactivateAnnouncement);
router.patch('/announcement/activate/:messageId', validateToken, validateRole(['admin', 'superadmin']), activateAnnouncement);

export default router;