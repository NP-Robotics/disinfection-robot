import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./camera.css";
import axios from "axios";

const Camera = () => {
  const [initialised, setInitialised] = useState(false);
  const [stream, getStream] = useState();

  useEffect(() => {
    axios.get("http://localhost:5000/camera").then((response) => {
      console.log("Success");
    });
  });

  return (
    <div>
      <Link to="/">
        <button className="btn btn-secondary btn-sm m-2">
          Back to Dashboard
        </button>
      </Link>
      <button className="btn btn-primary btn-sm m-2">Start</button>
      <button className="btn btn-danger btn-sm m-2">Stop</button>
      <h1>Test camera page jsx</h1>
      <iframe
        src={"http://localhost:5000/camera"}
        allow="accelerometer, autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
export default Camera;
