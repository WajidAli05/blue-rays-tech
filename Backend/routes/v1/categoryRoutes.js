import express from 'express';
const router = express.Router();

import { getCategories,
         getTotalCategories
 } from '../../controllers/categoryController.mjs';

router.get('/category', getCategories);
router.get('/total-categories', getTotalCategories);

export default router;