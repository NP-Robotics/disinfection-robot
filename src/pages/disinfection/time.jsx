import React, { useEffect, useState } from "react";
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

const Time = () => {
  const history = useHistory();

  const handleCreate = async (err) => {
    const timevalue = document.getElementById("timevalue").value;
    if (timevalue !== "") {
      const data = {
        time: timevalue,
      };
      let token = await writeTime(data);
      alert("Updated Time for Disinfection");
      history.push("/disinfection");
    }
  };

  return (
    <React.Fragment>
      <label>Auto Disinfection Time: </label>
      <input id="timevalue" />
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
