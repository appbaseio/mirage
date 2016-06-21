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
    var WildcardQuery;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            WildcardQuery = (function () {
                function WildcardQuery() {
                    this.getQueryFormat = new core_1.EventEmitter();
                    this.current_query = 'wildcard';
                    this.queryName = '*';
                    this.fieldName = '*';
                    this.information = {
                        title: 'wildcard query',
                        content: "<span class=\"description\"> wildcard query content </span>\n\t\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/2.3/query-dsl-missing-query.html\">Documentation</a>"
                    };
                    this.inputs = {
                        input: {
                            placeholder: 'Input',
                            value: ''
                        }
                    };
                    this.queryFormat = {};
                }
                WildcardQuery.prototype.ngOnInit = function () {
                    try {
                        if (this.appliedQuery[this.current_query][this.fieldName]) {
                            this.inputs.input.value = this.appliedQuery[this.current_query][this.fieldName];
                        }
                    }
                    catch (e) { }
                    this.getFormat();
                };
                WildcardQuery.prototype.ngOnChanges = function () {
                    if (this.selectedField != '') {
                        if (this.selectedField !== this.fieldName) {
                            this.fieldName = this.selectedField;
                            this.getFormat();
                        }
                    }
                    if (this.selectedQuery != '') {
                        if (this.selectedQuery !== this.queryName) {
                            this.queryName = this.selectedQuery;
                            this.getFormat();
                        }
                    }
                };
                // QUERY FORMAT
                /*
                    Query Format for this query is
                    @queryName: {
                        @fieldName: @value
                    }
                */
                WildcardQuery.prototype.getFormat = function () {
                    if (this.queryName === this.current_query) {
                        this.queryFormat = this.setFormat();
                        this.getQueryFormat.emit(this.queryFormat);
                    }
                };
                WildcardQuery.prototype.setFormat = function () {
                    var queryFormat = {};
                    queryFormat[this.queryName] = {};
                    queryFormat[this.queryName][this.fieldName] = this.inputs.input.value;
                    return queryFormat;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], WildcardQuery.prototype, "queryList", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], WildcardQuery.prototype, "selectedField", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], WildcardQuery.prototype, "appliedQuery", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], WildcardQuery.prototype, "selectedQuery", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], WildcardQuery.prototype, "getQueryFormat", void 0);
                WildcardQuery = __decorate([
                    core_1.Component({
                        selector: 'wildcard-query',
                        template: "<span class=\"col-xs-6 pd-l0\">\n\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t\t[(ngModel)]=\"inputs.input.value\" \n\t\t\t\t\t\t \tplaceholder=\"{{inputs.input.placeholder}}\"\n\t\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t\t</div>\n\t\t\t\t</span>",
                        inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat']
                    }), 
                    __metadata('design:paramtypes', [])
                ], WildcardQuery);
                return WildcardQuery;
            }());
            exports_1("WildcardQuery", WildcardQuery);
        }
    }
});
//# sourceMappingURL=wildcard.query.js.map