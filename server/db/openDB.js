import Database from "better-sqlite3";

export function openDB() {
  try {
    const db = new Database('./db/freaky.db');
    console.log("Databas öppnad.");
    return db;
  } catch (err) {
    console.error("Fel när databas öppnas:", err.message);
  }
}
