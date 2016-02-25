System.register(["angular2/core", "angular2/http", 'rxjs/Observable', 'rxjs/add/operator/map', 'rxjs/add/operator/catch'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, Observable_1;
    var MappingService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (_1) {},
            function (_2) {}],
        execute: function() {
            MappingService = (function () {
                function MappingService(http) {
                    this.http = http;
                }
                MappingService.prototype.getMapping = function (config) {
                    var headers = new http_1.Headers({ 'withCredentials': 'true' });
                    headers.append('Authorization', "Basic " + btoa(config.username + ':' + config.username));
                    var options = new http_1.RequestOptions({ headers: headers });
                    return this.http.get(config.url + '/' + config.appname + '/_mapping', options)
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                    // return Observable.fromPromise($.ajax({
                    //     type: 'GET',
                    //         beforeSend: function(request) {
                    //             request.setRequestHeader("Authorization", "Basic " + btoa(config.username + ':' + config.password));
                    //             },
                    //         url: config.url+'/'+config.appname+'/_mapping',
                    //         xhrFields: {
                    //                 withCredentials: true
                    //         })).map(this.mapper);                    
                };
                MappingService.prototype.getMapping1 = function (config) {
                    var configUrl = config.url + '/' + config.appname + '/_mapping';
                };
                MappingService.prototype._sendRequest = function (url, payLoad, type) {
                    return new Promise(function (resolve, reject) {
                        var req = new XMLHttpRequest();
                        req.open(type, url);
                        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                        req.onload = function () {
                            if (req.status == 200) {
                                resolve(JSON.parse(req.response));
                            }
                            else {
                                reject(JSON.parse(req.response));
                            }
                        };
                        req.onerror = function () {
                            reject(JSON.parse(req.response));
                        };
                        if (payLoad) {
                            req.send(JSON.stringify(payLoad));
                        }
                        else {
                            req.send(null);
                        }
                    });
                };
                MappingService.prototype.handleError = function (error) {
                    console.error(error);
                    return Observable_1.Observable.throw(error.json().error || 'Server error');
                };
                MappingService.prototype.mapper = function (response) {
                    return response.json();
                };
                MappingService.prototype.getHeroesSlowly = function () {
                    var HEROES = { 'name': 123 };
                    return new Promise(function (resolve) {
                        return setTimeout(function () { return resolve(HEROES); }, 2000);
                    } // 2 seconds
                     // 2 seconds
                    );
                };
                MappingService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], MappingService);
                return MappingService;
            })();
            exports_1("MappingService", MappingService);
        }
    }
});
//# sourceMappingURL=mapping.service.js.map