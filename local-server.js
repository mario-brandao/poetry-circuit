const express = require("express");
const https = require("https");
const fs = require("fs");

const compression = require("compression");
const app = express();
app.use(compression());
const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.crt"),
};

app.get("/", (req, res) => {
  res.send("Hello, HTTPS World!");
});

https.createServer(options, app).listen(443, () => {
  console.log("Servidor rodando em https://localhost:443");
});
