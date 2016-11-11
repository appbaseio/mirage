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
var GeoHashCellQuery = (function () {
    function GeoHashCellQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.queryName = '*';
        this.fieldName = '*';
        this.current_query = 'geohash_cell';
        this.information = {
            title: 'Geohash Cell Query',
            content: "<span class=\"description\">Returns geo_point matches in proximity of the specified geohash cell.<br><br>\n\t\t\t\tA geohash cell is defined by setting additional properties to the geo_point mapping type.</span>\n                    <a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geohash-cell-query.html#query-dsl-geohash-cell-query\">Read more</a>"
        };
        this.informationList = {
            'neighbors': {
                title: 'neighbors',
                content: "<span class=\"description\">When set to <strong>true</strong>, it returns matches next to the specified geohash cell.</span>"
            }
        };
        this.default_options = [
            'neighbors'
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
            precision: {
                placeholder: 'Precision',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    GeoHashCellQuery.prototype.ngOnInit = function () {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if (this.appliedQuery[this.current_query][this.fieldName]['lat']) {
                this.inputs.lat.value = this.appliedQuery[this.current_query][this.fieldName]['lat'];
            }
            if (this.appliedQuery[this.current_query][this.fieldName]['lon']) {
                this.inputs.lon.value = this.appliedQuery[this.current_query][this.fieldName]['lon'];
            }
            if (this.appliedQuery[this.current_query]['precision']) {
                this.inputs.precision.value = this.appliedQuery[this.current_query]['precision'];
            }
            for (var option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'lat' && option != 'lon') {
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
    GeoHashCellQuery.prototype.ngOnChanges = function () {
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
    GeoHashCellQuery.prototype.getFormat = function () {
        if (this.queryName === this.current_query) {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    };
    GeoHashCellQuery.prototype.setFormat = function () {
        var queryFormat = (_a = {},
            _a[this.queryName] = (_b = {},
                _b[this.fieldName] = {
                    lat: this.inputs.lat.value,
                    lon: this.inputs.lon.value
                },
                _b.precision = this.inputs.precision.value,
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
    GeoHashCellQuery.prototype.selectOption = function (input) {
        input.selector.parents('.editable-pack').removeClass('on');
        this.optionRows[input.external].name = input.val;
        this.filterOptions();
        setTimeout(function () {
            this.getFormat();
        }.bind(this), 300);
    };
    GeoHashCellQuery.prototype.filterOptions = function () {
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
    GeoHashCellQuery.prototype.addOption = function () {
        var singleOption = JSON.parse(JSON.stringify(this.singleOption));
        this.filterOptions();
        this.optionRows.push(singleOption);
    };
    GeoHashCellQuery.prototype.removeOption = function (index) {
        this.optionRows.splice(index, 1);
        this.filterOptions();
        this.getFormat();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoHashCellQuery.prototype, "queryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoHashCellQuery.prototype, "selectedField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoHashCellQuery.prototype, "appliedQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GeoHashCellQuery.prototype, "selectedQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], GeoHashCellQuery.prototype, "getQueryFormat", void 0);
    GeoHashCellQuery = __decorate([
        core_1.Component({
            selector: 'geohash-cell-query',
            template: "<span class=\"col-xs-6 pd-0\">\n                    <div class=\"col-xs-4 pl-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.lat.value\"\n                                placeholder=\"{{inputs.lat.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                    <div class=\"col-xs-4 pr-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.lon.value\"\n                                placeholder=\"{{inputs.lon.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                    <div class=\"col-xs-4 pl-0\">\n                        <div class=\"form-group form-element\">\n                            <input type=\"text\" class=\"form-control col-xs-12\"\n                                [(ngModel)]=\"inputs.precision.value\"\n                                placeholder=\"{{inputs.precision.placeholder}}\"\n                                (keyup)=\"getFormat();\" />\n                        </div>\n                    </div>\n                    <button (click)=\"addOption();\" class=\"btn btn-info btn-xs add-option\"> <i class=\"fa fa-plus\"></i> </button>\n                </span>\n                <div class=\"col-xs-12 option-container\" *ngIf=\"optionRows.length\">\n                    <div class=\"col-xs-12 single-option\" *ngFor=\"let singleOption of optionRows, let i=index\">\n                        <div class=\"col-xs-6 pd-l0\">\n                            <editable\n                                class = \"additional-option-select-{{i}}\"\n                                [editableField]=\"singleOption.name\"\n                                [editPlaceholder]=\"'--choose option--'\"\n                                [editableInput]=\"'select2'\"\n                                [selectOption]=\"options\"\n                                [passWithCallback]=\"i\"\n                                [selector]=\"'additional-option-select'\"\n                                [querySelector]=\"querySelector\"\n                                [informationList]=\"informationList\"\n                                [showInfoFlag]=\"true\"\n                                [searchOff]=\"true\"\n                                (callback)=\"selectOption($event)\">\n                            </editable>\n                        </div>\n                        <div class=\"col-xs-6 pd-0\">\n                            <div class=\"form-group form-element\">\n                                <input class=\"form-control col-xs-12 pd-0\" type=\"text\" [(ngModel)]=\"singleOption.value\" placeholder=\"value\"  (keyup)=\"getFormat();\"/>\n                            </div>\n                        </div>\n                        <button (click)=\"removeOption(i)\" class=\"btn btn-grey delete-option btn-xs\">\n                            <i class=\"fa fa-times\"></i>\n                        </button>\n                    </div>\n                </div>",
            inputs: ['getQueryFormat', 'querySelector']
        }), 
        __metadata('design:paramtypes', [])
    ], GeoHashCellQuery);
    return GeoHashCellQuery;
}());
exports.GeoHashCellQuery = GeoHashCellQuery;
//# sourceMappingURL=geohashcell.query.js.map