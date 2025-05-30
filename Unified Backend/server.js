import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import dbConnection from './config/dbConnection.js';
import productRoutes from './routes/v1/productRoutes.js';
import categoryRoutes from './routes/v1/categoryRoutes.js';
import AffiliateProgramRoutes from './routes/v1/affiliateProgramRoutes.js';
import fileTypeRoutes from './routes/v1/fileTypeRoutes.js';
import userRoutes from './routes/v1/userRoutes.js';
import visitRoutes from './routes/v1/visitRoutes.js';
import adminRoutes from './routes/v1/adminRoutes.js';

const app = express();
config();
app.use(json());
app.use(cookieParser());

//connect to database
dbConnection();

app.use(cors({
  origin: process.env.CLIENT_URL || '',
  credentials: true, // Allow cookies to be sent
}));

//routes
app.use('/uploads', express.static('uploads'));
app.use('/api/v1', productRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', AffiliateProgramRoutes);
app.use('/api/v1', fileTypeRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', visitRoutes);
app.use('/api/v1', adminRoutes);


// default port is 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});