// server/db/queries.js
import { openDB } from "./openDB.js";

// Convert product names into URL-friendly slugs.
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Generate slugs for products that do not have one yet.
export function initializeSlugs() {
  const db = openDB();
  const products = db.prepare("SELECT id, namn FROM products WHERE slug IS NULL OR slug = ''").all();
  
  if (products.length > 0) {
    console.log(`Updating ${products.length} products with slugs...`);
    const updateStmt = db.prepare("UPDATE products SET slug = ? WHERE id = ?");
    
    products.forEach(product => {
      const newSlug = slugify(product.namn);
      updateStmt.run(newSlug, product.id);
    });
    
    console.log("Slugs are updated!");
  }
}

// Return the first eight products for the popular products view.
export function getPopularProducts() {
  const db = openDB();
  return db.prepare("SELECT * FROM products LIMIT 8").all();
}
// Find a product by its URL slug.
export function getProductBySlug(slug) {
  const db = openDB();
  return db.prepare("SELECT * FROM products WHERE slug = ?").get(slug);
}
// Return other products from the same brand.
export function getSimilarProducts(productId, brand, limit = 3) {
  const db = openDB();
  return db.prepare(
    "SELECT * FROM products WHERE brand = ? AND id != ? LIMIT ?"
  ).all(brand, productId, limit);
}
// Search products by name, ignoring letter case.
export function searchProducts(term) {
  const db = openDB();
  return db.prepare("SELECT * FROM products WHERE LOWER(namn) LIKE LOWER(?)").all(`%${term}%`);
}

// Return all products for the admin view.
export function getAllProducts() {
  const db = openDB();
  return db.prepare("SELECT * FROM products").all();
}
// Insert a new product into the database.
export function createProduct(product) {
  const db = openDB();
  const { namn, description, image_url, brand, sku, price, slug } = product;
  return db.prepare(
    `INSERT INTO products (namn, description, image_url, brand, sku, price, slug)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(namn, description, image_url, brand, sku, price, slug);
}
