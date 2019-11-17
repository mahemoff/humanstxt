const checkboxes = document.querySelectorAll('.pref_checkbox');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', (e) => {
    chrome.storage.local.set({
      ascii_mode: document.querySelector('#asciiModeToggle').checked,
      dev_mode: document.querySelector('#devModeToggle').checked,
    });
  });
});

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector('#asciiModeToggle').checked = result.ascii_mode || false;
    document.querySelector('#devModeToggle').checked = result.dev_mode || false;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  if(typeof browser == 'undefined'){ // Chrome doesn’t like promises
    var getting = chrome.storage.local.get(['ascii_mode', 'dev_mode'], setCurrentChoice);
  } else { // Firefox does, tho
    var getting = browser.storage.local.get(['ascii_mode', 'dev_mode']);
    getting.then(setCurrentChoice, onError);
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);