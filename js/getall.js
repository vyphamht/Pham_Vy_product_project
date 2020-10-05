"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    try {
      const data = await fetch("/all");
      const products = await data.json();
      const resultset = document.getElementById("resultset");
      for (let product of products) {
        const tr = document.createElement("tr");
        tr.appendChild(buildElement(product.productId));
        tr.appendChild(buildElement(product.name));
        tr.appendChild(buildElement(product.model));
        tr.appendChild(buildElement(product.amount));
        tr.appendChild(buildElement(product.price));
        resultset.appendChild(tr);
      }
    } catch (err) {
      document.getElementById(
        "resultarea"
      ).innerHTML = `<p class="error">${err.message}</p>`;
    }
  }

  function buildElement(data) {
    const td = document.createElement("td");
    td.textContent = data;
    return td;
  }
})();
