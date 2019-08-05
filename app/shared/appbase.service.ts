import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";
import "rxjs/add/operator/toPromise";
declare var Appbase;

function parse_url(url: string) {
  var pattern = RegExp(
    "^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"
  );
  var matches = url.match(pattern);
  var hasAuth = matches[4].indexOf("@") > -1;
  var href = "";
  var auth = "";
  var username = "";
  var password = "";
  if (hasAuth) {
    var urlSplit = matches[4].split("@");
    auth = urlSplit[0];
    href = matches[2] + "://" + urlSplit[1];
    var authSplit = auth.split(":");
    username = authSplit[0];
    password = authSplit[1];
  } else {
    href = matches[2] + "://" + matches[4];
  }

  return {
    scheme: matches[2],
    href: href,
    auth: auth,
    path: matches[5],
    query: matches[7],
    fragment: matches[9],
    username: username,
    password: password
  };
}

@Injectable()
export class AppbaseService {
  constructor(private http: Http) {}
  public requestParam: any = {
    url: null,
    auth: null
  };
  public config: any = {
    username: null,
    password: null
  };
  public appbaseRef: any;
  public resultStream: any = null;
  public version: number = 5;

  setVersion(version: number) {
    this.version = version;
  }

  setAppbase(config: any) {
    var parsedUrl = parse_url(config.url);
    this.config.username = parsedUrl.username;
    this.config.password = parsedUrl.password;
    this.requestParam.pureurl = parsedUrl.href;
    if (config.appname) {
      this.requestParam.url = config.url + "/" + config.appname;
    } else {
      this.requestParam.url = config.url;
    }

    let appbaseRef: any = {
      url: parsedUrl.href,
      app: config.appname
    };
    console.log("setting up appbase");
    if (parsedUrl.username) {
      appbaseRef.credentials = `${parsedUrl.username}:${parsedUrl.password}`;
      this.requestParam.auth =
        "Basic " + btoa(parsedUrl.username + ":" + parsedUrl.password);
    } else {
      this.requestParam.auth = "";
    }

    this.appbaseRef = new Appbase(appbaseRef);
  }
  get(path: string) {
    let headersObj: any = {
      "Content-Type": "application/json;charset=UTF-8"
    };

    if (this.requestParam.auth) {
      headersObj.Authorization = this.requestParam.auth;
    }

    let headers = new Headers(headersObj);
    var request_url = this.requestParam.url.replace(
      this.config.username + ":" + this.config.password + "@",
      ""
    );
    var request_path = request_url + path + "/";
    return this.http.get(request_path, { headers: headers }).toPromise();
  }
  getMappings() {
    var self = this;
    return new Promise((resolve, reject) => {
      getRequest("/_mapping")
        .then(function(res) {
          let mappingData = res.json();
          getRequest("/_alias")
            .then(function(res) {
              let aliasData = res.json();
              for (let index in aliasData) {
                for (let alias in aliasData[index].aliases) {
                  mappingData[alias] = mappingData[index];
                }
              }

              if (self.version > 6) {
                console.log("=> v > 6 setting mapping");
                mappingData = {
                  [self.appbaseRef.appname]: {
                    mappings: {
                      _doc: mappingData[self.appbaseRef.appname].mappings
                    }
                  }
                };
              }
              resolve(mappingData);
            })
            .catch(function(e) {
              // this fix needs to be there for v7
              if (self.version > 6) {
                mappingData = {
                  [self.appbaseRef.appname]: {
                    mappings: {
                      _doc: mappingData[self.appbaseRef.appname].mappings
                    }
                  }
                };
              }
              console.log("mappingData1", mappingData, self);
              resolve(mappingData);
            });
        })
        .catch(function(e) {
          reject(e);
        });
    });

    function getRequest(path) {
      let headersObj: any = {
        "Content-Type": "application/json;charset=UTF-8"
      };

      if (self.requestParam.auth) {
        headersObj.Authorization = self.requestParam.auth;
      }

      let headers = new Headers(headersObj);
      var request_url = self.requestParam.url.replace(
        self.config.username + ":" + self.config.password + "@",
        ""
      );
      var request_path = request_url + path + "/";
      console.log(request_path);
      return self.http.get(request_path, { headers: headers }).toPromise();
    }
  }
  getVersion() {
    let headersObj: any = {
      "Content-Type": "application/json;charset=UTF-8"
    };

    if (this.requestParam.auth) {
      headersObj.Authorization = this.requestParam.auth;
    }

    let headers = new Headers(headersObj);
    var request_url = this.requestParam.url.replace(
      this.config.username + ":" + this.config.password + "@",
      ""
    );
    var request_path = request_url + "/_settings";
    console.log(request_path);
    return this.http.get(request_path, { headers: headers }).toPromise();
  }
  post(path: string, data: any) {
    let requestData = JSON.stringify(data);
    let headersObj: any = {
      "Content-Type": "application/json;charset=UTF-8"
    };

    if (this.requestParam.auth) {
      headersObj.Authorization = this.requestParam.auth;
    }

    let headers = new Headers(headersObj);
    return this.http
      .post(this.requestParam.url + path, requestData, {
        headers: headers
      })
      .toPromise();
  }
  posturl(url: string, data: any) {
    let requestData = JSON.stringify(data);
    let headersObj: any = {
      "Content-Type": "application/json;charset=UTF-8"
    };

    if (this.requestParam.auth) {
      headersObj.Authorization = this.requestParam.auth;
    }

    let headers = new Headers(headersObj);
    return this.http.post(url, requestData, { headers: headers }).toPromise();
  }
  put(path: string, data: any) {
    let headersObj: any = {
      "Content-Type": "application/json;charset=UTF-8"
    };

    if (this.requestParam.auth) {
      headersObj.Authorization = this.requestParam.auth;
    }

    let headers = new Headers(headersObj);
    return this.http
      .put(this.requestParam.url + path, data, { headers: headers })
      .toPromise();
  }
  delete(path: string) {
    let headersObj: any = {
      "Content-Type": "application/json;charset=UTF-8"
    };

    if (this.requestParam.auth) {
      headersObj.Authorization = this.requestParam.auth;
    }

    let headers = new Headers(headersObj);
    return this.http
      .delete(this.requestParam.url + path, { headers: headers })
      .toPromise();
  }
  public handleError(error: any) {
    console.error("An error occurred", error);
  }
  getIndices(url: string) {
    var temp_config = this.filterurl(url);
    this.setAppbase(temp_config);
    return this.get("/_stats/indices");
  }
  filterurl(url: string) {
    if (url) {
      var parsedUrl = parse_url(url);
      var obj = {
        username: parsedUrl.username,
        password: parsedUrl.password,
        url: parsedUrl.href
      };
      return obj;
    } else {
      return null;
    }
  }
  searchStream(type, body) {
    if (this.resultStream) {
      this.resultStream.stop();
    }
    this.resultStream = this.appbaseRef.searchStream({
      type: type,
      body: body
    });
    return this.resultStream;
  }
}
