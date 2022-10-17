import express from "express";
import { getUserWallet, updateUser } from "../Controllers/UserController.js";
import authMiddleWare from "../Middleware/AuthMiddleWare.js";
const router = express.Router();
router.put("/:id", authMiddleWare, updateUser)
router.post("/getUserWallet",getUserWallet)

export default router;