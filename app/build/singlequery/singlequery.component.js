System.register(["angular2/core"], function(exports_1, context_1) {
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
    var SinglequeryComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SinglequeryComponent = (function () {
                function SinglequeryComponent() {
                    this.queryList = this.queryList;
                    this.removeArray = [];
                    this.query = this.query;
                }
                SinglequeryComponent.prototype.removeQuery = function () {
                    console.log(this.internal, this.internalIndex);
                    this.internal.splice(this.internalIndex, 1);
                };
                SinglequeryComponent.prototype.analyzeTest = function () {
                    var self = this;
                    setTimeout(function () {
                        var field = self.mapping.resultQuery.availableFields[self.query.field];
                        self.query.analyzeTest = field.index === 'not_analyzed' ? 'not_analyzed' : 'analyzed';
                        self.query.type = field.type;
                    }, 300);
                };
                SinglequeryComponent = __decorate([
                    core_1.Component({
                        selector: 'single-query',
                        templateUrl: './app/build/singlequery/singlequery.component.html',
                        styleUrls: ['./app/build/singlequery/singlequery.component.css'],
                        inputs: ['mapping', 'config', 'query', 'queryList', 'addQuery', 'internal', 'internalIndex'],
                        directives: [SinglequeryComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], SinglequeryComponent);
                return SinglequeryComponent;
            }());
            exports_1("SinglequeryComponent", SinglequeryComponent);
        }
    }
});
//# sourceMappingURL=singlequery.component.js.map