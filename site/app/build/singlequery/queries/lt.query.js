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
var LtQuery = (function () {
    function LtQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.queryName = '*';
        this.fieldName = '*';
        this.information = {
            title: 'Lt query',
            content: "<span class=\"description\"> Lt query content </span>\n\t\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html\">Documentation</a>"
        };
        this.inputs = {
            lt: {
                placeholder: 'Less than',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    LtQuery.prototype.ngOnInit = function () {
        try {
            if (this.appliedQuery['range'][this.fieldName]['lt']) {
                this.inputs.lt.value = this.appliedQuery['range'][this.fieldName]['lt'];
            }
        }
        catch (e) { }
        this.getFormat();
    };
    LtQuery.prototype.ngOnChanges = function () {
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
        range: {
            @fieldName: {
                lt: @from_value
            }
        }
    */
    LtQuery.prototype.getFormat = function () {
        if (this.queryName === 'lt') {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    LtQuery.prototype.setFormat = function () {
        var queryFormat = {
            'range': {}
        };
        queryFormat['range'][this.fieldName] = {
            lt: this.inputs.lt.value,
        };
        return queryFormat;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LtQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LtQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LtQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LtQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LtQuery.prototype, "getQueryFormat", void 0);
    LtQuery = __decorate([
        core_1.Component({
            selector: 'lt-query',
            template: "<span class=\"col-xs-6 pd-0\">\n\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t\t[(ngModel)]=\"inputs.lt.value\" \n\t\t\t\t\t\t \tplaceholder=\"{{inputs.lt.placeholder}}\"\n\t\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t\t</div>\n\t\t\t\t</span>",
            inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat']
        }), 
        __metadata('design:paramtypes', [])
    ], LtQuery);
    return LtQuery;
}());
exports.LtQuery = LtQuery;
//# sourceMappingURL=lt.query.js.map