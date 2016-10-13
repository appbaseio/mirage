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
        this.sort = new core_1.EventEmitter();
        this.searchList = new core_1.EventEmitter();
        this.direction = false;
    }
    ListQueryComponent.prototype.ngOnInit = function () { };
    ListQueryComponent.prototype.applyQuery = function (currentQuery) {
        var queryData = this.savedQueryList.filter(function (query) {
            return query.name === currentQuery.name && query.tag === currentQuery.tag;
        });
        if (queryData.length) {
            this.newQuery.emit(queryData[0]);
        }
    };
    ListQueryComponent.prototype.applyDeleteQuery = function (query) {
        this.deleteQuery.emit(query);
    };
    ListQueryComponent.prototype.applyClearAll = function () {
        this.clearAll.emit(null);
    };
    ListQueryComponent.prototype.applySearchList = function () {
        this.searchList.emit({
            searchTerm: this.searchTerm,
            searchByMethod: this.searchByMethod
        });
    };
    ListQueryComponent.prototype.tagApply = function (event, tag, searchByMethod) {
        this.searchTerm = tag;
        this.searchByMethod = searchByMethod;
        this.applySearchList();
        event.stopPropagation();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ListQueryComponent.prototype, "savedQueryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ListQueryComponent.prototype, "sort_by", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ListQueryComponent.prototype, "sort_direction", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ListQueryComponent.prototype, "searchTerm", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ListQueryComponent.prototype, "filteredQuery", void 0);
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
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ListQueryComponent.prototype, "sort", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ListQueryComponent.prototype, "searchList", void 0);
    ListQueryComponent = __decorate([
        core_1.Component({
            selector: 'list-query',
            templateUrl: './app/features/list/list.query.component.html',
            inputs: ['newQuery', 'deleteQuery', 'clearAll', 'searchByMethod']
        }), 
        __metadata('design:paramtypes', [])
    ], ListQueryComponent);
    return ListQueryComponent;
}());
exports.ListQueryComponent = ListQueryComponent;
//# sourceMappingURL=list.query.component.js.map