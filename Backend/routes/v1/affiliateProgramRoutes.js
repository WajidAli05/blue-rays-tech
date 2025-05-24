import express from 'express';
const router = express.Router();
import { getAffiliatePrograms } from '../../controllers/affiliateProgramController.mjs';
import { validateToken } from '../../middlewares/accessTokenHandler.js';

router.get('/affiliate-program' , validateToken, getAffiliatePrograms);

export default router;