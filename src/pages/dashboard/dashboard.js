import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Waypointfinder from "../waypointfinder/waypointfinder"
import { propTypes } from "react-bootstrap/esm/Image";

const Dashboard = (props) => {
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
          {/*
          <Recorder />
          <Chatbot />
          */}
          <Waypointfinder ros={props.ros}/>
        </div>
      </React.Fragment>
    </div>
  );
};

export default Dashboard;
