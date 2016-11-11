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
var SpanTermQuery = (function () {
    function SpanTermQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.queryName = '*';
        this.fieldName = '*';
        this.current_query = 'span_term';
        this.information = {
            title: 'Span Term',
            content: "<span class=\"description\">Matches spans containing a term. The span term query maps to Lucene SpanTermQuery.</span>\n                    <a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-term-query.html#query-dsl-span-term-query\">Read more</a>"
        };
        this.informationList = {
            'boost': {
                title: 'boost',
                content: "<span class=\"description\">Sets the boost value of the query, defaults to <strong>1.0</strong></span>"
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
            input: {
                placeholder: 'Input',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    SpanTermQuery.prototype.ngOnInit = function () {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if (this.appliedQuery[this.current_query][this.selectedField]) {
                this.inputs.input.value = this.appliedQuery[this.current_query][this.fieldName].value;
                for (var option in this.appliedQuery[this.current_query][this.fieldName]) {
                    if (option != 'value') {
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
        this.filterOptions();
    };
    SpanTermQuery.prototype.ngOnChanges = function () {
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
    SpanTermQuery.prototype.getFormat = function () {
        if (this.queryName === this.current_query) {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    SpanTermQuery.prototype.setFormat = function () {
        var queryFormat = {};
        queryFormat[this.queryName] = (_a = {},
            _a[this.fieldName] = {},
            _a
        );
        if (this.optionRows.length) {
            queryFormat[this.queryName][this.fieldName]['value'] = this.inputs.input.value;
            this.optionRows.forEach(function (singleRow) {
                queryFormat[this.queryName][this.fieldName][singleRow.name] = singleRow.value;
            }.bind(this));
        }
        else {
            queryFormat[this.queryName][this.fieldName]['value'] = this.inputs.input.value;
        }
        return queryFormat;
        var _a;
    };
    SpanTermQuery.prototype.selectOption = function (input) {
        input.selector.parents('.editable-pack').removeClass('on');
        this.optionRows[input.external].name = input.val;
        this.filterOptions();
        setTimeout(function () {
            this.getFormat();
        }.bind(this), 300);
    };
    SpanTermQuery.prototype.filterOptions = function () {
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
    SpanTermQuery.prototype.addOption = function () {
        var singleOption = JSON.parse(JSON.stringify(this.singleOption));
        this.filterOptions();
        this.optionRows.push(singleOption);
    };
    SpanTermQuery.prototype.removeOption = function (index) {
        this.optionRows.splice(index, 1);
        this.filterOptions();
        this.getFormat();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SpanTermQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SpanTermQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SpanTermQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SpanTermQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SpanTermQuery.prototype, "getQueryFormat", void 0);
    SpanTermQuery = __decorate([
        core_1.Component({
            selector: 'span-term-query',
            template: "<span class=\"col-xs-6 pd-10\">\n                    <div class=\"form-group form-element query-primary-input\">\n                        <span class=\"input_with_option\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.input.value\"\n                                placeholder=\"{{inputs.input.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </span>\n                    </div>\n                    <button (click)=\"addOption();\" class=\"btn btn-info btn-xs add-option\"> <i class=\"fa fa-plus\"></i> </button>\n                </span>\n                <div class=\"col-xs-12 option-container\" *ngIf=\"optionRows.length\">\n                    <div class=\"col-xs-12 single-option\" *ngFor=\"let singleOption of optionRows, let i=index\">\n                        <div class=\"col-xs-6 pd-l0\">\n                            <editable\n                                class = \"additional-option-select-{{i}}\"\n                                [editableField]=\"singleOption.name\"\n                                [editPlaceholder]=\"'--choose option--'\"\n                                [editableInput]=\"'select2'\"\n                                [selectOption]=\"options\"\n                                [passWithCallback]=\"i\"\n                                [selector]=\"'additional-option-select'\"\n                                [querySelector]=\"querySelector\"\n                                [informationList]=\"informationList\"\n                                [showInfoFlag]=\"true\"\n                                [searchOff]=\"true\"\n                                (callback)=\"selectOption($event)\">\n                            </editable>\n                        </div>\n                        <div class=\"col-xs-6 pd-0\">\n                            <div class=\"form-group form-element\">\n                                <input class=\"form-control col-xs-12 pd-0\" type=\"text\" [(ngModel)]=\"singleOption.value\" placeholder=\"value\"  (keyup)=\"getFormat();\"/>\n                            </div>\n                        </div>\n                        <button (click)=\"removeOption(i)\" class=\"btn btn-grey delete-option btn-xs\">\n                            <i class=\"fa fa-times\"></i>\n                        </button>\n                    </div>\n                </div>",
            inputs: ['getQueryFormat', 'querySelector']
        }), 
        __metadata('design:paramtypes', [])
    ], SpanTermQuery);
    return SpanTermQuery;
}());
exports.SpanTermQuery = SpanTermQuery;
//# sourceMappingURL=span_term.query.js.map