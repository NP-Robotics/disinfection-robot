import React from "react";
import "./camera.css";
import "../../components/GlobalVariables";
import Beep from "./beep.wav";

const ipAddress = global.ipAddress;

async function readTemperature() {
  return fetch(`http://${ipAddress}:5000/temperature`, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  }).then((data) => data.json());
}

export default class Camera extends React.Component {
  state = {
    temperature: [],
  };
  intervalID = 0;

  async componentDidMount() {
    this.intervalID = setInterval(async () => {
      this.state.temperature = await readTemperature();
      this.setState({ state: this.state });
    }, 800);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  handleStop = () => {
    console.log(this.state.temperature);
  };

  render() {
    return (
      <div className="stars-camera-page">
        <div className="twinkling-camera-page">
          <div className="safety-message-1">For your health and safety,</div>
          <div className="safety-message-2">
            please look into the camera for temperature measurement and mask
            detection.
          </div>
          <div className="safety-message-chi-1">为了您与大家的安全,</div>
          <div className="safety-message-chi-2">
            请务必带着口罩对镜头量体温。
          </div>

          <div className="safety-message-1">
            Untuk kesihatan dan keselamatan anda,
          </div>
          <div className="safety-message-2">
            pandang ke kamera untuk pengukuran suhu dan pengesanan pelitup.
          </div>

          <div className="safety-message-1">
            உங்கள் உடல்நலம் மற்றும் பாதுகாப்பிற்காக,
          </div>
          <div className="safety-message-2">
            வெப்பநிலை அளவீடு கருவியை பாருங்கல்.
          </div>

          <div className="iframe-wrapper">
            <iframe
              src={`http://${ipAddress}:5000/camera`}
              frameBorder="0"
              allow=" autoplay; encrypted-media; gyroscope; picture-in-picture"
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
  tempColour = (temp) => {
    if (temp >= 37.9) {
      let audio = new Audio(Beep);
      audio.load();
      audio.play();
      return "bg-danger";
    } else {
      return "";
    }
  };
}

//src={"http://localhost:5000/camera"}
