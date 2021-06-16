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
  fs.readFile("/home/srtc/disinfection-robot/src/pages/disinfection/log.json", (err, data) => {
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
  fs.writeFile(
    "/home/srtc/disinfection-robot/src/pages/disinfection/log.json",
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

app.use("/path/read", (request, result) => {
  fs.readFile("/home/srtc/disinfection-robot/src/pages/disinfection/path.json", (err, data) => {
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
  fs.writeFile(
    "/home/srtc/disinfection-robot/src/pages/disinfection/path.json",
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

app.use("/waypoint/read", (request, result) => {
  fs.readFile('/home/srtc/disinfection-robot/src/pages/waypointfinder/waypoints.json', (err, data) => {
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

app.listen(8080, () => {
  console.log("API is running on port 8080");
});

//http://localhost:8080/login
