import express from "express";
import { checkMobile, findAcount, getUserWallet, updateUser } from "../Controllers/UserController.js";
import authMiddleWare from "../Middleware/AuthMiddleWare.js";
const router = express.Router();
router.put("/:id", authMiddleWare, updateUser)
router.post("/getUserWallet",getUserWallet)
router.post("/checkmobile", checkMobile)
router.post("/findacccount", findAcount)
export default router;