import express from "express";
import { getGroups, getBucket } from "../controllers/groups.js";

import { verifyToken } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/admin.js";

const router = express.Router();

/* READ */

//WARN : CHANGE FUTURE PATH ON CREATE GROUP
router.get("/", getGroups);
router.get("/:userId/groups", verifyToken, getGroups);

router.get("/bucket", verifyToken, verifyAdmin, getBucket);

export default router;
