import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true 
});

const announcementBarSchema = new mongoose.Schema({
  messages: {
    type: [messageSchema],
    default: []
  }
}, {
  timestamps: true  
});

export default mongoose.model('AnnouncementBar', announcementBarSchema);