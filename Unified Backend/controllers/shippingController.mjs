import Shipping from '../models/shippingModel.js';

//create new shipping
const createShipping = (req, res) => { 
    const { firstName, lastName, email, phone, address, apartment, city, state, postalCode, country } = req.body;
    const userId = req.user.id;

    //validate required fields
    if (!userId ||!firstName || !lastName || !email || !phone || !address || !city || !state || !postalCode || !country) {
        return res.status(400).json({ 
            status: false,
            message: 'All fields are required' 
        });
    }

    // Create new shipping record
    new Shipping({
        user: userId,
        firstName,
        lastName,
        email,
        phone,
        address,
        apartment,
        city,
        state,
        postalCode,
        country
    })
    .save()
    .then(shipping => {
        res.status(201).json({
            status: true,
            message: 'Shipping record created successfully',
            data: shipping
        });
    })
    .catch(error => {
        res.status(500).json({
            status: false,
            message: 'Failed to create shipping record',
            error: error.message
        });
    });
}

//get all shipping records for a user
const getShipping = (req, res) => {
    const userId = req.user.id;

    //find shippings for this user
    Shipping.find({ user: userId })
    .then(shippings => {
        if(!shippings || shippings.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'No shipping records found for this user'
            });
        }
        
        res.status(200).json({
            status: true,
            message: 'Shipping records retrieved successfully',
            data: shippings
        })
    })
    .catch(error => {
        res.status(500).json({
            status: false,
            message: 'Failed to retrieve shipping records',
            error: error.message
        });
    });

}

const updateShipping = (req, res) => { /* Update shipping record by ID */ }
const deleteShipping = (req, res) => { /* Delete shipping record by ID */ }
const getShippingById = (req, res) => { /* Get single shipping record by ID */ }

// Status Management
const updateShippingStatus = (req, res) => { /* Update shipping status */ }
const markAsDelivered = (req, res) => { /* Mark as delivered */ }
const cancelShipping = (req, res) => { /* Cancel shipping */ }

// Admin & Reporting
const getAllShippings = (req, res) => { /* Admin: Get all records */ }
const getShippingStats = (req, res) => { /* Admin: Stats like total, status counts */ }
const getShippingsByDateRange = (req, res) => { /* Admin: Records in date range */ }

export {
  // Basic
  createShipping,
  getShipping,
  updateShipping,
  deleteShipping,
  getShippingById,

  // Status
  updateShippingStatus,
  markAsDelivered,
  cancelShipping,

  // Admin
  getAllShippings,
  getShippingStats,
  getShippingsByDateRange
};