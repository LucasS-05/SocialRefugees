import express from "express";
import { getGroups, getGroupAdmin, createGroup, addGroupHelper, updateGroup, } from "../controllers/groups.js";

import { verifyToken } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/admin.js";

const router = express.Router();

/* READ */

//WARN : CHANGE FUTURE PATH ON CREATE GROUP
//no, di ce sa-l schimb? amu nu mai tin minte

router.get("/", getGroups);
router.post("/", createGroup);
router.post("/:ownerId", getGroupAdmin);
// router.get("/:userId/groups", verifyToken, getGroups);

router.patch("/:groupId/update", updateGroup)
//o gandesc mai inclo
//router.get("/bucket", verifyToken, verifyAdmin, getBucket);


router.patch("/:id/helped", verifyToken, addGroupHelper)

export default router;
