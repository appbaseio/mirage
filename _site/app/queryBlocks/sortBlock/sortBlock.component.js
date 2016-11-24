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
var SortBlockComponent = (function () {
    function SortBlockComponent() {
        this.queryList = this.queryList;
        this.removeArray = [];
        this.query = this.query;
        this.allFields = [];
        this.modeList = [
            'min',
            'max',
            'sum',
            'avg',
            'median'
        ];
        this.distanceTypeList = [
            'sloppy_arc',
            'arc',
            'plane'
        ];
        this.informationList = {
            'min': {
                title: 'min',
                content: "<span class=\"description\">Pick the lowest value.</span>"
            },
            'max': {
                title: 'max',
                content: "<span class=\"description\">Pick the highest value.</span>"
            },
            'sum': {
                title: 'sum',
                content: "<span class=\"description\">Use the sum of all values as sort value. Only applicable for number based array fields.</span>"
            },
            'avg': {
                title: 'avg',
                content: "<span class=\"description\">Use the average of all values as sort value. Only applicable for number based array fields.</span>"
            },
            'median': {
                title: 'median',
                content: "<span class=\"description\">Use the median of all values as sort value. Only applicable for number based array fields.</span>"
            }
        };
        this.optionalParamsInformation = {
            'mode': {
                title: 'mode',
                content: "<span class=\"description\">The mode option controls what array value is picked for sorting the document it belongs to.</span>"
            },
            'missing': {
                title: 'missing',
                content: "<span class=\"description\">The missing parameter specifies how docs which are missing the field should be treated. The value can be set to _last, _first, or a custom value.</span>"
            },
            'nested': {
                title: 'nested',
                content: "<span class=\"description\">Allows sorting withing nested objects</span>"
            },
            '_geo_distance': {
                title: '_geo_distance',
                content: "<span class=\"description\">Allow to sort by _geo_distance.</span>"
            }
        };
        this.distanceTypeInformation = {
            'sloppy_arc': {
                title: 'sloppy_arc',
                content: "<span class=\"description\">(Default)</span>"
            },
            'arc': {
                title: 'arc',
                content: "<span class=\"description\">slightly more precise but significantly slower.</span>"
            },
            'plane': {
                title: 'plane',
                content: "<span class=\"description\">faster, but inaccurate on long distances and close to the poles.</span>"
            }
        };
        this.joiningQuery = [''];
    }
    SortBlockComponent.prototype.ngOnInit = function () {
        if (this.result.resultQuery.hasOwnProperty('availableFields')) {
            this.allFields = this.result.resultQuery.availableFields.map(function (ele) {
                return ele.name;
            });
        }
    };
    SortBlockComponent.prototype.ngOnChanges = function () {
        if (this.result.resultQuery.hasOwnProperty('availableFields')) {
            this.allFields = this.result.resultQuery.availableFields.map(function (ele) {
                return ele.name;
            });
        }
    };
    SortBlockComponent.prototype.exeBuild = function () {
        var _this = this;
        setTimeout(function () { return _this.buildQuery(); }, 300);
    };
    SortBlockComponent.prototype.initSort = function () {
        var sortObj = {
            'selectedField': '',
            'order': 'asc',
            'availableOptionalParams': []
        };
        this.result.sort.push(sortObj);
        this.exeBuild();
    };
    SortBlockComponent.prototype.deleteSort = function () {
        this.result.sort = [];
        this.exeBuild();
    };
    SortBlockComponent.prototype.sortFieldCallback = function (input) {
        var _this = this;
        var obj = this.result.sort[input.external];
        var geoFlag = false;
        obj.selectedField = input.val;
        obj.availableOptionalParams = [];
        if (!obj.mode && obj.mode != '') {
            obj.availableOptionalParams.push('mode');
        }
        if (!obj.missing && obj.missing != '') {
            obj.availableOptionalParams.push('missing');
        }
        this.result.resultQuery.availableFields.map(function (field) {
            if (field.name === input.val && field.type === 'geo_point') {
                var index = obj.availableOptionalParams.indexOf('missing');
                if (index > -1) {
                    obj.availableOptionalParams.splice(index, 1);
                }
                if (!obj['_geo_distance']) {
                    obj.availableOptionalParams.push('_geo_distance');
                }
                geoFlag = true;
                _this.modeList = ['min', 'max', 'avg', 'median'];
            }
        });
        if (!geoFlag) {
            delete obj['_geo_distance'];
            this.modeList = ['min', 'max', 'sum', 'avg', 'median'];
        }
        this.exeBuild();
    };
    SortBlockComponent.prototype.sortModeCallback = function (input) {
        this.result.sort[input.external].mode = input.val;
        this.exeBuild();
    };
    SortBlockComponent.prototype.sortDistanceTypeCallback = function (input) {
        this.result.sort[input.external]['_geo_distance']['distance_type'] = input.val;
        this.exeBuild();
    };
    SortBlockComponent.prototype.sortOptionalCallback = function (input) {
        var obj = this.result.sort[input.external];
        var index = obj.availableOptionalParams.indexOf(input.val);
        if (index > -1) {
            obj.availableOptionalParams.splice(index, 1);
        }
        if (input.val === '_geo_distance') {
            obj['_geo_distance'] = {
                'distance_type': 'sloppy_arc',
                'lat': '',
                'lon': '',
                'unit': 'm'
            };
        }
        else {
            obj[input.val] = '';
        }
    };
    SortBlockComponent.prototype.setSortOrder = function (order, index) {
        this.result.sort[index].order = order;
        this.exeBuild();
    };
    SortBlockComponent.prototype.removeSortQuery = function (index) {
        this.result.sort.splice(index, 1);
        this.exeBuild();
    };
    SortBlockComponent.prototype.removeSortOptionalQuery = function (index, type) {
        this.result.sort[index].availableOptionalParams.push(type);
        delete this.result.sort[index][type];
        this.modeList = ['min', 'max', 'sum', 'avg', 'median'];
        this.exeBuild();
    };
    SortBlockComponent.prototype.show_hidden_btns = function (event) {
        $('.bool_query').removeClass('show_hidden');
        $(event.currentTarget).addClass('show_hidden');
        event.stopPropagation();
    };
    SortBlockComponent.prototype.hide_hidden_btns = function () {
        $('.bool_query').removeClass('show_hidden');
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SortBlockComponent.prototype, "mapping", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SortBlockComponent.prototype, "types", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SortBlockComponent.prototype, "selectedTypes", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SortBlockComponent.prototype, "result", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SortBlockComponent.prototype, "joiningQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SortBlockComponent.prototype, "joiningQueryParam", void 0);
    SortBlockComponent = __decorate([
        core_1.Component({
            selector: 'sort-block',
            templateUrl: './app/queryBlocks/sortBlock/sortBlock.component.html',
            inputs: ['config', 'query', 'queryList', 'addQuery', 'removeQuery', 'addBoolQuery', 'queryFormat', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp', 'urlShare', 'setDocSample']
        }), 
        __metadata('design:paramtypes', [])
    ], SortBlockComponent);
    return SortBlockComponent;
}());
exports.SortBlockComponent = SortBlockComponent;
//# sourceMappingURL=sortBlock.component.js.map