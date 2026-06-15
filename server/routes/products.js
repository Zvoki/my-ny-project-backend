// server/routes/products.js
import express from "express";
import { popular, productDetails } from "../controllers/productsController.js";

const router = express.Router();

router.get("/popular", popular);
router.get("/:slug", productDetails);

export default router;
/*Nije sasvim - trebam te ispraviti:

router.get("/popular", popular); je localhost:8000/products/popular (ne 3000)

Evo zašto:

Ruta /popular je definirana u products.js
Router je montiran sa app.use("/products", productsRouter); u server.js
Server sluša na portu 8000 (ne 3000)
Rezultat: /products + /popular = localhost:8000/products/popular*/