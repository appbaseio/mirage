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
var GtQuery = (function () {
    function GtQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.queryName = '*';
        this.fieldName = '*';
        this.current_query = 'gt';
        this.information = {
            title: 'Greater Than',
            content: "<span class=\"description\">Returns term values greater than the specified value. </span>\n\t\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html#query-dsl-range-query\">Read more</a>"
        };
        this.informationList = {
            'boost': {
                title: 'boost',
                content: "<span class=\"description\">Sets the boost value of the query, defaults to <strong>1.0</strong> </span>"
            }
        };
        this.default_options = [
            'boost'
        ];
        this.singleOption = {
            name: '',
            value: ''
        };
        this.optionRows = [];
        this.inputs = {
            gt: {
                placeholder: 'Greater than',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    GtQuery.prototype.ngOnInit = function () {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if (this.appliedQuery['range'][this.fieldName][this.current_query]) {
                this.inputs.gt.value = this.appliedQuery['range'][this.fieldName]['gt'];
                for (var option in this.appliedQuery[this.current_query][this.fieldName]) {
                    if (option != 'gt') {
                        var obj = {
                            name: option,
                            value: this.appliedQuery[this.current_query][this.fieldName][option]
                        };
                        this.optionRows.push(obj);
                    }
                }
            }
        }
        catch (e) { }
        this.getFormat();
    };
    GtQuery.prototype.ngOnChanges = function () {
        if (this.selectedField != '') {
            if (this.selectedField !== this.fieldName) {
                this.fieldName = this.selectedField;
                this.getFormat();
            }
        }
        if (this.selectedQuery != '') {
            if (this.selectedQuery !== this.queryName) {
                this.queryName = this.selectedQuery;
                if (this.selectedQuery == 'gt') {
                    this.optionRows = [];
                    this.getFormat();
                }
            }
        }
    };
    // QUERY FORMAT
    /*
        Query Format for this query is
        range: {
            @fieldName: {
                gt: @from_value
            }
        }
    */
    GtQuery.prototype.getFormat = function () {
        if (this.queryName === 'gt') {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    GtQuery.prototype.setFormat = function () {
        var queryFormat = {
            'range': {}
        };
        queryFormat['range'][this.fieldName] = {
            gt: this.inputs.gt.value,
        };
        this.optionRows.forEach(function (singleRow) {
            queryFormat['range'][this.fieldName][singleRow.name] = singleRow.value;
        }.bind(this));
        return queryFormat;
    };
    GtQuery.prototype.selectOption = function (input) {
        input.selector.parents('.editable-pack').removeClass('on');
        this.optionRows[input.external].name = input.val;
        this.filterOptions();
        setTimeout(function () {
            this.getFormat();
        }.bind(this), 300);
    };
    GtQuery.prototype.filterOptions = function () {
        this.options = this.default_options.filter(function (opt) {
            var flag = true;
            this.optionRows.forEach(function (row) {
                if (row.name === opt) {
                    flag = false;
                }
            });
            return flag;
        }.bind(this));
    };
    GtQuery.prototype.addOption = function () {
        var singleOption = JSON.parse(JSON.stringify(this.singleOption));
        this.filterOptions();
        this.optionRows.push(singleOption);
    };
    GtQuery.prototype.removeOption = function (index) {
        this.optionRows.splice(index, 1);
        this.filterOptions();
        this.getFormat();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GtQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GtQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GtQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GtQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], GtQuery.prototype, "getQueryFormat", void 0);
    GtQuery = __decorate([
        core_1.Component({
            selector: 'gt-query',
            template: "<span class=\"col-xs-6 pd-0\">\n\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t\t[(ngModel)]=\"inputs.gt.value\"\n\t\t\t\t\t\t \tplaceholder=\"{{inputs.gt.placeholder}}\"\n\t\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t\t</div>\n\t\t\t\t\t<button (click)=\"addOption();\" class=\"btn btn-info btn-xs add-option\"> <i class=\"fa fa-plus\"></i> </button>\n\t\t\t\t</span>\n\t\t\t\t<div class=\"col-xs-12 option-container\" *ngIf=\"optionRows.length\">\n\t\t\t\t\t<div class=\"col-xs-12 single-option\" *ngFor=\"let singleOption of optionRows, let i=index\">\n\t\t\t\t\t\t<div class=\"col-xs-6 pd-l0\">\n\t\t\t\t\t\t\t<editable\n\t\t\t\t\t\t\t\tclass = \"additional-option-select-{{i}}\"\n\t\t\t\t\t\t\t\t[editableField]=\"singleOption.name\"\n\t\t\t\t\t\t\t\t[editPlaceholder]=\"'--choose option--'\"\n\t\t\t\t\t\t\t\t[editableInput]=\"'select2'\"\n\t\t\t\t\t\t\t\t[selectOption]=\"options\"\n\t\t\t\t\t\t\t\t[passWithCallback]=\"i\"\n\t\t\t\t\t\t\t\t[selector]=\"'additional-option-select'\"\n\t\t\t\t\t\t\t\t[querySelector]=\"querySelector\"\n\t\t\t\t\t\t\t\t[informationList]=\"informationList\"\n\t\t\t\t\t\t\t\t[showInfoFlag]=\"true\"\n\t\t\t\t\t\t\t\t[searchOff]=\"true\"\n\t\t\t\t\t\t\t\t(callback)=\"selectOption($event)\">\n\t\t\t\t\t\t\t</editable>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"col-xs-6 pd-0\">\n\t\t\t\t\t\t\t<div class=\"form-group form-element\">\n\t\t\t\t\t\t\t\t<input class=\"form-control col-xs-12 pd-0\" type=\"text\" [(ngModel)]=\"singleOption.value\" placeholder=\"value\"  (keyup)=\"getFormat();\"/>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button (click)=\"removeOption(i)\" class=\"btn btn-grey delete-option btn-xs\">\n\t\t\t\t\t\t\t<i class=\"fa fa-times\"></i>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>",
            inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat', 'querySelector'],
            directives: [editable_component_1.EditableComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], GtQuery);
    return GtQuery;
}());
exports.GtQuery = GtQuery;
//# sourceMappingURL=gt.query.js.map