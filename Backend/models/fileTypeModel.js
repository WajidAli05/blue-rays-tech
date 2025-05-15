import mongoose from 'mongoose';

const fileTypeSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  key: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  }
});

export default mongoose.model('FileType', fileTypeSchema);