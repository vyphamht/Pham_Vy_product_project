"use strict";

const mariadb = require("mariadb");

module.exports = class Database {
  constructor(options) {
    this.options = options;
  }

  doQuery(sql, parameters, connection) {
    return new Promise(async (resolve, reject) => {
      let newConnection = false;
      if (!connection) {
        connection = await mariadb.createConnection(this.options);
        newConnection = true;
      }
      try {
        let queryResult = await connection.query(sql, parameters);
        if (typeof queryResult === "undefined") {
          reject(new Error("QueryError"));
        } else if (typeof queryResult.affectedRows === "undefined") {
          delete queryResult.meta;
          resolve({ queryResult, resultSet: true });
        } else {
          resolve({
            queryResult: {
              rowsChanged: queryResult.affectedRows,
              insertId: queryResult.insertId,
              status: queryResult.warningStatus,
            },
            resultSet: false,
          });
        }
      } catch (error) {
        reject(new Error("SQL-error:" + error.message));
      } finally {
        if (connection && newConnection) connection.end();
      }
    });
  }
};
