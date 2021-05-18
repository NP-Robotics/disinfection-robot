import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Chatbot from "../chatbot/chatbot";
<<<<<<< HEAD
import Recorder from "../chatbot/recorder";
=======
import Header from "../header/header";
>>>>>>> 310ec4d26bf82d1f7e1cebf4268ce54672b5cffa

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
