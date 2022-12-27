import express from "express";
import { allMatch, claim, creatematch, getMemberCount, getTickets, joinmatch, leaderboard, leaveMatch, removeMatch, startmatch, startPrivatematch, winners } from "../Controllers/RoomController.js";
const router = express.Router();

router.post("/creatematch",creatematch)
router.post("/joinmatch",joinmatch)
router.post("/start",startmatch)
router.post("/startprivate",startPrivatematch)
router.post("/ticket",getTickets)
router.post("/claim",claim)
router.delete("/remove",removeMatch)
router.get("/allmatch",allMatch)
router.post("/winner",winners)
router.post("/getMemberCount",getMemberCount)
router.post("/leave",leaveMatch)
router.post("/leaderboard",leaderboard)
export default router; 

