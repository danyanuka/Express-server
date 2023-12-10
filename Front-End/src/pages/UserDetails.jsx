import { useState } from "react";
import { userService } from "../services/users/user.service.js";
import { showErrorMsg } from "../services/event-bus.service.js";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export function UserDetails() {
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const user = await userService.getById(userId);
      setUser(user);
    } catch (err) {
      showErrorMsg("Cannot load user");
    }
  }

  if (!user) return <h1>loadings....</h1>;
  return (
    <div className="user-details main-layout">
      <h3>user Details 🐛</h3>
      <h4>{user.fullname}</h4>
      <p>
        Username: <span>{user.username}</span>
      </p>
      <p>PW: {user.password} </p>
      <p>Score : {user.score}</p>
      <Link to="/user">Back to List</Link>
    </div>
  );
}
