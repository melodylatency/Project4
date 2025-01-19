import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Bode parser of req obj
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/products", productRoutes); // Product express router, we are shortening the url
app.use("/api/users", userRoutes); // User express router, we are shortening the url

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running, port ${port}`));
