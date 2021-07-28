//change this line for different workspaces
const fileRoute =
  "C:/NP-Robotics/disinfection-robot/src/pages/disinfection/log.json";

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
  fs.readFile(fileRoute, (err, data) => {
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
  fs.writeFile(fileRoute, JSON.stringify(request.body, null, 2), (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
  result.send({});
});

app.use("/path/read", (request, result) => {
  fs.readFile(fileRoute, (err, data) => {
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
  fs.writeFile(fileRoute, JSON.stringify(request.body, null, 2), (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
  result.send({});
});

app.use("/waypoint/read", (request, result) => {
  fs.readFile(fileRoute, (err, data) => {
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
  fs.readFile(fileRoute, (err, data) => {
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
  fs.writeFile(fileRoute, JSON.stringify(request.body, null, 2), (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
  result.send({});
});

app.listen(8080, () => {
  console.log("API is running on port 8080");
});

//http://localhost:8080/login
