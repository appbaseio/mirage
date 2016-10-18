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
var ErrorModalComponent = (function () {
    function ErrorModalComponent() {
        this.callback = new core_1.EventEmitter();
    }
    ErrorModalComponent.prototype.ngOnInit = function () {
        var self = this;
        this.errorHookHelp.applyEditor({
            lineNumbers: false,
            lineWrapping: true
        });
    };
    ErrorModalComponent.prototype.ngOnChanges = function () {
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ErrorModalComponent.prototype, "info", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ErrorModalComponent.prototype, "errorHookHelp", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ErrorModalComponent.prototype, "callback", void 0);
    ErrorModalComponent = __decorate([
        core_1.Component({
            selector: 'error-modal',
            templateUrl: './app/features/modal/error-modal.component.html',
            inputs: ['callback']
        }), 
        __metadata('design:paramtypes', [])
    ], ErrorModalComponent);
    return ErrorModalComponent;
}());
exports.ErrorModalComponent = ErrorModalComponent;
//# sourceMappingURL=error-modal.component.js.map