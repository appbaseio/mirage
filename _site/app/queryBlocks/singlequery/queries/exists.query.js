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
var ExistsQuery = (function () {
    function ExistsQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.current_query = 'exists';
        this.queryName = '*';
        this.fieldName = '*';
        this.information = {
            title: 'Exists',
            content: "<span class=\"description\">Returns matches where the field value is not null. </span>\n\t\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html#query-dsl-exists-query\">Read more</a>"
        };
        this.queryFormat = {};
    }
    ExistsQuery.prototype.ngOnInit = function () {
        try {
            if (this.appliedQuery[this.current_query]['field']) {
                this.appliedQuery[this.current_query]['field'] = this.fieldName;
            }
        }
        catch (e) { }
        this.getFormat();
    };
    ExistsQuery.prototype.ngOnChanges = function () {
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
            @field: @fieldName
        }
    */
    ExistsQuery.prototype.getFormat = function () {
        if (this.queryName === this.current_query) {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    ExistsQuery.prototype.setFormat = function () {
        var queryFormat = {};
        queryFormat[this.queryName] = {
            'field': this.fieldName
        };
        return queryFormat;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ExistsQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ExistsQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ExistsQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ExistsQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ExistsQuery.prototype, "getQueryFormat", void 0);
    ExistsQuery = __decorate([
        core_1.Component({
            selector: 'exists-query',
            template: "<span class=\"col-xs-6 pd-0\">\n\t\t\t\t</span>",
            inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat']
        }), 
        __metadata('design:paramtypes', [])
    ], ExistsQuery);
    return ExistsQuery;
}());
exports.ExistsQuery = ExistsQuery;
//# sourceMappingURL=exists.query.js.map