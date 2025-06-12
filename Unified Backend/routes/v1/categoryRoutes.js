import express from 'express';
const router = express.Router();

import { getCategories,
         getTotalCategories,
         getSubcategoriesByCategoryId
 } from '../../controllers/categoryController.mjs';
 import { validateToken } from '../../middlewares/accessTokenHandler.js';

router.get('/category', getCategories);
router.get('/total-categories', validateToken, getTotalCategories);
router.get('/categories/:id/subcategories', validateToken, getSubcategoriesByCategoryId);

export default router;