import React, { Component } from "react";
import ROSLIB from "roslib";
import { Link } from "react-router-dom";
import "./disinfection.css";
import Logs from "./logs";

import "../../components/GlobalVariables";
const ipAddress = global.ipAddress;

async function readPaths() {
  return fetch(`http://${ipAddress}:8080/path/read`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
}

async function readTime() {
  return fetch(`http://${ipAddress}:8080/timing/read`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
}

function statusUV(value) {
  if (value >= 600) {
    return "On";
  }
  return "Off";
}

class Disinfection extends Component {
  state = {
    dynamixel_pub: "",
    motor_pub: "",
    motor_sub: "",
    waypoint_sub: "",
    end_disinfection_sub: "",
    uv0_sub: "",
    uv1_sub: "",
    uv2_sub: "",
    uv3_sub: "",
    uv4_sub: "",
    uv5_sub: "",
    uv6_sub: "",
    uv7_sub: "",
    path_srv: "",
    cancel_srv: "",
    status: "",
    status_waypoint: "None",
    status_uv0: "Off",
    status_uv1: "Off",
    status_uv2: "Off",
    status_uv3: "Off",
    status_uv4: "Off",
    status_uv5: "Off",
    status_uv6: "Off",
    status_uv7: "Off",
    path_list: [],
    start_time: "", //time for disinfection to start
    start_min: "", //minute for disinfection to start
    curr_time: "",
    curr_min:"",
    auto_path_name: ""
  };
  path_sequence = []
  path_index= 0
  intervalID = 0;
  disinfectionReq = false;

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
      messageType: "std_msgs/String",
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
    this.state.end_disinfection_sub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/web_service/end_disinfection",
      messageType: "std_msgs/Empty",
    });
    this.state.uv0_sub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/ValueUV0",
      messageType: "std_msgs/Int32",
    });
    this.state.uv1_sub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/ValueUV1",
      messageType: "std_msgs/Int32",
    });
    this.state.uv2_sub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/ValueUV2",
      messageType: "std_msgs/Int32",
    });
    this.state.uv3_sub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/ValueUV3",
      messageType: "std_msgs/Int32",
    });
    this.state.uv4_sub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/ValueUV4",
      messageType: "std_msgs/Int32",
    });
    this.state.uv5_sub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/ValueUV5",
      messageType: "std_msgs/Int32",
    });
    this.state.uv6_sub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/ValueUV6",
      messageType: "std_msgs/Int32",
    });
    this.state.uv7_sub = new ROSLIB.Topic({
      ros: props.ros,
      name: "/ValueUV7",
      messageType: "std_msgs/Int32",
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
        if (message.data === "extended") this.startPath();
      }.bind(this)
    );

    this.state.end_disinfection_sub.subscribe(
      function (message) {
        console.log("disinfection ended")
        this.handleStop();
      }.bind(this)
    );

    this.state.uv0_sub.subscribe(
      function (message) {
        this.state.status_uv0 = statusUV(message.data);
        this.setState({ state: this.state });
      }.bind(this)
    );
    this.state.uv1_sub.subscribe(
      function (message) {
        this.state.status_uv1 = statusUV(message.data);
        this.setState({ state: this.state });
      }.bind(this)
    );
    this.state.uv2_sub.subscribe(
      function (message) {
        this.state.status_uv2 = statusUV(message.data);
        this.setState({ state: this.state });
      }.bind(this)
    );
    this.state.uv3_sub.subscribe(
      function (message) {
        this.state.status_uv3 = statusUV(message.data);
        this.setState({ state: this.state });
      }.bind(this)
    );
    this.state.uv4_sub.subscribe(
      function (message) {
        this.state.status_uv4 = statusUV(message.data);
        this.setState({ state: this.state });
      }.bind(this)
    );
    this.state.uv5_sub.subscribe(
      function (message) {
        this.state.status_uv5 = statusUV(message.data);
        this.setState({ state: this.state });
      }.bind(this)
    );
    this.state.uv6_sub.subscribe(
      function (message) {
        this.state.status_uv6 = statusUV(message.data);
        this.setState({ state: this.state });
      }.bind(this)
    );
    this.state.uv7_sub.subscribe(
      function (message) {
        this.state.status_uv7 = statusUV(message.data);
        this.setState({ state: this.state });
      }.bind(this)
    );
    this.state.path_list = Object.entries(await readPaths());
    this.setState({ state: this.state });

    var temp = await readTime()
    this.state.start_time = parseInt(temp.time);
    this.setState({ state: this.state });
    this.state.start_min = parseInt(temp.minute);
    this.setState({ state: this.state });
    this.path_index = parseInt(temp.pathindex)
    this.state.auto_path_name = this.state.path_list[this.path_index][0]; 
    this.setState({ state: this.state });
    

    this.intervalID = setInterval(() => {
      this.setState({
        curr_time: new Date().getHours(),
        curr_min: new Date().getMinutes(),
      });
      if (this.state.curr_time === this.state.start_time && this.state.curr_min === this.state.start_min && this.disinfectionReq === false) {
        console.log("dsinfection")
        this.handleAutoStart();
        this.disinfectionReq = true;
      }
    }, 1000);
  }

  componentDidUpdate() {
    //console.log(this.state.start_time);
  }

  componentWillUnmount() {
    this.state.waypoint_sub.unsubscribe();
    this.state.motor_sub.unsubscribe();
    this.state.end_disinfection_sub.unsubscribe();
    this.state.uv0_sub.unsubscribe();
    this.state.uv1_sub.unsubscribe();
    this.state.uv2_sub.unsubscribe();
    this.state.uv3_sub.unsubscribe();
    this.state.uv4_sub.unsubscribe();
    this.state.uv5_sub.unsubscribe();
    this.state.uv6_sub.unsubscribe();
    this.state.uv7_sub.unsubscribe();
    clearInterval(this.intervalID);
  }

  handleAutoStart = () => {
    /*
        const data = [
            {data: "data"},
            {cool: "hey", hi: ["hi"]}
        ]
        console.log(JSON.stringify(data))*/
    console.log("started")
    this.startExtend();
    this.path_sequence = this.state.path_list[this.path_index][1];
    //this.startPath();
    var dynamixel_position = new ROSLIB.Message({
      id: 1,
      position: 16368,
    });
    this.state.dynamixel_pub.publish(dynamixel_position);
  };

  handleStart = () => {
    /*
        const data = [
            {data: "data"},
            {cool: "hey", hi: ["hi"]}
        ]
        console.log(JSON.stringify(data))*/
    console.log("started")
    this.startExtend();
    const pathindex = document.getElementById("pathnamelist").value;
    this.path_sequence = this.state.path_list[pathindex][1];
    //this.startPath();
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
          <Link to="/disinfection/admin">
            <button className="btn btn-primary btn-lg m-2">
              Disinfection Admin Mode
            </button>
          </Link>
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "30%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Choose Paths:{" "}
          <select id="pathnamelist" style={{fontSize:"19px"}}>
            {this.state.path_list.map((pathname, index) => (
              <option key={index} value={index}>
                {pathname[0]}
              </option>
            ))}
          </select>
          <div className="btn-group m-2">
            <button
              onClick={() => this.handleStart()}
              className="btn btn-primary btn-lg"
            >
              Start Disinfection Mode
            </button>
            <button
              onClick={() => this.handleStop()}
              className="btn btn-danger btn-lg"
            >
              Stop Disinfection Mode
            </button>
          </div>
          <br></br>
          <ul className="list-group list-group-horizontal">
            <li className={this.textColour()}>
              Auto Disinfection Time: {this.state.start_time} : {this.state.start_min} Hr 
              Disinfection Path: {this.state.auto_path_name}
            </li>
            <li className={this.textColour()}>
              Current Waypoint: {this.state.status_waypoint}
            </li>
          </ul>
          <ul className="list-group list-group-horizontal">
            <li className={this.uvColour(this.state.status_uv0)}>
              UV0: {this.state.status_uv0}
            </li>
            <li className={this.uvColour(this.state.status_uv1)}>
              UV1: {this.state.status_uv1}
            </li>
            <li className={this.uvColour(this.state.status_uv2)}>
              UV2: {this.state.status_uv2}
            </li>
            <li className={this.uvColour(this.state.status_uv3)}>
              UV3: {this.state.status_uv3}
            </li>
            <li className={this.uvColour(this.state.status_uv4)}>
              UV4: {this.state.status_uv4}
            </li>
            <li className={this.uvColour(this.state.status_uv5)}>
              UV5: {this.state.status_uv5}
            </li>
            <li className={this.uvColour(this.state.status_uv6)}>
              UV6: {this.state.status_uv6}
            </li>
            <li className={this.uvColour(this.state.status_uv7)}>
              UV7: {this.state.status_uv7}
            </li>
          </ul>
          <br></br>
        </div>
        <Logs ros={this.props.ros} />
      </React.Fragment>
    );
  }

  startPath() {
    var request = new ROSLIB.ServiceRequest({
      sequence: this.path_sequence,
      loop: false,
      disinfection: true
    });
    this.state.path_srv.callService(request, function (result) {
      //console.log(result.success);
    });
  }

  stopPath() {
    var request = new ROSLIB.ServiceRequest({});
    this.state.cancel_srv.callService(request, function (result) {});
    this.state.status_waypoint = "None";
    this.setState({ state: this.state });
  }

  startExtend() {
    var extend = new ROSLIB.Message({
      data: "disinfectiontrue",
    });
    this.state.motor_pub.publish(extend);
  }

  startRetract() {
    var retract = new ROSLIB.Message({
      data: "disinfectionfalse",
    });
    this.state.motor_pub.publish(retract);
  }

  textColour() {
    if (this.state.status === "extended") {
      return "list-group-item list-group-item-success";
    } else {
      return "list-group-item list-group-item-warning";
    }
  }
  uvColour(status_uv) {
    if (status_uv === "On") {
      return "list-group-item list-group-item-success";
    } else {
      return "list-group-item list-group-item-danger";
    }
  }
}

export default Disinfection;
