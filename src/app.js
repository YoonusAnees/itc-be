import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import quoteRoutes from "./routes/quote.routes.js";

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:8000",
  "http://localhost:12000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", "X-XSRF-TOKEN"],
};

app.use(cors(corsOptions));

app.set("trust proxy", process.env.TRUST_PROXY === "1" || process.env.NODE_ENV === "production");

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CSRF protection using cookies. Expose token via /api/csrf-token
app.use(csurf({ cookie: true }));

// Redirect to HTTPS when enforced
if (process.env.ENFORCE_HTTPS === "true") {
  app.use((req, res, next) => {
    if (!req.secure && req.get("x-forwarded-proto") !== "https") {
      return res.redirect(`https://${req.get("host")}${req.originalUrl}`);
    }
    next();
  });
}

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Gold Jewelry API Running",
  });
});

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/quotes", quoteRoutes);

// app.use("/api/admin", adminRoutes);

export default app;