import React, { Component } from "react";
import { Link } from "react-router-dom";
import { HeaderData } from "./headerData";
import "./header.css";
import NPLogo from "../../assets/NPLogo.png";
import Rosconnect from "../ros/rosconnect";
import { UserOutlined } from "@ant-design/icons";

class Header extends Component {
  state = { clicked: false };

  handleClick = async (e) => {
    e.preventDefault();
    this.setState({ clicked: !this.state.clicked });
  };

  handleLogout = async (e) => {
    e.preventDefault();
    this.props.setToken({ token: "" });
  };

  render() {
    return (
      <nav className="header-wrapper">
        <img className="header-logo" src={NPLogo} alt="Ngee Ann Logo" />
        <span className="title">Robot Status:</span>
        <Rosconnect />
        <div className="menu-icon" onClick={this.handleClick}>
          <i
            className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}
          ></i>
        </div>
        <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
          {HeaderData.map((item, index) => {
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  style={{
                    textDecoration: "none !important",
                    color: "white",
                  }}
                  className={item.className}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="dropdown">
          <UserOutlined className="dropbtn" />
          <div className="content">
            <a>Account</a>
            <a onClick={this.handleLogout}>Log Out</a>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
