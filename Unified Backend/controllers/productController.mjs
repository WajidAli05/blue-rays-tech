import Product from "../models/productModel.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
  getResourceType
} from "../utils/cloudinaryHelper.js";

const allImages = (files) => files.every(file => file.mimetype.startsWith('image/'));

// addProduct controller
const addProduct = async (req, res) => {
  try {
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

      // 🔥 Correct affiliate fields
      affiliate_link,
      commission_rate,
      affiliate_program,

      // Digital-only field
      file_type
    } = req.body;

    const files = req.files || [];

    // Validate common required fields
    if (!name || !category || !sub_category || !product_type || !description || !sku || !price || !stock_level || files.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Please fill all required fields"
      });
    }

    // 🔍 Validate by product type
    if (product_type === "physical") {
      if (!allImages(files)) {
        return res.status(400).json({
          status: false,
          message: "Physical products accept only image files"
        });
      }
    }

    if (product_type === "digital") {
      if (!file_type) {
        return res.status(400).json({
          status: false,
          message: "Digital products must include a file type"
        });
      }
    }

    if (product_type === "affiliate") {
      if (!affiliate_link || !commission_rate || !affiliate_program) {
        return res.status(400).json({
          status: false,
          message: "Affiliate products must include affiliate_link, commission_rate, and affiliate_program"
        });
      }
    }

    // Default values
    discount = discount || 0;
    profit_margin = profit_margin || 0;
    gross_profit = gross_profit || 0;
    click_through_rate = click_through_rate || 0;
    reviews_count = reviews_count || 0;
    average_rating = average_rating || 0;
    commission_rate = commission_rate || 0;

    // Check for duplicate SKU
    const productExists = await Product.findOne({ sku });
    if (productExists) {
      return res.status(400).json({
        status: false,
        message: "Product already exists"
      });
    }

    // Upload files to Cloudinary
    const uploadPromises = files.map(file => {
      const resourceType = getResourceType(file.mimetype);
      return uploadToCloudinary(file.buffer, 'products', resourceType);
    });

    const uploadResults = await Promise.all(uploadPromises);
    const image_link = uploadResults.map(result => result.secure_url);

    // Normalize categories
    category = category.toLowerCase();
    sub_category = sub_category.toLowerCase();

    // Build product object
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

      // 🔥 Correct fields
      affiliate_link,
      commission_rate,
      affiliate_program,

      // Digital file type
      file_type
    });

    await newProduct.save();

    return res.status(201).json({
      status: true,
      message: "Product added successfully",
    });

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      status: false,
      message: "Error adding product",
      error: error.message
    });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error fetching products",
      error: error.message
    });
  }
};

// Get product using SKU
const getProductBySKU = async (req, res) => {
  try {
    const { sku } = req.params;
    
    if (!sku) {
      return res.status(400).json({
        status: false,
        message: "SKU is required to get product"
      });
    }

    const product = await Product.findOne({ sku });
    
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found with the given SKU"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Product fetched successfully",
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error fetching product",
      error: error.message
    });
  }
};

// updateProduct controller
const updateProduct = async (req, res) => {
  try {
    const { sku, product_type, link, file_type, commission, affiliate_program, ...updateData } = req.body;

    if (!sku) {
      return res.status(400).json({
        status: false,
        message: "SKU is required to update product"
      });
    }

    const files = req.files || [];

    // File type validation based on product_type if files uploaded
    if (files.length > 0) {
      if (product_type === 'physical' && !allImages(files)) {
        return res.status(400).json({
          status: false,
          message: "Physical products accept only image files"
        });
      }
    }

    const product = await Product.findOne({ sku });
    
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found with the given SKU"
      });
    }

    let image_link = product.image_link;

    // If new images are uploaded
    if (files.length > 0) {
      // Delete old images from Cloudinary
      if (product.image_link && product.image_link.length > 0) {
        const deletePromises = product.image_link.map(async (imageUrl) => {
          const publicId = extractPublicId(imageUrl);
          if (publicId) {
            const resourceType = imageUrl.includes('/image/') ? 'image' : 'raw';
            return deleteFromCloudinary(publicId, resourceType);
          }
        });
        
        await Promise.all(deletePromises);
      }

      // Upload new images to Cloudinary
      const uploadPromises = files.map(file => {
        const resourceType = getResourceType(file.mimetype);
        return uploadToCloudinary(file.buffer, 'products', resourceType);
      });

      const uploadResults = await Promise.all(uploadPromises);
      image_link = uploadResults.map(result => result.secure_url);
    }

    // Build update object
    const updateFields = {
      ...updateData,
      image_link,
    };

    if (link !== undefined) updateFields.link = link;
    if (file_type !== undefined) updateFields.file_type = file_type;
    if (commission !== undefined) updateFields.commission = commission;
    if (affiliate_program !== undefined) updateFields.affiliate_program = affiliate_program;

    const updatedProduct = await Product.findOneAndUpdate(
      { sku },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: updatedProduct
    });

  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      status: false,
      message: "Error updating product",
      error: error.message
    });
  }
};

// Delete product by SKU
const deleteProductBySku = async (req, res) => {
  try {
    const { sku } = req.params;
    const user = req.user;

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({
        status: false,
        message: "Access denied. Only admins can delete products."
      });
    }

    if (!sku) {
      return res.status(400).json({
        status: false,
        message: "SKU is required to delete product"
      });
    }

    const product = await Product.findOneAndDelete({ sku });

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found with the given SKU"
      });
    }

    // Delete associated images from Cloudinary
    if (product.image_link && product.image_link.length > 0) {
      const deletePromises = product.image_link.map(async (imageUrl) => {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          const resourceType = imageUrl.includes('/image/') ? 'image' : 'raw';
          return deleteFromCloudinary(publicId, resourceType);
        }
      });

      await Promise.all(deletePromises);
    }

    return res.status(200).json({
      status: true,
      message: "Product deleted successfully",
      data: product
    });

  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      status: false,
      message: "Error deleting product",
      error: error.message
    });
  }
};

// Delete specific product images
const deleteProductImages = async (req, res) => {
  try {
    const imageUrls = req.body.images;

    if (!imageUrls || !Array.isArray(imageUrls)) {
      return res.status(400).json({
        status: false,
        message: 'No images provided.'
      });
    }

    const results = await Promise.all(
      imageUrls.map(async (imageUrl) => {
        try {
          const publicId = extractPublicId(imageUrl);
          if (publicId) {
            const resourceType = imageUrl.includes('/image/') ? 'image' : 'raw';
            const result = await deleteFromCloudinary(publicId, resourceType);
            return { image: imageUrl, status: 'deleted', result };
          } else {
            return { image: imageUrl, status: 'invalid URL' };
          }
        } catch (err) {
          return { image: imageUrl, status: 'error', error: err.message };
        }
      })
    );

    return res.status(200).json({
      status: true,
      message: 'Processed image deletions.',
      results
    });

  } catch (error) {
    console.error("Error deleting images:", error);
    return res.status(500).json({
      status: false,
      message: "Error deleting images",
      error: error.message
    });
  }
};

// Get average rating for all the products
const getAverageRating = async (req, res) => {
  try {
    const products = await Product.find();
    const totalRating = products.reduce((acc, product) => acc + product.average_rating, 0);
    const averageRating = products.length > 0 ? totalRating / products.length : 0;

    return res.status(200).json({
      status: true,
      message: "Average rating fetched successfully",
      data: averageRating
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error fetching average rating",
      error: error.message
    });
  }
};

// Get stock level of each category
const getStockLevelByCategory = async (req, res) => {
  try {
    const stockData = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          stockLevel: { $sum: '$stock_level' }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          stockLevel: 1,
        }
      },
      { $limit: 15 }
    ]);

    return res.status(200).json({
      status: true,
      data: stockData
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error fetching stock levels by category",
      error: error.message
    });
  }
};

// Get products based on category name
const getProductsByCategoryName = async (req, res) => {
  try {
    let { category } = req.params;

    if (!category) {
      return res.status(400).json({
        status: false,
        message: "Category parameter is required"
      });
    }

    category = decodeURIComponent(category).toLowerCase();

    const products = await Product.find({
      category: { $regex: category, $options: "i" }
    });

    if (!products.length) {
      const sample = await Product.findOne({});
      return res.status(404).json({
        status: false,
        message: "No products found for this category",
        debug: {
          searchedCategory: category,
          sampleProductStructure: sample ? Object.keys(sample.toObject()) : "No products available"
        }
      });
    }

    return res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      data: products
    });

  } catch (error) {
    console.error("Error fetching products by category:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while fetching products",
      error: error.message
    });
  }
};

// Get products by sub-category name
const getProductBySubCategoryName = async (req, res) => {
  try {
    let { subcategory } = req.params;

    if (!subcategory) {
      return res.status(400).json({
        status: false,
        message: "Sub-category parameter is required"
      });
    }

    const normalizedSubcategory = decodeURIComponent(subcategory).toLowerCase();

    const products = await Product.find({
      sub_category: { $regex: new RegExp(normalizedSubcategory, 'i') }
    });

    if (products?.length === 0) {
      return res.status(404).json({
        status: false,
        message: `No products found for sub category ${normalizedSubcategory}`,
        data: null
      });
    }

    return res.status(200).json({
      status: true,
      message: `${products.length} products found for sub category ${normalizedSubcategory}`,
      data: products
    });

  } catch (error) {
    console.error("Error fetching products by subcategory:", error);
    return res.status(500).json({
      status: false,
      message: "Error fetching products",
      error: error.message
    });
  }
};

// Get number of products per product_type in percentage
const getProductPercentagePerProductType = async (req, res) => {
  try {
    const result = await Product.aggregate([
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
          breakdown: {
            $push: {
              type: "$_id",
              count: "$count"
            }
          },
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
              2,
            ],
          },
        },
      },
    ]);

    return res.json(result);

  } catch (error) {
    console.error("Error fetching product percentages:", error);
    return res.status(500).json({ error: "Server error" });
  }
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