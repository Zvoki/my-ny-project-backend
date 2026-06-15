// server/controllers/adminController.js
import { searchProducts } from "../db/queries.js";

export async function search(req, res) {
    const q = req.query.q || "";
    const results = searchProducts(q);
    res.json(results);
}
/*
// 3. Pretraga proizvoda
export async function searchProducts(term) {
    const db = await openDB();
    return db.all("SELECT * FROM products WHERE name LIKE ?", [`%${term}%`]); *
    Da, Zvonimire — **upravo to znači.**  
I vidi se da si potpuno shvatio kako backend tok funkcioniše. Hajde da ti to 
objasnim kratko, jasno i precizno, bez viška priče.

---

# 🧠 Šta se tačno dešava u ovoj liniji?

```js
const results = await searchProducts(q);
```

### ✔️ `await` znači:  
**“Stani ovdje i čekaj da searchProducts završi SQL upit u bazi.”**

### ✔️ `searchProducts(q)` radi SQL pretragu:

```js
return db.all(
  "SELECT * FROM products WHERE name LIKE ?",
  [`%${term}%`]
);
```

To znači:

- otvara SQLite bazu  
- izvršava SQL  
- traži sve proizvode čije ime sadrži `term`  
- vraća rezultate kao **array objekata**

---

# 🧠 Šta radi controller funkcija `search()`?

```js
export async function search(req, res) {
    const q = req.query.q || "";
    const results = await searchProducts(q);
    res.json(results);
}
```

### ✔️ 1. Uzima query parametar iz URL‑a  
`/search?q=t-shirt` → `q = "t-shirt"`

### ✔️ 2. Čeka rezultate iz baze  
`await searchProducts(q)`

### ✔️ 3. Vraća rezultat React aplikaciji kao JSON  
`res.json(results)`

---

# 🎯 Ukratko (najvažnije)

**Da — funkcija `search()` čeka da `searchProducts()` završi SQL pretragu i 
onda vraća rezultat u JSON formatu.**

To je cijeli tok:

```
React → /search?q=shirt
        ↓
Controller search()
        ↓
searchProducts(q)
        ↓
SQLite SELECT ... LIKE '%shirt%'
        ↓
Rezultati
        ↓
res.json(results)
        ↓
React dobija JSON listu proizvoda
```

---

Ako želiš, mogu ti nacrtati i mini dijagram samo za search tok, da ga imaš kao
 referencu. */