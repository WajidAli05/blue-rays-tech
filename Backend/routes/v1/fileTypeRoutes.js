import express from 'express';
const router = express.Router();
import { getFileTypes } from '../../controllers/fileTypeController.mjs';

router.get('/file-types', getFileTypes);

export default router;