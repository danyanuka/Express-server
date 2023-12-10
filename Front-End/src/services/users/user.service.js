import Axios from "axios";

const axios = Axios.create({
  withCredentials: true,
});

const BASE_URL = "//localhost:3030/api/user/";
export const userService = {
  query,
  getById,
  save,
  remove,
};
// Get List
async function query() {
  try {
    let { data: users } = await axios.get(BASE_URL);
    return users;
  } catch (err) {
    console.log(err);
  }
}

// GetByID
async function getById(userId) {
  const url = BASE_URL + userId;
  try {
    const { data: user } = await axios.get(url);
    return user;
  } catch (err) {
    console.log(err);
  }
}

// DELETE
async function remove(userId) {
  const url = BASE_URL + userId;
  try {
    const { data: res } = await axios.delete(url);
    return res;
  } catch (err) {
    console.log(err);
  }
}

// PUT/POST
async function save(user) {
  const dynMethod = user._id ? "put" : "post";
  const dynPath = user._id ? BASE_URL + user._id : BASE_URL;
  try {
    const { data: savedUser } = await axios[dynMethod](dynPath, user);
    return savedUser;
  } catch (err) {
    console.log(err);
  }
}
