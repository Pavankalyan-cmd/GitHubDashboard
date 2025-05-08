import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import LogViewer from "../logviewer/logsviwer";

export default function WorkflowTable({ userLogin, selectedRepo }) {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [runId, setRunId] = useState(0);
  const [workflowId, setWorkflowId] = useState(0);

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    if (!userLogin || !selectedRepo || !token) return;

    setLoading(true);
    axios
      .get(
        `http://localhost:8000/api/repo-workflow/${userLogin}/${selectedRepo}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setWorkflows(res.data.workflows || []);
        toast.success("Workflows fetched successfully");
      })
      .catch((err) => {
        toast.error("Error fetching workflows");
        console.error("Failed to load workflows", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userLogin, selectedRepo, token]);

  const triggerWorkflow = (workflowId) => {
    axios
      .post(
        `http://localhost:8000/api/workflows/${userLogin}/${selectedRepo}/${workflowId}/trigger/`,
        { ref: "main" },
        {
          headers: {
            Authorization: `token ${token}`, // Ensure this token is valid
            Accept: "application/json", // Ensure this header is set
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success("Workflow triggered successfully");
        console.log(res.data);
      })
      .catch((err) => {
        toast.error("Error triggering workflow");
        console.error("Error details:", err.response ? err.response.data : err);
        console.log("Workflow ID:", workflowId);
      });
    axios
      .get(
        `http://localhost:8000/api/workflowruns/${userLogin}/${selectedRepo}/${workflowId}/runs/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        const runId = res.data.workflow_runs[0].id; // latest run
        console.log("Run ID:", runId);
        console.log(res.data);
        setRunId(runId);
      });
    setWorkflowId(workflowId);
  };

  return (
    <div className="container-fluid tabledata">
      {console.log(userLogin, selectedRepo)}
      {loading ? (
        <p>loading....</p>
      ) : (
        <table className="table tablelayout ">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Workflow</th>
              <th scope="col">Status</th>
              <th scope="col">Last Run</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((workflow, index) => (
              <tr key={workflow.id}>
                <td>{index + 1}</td>
                <td>{workflow.name}</td>
                <td>{workflow.state}</td>
                <td>
                  {new Intl.DateTimeFormat("en-CA").format(
                    new Date(workflow.updated_at)
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      triggerWorkflow(workflow.id);
                    }}
                  >
                    {" "}
                    Trigger
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <LogViewer
        userLogin={userLogin}
        selectedRepo={selectedRepo}
        workflowId={workflowId}
        runId={runId}
        token={token}
      />
    </div>
  );
}
