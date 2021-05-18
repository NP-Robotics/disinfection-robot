import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Chatbot from "../chatbot/chatbot";
import Recorder from "../chatbot/recorder";
import Header from "../header/header";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <React.Fragment>
        <Link to="/disinfection">
          <button className="btn btn-primary btn-sm m-2">
            Disinfection Mode
          </button>
        </Link>
        <Link to="/camera">
          <button className="btn btn-warning btn-sm m-2">Camera Mode</button>
        </Link>
        <div>
          <Recorder />
          <Chatbot />
        </div>
      </React.Fragment>
    </div>
  );
};

export default Dashboard;
