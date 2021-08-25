import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";

const ipAddress = global.ipAddress;

async function writeOffset(object) {
  return fetch(`http://${ipAddress}:8080/offset/write`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  }).then((data) => data.json());
}

async function readOffset() {
  return fetch(`http://${ipAddress}:8080/offset/read`, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  }).then((data) => data.json());
}

const Manual = (props) => {
  var interval,
    keydown = false;
  const [Offset, setOffset] = useState();

  const [UVbig, setUVbig] = useState("UV Big Off");
  const [UVbig_bool, setUVbig_bool] = useState(false);

  const [UVsmall, setUVsmall] = useState("UV Small Off");
  const [UVsmall_bool, setUVsmall_bool] = useState(false);

  const [mist, setMist] = useState("Mist Off");
  const [mist_bool, setMist_bool] = useState(false);

  const [fan, setFan] = useState("Fan Off");
  const [fan_bool, setFan_bool] = useState(false);

  const [teleop_pub] = useState(
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
    teleop_pub.publish(teleop_msg);
  };

  useEffect(() => {
    async function fetchData() {
      setOffset((await readOffset()).offset)
    }
    fetchData()

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
        interval = setInterval(startTeleop.bind(null, 0.1, 0), 400);
      } else if (event.key === "s") {
        interval = setInterval(startTeleop.bind(null, -0.1, 0), 400);
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

  const handleUVbig = () => {
    if (UVbig_bool) {
      var off = new ROSLIB.Message({
        data: false,
      });
      UVbig_pub.publish(off);
      setUVbig_bool(false);
      setUVbig("UV Big Off");
    } else {
      var on = new ROSLIB.Message({
        data: true,
      });
      UVbig_pub.publish(on);
      setUVbig_bool(true);
      setUVbig("UV Big On");
    }
  };

  const handleUVsmall = () => {
    if (UVsmall_bool) {
      var off = new ROSLIB.Message({
        data: false,
      });
      UVsmall_pub.publish(off);
      setUVsmall_bool(false);
      setUVsmall("UV Small Off");
    } else {
      var on = new ROSLIB.Message({
        data: true,
      });
      UVsmall_pub.publish(on);
      setUVsmall_bool(true);
      setUVsmall("UV Small On");
    }
  };

  const handleMist = () => {
    if (mist_bool) {
      var off = new ROSLIB.Message({
        data: false,
      });
      mist_pub.publish(off);
      setMist_bool(false);
      setMist("Mist Off");
    } else {
      var on = new ROSLIB.Message({
        data: true,
      });
      mist_pub.publish(on);
      setMist_bool(true);
      setMist("Mist On");
    }
  };

  const handleFan = () => {
    if (fan_bool) {
      var off = new ROSLIB.Message({
        data: false,
      });
      fan_pub.publish(off);
      setFan_bool(false);
      setFan("Fan Off");
    } else {
      var on = new ROSLIB.Message({
        data: true,
      });
      fan_pub.publish(on);
      setFan_bool(true);
      setFan("Fan On");
    }
  };

  const handleOffset = async (err) => {
    const offsetvalue = document.getElementById("offsetvalue").value;
    if (offsetvalue !== "") {
      const data = {
        offset: parseFloat(offsetvalue)
      };
      await writeOffset(data);
      setOffset((await readOffset()).offset)
      alert("Updated Temperature Offset");
    }
  };

  const buttonColour = (status) => {
    if (status) {
      return "btn btn-warning btn-lg";
    } else {
      return "btn btn-secondary btn-lg";
    }
  };

  return (
    <React.Fragment>
      <button
        onMouseDown={() => handleTeleopStart(0.1, 0)}
        onMouseUp={() => handleTeleopCancel()}
        className="btn btn-primary btn-lg"
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
        onMouseDown={() => handleTeleopStart(-0.1, 0)}
        onMouseUp={() => handleTeleopCancel()}
        className="btn btn-primary btn-lg"
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
        onMouseDown={() => handleTeleopStart(0, 0.5)}
        onMouseUp={() => handleTeleopCancel()}
        className="btn btn-primary btn-lg"
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
        onMouseDown={() => handleTeleopStart(0, -0.5)}
        onMouseUp={() => handleTeleopCancel()}
        className="btn btn-primary btn-lg"
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
        className="btn btn-primary btn-lg"
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Stop
      </button>
      <button onClick={() => handleExtend()} className="btn btn-primary btn-lg">Extend</button>
      <button onClick={() => handleRetract()} className="btn btn-primary btn-lg">Retract</button>
      <button
        className={buttonColour(UVbig_bool)}
        onClick={() => handleUVbig()}
      >
        {UVbig}
      </button>
      <button
        className={buttonColour(UVsmall_bool)}
        onClick={() => handleUVsmall()}
      >
        {UVsmall}
      </button>
      <button className={buttonColour(mist_bool)} onClick={() => handleMist()}>
        {mist}
      </button>
      <button className={buttonColour(fan_bool)} onClick={() => handleFan()}>
        {fan}
      </button>
      <label>Temperature Offset: </label>
      <input id="offsetvalue" />
      <button
        onClick={() => handleOffset()}
        className="btn btn-primary btn-sm m-2"
      >
        Update Offset
      </button>
      <label>Current Offset: {Offset}</label>
    </React.Fragment>
  );
};

export default Manual;
