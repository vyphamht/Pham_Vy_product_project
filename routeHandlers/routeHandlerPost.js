"use strict";

const url = require("url");
const path = require("path");

module.exports = (baseDir, dataStorage, config) => {
  const { sendJson, getPostData } = require(path.join(
    baseDir,
    config.libraryFolder,
    config.requestHandler
  ));

  return async (req, res) => {
    const route = decodeURIComponent(url.parse(req.url).pathname);
    try {
      if (route === "/getOne") {
        const result = await getPostData(req, "application/json");
        const queryResult = await dataStorage.get(result.productId);
        sendJson(res, queryResult);
      } else if (route === "/remove") {
        const result = await getPostData(req, "application/json");
        const queryResult = await dataStorage.remove(result.productId);
        sendJson(res, queryResult);
      } else if (route === "/insert") {
        const result = await getPostData(req, "application/json");
        const queryResult = await dataStorage.insert(result);
        sendJson(res, queryResult);
      } else if (route === "/update") {
        const result = await getPostData(req, "application/json");
        const queryResult = await dataStorage.update(result);
        sendJson(res, queryResult);
      } else {
        writeLog("Post route not found");
      }
    } catch (err) {
      writeLog(err.message);
    }
  };
};
