//react
import React, { useEffect, useState } from "react";
import { Route, Switch, Link } from "react-router-dom";

//ros
import ROSLIB from "roslib";

//css
import "./App.css";

//components
import Header from "./components/header/header";

//pages
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import Disinfection from "./pages/disinfection/disinfection";
import Manual from "./pages/manual/manual";
import Path from "./pages/disinfection/path.jsx";
import Camera from "./pages/camera/camera";

//custom hooks
import useToken from "./useToken";

//global variables
import "./components/GlobalVariables";
const baseIpAddress = global.baseIpAddress;

function App() {
  const { token, setToken } = useToken();
  const [ros, setRos] = useState(new ROSLIB.Ros());
  const [status, setStatus] = useState("Disconnected");
  const [error, setError] = useState(false);

  useEffect(() => {
    ros.connect(`ws://${baseIpAddress}:9090`);

    ros.on("connection", () => {
      setStatus("Connected");
      setError(false);
    });

    ros.on("close", () => {
      setStatus("Disconnected");
      ros.connect(`ws://${baseIpAddress}:9090`);
    });

    ros.on("error", () => {
      setError(true);
      //ros.connect('ws://localhost:9090');
    });
  }, []);

  if (token !== "admin") {
    return <Login setToken={setToken} />;
  }

  return (
    <React.Fragment>
      <Header ros={ros} error={error} status={status} setToken={setToken} />
      <Switch>
        <Route exact path="/">
          <Dashboard ros={ros} />
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
        <Route exact path="/manual">
          <Manual ros={ros} />
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;
