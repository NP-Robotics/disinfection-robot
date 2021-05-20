import React from "react";
import PropTypes from "prop-types";
import "./header.css";
import Rosconnect from "../ros/rosconnect";
import { Layout, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Header = (props) => {
  const handleLogout = async (e) => {
    e.preventDefault();
    props.setToken({ token: "" });
  };

  return (
    <div className="headerBar">
      <div>
        <Rosconnect ros={props.ros} status={props.status} error={props.error} />
      </div>
      <div className="user">
        <UserOutlined />
        <button className="btn btn-danger btn-sm m-2" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div> //end header
  );
};

export default Header;
