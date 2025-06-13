// productSeeder.js
import mongoose from 'mongoose';
import dbConnection from '../config/dbConnection.js';
import Product from '../models/productModel.js';
import AffiliateProgram from '../models/affiliateProgramModel.js';
import { config } from 'dotenv';

config();

await dbConnection();

const categories = [
  { key: "1", label: "Electronics", sub: ["Mobiles", "Laptops", "Cameras", "Headphones", "Accessories"] },
  { key: "2", label: "Clothing", sub: ["Men", "Women", "Kids", "Footwear", "Accessories"] },
  { key: "3", label: "Books", sub: ["Fiction", "Non-Fiction", "Academic", "Children's Books"] },
  { key: "4", label: "Home & Kitchen", sub: ["Furniture", "Kitchenware", "Decor", "Lighting"] },
  { key: "5", label: "Sports & Outdoors", sub: ["Fitness", "Cycling", "Camping", "Outdoor Gear"] },
  { key: "6", label: "Toys & Games", sub: ["Board Games", "Action Figures", "Puzzles"] },
  { key: "7", label: "Health & Beauty", sub: ["Skincare", "Haircare", "Supplements", "Makeup"] },
  { key: "8", label: "Digital Products", sub: ["E-books", "Online Courses", "Software", "Music"] }
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