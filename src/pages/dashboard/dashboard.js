import React from "react";
import "./dashboard.css";
import Waypointfinder from "../waypointfinder/waypointfinder";
//import { propTypes } from "react-bootstrap/esm/Image";

const Dashboard = (props) => {
  return (
    <div className="dashboard">
      <React.Fragment>
        <div>
          {/*
          <Recorder />
          <Chatbot />
          */}
          <div className="waypoint-finder">
            <Waypointfinder ros={props.ros} />
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default Dashboard;
