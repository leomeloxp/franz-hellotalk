"use strict";

const { remote } = require("electron");

const path = require("path");

const webContents = remote.getCurrentWebContents();
const { session } = webContents;
setTimeout(() => {
  if (document.querySelector("body").innerHTML.includes("Google Chrome 36+")) {
    window.location.reload();
  }
}, 1000);
window.addEventListener("beforeunload", async () => {
  try {
    session.flushStorageData();
    session.clearStorageData({
      storages: [
        "appcache",
        "serviceworkers",
        "cachestorage",
        "websql",
        "indexdb"
      ]
    });
    const registrations = await window.navigator.serviceWorker.getRegistrations();
    registrations.forEach(r => {
      r.unregister();
      console.log("ServiceWorker unregistered");
    });
  } catch (err) {
    console.err(err);
  }
});

module.exports = Franz => {
  const getMessages = function getMessages() {
    let count = 0;
    for (const [_, s] of document
      .querySelectorAll(".userItem .newMsgCount span")
      .entries()) {
      count += parseInt(s.innerText, 10);
    }

    Franz.setBadge(count);
  };

  Franz.injectCSS(path.join(__dirname, "service.css"));
  Franz.loop(getMessages);
};
