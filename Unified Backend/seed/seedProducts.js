// productSeeder.js
import mongoose from 'mongoose';
import dbConnection from '../config/dbConnection.js';
import Product from '../models/productModel.js';
import AffiliateProgram from '../models/affiliateProgramModel.js';
import { config } from 'dotenv';

config();

await dbConnection();

const categories = [
  { key: "1", label: "electronics", sub: ["mobiles", "laptops", "cameras", "headphones", "accessories"] },
  { key: "2", label: "clothing", sub: ["men", "women", "kids", "footwear", "accessories"] },
  { key: "3", label: "books", sub: ["fiction", "non-fiction", "academic", "children's books"] },
  { key: "4", label: "home & kitchen", sub: ["furniture", "kitchenware", "decor", "lighting"] },
  { key: "5", label: "sports & outdoors", sub: ["fitness", "cycling", "camping", "outdoor gear"] },
  { key: "6", label: "toys & games", sub: ["board games", "action figures", "puzzles"] },
  { key: "7", label: "health & beauty", sub: ["skincare", "haircare", "supplements", "makeup"] },
  { key: "8", label: "digital products", sub: ["e-books", "online courses", "software", "music"] }
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const sampleBrands = ["Sony", "Apple", "Samsung", "Nike", "Adidas", "IKEA", "Penguin", "LG"];
const sampleDescriptions = ["High quality product.", "Best in class.", "Top rated by users.", "New arrival.", "Limited stock!"];
const fileTypes = ["pdf", "zip", "mp4", "mp3", "jpg"];

const affiliatePrograms = await AffiliateProgram.find();
const affiliateProgramId = affiliatePrograms[0]?._id || new mongoose.Types.ObjectId();

const products = [];

categories.forEach(({ label, sub }) => {
  sub.forEach((subcat) => {
    for (let i = 1; i <= 5; i++) {
      const type = getRandom(["physical", "digital", "affiliate"]);
      const base = {
        name: `${subcat} Product ${i}`,
        category: label,
        sub_category: subcat,
        product_type: type,
        sku: `${subcat.substring(0, 3).toUpperCase()}-${i}-${Date.now() + i}`,
        brand: getRandom(sampleBrands),
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        stock_level: Math.floor(Math.random() * 50 + 10),
        description: getRandom(sampleDescriptions),
        image_link: ["https://via.placeholder.com/150"],
        availability: "In Stock",
        discount: 0,
      };

      if (type === "digital") {
        base.file_type = getRandom(fileTypes);
      } else if (type === "affiliate") {
        base.affiliate_link = "https://example.com/product";
        base.commission_rate = parseFloat((Math.random() * 20 + 5).toFixed(2));
        base.affiliate_program = affiliateProgramId;
      }

      products.push(base);
    }
  });
});

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
  } catch (err) {
    console.error("Error seeding products:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedProducts();