//Ovdje pisemo kod za upite prema bazi podataka
// server/db/queries.js
import { openDB } from "./openDB.js";

// Slugify helper funkcija
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// 0. Inicijalizacija slugova - ažurira sve proizvode koji nemaju slug
export function initializeSlugs() {
  const db = openDB();
  const products = db.prepare("SELECT id, namn FROM products WHERE slug IS NULL OR slug = ''").all();
  
  if (products.length > 0) {
    console.log(`Ažuriravam ${products.length} proizvoda sa slugovima...`);
    const updateStmt = db.prepare("UPDATE products SET slug = ? WHERE id = ?");
    
    products.forEach(product => {
      const newSlug = slugify(product.namn);
      updateStmt.run(newSlug, product.id);
    });
    
    console.log("Slugovi su ažurirani!");
  }
}

// 1. Popularni proizvodi (8 kom)
export function getPopularProducts() {
  const db = openDB();
  return db.prepare("SELECT * FROM products LIMIT 8").all();
}
// 2. Proizvod po slug-u
export function getProductBySlug(slug) {
  const db = openDB();
  return db.prepare("SELECT * FROM products WHERE slug = ?").get(slug);
}
// 2b. Slični proizvodi (po brandu)
export function getSimilarProducts(productId, brand, limit = 3) {
  const db = openDB();
  return db.prepare(
    "SELECT * FROM products WHERE brand = ? AND id != ? LIMIT ?"
  ).all(brand, productId, limit);
}
// 3. Pretraga proizvoda
export function searchProducts(term) {
  const db = openDB();
  // Pretvaramo i kolonu 'namn' i pretraživani 'term' u mala slova za poređenje
  return db.prepare("SELECT * FROM products WHERE LOWER(namn) LIKE LOWER(?)").all(`%${term}%`);
}
// 4. Admin — lista svih proizvoda
export function getAllProducts() {
  const db = openDB();
  return db.prepare("SELECT * FROM products").all();
}
// 5. Admin — dodavanje proizvoda
export function createProduct(product) {
  const db = openDB();
  const { namn, description, image_url, brand, sku, price, slug } = product;
  return db.prepare(
    `INSERT INTO products (namn, description, image_url, brand, sku, price, slug)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(namn, description, image_url, brand, sku, price, slug);
}
