System.register(["@angular/core", "./time/time.component"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, time_component_1;
    var ListQueryComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (time_component_1_1) {
                time_component_1 = time_component_1_1;
            }],
        execute: function() {
            ListQueryComponent = (function () {
                function ListQueryComponent() {
                    this.newQuery = new core_1.EventEmitter();
                    this.deleteQuery = new core_1.EventEmitter();
                    this.clearAll = new core_1.EventEmitter();
                    this.sort = new core_1.EventEmitter();
                    this.searchList = new core_1.EventEmitter();
                    this.direction = false;
                }
                ListQueryComponent.prototype.ngOnInit = function () { };
                ListQueryComponent.prototype.applyQuery = function (queryData) {
                    this.newQuery.emit(queryData);
                };
                ListQueryComponent.prototype.applyDeleteQuery = function (index) {
                    this.deleteQuery.emit(index);
                };
                ListQueryComponent.prototype.applyClearAll = function () {
                    this.clearAll.emit(null);
                };
                ListQueryComponent.prototype.applySearchList = function () {
                    this.searchList.emit(this.searchTerm);
                };
                ListQueryComponent.prototype.tagApply = function (event, tag) {
                    this.searchTerm = tag;
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
                        inputs: ['savedQueryList', 'newQuery', 'deleteQuery', 'clearAll'],
                        directives: [time_component_1.TimeComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], ListQueryComponent);
                return ListQueryComponent;
            }());
            exports_1("ListQueryComponent", ListQueryComponent);
        }
    }
});
//# sourceMappingURL=list.query.component.js.map