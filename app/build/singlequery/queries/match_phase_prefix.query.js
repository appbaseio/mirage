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
var Match_phase_prefixQuery = (function () {
    function Match_phase_prefixQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.queryName = '*';
        this.fieldName = '*';
        this.information = {
            title: 'lt query',
            content: 'lt query content',
            link: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html'
        };
        this.inputs = {
            input: {
                placeholder: 'Prefix',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    Match_phase_prefixQuery.prototype.ngOnInit = function () {
        try {
            if (this.appliedQuery['match_phase_prefix'][this.fieldName]) {
                this.inputs.input.value = this.appliedQuery['match_phase_prefix'][this.fieldName];
            }
        }
        catch (e) { }
        this.getFormat();
    };
    Match_phase_prefixQuery.prototype.ngOnChanges = function () {
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
    Match_phase_prefixQuery.prototype.getFormat = function () {
        if (this.queryName === 'match-phase-prefix') {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    Match_phase_prefixQuery.prototype.setFormat = function () {
        var queryFormat = {};
        queryFormat[this.queryName] = {};
        queryFormat[this.queryName][this.fieldName] = this.inputs.input.value;
        return queryFormat;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Match_phase_prefixQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Match_phase_prefixQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Match_phase_prefixQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Match_phase_prefixQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Match_phase_prefixQuery.prototype, "getQueryFormat", void 0);
    Match_phase_prefixQuery = __decorate([
        core_1.Component({
            selector: 'match-phase-prefix-query',
            template: "<div class=\"form-group form-element col-xs-12\">\n\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t[(ngModel)]=\"inputs.input.value\" \n\t\t\t\t\t \tplaceholder=\"{{inputs.input.placeholder}}\"\n\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t</div>",
            inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat']
        }), 
        __metadata('design:paramtypes', [])
    ], Match_phase_prefixQuery);
    return Match_phase_prefixQuery;
}());
exports.Match_phase_prefixQuery = Match_phase_prefixQuery;
//# sourceMappingURL=match_phase_prefix.query.js.map