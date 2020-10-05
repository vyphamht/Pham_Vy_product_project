"use strict";

const fs = require("fs");
const path = require("path");

const MIMETYPES = {
  ".html": { type: "text/html", encoding: "utf8" },
  ".js": { type: "text/javascript", encoding: "utf8" },
  ".css": { type: "text/css", encoding: "utf8" },
  ".json": { type: "application/json", encoding: "utf8" },
  ".png": { type: "image/png", encoding: "binary" },
  ".jpg": { type: "image/jpg", encoding: "binary" },
  ".gif": { type: "image/gif", encoding: "binary" },
  ".ico": { type: "image/vnd.microsoft.icon", encoding: "binary" },
};

const read = (filepath) => {
  let extension = path.extname(filepath).toLowerCase();
  let mime = MIMETYPES[extension] || {
    type: "application/octet-stream",
    encoding: "binary",
  };
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, mime.encoding, (err, fileData) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fileData, mime });
      }
    });
  });
};
//options: {encoding: 'utf8',  flag: 'w'}
const write = (filepath, data, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      await fs.promises.writeFile(filepath, data, options);
      resolve({ message: "OK" });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  read,
  write,
};
