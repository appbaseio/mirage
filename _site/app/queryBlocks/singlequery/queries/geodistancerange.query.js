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
var GeoDistanceRangeQuery = (function () {
    function GeoDistanceRangeQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.queryName = '*';
        this.fieldName = '*';
        this.current_query = 'geo_distance_range';
        this.information = {
            title: 'Geo Distance Range Query',
            content: "<span class=\"description\">Filters documents that exists within a range from a specific geo point.</span>\n                    <a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-range-query.html#query-dsl-geo-distance-range-query\">Read more</a>"
        };
        this.informationList = {
            'distance_type': {
                title: 'distance_type',
                content: "<span class=\"description\">How to compute the distance. Can either be <strong>sloppy_arc</strong> (default), <strong>arc</strong>\n                        (slightly more precise but significantly slower) or <strong>plane</strong> (faster, but inaccurate on long distances and close to the poles).</span>"
            },
            'optimize_bbox': {
                title: 'optimize_bbox',
                content: "<span class=\"description\">Defaults to <strong>memory</strong> which will do in memory bounding box checks before the distance check. Can also have values of <strong>indexed</strong> to use indexed value check, or <strong>none</strong> which disables bounding box optimization.</span>"
            },
            '_name': {
                title: '_name',
                content: "<span class=\"description\">Optional name field to identify the query.</span>"
            },
            'ignore_malformed': {
                title: 'ignore_malformed',
                content: "<span class=\"description\">Set to <strong>true</strong> to accept geo points with invalid latitude or longitude (default is <strong>false</strong>).</span>"
            }
        };
        this.default_options = [
            'distance_type',
            'optimize_bbox',
            '_name',
            'ignore_malformed'
        ];
        this.singleOption = {
            name: '',
            value: ''
        };
        this.optionRows = [];
        this.inputs = {
            lat: {
                placeholder: 'Latitude',
                value: ''
            },
            lon: {
                placeholder: 'Longitude',
                value: ''
            },
            from: {
                placeholder: 'From (with unit)',
                value: ''
            },
            to: {
                placeholder: 'To (with unit)',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    GeoDistanceRangeQuery.prototype.ngOnInit = function () {
        try {
            if (this.appliedQuery[this.current_query][this.fieldName]['lat']) {
                this.inputs.lat.value = this.appliedQuery[this.current_query][this.fieldName]['lat'];
            }
            if (this.appliedQuery[this.current_query][this.fieldName]['lon']) {
                this.inputs.lon.value = this.appliedQuery[this.current_query][this.fieldName]['lon'];
            }
            if (this.appliedQuery[this.current_query][this.fieldName]['from']) {
                this.inputs.from.value = this.appliedQuery[this.current_query][this.fieldName]['from'];
            }
            if (this.appliedQuery[this.current_query][this.fieldName]['to']) {
                this.inputs.to.value = this.appliedQuery[this.current_query][this.fieldName]['to'];
            }
            for (var option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'lat' && option != 'lon' && option != 'from' && option != 'to') {
                    var obj = {
                        name: option,
                        value: this.appliedQuery[this.current_query][this.fieldName][option]
                    };
                }
            }
        }
        catch (e) { }
        this.getFormat();
    };
    GeoDistanceRangeQuery.prototype.ngOnChanges = function () {
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
    GeoDistanceRangeQuery.prototype.getFormat = function () {
        if (this.queryName === this.current_query) {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    GeoDistanceRangeQuery.prototype.setFormat = function () {
        var queryFormat = (_a = {},
            _a[this.queryName] = (_b = {},
                _b[this.fieldName] = {
                    lat: this.inputs.lat.value,
                    lon: this.inputs.lon.value
                },
                _b.from = this.inputs.from.value,
                _b.to = this.inputs.to.value,
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
    GeoDistanceRangeQuery.prototype.selectOption = function (input) {
        input.selector.parents('.editable-pack').removeClass('on');
        this.optionRows[input.external].name = input.val;
        this.filterOptions();
        setTimeout(function () {
            this.getFormat();
        }.bind(this), 300);
    };
    GeoDistanceRangeQuery.prototype.filterOptions = function () {
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
    GeoDistanceRangeQuery.prototype.addOption = function () {
        var singleOption = JSON.parse(JSON.stringify(this.singleOption));
        this.filterOptions();
        this.optionRows.push(singleOption);
    };
    GeoDistanceRangeQuery.prototype.removeOption = function (index) {
        this.optionRows.splice(index, 1);
        this.filterOptions();
        this.getFormat();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoDistanceRangeQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoDistanceRangeQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoDistanceRangeQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoDistanceRangeQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], GeoDistanceRangeQuery.prototype, "getQueryFormat", void 0);
    GeoDistanceRangeQuery = __decorate([
        core_1.Component({
            selector: 'geo-distance-range-query',
            template: "<span class=\"col-xs-6 pd-0\">\n                    <div class=\"col-xs-6 pl-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.from.value\"\n                                placeholder=\"{{inputs.from.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                    <div class=\"col-xs-6 pl-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.to.value\"\n                                placeholder=\"{{inputs.to.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                    <div class=\"col-xs-6 pl-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.lat.value\"\n                                placeholder=\"{{inputs.lat.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                    <div class=\"col-xs-6 pr-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.lon.value\"\n                                placeholder=\"{{inputs.lon.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n\t\t\t\t\t\t\t\t\t\t<button (click)=\"addOption();\" class=\"btn btn-info btn-xs add-option\"> <i class=\"fa fa-plus\"></i> </button>\n                </span>\n\t\t\t\t\t\t\t\t<div class=\"col-xs-12 option-container\" *ngIf=\"optionRows.length\">\n                    <div class=\"col-xs-12 single-option\" *ngFor=\"let singleOption of optionRows, let i=index\">\n                        <div class=\"col-xs-6 pd-l0\">\n                            <editable\n                                class = \"additional-option-select-{{i}}\"\n                                [editableField]=\"singleOption.name\"\n                                [editPlaceholder]=\"'--choose option--'\"\n                                [editableInput]=\"'select2'\"\n                                [selectOption]=\"options\"\n                                [passWithCallback]=\"i\"\n                                [selector]=\"'additional-option-select'\"\n                                [querySelector]=\"querySelector\"\n                                [informationList]=\"informationList\"\n                                [showInfoFlag]=\"true\"\n                                [searchOff]=\"true\"\n                                (callback)=\"selectOption($event)\">\n                            </editable>\n                        </div>\n                        <div class=\"col-xs-6 pd-0\">\n                            <div class=\"form-group form-element\">\n                                <input class=\"form-control col-xs-12 pd-0\" type=\"text\" [(ngModel)]=\"singleOption.value\" placeholder=\"value\"  (keyup)=\"getFormat();\"/>\n                            </div>\n                        </div>\n                        <button (click)=\"removeOption(i)\" class=\"btn btn-grey delete-option btn-xs\">\n                            <i class=\"fa fa-times\"></i>\n                        </button>\n                    </div>\n                </div>",
            inputs: ['getQueryFormat', 'querySelector']
        }), 
        __metadata('design:paramtypes', [])
    ], GeoDistanceRangeQuery);
    return GeoDistanceRangeQuery;
}());
exports.GeoDistanceRangeQuery = GeoDistanceRangeQuery;
//# sourceMappingURL=geodistancerange.query.js.map