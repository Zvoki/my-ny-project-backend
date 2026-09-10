// server/controllers/adminController.js
import { getAllProducts, createProduct } from "../db/queries.js";

export async function adminList(req, res) {
  const products = getAllProducts();
  res.json(products);
}

export async function adminCreate(req, res) {
 createProduct(req.body);
  res.json({ message: "Product created" });
}
