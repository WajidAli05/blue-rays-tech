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

//update a shipping record for a logged in user
//TODO: will implement if required after the application is fully functional
const updateShipping = (req, res) => {
}

//TODO: only if required. Does not see it required for now
const deleteShipping = (req, res) => { /* Delete shipping record by ID */ }

// Get single shipping record by ID for a logged in user
const getShippingById = (req, res) => {
    const shippingId = req.params.id;

    //validate id
    if(!shippingId) {
        return res.status(400).json({
            status: false,
            message: 'Shipping ID is required'
        });
    }

    //find shipping by ID
    Shipping.findById(shippingId)
    .then(shipping => {
        if(!shipping) {
            return res.status(404).json({
                status: false,
                message: 'Shipping record not found'
            });
        }

        //check if the user is authorized to view this shipping record
        if(shipping.user.toString() !== req.user.id) {
            return res.status(403).json({
                status: false,
                message: 'You are not authorized to view this shipping record'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Shipping record retrieved successfully',
            data: shipping
        });
    })
}

// Status Management
const updateShippingStatus = (req, res) => {
    const shippingId = req.params.id;
    const { status } = req.body;

    // Validate ID and status
    if (!shippingId || !status) {
        return res.status(400).json({
            status: false,
            message: 'Shipping ID and status are required'
        });
    }

    const lowerCasedStatus = status?.toLowerCase();
    //change status to lower case
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(lowerCasedStatus)) {
        return res.status(400).json({
            status: false,
            message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
        });
    }

    //find by shipping id and update status
    Shipping.findByIdAndUpdate(shippingId, { status: lowerCasedStatus }, { new: true })
    .then(shipping => {
        if (!shipping) {
            return res.status(404).json({
                status: false,
                message: 'Shipping record not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Shipping status updated successfully',
            data: shipping
        });
    })
    .catch(error => {
        res.status(500).json({
            status: false,
            message: 'Failed to update shipping status',
            error: error.message
        });
    });
}
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