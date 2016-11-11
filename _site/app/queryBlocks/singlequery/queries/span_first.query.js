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
var SpanFirstQuery = (function () {
    function SpanFirstQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.queryName = '*';
        this.fieldName = '*';
        this.current_query = 'span_first';
        this.information = {
            title: 'Span First',
            content: "<span class=\"description\">Matches spans near the beginning of a field. The span first query maps to Lucene SpanFirstQuery.</span>\n                    <a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-first-query.html#query-dsl-span-first-query\">Read more</a>"
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
            },
            end: {
                placeholder: 'End',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    SpanFirstQuery.prototype.ngOnInit = function () {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if (this.appliedQuery[this.current_query]['match']['span_term'][this.selectedField]) {
                this.inputs.input.value = this.appliedQuery[this.current_query]['match']['span_term'][this.fieldName].value;
                this.inputs.end.value = this.appliedQuery[this.current_query].end;
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
    SpanFirstQuery.prototype.ngOnChanges = function () {
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
    SpanFirstQuery.prototype.getFormat = function () {
        if (this.queryName === this.current_query) {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    SpanFirstQuery.prototype.setFormat = function () {
        var queryFormat = {};
        queryFormat[this.queryName] = {
            'match': {
                'span_term': (_a = {},
                    _a[this.fieldName] = {},
                    _a
                )
            }
        };
        if (this.optionRows.length) {
            queryFormat[this.queryName]['match']['span_term'][this.fieldName]['value'] = this.inputs.input.value;
            queryFormat[this.queryName]['end'] = this.inputs.end.value;
            this.optionRows.forEach(function (singleRow) {
                queryFormat[this.queryName]['match']['span_term'][this.fieldName][singleRow.name] = singleRow.value;
            }.bind(this));
        }
        else {
            queryFormat[this.queryName]['match']['span_term'][this.fieldName]['value'] = this.inputs.input.value;
            queryFormat[this.queryName]['end'] = this.inputs.end.value;
        }
        return queryFormat;
        var _a;
    };
    SpanFirstQuery.prototype.selectOption = function (input) {
        input.selector.parents('.editable-pack').removeClass('on');
        this.optionRows[input.external].name = input.val;
        this.filterOptions();
        setTimeout(function () {
            this.getFormat();
        }.bind(this), 300);
    };
    SpanFirstQuery.prototype.filterOptions = function () {
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
    SpanFirstQuery.prototype.addOption = function () {
        var singleOption = JSON.parse(JSON.stringify(this.singleOption));
        this.filterOptions();
        this.optionRows.push(singleOption);
    };
    SpanFirstQuery.prototype.removeOption = function (index) {
        this.optionRows.splice(index, 1);
        this.filterOptions();
        this.getFormat();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SpanFirstQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SpanFirstQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SpanFirstQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SpanFirstQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SpanFirstQuery.prototype, "getQueryFormat", void 0);
    SpanFirstQuery = __decorate([
        core_1.Component({
            selector: 'span-first-query',
            template: "<span class=\"col-xs-6 pd-10\">\n                    <div class=\"form-group form-element query-primary-input\">\n                        <span class=\"input_with_option\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.input.value\"\n                                placeholder=\"{{inputs.input.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </span>\n                    </div>\n                    <div class=\"form-group form-element query-primary-input\">\n                        <span class=\"input_with_option\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.end.value\"\n                                placeholder=\"{{inputs.end.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </span>\n                    </div>\n                    <button (click)=\"addOption();\" class=\"btn btn-info btn-xs add-option\"> <i class=\"fa fa-plus\"></i> </button>\n                </span>\n                <div class=\"col-xs-12 option-container\" *ngIf=\"optionRows.length\">\n                    <div class=\"col-xs-12 single-option\" *ngFor=\"let singleOption of optionRows, let i=index\">\n                        <div class=\"col-xs-6 pd-l0\">\n                            <editable\n                                class = \"additional-option-select-{{i}}\"\n                                [editableField]=\"singleOption.name\"\n                                [editPlaceholder]=\"'--choose option--'\"\n                                [editableInput]=\"'select2'\"\n                                [selectOption]=\"options\"\n                                [passWithCallback]=\"i\"\n                                [selector]=\"'additional-option-select'\"\n                                [querySelector]=\"querySelector\"\n                                [informationList]=\"informationList\"\n                                [showInfoFlag]=\"true\"\n                                [searchOff]=\"true\"\n                                (callback)=\"selectOption($event)\">\n                            </editable>\n                        </div>\n                        <div class=\"col-xs-6 pd-0\">\n                            <div class=\"form-group form-element\">\n                                <input class=\"form-control col-xs-12 pd-0\" type=\"text\" [(ngModel)]=\"singleOption.value\" placeholder=\"value\"  (keyup)=\"getFormat();\"/>\n                            </div>\n                        </div>\n                        <button (click)=\"removeOption(i)\" class=\"btn btn-grey delete-option btn-xs\">\n                            <i class=\"fa fa-times\"></i>\n                        </button>\n                    </div>\n                </div>",
            inputs: ['getQueryFormat', 'querySelector']
        }), 
        __metadata('design:paramtypes', [])
    ], SpanFirstQuery);
    return SpanFirstQuery;
}());
exports.SpanFirstQuery = SpanFirstQuery;
//# sourceMappingURL=span_first.query.js.map