import React from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import "./camera.css";

export default class Camera extends React.Component {
  render() {
    return (
      <div>
        <ReactPlayer url="http://localhost:5000/camera" />
        <div className="video-wrapper">
          <iframe
            src={"http://localhost:5000/camera"}
            frameborder="0"
            allow=" autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="stream"
          />
        </div>
      </div>
    );
  }
}

/*
<button className="btn btn-primary btn-sm m-2">Start</button>
        <button className="btn btn-danger btn-sm m-2">Stop</button>
        <h1>Stream:</h1>
        <iframe
          src={"http://localhost:5000/camera"}
          allow="accelerometer, autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
*/
