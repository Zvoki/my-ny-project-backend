// server/server.js
import express from "express";
import productsRouter from "./routes/products.js";
import searchRouter from "./routes/search.js";
import adminRouter from "./routes/admin.js";
import { initializeSlugs } from "./db/queries.js";
import cors from "cors";

const port = process.env.PORT || 8000;
const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3002",
  "https://my-ny-frontend.netlify.app",
  "https://www.my-ny-frontend.netlify.app"
];

app.use(express.json());
app.use(express.json()); // Enables the server to automatically read JSON from the request body.

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// Serve static assets from the public directory.
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.json({ message: "Backend API is running" });
});

// Initialize missing product slugs when the server starts.
initializeSlugs();

// Register feature-specific routers.
app.use("/products", productsRouter);
app.use("/search", searchRouter);
app.use("/admin", adminRouter);


app.listen(port, () => {
  console.log("Server running on port", port);
});

