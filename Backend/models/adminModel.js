import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { config } from "dotenv";
config();

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin'],
      default: 'admin',
      required: true
    },
    permissions: {
      type: [String], // e.g., ['manage_users', 'manage_products', 'view_reports']
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    },
    phone: {
      type: String
    },
  },
  {
    timestamps: true
  }
);

adminSchema.pre('save', function (next) {
  const admin = this;

  // First: if password is modified, hash it
  const hashPassword = () => {
    if (!admin.isModified('password')) return Promise.resolve();
    return bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS))
      .then(salt => bcrypt.hash(admin.password, salt))
      .then(hashed => { admin.password = hashed; });
  };

  // Second: if role is superadmin, ensure no other superadmin exists
  const checkSuperadmin = () => {
    if (admin.role !== 'superadmin') return Promise.resolve();
    return mongoose.model('Admin').findOne({ role: 'superadmin', _id: { $ne: admin._id } })
      .then(existing => {
        if (existing) throw new Error('A superadmin already exists. Only one superadmin is allowed.');
      });
  };

  // Chain both in order
  hashPassword()
    .then(checkSuperadmin)
    .then(() => next())
    .catch(err => next(err));
});

export default mongoose.model('Admin', adminSchema);