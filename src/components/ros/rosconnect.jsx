import React, { Component } from "react";
import "./rosconnect.css";
import { ReloadOutlined } from "@ant-design/icons";

class Rosconnect extends Component {
  statusIndicator() {
    if (this.props.status === "Connected") {
      return (
        <div>
          <div className="status-message" style={{ color: "green" }}>
            Connected
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="status-message" style={{ color: "red" }}>
            Disconnected
          </div>
        </div>
      );
    }
  }

  handleRefresh = () => {
    this.props.ros.connect("ws://localhost:9090");
  };

  render() {
    return (
      <React.Fragment className="status">
        <div className="text">{this.statusIndicator()}</div>
        <ReloadOutlined
          onClick={() => this.handleRefresh()}
          className="refresh"
        />
      </React.Fragment>
    );
  }
}

export default Rosconnect;
