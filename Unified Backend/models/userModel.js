import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function(){
      return !this.googleId;
    },
  },
  phone: {
    type: String,
  },
  image: {
    type: String,
    default: '',
  },
  since: {
    type: Date,
    required: true,
    default: Date.now,
  },
  country: {
    type: String,
  },
  job: {
    type: String,
  },
  role: {
    type: String,
    default: 'customer',
  },
  googleId: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;