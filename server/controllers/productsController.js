// server/controllers/productsController.js
import { getPopularProducts, getProductBySlug, getSimilarProducts } from "../db/queries.js"

export function popular(req, res) {
        const products = getPopularProducts();
        res.json(products);
}
export function productDetails(req, res) {
        const product = getProductBySlug(req.params.slug);
        if (!product) {
                return res.status(404).json({ error: "Produkt inte hittad" });
        }
        // Get similar products by brand
        const similar = getSimilarProducts(product.id, product.brand);
        res.json({ ...product, similar });
}
