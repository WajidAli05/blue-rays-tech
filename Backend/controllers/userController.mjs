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

//add a new user
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

//get all users
const getUsers = (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json({
        status: true,
        message: "Users retrieved successfully",
        data: users,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: false,
        message: "Error retrieving users",
        error,
      });
    });
}

//udpate user
const updateUser = (req , res) => {
  const userId = req.params.userId;
  const { name, email, phone } = req.body;

  // Validate userId param
  !userId && res.status(400).json({
    status: false,
    message: "Please provide userId",
  });

  // Validate required fields
  !name || !email || !phone && res.status(400).json({
    status: false,
    message: "Please provide name, email, and phone",
  });

  //find user by id
  User.findByIdAndUpdate(userId, {
    name,
    email,
    phone,
  })
  .then((updatedUser) => {
    !updatedUser && res.status(404).json({
      status: false,
      message: "User not found",
    });
  })
  .then(() => {
    res.status(200).json({
      status: true,
      message: "User updated successfully",
    });
  })
  .catch((error) => {
    res.status(500).json({
      status: false,
      message: "Error updating user",
      error,
    });
  });
}

//get user by id
const getUser = (req, res) => {
  const userId = req.params.userId;

  // Validate userId param
  !userId && res.status(400).json({
    status: false,
    message: "Please provide userId",
  });

  //find user by id
  User.findById(userId)
    .then(user => {
      !user && res.status(404).json({
        status: false,
        message: "User not found",
      });
      res.status(200).json({
        status: true,
        message: "User retrieved successfully",
        data: user,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: false,
        message: "Error retrieving user",
        error,
      });
    });
}

//delete user by id
const deleteUser = (req, res) => {
  const { userId } = req.params || req.body;

  if (!userId) {
    return res.status(400).json({
      status: false,
      message: "Please provide userId",
    });
  }

  User.findByIdAndDelete(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      // Successfully deleted
      return res.status(200).json({
        status: true,
        message: "User deleted successfully",
        user,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: false,
        message: 'Error deleting user!',
        error,
      });
    });
};

//get total number of users
const getTotalUsers = (req, res) => {
  User.countDocuments()
    .then(count => {
      res.status(200).json({
        status: true,
        message: "Total users retrieved successfully",
        data: count,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: false,
        message: "Error retrieving total users",
        error,
      });
    });
}

export { addUser,
         getUsers,
         updateUser,
         getUser,
         deleteUser,
         getTotalUsers
 };