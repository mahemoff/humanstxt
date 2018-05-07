function loadHumans(site, path, success, error) {
  humansLink = site + path;

  if(u.protocol.indexOf("http") !== -1) { // HTTP(S) links only
    request(humansLink, function (response, err, status) {
      if (status && status == 404) {
        step += 1;
        return callHumans();
      } else if (err) {
        error(site, humansLink);
      } else {
        success(response, humansLink);
      }
    });
  }
}

function request(url, next) {

  var myHeaders = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    "Accept-Charset": "utf-8"
  });
  var myInit = { method: 'GET', headers: myHeaders };

  fetch(url, myInit).then(function(response) {
    var contentType = response.headers.get("content-type");
    console.log(response);
    if(contentType && contentType.indexOf("text/plain") !== -1) {
      return response.text().then(function(content) {
        return next(content)
      });
    } else {
      return next(null, new Error("There was an error of some sort."), response.status);
    }
  }).catch(function(error) {
    console.log("Il y a eu un problème avec l’opération fetch: " + error.message);
    return next(null, new Error("There was an error of some sort: " + error.message));
  });

}

