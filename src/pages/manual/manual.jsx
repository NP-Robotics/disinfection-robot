import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";

const Manual = (props) => {
  var interval,
    keydown = false;
  const [teleop_sub, setTeleop_sub] = useState(
    new ROSLIB.Topic({
      ros: props.ros,
      name: "/cmd_vel",
      serviceType: "geometry_msgs/Twist",
    })
  );
  const startTeleop = (linearX, angularZ) => {
    var teleop_msg = new ROSLIB.Message({
      linear: {
        x: linearX,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: angularZ,
      },
    });
    teleop_sub.publish(teleop_msg);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);
  }, []);

  const handleTeleopStart = (linearX, angularZ) => {
    startTeleop(linearX, angularZ);
    interval = setInterval(startTeleop.bind(null, linearX, angularZ), 400);
  };
  const handleTeleopCancel = () => {
    clearInterval(interval);
    console.log("stop");
  };
  const handleKeydown = (event) => {
    if (keydown === false) {
      keydown = true;
      if (event.key === "w") {
        interval = setInterval(startTeleop.bind(null, 0.5, 0), 400);
      } else if (event.key === "s") {
        interval = setInterval(startTeleop.bind(null, -0.5, 0), 400);
      } else if (event.key === "a") {
        interval = setInterval(startTeleop.bind(null, 0, 1), 400);
      } else if (event.key === "d") {
        interval = setInterval(startTeleop.bind(null, 0, -1), 400);
      }
    }
  };

  const handleKeyup = (event) => {
    keydown = false;
    clearInterval(interval);
  };

  return (
    <React.Fragment>
      <button
        onMouseDown={() => handleTeleopStart(0.5, 0)}
        onMouseUp={() => handleTeleopCancel()}
        className="btn btn-primary"
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Forward (W)
      </button>
      <button
        onMouseDown={() => handleTeleopStart(-0.5, 0)}
        onMouseUp={() => handleTeleopCancel()}
        className="btn btn-primary"
        style={{
          position: "absolute",
          left: "50%",
          top: "60%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Backward (S)
      </button>
      <button
        onMouseDown={() => handleTeleopStart(0, 1)}
        onMouseUp={() => handleTeleopCancel()}
        className="btn btn-primary"
        style={{
          position: "absolute",
          left: "40%",
          top: "45%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Left (A)
      </button>
      <button
        onMouseDown={() => handleTeleopStart(0, -1)}
        onMouseUp={() => handleTeleopCancel()}
        className="btn btn-primary"
        style={{
          position: "absolute",
          left: "60%",
          top: "45%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Right (D)
      </button>
      <button
        onMouseDown={() => handleTeleopStart(0, 0)}
        onMouseUp={() => handleTeleopCancel()}
        className="btn btn-primary"
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Stop
      </button>
    </React.Fragment>
  );
};

export default Manual;
