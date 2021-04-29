import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Login.css";

import { EyeFilled } from "@ant-design/icons";

const loginUser = async (credentials) => {
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

const Login = ({ setToken }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({ username, password });
    setToken(token);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="wrapper">
      <h1 className="header">Please log in</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            className="username"
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </label>
        <label>
          <input
            className="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <EyeFilled className="icon" onClick={togglePasswordVisibility} />
        <div>
          <button className="button" type="submit">
            Log in
          </button>
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
