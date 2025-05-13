import express, { json } from 'express';
import { config } from 'dotenv';
import dbConnection from './config/dbConnection.js';

const app = express();
config();
app.use(json());

//connect to database
dbConnection();

// default port is 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});