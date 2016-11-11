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
var GeoBoundingBoxQuery = (function () {
    function GeoBoundingBoxQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.queryName = '*';
        this.fieldName = '*';
        this.current_query = 'geo_bounding_box';
        this.information = {
            title: 'Geo Bounding Box Query',
            content: "<span class=\"description\">Returns matches within a bounding box area. Specified with <i>top left</i> and <i>bottom right</i> (lat, long) values.</span>\n                    <a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-query.html#query-dsl-geo-bounding-box-query\">Read more</a>"
        };
        this.informationList = {
            '_name': {
                title: '_name',
                content: "<span class=\"description\">Optional name field to identify the query.</span>"
            },
            'ignore_malformed': {
                title: 'ignore_malformed',
                content: "<span class=\"description\">Set to <strong>true</strong> to accept geo points with invalid latitude or longitude (default is false).</span>"
            },
            'type': {
                title: 'type',
                content: "<span class=\"description\">Set to <strong>memory</strong> if the query will be executed in memory, otherwise set to <strong>indexed</strong>.</span>"
            }
        };
        this.default_options = [
            '_name',
            'ignore_malformed',
            'type'
        ];
        this.singleOption = {
            name: '',
            value: ''
        };
        this.optionRows = [];
        this.inputs = {
            top_left_lat: {
                placeholder: 'TL_latitude',
                value: ''
            },
            top_left_lon: {
                placeholder: 'TL_longitude',
                value: ''
            },
            bottom_right_lat: {
                placeholder: 'BR_latitude',
                value: ''
            },
            bottom_right_lon: {
                placeholder: 'BR_longitude',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    GeoBoundingBoxQuery.prototype.ngOnInit = function () {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if (this.appliedQuery[this.current_query][this.fieldName]['top_left']['lat']) {
                this.inputs.top_left_lat.value = this.appliedQuery[this.current_query][this.fieldName]['top_left']['lat'];
            }
            if (this.appliedQuery[this.current_query][this.fieldName]['top_left']['lon']) {
                this.inputs.top_left_lon.value = this.appliedQuery[this.current_query][this.fieldName]['top_left']['lon'];
            }
            if (this.appliedQuery[this.current_query][this.fieldName]['bottom_right']['lat']) {
                this.inputs.bottom_right_lat.value = this.appliedQuery[this.current_query][this.fieldName]['bottom_right']['lat'];
            }
            if (this.appliedQuery[this.current_query][this.fieldName]['bottom_right']['lon']) {
                this.inputs.bottom_right_lon.value = this.appliedQuery[this.current_query][this.fieldName]['bottom_right']['lon'];
            }
            for (var option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'top_left' && option != 'bottom_right') {
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
    GeoBoundingBoxQuery.prototype.ngOnChanges = function () {
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
    GeoBoundingBoxQuery.prototype.getFormat = function () {
        if (this.queryName === this.current_query) {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    GeoBoundingBoxQuery.prototype.setFormat = function () {
        var queryFormat = (_a = {},
            _a[this.queryName] = (_b = {},
                _b[this.fieldName] = {
                    top_left: {
                        lat: this.inputs.top_left_lat.value,
                        lon: this.inputs.top_left_lon.value
                    },
                    bottom_right: {
                        lat: this.inputs.bottom_right_lat.value,
                        lon: this.inputs.bottom_right_lon.value
                    }
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
    GeoBoundingBoxQuery.prototype.selectOption = function (input) {
        input.selector.parents('.editable-pack').removeClass('on');
        this.optionRows[input.external].name = input.val;
        this.filterOptions();
        setTimeout(function () {
            this.getFormat();
        }.bind(this), 300);
    };
    GeoBoundingBoxQuery.prototype.filterOptions = function () {
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
    GeoBoundingBoxQuery.prototype.addOption = function () {
        var singleOption = JSON.parse(JSON.stringify(this.singleOption));
        this.filterOptions();
        this.optionRows.push(singleOption);
    };
    GeoBoundingBoxQuery.prototype.removeOption = function (index) {
        this.optionRows.splice(index, 1);
        this.filterOptions();
        this.getFormat();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoBoundingBoxQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoBoundingBoxQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoBoundingBoxQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoBoundingBoxQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], GeoBoundingBoxQuery.prototype, "getQueryFormat", void 0);
    GeoBoundingBoxQuery = __decorate([
        core_1.Component({
            selector: 'geo-bounding-box-query',
            template: "<span class=\"col-xs-6 pd-0\">\n                    <div class=\"col-xs-3 pl-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.top_left_lat.value\"\n                                placeholder=\"{{inputs.top_left_lat.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                    <div class=\"col-xs-3 pr-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.top_left_lon.value\"\n                                placeholder=\"{{inputs.top_left_lon.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                     <div class=\"col-xs-3 pl-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.bottom_right_lat.value\"\n                                placeholder=\"{{inputs.bottom_right_lat.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                    <div class=\"col-xs-3 pr-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.bottom_right_lon.value\"\n                                placeholder=\"{{inputs.bottom_right_lon.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                    <button (click)=\"addOption();\" class=\"btn btn-info btn-xs add-option\"> <i class=\"fa fa-plus\"></i> </button>\n                </span>\n                <div class=\"col-xs-12 option-container\" *ngIf=\"optionRows.length\">\n                    <div class=\"col-xs-12 single-option\" *ngFor=\"let singleOption of optionRows, let i=index\">\n                        <div class=\"col-xs-6 pd-l0\">\n                            <editable\n                                class = \"additional-option-select-{{i}}\"\n                                [editableField]=\"singleOption.name\"\n                                [editPlaceholder]=\"'--choose option--'\"\n                                [editableInput]=\"'select2'\"\n                                [selectOption]=\"options\"\n                                [passWithCallback]=\"i\"\n                                [selector]=\"'additional-option-select'\"\n                                [querySelector]=\"querySelector\"\n                                [informationList]=\"informationList\"\n                                [showInfoFlag]=\"true\"\n                                [searchOff]=\"true\"\n                                (callback)=\"selectOption($event)\">\n                            </editable>\n                        </div>\n                        <div class=\"col-xs-6 pd-0\">\n                            <div class=\"form-group form-element\">\n                                <input class=\"form-control col-xs-12 pd-0\" type=\"text\" [(ngModel)]=\"singleOption.value\" placeholder=\"value\"  (keyup)=\"getFormat();\"/>\n                            </div>\n                        </div>\n                        <button (click)=\"removeOption(i)\" class=\"btn btn-grey delete-option btn-xs\">\n                            <i class=\"fa fa-times\"></i>\n                        </button>\n                    </div>\n                </div>",
            inputs: ['getQueryFormat', 'querySelector']
        }), 
        __metadata('design:paramtypes', [])
    ], GeoBoundingBoxQuery);
    return GeoBoundingBoxQuery;
}());
exports.GeoBoundingBoxQuery = GeoBoundingBoxQuery;
//# sourceMappingURL=geoboundingbox.query.js.map