import React, { Component } from "react";
import ROSLIB from "roslib";
import { Link } from "react-router-dom";
import "./disinfection.css";
import Logs from "./logs";

async function readPaths() {
  return fetch("http://localhost:8080/path/read", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
}

class Disinfection extends Component {
  state = {
    dynamixel_pub: "",
    motor_pub: "",
    motor_sub: "",
    waypoint_sub: "",
    path_srv: "",
    cancel_srv: "",
    status: "",
    status_waypoint: "None",
    path_list: [],
  };

  constructor(props) {
    super(props);

    this.state.dynamixel_pub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/set_position",
      messageType: "dynamixel_sdk_examples/SetPosition",
    });
    this.state.motor_pub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/MotorActivate",
      messageType: "std_msgs/Bool",
    });
    this.state.motor_sub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/MotorStatus",
      messageType: "std_msgs/String",
    });
    this.state.waypoint_sub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/web_service/current_waypoint",
      messageType: "std_msgs/String",
    });
    this.state.path_srv = new ROSLIB.Service({
      ros: this.props.ros,
      name: "/web_service/waypoint_sequence",
      serviceType: "waypoint_msgs/WaypointSequence",
    });
    this.state.cancel_srv = new ROSLIB.Service({
      ros: this.props.ros,
      name: "/web_service/stop_path",
      serviceType: "std_srvs/Empty",
    });
  }

  async componentDidMount() {
    this.state.waypoint_sub.subscribe(
      function (message) {
        //console.log(message.data);
        this.state.status_waypoint = message.data;
        //console.log(this.state.status_waypoint);
        this.setState({ state: this.state });
      }.bind(this)
    );

    this.state.motor_sub.subscribe(
      function (message) {
        this.state.status = message.data;
        this.setState({ state: this.state });
      }.bind(this)
    );
    this.state.path_list = Object.entries(await readPaths());
    this.setState({ state: this.state });
  }

  handleStart = () => {
    /*
        const data = [
            {data: "data"},
            {cool: "hey", hi: ["hi"]}
        ]
        console.log(JSON.stringify(data))*/
    this.startExtend();
    this.startPath();
    var dynamixel_position = new ROSLIB.Message({
      id: 1,
      position: 16368,
    });
    this.state.dynamixel_pub.publish(dynamixel_position);
  };

  handleStop = () => {
    //console.log(this.state.location_log)
    //console.log(Object.keys(this.state.location_log).length)
    this.startRetract();
    this.stopPath();
    var dynamixel_position = new ROSLIB.Message({
      id: 1,
      position: 0,
    });
    this.state.dynamixel_pub.publish(dynamixel_position);
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <Link to="/">
            <button className="btn btn-primary btn-sm m-2">
              Back to Dashboard
            </button>
          </Link>
          <Link to="/disinfection/admin">
            <button className="btn btn-primary btn-sm m-2">
              Disinfection Admin Mode
            </button>
          </Link>
        </div>
        Choose Paths:{" "}
        <select id="pathnamelist">
          {this.state.path_list.map((pathname, index) => (
            <option key={index} value={index}>
              {pathname[0]}
            </option>
          ))}
        </select>
        <button
          onClick={() => this.handleStart()}
          className="btn btn-primary btn-sm m-2"
        >
          Start Disinfection Mode
        </button>
        <button
          onClick={() => this.handleStop()}
          className="btn btn-danger btn-sm m-2"
        >
          Stop Disinfection Mode
        </button>
        <span className={this.textColour()}>
          Current Waypoint: {this.state.status_waypoint}
        </span>
        <br></br>
        <Logs ros={this.props.ros} />
      </React.Fragment>
    );
  }

  startPath() {
    const pathindex = document.getElementById("pathnamelist").value;
    let e = this.state.path_list[pathindex][1];
    var request = new ROSLIB.ServiceRequest({
      sequence: e,
    });
    this.state.path_srv.callService(request, function (result) {
      //console.log(result.success);
    });
  }

  stopPath() {
    var request = new ROSLIB.ServiceRequest({});
    this.state.cancel_srv.callService(request, function (result) {});
  }

  startExtend() {
    var extend = new ROSLIB.Message({
      data: true,
    });
    this.state.motor_pub.publish(extend);
  }

  startRetract() {
    var retract = new ROSLIB.Message({
      data: false,
    });
    this.state.motor_pub.publish(retract);
  }

  textColour() {
    if (this.state.status === "extended") {
      return "badge badge-success";
    } else {
      return "badge badge-warning";
    }
  }
}

export default Disinfection;
