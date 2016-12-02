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
var AuthOperation_1 = require('../subscribe/AuthOperation');
var storage_service_1 = require("../../shared/storage.service");
var LearnModalComponent = (function () {
    function LearnModalComponent(http, storageService) {
        this.http = http;
        this.storageService = storageService;
        this.saveQuery = new core_1.EventEmitter();
        this.newQuery = new core_1.EventEmitter();
        this.queries = [];
        this.subscribeOption = "major";
        this.profile = null;
        this.serverAddress = 'https://ossauth.appbase.io';
        this.updateStatus = this.updateStatus.bind(this);
    }
    LearnModalComponent.prototype.loadLearn = function () {
        var self = this;
        this.http.get('./app/shared/default.data.json').toPromise().then(function (res) {
            var data = res.json();
            data.queries.forEach(function (query) {
                self.saveQuery.emit(query);
            });
            setTimeout(function () {
                self.newQuery.emit(data.queries[0]);
            }, 500);
            $('#learnModal').modal('hide');
            $('#learnInfoModal').modal('show');
        }).catch(function (e) {
            console.log(e);
        });
    };
    LearnModalComponent.prototype.updateStatus = function (info) {
        this.profile = info.profile;
    };
    LearnModalComponent.prototype.subscribe = function () {
        this.authOperation.login(this.subscribeOption);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LearnModalComponent.prototype, "saveQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LearnModalComponent.prototype, "newQuery", void 0);
    __decorate([
        core_1.ViewChild(AuthOperation_1.AuthOperation), 
        __metadata('design:type', AuthOperation_1.AuthOperation)
    ], LearnModalComponent.prototype, "authOperation", void 0);
    LearnModalComponent = __decorate([
        core_1.Component({
            selector: 'learn-modal',
            templateUrl: './app/features/learn/learn.component.html',
            inputs: ['saveQuery', 'newQuery']
        }), 
        __metadata('design:paramtypes', [http_1.Http, storage_service_1.StorageService])
    ], LearnModalComponent);
    return LearnModalComponent;
}());
exports.LearnModalComponent = LearnModalComponent;
//# sourceMappingURL=learn.component.js.map