import express from 'express';
import { getVisitCount,
         increaseVisitCount
 } from '../../controllers/visitController.mjs'
 import { validateToken } from '../../middlewares/accessTokenHandler.js';
import { validateRole } from '../../middlewares/roleAuth.js';

const router = express.Router();

router.post('/visit-count', increaseVisitCount);
router.get('/visit-count', validateToken, validateRole(['admin', 'superadmin']), getVisitCount);

export default router;