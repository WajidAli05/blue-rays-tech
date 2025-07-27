import express from 'express';
const router = express.Router();
import { addDeviceAccess, getDeviceAccess } from '../../controllers/trackDeviceController.mjs';

router.post('/trackDevice', addDeviceAccess);
router.get('/trackDevice', getDeviceAccess);

export default router;