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
var GeoShapeQuery = (function () {
    function GeoShapeQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.queryName = '*';
        this.fieldName = '*';
        this.current_query = 'geo_shape';
        this.information = {
            title: 'Geo Shape Query',
            content: "<span class=\"description\">Return matches that have a shape that relates with the query shape. A relation can be an intersection, subset, superset, or a disjoint.</span>\n                    <a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-shape-query.html#query-dsl-geo-shape-query\">Read more</a>"
        };
        this.informationList = {
            'relation': {
                title: 'relation',
                content: "<span class=\"description\">Defines the relation to match for, can be one of <strong>intersects</strong>, <strong>disjoint</strong>, <strong>within</strong> or <strong>contains</strong>.</span>"
            }
        };
        this.default_options = [
            'relation'
        ];
        this.singleOption = {
            name: '',
            value: ''
        };
        this.optionRows = [];
        this.inputs = {
            type: {
                placeholder: 'Type',
                value: ''
            },
            coordinates: {
                placeholder: 'Pass an Array',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    GeoShapeQuery.prototype.ngOnInit = function () {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if (this.appliedQuery[this.current_query][this.fieldName]['shape']['type']) {
                this.inputs.type.value = this.appliedQuery[this.current_query][this.fieldName]['shape']['type'];
            }
            if (this.appliedQuery[this.current_query][this.fieldName]['shape']['coordinates']) {
                this.inputs.coordinates.value = this.appliedQuery[this.current_query][this.fieldName]['shape']['coordinates'];
            }
            for (var option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'shape') {
                    var obj = {
                        name: option,
                        value: this.appliedQuery[this.current_query][this.fieldName][option]
                    };
                    this.optionRows.push(obj);
                }
            }
        }
        catch (e) { }
        this.filterOptions();
        this.getFormat();
    };
    GeoShapeQuery.prototype.ngOnChanges = function () {
        if (this.selectedField != '') {
            if (this.selectedField !== this.fieldName) {
                this.fieldName = this.selectedField;
                this.getFormat();
            }
        }
        if (this.selectedQuery != '') {
            if (this.selectedQuery !== this.queryName) {
                this.queryName = this.selectedQuery;
                this.optionRows = [];
                this.getFormat();
            }
        }
    };
    GeoShapeQuery.prototype.getFormat = function () {
        if (this.queryName === this.current_query) {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    GeoShapeQuery.prototype.setFormat = function () {
        var coordinates = this.inputs.coordinates.value;
        try {
            coordinates = JSON.parse(coordinates);
        }
        catch (e) { }
        var queryFormat = (_a = {},
            _a[this.queryName] = (_b = {},
                _b[this.fieldName] = {
                    shape: {
                        type: this.inputs.type.value,
                        coordinates: coordinates
                    }
                },
                _b
            ),
            _a
        );
        this.optionRows.forEach(function (singleRow) {
            queryFormat[this.queryName][this.fieldName][singleRow.name] = singleRow.value;
        }.bind(this));
        return queryFormat;
        var _a, _b;
    };
    GeoShapeQuery.prototype.selectOption = function (input) {
        input.selector.parents('.editable-pack').removeClass('on');
        this.optionRows[input.external].name = input.val;
        this.filterOptions();
        setTimeout(function () {
            this.getFormat();
        }.bind(this), 300);
    };
    GeoShapeQuery.prototype.filterOptions = function () {
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
    GeoShapeQuery.prototype.addOption = function () {
        var singleOption = JSON.parse(JSON.stringify(this.singleOption));
        this.filterOptions();
        this.optionRows.push(singleOption);
    };
    GeoShapeQuery.prototype.removeOption = function (index) {
        this.optionRows.splice(index, 1);
        this.filterOptions();
        this.getFormat();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoShapeQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoShapeQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoShapeQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoShapeQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], GeoShapeQuery.prototype, "getQueryFormat", void 0);
    GeoShapeQuery = __decorate([
        core_1.Component({
            selector: 'geo-shape-query',
            template: "<span class=\"col-xs-6 pd-0\">\n                    <div class=\"col-xs-6 pl-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.type.value\"\n                                placeholder=\"{{inputs.type.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                    <div class=\"col-xs-6 pr-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.coordinates.value\"\n                                placeholder=\"{{inputs.coordinates.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                    <button (click)=\"addOption();\" class=\"btn btn-info btn-xs add-option\"> <i class=\"fa fa-plus\"></i> </button>\n                </span>\n                <div class=\"col-xs-12 option-container\" *ngIf=\"optionRows.length\">\n                    <div class=\"col-xs-12 single-option\" *ngFor=\"let singleOption of optionRows, let i=index\">\n                        <div class=\"col-xs-6 pd-l0\">\n                            <editable\n                                class = \"additional-option-select-{{i}}\"\n                                [editableField]=\"singleOption.name\"\n                                [editPlaceholder]=\"'--choose option--'\"\n                                [editableInput]=\"'select2'\"\n                                [selectOption]=\"options\"\n                                [passWithCallback]=\"i\"\n                                [selector]=\"'additional-option-select'\"\n                                [querySelector]=\"querySelector\"\n                                [informationList]=\"informationList\"\n                                [showInfoFlag]=\"true\"\n                                [searchOff]=\"true\"\n                                (callback)=\"selectOption($event)\">\n                            </editable>\n                        </div>\n                        <div class=\"col-xs-6 pd-0\">\n                            <div class=\"form-group form-element\">\n                                <input class=\"form-control col-xs-12 pd-0\" type=\"text\" [(ngModel)]=\"singleOption.value\" placeholder=\"value\"  (keyup)=\"getFormat();\"/>\n                            </div>\n                        </div>\n                        <button (click)=\"removeOption(i)\" class=\"btn btn-grey delete-option btn-xs\">\n                            <i class=\"fa fa-times\"></i>\n                        </button>\n                    </div>\n                </div>",
            inputs: ['getQueryFormat', 'querySelector']
        }), 
        __metadata('design:paramtypes', [])
    ], GeoShapeQuery);
    return GeoShapeQuery;
}());
exports.GeoShapeQuery = GeoShapeQuery;
//# sourceMappingURL=geoshape.query.js.map