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
var queryList_1 = require("../shared/queryList");
var QueryBlocksComponent = (function () {
    function QueryBlocksComponent() {
        this.queryList = queryList_1.queryList;
        this.queryFormat = {
            internal: {
                field: '',
                query: '',
                selectedField: '',
                selectedQuery: '',
                input: '',
                analyzeTest: '',
                type: ''
            },
            bool: {
                boolparam: 0,
                parent_id: 0,
                id: 0,
                internal: [],
                minimum_should_match: '',
                path: '',
                type: '',
                xid: 0,
                parent_type: '',
                score_mode: ''
            }
        };
        this.joiningQuery = [''];
        this.joiningQueryParam = 0;
        this.saveQuery = new core_1.EventEmitter();
        this.setProp = new core_1.EventEmitter();
        this.setDocSample = new core_1.EventEmitter();
    }
    QueryBlocksComponent.prototype.ngOnInit = function () {
        this.handleEditable();
        this.joiningQuery = this.result.joiningQuery;
    };
    QueryBlocksComponent.prototype.ngOnChanges = function () {
        this.joiningQuery = this.result.joiningQuery;
    };
    // Add the boolean query
    // get the default format for query and internal query
    // set the format and push into result array
    QueryBlocksComponent.prototype.addBoolQuery = function (parent_id) {
        if (this.selectedTypes) {
            var queryObj = JSON.parse(JSON.stringify(this.queryFormat.bool));
            var internalObj = JSON.parse(JSON.stringify(this.queryFormat.internal));
            queryObj.internal.push(internalObj);
            queryObj.id = this.result.queryId;
            queryObj.parent_id = parent_id;
            this.result.queryId += 1;
            this.result.resultQuery.result.push(queryObj);
            this.buildQuery();
        }
        else {
            alert('Select type first.');
        }
    };
    QueryBlocksComponent.prototype.removeQuery = function () {
        this.result.resultQuery.result = [];
        this.buildQuery();
    };
    QueryBlocksComponent.prototype.addSortBlock = function () {
        var sortObj = {
            'selectedField': '',
            'order': 'asc',
            'availableOptionalParams': []
        };
        this.result.sort.push(sortObj);
    };
    QueryBlocksComponent.prototype.removeSortBlock = function () {
        this.result.sort = [];
        this.buildQuery();
    };
    // add internal query
    QueryBlocksComponent.prototype.addQuery = function (boolQuery) {
        var self = this;
        var queryObj = JSON.parse(JSON.stringify(self.queryFormat.internal));
        boolQuery.internal.push(queryObj);
        this.buildQuery();
    };
    // builquery - this function handles everything to build the query
    QueryBlocksComponent.prototype.buildQuery = function () {
        var self = this;
        var results = this.result.resultQuery.result;
        var es_final = {};
        if (results.length) {
            var finalresult = {};
            es_final['query'] = {
                'bool': finalresult
            };
            results.forEach(function (result) {
                result.availableQuery = self.buildInsideQuery(result);
            });
            var isBoolPresent = true;
            results.forEach(function (result0) {
                results.forEach(function (result1) {
                    if (result1.parent_id == result0.id) {
                        var current_query = {
                            'bool': {}
                        };
                        var currentBool = self.queryList['boolQuery'][result1['boolparam']];
                        current_query['bool'][currentBool] = result1.availableQuery;
                        if (currentBool === 'should') {
                            current_query['bool']['minimum_should_match'] = result1.minimum_should_match;
                        }
                        if (self.joiningQuery[self.joiningQueryParam] === 'nested') {
                            current_query['bool']['nested']['path'] = result1.path;
                            current_query['bool']['nested']['score_mode'] = result1.score_mode;
                            isBoolPresent = false;
                        }
                        result0.availableQuery.push(current_query);
                    }
                });
            });
            results.forEach(function (result) {
                if (result.parent_id === 0) {
                    var currentBool = self.queryList['boolQuery'][result['boolparam']];
                    if (self.joiningQuery && self.joiningQuery[self.joiningQueryParam] === 'nested') {
                        finalresult['nested'] = {
                            path: result.path,
                            score_mode: result.score_mode,
                            query: {
                                bool: (_a = {},
                                    _a[currentBool] = result.availableQuery,
                                    _a
                                )
                            }
                        };
                        isBoolPresent = false;
                    }
                    else if (self.joiningQuery && self.joiningQuery[self.joiningQueryParam] === 'has_child') {
                        finalresult[currentBool] = {
                            has_child: {
                                type: result.type,
                                score_mode: result.score_mode,
                                query: result.availableQuery
                            }
                        };
                    }
                    else if (self.joiningQuery && self.joiningQuery[self.joiningQueryParam] === 'has_parent') {
                        finalresult[currentBool] = {
                            has_parent: {
                                parent_type: result.parent_type,
                                query: result.availableQuery
                            }
                        };
                    }
                    else if (self.joiningQuery && self.joiningQuery[self.joiningQueryParam] === 'parent_id') {
                        finalresult[currentBool] = {
                            parent_id: {
                                type: result.type,
                                id: result.xid
                            }
                        };
                    }
                    else {
                        finalresult[currentBool] = result.availableQuery;
                    }
                    if (currentBool === 'should') {
                        finalresult['minimum_should_match'] = result.minimum_should_match;
                    }
                }
                var _a;
            });
            if (!isBoolPresent) {
                es_final['query'] = es_final['query']['bool'];
            }
        }
        else {
            if (this.selectedTypes.length) {
                es_final['query'] = {
                    'match_all': {}
                };
            }
        }
        // apply sort
        if (self.result.sort) {
            self.result.sort.map(function (sortObj) {
                if (sortObj.selectedField) {
                    if (!es_final.hasOwnProperty('sort')) {
                        es_final['sort'] = [];
                    }
                    var obj = {};
                    if (sortObj._geo_distance) {
                        obj = (_a = {},
                            _a['_geo_distance'] = (_b = {},
                                _b[sortObj.selectedField] = {
                                    'lat': sortObj._geo_distance.lat,
                                    'lon': sortObj._geo_distance.lon
                                },
                                _b['order'] = sortObj.order,
                                _b['distance_type'] = sortObj._geo_distance.distance_type,
                                _b['unit'] = sortObj._geo_distance.unit || 'm',
                                _b
                            ),
                            _a
                        );
                        if (sortObj.mode) {
                            obj['_geo_distance']['mode'] = sortObj.mode;
                        }
                    }
                    else {
                        obj = (_c = {},
                            _c[sortObj.selectedField] = {
                                'order': sortObj.order
                            },
                            _c
                        );
                        if (sortObj.mode) {
                            obj[sortObj.selectedField]['mode'] = sortObj.mode;
                        }
                        if (sortObj.missing) {
                            obj[sortObj.selectedField]['missing'] = sortObj.missing;
                        }
                    }
                    es_final['sort'].push(obj);
                }
                var _a, _b, _c;
            });
        }
        this.result.resultQuery.final = JSON.stringify(es_final, null, 2);
        try {
            this.editorHookHelp.setValue(self.result.resultQuery.final);
        }
        catch (e) {
            console.log(e);
        }
        //set input state
        try {
            this.urlShare.inputs['result'] = this.result;
            this.urlShare.createUrl();
        }
        catch (e) {
            console.log(e);
        }
    };
    QueryBlocksComponent.prototype.buildInsideQuery = function (result) {
        var objChain = [];
        result.internal.forEach(function (val0) {
            var childExists = false;
            val0.appliedQuery = this.createQuery(val0, childExists);
        }.bind(this));
        result.internal.forEach(function (val) {
            objChain.push(val.appliedQuery);
        });
        return objChain;
    };
    QueryBlocksComponent.prototype.buildSubQuery = function () {
        var result = this.result.resultQuery.result[0];
        result.forEach(function (val0) {
            if (val0.parent_id != 0) {
                result.forEach(function (val1) {
                    if (val0.parent_id == val1.id) {
                        val1.appliedQuery['bool']['must'].push(val0.appliedQuery);
                    }
                }.bind(this));
            }
        }.bind(this));
    };
    // Createquery until query is selected
    QueryBlocksComponent.prototype.createQuery = function (val, childExists) {
        var queryParam = {
            query: '*',
            field: '*',
            queryFlag: true,
            fieldFlag: true
        };
        if (val.analyzeTest === '' || val.type === '' || val.query === '') {
            queryParam.queryFlag = false;
        }
        if (val.field === '') {
            queryParam.fieldFlag = false;
        }
        if (queryParam.queryFlag) {
            return val.appliedQuery;
        }
        else {
            if (queryParam.fieldFlag) {
                queryParam.field = val.selectedField;
            }
            var sampleobj = this.setQueryFormat(queryParam.query, queryParam.field, val);
            return sampleobj;
        }
    };
    QueryBlocksComponent.prototype.setQueryFormat = function (query, field, val) {
        var sampleobj = {};
        sampleobj[query] = {};
        sampleobj[query][field] = val.input;
        return sampleobj;
    };
    QueryBlocksComponent.prototype.toggleBoolQuery = function () {
        if (this.result.resultQuery.result.length < 1 && this.selectedTypes.length > 0) {
            this.addBoolQuery(0);
        }
        else {
            this.removeQuery();
        }
    };
    QueryBlocksComponent.prototype.toggleSortQuery = function () {
        if (this.result.sort) {
            console.log("coming");
            if (this.result.sort.length < 1 && this.selectedTypes.length > 0) {
                this.addSortBlock();
            }
            else {
                this.removeSortBlock();
            }
        }
        else {
            this.result.sort = [];
            this.addSortBlock();
        }
    };
    // handle the body click event for editable
    // close all the select2 whene clicking outside of editable-element
    QueryBlocksComponent.prototype.handleEditable = function () {
        $('body').on('click', function (e) {
            var target = $(e.target);
            if (target.hasClass('.editable-pack') || target.parents('.editable-pack').length) { }
            else {
                $('.editable-pack').removeClass('on');
            }
        });
    };
    // open save query modal
    QueryBlocksComponent.prototype.openModal = function () {
        $('#saveQueryModal').modal('show');
    };
    QueryBlocksComponent.prototype.setPropIn = function (propObj) {
        this.setProp.emit(propObj);
    };
    QueryBlocksComponent.prototype.setDocSampleEve = function (link) {
        this.setDocSample.emit(link);
    };
    QueryBlocksComponent.prototype.setJoiningQueryEve = function (obj) {
        this.joiningQueryParam = obj.param;
        this.result.resultQuery.availableFields = obj.allFields;
        this.buildQuery();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], QueryBlocksComponent.prototype, "mapping", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], QueryBlocksComponent.prototype, "types", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], QueryBlocksComponent.prototype, "selectedTypes", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], QueryBlocksComponent.prototype, "result", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], QueryBlocksComponent.prototype, "query_info", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], QueryBlocksComponent.prototype, "savedQueryList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], QueryBlocksComponent.prototype, "finalUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], QueryBlocksComponent.prototype, "urlShare", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], QueryBlocksComponent.prototype, "config", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], QueryBlocksComponent.prototype, "saveQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], QueryBlocksComponent.prototype, "setProp", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], QueryBlocksComponent.prototype, "setDocSample", void 0);
    QueryBlocksComponent = __decorate([
        core_1.Component({
            selector: 'query-blocks',
            templateUrl: './app/queryBlocks/queryBlocks.component.html',
            inputs: ['detectChange', 'editorHookHelp', 'saveQuery', 'setProp', 'setDocSample']
        }), 
        __metadata('design:paramtypes', [])
    ], QueryBlocksComponent);
    return QueryBlocksComponent;
}());
exports.QueryBlocksComponent = QueryBlocksComponent;
//# sourceMappingURL=queryBlocks.component.js.map