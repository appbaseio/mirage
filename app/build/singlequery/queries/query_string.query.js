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
var editable_component_1 = require('../../editable/editable.component');
var QueryStringQuery = (function () {
    function QueryStringQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.current_query = 'query_string';
        this.queryName = '*';
        this.fieldName = '*';
        this.information = {
            title: 'Quer string query',
            content: "<span class=\"description\"> Multi-match query content </span>\n\t\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html\">Documentation</a>"
        };
        this.options = [
            'fields',
            'default_field',
            'use_dis_max'
        ];
        this.placeholders = {
            fields: 'Comma seprated values'
        };
        this.singleOption = {
            name: '',
            value: ''
        };
        this.optionRows = [];
        this.inputs = {
            input: {
                placeholder: 'Input',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    QueryStringQuery.prototype.ngOnInit = function () {
        try {
            if (this.appliedQuery[this.current_query]) {
                var applied = this.appliedQuery[this.current_query];
                this.inputs.input.value = applied.query;
                if (applied.fields.length > 1) {
                    var other_fields = JSON.parse(JSON.stringify(applied.fields));
                    other_fields.splice(0, 1);
                    other_fields = other_fields.join(',');
                    var obj = {
                        name: 'fields',
                        value: other_fields
                    };
                    this.optionRows.push(obj);
                }
                for (var option in applied) {
                    if (option != 'fields' && option != 'query') {
                        var obj = {
                            name: option,
                            value: applied[option]
                        };
                        this.optionRows.push(obj);
                    }
                }
            }
        }
        catch (e) { }
        this.getFormat();
    };
    QueryStringQuery.prototype.ngOnChanges = function () {
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
    QueryStringQuery.prototype.addOption = function () {
        var singleOption = JSON.parse(JSON.stringify(this.singleOption));
        this.optionRows.push(singleOption);
    };
    // QUERY FORMAT
    /*
        Query Format for this query is
        @queryName: {
            query: value,
            fields: [fieldname, other fields]
        }
    */
    QueryStringQuery.prototype.getFormat = function () {
        if (this.queryName === this.current_query) {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    QueryStringQuery.prototype.setFormat = function () {
        var queryFormat = {};
        var fields = [this.fieldName];
        queryFormat[this.queryName] = {
            query: this.inputs.input.value,
            fields: fields
        };
        if (this.optionRows.length) {
            this.optionRows.forEach(function (singleRow) {
                if (singleRow.name != 'fields') {
                    queryFormat[this.queryName][singleRow.name] = singleRow.value;
                }
                else {
                    var field_split = singleRow.value.split(',');
                    fields = fields.concat(field_split);
                    queryFormat[this.queryName].fields = fields;
                }
            }.bind(this));
        }
        return queryFormat;
    };
    QueryStringQuery.prototype.selectOption = function (input) {
        this.optionRows[input.external].name = input.value;
        setTimeout(function () {
            this.getFormat();
        }.bind(this), 300);
    };
    QueryStringQuery.prototype.removeOption = function (index) {
        this.optionRows.splice(index, 1);
        this.getFormat();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], QueryStringQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], QueryStringQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], QueryStringQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], QueryStringQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], QueryStringQuery.prototype, "getQueryFormat", void 0);
    QueryStringQuery = __decorate([
        core_1.Component({
            selector: 'query_string-query',
            template: "<span class=\"col-xs-6 pd-10\">\n\t\t\t\t\t<div class=\"form-group form-element query-primary-input\">\n\t\t\t\t\t\t<span class=\"input_with_option\">\n\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t\t\t[(ngModel)]=\"inputs.input.value\" \n\t\t\t\t\t\t\t \tplaceholder=\"{{inputs.input.placeholder}}\"\n\t\t\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<button (click)=\"addOption();\" class=\"btn btn-info btn-xs add-option\"> <i class=\"fa fa-plus\"></i> </button>\n\t\t\t\t</span>\n\t\t\t\t<div class=\"col-xs-12 option-container\" *ngIf=\"optionRows.length\">\n\t\t\t\t\t<div class=\"col-xs-12 single-option\" *ngFor=\"let singleOption of optionRows, let i=index\">\n\t\t\t\t\t\t<div class=\"col-xs-6 pd-l0\">\t\t\t\n\t\t\t\t\t\t\t<editable [editableField]=\"singleOption.name\" \n\t\t\t\t\t\t\t\t[editableModal]=\"singleOption.name\" \n\t\t\t\t\t\t\t\t[editPlaceholder]=\"'--choose option--'\"\n\t\t\t\t\t\t\t\t[editableInput]=\"'selectOption'\" \n\t\t\t\t\t\t\t\t[selectOption]=\"options\" \n\t\t\t\t\t\t\t\t[passWithCallback]=\"i\"\n\t\t\t\t\t\t\t\t(callback)=\"selectOption($event)\"></editable>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-xs-6 pd-0\">\n\t\t\t\t\t\t\t<div class=\"form-group form-element\">\n \t\t\t\t\t\t\t\t<input class=\"form-control col-xs-12 pd-0\" type=\"text\" [(ngModel)]=\"singleOption.value\" placeholder=\"{{placeholders[singleOption.name] || 'value'}}\"  (keyup)=\"getFormat();\"/>\t\t\t\t\t\t\t\n \t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button (click)=\"removeOption(i)\" class=\"btn btn-grey delete-option btn-xs\">\n\t\t\t\t\t\t\t<i class=\"fa fa-times\"></i>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t",
            inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat'],
            directives: [editable_component_1.EditableComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], QueryStringQuery);
    return QueryStringQuery;
}());
exports.QueryStringQuery = QueryStringQuery;
//# sourceMappingURL=query_string.query.js.map