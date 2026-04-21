import express from 'express';
import multer from 'multer';
import {
    addBlogPost,
    getBlogPosts,
    getBlogPostBySlug,
    updateBlogPost,
    deleteBlogPost
} from '../../controllers/blogController.mjs';
import { validateToken } from '../../middlewares/accessTokenHandler.js';
import { validateRole } from '../../middlewares/roleAuth.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Public Routes
router.get('/blogs', getBlogPosts);
router.get('/blog/:slug', getBlogPostBySlug);

// Admin Protected Routes
router.post(
    '/blog', 
    validateToken, 
    validateRole(['admin', 'superadmin']), 
    upload.single('featured_image'), 
    addBlogPost
);

router.put(
    '/blog/:id', 
    validateToken, 
    validateRole(['admin', 'superadmin']), 
    upload.single('featured_image'), 
    updateBlogPost
);

router.delete(
    '/blog/:id', 
    validateToken, 
    validateRole(['admin', 'superadmin']), 
    deleteBlogPost
);

export default router;