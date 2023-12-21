import { utilService } from "../../services/util.service.js";
import { loggerService } from "../../services/logger.service.js";
import { dbService } from "../../services/db.service.js";
import { ObjectId } from "mongodb";

// let bugs = utilService.readJsonFile("./data/bugs.json");
const PAGE_SIZE = 4;
const collectionName = "bugs";

async function query(filterBy = {}) {
  // let bugsToFilter = [...bugs];
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

    // if (filterBy.text) {
    //   bugsToFilter = bugsToFilter.filter((bug) =>
    //     bug.title.toLowerCase().includes(filterBy.text.toLowerCase())
    //   );
    // }

    // if (filterBy.severity) {
    //   bugsToFilter = bugsToFilter.filter(
    //     (bug) => bug.severity === filterBy.severity
    //   );
    // }

    // if (filterBy.pageIdx) {
    //   const startIdx = filterBy.pageIdx * PAGE_SIZE;
    //   bugsToFilter = bugsToFilter.slice(startIdx, startIdx + PAGE_SIZE);
    // }
    // return bugsToFilter;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function getById(bugId) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const bug = collection.findOne({ _id: new ObjectId(bugId) });

    // const bug = bugs.find((bug) => bug._id === bugId);
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
    const { deletedCount } = await collection.deleteOne({
      _id: new ObjectId(bugId),
    });
    return deletedCount;
    // if (!bug) throw `Couldnt find a bug with id: ${bugId}`;
    // if (!loggedinUser.isAdmin && bug.owner._id !== loggedinUser._id)
    //   throw "Not your bug";

    // const idx = bugs.findIndex((bug) => bug._id === bugId);
    // if (idx === -1) throw `Couldnt find bug with id:${bugId}`;
    // console.log(loggedinUser);
    // const bug = bugs[idx];
    // bugs.splice(idx, 1);
    // utilService.saveJsonFile(bugs, "./data/bugs.json");
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

// async function save(bugToSave, loggedinUser) {
//   try {
//     if (bugToSave._id) {
//       const idx = bugs.findIndex((bug) => bug._id === bugToSave._id);
//       if (idx === -1) throw `Couldnt find bug with id:${bugToSave._id}`;

//       const bug = bugs[idx];
//       if (bug.owner._id !== loggedinUser._id) throw "Not your bug";

//       const updatedBug = { ...bug, ...bugToSave };
//       bugs.splice(idx, 1, updatedBug);
//       utilService.saveJsonFile(bugs, "./data/bugs.json");
//       return updatedBug;
//     } else {
//       bugToSave._id = utilService.makeId();
//       bugToSave.createdAt = Date.now();
//       bugToSave.owner = loggedinUser;
//       bugs.push(bugToSave);
//       utilService.saveJsonFile(bugs, "./data/bugs.json");
//       return bugToSave;
//     }
//   } catch (err) {
//     loggerService.error("CarService[save] : ", err);
//     throw err;
//   }
// }

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
