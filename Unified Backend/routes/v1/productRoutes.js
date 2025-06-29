import express from 'express';
import multer from 'multer';
import { 
  addProduct, 
  getProducts, 
  updateProduct, 
  deleteProductBySku, 
  getProductBySKU,
  deleteProductImages,
  getAverageRating,
  getStockLevelByCategory,
  getProductsByCategoryName,
  getProductBySubCategoryName
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
router.get('/products', getProducts);
router.put('/product', validateToken, validateRole(['admin', 'superadmin']), upload.array('image_link', 10), updateProduct);
router.delete('/product/image', validateToken, validateRole(['admin', 'superadmin']), deleteProductImages);
router.get('/average-rating', validateToken, validateRole(['admin', 'superadmin']), getAverageRating);
router.get('/category-wise-stock', validateToken, validateRole(), getStockLevelByCategory)
router.delete('/product/:sku', validateToken, validateRole(['admin', 'superadmin']), upload.none(), deleteProductBySku);
router.get('/product/:sku', getProductBySKU);
router.get('/product/category/:category', getProductsByCategoryName);
router.get('/product/sub-category/:subcategory', getProductBySubCategoryName);


export default router;