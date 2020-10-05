"use strict";

(function () {
  let input;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    input = document.getElementById("productId");
    document.getElementById("submit").addEventListener("click", submit);
  }

  async function submit() {
    clearMessage();

    const productId = input.value;

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          productId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const data = await fetch("/remove", options);
      const result = await data.json();

      if (result.message) {
        updateMessage(result.message, result.type);
      }
    } catch (err) {
      updateMessage(err.message, "error");
    }
  }
})();
