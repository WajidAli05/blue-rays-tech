import express from 'express';
import {
  createShipping,
  getShipping,
  updateShipping,
  deleteShipping,
  getShippingById,
  updateShippingStatus,
  getAllShippings,
  getShippingStats,
  getShippingsByDateRange
} from '../../controllers/shippingController.mjs';

import { validateToken } from '../../middlewares/accessTokenHandler.js';
import { validateRole } from '../../middlewares/roleAuth.js';

const router = express.Router();

// ----------- ADMIN ROUTES ---------------
router.get('/shippings', validateToken, validateRole(['admin', 'superadmin']), getAllShippings); // All shipping records
router.get('/shipping/stats', validateToken, validateRole(['admin', 'superadmin']), getShippingStats); // Stats summary
router.get('/shipping/range', validateToken, validateRole(['admin', 'superadmin']), getShippingsByDateRange); // By date range

// ----------- BASIC CRUD ---------------
router.post('/shipping/', validateToken, createShipping); // Create new shipping
router.get('/shipping/user/', validateToken, getShipping); // Get shipping by user
router.get('/shipping/:id', validateToken, getShippingById); // Get by ID
router.patch('/shipping/:id', validateToken, updateShipping); // Update by ID
router.delete('/shipping/:id', validateToken, deleteShipping); // Delete by ID

// ----------- STATUS MANAGEMENT ---------------
router.patch('/shipping/status/:id', validateToken, updateShippingStatus); // Update shipping status


export default router;