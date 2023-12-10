import { userService } from "./user.service.js";

// Get List
export async function getUsers(req, res) {
  try {
    const users = await userService.query();
    res.send(users);
  } catch (err) {
    res.status(400).send("Failed to get users");
  }
}

// Get By ID
export async function getUser(req, res) {
  const { userId } = req.params;
  try {
    const user = await userService.getById(userId);
    res.send(user);
  } catch (err) {
    res.status(400).send("Couldnt get user");
  }
}

// Delete
export async function removeUser(req, res) {
  const { userId } = req.params;
  try {
    await userService.remove(userId);
    res.send("User Deleted permanently");
  } catch (err) {
    res.status(400).send("Cant remove user");
  }
}

// Post
export async function addUser(req, res) {
  const { fullname, username, password, score } = req.body;

  const userToSave = {
    fullname,
    username,
    password,
    score: +score,
  };
  try {
    const savedUser = await userService.save(userToSave);
    res.send(savedUser);
  } catch (err) {
    res.status(400).send("Could't save bug");
  }
}

// PUT
export async function updateUser(req, res) {
  const { userId } = req.params;
  const { fullname, username, password, score } = req.body;
  const userToSave = {
    _id: userId,
    fullname,
    username,
    password,
    score: +score,
  };
  try {
    const savedUser = await userService.save(userToSave);
    res.send(savedUser);
  } catch (err) {
    res.status(400).send("Could't save bug");
  }
}
