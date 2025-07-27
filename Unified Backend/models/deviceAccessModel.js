// models/DeviceAccess.js
import mongoose from 'mongoose';

const DeviceAccessSchema = new mongoose.Schema({
  deviceType: {
    type: String,
    enum: ['mobile', 'desktop'],
    required: true
  },
  accessedAt: {
    type: Date,
    default: Date.now
  }
});

const DeviceAccess = mongoose.model('DeviceAccess', DeviceAccessSchema);
export default DeviceAccess;
