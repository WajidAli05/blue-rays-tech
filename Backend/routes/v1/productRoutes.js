import express from 'express';
const router = express.Router();
import multer from 'multer';
import { addProduct , getProducts } from '../../controllers/productController.mjs'; 

const upload = multer({ dest: 'uploads/' });

router.post('/product' , upload.single('image_link') , addProduct);
router.get('/products' , getProducts);

export default router;