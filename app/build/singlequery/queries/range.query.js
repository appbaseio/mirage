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
    var RangeQuery;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            RangeQuery = (function () {
                function RangeQuery() {
                    this.getQueryFormat = new core_1.EventEmitter();
                    this.queryName = '*';
                    this.fieldName = '*';
                    this.information = {
                        title: 'Range query',
                        content: "<span class=\"description\"> Range query content </span>\n\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/2.3/query-dsl-range-query.html\">Documentation</a>"
                    };
                    this.inputs = {
                        from: {
                            placeholder: 'From',
                            value: ''
                        },
                        to: {
                            placeholder: 'To',
                            value: ''
                        }
                    };
                    this.queryFormat = {};
                }
                RangeQuery.prototype.ngOnInit = function () {
                    try {
                        if (this.appliedQuery['range'][this.fieldName]['from']) {
                            this.inputs.from.value = this.appliedQuery['range'][this.fieldName]['from'];
                        }
                        if (this.appliedQuery['range'][this.fieldName]['to']) {
                            this.inputs.to.value = this.appliedQuery['range'][this.fieldName]['to'];
                        }
                    }
                    catch (e) { }
                    this.getFormat();
                };
                RangeQuery.prototype.ngOnChanges = function () {
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
                            from: @from_value,
                            to: @to_value
                        }
                    }
                */
                RangeQuery.prototype.getFormat = function () {
                    if (this.queryName === 'range') {
                        this.queryFormat = this.setFormat();
                        this.getQueryFormat.emit(this.queryFormat);
                    }
                };
                RangeQuery.prototype.setFormat = function () {
                    var queryFormat = {};
                    queryFormat[this.queryName] = {};
                    queryFormat[this.queryName][this.fieldName] = {
                        from: this.inputs.from.value,
                        to: this.inputs.to.value,
                    };
                    return queryFormat;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RangeQuery.prototype, "queryList", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RangeQuery.prototype, "selectedField", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RangeQuery.prototype, "appliedQuery", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RangeQuery.prototype, "selectedQuery", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], RangeQuery.prototype, "getQueryFormat", void 0);
                RangeQuery = __decorate([
                    core_1.Component({
                        selector: 'range-query',
                        template: "<span class=\"col-xs-6 pd-0\">\n\t\t\t\t\t<div class=\"col-xs-6 pl-0\">\n\t\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t\t\t[(ngModel)]=\"inputs.from.value\" \n\t\t\t\t\t\t\t \tplaceholder=\"{{inputs.from.placeholder}}\"\n\t\t\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t\t\t</div> \t\n\t\t\t\t\t</div> \t\n\t\t\t\t\t<div class=\"col-xs-6 pr-0\">\n\t\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t\t\t[(ngModel)]=\"inputs.to.value\" \n\t\t\t\t\t\t\t \tplaceholder=\"{{inputs.to.placeholder}}\"\n\t\t\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t\t\t</div>\t \t\n\t\t\t\t\t</div>\n\t\t\t\t</span>",
                        inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat']
                    }), 
                    __metadata('design:paramtypes', [])
                ], RangeQuery);
                return RangeQuery;
            }());
            exports_1("RangeQuery", RangeQuery);
        }
    }
});
//# sourceMappingURL=range.query.js.map