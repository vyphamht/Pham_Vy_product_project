"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const config = require("./config.json");
const storage = config.datastorage;
const storagePath = path.join(
  __dirname,
  storage.dataStorageFolder,
  storage.dataStorageName,
  storage.dataLayer
);

const { createDataStorage } = require(storagePath);
const dataStorage = createDataStorage(__dirname, config);

const output = fs.createWriteStream(
  path.join(__dirname, config.logfile.filename),
  { flags: config.logfile.flags }
);
const { Console } = require("console");
global.writeLog = new Console({ stdout: output, stderr: output }).log;

writeLog(`\n\n${"#".repeat(20)} NEW ENTRY ${"#".repeat(20)}`);
const timestamp = new Date(Date.now());
writeLog(
  `Server started: ${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString()} local time `
);

const handleGetRequests = require(path.join(
  __dirname,
  config.routeHandlers,
  config.getHandlers
))(__dirname, dataStorage, config);

const handlePostRequests = require(path.join(
  __dirname,
  config.routeHandlers,
  config.postHandlers
))(__dirname, dataStorage, config);

const server = http.createServer(async (req, res) => {
  try {
    if (req.method.toUpperCase() === "GET") {
      handleGetRequests(req, res);
    } else if (req.method.toUpperCase() === "POST") {
      handlePostRequests(req, res);
    } else {
      writeLog("Resource not in use");
      res.end();
    }
  } catch (error) {
    writeLog(error.message);
    res.end();
  }
});
server.listen(config.port, config.host, () =>
  writeLog(`Server: http://${config.host}:${config.port}`)
);
