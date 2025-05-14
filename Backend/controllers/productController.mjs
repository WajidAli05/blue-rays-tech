import Products from "../models/productModel.js";

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
    const image_link = req.file ? req.file.path : req.body.image_link || ''; // Image from form-data or provided URL

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
        image_link // Store the image path from file upload or image link
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

export { addProduct , getProducts };