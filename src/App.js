//react
import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";

//ros
import ROSLIB from 'roslib';

//css
import "./App.css";

//components
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";
import Rosconnect from './components/ros/rosconnect';
import Disinfectionmode from './components/disinfection/disinfectionmode';

//custom hooks
import useToken from './useToken';

function App() {
  const { token, setToken } = useToken();
  const [ ros, setRos ] = useState(new ROSLIB.Ros())
  const [ status, setStatus ] = useState("Disconnected")
  const [ error, setError ] = useState(false)

  useEffect( () => {
    ros.connect('ws://localhost:9090');

    ros.on('connection', ()=> {
        setStatus("Connected");
        setError(false);
    });

    ros.on('close', ()=> {
      setStatus("Disconnected");
      ros.connect('ws://localhost:9090');
    });

    ros.on('error', ()=> {
      setError(true);
      ros.connect('ws://localhost:9090');
    });
  },[] )

  if (token != "admin") {
    return <Login setToken={setToken} />;
  }

  return (
    <React.Fragment>
      <Rosconnect ros={ros} status={status} error={error}/>
      <Switch>
        <Route exact path="/">
          <Dashboard setToken={setToken}/>
        </Route>
        <Route exact path='/disinfection'>
          <Disinfectionmode ros={ros}/>
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;