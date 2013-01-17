$(function() {
  chrome.tabs.getSelected(null, function(tab) {
    var humans = chrome.extension.getBackgroundPage().humansByTab[tab.id];
    if (humans) {
      $("#humansText").text(humans.text);
      $("#humansLink").attr("href", humans.link).show();
    }
  });
});
