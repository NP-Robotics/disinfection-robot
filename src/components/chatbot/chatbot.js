import React, { useState } from "react";
import "./chatbot.css";

async function readData() {
  return fetch("http://localhost:8080/data/read", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
}

async function writeData(object) {
  return fetch("https://ycljsw0kp9.execute-api.us-east-1.amazonaws.com/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  }).then((data) => data.json());
}

const Chatbot = () => {
  let mediaRecorder;
  let audioChunks = [];
  let audioBlob;
  let audioUrl;

  const handleMicStart = () => {
    audioChunks = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (mediaStreamObj) {
        mediaRecorder = new MediaRecorder(mediaStreamObj);
        mediaRecorder.start();

        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          audioBlob = new Blob(audioChunks);
          audioUrl = URL.createObjectURL(audioBlob);
          console.log(audioUrl);
        });
      })
      .catch(function (err) {
        console.log(err.name, err.message);
      });
  };

  const handleMicStop = () => {
    if (mediaRecorder) mediaRecorder.stop();
  };

  const handlePlayAudio = () => {
    let audio = new Audio(audioUrl);
    audio.play();
  };

  const handleRead = async (e) => {
    const token = await readData();
    console.log(token);
  };

  const handleWrite = async (e) => {
    let data = {
      input: "pizza",
    };
    const token = await writeData(data);
    console.log(token);
  };
  return (
    <React.Fragment>
      <button
        onClick={() => handleMicStart()}
        className="btn btn-primary btn-sm m-2"
      >
        Start Mic
      </button>
      <button
        onClick={() => handleMicStop()}
        className="btn btn-primary btn-sm m-2"
      >
        Stop Mic
      </button>
      <button
        onClick={() => handlePlayAudio()}
        className="btn btn-primary btn-sm m-2"
      >
        Play Audio
      </button>
      <button
        onClick={() => handleRead()}
        className="btn btn-primary btn-sm m-2"
      >
        Read
      </button>
      <button
        onClick={() => handleWrite()}
        className="btn btn-primary btn-sm m-2"
      >
        Write
      </button>
    </React.Fragment>
  );
};

export default Chatbot;
