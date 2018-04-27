function saveOptions(e) {
  e.preventDefault();
  chrome.storage.local.set({
    ascii_mode: document.querySelector("#asciiModeToggle").checked
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#asciiModeToggle").checked = result.ascii_mode || false;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  if(typeof browser == "undefined"){ // Chrome doesn’t like promises
    var getting = chrome.storage.local.get("ascii_mode", setCurrentChoice);
  } else { // Firefox does, tho
    var getting = browser.storage.local.get("ascii_mode");
    getting.then(setCurrentChoice, onError);
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#asciiModeToggle").addEventListener("change", saveOptions);