import { useEffect, useState } from "react";
import { UserMsg } from "./UserMsg";
import { NavLink } from "react-router-dom";

export function AppHeader() {
  const [loggedInUser, setLoggerInUser] = useState();

  // async function onLogin(credentials) {}

  // async function onSignup(credentials) {}

  // async function onLogout(credentials) {}

  useEffect(() => {
    // component did mount when dependancy array is empty
  }, []);

  return (
    <header className="app-header ">
      <div className="header-container">
        <UserMsg />
        <nav className="app-nav">
          <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
          <NavLink to="/user">Users</NavLink>|
          <NavLink to="/about">About</NavLink>|
        </nav>
        <h1 style={{ marginLeft: "50px" }}>Bugs are Forever</h1>
      </div>
    </header>
  );
}
