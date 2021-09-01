//react
import React, { useEffect, useState, useRef } from "react";
import { Route, Switch, Link, useHistory } from "react-router-dom";

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
import Time from "./pages/disinfection/time";
import Camera from "./pages/camera/camera";

//custom hooks
import useToken from "./useToken";

//global variables
import "./components/GlobalVariables";
const baseIpAddress = global.baseIpAddress;
const ipAddress = global.ipAddress;

async function readTime() {
  return fetch(`http://${ipAddress}:8080/timing/read`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
}

function App() {
  const { token, setToken } = useToken();
  const [ros] = useState(new ROSLIB.Ros());
  const [status, setStatus] = useState("Disconnected");
  const [error, setError] = useState(false);
  const start_time = useRef();
  const curr_time = useRef();
  const curr_min = useRef();
  const intervalID = useRef();
  const history = useHistory();
  

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

  useEffect(() => {
    async function fetchData() {
      start_time.current = parseInt((await readTime()).time);
    }
    fetchData();

    intervalID.current = setInterval(() => {
      curr_time.current = new Date().getHours();
      curr_min.current = new Date().getMinutes();
      console.log(start_time.current)
      console.log(curr_time.current)
      console.log(curr_min.current)
      if (curr_time.current === start_time.current && curr_min.current === 0) {
        console.log("hi")
        history.push("/disinfection");
      }
    }, 1000);

    return () => {
      clearInterval(intervalID.current);
    };
  }, [curr_time]);

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
            <button className="btn btn-primary btn-lg m-2">
              Back to Disinfection Mode
            </button>
          </Link>
          <br></br>
          <Path ros={ros} />
          <Time />
        </Route>
        <Route exact path="/manual">
          <Manual ros={ros} />
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;
