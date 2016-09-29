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
var ConfirmModalComponent = (function () {
    function ConfirmModalComponent() {
        this.callback = new core_1.EventEmitter();
    }
    ConfirmModalComponent.prototype.ngOnInit = function () {
    };
    ConfirmModalComponent.prototype.ngOnChanges = function () {
    };
    ConfirmModalComponent.prototype.confirm = function (flag) {
        this.callback.emit(flag);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ConfirmModalComponent.prototype, "info", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ConfirmModalComponent.prototype, "callback", void 0);
    ConfirmModalComponent = __decorate([
        core_1.Component({
            selector: 'confirm-modal',
            templateUrl: './app/features/confirm/confirm-modal.component.html',
            inputs: ['info', 'callback'],
            directives: []
        }), 
        __metadata('design:paramtypes', [])
    ], ConfirmModalComponent);
    return ConfirmModalComponent;
}());
exports.ConfirmModalComponent = ConfirmModalComponent;
//# sourceMappingURL=confirm-modal.component.js.map