function loadHumans(site, path, success, error) {
  var url = site + path;

  if(u.protocol.indexOf("http") !== -1) { // HTTP(S) links only

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
          return success(content, url);
        });
      } else {
        if (response.status == 404) {
          step += 1;
          return callHumans();
        } else {
          error(site, url);
        }
      }
    }).catch(function(error) {
      console.log("Il y a eu un problème avec l’opération fetch: " + error.message);
      error(site, url);
    });

  }
}
