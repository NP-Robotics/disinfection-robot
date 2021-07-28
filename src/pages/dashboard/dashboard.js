import React, { useEffect, useState} from "react";
import "./dashboard.css";
import Waypointfinder from "../waypointfinder/waypointfinder";
//import { propTypes } from "react-bootstrap/esm/Image";
const ipAddress = global.ipAddress;

async function readDepth() {
  return fetch(`http://${ipAddress}:5000/depth`, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  }).then((data) => data.json());
}

const Dashboard = (props) => {
  const [depth, setDepth] = useState([300]);
  var intervalID = 0;

  useEffect(() => {
    async function fetchData() {
      setDepth(await readDepth());
    }

    intervalID = setInterval(async () => {
      fetchData();
    }, 2000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  return (
    <div className="dashboard">
      <React.Fragment>
        <div>
          <div className="waypoint-finder">
            <Waypointfinder ros={props.ros} />
          </div>
        </div>
        <h1>{depth}</h1>
      </React.Fragment>
    </div>
  );
};

export default Dashboard;
