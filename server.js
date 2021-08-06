//change this line for different workspaces
//C:/NP-Robotics/disinfection-robot/src/pages/disinfection or waypointfinder
const fileRouteLOG =
  "/home/srtc/disinfection-robot/src/pages/disinfection/log.json";
const fileRoutePATH =
  "/home/srtc/disinfection-robot/src/pages/disinfection/path.json";
const fileRouteWAYPOINTS =
  "/home/srtc/disinfection-robot/src/pages/waypointfinder/waypoints.json";
const fileRouteTIMING =
  "/home/srtc/disinfection-robot/src/pages/disinfection/timing.json";
const fileRouteOFFSET =
  "/home/srtc/disinfection-robot/src/pages/manual/offset.json";

const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const bp = require("body-parser");

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use("/login", (request, result) => {
  result.send({ token: "admin" });
});

app.use("/data/read", (request, result) => {
  fs.readFile(fileRouteLOG, (err, data) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      result.send(JSON.parse(data));
    } catch (e) {
      console.log("error log/read");
    }
  });
  console.log("sent");
});

app.use("/data/write", (request, result) => {
  console.log(request.body);
  fs.writeFile(fileRouteLOG, JSON.stringify(request.body, null, 2), (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
  result.send({});
});

app.use("/path/read", (request, result) => {
  fs.readFile(fileRoutePATH, (err, data) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      result.send(JSON.parse(data));
    } catch (e) {
      console.log("error path/read");
    }
  });
  console.log("sent");
});

app.use("/path/write", (request, result) => {
  console.log(request.body);
  fs.writeFile(fileRoutePATH, JSON.stringify(request.body, null, 2), (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
  result.send({});
});

app.use("/waypoint/read", (request, result) => {
  fs.readFile(fileRouteWAYPOINTS, (err, data) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      result.send(JSON.parse(data));
    } catch (e) {
      console.log("error waypoint/read");
    }
  });
  console.log("sent");
});

app.use("/timing/read", (request, result) => {
  fs.readFile(fileRouteTIMING, (err, data) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      result.send(JSON.parse(data));
    } catch (e) {
      console.log("error timing/read");
    }
  });
  console.log("sent time");
});

app.use("/timing/write", (request, result) => {
  console.log(request.body);
  fs.writeFile(
    fileRouteTIMING,
    JSON.stringify(request.body, null, 2),
    (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    }
  );
  result.send({});
});

app.use("/offset/read", (request, result) => {
  fs.readFile(fileRouteOFFSET, (err, data) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      result.send(JSON.parse(data));
    } catch (e) {
      console.log("error timing/read");
    }
  });
  console.log("sent time");
});

app.use("/offset/write", (request, result) => {
  console.log(request.body);
  fs.writeFile(
    fileRouteOFFSET,
    JSON.stringify(request.body, null, 2),
    (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    }
  );
  result.send({});
});

app.listen(8080, () => {
  console.log("API is running on port 8080");
});

//http://localhost:8080/login
