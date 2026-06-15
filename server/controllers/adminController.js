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

/*
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
# 🧩 **1. Šta radi ovaj import?**

```js
import { getAllProducts, createProduct } from "../db/queries.js";
```

Ovim potezom **controller** dobija pristup SQL funkcijama koje se nalaze u `queries.js`.

- `getAllProducts` → SQL SELECT  
- `createProduct` → SQL INSERT  

Drugim riječima:

**Controller ne zna SQL.  
Queries ne zna Express.  
Import ih povezuje.**

---

# 🟦 **2. adminList() — tok podataka**

```js
export async function adminList(req, res) {
  const products = await getAllProducts();
  res.json(products);
}
```

### ✔️ Šta se ovdje dešava?

1. Express ruta poziva `adminList()`
2. `adminList()` poziva SQL funkciju `getAllProducts()`
3. `getAllProducts()` otvara SQLite bazu i radi:

```sql
SELECT * FROM products;
```

4. Rezultat (array proizvoda) se vraća controlleru
5. Controller vraća JSON React admin panelu

### Vizuelno:

```
Admin → GET /admin/products
        ↓
adminList()
        ↓
getAllProducts()
        ↓
SQLite: SELECT * FROM products
        ↓
products[]
        ↓
res.json(products)
```

---

# 🟩 **3. adminCreate() — tok podataka**

```js
export async function adminCreate(req, res) {
  await createProduct(req.body);
  res.json({ message: "Product created" });
}
```

### ✔️ Šta se ovdje dešava?
Drugo objasnjenje
To je to — upravo si shvatio ključnu stvar, i to je veliki korak naprijed.  
Ali hajde da to još malo “ispeglamo”, da bude potpuno jasno kako sve funkcioniše.

---

# 🔵 **Važno pojašnjenje: adminCreate NIJE u queries.js**

Ovo je česta zabuna kod početnika, pa je super što si je primijetio.

### ✔ **adminCreate se nalazi u `controllers/adminController.js`**  
To je funkcija koja:

export async function adminCreate(req, res) {
 createProduct(req.body);
  res.json({ message: "Product created" });
}

- prima podatke iz forme (`req.body`)
- validira ih
- generiše slug
- priprema objekat proizvoda
- poziva funkciju iz baze

### ✔ **createProduct se nalazi u `db/queries.js`**  
To je funkcija koja:

- radi SQL `INSERT`
- upisuje podatke u SQLite bazu

Dakle:

- **adminCreate → logika**
- **createProduct → rad sa bazom**

Oni rade zajedno, ali nisu u istom fajlu.

---

# 🟦 Kako to izgleda u lancu poziva

### 1. **admin.js (ruta)** koja izgleda ovako:

//server/routes/admin.js
import express from "express";
import { adminList, adminCreate } from "../controllers/adminController.js";

const router = express.Router();

router. get("/products", adminList);
router.post("/products", adminCreate);
export default router;  

Poziva:
```js
adminCreate
```

### 2. **adminController.js**  
Unutar `adminCreate` se poziva:
```js
createProduct(product)
```
export async function adminCreate(req, res) {
 createProduct(req.body);
  res.json({ message: "Product created" });
}


### 3. **queries.js**  
Ovdje se izvršava SQL:

```sql
INSERT INTO products ...
```
// 5. Admin — dodavanje proizvoda
export function createProduct(product) {
  const db = openDB();
  const { namn, description, image_url, brand, sku, price, slug } = product;
  return db.prepare(
    `INSERT INTO products (namn, description, image_url, brand, sku, price, slug)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(namn, description, image_url, brand, sku, price, slug);
}

---

# 🟩 Ukratko (najbolje objašnjenje)

> **adminCreate** je u kontroleru i služi za logiku.  
> **createProduct** je u queries.js i služi za rad sa bazom.  
> adminCreate poziva createProduct, ali oni nisu ista funkcija i nisu u istom fajlu.

---

Prvo objasnjenje
1. Admin pošalje POST formu (name, price, sku…)
2. Express ruta poziva `adminCreate()`
3. `adminCreate()` uzima podatke iz `req.body`
4. Poziva SQL funkciju `createProduct(req.body)`
5. `createProduct()` radi:

```sql
INSERT INTO products (...)
VALUES (...)
```

6. Controller vraća JSON poruku

### Vizuelno:

```
Admin → POST /admin/products
        ↓
adminCreate(req.body)
        ↓
createProduct(product)
        ↓
SQLite: INSERT INTO products ...
        ↓
OK
        ↓
res.json({ message: "Product created" })
```

---

# 🧠 **4. Kako queries.js izgleda u pozadini**

### ✔️ getAllProducts()

```js
export async function getAllProducts() {
  const db = await openDB();
  return db.all("SELECT * FROM products");
}
```

- `openDB()` otvara SQLite bazu  
- `db.all()` vraća više redova (array)

---

### ✔️ createProduct()

```js
export async function createProduct(product) {
  const db = await openDB();
  const { name, description, image, brand, sku, price, slug } = product;

  return db.run(
    `INSERT INTO products (name, description, image, brand, sku, price, slug)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description, image, brand, sku, price, slug]
  );
}
```

- `db.run()` izvršava INSERT  
- `?` placeholders štite od SQL injection  
- vrijednosti dolaze iz `req.body`

---

# 🎯 **5. Ukratko — veza između controller i queries**

| Sloj | Uloga |
|------|--------|
| **Controller** | prima request, poziva SQL funkciju, vraća JSON |
| **Queries** | izvršava SQL nad SQLite bazom |
| **Import** | povezuje controller i queries |

### Najkraće moguće:

**Controller = logika**  
**Queries = SQL**  
**Import = most između njih**

* */