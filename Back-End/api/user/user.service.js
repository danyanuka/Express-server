import { utilService } from "../../services/util.service.js";
import { loggerService } from "../../services/logger.service.js";
import { authService } from "../auth/auth.service.js";

import { dbService } from "../../services/db.service.js";
import { ObjectId } from "mongodb";

// let users = utilService.readJsonFile("./data/users.json");
const collectionName = "users";

async function query() {
  try {
    const collection = await dbService.getCollection(collectionName);
    const userCursour = await collection.find();
    const users = userCursour.toArray();
    return users;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function getById(userId) {
  try {
    // const user = users.find((user) => user._id === userId);
    const collection = await dbService.getCollection(collectionName);
    const user = collection.findOne({ _id: new ObjectId(userId) });

    // const bug = bugs.find((bug) => bug._id === bugId);
    if (!user) throw `Couldnt find a bug with id: ${bugId}`;
    return user;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const { deletedCount } = await collection.deleteOne({
      _id: new ObjectId(userId),
    });
    return deletedCount;
    // const idx = users.findIndex((user) => user._id === userId);
    // if (idx === -1) throw `Couldnt find user with id:${userId}`;

    // users.splice(idx, 1);
    // utilService.saveJsonFile(users, "./data/users.json");
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function add(userToAdd) {
  try {
    userToAdd.score = 1000;
    const collection = await dbService.getCollection(collectionName);
    await collection.insertOne(userToAdd);
    return userToAdd;
  } catch (er) {
    loggerService.error("UserService[add] : ", err);
    throw err;
  }
}

async function update(user) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const fieldsToUpdate = { score: user.score };

    await collection.updateOne(
      { _id: new ObjectId(user._id) },
      { $set: fieldsToUpdate }
    );
    // if (userToSave._id) {
    //   const idx = users.findIndex((user) => user._id === userToSave._id);
    //   if (idx === -1) throw `Couldnt find user with id:${userToSave._id}`;
    //   users.splice(idx, 1, userToSave);
    // } else {}
    // userToSave._id = utilService.makeId();
    // userToSave.score = 10000;
    // users.push(userToSave);

    // utilService.saveJsonFile(users, "./data/users.json");
    // return userToSave;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function getByUsername(username) {
  const collection = await dbService.getCollection(collectionName); // Get the collection
  const user = await collection.findOne({ username }); // Query for the user
  return user; // Return the found user document
  // return users.find((user) => user.username === username);
}

export const userService = {
  query,
  getById,
  remove,
  update,
  add,
  getByUsername,
};
