import React from "react";
import "./camera.css";
import "../../components/GlobalVariables";

const ipAddress = global.ipAddress;

export default class Camera extends React.Component {
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

          <iframe
            src={`http://${ipAddress}:5000/camera`}
            frameBorder="0"
            allow=" autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="stream"
          />
        </div>
      </div>
    );
  }
}

//src={"http://localhost:5000/camera"}
