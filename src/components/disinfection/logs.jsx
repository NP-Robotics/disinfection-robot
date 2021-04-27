import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";

async function readLocation() {
  return fetch("http://localhost:8080/data/read", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
}

async function writeLocation(object) {
  return fetch("http://localhost:8080/data/write", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  }).then((data) => data.json());
}

const Logs = (props) => {
  const initialize_location_log = async (e) => {
    const data = await readLocation();
    //console.log(JSON.stringify(data));
    return Object.entries(data);
  };
  const get_date = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    return dd + "/" + mm + "/" + yyyy;
  };

  const [uv_off_sub, setUv_off_sub] = useState(
    new ROSLIB.Topic({
      ros: props.ros,
      name: "/web_service/current_uv_off_waypoint",
      messageType: "std_msgs/String",
    })
  );

  const [location_log, setLocation_log] = useState([["", []]]);

  useEffect(() => {
    uv_off_sub.subscribe(async function (message) {
      let data = await readLocation();
      console.log(data);
      let date = get_date();
      if (!data[date]) {
        data[date] = [];
      }
      data[date].push({ location: message.data });
      console.log(data[date]);
      let token = await writeLocation(data);
      setLocation_log(await initialize_location_log());
      //console.log(await readLocation());
    });
  }, []);

  useEffect(async () => {
    setLocation_log(await initialize_location_log());
  }, []);

  const handleRefresh = async (e) => {
    setLocation_log(await initialize_location_log());
  };

  const handleDelete = async (e) => {
    let data = await readLocation();
    delete data[e];
    let token = await writeLocation(data);
    setLocation_log(await initialize_location_log());
    //console.log(await readLocation());
  };

  return (
    <React.Fragment>
      <div>
        <h1 className="badge badge-primary">Waypoint Log when UV disabled</h1>
        <button onClick={handleRefresh} className="btn btn-primary btn-sm m-2">
          Refresh
        </button>
        {location_log
          .slice(0)
          .reverse()
          .map((log) => (
            <div>
              <h1 className="badge badge-success">Date: {log[0]}</h1>
              {log[1].map((location) => (
                <span className="badge badge-danger">{location.location}</span>
              ))}
              <button
                onClick={() => handleDelete(log[0])}
                className="btn btn-primary btn-sm m-2"
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </React.Fragment>
  );
};

export default Logs;
