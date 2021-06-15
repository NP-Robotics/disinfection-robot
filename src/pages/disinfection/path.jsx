import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";

async function readPaths() {
  return fetch("http://127.0.0.1:8080/path/read", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
}

async function writePaths(object) {
  return fetch("http://127.0.0.1:8080/path/write", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  }).then((data) => data.json());
}

const Path = (props) => {
  const [paths, setPath] = useState([]);

  const [waypoint_list, setWaypoint_list] = useState([]);
  const [path_list, setPath_list] = useState([]);

  const [waypoints_srv, setWaypoints_srv] = useState(
    new ROSLIB.Service({
      ros: props.ros,
      name: "/web_service/retrieve_all_location",
      serviceType: "waypoint_msgs/WaypointsList",
    })
  );

  useEffect(() => {
    var request = new ROSLIB.ServiceRequest({
      data: true,
    });
    waypoints_srv.callService(request, function (result) {
      setWaypoint_list(result.ID);
    });
    async function fetchData() {
      setPath_list(Object.entries(await readPaths()));
    }
    fetchData();
  }, []);

  const handleAddwaypoint = () => {
    const waypoint = document.getElementById("waypointlist").value;
    let pausetime = document.getElementById("pausetime").value;
    if (pausetime === "") {
      pausetime = 0;
    }
    console.log(waypoint);
    let data = [...paths];
    let temp = {
      location: waypoint,
      task: pausetime,
    };
    data.push(temp);
    console.log(data);
    setPath(data);
  };
  const handleRevert = () => {
    let data = [...paths];
    data.pop();
    setPath(data);
  };
  const handleCreate = async (err) => {
    const pathname = document.getElementById("pathname").value;
    if (pathname !== "") {
      let data = await readPaths();
      data[pathname] = paths;
      let token = await writePaths(data);
      alert("Added New Path Successfully");
      setPath_list(Object.entries(await readPaths()));
    }
  };
  const handleDelete = async (err) => {
    const pathname = document.getElementById("pathnamelist").value;
    let data = await readPaths();
    delete data[pathname];
    let token = await writePaths(data);
    setPath_list(Object.entries(await readPaths()));
  };

  return (
    <React.Fragment>
      <div
        className="badge border border-dark"
        style={{
          position: "absolute",
          left: "50%",
          top: "20%",
          transform: "translate(-50%, -0%)",
        }}
      >
        <h6>
          List of Waypoints:{" "}
          <select id="waypointlist">
            {waypoint_list.map((waypoint) => (
              <option key={waypoint.name} value={waypoint.name}>
                {waypoint.name}
              </option>
            ))}
          </select>{" "}
          <label>Pause Time(sec): </label>
          <input id="pausetime" defaultValue="0" />
          <button
            onClick={() => handleAddwaypoint()}
            className="btn btn-primary btn-sm m-2"
          >
            Add to Path
          </button>
          <button
            onClick={() => handleRevert()}
            className="btn btn-primary btn-sm m-2"
          >
            Revert Once
          </button>
          <br></br>
          <div>
            <h4>Path: </h4>
            <ul className="list-group list-group-vertical">
              {paths.map((path, index) => (
                <div key={index}>
                  <li className="list-group-item list-group-item-success">
                    {path.location} {path.task}s
                  </li>
                </div>
              ))}
            </ul>
            <br></br>
            <div>
              <label>Path Name: </label>
              <input id="pathname" />
              <button
                onClick={() => handleCreate()}
                className="btn btn-primary btn-sm m-2"
              >
                Create Path
              </button>
            </div>
          </div>
          <div>
            List of Paths:{" "}
            <select id="pathnamelist">
              {path_list.map((pathname, index) => (
                <option key={index} value={pathname[0]}>
                  {pathname[0]}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleDelete()}
              className="btn btn-danger btn-sm m-2"
            >
              Delete Path
            </button>
          </div>
        </h6>
      </div>
    </React.Fragment>
  );
};

export default Path;
