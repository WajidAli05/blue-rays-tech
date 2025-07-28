import mongoose from 'mongoose';

const SessionDurationSchema = new mongoose.Schema({
  durationSeconds: {
    type: Number,
    required: true,
  },
  userAgent: String,
  ipAddress: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SessionDuration = mongoose.model('SessionDuration', SessionDurationSchema);
export default SessionDuration;