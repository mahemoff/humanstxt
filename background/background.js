humansByTab = {}

var step = 0;
var currentTab;
var u;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  step = 0;
  currentTab = tab;

  u = parseUri(tab.url),
      site = u.protocol + "://" + u.host;
  if (u.port && u.port.strlen) site += ":" + u.port;
  if (humansByTab[tab.id] && humansByTab[tab.id].site == site) return showPageAction(tab); // already cached
  callHumans();
});

function callHumans() {
  site = u.protocol + "://" + u.host;
  if (u.port && u.port.strlen) site += ":" + u.port;
  pathAsArray = u.path.split("/");

  if(step == 0){
    path = "/";
  } else if(step == pathAsArray.length) {
    hidePageAction(currentTab);
    console.log("ok")
  } else {
    path = "";
    for (var i = 0; i < pathAsArray.length; i++) {
      path += pathAsArray[i] + "/";
    }
  }
  path += "humans.txt";



  loadHumans(site, path,
    function(text, link) {
      showPageAction(currentTab);
      humansByTab[currentTab.id] = {
        site: site,
        text: text,
        link: link
      }
    }, function() {
      hidePageAction(currentTab);
    }
  );
}

function showPageAction(tab) {
  chrome.pageAction.show(tab.id);
  chrome.pageAction.setIcon({
    tabId: tab.id,
    path: "../icons/icon-48.png"
  });
}

function hidePageAction(tab) {
  delete humansByTab[tab.id];
  chrome.pageAction.setIcon({
    tabId: tab.id,
    path: "../icons/icon-48.png"
  });
  chrome.pageAction.hide(tab.id);
}

chrome.tabs.onRemoved.addListener(function(tabId) {
  delete humansByTab[tabId];
});
