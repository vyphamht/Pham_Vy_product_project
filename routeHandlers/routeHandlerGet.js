"use strict";

const path = require("path");
const url = require("url");

module.exports = (baseDir, dataStorage, config) => {
  const { send, sendJson, isIn } = require(path.join(
    baseDir,
    config.libraryFolder,
    config.requestHandler
  ));

  const { read } = require(path.join(
    baseDir,
    config.libraryFolder,
    config.fileHandler
  ));

  const menuPath = path.join(baseDir, config.webPagesFolder, config.menuFile);
  const resourcePaths = config.resourcePaths;
  const webPages = config.webPages;

  return async (req, res) => {
    const route = decodeURIComponent(url.parse(req.url).pathname);
    try {
      if (route === "/") {
        send(res, await read(menuPath));
      } else if (route === "/all") {
        const result = await dataStorage.getAll();
        sendJson(res, result);
      } else if (isIn(route, ...resourcePaths)) {
        let result = await read(path.join(baseDir, route));
        send(res, result);
      } else if (isIn(route, ...Object.keys(webPages))) {
        let result = await read(
          path.join(baseDir, config.webPagesFolder, config.webPages[route])
        );
        send(res, result);
      } else {
        writeLog("Get route not found");
      }
    } catch (err) {
      writeLog("Not found", err.message);
    }
  };
};
