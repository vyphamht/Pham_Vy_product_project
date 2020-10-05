"use strict";

const path = require("path");

const storageConfig = require("./storageConfig");

const statements = require(path.join(__dirname, storageConfig.sqlStatements));

const Database = require(path.join(__dirname, storageConfig.databaseEngine));

function createDataStorage(baseDir, config) {
  const { CODES, MESSAGES } = require(path.join(
    baseDir,
    config.errorCodeFolder,
    config.errorCodes
  ));

  const productData = (product) => [
    product.name,
    +product.model,
    +product.amount,
    +product.price,
    +product.productId,
  ];
  const getAllProductsSql = statements.getAll.join(" ");
  const getProductSql = statements.getProduct.join(" ");
  const insertProductSql = statements.insertProduct.join(" ");
  const deleteProductSql = statements.deleteProduct.join(" ");
  const updateProductSql = statements.updateProduct.join(" ");

  class Datastorage {
    constructor(options) {
      this.options = options;
      this.db = new Database(options);
    }

    static get CODES() {
      return CODES;
    }

    getAll() {
      return new Promise(async (resolve) => {
        try {
          const result = await this.db.doQuery(getAllProductsSql);
          if (result.resultSet) {
            resolve(result.queryResult);
          } else {
            writeLog(MESSAGES.PROGRAM_ERROR().message);
          }
        } catch (err) {
          writeLog(MESSAGES.PROGRAM_ERROR().message + " " + err.message);
        }
      });
    }

    get(productId) {
      return new Promise(async (resolve) => {
        if (!productId) {
          resolve(MESSAGES.NOT_FOUND("<empty Id>"));
        } else {
          try {
            const result = await this.db.doQuery(getProductSql, +productId);
            if (result.resultSet) {
              if (result.queryResult.length > 0) {
                resolve(result.queryResult[0]);
              } else {
                resolve(MESSAGES.NOT_FOUND(productId));
              }
            } else {
              writeLog(MESSAGES.PROGRAM_ERROR().message);
            }
          } catch (err) {
            writeLog(MESSAGES.PROGRAM_ERROR().message + " " + err.message);
          }
        }
      });
    }

    insert(product) {
      return new Promise(async (resolve) => {
        if (!(product && product.productId && product.name && product.model)) {
          resolve(MESSAGES.NOT_INSERTED());
        } else {
          try {
            const searchResult = await this.db.doQuery(
              getProductSql,
              +product.productId
            );
            if (searchResult.queryResult.length === 0) {
              const result = await this.db.doQuery(
                insertProductSql,
                productData(product)
              );
              if (result.queryResult.rowsChanged == 1) {
                resolve(MESSAGES.INSERT_OK(product.productId));
              } else {
                resolve(MESSAGES.NOT_INSERTED());
              }
            } else {
              resolve(MESSAGES.ALREADY_IN_USE(product.productId));
            }
          } catch (err) {
            writeLog(MESSAGES.PROGRAM_ERROR().message + " " + err.message);
          }
        }
      });
    }

    remove(productId) {
      return new Promise(async (resolve) => {
        if (!productId) {
          resolve(MESSAGES.NOT_FOUND("<empty>"));
        } else {
          try {
            const result = await this.db.doQuery(deleteProductSql, productId);
            if (result.queryResult.rowsChanged == 1) {
              resolve(MESSAGES.DELETE_OK(productId));
            } else {
              resolve(MESSAGES.NOT_DELETED());
            }
          } catch (err) {
            writeLog(MESSAGES.PROGRAM_ERROR().message + " " + err.message);
          }
        }
      });
    }

    update(product) {
      return new Promise(async (resolve) => {
        if (!(product && product.productId && product.name && product.model)) {
          resolve(MESSAGES.NOT_UPDATED());
        } else {
          try {
            const result = await this.db.doQuery(
              updateProductSql,
              productData(product)
            );
            if (result.queryResult.rowsChanged == 1) {
              resolve(MESSAGES.UPDATE_OK(product.productId));
            } else {
              resolve(MESSAGES.NOT_UPDATED());
            }
          } catch (err) {
            writeLog(MESSAGES.PROGRAM_ERROR().message + " " + err.message);
          }
        }
      });
    }
  }

  return new Datastorage(storageConfig.options);
}

module.exports = {
  createDataStorage,
};
