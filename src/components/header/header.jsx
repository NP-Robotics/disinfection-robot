import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import PropTypes from "prop-types";
import NPLogo from "../../assets/NPLogo.png";
import "./header.css";
import { HeaderData } from "./headerData";
import Rosconnect from "../ros/rosconnect";
import { FaBars } from "react-icons/fa";

const Header = (props) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    props.setToken({ token: "" });
  };

  return (
    <nav div className="wrapper">
      <h1>React</h1>
      <div className="menu-icon" onClick={handleClick}>
        <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
      </div>
      <ul className={clicked ? "nav-menu active" : "nav-menu"}>
        {HeaderData.map((item, index) => {
          return (
            <li key={index}>
              <a className={item.className} href={item.path}>
                {item.icon}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Header;
