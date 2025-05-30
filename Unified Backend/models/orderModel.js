import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
    required: true
  },
  name: String, // product name snapshot
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  product_type: {
    type: String,
    enum: ['physical', 'digital'],
    required: true
  }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  fullName: String,
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  phone: String,
  email: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  customer: addressSchema,
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Pending', 'Refunded'],
    default: 'Unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'Cash on Delivery', 'Wallet', 'Bank Transfer'],
    default: 'Card'
  },
  shippingStatus: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Returned', 'N/A'],
    default: 'Pending'
  },
  shippingAddress: addressSchema, // Can be different from billing
  digitalDeliveryStatus: {
    type: String,
    enum: ['Not Delivered', 'Delivered', 'N/A'],
    default: 'N/A'
  },
  orderDate: { type: Date, default: Date.now },
  orderSource: {
    type: String,
    enum: ['website', 'mobile_app', 'physical'],
    default: 'website'
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Completed', 'Cancelled', 'On Hold', 'Failed'],
    default: 'Processing'
  },
  couponCode: { type: String },
  discountAmount: { type: Number, default: 0 },
  refundedAmount: { type: Number, default: 0 },
  notes: { type: String },
  isGuest: { type: Boolean, default: false },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;