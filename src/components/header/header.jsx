import React, { Component } from "react";
import { HeaderData } from "./headerData";
import "./header.css";
import NPLogo from "../../assets/NPLogo.png";
import Rosconnect from "../ros/rosconnect";
import { Layout, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;

class Header extends Component {
  state = { clicked: false };

  handleClick = () => {
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
                <a
                  style={{
                    textDecoration: "none !important",
                    color: "white",
                  }}
                  className={item.className}
                  href={item.path}
                >
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="dropdown">
          <UserOutlined className="dropbtn" />
          <div class="content">
            <a>Account</a>
            <a onClick={this.handleLogout}>Log Out</a>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
