import express from "express";
import { getGroups, getGroupAdmin, createGroup, addGroupHelper, updateGroup, setGroupAdmin, getAdministeredGroups, getUnadministeredGroups, deleteGroup, updateMemberStatus, joinGroup } from "../controllers/groups.js";

import { verifyToken } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/admin.js";

const router = express.Router();

/* READ */

//WARN : CHANGE FUTURE PATH ON CREATE GROUP
//no, di ce sa-l schimb? amu nu mai tin minte

router.get("/", verifyToken, getGroups);
router.get("/unadministered", verifyToken, getUnadministeredGroups);
router.post("/administered", verifyToken, getAdministeredGroups);
router.post("/", verifyToken, createGroup);
router.post("/delete", verifyToken, deleteGroup);
router.post("/:ownerId", verifyToken, getGroupAdmin);
// router.get("/:userId/groups", verifyToken, getGroups);

router.patch("/:groupId/update", verifyToken, updateGroup);
router.patch("/:groupId/request-join", verifyToken, joinGroup);
router.patch("/:groupId/update-member-status", verifyToken, updateMemberStatus);

//o gandesc mai inclo
//router.get("/bucket", verifyToken, verifyAdmin, getBucket);

//am gandit-o
router.patch("/change-admin", verifyToken, verifyAdmin, setGroupAdmin);


router.patch("/:id/helped", verifyToken, addGroupHelper)

export default router;
