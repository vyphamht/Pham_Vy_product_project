"use strict";

(function () {
  let productIdField;
  let nameField;
  let modelField;
  let amountField;
  let priceField;
  let searchState = true;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    productIdField = document.getElementById("productId");
    nameField = document.getElementById("name");
    modelField = document.getElementById("model");
    amountField = document.getElementById("amount");
    priceField = document.getElementById("price");

    readOnlyState(searchState);

    document.getElementById("submit").addEventListener("click", submit);
  }

  async function submit() {
    try {
      if (searchState) {
        clearMessage();
        clearProductData();
        const productId = productIdField.value;
        const options = {
          method: "POST",
          body: JSON.stringify({
            productId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
        const data = await fetch("/getOne", options);
        const queryResult = await data.json();
        if (queryResult) {
          if (queryResult.message) {
            updateMessage(queryResult.message, queryResult.type);
          } else {
            updateEmployeeData(queryResult);
          }
        } else {
          updateMessage("Not found", "error");
        }
      } else {
        const productId = productIdField.value;
        const name = nameField.value;
        const model = modelField.value;
        const amount = amountField.value;
        const price = priceField.value;

        const options = {
          method: "POST",
          body: JSON.stringify({
            productId,
            name,
            model,
            amount,
            price,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
        const data = await fetch("/update", options);
        const result = await data.json();
        if (result.message) {
          updateMessage(result.message, result.type);
        }
        searchState = true;
        readOnlyState(searchState);
      }
    } catch (err) {
      updateMessage(err.message, "error");
    }
  }

  function readOnlyState(state) {
    if (state) {
      productIdField.removeAttribute("readonly");
      nameField.setAttribute("readonly", state);
      modelField.setAttribute("readonly", state);
      amountField.setAttribute("readonly", state);
      priceField.setAttribute("readonly", state);
    } else {
      productIdField.setAttribute("readonly", true);
      nameField.removeAttribute("readonly");
      modelField.removeAttribute("readonly");
      amountField.removeAttribute("readonly");
      priceField.removeAttribute("readonly");
    }
  }

  function updateEmployeeData(product) {
    productIdField.value = +product.productId;
    nameField.value = product.name;
    modelField.value = product.model;
    amountField.value = product.amount;
    priceField.value = +product.price;
    searchState = false;
    readOnlyState(searchState);
  }

  function clearProductData() {
    nameField.value = "";
    modelField.value = "";
    amountField.value = "";
    priceField.value = "";
    searchState = true;
    readOnlyState(searchState);
  }
})();
