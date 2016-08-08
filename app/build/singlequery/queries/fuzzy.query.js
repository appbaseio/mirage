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
var FuzzyQuery = (function () {
    function FuzzyQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.current_query = 'fuzzy';
        this.queryName = '*';
        this.fieldName = '*';
        this.information = {
            title: 'fuzzy query',
            content: "<span class=\"description\"> fuzzy query content </span>\n\t\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/2.3/query-dsl-missing-query.html\">Documentation</a>"
        };
        this.inputs = {
            input: {
                placeholder: 'Input',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    FuzzyQuery.prototype.ngOnInit = function () {
        try {
            if (this.appliedQuery[this.current_query][this.fieldName]) {
                this.inputs.input.value = this.appliedQuery[this.current_query][this.fieldName];
            }
        }
        catch (e) { }
        this.getFormat();
    };
    FuzzyQuery.prototype.ngOnChanges = function () {
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
    FuzzyQuery.prototype.getFormat = function () {
        if (this.queryName === this.current_query) {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    FuzzyQuery.prototype.setFormat = function () {
        var queryFormat = {};
        queryFormat[this.queryName] = {};
        queryFormat[this.queryName][this.fieldName] = this.inputs.input.value;
        return queryFormat;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], FuzzyQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], FuzzyQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], FuzzyQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], FuzzyQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], FuzzyQuery.prototype, "getQueryFormat", void 0);
    FuzzyQuery = __decorate([
        core_1.Component({
            selector: 'fuzzy-query',
            template: "<span class=\"col-xs-6 pd-l0\">\n\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t\t[(ngModel)]=\"inputs.input.value\" \n\t\t\t\t\t\t \tplaceholder=\"{{inputs.input.placeholder}}\"\n\t\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t\t</div>\n\t\t\t\t</span>",
            inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat']
        }), 
        __metadata('design:paramtypes', [])
    ], FuzzyQuery);
    return FuzzyQuery;
}());
exports.FuzzyQuery = FuzzyQuery;
//# sourceMappingURL=fuzzy.query.js.map