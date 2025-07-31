import express from 'express';
import { trackSessionDuration, getSessionDurationStats } from '../../controllers/sessionController.mjs';
const router = express.Router();
import { validateToken } from '../../middlewares/accessTokenHandler.js';
import { validateRole } from '../../middlewares/roleAuth.js';

//as navigator.sendBeacon send data as text not json. So, need to use text/plain content type
router.post('/session-duration', express.text({ type: 'text/plain' }), trackSessionDuration);
router.get('/session-duration/stats', validateToken, validateRole(['admin', 'superadmin']), getSessionDurationStats);

export default router;