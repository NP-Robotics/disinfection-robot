import React, { Component } from "react";
import ROSLIB from "roslib";
import { Link } from "react-router-dom";

import Logs from "./logs";

class Disinfectionmode extends Component {
  state = {
    motor_pub: "",
    motor_sub: "",
    waypoint_sub: "",
    path_srv: "",
    cancel_srv: "",
    status: "",
    status_waypoint: "None",
  };

  constructor(props) {
    super(props);

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

  componentDidMount() {
    this.state.waypoint_sub.subscribe(
      function (message) {
        console.log(message.data);
        this.state.status_waypoint = message.data;
        console.log(this.state.status_waypoint);
        this.setState({ state: this.state });
      }.bind(this)
    );

    this.state.motor_sub.subscribe(
      function (message) {
        this.state.status = message.data;
        this.setState({ state: this.state });
      }.bind(this)
    );
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
  };

  handleStop = () => {
    //console.log(this.state.location_log)
    //console.log(Object.keys(this.state.location_log).length)
    this.startRetract();
    this.stopPath();
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
        </div>
        <span className={this.textColour()}>
          Current Waypoint: {this.state.status_waypoint}
        </span>
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

        <Logs ros={this.props.ros} />
      </React.Fragment>
    );
  }

  startPath() {
    var request = new ROSLIB.ServiceRequest({
      sequence: [
        {
          location: "classroom",
          task: "",
        },
        {
          location: "gym",
          task: "",
        },
        {
          location: "canteen",
          task: "",
        },
        {
          location: "toilet",
          task: "",
        },
      ],
    });
    this.state.path_srv.callService(request, function (result) {
      console.log(result.success);
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

export default Disinfectionmode;
