import express from 'express';
const router = express.Router();

import { getCategories } from '../../controllers/categoryController.mjs';

router.get('/category', getCategories);

export default router;