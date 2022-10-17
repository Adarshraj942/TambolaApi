import express from "express";
import { allMatch, claim, creatematch, getTickets, joinmatch, removeMatch, startmatch, winners } from "../Controllers/RoomController.js";
const router = express.Router();

router.post("/creatematch",creatematch)
router.post("/joinmatch",joinmatch)
router.post("/start",startmatch)
router.post("/ticket",getTickets)
router.post("/claim",claim)
router.delete("/remove",removeMatch)
router.get("/allmatch",allMatch)
router.post("/winner",winners)
export default router; 

