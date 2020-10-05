const CODES = {
  NOT_FOUND: 1,
  INSERT_OK: 2,
  NOT_INSERTED: 3,
  ALREADY_IN_USE: 4,
  DELETE_OK: 5,
  NOT_DELETED: 6,
  UPDATE_OK: 7,
  NOT_UPDATED: 8,
  PRODUCT_NOT_FOUND: 9,
  MODEL_NOT_FOUND: 9,
  PROGRAM_ERROR: 0,
};

const MESSAGES = {
  NOT_FOUND: (productId) => ({
    message: `No product found with productId ${productId}`,
    code: CODES.NOT_FOUND,
    type: "error",
  }),
  INSERT_OK: (productId) => ({
    message: `Product ${productId} was inserted`,
    code: CODES.INSERT_OK,
    type: "info",
  }),
  NOT_INSERTED: () => ({
    message: "Product was not inserted",
    code: CODES.NOT_INSERTED,
    type: "error",
  }),
  ALREADY_IN_USE: (productId) => ({
    message: `ProductId ${productId} was already in use`,
    code: CODES.ALREADY_IN_USE,
    type: "error",
  }),
  DELETE_OK: (productId) => ({
    message: `Product ${productId} removed`,
    code: CODES.DELETE_OK,
    type: "info",
  }),
  NOT_DELETED: () => ({
    message: "No product found with the given productID. Nothing removed",
    code: CODES.NOT_DELETED,
    type: "error",
  }),
  UPDATE_OK: (productId) => ({
    message: `Product ${productId} was updated`,
    code: CODES.UPDATE_OK,
    type: "info",
  }),
  NOT_UPDATED: () => ({
    message: "Data was not updated",
    code: CODES.NOT_UPDATED,
    type: "error",
  }),
  PRODUCT_NOT_FOUND: (model) => ({
    message: `Model ${model} has no products`,
    code: CODES.PRODUCT_NOT_FOUND,
    type: "error",
  }),
  MODEL_NOT_FOUND: () => ({
    message: `No model found`,
    code: CODES.MODEL_NOT_FOUND,
    type: "error",
  }),
  PROGRAM_ERROR: () => ({
    message: "Sorry! Error in the program.",
    code: CODES.PROGRAM_ERROR,
    type: "error",
  }),
};

module.exports = { CODES, MESSAGES };
