"use strict";

const send = (res, resource) => {
  res.writeHead(200, {
    "Content-Type": resource.mime.type,
    "Content-Length": Buffer.byteLength(
      resource.fileData,
      resource.mime.encoding
    ),
  });
  res.end(resource.fileData, resource.mime.encoding);
};

const sendJson = (res, jsonResource, statusCode = 200) => {
  let jsonData = JSON.stringify(jsonResource);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(jsonData);
};

const sendStatus = (res, message, statusCode = 200) => {
  sendJson(res, JSON.stringify({ message }, statusCode));
};

const isIn = (route, ...routes) => {
  for (let start of routes) {
    if (route.startsWith(start)) {
      return true;
    }
  }
  return false;
};

const getPostData = (req, contentType) =>
  new Promise((resolve, reject) => {
    if (req.headers["content-type"] !== contentType) {
      reject("Wrong Content-Type");
    } else {
      let parse;
      if (contentType === "application/x-www-form-urlencoded") {
        parse = require("querystring").parse;
      } else if (contentType === "application/json") {
        parse = JSON.parse;
      }
      let databuffer = [];
      req.on("data", (messageFragment) => databuffer.push(messageFragment));
      req.on("end", () => resolve(parse(Buffer.concat(databuffer).toString())));
      req.on("error", () => reject("Error during the data transfer"));
    }
  });

module.exports = {
  send,
  sendJson,
  sendStatus,
  isIn,
  getPostData,
};
