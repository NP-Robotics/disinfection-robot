import React, { useState } from "react";

const Chatbot = () => {
  let mediaRecorder
  let audioChunks = []
  let audioBlob
  let audioUrl

  const handleMicStart = () => {
    audioChunks = [];
    navigator.mediaDevices.getUserMedia({audio: true})
    .then(function (mediaStreamObj) {

      mediaRecorder = new MediaRecorder(mediaStreamObj);
      mediaRecorder.start();

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        audioBlob = new Blob(audioChunks);
        audioUrl = URL.createObjectURL(audioBlob);
      });
    })
    .catch(function (err) {
      console.log(err.name, err.message);
    });
  };

  const handleMicStop = () => {
    if(mediaRecorder) mediaRecorder.stop();
  };
  
  const handlePlayAudio = () => {
    let audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <React.Fragment>
      <button onClick = {()=>handleMicStart()} className="btn btn-primary btn-sm m-2" >Start Mic</button>
      <button onClick = {()=>handleMicStop()} className="btn btn-primary btn-sm m-2" >Stop Mic</button>
      <button onClick = {()=>handlePlayAudio()} className="btn btn-primary btn-sm m-2" >Play Audio</button>
    </React.Fragment>
  );
};
  
export default Chatbot;