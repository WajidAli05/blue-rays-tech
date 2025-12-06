import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { v2 as cloudinary } from "cloudinary";

// Load environment variables
config();

// DB connection
import dbConnection from "./config/dbConnection.js";

// Middlewares
import { rateLimiter } from "./middlewares/rateLimiter.js";

// Routes
import productRoutes from "./routes/v1/productRoutes.js";
import categoryRoutes from "./routes/v1/categoryRoutes.js";
import AffiliateProgramRoutes from "./routes/v1/affiliateProgramRoutes.js";
import fileTypeRoutes from "./routes/v1/fileTypeRoutes.js";
import userRoutes from "./routes/v1/userRoutes.js";
import adminRoutes from "./routes/v1/adminRoutes.js";
import announcementBarRoutes from "./routes/v1/announcementBarRoutes.js";
import cartRoutes from "./routes/v1/cartRoutes.js";
import shippingRoutes from "./routes/v1/shippingRoutes.js";
import trackDeviceRoutes from "./routes/v1/trackDeviceRoutes.js";
import sessionDurationRoutes from "./routes/v1/sessionDurationRoutes.js";
import stripeRoutes from "./routes/v1/stripeRoutes.js";
import queryRoutes from "./routes/v1/queryRoutes.js";
import orderRoutes from "./routes/v1/orderRoutes.js";

// Stripe webhook controller
import { handleWebhook } from "./controllers/stripeController.js";

const app = express();

/* Stripe webhook must come BEFORE any body parsing */
app.post(
  "/api/v1/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

/* Global middlewares */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    xssFilter: true,
  })
);

app.use(rateLimiter);
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    credentials: true,
  })
);

app.use("/api/v1", stripeRoutes);

/* Normal parsers (AFTER webhook!) */
app.use(cookieParser());
app.use(json());

/* Cloudinary configuration */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Log cloudinary configuration status (without exposing sensitive data)
console.log('Cloudinary configured:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✓' : '✗',
  api_key: process.env.CLOUDINARY_API_KEY ? '✓' : '✗',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✓' : '✗'
});

/* Routes */
app.use("/api/v1", productRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", AffiliateProgramRoutes);
app.use("/api/v1", fileTypeRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1", announcementBarRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", shippingRoutes);
app.use("/api/v1", trackDeviceRoutes);
app.use("/api/v1", sessionDurationRoutes);
app.use("/api/v1", queryRoutes);
app.use("/api/v1", orderRoutes);

/* DB connection */
dbConnection();

/* Start server */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});