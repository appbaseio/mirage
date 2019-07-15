"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
function parse_url(url) {
    var pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
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
    }
    else {
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
var AppbaseService = (function () {
    function AppbaseService(http) {
        this.http = http;
        this.requestParam = {
            url: null,
            auth: null
        };
        this.config = {
            username: null,
            password: null
        };
        this.resultStream = null;
        this.version = 5;
    }
    AppbaseService.prototype.setVersion = function (version) {
        this.version = version;
    };
    AppbaseService.prototype.setAppbase = function (config) {
        var parsedUrl = parse_url(config.url);
        this.config.username = parsedUrl.username;
        this.config.password = parsedUrl.password;
        this.requestParam.pureurl = parsedUrl.href;
        if (config.appname) {
            this.requestParam.url = config.url + "/" + config.appname;
        }
        else {
            this.requestParam.url = config.url;
        }
        var appbaseRef = {
            url: parsedUrl.href,
            app: config.appname
        };
        console.log("setting up appbase");
        if (parsedUrl.username) {
            appbaseRef.credentials = parsedUrl.username + ":" + parsedUrl.password;
            this.requestParam.auth =
                "Basic " + btoa(parsedUrl.username + ":" + parsedUrl.password);
        }
        else {
            this.requestParam.auth = "";
        }
        this.appbaseRef = new Appbase(appbaseRef);
    };
    AppbaseService.prototype.get = function (path) {
        var headersObj = {
            "Content-Type": "application/json;charset=UTF-8"
        };
        if (this.requestParam.auth) {
            headersObj.Authorization = this.requestParam.auth;
        }
        var headers = new http_1.Headers(headersObj);
        var request_url = this.requestParam.url.replace(this.config.username + ":" + this.config.password + "@", "");
        var request_path = request_url + path + "/";
        return this.http.get(request_path, { headers: headers }).toPromise();
    };
    AppbaseService.prototype.getMappings = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            getRequest("/_mapping")
                .then(function (res) {
                var mappingData = res.json();
                getRequest("/_alias")
                    .then(function (res) {
                    var aliasData = res.json();
                    for (var index in aliasData) {
                        for (var alias in aliasData[index].aliases) {
                            mappingData[alias] = mappingData[index];
                        }
                    }
                    resolve(mappingData);
                })
                    .catch(function (e) {
                    // this fix needs to be there for v7
                    if (self.version > 6) {
                        mappingData = (_a = {},
                            _a[self.appbaseRef.appname] = {
                                mappings: {
                                    _doc: mappingData[self.appbaseRef.appname].mappings
                                }
                            },
                            _a
                        );
                    }
                    console.log("mappingData1", mappingData, self);
                    resolve(mappingData);
                    var _a;
                });
            })
                .catch(function (e) {
                reject(e);
            });
        });
        function getRequest(path) {
            var headersObj = {
                "Content-Type": "application/json;charset=UTF-8"
            };
            if (self.requestParam.auth) {
                headersObj.Authorization = self.requestParam.auth;
            }
            var headers = new http_1.Headers(headersObj);
            var request_url = self.requestParam.url.replace(self.config.username + ":" + self.config.password + "@", "");
            var request_path = request_url + path + "/";
            console.log(request_path);
            return self.http.get(request_path, { headers: headers }).toPromise();
        }
    };
    AppbaseService.prototype.getVersion = function () {
        var headersObj = {
            "Content-Type": "application/json;charset=UTF-8"
        };
        if (this.requestParam.auth) {
            headersObj.Authorization = this.requestParam.auth;
        }
        var headers = new http_1.Headers(headersObj);
        var request_url = this.requestParam.url.replace(this.config.username + ":" + this.config.password + "@", "");
        var request_path = request_url + "/_settings";
        console.log(request_path);
        return this.http.get(request_path, { headers: headers }).toPromise();
    };
    AppbaseService.prototype.post = function (path, data) {
        var requestData = JSON.stringify(data);
        var headersObj = {
            "Content-Type": "application/json;charset=UTF-8"
        };
        if (this.requestParam.auth) {
            headersObj.Authorization = this.requestParam.auth;
        }
        var headers = new http_1.Headers(headersObj);
        return this.http
            .post(this.requestParam.url + path, requestData, {
            headers: headers
        })
            .toPromise();
    };
    AppbaseService.prototype.posturl = function (url, data) {
        var requestData = JSON.stringify(data);
        var headersObj = {
            "Content-Type": "application/json;charset=UTF-8"
        };
        if (this.requestParam.auth) {
            headersObj.Authorization = this.requestParam.auth;
        }
        var headers = new http_1.Headers(headersObj);
        return this.http.post(url, requestData, { headers: headers }).toPromise();
    };
    AppbaseService.prototype.put = function (path, data) {
        var headersObj = {
            "Content-Type": "application/json;charset=UTF-8"
        };
        if (this.requestParam.auth) {
            headersObj.Authorization = this.requestParam.auth;
        }
        var headers = new http_1.Headers(headersObj);
        return this.http
            .put(this.requestParam.url + path, data, { headers: headers })
            .toPromise();
    };
    AppbaseService.prototype.delete = function (path) {
        var headersObj = {
            "Content-Type": "application/json;charset=UTF-8"
        };
        if (this.requestParam.auth) {
            headersObj.Authorization = this.requestParam.auth;
        }
        var headers = new http_1.Headers(headersObj);
        return this.http
            .delete(this.requestParam.url + path, { headers: headers })
            .toPromise();
    };
    AppbaseService.prototype.handleError = function (error) {
        console.error("An error occurred", error);
    };
    AppbaseService.prototype.getIndices = function (url) {
        var temp_config = this.filterurl(url);
        this.setAppbase(temp_config);
        return this.get("/_stats/indices");
    };
    AppbaseService.prototype.filterurl = function (url) {
        if (url) {
            var parsedUrl = parse_url(url);
            var obj = {
                username: parsedUrl.username,
                password: parsedUrl.password,
                url: parsedUrl.href
            };
            return obj;
        }
        else {
            return null;
        }
    };
    AppbaseService.prototype.searchStream = function (type, body) {
        if (this.resultStream) {
            this.resultStream.stop();
        }
        this.resultStream = this.appbaseRef.searchStream({
            type: type,
            body: body
        });
        return this.resultStream;
    };
    AppbaseService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AppbaseService);
    return AppbaseService;
}());
exports.AppbaseService = AppbaseService;
//# sourceMappingURL=appbase.service.js.map