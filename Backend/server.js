import express, { json } from 'express';
import { config } from 'dotenv';
import dbConnection from './config/dbConnection.js';

const app = express();
config();
app.use(json());

//connect to database
dbConnection();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});