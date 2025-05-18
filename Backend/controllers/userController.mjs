import User from "../models/userModal.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base directory for user uploads
const userUploadDir = path.join(__dirname, '../uploads/users');

const addUser = (req, res) => {
  const { name, email, phone, country, job } = req.body;
  const file = req.file;

  // Validate required fields
  if (!name || !email || !phone) {
    return res.status(400).json({
      status: false,
      message: "Please provide name, email, phone, and since date",
    });
  }

  let image = '';
  if (file) {
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        status: false,
        message: "Only image files are allowed",
      });
    }
    image = `/uploads/users/${file.filename}`;
  }

  // Check for existing user by email
  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "A user with this email already exists",
        });
      }

      // Create new user
      const newUser = new User({
        name,
        email,
        phone,
        image,
        country,
        job,
      });

      newUser.save()
        .then(() => {
          res.status(201).json({
            status: true,
            message: "User added successfully",
          });
        })
        .catch(error => {
          res.status(500).json({
            status: false,
            message: "Error saving user to database",
            error,
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        status: false,
        message: "Error checking existing user",
        error,
      });
    });
};

export { addUser };