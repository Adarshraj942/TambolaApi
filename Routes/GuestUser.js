import express from "express";
import { createGuestUser } from "../Controllers/GuestUserController.js";

const router = express.Router();

router.post("/create", createGuestUser)
export default router;

