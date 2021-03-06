humansByTab = {}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  var u = parseUri(tab.url), site = "http://" + u.host;
  if (u.port && u.port.strlen) site += ":" + u.port
  if (humansByTab[tab.id] && humansByTab[tab.id].site == site) return showPageAction(tab); // already cached
  loadHumans(site, function(text, link) {
    showPageAction(tab);
    humansByTab[tab.id] = {
      site: site,
      text: text,
      link: link
    }
  }, function() {
    hidePageAction(tab);
  });
});

function showPageAction(tab) {
  chrome.pageAction.show(tab.id);
  chrome.pageAction.setIcon({
    tabId: tab.id,
    path: "h.jpg"
  });
}

function hidePageAction(tab) {
  delete humansByTab[tab.id];
  chrome.pageAction.hide(tab.id);
}

chrome.tabs.onRemoved.addListener(function(tabId) {
  delete humansByTab[tabId];
});
