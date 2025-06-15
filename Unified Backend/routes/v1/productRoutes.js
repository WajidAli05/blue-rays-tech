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
  getStockLevelByCategory,
  getProductsByCategoryName
} from '../../controllers/productController.mjs';
import { validateToken } from '../../middlewares/accessTokenHandler.js';
import { validateRole } from '../../middlewares/roleAuth.js';

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
router.post('/product', validateToken, validateRole(['admin', 'superadmin']), upload.array('image_link', 10), addProduct);
router.get('/products', validateToken, validateRole(), getProducts);
router.put('/product', validateToken, validateRole(['admin', 'superadmin']), upload.array('image_link', 10), updateProduct);
router.delete('/product', validateToken, validateRole(['admin', 'superadmin']), upload.none(), deleteProduct);
router.delete('/product/image', validateToken, validateRole(['admin', 'superadmin']), deleteProductImages);
router.get('/average-rating', validateToken, validateRole(['admin', 'superadmin']), getAverageRating);
router.get('/category-wise-stock', validateToken, validateRole(), getStockLevelByCategory)
router.get('/product/:sku', getProductBySKU);
router.get('/product/category/:category', getProductsByCategoryName);


export default router;