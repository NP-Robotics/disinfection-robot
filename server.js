const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.use("/login", (request, result) => {
  result.send({ token: "admin" });
});

app.listen(8080, () => {
  console.log("API is running on port 8080");
});

//http://localhost:8080/login
