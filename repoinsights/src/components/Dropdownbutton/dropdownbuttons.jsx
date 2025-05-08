import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import WorkflowTable from "../Table/table";

export default function DropdownButtons() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [user, setUser] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgRepos, setOrgRepos] = useState([]);

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
    axios
      .get("http://localhost:8000/api/user-orgs/", {
        headers: {
          Authorization: `token ${token}`,
        },
      })
      .then((res) => {
        setOrgs(res.data);
        console.log(res.data, "orgs data");
        toast.success("Organizations fetched successfully");
      })
      .catch(console.error);

    if (!selectedOrg) return;

    axios
      .get(`http://localhost:8000/api/org-repos/${selectedOrg}/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      })
      .then((res) => {
        setOrgRepos(res.data);
        toast.success("Organization repo fetched successfully ");
      })
      .catch(console.error);
  }, [selectedOrg]);
  const privateRepos = repos.filter((repo) => repo.private === true);
  const publicRepos = repos.filter((repo) => repo.private === false);

  return (
    <div>
      {console.log(repos)}
      {console.log(orgs)}
      {console.log(selectedOrg)}

      <div className="dropdown">
        <div className="repo">
          <h4>Repositories</h4>
          {/* private repo dropdown*/}
          <div className="button1">
            <button
              className="btn  githubbtn"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span>Github Private Repositories</span>
              <i className="bi bi-caret-down-fill ms-2"></i>{" "}
            </button>
            <div
              className="dropdown-menu "
              aria-labelledby="dropdownMenuButton"
            >
              {privateRepos.length > 0 ? (
                privateRepos.map((repo, index) => (
                  <li key={`private-${index}`}>
                    <a className="dropdown-item" href="#">
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
            <button
              className="btn githubbtn"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span>Github Public Repositories</span>
              <i className="bi bi-caret-down-fill ms-2"></i>{" "}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {publicRepos.length > 0 ? (
                publicRepos.map((repo, index) => (
                  <li key={`private-${index}`}>
                    <a
                      className="dropdown-item"
                      href="#"
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
        <div className="org">
          <h4>Organizations</h4>
          <div className="button2">
            <button
              className="btn githubbtn"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span>Github Orgs</span>
              <i className="bi bi-caret-down-fill ms-2"></i>{" "}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {publicRepos.length > 0 ? (
                orgs.map((org) => (
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      key={org.id}
                      value={org.login}
                      onClick={() => {
                        setSelectedOrg(org.login);
                      }}
                    >
                      {org.login}
                    </a>
                  </li>
                ))
              ) : (
                <li className="dropdown-item disabled">No private repos</li>
              )}
            </div>
          </div>
          <div className="button2">
            <button
              className="btn githubbtn"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span>Github Orgs repos</span>
              <i className="bi bi-caret-down-fill ms-2"></i>{" "}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {orgRepos.length > 0 ? (
                orgRepos.map((org) => (
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      key={org.id}
                      value={org.login}
                    >
                      {org.name}
                    </a>
                  </li>
                ))
              ) : (
                <li className="dropdown-item disabled">
                  No Organization repos
                </li>
              )}
            </div>
          </div>
        </div>
      </div>
      <WorkflowTable userLogin={user.login} selectedRepo={selectedRepo} />
    </div>
  );
}
