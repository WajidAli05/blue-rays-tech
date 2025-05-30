import express from 'express';
const router = express.Router();

import { getCategories,
         getTotalCategories,
 } from '../../controllers/categoryController.mjs';
 import { validateToken } from '../../middlewares/accessTokenHandler.js';

router.get('/category', validateToken, getCategories);
router.get('/total-categories', validateToken, getTotalCategories);

export default router;