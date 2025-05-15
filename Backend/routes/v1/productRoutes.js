import express from 'express';
const router = express.Router();
import multer from 'multer';
import { addProduct, 
    getProducts, 
    updateProduct, 
    deleteProduct,
    getProductBySKU
} from '../../controllers/productController.mjs'; 

const upload = multer({ dest: 'uploads/' });

router.post('/product' , upload.array('image_link' , 10) , addProduct);
router.get('/products' , getProducts);
router.put('/product' , upload.array('image_link' , 10) , updateProduct);
router.delete('/product' , upload.none() , deleteProduct);
router.get('/product/:sku' , getProductBySKU);

export default router;