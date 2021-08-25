import React, { useEffect, useState, useRef } from "react";
import "./dashboard.css";
import Waypointfinder from "../waypointfinder/waypointfinder";
import Voice from "./voice_near.mp3";
import ROSLIB from "roslib";
import { BsPeopleCircle } from "react-icons/bs";
import maskReminder from "./voice_mask.mp3";
//const fs = require("fs");
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

async function readLocation() {
  return fetch(`http://${ipAddress}:8080/robotlocation/read`, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  }).then((data) => data.json());
}

async function readCounter() {
  return fetch(`http://${ipAddress}:5000/counter`, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  }).then((data) => data.json());
}

const Dashboard = (props) => {
  const [depth, setDepth] = useState([300]);
  const [depth_trigger1, setDepth_trigger1] = useState(false);
  const [depth_trigger2, setDepth_trigger2] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [status_waypoint, setStatus_waypoint] = useState("");
  const [path_start, setPath_start] = useState(false);
  const [path, setPath] = useState([]);
  const [left, setLeft] = useState("");
  const [top, setTop] = useState("");
  const [count, setCount] = useState()
  const [start_count1, setStart_count1] = useState(false)
  const [start_count2, setStart_count2] = useState(false)
  const [waypoint_sub] = useState(
    new ROSLIB.Topic({
      ros: props.ros,
      name: "/web_service/current_waypoint",
      messageType: "std_msgs/String",
    })
  );
  const [path_srv] = useState(
    new ROSLIB.Service({
      ros: props.ros,
      name: "/web_service/waypoint_sequence",
      serviceType: "waypoint_msgs/WaypointSequence",
    })
  );
  const [list_srv] = useState(
    new ROSLIB.Service({
      ros: props.ros,
      name: "/web_service_2/retrieve_all_location",
      serviceType: "waypoint_msgs/WaypointsList",
    })
  );
  const [cancel_srv] = useState(
    new ROSLIB.Service({
      ros: props.ros,
      name: "/web_service/stop_path",
      serviceType: "std_srvs/Empty",
    })
  );
  const intervalID = useRef();
  const patrolAudio = useRef(new Audio(Voice));
  const maskAudio = useRef(new Audio(maskReminder));

  useEffect(() => {
    waypoint_sub.subscribe(async function (message) {
      setStatus_waypoint(message.data);
      var locations = await readLocation();
      try {
        setLeft(locations[message.data].left);
        setTop(locations[message.data].top);
      } catch (e) {
        console.log("No such current location");
      }
    });

    async function fetchData() {
      setDepth(await readDepth());
      setCount((await readCounter()).count)
    }

    intervalID.current = setInterval(async () => {
      fetchData();
    }, 1900);

    return () => {
      clearInterval(intervalID.current);
      waypoint_sub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    var smallest_depth = depth[0];
    for (var i = 0; i <= depth.length; i++) {
      if (depth[i] < smallest_depth) {
        smallest_depth = depth[i];
      }
    }
    if (smallest_depth <= 90) {
      setDepth_trigger1(false);
      setDepth_trigger2(false);
      if (!enabled) {
        patrolAudio.current.load();
        patrolAudio.current.play();
        setEnabled(true);
        if (path_start) {
          console.log("stop");
          var request = new ROSLIB.ServiceRequest({});
          cancel_srv.callService(request, function (result) {});
          var temp = [],
            located = false,
            j = 1;
          for (var i = 0; i < path.length; i++) {
            if (located) {
              temp.splice(j, 0, path[i]);
              j++;
            }
            if (path[i].location !== status_waypoint && !located) {
              temp.push(path[i]);
            } else if (path[i].location === status_waypoint && !located) {
              located = true;
              temp.unshift(path[i]);
            }
          }
          setPath(temp);
        }
      }
    } else if (smallest_depth > 90) {
      var temp = false;
      if (!depth_trigger1) {
        setDepth_trigger1(true);
      } else if (!depth_trigger2) {
        setDepth_trigger2(true);
        temp = true;
      }

      if (depth_trigger2 || temp) {
        if (path_start && enabled) {
          console.log("start");
          var request = new ROSLIB.ServiceRequest({
            sequence: path,
            loop: true,
            disinfection: false,
          });
          path_srv.callService(request, function (result) {});
        }
        setEnabled(false);
      }
    }
  }, [depth]);

  useEffect(() => {
    console.log(start_count2)
    if (start_count2) {
        maskAudio.current.load();
        maskAudio.current.play();
    }
    if(start_count1){
      setStart_count2(true)
    }
    setStart_count1(true);
  }, [count]);

  const handleStart = () => {
    var request = new ROSLIB.ServiceRequest({
      data: true,
    });
    list_srv.callService(request, function (result) {
      var temp = [];
      for (var i = 0; i < result.ID.length; i++) {
        var data = {
          location: result.ID[i].name,
          task: "0",
        };
        temp.push(data);
      }
      setPath(temp);
      var request = new ROSLIB.ServiceRequest({
        sequence: temp,
        loop: true,
        disinfection: false,
      });
      path_srv.callService(request, function (result) {});
      setPath_start(true);
    });
  };

  const handleStop = async () => {
    var request = new ROSLIB.ServiceRequest({});
    cancel_srv.callService(request, function (result) {
      setPath_start(false);
    });
  };

  return (
    <div className="dashboard">
      <React.Fragment>
          <div>
            <iframe
              src={`http://${ipAddress}:5000/camera`}
              style={{width: "0px", height: "0px"}}
            />
          </div>
          <div>
          <button
            onClick={() => handleStart()}
            className="btn btn-success btn-lg m-2"
          >
            Start Patrol
          </button>
          <button
            onClick={() => handleStop()}
            className="btn btn-danger btn-lg m-2"
          >
            Stop Patrol
          </button>
          <span className="d-inline p-2 bg-warning text-black rounded">
            Number of improperly masked people today: {count}
          </span>
          <div className="waypoint-finder">
            <Waypointfinder ros={props.ros} />
            <div
              style={{
                position: "relative",
                left: left,
                top: top,
              }}
            >
              <BsPeopleCircle size="100px" color="blue" />
              <span className="d-inline p-2 bg-info text-white rounded">
                You are here
              </span>
            </div>
          </div>
        </div>
        <h1>{depth}</h1>
      </React.Fragment>
    </div>
  );
};

export default Dashboard;
