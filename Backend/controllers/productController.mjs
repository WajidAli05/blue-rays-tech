import Products from "../models/productModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Needed for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const allImages = (files) => files.every(file => file.mimetype.startsWith('image/'));
const baseDir = path.join(__dirname, '../uploads');

// addProduct controller
const addProduct = (req, res) => {
    let {
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
        link,
        file_type,
        commission,
        affiliate_program
    } = req.body;

    const files = req.files || [];
    const image_link = files.length > 0 ? files.map(file => file.path) : [];

    // Validate required fields
    if (!name || !category || !product_type || !description || !sku || !price || !stock_level || image_link.length === 0) {
        return res.status(400).json({ status: false, message: "Please fill all required fields" });
    }

    // File type validation based on product_type
    if (product_type === 'physical' && !allImages(files)) {
        return res.status(400).json({ status: false, message: "Physical products accept only image files" });
    }

    //if discount is not provided, set it to 0
    if (!discount) {
        discount = 0;
    }
    //if profit_margin is not provided, set it to 0
    if (!profit_margin) {
        profit_margin = 0;
    }
    //if gross_profit is not provided, set it to 0
    if (!gross_profit) {
        gross_profit = 0;
    }
    //if click_through_rate is not provided, set it to 0
    if (!click_through_rate) {
        click_through_rate = 0;
    }
    //if reviews_count is not provided, set it to 0
    if (!reviews_count) {
        reviews_count = 0;
    }
    //if average_rating is not provided, set it to 0
    if (!average_rating) {
        average_rating = 0;
    }
    //if commission is not provided, set it to 0
    if (!commission) {
        commission = 0;
    }

    // For digital, allow any file type, no restriction
    // For affiliate, no file upload validation needed

    // Check if product already exists by SKU
    Products.findOne({ sku })
        .then(productExists => {
            if (productExists) {
                return res.status(400).json({ status: false, message: "Product already exists" });
            }

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
                image_link,
                link,
                file_type,
                commission,
                affiliate_program
            });

            return newProduct.save()
                .then(() => res.status(201).json({ status: true, message: "Product added successfully" }))
                .catch(error => res.status(500).json({ status: false, message: "Error adding product", error }));
        })
        .catch(error => res.status(500).json({ status: false, message: "Error checking existing product", error }));
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

// updateProduct controller
const updateProduct = (req, res) => {
    const { sku, product_type, link, file_type, commission, affiliate_program, ...updateData } = req.body;

    if (!sku) {
        return res.status(400).json({ status: false, message: "SKU is required to update product" });
    }

    const files = req.files || [];
    const newImages = files.length > 0 ? files.map(file => file.path) : [];

    // File type validation based on product_type if files uploaded
    if (files.length > 0) {
        if (product_type === 'physical' && !allImages(files)) {
            return res.status(400).json({ status: false, message: "Physical products accept only image files" });
        }
        // For digital, any file types allowed
        // For affiliate, no validation needed
    }

    Products.findOne({ sku })
        .then(product => {
            if (!product) {
                return res.status(404).json({ status: false, message: "Product not found with the given SKU" });
            }

            // Delete old images if new images uploaded
            if (newImages.length > 0 && product.image_link && product.image_link.length > 0) {
                product.image_link.forEach(imagePath => {
                    const filePath = path.join(process.cwd(), imagePath);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }

            // Use new images if uploaded, else keep old images
            const image_link = newImages.length > 0 ? newImages : product.image_link;

            // Build update object including optional fields for digital/affiliate
            const updateFields = {
                ...updateData,
                image_link,
            };

            if (link !== undefined) updateFields.link = link;
            if (file_type !== undefined) updateFields.file_type = file_type;
            if (commission !== undefined) updateFields.commission = commission;
            if (affiliate_program !== undefined) updateFields.affiliate_program = affiliate_program;

            return Products.findOneAndUpdate(
                { sku },
                { $set: updateFields },
                { new: true, runValidators: true }
            );
        })
        .then(updatedProduct => {
            if (!updatedProduct) return;
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

const deleteProductImages = (req, res) => {
  const images = req.body.images;

  if (!images || !Array.isArray(images)) {
    return res.status(400).json({ status: false, message: 'No images provided.' });
  }

  const baseDir = path.join(__dirname, '../uploads');

  const results = images.map(imagePath => {
    const fullPath = path.join(baseDir, imagePath);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        return { image: imagePath, status: 'deleted' };
      } catch (err) {
        return { image: imagePath, status: 'error', error: err.message };
      }
    } else {
      return { image: imagePath, status: 'not found' };
    }
  });

  return res.status(200).json({ status: true, message: 'Processed image deletions.', results });
};

//get average rating for all the products
const getAverageRating = async (req, res) => {
    const products = await Products.find();
    const totalRating = products.reduce((acc, product) => acc + product.average_rating, 0);
    const averageRating = totalRating / products.length;

    return res.status(200).json({ status: true, message: "Average rating fetched successfully", data: averageRating });
};

//get stock level of each category
const getStockLevelByCategory = async (req, res) => {
    Products.aggregate([
        {
            $group: {
                _id: '$category',
                stockLevel: {
                    $sum: '$stock_level'
                }
            }
        },
        {
            $project: {
                _id: 0,
                category: '$_id',
                stockLevel: 1,
            }
        },
        {
            $limit: 15
        }
    ])
    .then((stockData)=>{
        res.status(200).json({
            status: true,
            data: stockData
        })
    })
    .catch((error)=> {
        res.status(500).json({status: false, message: "Error fetching stock levels by category", error});
    })
}


export { addProduct, 
    getProducts, 
    updateProduct, 
    deleteProduct, 
    getProductBySKU,
    deleteProductImages,
    getAverageRating,
    getStockLevelByCategory
};