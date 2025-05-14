import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    product_type: { type: String, enum: ['physical', 'digital', 'affiliate'], required: true },
    sku: { type: String, required: true, unique: true },
    brand: { type: String },
    price: { type: Number, required: true },
    stock_level: { type: Number, required: true },
    units_sold: { type: Number, default: 0 },
    total_sales_revenue: { type: Number, default: 0 },
    description: { type: String },
    availability: { type: String, enum: ['In Stock', 'Out of Stock', 'Preorder'], default: 'In Stock' },
    discount: { type: Number, default: 0 }, // Represented as a decimal (e.g., 0.1 for 10%)
    profit_margin: { type: Number }, // Represented as a decimal (e.g., 0.25 for 25%)
    gross_profit: { type: Number },
    click_through_rate: { type: Number, default: 0 }, // Represented as a decimal
    reviews_count: { type: Number, default: 0 },
    average_rating: { type: Number, min: 0, max: 5 },
    image_link: { type: String }
}, {
    timestamps: true
});

const Product = mongoose.model('Products', productSchema);
export default Product;