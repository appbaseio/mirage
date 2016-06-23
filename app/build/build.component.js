System.register(["@angular/core", "./boolquery/boolquery.component", "../shared/queryList", "./types/types.component"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, boolquery_component_1, queryList_1, types_component_1;
    var BuildComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (boolquery_component_1_1) {
                boolquery_component_1 = boolquery_component_1_1;
            },
            function (queryList_1_1) {
                queryList_1 = queryList_1_1;
            },
            function (types_component_1_1) {
                types_component_1 = types_component_1_1;
            }],
        execute: function() {
            BuildComponent = (function () {
                function BuildComponent() {
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
                            minimum_should_match: ''
                        }
                    };
                    this.saveQuery = new core_1.EventEmitter();
                    this.setProp = new core_1.EventEmitter();
                }
                BuildComponent.prototype.ngOnInit = function () {
                    this.handleEditable();
                };
                // Add the boolean query
                // get the default format for query and internal query
                // set the format and push into result array
                BuildComponent.prototype.addBoolQuery = function (parent_id) {
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
                // add internal query
                BuildComponent.prototype.addQuery = function (boolQuery) {
                    var self = this;
                    var queryObj = JSON.parse(JSON.stringify(self.queryFormat.internal));
                    boolQuery.internal.push(queryObj);
                    this.buildQuery();
                };
                // builquery - this function handles everything to build the query
                BuildComponent.prototype.buildQuery = function () {
                    var self = this;
                    var results = this.result.resultQuery.result;
                    if (results.length) {
                        var finalresult = {};
                        var es_final = {
                            'query': {
                                'bool': finalresult
                            }
                        };
                        results.forEach(function (result) {
                            result.availableQuery = self.buildInsideQuery(result);
                        });
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
                                    result0.availableQuery.push(current_query);
                                }
                            });
                        });
                        results.forEach(function (result) {
                            if (result.parent_id === 0) {
                                var currentBool = self.queryList['boolQuery'][result['boolparam']];
                                finalresult[currentBool] = result.availableQuery;
                                if (currentBool === 'should') {
                                    finalresult['minimum_should_match'] = result.minimum_should_match;
                                }
                            }
                        });
                        this.result.resultQuery.final = JSON.stringify(es_final, null, 2);
                        this.editorHookHelp.setValue(self.result.resultQuery.final);
                    }
                    else {
                        if (this.selectedTypes.length) {
                            var match_all = {
                                'query': {
                                    'match_all': {}
                                }
                            };
                            this.result.resultQuery.final = JSON.stringify(match_all, null, 2);
                            this.editorHookHelp.setValue(self.result.resultQuery.final);
                        }
                    }
                    //set input state
                    try {
                        this.urlShare.inputs['result'] = this.result;
                        this.urlShare.createUrl();
                    }
                    catch (e) { }
                };
                BuildComponent.prototype.buildInsideQuery = function (result) {
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
                BuildComponent.prototype.buildSubQuery = function () {
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
                BuildComponent.prototype.createQuery = function (val, childExists) {
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
                BuildComponent.prototype.setQueryFormat = function (query, field, val) {
                    var sampleobj = {};
                    sampleobj[query] = {};
                    sampleobj[query][field] = val.input;
                    return sampleobj;
                };
                // handle the body click event for editable
                // close all the select2 whene clicking outside of editable-element
                BuildComponent.prototype.handleEditable = function () {
                    $('body').on('click', function (e) {
                        var target = $(e.target);
                        if (target.hasClass('.editable-pack') || target.parents('.editable-pack').length) { }
                        else {
                            $('.editable-pack').removeClass('on');
                        }
                    });
                };
                // open save query modal
                BuildComponent.prototype.openModal = function () {
                    $('#saveQueryModal').modal('show');
                };
                BuildComponent.prototype.setPropIn = function (propObj) {
                    this.setProp.emit(propObj);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BuildComponent.prototype, "mapping", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BuildComponent.prototype, "types", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BuildComponent.prototype, "selectedTypes", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BuildComponent.prototype, "result", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BuildComponent.prototype, "query_info", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BuildComponent.prototype, "savedQueryList", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], BuildComponent.prototype, "finalUrl", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BuildComponent.prototype, "urlShare", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], BuildComponent.prototype, "saveQuery", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], BuildComponent.prototype, "setProp", void 0);
                BuildComponent = __decorate([
                    core_1.Component({
                        selector: 'query-build',
                        templateUrl: './app/build/build.component.html',
                        inputs: ['mapping', 'types', 'selectedTypes', 'result', 'config', 'detectChange', 'editorHookHelp', 'savedQueryList', "query_info", 'saveQuery', 'finalUrl', 'setProp', 'urlShare'],
                        directives: [types_component_1.TypesComponent, boolquery_component_1.BoolqueryComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], BuildComponent);
                return BuildComponent;
            }());
            exports_1("BuildComponent", BuildComponent);
        }
    }
});
//# sourceMappingURL=build.component.js.map