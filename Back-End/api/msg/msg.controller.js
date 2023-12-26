import { msgService } from "./msg.service.js";
import { loggerService } from "../../services/logger.service.js";

// Get List
export async function getMsgs(req, res) {
  try {
    const msgs = await msgService.query();
    res.send(msgs);
  } catch (err) {
    res.status(400).send("Failed to get msgs");
  }
}

// Get By ID
export async function getMsg(req, res) {
  const { msgId } = req.params;
  try {
    const msg = await msgService.getById(msgId);

    res.send(msg);
  } catch (err) {
    res.status(400).send("Couldnt get msg");
  }
}

// Delete
export async function removeMsg(req, res) {
  const { msgId } = req.params;
  try {
    const deletedCount = await msgService.remove(msgId, req.loggedinUser);
    res.json({ message: "msg Deleted", deletedCount });
  } catch (err) {
    res.status(400).send("Cant remove msg");
  }
}

// Post
export async function addMsg(req, res) {
  const { loggedinUser } = req;

  try {
    let { txt, aboutBugId } = req.body;
    let msgToSave = {
      txt,
      aboutBugId,
      byUserId: loggedinUser._id,
    };

    const savedmsg = await msgService.add(msgToSave);

    res.send(savedmsg);
  } catch (err) {
    loggerService.error("Failed to add review", err);
    res.status(400).send({ err: "Failed to add review" });
  }
}

// PUT
export async function updateMsg(req, res) {
  const { msgId } = req.params;
  const { txt, aboutBugId, byUserId } = req.body;
  const msgToSave = {
    _id: msgId,
    txt,
    aboutBugId,
    byUserId,
  };
  try {
    const savedMsg = await msgService.update(msgToSave);
    res.send(savedMsg);
  } catch (err) {
    res.status(400).send("Could't save msg");
  }
}
