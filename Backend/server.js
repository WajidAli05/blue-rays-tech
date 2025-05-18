import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';

import dbConnection from './config/dbConnection.js';
import productRoutes from './routes/v1/productRoutes.js';
import categoryRoutes from './routes/v1/categoryRoutes.js';
import AffiliateProgramRoutes from './routes/v1/affiliateProgramRoutes.js';
import fileTypeRoutes from './routes/v1/fileTypeRoutes.js';
import userRoutes from './routes/v1/userRoutes.js';

const app = express();
config();
app.use(json());

//connect to database
dbConnection();

app.use(cors());

//routes
app.use('/uploads', express.static('uploads'));
app.use('/api/v1', productRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', AffiliateProgramRoutes);
app.use('/api/v1', fileTypeRoutes);
app.use('/api/v1', userRoutes);

// default port is 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});