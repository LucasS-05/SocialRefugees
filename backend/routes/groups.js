import express from "express";
import { getGroups, getGroupAdmin, createGroup, addGroupHelper, updateGroup, setGroupAdmin, getAdministeredGroups, getUnadministeredGroups, deleteGroup } from "../controllers/groups.js";

import { verifyToken } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/admin.js";

const router = express.Router();

/* READ */

//WARN : CHANGE FUTURE PATH ON CREATE GROUP
//no, di ce sa-l schimb? amu nu mai tin minte

router.get("/", getGroups);
router.get("/unadministered", getUnadministeredGroups);
router.post("/administered", getAdministeredGroups);
router.post("/", createGroup);
router.post("/delete", deleteGroup);
router.post("/:ownerId", getGroupAdmin);
// router.get("/:userId/groups", verifyToken, getGroups);

router.patch("/:groupId/update", updateGroup);

//o gandesc mai inclo
//router.get("/bucket", verifyToken, verifyAdmin, getBucket);

//am gandit-o
router.patch("/change-admin", verifyToken, verifyAdmin, setGroupAdmin);


router.patch("/:id/helped", verifyToken, addGroupHelper)

export default router;
