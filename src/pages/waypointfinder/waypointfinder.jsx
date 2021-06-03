import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";

async function readWaypoints() {
  return fetch("http://127.0.0.1:8080/waypoint/read", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
}

const Waypointfinder = (props) => {
  const [waypoints, setWaypoints] = useState([["", {}]]);
  const [current_go, setCurrent_go] = useState("Room 1");
  const [goal_pub, setGoal_pub] = useState(
    new ROSLIB.Topic({
      ros: props.ros,
      name: "/waypoints",
      serviceType: "waypoint_msgs/PathTaskArray",
    })
  );
  const [cancel_srv, setCancel_srv] = useState(
    new ROSLIB.Service({
      ros: props.ros,
      name: "/web_service/stop_path",
      serviceType: "std_srvs/Empty",
    })
  );

  useEffect(() => {
    async function fetchData() {
      setWaypoints(Object.entries(await readWaypoints()));
    }
    fetchData();
  }, []);

  const handleOption = (waypoint) => {
    setCurrent_go(waypoint);
  };
  const handleGo = () => {
    const waypoint = JSON.parse(
      document.getElementById("waypointlist").value
    )[1];
    const name = JSON.parse(document.getElementById("waypointlist").value)[0];
    var goal = new ROSLIB.Message({
      poses: [
        {
          location: name,
          pose: {
            position: {
              x: parseFloat(waypoint.x),
              y: parseFloat(waypoint.y),
              z: 0.0,
            },
            orientation: {
              x: 0.0,
              y: 0.0,
              z: parseFloat(waypoint.z),
              w: parseFloat(waypoint.w),
            },
          },
          task: "0",
        },
      ],
      loop: false,
    });
    goal_pub.publish(goal);
  };

  const handleStop = () => {
    var request = new ROSLIB.ServiceRequest({});
    cancel_srv.callService(request, function (result) {});
  };

  return (
    <React.Fragment>
      <select id="waypointlist">
        {waypoints.map((waypoint, index) => (
          <option
            key={index}
            value={JSON.stringify(waypoint)}
            onClick={() => handleOption(waypoint[0])}
          >
            {waypoint[0]}
          </option>
        ))}
      </select>
      <button onClick={() => handleGo()} className="btn btn-success btn-sm m-2">
        Escort To {current_go}
      </button>
      <button
        onClick={() => handleStop()}
        className="btn btn-danger btn-sm m-2"
      >
        Stop Escort
      </button>
    </React.Fragment>
  );
};

export default Waypointfinder;
