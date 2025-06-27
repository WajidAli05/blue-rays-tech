import express from 'express';
import multer from 'multer';
import {
        signupUser,
        loginUser,
        getUsers,
        updateUser,
        getUser,
        deleteUser,
        getTotalUsers,
        signupWithGoogle,
        getProfile,
        logoutUser
      } from '../../controllers/userController.mjs';
import { validateToken } from '../../middlewares/accessTokenHandler.js';
import { validateRole } from '../../middlewares/roleAuth.js';

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
router.post('/signup/google', signupWithGoogle);
router.post('/user/signup', upload.single('image'), signupUser);
router.post('/user/login', loginUser);
router.get('/users', validateToken, getUsers);
router.get('/total-users', validateToken, validateRole(), getTotalUsers);
router.get("/user/profile", validateToken, getProfile);
router.get("/user/logout", logoutUser);
router.get('/user/:userId', validateRole(), getUser); 
router.put('/user/:userId' , validateRole(), upload.none() , updateUser);
router.delete('/user/:userId', validateToken, validateRole(['admin', 'superadmin']), deleteUser);

export default router;