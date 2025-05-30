import express from 'express';
const router = express.Router();
import { getFileTypes } from '../../controllers/fileTypeController.mjs';
import { validateToken } from '../../middlewares/accessTokenHandler.js';

router.get('/file-types', validateToken, getFileTypes);

export default router;