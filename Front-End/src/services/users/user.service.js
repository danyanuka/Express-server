import Axios from "axios";

const axios = Axios.create({
  withCredentials: true,
});

const STORAGE_KEY_LOGGEDIN_USER = "loggedinUser";

const BASE_URL =
  process.env.NODE_ENV !== "development" ? "/api/" : "//localhost:3030/api/";

const BASE_USER_URL = BASE_URL + "user/";
const BASE_AUTH_URL = BASE_URL + "auth/";

export const userService = {
  query,
  getById,
  update,
  remove,
  login,
  signup,
  logout,
  getLoggedinUser,
  getEmptyUser,
};
// Get List
async function query() {
  try {
    const { data: users } = await axios.get(BASE_USER_URL);
    return users;
  } catch (err) {
    console.log(err);
  }
}

// GetByID
async function getById(userId) {
  const url = BASE_USER_URL + userId;
  try {
    const { data: user } = await axios.get(url);
    return user;
  } catch (err) {
    console.log(err);
  }
}

// DELETE
async function remove(userId) {
  const url = BASE_USER_URL + userId;
  try {
    const { data: res } = await axios.delete(url);
    return res;
  } catch (err) {
    console.log(err);
  }
}

// PUT/POST
async function update(user) {
  try {
    const { data: savedUser } = await axios.put(BASE_USER_URL + user._id, user);
    return savedUser;
  } catch (err) {
    console.log(err);
  }
}

// AUTH Requests
async function login(credentials) {
  try {
    const { data: user } = await axios.post(
      BASE_AUTH_URL + "login",
      credentials
    );
    console.log("user", user);
    if (user) {
      return saveLocalUser(user);
    }
    return null;
  } catch (err) {
    console.log(err);
  }
}
async function signup(credentials) {
  try {
    const { data: user } = await axios.post(
      BASE_AUTH_URL + "signup",
      credentials
    );
    return saveLocalUser(user);
  } catch (err) {
    console.log(err);
  }
}
async function logout() {
  try {
    await axios.post(BASE_AUTH_URL + "logout");
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);
  } catch (err) {
    console.log(err);
  }
}

function saveLocalUser(user) {
  user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin };
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
  return user;
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER));
}

function getEmptyUser() {
  return {
    username: "",
    fullname: "",
    password: "",
  };
}
