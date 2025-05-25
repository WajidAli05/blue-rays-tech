import express from 'express';
import multer from 'multer';
import { 
  addProduct, 
  getProducts, 
  updateProduct, 
  deleteProduct, 
  getProductBySKU,
  deleteProductImages,
  getAverageRating,
  getStockLevelByCategory
} from '../../controllers/productController.mjs';
import { validateToken } from '../../middlewares/accessTokenHandler.js';

const router = express.Router();

// Multer storage with custom filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Your upload folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.post('/product', validateToken, upload.array('image_link', 10), addProduct);
router.get('/products', getProducts);
router.put('/product', validateToken, upload.array('image_link', 10), updateProduct);
router.delete('/product', validateToken, upload.none(), deleteProduct);
router.delete('/product/image', validateToken, deleteProductImages);
router.get('/average-rating', validateToken, getAverageRating);
router.get('/category-wise-stock', validateToken, getStockLevelByCategory)
router.get('/product/:sku', getProductBySKU);

export default router;