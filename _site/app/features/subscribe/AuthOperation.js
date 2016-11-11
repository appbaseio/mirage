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
var http_1 = require('@angular/http');
var storage_service_1 = require("../../shared/storage.service");
var AuthOperation = (function () {
    function AuthOperation(http, storageService) {
        this.http = http;
        this.storageService = storageService;
        this.updateStatus = new core_1.EventEmitter();
        this.serverAddress = 'https://ossauth.appbase.io';
        this.access_token_applied = false;
    }
    AuthOperation.prototype.ngOnInit = function () {
        var authConfig = {
            domain: 'appbaseio.auth0.com',
            clientID: 'tCy6GxnrsyKec3UxXCuYLhU6XWFCMgRD',
            callbackURL: location.href,
            callbackOnLocationHash: true
        };
        this.auth0 = new Auth0(authConfig);
        // check if already logged in
        this.init.call(this);
    };
    AuthOperation.prototype.init = function () {
        var self = this;
        this.parseHash.call(this);
        var parseHash = this.parseHash.bind(this);
        setTimeout(function () {
            console.log('hash watching Activated!');
            window.onhashchange = function () {
                if (!self.access_token_applied && location.hash.indexOf('access_token') > -1) {
                    console.log('access_token found!');
                    parseHash();
                }
            };
        }, 300);
    };
    AuthOperation.prototype.isTokenExpired = function (token) {
        var decoded = this.auth0.decodeJwt(token);
        var now = (new Date()).getTime() / 1000;
        return decoded.exp < now;
    };
    AuthOperation.prototype.login = function (subscribeOption) {
        var savedState = window.location.hash;
        this.storageService.set('subscribeOption', subscribeOption);
        if (savedState.indexOf('access_token') < 0) {
            this.storageService.set('savedState', savedState);
        }
        this.auth0.login({
            connection: 'github'
        }, function (err) {
            if (err)
                console.log("something went wrong: " + err.message);
        });
    };
    AuthOperation.prototype.show_logged_in = function (token) {
        this.token = token;
        if (window.location.hash.indexOf('access_token') > -1) {
            this.access_token_applied = true;
            this.restoreStates();
        }
        else {
            this.getUserProfile();
        }
    };
    AuthOperation.prototype.show_sign_in = function () { };
    AuthOperation.prototype.restoreStates = function () {
        var domain = location.href.split('#')[0];
        var savedState = this.storageService.get('savedState');
        var finalPath = domain;
        if (savedState && savedState.indexOf('access_token') < 0) {
            finalPath += savedState;
        }
        else {
            finalPath += '#';
        }
        window.location.href = finalPath;
        location.reload();
    };
    AuthOperation.prototype.getUserProfile = function () {
        var url = this.serverAddress + '/api/getUserProfile';
        var subscribeOption = this.storageService.get('subscribeOption') && this.storageService.get('subscribeOption') !== 'null' ? this.storageService.get('subscribeOption') : null;
        var request = {
            token: this.storageService.get('mirage_id_token'),
            origin_app: 'MIRAGE',
            email_preference: subscribeOption
        };
        $.ajax({
            type: 'POST',
            url: url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(request)
        })
            .done(function (res) {
            this.storageService.set('subscribeOption', null);
            this.updateStatus.emit({ 'profile': res.message });
        }.bind(this))
            .fail(function (err) {
            console.error(err);
        });
    };
    AuthOperation.prototype.parseHash = function () {
        var token = this.storageService.get('mirage_id_token');
        if (token !== null && !this.isTokenExpired(token)) {
            this.show_logged_in(token);
        }
        else {
            var result = this.auth0.parseHash(window.location.hash);
            if (result && result.idToken) {
                this.storageService.set('mirage_id_token', result.idToken);
                this.show_logged_in(result.idToken);
            }
            else if (result && result.error) {
                console.log('error: ' + result.error);
                this.show_sign_in();
            }
            else {
                this.show_sign_in();
            }
        }
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AuthOperation.prototype, "updateStatus", void 0);
    AuthOperation = __decorate([
        core_1.Component({
            selector: 'auth-operation',
            template: ''
        }), 
        __metadata('design:paramtypes', [http_1.Http, storage_service_1.StorageService])
    ], AuthOperation);
    return AuthOperation;
}());
exports.AuthOperation = AuthOperation;
//# sourceMappingURL=AuthOperation.js.map