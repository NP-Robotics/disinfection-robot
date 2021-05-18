//react
import React, { useEffect, useState } from "react";
import { Route, Switch, Link } from "react-router-dom";

//ros
import ROSLIB from "roslib";

//css
import "./App.css";

//components
import Dashboard from "./components/dashboard/dashboard";
import Login from "./components/login/login";
import Disinfection from "./components/disinfection/disinfection";
import Logs from "./components/disinfection/logs";
import Path from "./components/disinfection/path.jsx";
import Camera from "./components/camera/camera";
import Header from "./components/header/header";
//custom hooks
import useToken from "./useToken";

function App() {
  const { token, setToken } = useToken();
  const [ros, setRos] = useState(new ROSLIB.Ros());
  const [status, setStatus] = useState("Disconnected");
  const [error, setError] = useState(false);

  useEffect(() => {
    ros.connect("ws://localhost:9090");

    ros.on("connection", () => {
      setStatus("Connected");
      setError(false);
    });

    ros.on("close", () => {
      setStatus("Disconnected");
      ros.connect("ws://localhost:9090");
    });

    ros.on("error", () => {
      setError(true);
      //ros.connect('ws://localhost:9090');
    });
  }, []);

  if (token != "admin") {
    return <Login setToken={setToken} />;
  }

  return (
    <React.Fragment>
      <Header ros={ros} error={error} status={status} setToken={setToken} />
      <Switch>
        <Route exact path="/">
          <Dashboard />
        </Route>
        <Route exact path="/disinfection">
          <Disinfection ros={ros} />
        </Route>
        <Route exact path="/camera">
          <Camera />
        </Route>
        <Route exact path="/disinfection/admin">
          <Link to="/disinfection">
            <button className="btn btn-primary btn-sm m-2">
              Back to Disinfection Mode
            </button>
          </Link>
          <br></br>
          <Path ros={ros} />
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;
