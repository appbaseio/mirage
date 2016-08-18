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
var CommonQuery = (function () {
    function CommonQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.current_query = 'common';
        this.queryName = '*';
        this.fieldName = '*';
        this.information = {
            title: 'Common query',
            content: "<span class=\"description\"> Common query content </span>\n\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/2.3/query-dsl-range-query.html\">Documentation</a>"
        };
        this.options = [
            'low_freq_operator',
            'minimum_should_match'
        ];
        this.singleOption = {
            name: '',
            value: ''
        };
        this.optionRows = [];
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
                this.inputs.cutoff_frequency.value = this.appliedQuery['common'][this.fieldName]['cutoff_frequency'];
            }
            for (var option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (['query', 'cutoff_frequency'].indexOf(option) === -1) {
                    var obj = {
                        name: option,
                        value: this.appliedQuery[this.current_query][this.fieldName][option]
                    };
                    this.optionRows.push(obj);
                }
            }
        }
        catch (e) { }
        this.getFormat();
    };
    CommonQuery.prototype.ngOnChanges = function () {
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
    CommonQuery.prototype.addOption = function () {
        var singleOption = JSON.parse(JSON.stringify(this.singleOption));
        this.optionRows.push(singleOption);
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
        if (this.optionRows.length) {
            queryFormat[this.queryName][this.fieldName] = {
                query: this.inputs.query.value,
                cutoff_frequency: this.inputs.cutoff_frequency.value
            };
            this.optionRows.forEach(function (singleRow) {
                queryFormat[this.queryName][this.fieldName][singleRow.name] = singleRow.value;
            }.bind(this));
        }
        else {
            queryFormat[this.queryName][this.fieldName] = {
                query: this.inputs.query.value,
                cutoff_frequency: this.inputs.cutoff_frequency.value
            };
        }
        return queryFormat;
    };
    CommonQuery.prototype.selectOption = function (input) {
        this.optionRows[input.external].name = input.value;
        setTimeout(function () {
            this.getFormat();
        }.bind(this), 300);
    };
    CommonQuery.prototype.removeOption = function (index) {
        this.optionRows.splice(index, 1);
        this.getFormat();
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
            template: "<span class=\"col-xs-6 pd-0\">\n\t\t\t\t\t<div class=\"col-xs-6 pl-0\">\n\t\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t\t\t[(ngModel)]=\"inputs.query.value\" \n\t\t\t\t\t\t\t \tplaceholder=\"{{inputs.query.placeholder}}\"\n\t\t\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t\t\t</div> \t\n\t\t\t\t\t</div> \t\n\t\t\t\t\t<div class=\"col-xs-6 pr-0\">\n\t\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t\t<input type=\"number\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t\t\t[(ngModel)]=\"inputs.cutoff_frequency.value\" \n\t\t\t\t\t\t\t \tplaceholder=\"{{inputs.cutoff_frequency.placeholder}}\"\n\t\t\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t\t\t</div>\t \t\n\t\t\t\t\t</div>\n\t\t\t\t\t<button (click)=\"addOption();\" class=\"btn btn-info btn-xs add-option\"> <i class=\"fa fa-plus\"></i> </button>\n\t\t\t\t</span>\n\t\t\t\t<div class=\"col-xs-12 option-container\" *ngIf=\"optionRows.length\">\n\t\t\t\t\t<div class=\"col-xs-12 single-option\" *ngFor=\"let singleOption of optionRows, let i=index\">\n\t\t\t\t\t\t<div class=\"col-xs-6 pd-l0\">\t\t\t\n\t\t\t\t\t\t\t<editable [editableField]=\"singleOption.name\" \n\t\t\t\t\t\t\t\t[editableModal]=\"singleOption.name\" \n\t\t\t\t\t\t\t\t[editPlaceholder]=\"'--choose option--'\"\n\t\t\t\t\t\t\t\t[editableInput]=\"'selectOption'\" \n\t\t\t\t\t\t\t\t[selectOption]=\"options\" \n\t\t\t\t\t\t\t\t[passWithCallback]=\"i\"\n\t\t\t\t\t\t\t\t(callback)=\"selectOption($event)\"></editable>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-xs-6 pd-0\">\n\t\t\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t\t\t<input class=\"form-control col-xs-12 pd-0\" type=\"text\" [(ngModel)]=\"singleOption.value\" placeholder=\"value\"  (keyup)=\"getFormat();\"/>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button (click)=\"removeOption(i)\" class=\"btn btn-grey delete-option btn-xs\">\n\t\t\t\t\t\t\t<i class=\"fa fa-times\"></i>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>",
            inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat'],
            directives: [editable_component_1.EditableComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], CommonQuery);
    return CommonQuery;
}());
exports.CommonQuery = CommonQuery;
//# sourceMappingURL=common.query.js.map