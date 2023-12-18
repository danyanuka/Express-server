import express from "express";
import { requireAdmin } from "../../middlewares/requireAuth.middleware.js";

import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  removeUser,
} from "./user.controller.js";

const router = express.Router();

router.get("/", requireAdmin, getUsers);
router.get("/:userId", requireAdmin, getUser);
router.post("/", requireAdmin, addUser);
router.put("/:userId", requireAdmin, updateUser);
router.delete("/:userId", requireAdmin, removeUser);

export const userRoutes = router;
