import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Callbackk() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    console.log("OAuth Code:", code);

    if (!code) {
      toast.error("GitHub OAuth code not found in URL.");
      return;
    }

    axios
      .post("http://localhost:8000/api/github-auth/", { code })
      .then((res) => {
        localStorage.setItem("token", res.data.access_token || res.data.token);
        toast.success("Token exchanged successfully");
        navigate("/dashboard");
      })
      .catch((err) => {
        toast.error("Token exchange failed");
        console.error(err);
      });
  }, [navigate]);

  return <h1>Processing GitHub Login...</h1>;
}
