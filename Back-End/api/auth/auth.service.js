import bcrypt from "bcrypt";
import Cryptr from "cryptr";

import { loggerService } from "../../services/logger.service.js";
import { userService } from "../user/user.service.js";

const cryptr = new Cryptr(process.env.SECRET1 || "Secret-Puk-1234");

export const authService = {
  signup,
  login,
  getLoginToken,
  validateToken,
};

async function signup({ username, password, fullname }) {
  const saltRounds = 10;
  loggerService.debug(
    `auth.service - signup with username : ${username}, fullname : ${fullname}`
  );
  if (!username || !password || !fullname)
    throw "Missing required signup fields, please fill all";

  const userExists = await userService.getByUsername(username);
  if (userExists) throw "Username already taken";

  const hash = await bcrypt.hash(password, saltRounds);
  return userService.save({ username, password: hash, fullname });
}

async function login(username, password) {
  const user = await userService.getByUsername(username);
  if (!user) throw "Unknown username";

  // Commented for development!
  // const match = await bcrypt.compare(password, user.password);
  // if (!match) throw "Invalid username or password";

  const miniUser = {
    _id: user._id,
    fullname: user.fullname,
    isAdmin: user.isAdmin,
  };
  return miniUser;
}

function getLoginToken(user) {
  const str = JSON.stringify(user);
  const encryptedStr = cryptr.encrypt(str);
  return encryptedStr;
}

function validateToken(token) {
  try {
    const json = cryptr.decrypt(token);
    const loggedinUser = JSON.parse(json);
    return loggedinUser;
  } catch (err) {
    console.log("Invalid login token");
  }
  return null;
}
