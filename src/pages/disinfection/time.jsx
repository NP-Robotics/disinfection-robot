import React, { useEffect, useState} from "react";
import { useHistory } from "react-router-dom";

import "../../components/GlobalVariables";
const ipAddress = global.ipAddress;

async function writeTime(object) {
  return fetch(`http://${ipAddress}:8080/timing/write`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  }).then((data) => data.json());
}

async function readPaths() {
  return fetch(`http://${ipAddress}:8080/path/read`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
}

const Time = () => {
  const [path_list, setPath_list] = useState([]);
  const [path_index, setPath_index] = useState(0);

  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      setPath_list(Object.entries(await readPaths()));
    }
    fetchData();

    return () => {};
  }, []);

  const handleCreate = async (err) => {
    const timevalue = document.getElementById("timevalue").value;
    const minutevalue = document.getElementById("minutevalue").value;
    if (timevalue !== "" && minutevalue != "") {
      const data = {
        time: timevalue,
        minute: minutevalue,
        pathindex: path_index  
      };
      await writeTime(data);
      alert("Updated Time for Disinfection");
      history.push("/disinfection");
    }
  };

  const handlePathIndex = (e) => {
    setPath_index(e.target.value)
  };

  return (
    <React.Fragment>
      <label>Auto Disinfection Time: </label>
      <input id="timevalue" />
      <label>::</label>
      <input id="minutevalue" />
      <select value={path_index} onChange={handlePathIndex} style={{fontSize:"22px"}}>
        {path_list.map((pathname, index) => (
          <option key={index} value={index}>
            {pathname[0]}
          </option>
        ))}
      </select>
      <button
        onClick={() => handleCreate()}
        className="btn btn-primary btn-sm m-2"
      >
        Update Time
      </button>
    </React.Fragment>
  );
};

export default Time;
