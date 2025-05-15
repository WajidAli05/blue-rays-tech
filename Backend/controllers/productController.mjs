import Products from "../models/productModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Needed for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const addProduct = async (req, res) => {
    const {
        name,
        category,
        product_type,
        sku,
        brand,
        price,
        stock_level,
        units_sold,
        total_sales_revenue,
        description,
        availability,
        discount,
        profit_margin,
        gross_profit,
        click_through_rate,
        reviews_count,
        average_rating,
    } = req.body;

    // Handle image link
    const image_link = req.files && req.files.length > 0
    ? req.files.map(file => file.path)
    : [];

    // Check for empty required fields
    if (!name || !category || !product_type || !description || !sku || !price || !stock_level || !image_link) {
        return res.status(400).json({ status: false, message: "Please fill all required fields" });
    }

    // Check if the product already exists by SKU
    const productExists = await Products.findOne({ sku });
    if (productExists) {
        return res.status(400).json({ status: false, message: "Product already exists" });
    }

    // Create new product
    const newProduct = new Products({
        name,
        category,
        product_type,
        sku,
        brand,
        price,
        stock_level,
        units_sold,
        total_sales_revenue,
        description,
        availability,
        discount,
        profit_margin,
        gross_profit,
        click_through_rate,
        reviews_count,
        average_rating,
        image_link
    });

    // Save the product and respond
    newProduct.save()
        .then(() => {
            return res.status(201).json({ status: true, message: "Product added successfully" });
        })
        .catch((error) => {
            return res.status(500).json({ status: false, message: "Error adding product", error });
        });
};

const getProducts = async (req, res) => {
    const prodcuts = await Products.find()
    .then((products) => {
        return res.status(200).json({ status: true, message: "Products fetched successfully", data: products });
    })
    .catch((error) => {
        return res.status(500).json({ status: false, message: "Error fetching products", error });
    });
}

//get product using SKU
const getProductBySKU = async (req, res) => {
    const { sku } = req.params;
    if (!sku) {
        return res.status(400).json({ status: false, message: "SKU is required to get product" });
    }

    await Products.findOne({ sku })
    .then((product) => {
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found with the given SKU" });
        }
        return res.status(200).json({ status: true, message: "Product fetched successfully", data: product });
    })
    .catch((error) => {
        return res.status(500).json({ status: false, message: "Error fetching product", error });
    })
}

// const updateProduct = async (req, res) => {
//     const { sku, ...updateData } = req.body;

//     //get new images
//     const image_link = req.files && req.files.length > 0
//     ? req.files.map(file => file.path)
//     : [];

//     if (!sku) {
//         return res.status(400).json({ status: false, message: "SKU is required to update product" });
//     }
//     if (!image_link) {
//         return res.status(400).json({ status: false, message: "Image/s is required to update product" });
//     }

//     await Products.findOneAndUpdate(
//         { sku },
//         { 
//             $set: { 
//                 ...updateData, 
//                 image_link: req.files ? req.files.map(file => file.path) : product.image_link 
//                 }
//         },
//         { new: true, runValidators: true }
//     )
//     .then((product) => {
//         if (!product) {
//             return res.status(404).json({ status: false, message: "Product not found with the given SKU" });
//         }

//         res.status(200).json({
//             status: true,
//             message: "Product updated successfully",
//             data: product
//         });
//     })
//     .catch((error) => {
//         res.status(500).json({
//             status: false,
//             message: "Error updating product",
//             error
//         });
//     });
// };

const updateProduct = async (req, res) => {
    const { sku, ...updateData } = req.body;

    if (!sku) {
        return res.status(400).json({ status: false, message: "SKU is required to update product" });
    }

    // Prepare new images if uploaded
    const newImages = req.files && req.files.length > 0
        ? req.files.map(file => file.path)
        : [];

    Products.findOne({ sku })
        .then(product => {
            if (!product) {
                return res.status(404).json({ status: false, message: "Product not found with the given SKU" });
            }

            // Delete old images
            if (product.image_link && product.image_link.length > 0) {
                product.image_link.forEach(imagePath => {
                    const filePath = path.join(__dirname, '..', imagePath); // uploads/image.jpg
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }

            // Set the new image links or keep old if none uploaded
            const image_link = newImages.length > 0 ? newImages : product.image_link;

            // Update the product
            return Products.findOneAndUpdate(
                { sku },
                { $set: { ...updateData, image_link } },
                { new: true, runValidators: true }
            );
        })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return; // already handled above
            }

            res.status(200).json({
                status: true,
                message: "Product updated successfully",
                data: updatedProduct
            });
        })
        .catch(error => {
            res.status(500).json({
                status: false,
                message: "Error updating product",
                error
            });
        });
};

// const deleteProduct = async (req, res) => {
//     const { sku} = req.body;
//     if (!sku) {
//         return res.status(400).json({ status: false, message: "SKU is required to delete product" });
//     }

//     await Products.findOneAndDelete({ sku })
//     .then((product) => {
//         if (!product) {
//             return res.status(404).json({ status: false, message: "Product not found with the given SKU" });
//         }
//         res.status(200).json({
//             status: true,
//             message: "Product deleted successfully",
//             data: product
//         });
//     })
//     .catch((error) => {
//         res.status(500).json({
//             status: false,
//             message: "Error deleting product",
//             error
//         });
//     }); 
// }

const deleteProduct = async (req, res) => {
    const { sku } = req.body;

    if (!sku) {
        return res.status(400).json({ status: false, message: "SKU is required to delete product" });
    }

    Products.findOneAndDelete({ sku })
        .then((product) => {
            if (!product) {
                return res.status(404).json({ status: false, message: "Product not found with the given SKU" });
            }

            // Delete associated images from uploads folder
            if (product.image_link && product.image_link.length > 0) {
                product.image_link.forEach(imagePath => {
                    const filePath = path.join(__dirname, '..', imagePath);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }

            res.status(200).json({
                status: true,
                message: "Product deleted successfully",
                data: product
            });
        })
        .catch((error) => {
            res.status(500).json({
                status: false,
                message: "Error deleting product",
                error
            });
        });
};

export { addProduct, 
    getProducts, 
    updateProduct, 
    deleteProduct, 
    getProductBySKU
};