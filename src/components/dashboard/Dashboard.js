import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Dashboard.css";
import Chatbot from "../chatbot/chatbot"

const Dashboard = ({setToken}) => {

  const handleLogout = async (e) => {
    e.preventDefault();
    setToken({token:""});
  };

  return (
    <React.Fragment>
      <Link to="/disinfection">
        <button className="btn btn-primary btn-sm m-2">
          Disinfection Mode
        </button>
      </Link>
      <button className="btn btn-danger btn-sm m-2" onClick = {handleLogout}>
        Log out
      </button>
      <div>
        <Chatbot />
      </div>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Dashboard;
