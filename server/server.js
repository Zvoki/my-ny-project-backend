// server/server.js
import express from "express";
import productsRouter from "./routes/products.js";
import searchRouter from "./routes/search.js";
import adminRouter from "./routes/admin.js";
import { initializeSlugs } from "./db/queries.js";
import cors from "cors"

const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());/*omogućava serveru da automatski čita JSON iz request 
body‑ja(npr. POST /login sa { "email": "...", "password": "..." })
Korisnik popuni formu 
Frontend pretvori te podatke u JSON 
Backend ih primi kao JSON 
A onda express.json() uradi magiju:
Pretvori JSON u običan JavaScript objekat:
req.body = {
  name: "Laptop",
  price: 1200
}
*/

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true //Dozvoljavaš slanje kolačića / tokena (credentials: true)
}));

// Serve static files iz public direktorija,Sve što staviš u 
// public/ direktorijum biće dostupno kao statički fajlovi (slike, CSS, JS…).
app.use(express.static('public'));

/*Inicijalizuj slugove pri startu servera. Ovo se izvršava jednom pri
 pokretanju servera.
Najčešće radi:
generiše slugove za proizvode, popunjava bazu ako nešto nedostaje, radi cleanup
export function initializeSlugs() {
  const db = openDB();
  const products = db.prepare("SELECT id, namn FROM products WHERE slug IS NULL OR slug = ''").all();*/
initializeSlugs();

/*Registracija ruta
Ovo znači:
Sve rute iz productsRouter počinju sa /products
Sve rute iz searchRouter počinju sa /search
Sve rute iz adminRouter počinju sa /admin
Ako u productsRouter imaš rutu:router.get("/")
Ona postaje: GET /products
*/
app.use("/products", productsRouter);
app.use("/search", searchRouter);
app.use("/admin", adminRouter);


app.listen(port, () => {
  console.log("Server running on port", port);
});

