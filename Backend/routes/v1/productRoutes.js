// import express from 'express';
// const router = express.Router();
// import multer from 'multer';
// import { addProduct, 
//     getProducts, 
//     updateProduct, 
//     deleteProduct,
//     getProductBySKU
// } from '../../controllers/productController.mjs'; 

// const upload = multer({ dest: 'uploads/' });

// router.post('/product' , upload.array('image_link' , 10) , addProduct);
// router.get('/products' , getProducts);
// router.put('/product' , upload.array('image_link' , 10) , updateProduct);
// router.delete('/product' , upload.none() , deleteProduct);
// router.get('/product/:sku' , getProductBySKU);

// export default router;


import express from 'express';
import multer from 'multer';
import { 
  addProduct, 
  getProducts, 
  updateProduct, 
  deleteProduct, 
  getProductBySKU 
} from '../../controllers/productController.mjs';

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
router.post('/product', upload.array('image_link', 10), addProduct);
router.get('/products', getProducts);
router.put('/product', upload.array('image_link', 10), updateProduct);
router.delete('/product', upload.none(), deleteProduct);
router.get('/product/:sku', getProductBySKU);

export default router;