System.register(["@angular/core"], function(exports_1, context_1) {
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
    var core_1;
    var SaveQueryComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SaveQueryComponent = (function () {
                function SaveQueryComponent() {
                    this.query_info = {
                        name: '',
                        tag: ''
                    };
                }
                SaveQueryComponent.prototype.openModal = function () {
                    $('#saveQueryModal').modal('show');
                };
                SaveQueryComponent.prototype.save = function () {
                    var queryData = {
                        mapping: this.mapping,
                        config: this.config,
                        name: this.query_info.name,
                        tag: this.query_info.tag
                    };
                    this.queryList.push(queryData);
                    try {
                        window.localStorage.setItem('queryList', JSON.stringify(this.queryList));
                    }
                    catch (e) { }
                    console.log(this.queryList);
                };
                SaveQueryComponent = __decorate([
                    core_1.Component({
                        selector: 'save-query',
                        templateUrl: './app/features/save/save.query.component.html',
                        inputs: ['config', 'mapping', 'queryList']
                    }), 
                    __metadata('design:paramtypes', [])
                ], SaveQueryComponent);
                return SaveQueryComponent;
            }());
            exports_1("SaveQueryComponent", SaveQueryComponent);
        }
    }
});
//# sourceMappingURL=save.query.component.js.map