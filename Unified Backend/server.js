import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

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

/* 
  Stripe webhook must come BEFORE any body parsing
*/
app.post(
  "/api/v1/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

/* 
  Global middlewares
*/
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
    origin: process.env.CLIENT_URL || "",
    credentials: true,
  })
);

app.use("/api/v1", stripeRoutes);

/* 
  Normal parsers (AFTER webhook!)
*/
app.use(cookieParser());
app.use(json());

/* 
  Routes
*/
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

// Static
app.use("/uploads", express.static("uploads"));

/* 
  DB connection
*/
dbConnection();

/* 
  Start server
*/
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});