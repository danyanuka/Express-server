// import { utilService } from "../../services/util.service.js";
import { loggerService } from "../../services/logger.service.js";
// import { authService } from "../auth/auth.service.js";

import { dbService } from "../../services/db.service.js";
import { ObjectId } from "mongodb";

const collectionName = "msg";

async function query() {
  try {
    const collection = await dbService.getCollection(collectionName);
    const msgs = await _executeAggregation(collection);

    return msgs;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function getById(msgId) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const msg = collection.findOne({ _id: new ObjectId(msgId) });

    if (!msg) throw `Couldnt find a msg with id: ${bugId}`;
    return msg;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function remove(msgId, loggedinUser) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const criteria = { _id: new ObjectId(msgId) };
    if (!loggedinUser.isAdmin)
      criteria.byUserId = new ObjectId(loggedinUser._id);
    const { deletedCount } = await collection.deleteOne(criteria);
    if (deletedCount < 1) throw "Not your MSG";
    return deletedCount;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function add(msg) {
  try {
    const msgToAdd = {
      byUserId: new ObjectId(msg.byUserId),
      aboutBugId: new ObjectId(msg.aboutBugId),
      txt: msg.txt,
    };
    const collection = await dbService.getCollection(collectionName);
    await collection.insertOne(msgToAdd);
    return msgToAdd;
  } catch (err) {
    loggerService.error("msgService[add] : ", err);
    throw err;
  }
}

async function update(msg) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const fieldsToUpdate = { txt: msg.txt };

    await collection.updateOne(
      { _id: new ObjectId(msg._id) },
      { $set: fieldsToUpdate }
    );

    return "Updated successfully";
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function _executeAggregation(collection) {
  return await collection
    .aggregate([
      { $match: {} },
      {
        $lookup: {
          localField: "byUserId",
          from: "users",
          foreignField: "_id",
          as: "byUser",
        },
      },
      { $unwind: "$byUser" },
      {
        $lookup: {
          localField: "aboutBugId",
          from: "bugs",
          foreignField: "_id",
          as: "aboutBug",
        },
      },
      { $unwind: "$aboutBug" },
      {
        $project: {
          txt: 1,
          byUser: { fullname: 1, _id: 1 },
          aboutBug: { title: 1, severity: 1, _id: 1 },
        },
      },
    ])
    .toArray();
}

export const msgService = {
  query,
  getById,
  remove,
  update,
  add,
};
