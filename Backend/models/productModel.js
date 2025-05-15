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
    discount: { type: Number, default: 0 },
    profit_margin: { type: Number }, 
    gross_profit: { type: Number },
    click_through_rate: { type: Number, default: 0 }, 
    reviews_count: { type: Number, default: 0 },
    average_rating: { type: Number, min: 0, max: 5 },
    image_link: [{ type: String }], 
    affiliate_program: { type: mongoose.Schema.Types.ObjectId, ref: 'AffiliateProgram' , 
    required: function () {
        return this.product_type === 'affiliate';
    }
    },
    file_type: {
    type: String,
    enum: [
        'pdf', 'zip', 'mp4', 'mp3', 'jpg', 'png', 'gif',
        'docx', 'txt', 'epub', 'exe', 'avi', 'mov', 'wmv',
        'psd', 'ai', 'svg', 'rtf', 'xlsx', 'csv', 'json'
    ],
    required: function () {
        return this.product_type === 'digital';
    }
    },
    affiliate_link: {
        type: String,
        required: function () {
            return this.product_type === 'affiliate';
        }
    },
    commission_rate: {
        type: Number,
        required: function () {
            return this.product_type === 'affiliate';
        }
    },	
}, {
    timestamps: true
});

const Product = mongoose.model('Products', productSchema);
export default Product;