import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  }
});

export default mongoose.model('Categories', categorySchema);