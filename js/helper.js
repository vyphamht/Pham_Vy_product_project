"use strict";

function updateMessage(message, type) {
  const messagearea = document.getElementById("messagearea");
  messagearea.textContent = message;
  messagearea.setAttribute("class", type);
}

function clearMessage() {
  const messagearea = document.getElementById("messagearea");
  messagearea.textContent = "";
  messagearea.removeAttribute("class");
}
