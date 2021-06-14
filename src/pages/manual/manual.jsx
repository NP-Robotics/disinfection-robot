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
  const [motor_pub] = useState(
    new ROSLIB.Topic({
      ros: props.ros,
      name: "/MotorActivate",
      messageType: "std_msgs/String",
    })
  );
  const [UVbig_pub] = useState(
    new ROSLIB.Topic({
      ros: props.ros,
      name: "/BigUVActivate",
      messageType: "std_msgs/Bool",
    })
  );
  const [UVsmall_pub] = useState(
    new ROSLIB.Topic({
      ros: props.ros,
      name: "/SmallUVActivate",
      messageType: "std_msgs/Bool",
    })
  );
  const [mist_pub] = useState(
    new ROSLIB.Topic({
      ros: props.ros,
      name: "/MistActivate",
      messageType: "std_msgs/Bool",
    })
  );
  const [fan_pub] = useState(
    new ROSLIB.Topic({
      ros: props.ros,
      name: "/FanActivate",
      messageType: "std_msgs/Bool",
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

  const handleExtend = () => {
    var extend = new ROSLIB.Message({
      data: "extendonly",
    });
    motor_pub.publish(extend);
  };
  const handleRetract = () => {
    var retract = new ROSLIB.Message({
      data: "retractonly",
    });
    motor_pub.publish(retract);
  };

  const handleUVbigon = () => {
    var on = new ROSLIB.Message({
      data: true,
    });
    UVbig_pub.publish(on);
  };
  const handleUVbigoff = () => {
    var off = new ROSLIB.Message({
      data: false,
    });
    UVbig_pub.publish(off);
  };
  const handleUVsmallon = () => {
    var on = new ROSLIB.Message({
      data: true,
    });
    UVsmall_pub.publish(on);
  };
  const handleUVsmalloff = () => {
    var off = new ROSLIB.Message({
      data: false,
    });
    UVsmall_pub.publish(off);
  };

  const handleMiston = () => {
    var on = new ROSLIB.Message({
      data: true,
    });
    mist_pub.publish(on);
  };

  const handleMistoff = () => {
    var off = new ROSLIB.Message({
      data: false,
    });
    mist_pub.publish(off);
  };

  const handleFanon = () => {
    var on = new ROSLIB.Message({
      data: true,
    });
    fan_pub.publish(on);
  };

  const handleFanoff = () => {
    var off = new ROSLIB.Message({
      data: false,
    });
    fan_pub.publish(off);
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
      <button onClick={() => handleExtend()}>Extend</button>
      <button onClick={() => handleRetract()}>Retract</button>
      <button onClick={() => handleUVbigon()}>UV Big On</button>
      <button onClick={() => handleUVbigoff()}>UV Big Off</button>
      <button onClick={() => handleUVsmallon()}>UV Small On</button>
      <button onClick={() => handleUVsmalloff()}>UV Small Off</button>
      <button onClick={() => handleMiston()}>Mist On</button>
      <button onClick={() => handleMistoff()}>Mist Off</button>
      <button onClick={() => handleFanon()}>Fan On</button>
      <button onClick={() => handleFanoff()}>Fan Off</button>
    </React.Fragment>
  );
};

export default Manual;
