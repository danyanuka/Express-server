import { utilService } from "../../services/util.service.js";
import { loggerService } from "../../services/logger.service.js";
import { dbService } from "../../services/db.service.js";
import { ObjectId } from "mongodb";

const PAGE_SIZE = 4;
const collectionName = "bugs";

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy);
    console.log(criteria);

    const collection = await dbService.getCollection(collectionName);

    const bugCursor = await collection.find(criteria);

    if (filterBy.pageIdx) {
      const startIdx = filterBy.pageIdx * PAGE_SIZE;
      bugCursor.skip(startIdx).limit(PAGE_SIZE);
    }
    const bugs = bugCursor.toArray();
    return bugs;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function getById(bugId) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const bug = collection.findOne({ _id: new ObjectId(bugId) });

    if (!bug) throw `Couldnt find a bug with id: ${bugId}`;
    return bug;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}
async function remove(bugId, loggedinUser) {
  try {
    const collection = await dbService.getCollection(collectionName);

    // Get the bug's Owner only, Check for match
    const bug = await collection.findOne(
      { _id: new ObjectId(bugId) },
      { owner: 1 }
    );
    if (!bug) {
      throw new Error(`Couldn't find a bug with id: ${bugId}`);
    }
    if (!loggedinUser.isAdmin && bug.owner._id !== loggedinUser._id) {
      throw new Error("Not your bug");
    }

    const { deletedCount } = await collection.deleteOne({
      _id: new ObjectId(bugId),
    });
    return deletedCount;
  } catch (err) {
    loggerService.error("CarService[Remove] : ", err);
    throw err;
  }
}
async function add(bugToAdd, loggedinUser) {
  try {
    bugToAdd.owner = loggedinUser;
    const collection = await dbService.getCollection(collectionName);
    await collection.insertOne(bugToAdd);
    return bugToAdd;
  } catch (er) {
    loggerService.error("BugService[add] : ", err);
    throw err;
  }
}

async function update(bug, loggedinUser) {
  try {
    if (!loggedinUser.isAdmin && bug.owner._id !== loggedinUser._id)
      throw "Not your bug";
    const collection = await dbService.getCollection(collectionName);
    const fieldsToUpdate = { severity: bug.severity };

    await collection.updateOne(
      { _id: new ObjectId(bug._id) },
      { $set: fieldsToUpdate }
    );
  } catch (err) {
    loggerService.error("BugService[update] : ", err);
    throw err;
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};
  if (filterBy.text) {
    criteria.title = { $regex: filterBy.text, $options: "i" };
  }
  if (filterBy.severity) {
    criteria.severity = { $gt: filterBy.severity };
  }

  return criteria;
}

export const bugService = {
  query,
  getById,
  remove,
  add,
  update,
};
