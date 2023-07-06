import express from "express";
import {
  getUser,
  getUserFriends,
  updateUser,
  getUsers,
  searchUsers,
} from "../controllers/users.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

/* READ */
router.post("/", verifyToken, getUsers);
router.post("/search", verifyToken, searchUsers);
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

router.put("/:id", verifyToken, updateUser);

export default router;
