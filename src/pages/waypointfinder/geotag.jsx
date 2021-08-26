import React from "react";
import { BsGeo } from "react-icons/bs";

const Geotag = (props) => {
  const geoTag = (name) => {
    console.log(name);
    if (name === "Room 204 to 206") {
      return (
        <div
          style={{
            position: "relative",
            left: "49%",
            top: "-20%",
          }}
        >
          <BsGeo size="100px" color="red" />
          <span className="d-inline p-2 bg-danger text-white rounded">
            {name}
          </span>
        </div>
      );
    } else if (name === "Room 201 to 203") {
      return (
        <div
          style={{
            position: "relative",
            left: "31%",
            top: "-20%",
          }}
        >
          <BsGeo size="100px" color="red" />
          <span className="d-inline p-2 bg-danger text-white rounded">
            {name}
          </span>
        </div>
      );
    } else if (name === "Room 207 to 209") {
      return (
        <div
          style={{
            position: "relative",
            left: "60%",
            top: "-37%",
          }}
        >
          <BsGeo size="100px" color="red" />
          <span className="d-inline p-2 bg-danger text-white rounded">
            {name}
          </span>
        </div>
      );
    } else if (name === "Room 210") {
      return (
        <div
          style={{
            position: "relative",
            left: "69%",
            top: "-33%",
          }}
        >
          <BsGeo size="100px" color="red" />
          <span className="d-inline p-2 bg-danger text-white rounded">
            {name}
          </span>
        </div>
      );
    } else if (name === "Room 211 to 212") {
      return (
        <div
          style={{
            position: "relative",
            left: "67%",
            top: "-48%",
          }}
        >
          <BsGeo size="100px" color="red" />
          <span className="d-inline p-2 bg-danger text-white rounded">
            {name}
          </span>
        </div>
      );
    } else if (name === "Room 215 to 223") {
      return (
        <div
          style={{
            position: "relative",
            left: "45%",
            top: "-47%",
          }}
        >
          <BsGeo size="100px" color="red" />
          <span className="d-inline p-2 bg-danger text-white rounded">
            {name}
          </span>
        </div>
      );
    } else if (name === "Room 233 to 238") {
      return (
        <div
          style={{
            position: "relative",
            left: "20%",
            top: "-32%",
          }}
        >
          <BsGeo size="100px" color="red" />
          <span className="d-inline p-2 bg-danger text-white rounded">
            {name}
          </span>
        </div>
      );
    } else if (name === "Room 239") {
      return (
        <div
          style={{
            position: "relative",
            left: "5%",
            top: "-32%",
          }}
        >
          <BsGeo size="100px" color="red" />
          <span className="d-inline p-2 bg-danger text-white rounded">
            {name}
          </span>
        </div>
      );
    } else if (name === "Room 241 to 246") {
      return (
        <div
          style={{
            position: "relative",
            left: "16%",
            top: "-65%",
          }}
        >
          <BsGeo size="100px" color="red" />
          <span className="d-inline p-2 bg-danger text-white rounded">
            {name}
          </span>
        </div>
      );
    } else {
      return;
    }
  };

  return <React.Fragment>{geoTag(props.name)}</React.Fragment>;
};

export default Geotag;
