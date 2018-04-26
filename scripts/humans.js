function loadHumans(url, success, error) {

  var u = parseUri(url),
      humansLink = u.protocol + "://" + u.host + "/humans.txt";

  if(u.protocol == "http" || u.protocol == "https") { // we want to avoid problems with chrome://
    request(humansLink, function (err, response) {
      if (err) {
        error(url, humansLink);
      } else {
        success(response, humansLink);
      }
    });
  }
}

function mapifyHeaders(responseHeaders) {
  var arr = responseHeaders.trim().split(/[\r\n]+/),
      headerMap = {};
  arr.forEach(function (line) {
    var parts = line.split(': ');
    var header = parts.shift();
    var value = parts.join(': ');
    headerMap[header] = value;
  });
  return headerMap;
}

function request(url, next) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.send();

  request.addEventListener("load", function () {
    var headerMap = mapifyHeaders(request.getAllResponseHeaders());
    var contentType = headerMap["Content-Type"] || headerMap["content-type"];
    if (request.status < 200 && request.status >= 400) {
      return next(new Error("We reached our target server, but it returned an error."));
    }
    return (/text\/plain/.test(contentType)) ? next(null, request.responseText) : next(new Error("Wrong type of thing"));
  });
  request.addEventListener("error", function () {
    return next(new Error("There was a connection error of some sort."));
  });
}

