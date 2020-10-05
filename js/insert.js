"use strict";

(function () {
  let productIdField;
  let nameField;
  let modelField;
  let amountField;
  let priceField;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    productIdField = document.getElementById("productId");
    nameField = document.getElementById("name");
    modelField = document.getElementById("model");
    amountField = document.getElementById("amount");
    priceField = document.getElementById("price");

    document.getElementById("submit").addEventListener("click", submit);
  }

  async function submit() {
    clearMessage();

    const productId = +productIdField.value;
    const name = nameField.value;
    const model = modelField.value;
    const amount = amountField.value;
    const price = +priceField.value;

    try {
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

      const data = await fetch("/insert", options);
      const result = await data.json();

      if (result.message) {
        updateMessage(result.message, result.type);
      }
    } catch (err) {
      updateMessage(err.message, "error");
    }
  }
})();
