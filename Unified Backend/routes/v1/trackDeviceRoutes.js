import express from 'express';
const router = express.Router();
import { validateToken } from "../../middlewares/accessTokenHandler.js";
import { validateRole } from "../../middlewares/roleAuth.js";
import { addDeviceAccess, getDeviceAccess, getDeviceAccessOverTime } from '../../controllers/trackDeviceController.mjs';

router.post('/trackDevice', validateToken, validateRole(['superadmin', 'admin']), addDeviceAccess);
router.get('/trackDevice', validateToken, validateRole(['superadmin', 'admin']), getDeviceAccess);
router.get('/trackDeviceOverTime', validateToken, validateRole(['superadmin', 'admin']), getDeviceAccessOverTime);

export default router;