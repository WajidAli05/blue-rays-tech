// import mongoose from 'mongoose';
// import dbConnection from '../config/dbConnection.js';
// import Categories from '../models/categorySchema.js';
// import { config } from 'dotenv';

// config();

// const categories = [
//   { label: 'Electronics', key: '1' },
//   { label: 'Clothing', key: '2' },
//   { label: 'Books', key: '3' },
//   { label: 'Home & Kitchen', key: '4' },
//   { label: 'Sports & Outdoors', key: '5' },
//   { label: 'Toys & Games', key: '6' },
//   { label: 'Health & Beauty', key: '7' },
//   { label: 'Automotive', key: '8' },
//   { label: 'Grocery', key: '9' },
//   { label: 'Pet Supplies', key: '10' },
//   { label: 'Office Supplies', key: '11' },
//   { label: 'Music', key: '12' },
//   { label: 'Video Games', key: '13' },
//   { label: 'Movies & TV', key: '14' },
//   { label: 'Collectibles', key: '15' },
//   { label: 'Handmade', key: '16' },
//   { label: 'Arts & Crafts', key: '17' },
//   { label: 'Baby Products', key: '18' },
//   { label: 'Jewelry', key: '19' },
//   { label: 'Shoes', key: '20' }
// ];

// const seedCategories = () => {
//   dbConnection()
//     .then(() => {
//       return Categories.deleteMany({});
//     })
//     .then(() => {
//       return Categories.insertMany(categories);
//     })
//     .then(() => {
//       console.log('Categories seeded successfully');
//     })
//     .catch((err) => {
//       console.error('Error seeding categories:', err);
//     })
//     .finally(() => {
//       mongoose.connection.close();
//     });
// };

// seedCategories();


import mongoose from 'mongoose';
import dbConnection from '../config/dbConnection.js';
import Categories from '../models/categoryModel.js';
import { config } from 'dotenv';

config();

// Categories with subcategories
const categories = [
  {
    label: 'Electronics',
    key: '1',
    subCategories: ['Mobiles', 'Laptops', 'Cameras', 'Headphones', 'Accessories']
  },
  {
    label: 'Clothing',
    key: '2',
    subCategories: ['Men', 'Women', 'Kids', 'Footwear', 'Accessories']
  },
  {
    label: 'Books',
    key: '3',
    subCategories: ['Fiction', 'Non-Fiction', 'Academic', "Children's Books"]
  },
  {
    label: 'Home & Kitchen',
    key: '4',
    subCategories: ['Furniture', 'Kitchenware', 'Decor', 'Lighting']
  },
  {
    label: 'Sports & Outdoors',
    key: '5',
    subCategories: ['Fitness', 'Cycling', 'Camping', 'Outdoor Gear']
  },
  {
    label: 'Toys & Games',
    key: '6',
    subCategories: ['Board Games', 'Action Figures', 'Puzzles']
  },
  {
    label: 'Health & Beauty',
    key: '7',
    subCategories: ['Skincare', 'Haircare', 'Supplements', 'Makeup']
  },
  {
    label: 'Jewelry',
    key: '19',
    subCategories: ['Necklaces', 'Rings', 'Earrings']
  },
  {
    label: 'Shoes',
    key: '20',
    subCategories: ['Men', 'Women', 'Kids', 'Sports']
  }
];

const seedCategories = () => {
  dbConnection()
    .then(() => Categories.deleteMany({}))
    .then(() => Categories.insertMany(categories))
    .then(() => {
      console.log('Categories with subcategories seeded successfully');
    })
    .catch((err) => {
      console.error('Error seeding categories:', err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
};

seedCategories();