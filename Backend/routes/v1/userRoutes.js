import express from 'express';
import multer from 'multer';
import {
        addUser,
        getUsers,
        updateUser,
        getUser,
        deleteUser,
        getTotalUsers
      } from '../../controllers/userController.mjs';
import { validateToken } from '../../middlewares/accessTokenHandler.js';

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
router.get('/users', validateToken, getUsers);
router.get('/total-users', validateToken, getTotalUsers);
router.get('/user/:userId', getUser); 
router.put('/user/:userId' , upload.none() , updateUser);
router.delete('/user/:userId', validateToken, deleteUser);

export default router;