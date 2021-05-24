import React, { useState } from "react";
import PropTypes from "prop-types";
import "./login.css";
import { Form, Input, Button, Checkbox } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

async function loginUser(credentials) {
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

const Login = ({ setToken }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  let red;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      const token = await loginUser({ username, password });
      setToken(token);
    } else {
      red = true;
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Log in Failed", errorInfo);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="loginpage">
      <div className="stars">
        <div className="twinkling">
          <div className="box">
            <div className="big-header">Log in to your account</div>
            <Form
              initialValues={{ remember: true }}
              onSubmit={handleSubmit}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input your username",
                  },
                ]}
              >
                <Input
                  className={red ? "error" : "username"}
                  placeholder="Username"
                  type="text"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </Form.Item>

              <div>
                <Form.Item
                  rules={[
                    { required: true, message: "Please input your password" },
                  ]}
                >
                  <Input
                    className={red ? "error" : "password"}
                    placeholder="Password"
                    type="text"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    type={showPassword ? "text" : "password"}
                  />
                </Form.Item>
                <EyeFilled
                  className="icon"
                  onClick={togglePasswordVisibility}
                />
              </div>
              <div>
                <Form.Item>
                  <Button
                    className="button"
                    type="primary"
                    htmlType="submit"
                    onClick={handleSubmit}
                  >
                    <div>Sign In</div>
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
