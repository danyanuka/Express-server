import express from "express";
import {
  requireAdmin,
  requireAuth,
} from "../../middlewares/requireAuth.middleware.js";

import {
  getMsgs,
  getMsg,
  addMsg,
  updateMsg,
  removeMsg,
} from "./msg.controller.js";

const router = express.Router();

router.get("/", getMsgs);
router.get("/:msgId", getMsg);
router.post("/", requireAuth, addMsg);
router.put("/:msgId", requireAdmin, updateMsg);
router.delete("/:msgId", requireAuth, removeMsg);

export const msgRoutes = router;
