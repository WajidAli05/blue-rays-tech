import express from 'express';
import { getVisitCount,
         increaseVisitCount
 } from '../../controllers/visitController.mjs'

const router = express.Router();

router.post('/visit-count', increaseVisitCount);
router.get('/visit-count', getVisitCount);

export default router;