import React from "react";
import "./camera.css";
import "../../components/GlobalVariables";
import Beep from "./voice_temp.mp3";
import maskReminder from "./voice_mask.mp3";

const ipAddress = global.ipAddress;

async function readTemperature(offset) {
  return fetch(`http://${ipAddress}:5000/temperature/${offset}`, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  }).then((data) => data.json());
}

async function readOffset() {
  return fetch(`http://${ipAddress}:8080/offset/read`, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  }).then((data) => data.json());
}

async function readCounter() {
  return fetch(`http://${ipAddress}:5000/counter`, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  }).then((data) => data.json());
}

export default class Camera extends React.Component {
  state = {
    temperature: [],
    offset: 7.5,
    count: 0,
  };
  intervalID = 0;

  audio = new Audio(Beep);

  maskAudio = new Audio(maskReminder);
  counterTracker = 0;

  async componentDidMount() {
    this.state.offset = (await readOffset()).offset;
    this.setState({ state: this.state });

    this.state.count = (await readCounter()).count;
    this.setState({ state: this.state });
    this.counterTracker = this.state.count;

    this.intervalID = setInterval(async () => {
      try{
        this.state.temperature = await readTemperature(this.state.offset);
        this.setState({ state: this.state });
      }catch{}

      this.state.count = (await readCounter()).count;
      this.setState({ state: this.state });
      if (this.counterTracker !== this.state.count) {
        if (this.maskAudio.paused && this.audio.paused) {
          this.maskAudio.load();
          this.maskAudio.play();
        }
      }
      this.counterTracker = this.state.count;
    }, 800);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  handleStop = () => {
    console.log(this.state.temperature);
  };

  tempColour = (temp) => {
    if (temp >= 37.9) {
      if (this.audio.paused) {
        this.audio.load();
        this.audio.play();
      }
      return "bg-danger";
    } else {
      return "";
    }
  };

  render() {
    return (
      <div className="stars-camera-page">
        <div className="twinkling-camera-page">
          <div className="iframe-wrapper">
            <iframe
              src={`http://${ipAddress}:5000/camera`}
              frameBorder="0"
              allowFullScreen
              title="stream"
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: "1200px",
              top: "320px",
            }}
          >
            <div>
              <h2 style={{ color: "white" }}>
                Number of improperly masked people today:{" "}
              </h2>
              <h1 style={{ color: "Red" }}>{this.state.count}</h1>
            </div>
            <table className="table table-bordered table-dark">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Temperature °C</th>
                </tr>
              </thead>
              <tbody>
                {this.state.temperature.map((temperature) => (
                  <tr
                    key={this.state.temperature.indexOf(temperature)}
                    className={this.tempColour(
                      Math.round(temperature * 100) / 100
                    )}
                  >
                    <th scope="row">
                      {this.state.temperature.indexOf(temperature)}
                    </th>
                    <td> {Math.round(temperature * 100) / 100} </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

//src={"http://localhost:5000/camera"}
