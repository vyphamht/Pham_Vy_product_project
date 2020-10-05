"use strict";

const path = require("path");

const storageConfig = require("./storageConfig");
const storageFile = path.join(__dirname, storageConfig.storageFile);

function createDataStorage(baseDir, config) {
  const { CODES, MESSAGES } = require(path.join(
    baseDir,
    config.errorCodeFolder,
    config.errorCodes
  ));

  const { read, write } = require(path.join(
    baseDir,
    config.libraryFolder,
    config.fileHandler
  ));

  async function readStorage() {
    try {
      const data = await read(storageFile);
      return Promise.resolve(JSON.parse(data.fileData));
    } catch (err) {
      writeLog(err.message);
    }
  }

  async function writeStorage(data) {
    try {
      await write(storageFile, JSON.stringify(data, null, 4), {
        encoding: "utf8",
        flag: "w",
      });
    } catch (err) {
      writeLog(err.message);
    }
  }

  class Datastorage {
    static get CODES() {
      return CODES;
    }

    getAll() {
      return new Promise(async (resolve) => {
        let storage = await readStorage();
        resolve(storage);
      });
    }

    get(id) {
      async function getFromStorage(id) {
        let storage = await readStorage();
        for (let product of storage) {
          if (product.productId == +id) {
            return product;
          }
        }
        return null;
      }
      return new Promise(async (resolve) => {
        if (!id) {
          resolve(MESSAGES.NOT_FOUND("<empty Id>"));
        } else {
          const result = await getFromStorage(id);
          if (result) {
            resolve(result);
          } else {
            resolve(MESSAGES.NOT_FOUND(id));
          }
        }
      });
    }

    insert(product) {
      async function addToStorage(newProduct) {
        let storage = await readStorage();
        for (let product of storage) {
          if (product.productId == newProduct.productId) {
            return false;
          }
        }
        storage.push({
          productId: +product.productId,
          name: product.name,
          model: product.model,
          amount: product.amount,
          price: +product.price,
        });
        await writeStorage(storage);
        return true;
      }
      return new Promise(async (resolve) => {
        if (
          !(
            product &&
            product.productId &&
            product.name &&
            product.model &&
            product.amount &&
            product.price
          )
        ) {
          resolve(MESSAGES.NOT_INSERTED());
        } else {
          if (await addToStorage(product)) {
            resolve(MESSAGES.INSERT_OK(product.productId));
          } else {
            resolve(MESSAGES.ALREADY_IN_USE(product.productId));
          }
        }
      });
    }

    remove(productId) {
      async function deleteFromStorage(id) {
        let storage = await readStorage();
        for (let i = 0; i < storage.length; i++) {
          if (storage[i].productId == +id) {
            storage.splice(i, 1);
            await writeStorage(storage);
            return true;
          }
        }
        return false;
      }

      return new Promise(async (resolve) => {
        if (!productId) {
          resolve(MESSAGES.NOT_FOUND("<empty>"));
        } else {
          if (await deleteFromStorage(productId)) {
            resolve(MESSAGES.DELETE_OK(productId));
          } else {
            resolve(MESSAGES.NOT_DELETED());
          }
        }
      });
    }

    update(product) {
      async function updateStorage(product) {
        let storage = await readStorage();
        for (let i = 0; i < storage.length; i++) {
          if (storage[i].productId == product.productId) {
            Object.assign(storage[i], {
              productId: +product.productId,
              name: product.name,
              model: product.model,
              amount: product.amount,
              price: +product.price,
            });
            await writeStorage(storage);
            return true;
          }
        }
        return false;
      }
      return new Promise(async (resolve) => {
        if (
          !(
            product &&
            product.productId &&
            product.name &&
            product.model &&
            product.amount &&
            product.price
          )
        ) {
          resolve(MESSAGES.NOT_UPDATED());
        } else {
          if (await updateStorage(product)) {
            resolve(MESSAGES.UPDATE_OK(product.productId));
          } else {
            resolve(MESSAGES.NOT_UPDATED());
          }
        }
      });
    }
  }

  return new Datastorage();
}

module.exports = {
  createDataStorage,
};
