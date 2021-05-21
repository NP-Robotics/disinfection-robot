import React, { Component, setState } from 'react';
import RecorderJS from 'recorder-js';
import { getAudioStream, exportBuffer } from "./audio"
import hark from 'hark'
import styled from "styled-components";


var audio = ""
var bootest = 1;
var merger = 0;

function setMerger(value){
  merger = value
}

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stream: null,
      recording: false,
      recorder: null
    };  
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);

  }

  

  async componentDidMount() {
    let stream;

    try {
      stream = await getAudioStream();
    } catch (error) {
      // Users browser doesn't support audio.
      // Add your handler here.
      console.log(error);
    }

    this.setState({ stream });

    setInterval(() => {
      //console.log('Interval triggered');
      if (bootest === 0)
    {
      this.stopRecord()
      console.log('1')
      merger = 1;
      bootest = 1;
    }
    }, 10);
  }

    startRecord() {
    //merger = 0
    console.log("test")
    const { stream } = this.state;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const recorder = new RecorderJS(audioContext);
    recorder.init(stream);

    this.setState(
      {
        recorder,
        recording: true
      },
      () => {
        recorder.start();
      }
    );
    var speechEvents = hark(stream);
    speechEvents.on('speaking', function() {
      console.log('speaking');
    });

    speechEvents.on('stopped_speaking', function() {
      console.log('stopped_speaking');
      bootest = 0 
      speechEvents.stop()
    })

    // if(this.bootest === false){
    //   this.setState({recording: false});
    //   console.log("1")
    // }
    
  }

  async stopRecord() {
    const { recorder } = this.state;
    var { buffer } = await recorder.stop()
    audio = exportBuffer(buffer[0]);
    
    // Process the audio here.
    console.log(audio);

    this.setState({recording: false});
    //showText();
  }

  async playRecord() {
    let audioUrl = URL.createObjectURL(audio);
    let audio1 = new Audio(audioUrl);
    audio1.play();

  }
  

  render() {
    const { recording, stream } = this.state;

    // Don't show record button if their browser doesn't support it.
    if (!stream) {
      return null;
    }

    const Button = styled.button`
    background-color: black;
    color: white;
    font-size: 20px;
    padding: 10px 60px;
    border-radius: 5px;
    margin: 10px 0px;
    cursor: pointer;
    &:disabled {
    color: grey;
    opacity: 0.7;
    cursor: default;

  }
`;
    

    return (
      <div>
        <Button onClick={ () => this.playRecord()}>
          Play Audio        
        </Button>
        <Button onClick={() => {
          recording ? this.stopRecord() : this.startRecord();
        }}
        >
        {recording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>
    );
  }
}
//<button onClick = {this.playRecord}>play</button>
export { merger, setMerger }
export { audio }
export default Recorder;