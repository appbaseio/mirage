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
    var CommonQuery;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            CommonQuery = (function () {
                function CommonQuery() {
                    this.getQueryFormat = new core_1.EventEmitter();
                    this.queryName = '*';
                    this.fieldName = '*';
                    this.information = {
                        title: 'Common query',
                        content: "<span class=\"description\"> Common query content </span>\n\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/2.3/query-dsl-range-query.html\">Documentation</a>"
                    };
                    this.inputs = {
                        query: {
                            placeholder: 'Query',
                            value: ''
                        },
                        cutoff_frequency: {
                            placeholder: 'Cutoff frequency',
                            value: ''
                        }
                    };
                    this.queryFormat = {};
                }
                CommonQuery.prototype.ngOnInit = function () {
                    try {
                        if (this.appliedQuery['common'][this.fieldName]['query']) {
                            this.inputs.query.value = this.appliedQuery['common'][this.fieldName]['query'];
                        }
                        if (this.appliedQuery['common'][this.fieldName]['cutoff_frequency']) {
                            this.inputs.to.value = this.appliedQuery['common'][this.fieldName]['cutoff_frequency'];
                        }
                    }
                    catch (e) { }
                    this.getFormat();
                };
                CommonQuery.prototype.ngOnChanges = function () {
                    if (this.selectedField != '') {
                        if (this.selectedField !== this.fieldName) {
                            this.fieldName = this.selectedField;
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
                        @fieldName: {
                            query: @query_value,
                            cutoff_frequency: @cutoff_frequency_value
                        }
                    }
                */
                CommonQuery.prototype.getFormat = function () {
                    if (this.queryName === 'common') {
                        this.queryFormat = this.setFormat();
                        this.getQueryFormat.emit(this.queryFormat);
                    }
                };
                CommonQuery.prototype.setFormat = function () {
                    var queryFormat = {};
                    queryFormat[this.queryName] = {};
                    queryFormat[this.queryName][this.fieldName] = {
                        query: this.inputs.query.value,
                        cutoff_frequency: this.inputs.cutoff_frequency.value,
                    };
                    return queryFormat;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], CommonQuery.prototype, "queryList", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], CommonQuery.prototype, "selectedField", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], CommonQuery.prototype, "appliedQuery", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], CommonQuery.prototype, "selectedQuery", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], CommonQuery.prototype, "getQueryFormat", void 0);
                CommonQuery = __decorate([
                    core_1.Component({
                        selector: 'common-query',
                        template: "<span class=\"col-xs-6 pd-0\">\n\t\t\t\t\t<div class=\"col-xs-6 pl-0\">\n\t\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t\t\t[(ngModel)]=\"inputs.query.value\" \n\t\t\t\t\t\t\t \tplaceholder=\"{{inputs.query.placeholder}}\"\n\t\t\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t\t\t</div> \t\n\t\t\t\t\t</div> \t\n\t\t\t\t\t<div class=\"col-xs-6 pr-0\">\n\t\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t\t<input type=\"number\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t\t\t[(ngModel)]=\"inputs.cutoff_frequency.value\" \n\t\t\t\t\t\t\t \tplaceholder=\"{{inputs.cutoff_frequency.placeholder}}\"\n\t\t\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t\t\t</div>\t \t\n\t\t\t\t\t</div>\n\t\t\t\t</span>",
                        inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat']
                    }), 
                    __metadata('design:paramtypes', [])
                ], CommonQuery);
                return CommonQuery;
            }());
            exports_1("CommonQuery", CommonQuery);
        }
    }
});
//# sourceMappingURL=common.query.js.map