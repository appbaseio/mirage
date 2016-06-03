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
var ListQueryComponent = (function () {
    function ListQueryComponent() {
        this.newQuery = new core_1.EventEmitter();
        this.deleteQuery = new core_1.EventEmitter();
        this.clearAll = new core_1.EventEmitter();
    }
    ListQueryComponent.prototype.applyQuery = function (queryData) {
        this.newQuery.emit(queryData);
    };
    ListQueryComponent.prototype.applyDeleteQuery = function (index) {
        this.deleteQuery.emit(index);
    };
    ListQueryComponent.prototype.applyClearAll = function () {
        this.clearAll.emit(null);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ListQueryComponent.prototype, "savedQueryList", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ListQueryComponent.prototype, "newQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ListQueryComponent.prototype, "deleteQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ListQueryComponent.prototype, "clearAll", void 0);
    ListQueryComponent = __decorate([
        core_1.Component({
            selector: 'list-query',
            templateUrl: './app/features/list/list.query.component.html',
            inputs: ['savedQueryList', 'newQuery', 'deleteQuery', 'clearAll']
        }), 
        __metadata('design:paramtypes', [])
    ], ListQueryComponent);
    return ListQueryComponent;
}());
exports.ListQueryComponent = ListQueryComponent;
//# sourceMappingURL=list.query.component.js.map