import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LogViewer = ({ userLogin, selectedRepo, runId, token }) => {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!runId) return;

    const interval = setInterval(() => {
      axios
        .get(
          `http://localhost:8000/api/workflowlogs/${userLogin}/${selectedRepo}/${runId}/`,
          {
            headers: {
              Authorization: `token ${token}`,
            },
          }
        )
        .then((res) => {
          setLogs(res.data.logs);
          setLoading(false);
          toast.success("fecthing logs successfully");
        })
        .catch((err) => {
          console.error("Error fetching logs", err);
          clearInterval(interval);
          toast.error(err);
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [runId]);

  return (
    <div className="logviewer">
      {loading ? (
        "logs..."
      ) : (
        <div>
          {Object.entries(logs).map(([jobName, logText]) => (
            <div key={jobName}>
              <h4>{jobName}</h4>
              <pre>{logText}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogViewer;
