import Admin from '../models/adminModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: "Please provide email and password",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: false,
      message: "Please provide a valid email",
    });
  }

  // Find admin by email
  Admin.findOne({ email })
    .then((admin) => {
      if (!admin) {
        return res.status(404).json({
          status: false,
          message: "Admin not found",
        });
      }

      if (!admin.isActive) {
        return res.status(403).json({
          status: false,
          message: "Admin is not active",
        });
      }

      // Compare password
      return bcrypt.compare(password, admin.password).then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({
            status: false,
            message: "Invalid password",
          });
        }

        // Update last login time
        admin.lastLogin = new Date();
        return admin.save().then((updatedAdmin) => {
          const token = jwt.sign(
            {
              id: updatedAdmin._id,
              role: updatedAdmin.role,
              email: updatedAdmin.email, // required for middleware
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
          );

          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'Strict', // Prevent CSRF attacks
            maxAge: 3600000, // 1 hour
          });

          return res.status(200).json({
            status: true,
            message: "Login successful",
            data: {
              admin: {
                id: updatedAdmin._id,
                name: updatedAdmin.name,
                email: updatedAdmin.email,
                role: updatedAdmin.role,
              },
            },
          });
        });
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: false,
        message: "Server error: " + error.message,
      });
    });
};

const logoutAdmin = (req, res)=>{
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'Strict', // Prevent CSRF attacks
  })

  return res.status(200).json({
    status: true,
    message: "Logout successful",
  });
}

const checkAdminAuth = (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Admin is authenticated",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};

export { loginAdmin, logoutAdmin, checkAdminAuth };