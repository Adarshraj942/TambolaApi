import express from "express";
import { checkMobile, getUserWallet, updateUser } from "../Controllers/UserController.js";
import authMiddleWare from "../Middleware/AuthMiddleWare.js";
const router = express.Router();
router.put("/:id", authMiddleWare, updateUser)
router.post("/getUserWallet",getUserWallet)
router.post("/checkmobile", checkMobile)

export default router;