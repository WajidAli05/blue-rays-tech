import mongoose from 'mongoose';

const announcementBarSchema = new mongoose.Schema(
  {
    announcement: [
      {
        message: {
          type: String,
          required: true,
          trim: true,
          default: '',
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('AnnouncementBar', announcementBarSchema);