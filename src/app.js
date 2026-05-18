import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import quoteRoutes from "./routes/quote.routes.js";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:12000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Gold Jewelry API Running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/quotes", quoteRoutes);

// app.use("/api/admin", adminRoutes);

export default app;