import express from "express";
import { requireAuth } from "../../middlewares/requireAuth.middleware.js";
import {
  getBugs,
  getBug,
  addBug,
  updateBug,
  removeBug,
} from "./bug.controller.js";

const router = express.Router();

router.get("/", getBugs);
router.get("/:bugId", getBug);
router.post("/", requireAuth, addBug);
router.put("/:bugId", requireAuth, updateBug);
router.delete("/:bugId", requireAuth, removeBug);

export const bugRoutes = router;
