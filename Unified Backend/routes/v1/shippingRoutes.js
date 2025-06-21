import express from 'express';
import {
  createShipping,
  getShipping,
  updateShipping,
  deleteShipping,
  getShippingById,
  updateShippingStatus,
  markAsDelivered,
  cancelShipping,
  getAllShippings,
  getShippingStats,
  getShippingsByDateRange
} from '../../controllers/shippingController.mjs';

import { validateToken } from '../../middlewares/accessTokenHandler.js';
import { validateRole } from '../../middlewares/roleAuth.js';

const router = express.Router();

// ----------- BASIC CRUD ---------------
router.post('/', validateToken, createShipping); // Create new shipping
router.get('/user/:userId', validateToken, getShipping); // Get shipping by user
router.get('/:id', validateToken, getShippingById); // Get by ID
router.put('/:id', validateToken, updateShipping); // Update by ID
router.delete('/:id', validateToken, deleteShipping); // Delete by ID

// ----------- STATUS MANAGEMENT ---------------
router.put('/status/:id', validateToken, updateShippingStatus); // Update shipping status
router.patch('/delivered/:id', validateToken, markAsDelivered); // Mark as delivered
router.patch('/cancel/:id', validateToken, cancelShipping); // Cancel shipping

// ----------- ADMIN ROUTES ---------------
router.get('/', validateToken, validateRole(['admin', 'superadmin']), getAllShippings); // All shipping records
router.get('/stats', validateToken, validateRole(['admin', 'superadmin']), getShippingStats); // Stats summary
router.get('/range/:startDate/:endDate', validateToken, validateRole(['admin', 'superadmin']), getShippingsByDateRange); // By date range

export default router;