import Product from "../models/productModel.js";
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
        sub_category,
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
    if (!name || !category || !sub_category|| !product_type || !description || !sku || !price || !stock_level || image_link.length === 0) {
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
    Product.findOne({ sku })
        .then(productExists => {
            if (productExists) {
                return res.status(400).json({ status: false, message: "Product already exists" });
            }
            
            category = category.toLowerCase();
            sub_category = sub_category.toLowerCase()
            const newProduct = new Product({
                name,
                category,
                sub_category,
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

//get all products
const getProducts = async (req, res) => {
    await Product.find()
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

    await Product.findOne({ sku })
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
    // if(req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    //     return res.status(403).json({
    //         status: false,
    //         message: "Access denied. Only admins can update products."
    //     });
    // }
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

    Product.findOne({ sku })
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

            return Product.findOneAndUpdate(
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
//     if(req.user.role !== 'admin' && req.user.role !== 'superadmin') {
//         return res.status(403).json({
//             status: false,
//             message: "Access denied. Only admins can delete products."
//         });
//     }

//     const { sku } = req.body;

//     if (!sku) {
//         return res.status(400).json({ status: false, message: "SKU is required to delete product" });
//     }

//     Products.findOneAndDelete({ sku })
//         .then((product) => {
//             if (!product) {
//                 return res.status(404).json({ status: false, message: "Product not found with the given SKU" });
//             }

//             // Delete associated images from uploads folder
//             if (product.image_link && product.image_link.length > 0) {
//                 product.image_link.forEach(imagePath => {
//                     const filePath = path.join(__dirname, '..', imagePath);
//                     if (fs.existsSync(filePath)) {
//                         fs.unlinkSync(filePath);
//                     }
//                 });
//             }

//             res.status(200).json({
//                 status: true,
//                 message: "Product deleted successfully",
//                 data: product
//             });
//         })
//         .catch((error) => {
//             res.status(500).json({
//                 status: false,
//                 message: "Error deleting product",
//                 error
//             });
//         });
// };


const deleteProductBySku = async (req, res) => {
  const { sku } = req.params;
  const user = req.user; // assuming auth middleware sets this

  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return res.status(403).json({
      status: false,
      message: "Access denied. Only admins can delete products."
    });
  }

  if (!sku) {
    return res.status(400).json({ status: false, message: "SKU is required to delete product" });
  }

  Product.findOneAndDelete({ sku })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ status: false, message: "Product not found with the given SKU" });
      }

      // Delete associated images
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
    // if(req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    //     return res.status(403).json({
    //         status: false,
    //         message: "Access denied. Only admins can delete product images."
    //     });
    // }

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
    // if(req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    //     return res.status(403).json({ 
    //         status: false, 
    //         message: "Access denied. Only admins can view average rating." 
    //     });
    // }
    
    const products = await Product.find();
    const totalRating = products.reduce((acc, product) => acc + product.average_rating, 0);
    const averageRating = totalRating / products.length;

    return res.status(200).json({ status: true, message: "Average rating fetched successfully", data: averageRating });
};

//get stock level of each category
const getStockLevelByCategory = async (req, res) => {
    Product.aggregate([
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

// Get products based on category name with full/partial and case-insensitive match
// const getProductsByCategoryName = (req, res) => {
//     let { category } = req.params;

//     if (!category) {
//         return res.status(400).json({
//             status: false,
//             message: "Category parameter is required"
//         });
//     }

//     // Decode URL-encoded characters (like %26 for &)
//     category = decodeURIComponent(category);
    
//     // Debug: Log the incoming category parameter
//     console.log("Original category param:", req.params.category);
//     console.log("Decoded category:", category);

//     // Use case-insensitive and partial match with promise chaining
//     Products.find({
//         category: { $regex: category, $options: "i" }
//     })
//         .then((products) => {
//             console.log("Found products:", products.length);

//             if (!products || products.length === 0) {
//                 // Get all unique categories for debugging
//                 return Products.distinct('category')
//                     .then((allCategories) => {
//                         return res.status(404).json({
//                             status: false,
//                             message: "No products found for this category",
//                             debug: {
//                                 searchedCategory: category,
//                                 originalParam: req.params.category,
//                                 availableCategories: allCategories
//                             }
//                         });
//                     })
//                     .catch((distinctError) => {
//                         return res.status(404).json({
//                             status: false,
//                             message: "No products found for this category",
//                             debug: {
//                                 searchedCategory: category,
//                                 originalParam: req.params.category,
//                                 distinctError: distinctError.message
//                             }
//                         });
//                     });
//             }

//             return res.status(200).json({
//                 status: true,
//                 message: "Products fetched successfully",
//                 data: products,
//                 count: products.length
//             });
//         })
//         .catch((error) => {
//             console.error("Error in getProductsByCategoryName:", error);
//             return res.status(500).json({
//                 status: false,
//                 message: "Error fetching products by category",
//                 error: error.message
//             });
//         });
// };


const getProductsByCategoryName = (req, res) => {
    let { category } = req.params;

    if (!category) {
        return res.status(400).json({
            status: false,
            message: "Category parameter is required"
        });
    }

    category = decodeURIComponent(category).toLowerCase();

    Product.find({ category: { $regex: category, $options: "i" } })
        .then(products => {
            if (!products.length) {
                return Product.findOne({})
                    .then(sample => {
                        res.status(404).json({
                            status: false,
                            message: "No products found for this category",
                            debug: {
                                searchedCategory: category,
                                sampleProductStructure: sample ? Object.keys(sample.toObject()) : "No products available"
                            }
                        });
                    });
            }

            res.status(200).json({
                status: true,
                message: "Products fetched successfully",
                data: products
            });
        })
        .catch(err => {
            console.error("Error fetching products by category:", err);
            res.status(500).json({
                status: false,
                message: "Server error while fetching products",
                error: err.message
            });
        });
};

const getProductBySubCategoryName = (req, res) => { 
  let { subcategory } = req.params; 
 
  if (!subcategory) { 
    return res.status(400).json({ 
      status: false, 
      message: "Sub-category parameter is required" 
    }); 
  } 
 
  const normalizedSubcategory = decodeURIComponent(subcategory).toLowerCase();  

  //find products
  Product.find({
    sub_category: { $regex: new RegExp(normalizedSubcategory, 'i') }
  })
  .then((products)=> {
    if(products?.length === 0){
        return res.status(404).json({
            status: false,
            message: `No products found for sub category ${normalizedSubcategory}`,
            data: null
        })
    }

    return res.status(200).json({
        status: true,
        message: `${products.length} products found for sub category ${normalizedSubcategory}`,
        data: products
    })
  })
  .catch((error)=>{
    console.log(error.message)
  })
  
};

// Get number of products per product_type in percentage
const getProductPercentagePerProductType = (req, res) => {
  Product.aggregate([
    {
      $group: {
        _id: "$product_type",
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$count" },
        breakdown: { $push: { type: "$_id", count: "$count" } },
      },
    },
    { $unwind: "$breakdown" },
    {
      $project: {
        _id: 0,
        product_type: "$breakdown.type",
        count: "$breakdown.count",
        percentage: {
          $round: [
            {
              $multiply: [
                { $divide: ["$breakdown.count", "$total"] },
                100,
              ],
            },
            2, // round to 2 decimal places
          ],
        },
      },
    },
  ])
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error("Error fetching product percentages:", err.message);
      res.status(500).json({ error: "Server error" });
    });
};


export { 
    addProduct, 
    getProducts, 
    updateProduct, 
    deleteProductBySku, 
    getProductBySKU,
    deleteProductImages,
    getAverageRating,
    getStockLevelByCategory,
    getProductsByCategoryName,
    getProductBySubCategoryName,
    getProductPercentagePerProductType
};