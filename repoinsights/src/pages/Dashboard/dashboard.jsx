import React from "react";
import "../Dashboard/dashboard.css";
import "bootstrap";
import "bootstrap/js/dist/dropdown.js";
import DropdownButtons from "../../components/Dropdownbutton/dropdownbuttons";

export default function Dashboard() {
  return (
    <div className="container-fluid">
      <div className="container-fluid  " id="datacontainer">
        <h4>GitHub Repository Dashboard</h4>
        <DropdownButtons />
      </div>
    </div>
  );
}
