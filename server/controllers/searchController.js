// server/controllers/adminController.js
import { searchProducts } from "../db/queries.js";

export async function search(req, res) {
    const q = req.query.q || "";
    const results = searchProducts(q);
    res.json(results);
}
