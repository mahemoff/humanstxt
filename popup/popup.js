function onError(error) {
  console.log(`Error: ${error}`);
}

function loadText(tab) {
  var humans = chrome.extension.getBackgroundPage().humansByTab[tab.id];
  if (humans) {
    var finalText = Autolinker.link(
      humans.text,
      {
        mention: "twitter",
        hashtag: "twitter"
      });


    finalText = "<div>" + finalText + "</div>";

    // https://devtidbits.com/2017/12/06/quick-fix-the-unsafe_var_assignment-warning-in-javascript/
    const parser = new DOMParser()
    const parsed = parser.parseFromString(finalText, 'text/html')
    const tag = parsed.getElementsByTagName('body')[0]

    document.getElementById("humansText").innerHTML = '';
    document.getElementById("humansText").appendChild(tag.firstChild);
    document.getElementById("humansLink").setAttribute("href", humans.link);
  } else {
    document.getElementById("humansText").textContent = "No humans were detected.";
  }
};

chrome.tabs.query({active: true, currentWindow: true}, function(result) {
  result.forEach(function(tab){loadText(tab)});
});

// ASCII ART MODE
document.getElementById("asciiModeToggle").addEventListener('click', function(){
  document.getElementById("humansText").classList.toggle("ascii_mode");
});
