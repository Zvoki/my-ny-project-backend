// server/routes/products.js
import express from "express";
import { popular, productDetails } from "../controllers/productsController.js";

const router = express.Router();

router.get("/popular", popular);
router.get("/:slug", productDetails);

export default router;
