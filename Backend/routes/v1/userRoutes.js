import express from 'express';
import multer from 'multer';
import {
        addUser,
        getUsers,
        updateUser,
        getUser
      } from '../../controllers/userController.mjs';

const router = express.Router();

// Multer storage for users (single image)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/users'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.post('/user', upload.single('image'), addUser);
router.get('/users', getUsers);
router.get('/user/:userId', getUser); 
router.put('/user/:userId' , upload.none() , updateUser);

export default router;