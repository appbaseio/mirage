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
var AuthOperation_1 = require('./AuthOperation');
var SubscribeModalComponent = (function () {
    function SubscribeModalComponent(http) {
        this.http = http;
        this.options = {
            option1: {
                value: 'major',
                text: 'New MIRAGE releases'
            },
            option2: {
                value: 'all',
                text: 'Limited major updates'
            }
        };
        this.subscribeOption = "major";
        this.profile = null;
        this.updateStatus = this.updateStatus.bind(this);
    }
    SubscribeModalComponent.prototype.open = function () {
        $('#subscribeModal').modal('show');
    };
    SubscribeModalComponent.prototype.updateStatus = function (info) {
        this.profile = info.profile;
    };
    SubscribeModalComponent.prototype.subscribe = function () {
        this.authOperation.login(this.subscribeOption);
    };
    __decorate([
        core_1.ViewChild(AuthOperation_1.AuthOperation), 
        __metadata('design:type', AuthOperation_1.AuthOperation)
    ], SubscribeModalComponent.prototype, "authOperation", void 0);
    SubscribeModalComponent = __decorate([
        core_1.Component({
            selector: 'subscribe-modal',
            templateUrl: './app/features/subscribe/subscribe.component.html'
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], SubscribeModalComponent);
    return SubscribeModalComponent;
}());
exports.SubscribeModalComponent = SubscribeModalComponent;
//# sourceMappingURL=subscribe.component.js.map