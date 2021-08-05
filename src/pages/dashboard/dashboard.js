import React, { useEffect, useState} from "react";
import "./dashboard.css";
import Waypointfinder from "../waypointfinder/waypointfinder";
import Voice from "./voiceNEAR.mp3";
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
  const [depth_trigger1, setDepth_trigger1] = useState(false)
  const [depth_trigger2, setDepth_trigger2] = useState(false)
  const [enabled, setEnabled] = useState(false)
  var intervalID = 0

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

  useEffect(() => {
    var smallest_depth= depth[0];
    for (var i=0; i<=depth.length;i++){
      if (depth[i]<smallest_depth) {
        var smallest_depth=depth[i];
      }
    }

    if (smallest_depth <= 70){
      if (!depth_trigger1){
        setDepth_trigger1(true)
      }
      else if(!depth_trigger2){
        setDepth_trigger2(true)
      }
    }
    else if(smallest_depth>70){
      setDepth_trigger1(false)
      setDepth_trigger2(false)
      setEnabled(false)
    }
    console.log(depth_trigger2)
    if(depth_trigger2 && !enabled){
      console.log("hey")
      let audio = new Audio(Voice);
      audio.load();
      audio.play();
      setEnabled(true)
    }
  }, [depth])

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
