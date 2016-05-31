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
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
require('rxjs/add/operator/toPromise');
var AppbaseService = (function () {
    function AppbaseService(http, jsonp) {
        this.http = http;
        this.jsonp = jsonp;
        this.requestParam = {
            url: null,
            auth: null
        };
    }
    AppbaseService.prototype.setAppbase = function (config) {
        this.requestParam.url = config.url + '/' + config.appname;
        this.requestParam.auth = "Basic " + btoa(config.username + ':' + config.password);
    };
    AppbaseService.prototype.get = function (path) {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': this.requestParam.auth
        });
        return this.http.get(this.requestParam.url + path, { headers: headers }).toPromise();
    };
    AppbaseService.prototype.post = function (path, data) {
        var requestData = JSON.stringify(data);
        var headers = new http_1.Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': this.requestParam.auth
        });
        return this.http.post(this.requestParam.url + path, requestData, { headers: headers }).toPromise();
    };
    AppbaseService.prototype.put = function (path, data) {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': this.requestParam.auth
        });
        return this.http.put(this.requestParam.url + path, data, { headers: headers }).toPromise();
    };
    AppbaseService.prototype.delete = function (path) {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': this.requestParam.auth
        });
        return this.http.delete(this.requestParam.url + path, { headers: headers }).toPromise();
    };
    AppbaseService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
    };
    AppbaseService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, http_1.Jsonp])
    ], AppbaseService);
    return AppbaseService;
}());
exports.AppbaseService = AppbaseService;
//# sourceMappingURL=appbase.service.js.map