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
var IdsQuery = (function () {
    function IdsQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.queryName = '*';
        this.fieldName = '*';
        this.information = {
            title: 'Ids',
            content: "<span class=\"description\">Returns matches that only have the provided ids (<strong>_id</strong> field). </span>\n\t\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-ids-query.html#query-dsl-ids-query\">Read more</a>"
        };
        this.inputs = {
            input: {
                placeholder: 'Input',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    IdsQuery.prototype.ngOnInit = function () {
        try {
            if (this.appliedQuery['ids']) {
                try {
                    this.inputs.input.value = this.appliedQuery['ids'].values.join(',');
                }
                catch (e) {
                    this.inputs.input.value = this.appliedQuery['ids'].values;
                }
            }
        }
        catch (e) { }
        this.getFormat();
    };
    IdsQuery.prototype.ngOnChanges = function () {
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
            @fieldName: {
                type: @type,
                values: @value
            }
        }
    */
    IdsQuery.prototype.getFormat = function () {
        if (this.queryName === 'ids') {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    IdsQuery.prototype.setFormat = function () {
        var queryFormat = {};
        queryFormat[this.queryName] = {
            values: [],
            type: this.selectedTypes
        };
        try {
            queryFormat[this.queryName].values = this.inputs.input.value.split(',');
        }
        catch (e) {
            queryFormat[this.queryName].values = [];
        }
        return queryFormat;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], IdsQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], IdsQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], IdsQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], IdsQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], IdsQuery.prototype, "selectedTypes", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], IdsQuery.prototype, "getQueryFormat", void 0);
    IdsQuery = __decorate([
        core_1.Component({
            selector: 'ids-query',
            template: "<span class=\"col-xs-6 pd-0\">\n\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t\t[(ngModel)]=\"inputs.input.value\"\n\t\t\t\t\t\t \tplaceholder=\"{{inputs.input.placeholder}}\"\n\t\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t\t</div>\n\t\t\t\t</span>",
            inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat', 'selectedTypes']
        }), 
        __metadata('design:paramtypes', [])
    ], IdsQuery);
    return IdsQuery;
}());
exports.IdsQuery = IdsQuery;
//# sourceMappingURL=ids.query.js.map