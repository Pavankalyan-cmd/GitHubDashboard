import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import WorkflowTable from "../Table/table";

export default function DropdownButtons() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [user, setUser] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/api/user-repos/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRepos(res.data);
        toast.success("data fetched successfully");
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const privateRepos = repos.filter((repo) => repo.private === true);
  const publicRepos = repos.filter((repo) => repo.private === false);
  return (
    <div>
      {console.log(repos)}

      <div className="dropdown">
        {/* private repo dropdown*/}
        <div className="button1">
          <h6>Private</h6>
          <button
            className="btn  githubbtn"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span>Github Repo</span>
            <i className="bi bi-caret-down-fill ms-2"></i>{" "}
          </button>
          <div className="dropdown-menu " aria-labelledby="dropdownMenuButton">
            {privateRepos.length > 0 ? (
              privateRepos.map((repo, index) => (
                <li key={`private-${index}`}>
                  <a
                    className="dropdown-item"
                    href={repo.html_url}
                    target="_blank"
                  >
                    {repo.name}
                  </a>
                </li>
              ))
            ) : (
              <li className="dropdown-item disabled">No private repos</li>
            )}
          </div>
        </div>
        {/* public repo dropdown */}
        <div className="button2">
          <h6>Public</h6>
          <button
            className="btn githubbtn"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span>Github Repo</span>
            <i className="bi bi-caret-down-fill ms-2"></i>{" "}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {publicRepos.length > 0 ? (
              publicRepos.map((repo, index) => (
                <li key={`private-${index}`}>
                  <a
                    className="dropdown-item"
                    href="l"
                    target="_blank"
                    onClick={() => {
                      setSelectedRepo(repo.name);
                      setUser(repo.owner);
                    }}
                  >
                    {repo.name}
                  </a>
                </li>
              ))
            ) : (
              <li className="dropdown-item disabled">No private repos</li>
            )}
          </div>
        </div>
      </div>
      <WorkflowTable userLogin={user.login} selectedRepo={selectedRepo} />
    </div>
  );
}
