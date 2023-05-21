import express from "express";
import { getGroups } from "../controllers/groups.js";

import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

/* READ */

//WARN : CHANGE FUTURE PATH ON CREATE GROUP
router.get("/", verifyToken, getGroups);
router.get("/:userId/groups", verifyToken, getGroups);

export default router;
