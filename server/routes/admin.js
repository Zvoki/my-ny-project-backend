//server/routes/admin.js
import express from "express";
import { adminList, adminCreate } from "../controllers/adminController.js";

const router = express.Router();

router. get("/products", adminList);
router.post("/products", adminCreate);
export default router; 