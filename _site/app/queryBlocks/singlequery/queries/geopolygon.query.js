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
var GeoPolygonQuery = (function () {
    function GeoPolygonQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.queryName = '*';
        this.fieldName = '*';
        this.current_query = 'geo_polygon';
        this.information = {
            title: 'Geo Polygon Query',
            content: "<span class=\"description\">Return matches that fall within a specified polygon shape.</span>\n                    <a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-polygon-query.html#query-dsl-geo-polygon-query\">Read more</a>"
        };
        this.informationList = {
            '_name': {
                title: '_name',
                content: "<span class=\"description\">Optional name field to identify the query.</span>"
            },
            'ignore_malformed': {
                title: 'ignore_malformed',
                content: "<span class=\"description\">Set to <strong>true</strong> to accept geo points with invalid latitude or longitude (default is false).</span>"
            }
        };
        this.default_options = [
            '_name',
            'ignore_malformed'
        ];
        this.singleOption = {
            name: '',
            value: ''
        };
        this.optionRows = [];
        this.inputs = {
            points: {
                placeholder: 'points',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    GeoPolygonQuery.prototype.ngOnInit = function () {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if (this.appliedQuery[this.current_query][this.fieldName]['points']) {
                this.inputs.points.value = this.appliedQuery[this.current_query][this.fieldName]['points'];
            }
            for (var option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'points') {
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
    GeoPolygonQuery.prototype.ngOnChanges = function () {
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
    GeoPolygonQuery.prototype.getFormat = function () {
        if (this.queryName === this.current_query) {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    GeoPolygonQuery.prototype.setFormat = function () {
        var points = this.inputs.points.value;
        try {
            points = JSON.parse(points);
        }
        catch (e) { }
        var queryFormat = (_a = {},
            _a[this.queryName] = (_b = {},
                _b[this.fieldName] = {
                    points: points
                },
                _b
            ),
            _a
        );
        this.optionRows.forEach(function (singleRow) {
            queryFormat[this.queryName][singleRow.name] = singleRow.value;
        }.bind(this));
        return queryFormat;
        var _a, _b;
    };
    GeoPolygonQuery.prototype.selectOption = function (input) {
        input.selector.parents('.editable-pack').removeClass('on');
        this.optionRows[input.external].name = input.val;
        this.filterOptions();
        setTimeout(function () {
            this.getFormat();
        }.bind(this), 300);
    };
    GeoPolygonQuery.prototype.filterOptions = function () {
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
    GeoPolygonQuery.prototype.addOption = function () {
        var singleOption = JSON.parse(JSON.stringify(this.singleOption));
        this.filterOptions();
        this.optionRows.push(singleOption);
    };
    GeoPolygonQuery.prototype.removeOption = function (index) {
        this.optionRows.splice(index, 1);
        this.filterOptions();
        this.getFormat();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoPolygonQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoPolygonQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoPolygonQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoPolygonQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], GeoPolygonQuery.prototype, "getQueryFormat", void 0);
    GeoPolygonQuery = __decorate([
        core_1.Component({
            selector: 'geo-polygon-query',
            template: "<span class=\"col-xs-6 pd-0\">\n                    <div class=\"col-xs-12 pl-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.points.value\"\n                                placeholder=\"{{inputs.points.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                    <button (click)=\"addOption();\" class=\"btn btn-info btn-xs add-option\"> <i class=\"fa fa-plus\"></i> </button>\n                </span>\n                <div class=\"col-xs-12 option-container\" *ngIf=\"optionRows.length\">\n                    <div class=\"col-xs-12 single-option\" *ngFor=\"let singleOption of optionRows, let i=index\">\n                        <div class=\"col-xs-6 pd-l0\">\n                            <editable\n                                class = \"additional-option-select-{{i}}\"\n                                [editableField]=\"singleOption.name\"\n                                [editPlaceholder]=\"'--choose option--'\"\n                                [editableInput]=\"'select2'\"\n                                [selectOption]=\"options\"\n                                [passWithCallback]=\"i\"\n                                [selector]=\"'additional-option-select'\"\n                                [querySelector]=\"querySelector\"\n                                [informationList]=\"informationList\"\n                                [showInfoFlag]=\"true\"\n                                [searchOff]=\"true\"\n                                (callback)=\"selectOption($event)\">\n                            </editable>\n                        </div>\n                        <div class=\"col-xs-6 pd-0\">\n                            <div class=\"form-group form-element\">\n                                <input class=\"form-control col-xs-12 pd-0\" type=\"text\" [(ngModel)]=\"singleOption.value\" placeholder=\"value\"  (keyup)=\"getFormat();\"/>\n                            </div>\n                        </div>\n                        <button (click)=\"removeOption(i)\" class=\"btn btn-grey delete-option btn-xs\">\n                            <i class=\"fa fa-times\"></i>\n                        </button>\n                    </div>\n                </div>",
            inputs: ['getQueryFormat', 'querySelector']
        }), 
        __metadata('design:paramtypes', [])
    ], GeoPolygonQuery);
    return GeoPolygonQuery;
}());
exports.GeoPolygonQuery = GeoPolygonQuery;
//# sourceMappingURL=geopolygon.query.js.map