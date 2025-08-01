import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

// Load environment variables
config();

// DB connection
import dbConnection from './config/dbConnection.js';

// Middlewares
import { rateLimiter } from './middlewares/rateLimiter.js';

// Routes
import productRoutes from './routes/v1/productRoutes.js';
import categoryRoutes from './routes/v1/categoryRoutes.js';
import AffiliateProgramRoutes from './routes/v1/affiliateProgramRoutes.js';
import fileTypeRoutes from './routes/v1/fileTypeRoutes.js';
import userRoutes from './routes/v1/userRoutes.js';
import adminRoutes from './routes/v1/adminRoutes.js';
import announcementBarRoutes from './routes/v1/announcementBarRoutes.js';
import cartRoutes from './routes/v1/cartRoutes.js';
import shippingRoutes from './routes/v1/shippingRoutes.js';
import trackDeviceRoutes from './routes/v1/trackDeviceRoutes.js';
import sessionDurationRoutes from './routes/v1/sessionDurationRoutes.js';

const app = express();

// Security Headers Middleware (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false,           // Disable CSP to avoid frontend issues
    crossOriginEmbedderPolicy: false,       // Allow 3rd-party embeds
    frameguard: { action: 'deny' },         // Prevent clickjacking
    hidePoweredBy: true,                    // Hide Express signature
    hsts: {
      maxAge: 31536000,                     // 1 year
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,                          // Prevent MIME sniffing
    xssFilter: true,                        // XSS protection
  })
);

// Rate Limiting (Prevent abuse)
app.use(rateLimiter);

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '',
  credentials: true,
}));

// Parsing Middlewares
app.use(json());
app.use(cookieParser());

// 🔌 Connect to MongoDB
dbConnection();

// Static files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/v1', productRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', AffiliateProgramRoutes);
app.use('/api/v1', fileTypeRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1', announcementBarRoutes);
app.use('/api/v1', cartRoutes);
app.use('/api/v1', shippingRoutes);
app.use('/api/v1', trackDeviceRoutes);
app.use('/api/v1', sessionDurationRoutes);

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});