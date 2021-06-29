import React, { useEffect, useState } from "react";
import { BsGeo } from 'react-icons/bs';

const Geotag = (props) => {

  const geoTag = (name) => {
    console.log(name)
    if(name=="side bed 1"){
      return(       
      <div style={{
        position: "relative",
        left: "71%",
        top: "-90%",
      }}>
      <BsGeo size="100px" color="red"/>
      <span className="d-inline p-2 bg-danger text-white rounded">{name}</span>
      </div>)
    }
    else if(name=="front bed 1"){
      return(       
      <div style={{
        position: "relative",
        left: "66%",
        top: "-82%",
      }}>
      <BsGeo size="100px" color="red"/>
      <span className="d-inline p-2 bg-danger text-white rounded">{name}</span>
      </div>)
    }
    else if(name=="side bed 2"){
      return(       
      <div style={{
        position: "relative",
        left: "33%",
        top: "-90%",
      }}>
      <BsGeo size="100px" color="red"/>
      <span className="d-inline p-2 bg-danger text-white rounded">{name}</span>
      </div>)
    }
    else if(name=="front bed 2"){
      return(       
      <div style={{
        position: "relative",
        left: "28%",
        top: "-82%",
      }}>
      <BsGeo size="100px" color="red"/>
      <span className="d-inline p-2 bg-danger text-white rounded">{name}</span>
      </div>)
    }
    else if(name=="side bed 3"){
      return(       
      <div style={{
        position: "relative",
        left: "17%",
        top: "-90%",
      }}>
      <BsGeo size="100px" color="red"/>
      <span className="d-inline p-2 bg-danger text-white rounded">{name}</span>
      </div>)
    }
    else if(name=="front bed 3"){
      return(       
      <div style={{
        position: "relative",
        left: "12%",
        top: "-82%",
      }}>
      <BsGeo size="100px" color="red"/>
      <span className="d-inline p-2 bg-danger text-white rounded">{name}</span>
      </div>)
    }
    else if(name=="wall"){
      return(       
      <div style={{
        position: "relative",
        left: "7%",
        top: "-75%",
      }}>
      <BsGeo size="100px" color="red"/>
      <span className="d-inline p-2 bg-danger text-white rounded">{name}</span>
      </div>)
    }
    else{
      return
    }
  }

  return (
    <React.Fragment>
      {geoTag(props.name)}
    </React.Fragment>
  );
};

export default Geotag;
