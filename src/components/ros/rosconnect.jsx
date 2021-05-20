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
      <React.Fragment>
        <div className="wrapper">
          <span className="status-block">
            <span
              style={{
                float: "left",
                color: "white",
                paddingLeft: "20px",
                fontFamily: "font-family: Arial, Geneva, Helvetica, sans-serif",
              }}
            >
              Connection Status:{" "}
            </span>
            {this.statusIndicator()}
            <ReloadOutlined
              onClick={() => this.handleRefresh()}
              className="refresh"
              style={{ color: "white" }}
            />
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default Rosconnect;
