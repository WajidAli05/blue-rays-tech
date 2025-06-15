import express from 'express';
const router = express.Router();

import { getCategories,
         getTotalCategories,
         getSubcategoriesByCategoryId,
         getSubcategoriesByCategoryName
 } from '../../controllers/categoryController.mjs';
 import { validateToken } from '../../middlewares/accessTokenHandler.js';

router.get('/category', getCategories);
router.get('/total-categories', getTotalCategories);
router.get('/subcategories/:categoryName', getSubcategoriesByCategoryName);
router.get('/categories/:id/subcategories', getSubcategoriesByCategoryId);

export default router;