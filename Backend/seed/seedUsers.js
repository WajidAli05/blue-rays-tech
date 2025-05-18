import mongoose from 'mongoose';
import { config } from 'dotenv';
import dbConnection from '../config/dbConnection.js';
import User from '../models/userModal.js';

config();

const users = [
  {
    name: 'Dio Lupa',
    email: 'dio_lupa@gmail.com',
    phone: '1234567890',
    image: 'dio.jpg',
    description: 'Singer and songwriter',
    since: '2023-01-01',
    country: 'USA',
    job: 'Singer and songwriter',
    purchase_history: []
  },
  {
    name: 'Ellie Beilish',
    email: 'ellie_beilish@gmail.com',
    phone: '1234567891',
    image: 'ellie.jpg',
    description: 'Singer and musician',
    since: '2023-02-01',
    country: 'Pakistan',
    job: 'Singer and musician',
    purchase_history: []
  },
  {
    name: 'Sabrino Gardener',
    email: 'sabrino_gardener@gmail.com',
    phone: '1234567892',
    image: 'sabrino.jpg',
    description: 'Songwriter and artist',
    since: '2023-03-01',
    country: 'USA',
    job: 'Songwriter and artist',
    purchase_history: []
  },
  {
    name: 'Lana Ray',
    email: 'lana_ray@gmail.com',
    phone: '1234567893',
    image: 'lana.jpg',
    description: 'Pop singer',
    since: '2023-04-01',
    country: 'UK',
    job: 'Pop singer',
    purchase_history: []
  },
  {
    name: 'Mark Ronson',
    email: 'mark_ronson@gmail.com',
    phone: '1234567894',
    image: 'mark.jpg',
    description: 'Music producer',
    since: '2023-05-01',
    country: 'Canada',
    job: 'Producer',
    purchase_history: []
  },
  {
    name: 'Taylor Swift',
    email: 'taylor_swift@gmail.com',
    phone: '1234567895',
    image: 'taylor.jpg',
    description: 'Singer-songwriter',
    since: '2023-06-01',
    country: 'USA',
    job: 'Singer-songwriter',
    purchase_history: []
  },
  {
    name: 'Zayn Malik',
    email: 'zayn_malik@gmail.com',
    phone: '1234567896',
    image: 'zayn.jpg',
    description: 'Singer and model',
    since: '2023-07-01',
    country: 'UK',
    job: 'Singer and model',
    purchase_history: []
  },
  {
    name: 'Ariana Grande',
    email: 'ariana_grande@gmail.com',
    phone: '1234567897',
    image: 'ariana.jpg',
    description: 'Actress and singer',
    since: '2023-08-01',
    country: 'USA',
    job: 'Actress and singer',
    purchase_history: []
  },
  {
    name: 'Charlie Puth',
    email: 'charlie_puth@gmail.com',
    phone: '1234567898',
    image: 'charlie.jpg',
    description: 'Singer-songwriter',
    since: '2023-09-01',
    country: 'USA',
    job: 'Singer-songwriter',
    purchase_history: []
  },
  {
    name: 'Camila Cabello',
    email: 'camila_cabello@gmail.com',
    phone: '1234567899',
    image: 'camila.jpg',
    description: 'Pop singer',
    since: '2023-10-01',
    country: 'Cuba',
    job: 'Pop singer',
    purchase_history: []
  }
];

const seedUsers = async () => {
  try {
    await dbConnection();
    await User.deleteMany();
    await User.insertMany(users);
    console.log('Users seeded successfully');
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    mongoose.connection.close(() => {
      console.log('Database connection closed');
    });
  }
};

seedUsers();