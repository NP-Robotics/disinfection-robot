import React, { useEffect, useState } from "react";
import { audio,merger,setMerger } from "./recorder"
import { useSpeechSynthesis } from 'react-speech-kit';
import "./chatbot.css";

var AWS = require('aws-sdk');
var control = 0;

function Chatbot() {
//const[testvar, setvar] = useState('')
const[APIres, setresponse] = useState("Please say Pizza to start")

/*const data = {
  "input" : "pizza"
}*/


useEffect(async () => {
  setInterval(() => {
    //console.log('Interval triggered');
    if(merger === 1){
      setMerger(0)
      showText();
    }
  }, 100);
})



var params = {
  botAlias: 'pizzabot', /* required */
  botName: 'PizzaOrderingBot', /* required */
  //inputText: `input`, /* required */
  contentType: 'audio/x-l16; sample-rate=16000; channel-count=1', /*required audio/x-l16; sample-rate=16000; channel-count=1*/
  //inputStream: input,
  accept: 'text/plain; charset=utf-8',
  userId: 'Test'
};

AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  // Provide your Pool Id here
      IdentityPoolId: 'us-east-1:a965f9d5-6111-4304-8cd7-df318a38551d',
  });
var lexruntime = new AWS.LexRuntime();
const test1 = (err, data) => {
  if (err) 
  {
      console.log(err, err.stack); // an error occurred
      console.log("1")
  }
  else     
  {
      console.log(data); 
      console.log("2")
  }
}

async function PostToAPI(input) {
  params.inputStream = input
  return lexruntime.postContent(params, test1()).promise();
  
} 
let audioUrl1
const { speak } = useSpeechSynthesis();
async function showText() {
  let response = await PostToAPI(audio);
  console.log(response);
  let { message } = response
  console.log(message)
  await speak({ text: message })
  setresponse(message)
}

const playblob = () => {
  let audio2 = new Audio(audioUrl1);
  audio2.play()
}

const testaudio = () => {
  //speak({ text: value })
  showText()
  speak({ text: APIres })
}

  return (
    <div 
      style = {{
        color: "#fbc02d"
      }}>
      <h2>{APIres}</h2>
    </div>
  );
}

export {control}
export default Chatbot;

//<button onClick = {showText}>Test</button>
