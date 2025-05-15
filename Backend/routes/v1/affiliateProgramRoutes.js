import express from 'express';
const router = express.Router();
import { getAffiliatePrograms } from '../../controllers/affiliateProgramController.mjs';

router.get('/affiliate-program' , getAffiliatePrograms);

export default router;