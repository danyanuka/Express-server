import { userService } from "../services/users/user.service.js";

import { useState } from "react";
import { useEffect } from "react";
import { UserList } from "../cmps/UserList";

export function UserIndex() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const users = await userService.query();
    setUsers(users);
  }

  async function onRemoveUser(userId) {
    try {
      await userService.remove(userId);
      console.log("Deleted Succesfully!");
      setUsers((prevusers) => prevusers.filter((user) => user._id !== userId));
    } catch (err) {
      console.log("Error from onRemoveuser ->", err);
    }
  }

  // async function onAddUser() {
  //   const user = {
  //     fullname: prompt("full Name ?"),
  //     username: prompt("Your username"),
  //     password: prompt("Your password"),
  //     score: 0,
  //   };

  //   try {
  //     const savedUser = await userService.save(user);
  //     console.log("Added user", savedUser);
  //     setUsers((prevUsers) => [...prevUsers, savedUser]);
  //   } catch (err) {
  //     console.log("Error from onAdduser ->", err);
  //   }
  // }

  async function onEditUser(user) {
    const password = prompt("New Password?");
    const userToSave = { ...user, password };
    try {
      const savedUser = await userService.update(userToSave);
      console.log("Updated user:", savedUser);
      setUsers((prevUsers) =>
        prevUsers.map((currUser) =>
          currUser._id === savedUser._id ? savedUser : currUser
        )
      );
    } catch (err) {
      console.log("Error from onEditUser ->", err);
    }
  }

  return (
    <main className="main-layout">
      <h3>users App</h3>
      <main>
        {/* <button onClick={onAddUser}>Register ⛐</button> */}

        <UserList
          users={users}
          onRemoveUser={onRemoveUser}
          onEditUser={onEditUser}
        />
      </main>
    </main>
  );
}
