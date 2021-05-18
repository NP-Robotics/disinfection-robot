import React from "react";
import PropTypes from "prop-types";
import "./header.css";
import Rosconnect from "../ros/rosconnect";

const Header = (props) => {
  const handleLogout = async (e) => {
    e.preventDefault();
    props.setToken({ token: "" });
  };

  return (
    <div className="header">
      <Rosconnect ros={props.ros} status={props.status} error={props.error} />
      <button className="btn btn-danger btn-sm m-2" onClick={handleLogout}>
        Log out
      </button>
      <div>Header Component</div>
    </div>
  );
};

export default Header;
