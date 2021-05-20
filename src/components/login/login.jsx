import React, { useState } from "react";
import PropTypes from "prop-types";
import "./login.css";
import { Form, Input, Button, Checkbox } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import NPLogo from "../../assets/NPLogo.jpg";

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
  /*
  const [state, setState] = useState({
    submitting: false,
  });
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      const token = await loginUser({ username, password });
      setToken(token);
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
      <div>
        <img src={NPLogo} className="logo" />
      </div>

      <div className="box">
        <div className="big-header">Clinic Robot Web Application</div>
        <div className="heading">Sign in to your account</div>
        <Form
          initialValues={{ remember: true }}
          onSubmit={handleSubmit}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username" }]}
          >
            <Input
              className="username"
              placeholder="Username"
              type="text"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </Form.Item>

          <div>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password" },
              ]}
            >
              <Input
                className="password"
                placeholder="Password"
                type="text"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={showPassword ? "text" : "password"}
              />
            </Form.Item>
            <EyeFilled className="icon" onClick={togglePasswordVisibility} />
          </div>

          <div className="remember">
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </div>

          <div>
            <Form.Item>
              <Button
                className="button"
                type="primary"
                htmlType="submit"
                onClick={handleSubmit}
              >
                Sign in
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
