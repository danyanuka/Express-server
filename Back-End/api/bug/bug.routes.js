import express from "express";

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
router.post("/", addBug);
router.put("/:bugId", updateBug);
router.delete("/:bugId", removeBug);

export const bugRoutes = router;
