import express, { Application } from "express";
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import "./utils/i18n-config.js";
import { IEnvironment } from "./types/environment.js";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const env = (process.env.NODE_ENV as IEnvironment) || "development";

// CORS configuration
const allowedOrigins: Record<IEnvironment, string[]> = {
  development: ["http://localhost:3000", "http://localhost:3001"],
  production: process.env.ALLOWED_ORIGINS?.split(",") || [],
  test: ["http://localhost:3000"],
};

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowed = allowedOrigins[env];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", limiter);

// CORS
app.use(cors(corsOptions));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
routes(app);

// Error handler must be last
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port} in ${env} mode`);
});

export default app;

