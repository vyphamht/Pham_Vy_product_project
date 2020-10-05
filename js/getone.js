"use strict";

(function () {
  let resultarea;
  let input;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    resultarea = document.getElementById("resultarea");
    input = document.getElementById("productId");
    document.getElementById("submit").addEventListener("click", submit);
  }

  async function submit() {
    clearMessage();
    resultarea.innerHTML = "";
    const id = input.value;
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          productId: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = await fetch("/getOne", options);
      const result = await data.json();
      updatePage(result);
    } catch (err) {
      updateMessage(err.message, "error");
    }
  }

  function updatePage(queryResult) {
    if (queryResult) {
      if (queryResult.message) {
        updateMessage(queryResult.message, queryResult.type);
      } else {
        updateProductData(queryResult);
      }
    } else {
      updateMessage("not found", "error");
    }
  }

  function updateProductData(product) {
    resultarea.innerHTML = `
    <p><span class="legend">Product Id:</span> ${product.productId}</p>
    <p><span class="legend">Name:</span> ${product.name}</p>
    <p><span class="legend">Model:</span> ${product.model}</p>
    <p><span class="legend">Amount:</span> ${product.amount}</p>
    <p><span class="legend">Price:</span> ${product.price} €</p>`;
    resultarea.removeAttribute("class");
  }
})();
