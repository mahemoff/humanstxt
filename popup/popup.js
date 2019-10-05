function onError(error) {
  console.log(`Error: ${error}`);
}

function loadText(tab) {

  chrome.runtime.sendMessage({ action: "loadHumans", tab: tab }, function (response) {

    if (response && response.content) {
      var finalText = markdown_parser(
        Autolinker.link(response.content, {
          mention: "twitter",
          hashtag: "twitter"
        })
      );

      finalText = "<div>" + finalText + "</div>";
      fillDocument(finalText, response.url);

    } else {
      document.querySelector("#humansText").textContent = "No humans were detected.";
    }

  });
};

function fillDocument(finalText, link) {
  // https://devtidbits.com/2017/12/06/quick-fix-the-unsafe_var_assignment-warning-in-javascript/
  const parser = new DOMParser();
  const parsed = parser.parseFromString(finalText, 'text/html');
  const tag = parsed.querySelector('body');

  document.querySelector("#humansText").innerHTML = '';
  document.querySelector("#humansText").appendChild(tag.firstChild);
  document.querySelector("#humansLink").setAttribute("href", link);
  document.querySelector("#humansLink").setAttribute("title", link);
}

chrome.tabs.query({ active: true, currentWindow: true }, function (result) {
  result.forEach(function (tab) { loadText(tab) });
});

// ASCII ART MODE

function onGot(item) {
  // If the ASCII Art option is enabled, turn the mode on in the page
  if (item.ascii_mode) {
    document.querySelector("#humansText").classList.toggle("ascii_mode");
    document.querySelector("#asciiModeToggle").checked = true;
  }
}

function contentLoaded() {
  if (typeof browser == "undefined") {
    var getting = chrome.storage.local.get("ascii_mode", onGot);
  } else {
    var getting = browser.storage.local.get("ascii_mode");
    getting.then(onGot, onError);
  }

  document.querySelector("#asciiModeToggle").addEventListener("change", function () {
    document.querySelector("#humansText").classList.toggle("ascii_mode");
  });
}

document.addEventListener("DOMContentLoaded", contentLoaded);
