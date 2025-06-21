import mongoose from 'mongoose';

const shippingSchema = new mongoose.Schema({
  // User reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Order reference (if you have an Order model)
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false
  },
  
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxLength: [50, 'First name cannot exceed 50 characters']
  },
  
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxLength: [50, 'Last name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxLength: [20, 'Phone number cannot exceed 20 characters']
  },
  
  // Address Information
  address: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true,
    maxLength: [200, 'Address cannot exceed 200 characters']
  },
  
  apartment: {
    type: String,
    trim: true,
    maxLength: [100, 'Apartment info cannot exceed 100 characters']
  },
  
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxLength: [100, 'City cannot exceed 100 characters']
  },
  
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxLength: [100, 'State cannot exceed 100 characters']
  },
  
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true,
    maxLength: [20, 'Postal code cannot exceed 20 characters']
  },
  
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxLength: [100, 'Country cannot exceed 100 characters'],
    default: 'United States'
  },
  
  // Shipping Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Shipping Method
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'overnight', 'pickup'],
    default: 'standard'
  },
  
  // Tracking Information
  trackingNumber: {
    type: String,
    trim: true
  },
  
  carrier: {
    type: String,
    enum: ['ups', 'fedex', 'usps', 'dhl', 'other'],
    trim: true
  },
  
  // Shipping Costs
  shippingCost: {
    type: Number,
    default: 0,
    min: [0, 'Shipping cost cannot be negative']
  },
  
  // Estimated and Actual Delivery Dates
  estimatedDeliveryDate: {
    type: Date
  },
  
  actualDeliveryDate: {
    type: Date
  },
  
  // Delivery Instructions
  deliveryInstructions: {
    type: String,
    trim: true,
    maxLength: [500, 'Delivery instructions cannot exceed 500 characters']
  },
  
  // Additional Notes
  notes: {
    type: String,
    trim: true,
    maxLength: [1000, 'Notes cannot exceed 1000 characters']
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // This will automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
shippingSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for full address
shippingSchema.virtual('fullAddress').get(function() {
  let address = this.address;
  if (this.apartment) {
    address += `, ${this.apartment}`;
  }
  address += `, ${this.city}, ${this.state} ${this.postalCode}, ${this.country}`;
  return address;
});

// Index for faster queries
shippingSchema.index({ user: 1 });
shippingSchema.index({ order: 1 });
shippingSchema.index({ status: 1 });
shippingSchema.index({ trackingNumber: 1 });
shippingSchema.index({ createdAt: -1 });

// Pre-save middleware to update the updatedAt field
shippingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to update shipping status
shippingSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  this.updatedAt = Date.now();
  
  // Set actual delivery date if status is delivered
  if (newStatus === 'delivered' && !this.actualDeliveryDate) {
    this.actualDeliveryDate = new Date();
  }
  
  return this.save();
};

// Method to add tracking information
shippingSchema.methods.addTracking = function(trackingNumber, carrier) {
  this.trackingNumber = trackingNumber;
  this.carrier = carrier;
  this.status = 'shipped';
  this.updatedAt = Date.now();
  
  return this.save();
};

// Static method to find shipping by user
shippingSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to find shipping by status
shippingSchema.statics.findByStatus = function(status) {
  return this.find({ status: status }).sort({ createdAt: -1 });
};

const Shipping = mongoose.model('Shipping', shippingSchema);

export default Shipping;