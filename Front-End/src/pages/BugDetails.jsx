import { bugService } from "../services/bugs/bug.service.js";
import { showErrorMsg } from "../services/event-bus.service.js";

import { useState } from "react";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

export function BugDetails() {
  const [bug, setBug] = useState(null);
  const { bugId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadBug();
  }, []);

  async function loadBug() {
    try {
      const bug = await bugService.getById(bugId);
      setBug(bug);
    } catch (err) {
      navigate("/bug");
      showErrorMsg("Reached 3 bugs, please wait a bit");
    }
  }

  if (!bug) return <h1>loadings....</h1>;
  return (
    <div className="bug-details main-layout">
      <h3>Bug Details 🐛</h3>
      <h4>{bug.title}</h4>
      <p>
        Severity: <span>{bug.severity}</span>
      </p>
      <p>
        <h4>Bug description :</h4> <br />
        {bug.description}{" "}
      </p>
      <Link to="/bug">Back to List</Link>
    </div>
  );
}
