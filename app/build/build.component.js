System.register(["angular2/core", "./boolquery/boolquery.component", "../shared/queryList", "./types/types.component"], function(exports_1, context_1) {
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
                            input: '',
                            analyzeTest: '',
                            type: ''
                        },
                        bool: {
                            boolparam: 0,
                            parent_id: 0,
                            id: 0,
                            internal: []
                        }
                    };
                }
                BuildComponent.prototype.ngOnInit = function () { };
                BuildComponent.prototype.addBoolQuery = function (parent_id) {
                    if (this.mapping.selectedTypes) {
                        var queryObj = JSON.parse(JSON.stringify(this.queryFormat.bool));
                        var internalObj = JSON.parse(JSON.stringify(this.queryFormat.internal));
                        queryObj.internal.push(internalObj);
                        queryObj.id = this.mapping.queryId;
                        queryObj.parent_id = parent_id;
                        this.mapping.queryId += 1;
                        this.mapping.resultQuery.result.push(queryObj);
                    }
                    else {
                        alert('Select type first.');
                    }
                };
                BuildComponent.prototype.addQuery = function (boolQuery) {
                    var self = this;
                    var queryObj = JSON.parse(JSON.stringify(self.queryFormat.internal));
                    boolQuery.internal.push(queryObj);
                };
                BuildComponent.prototype.buildQuery = function () {
                    var self = this;
                    var results = this.mapping.resultQuery.result;
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
                                var currentBool = self.queryList['boolQuery'][result1['boolparam']].apply;
                                current_query['bool'][currentBool] = result1.availableQuery;
                                result0.availableQuery.push(current_query);
                            }
                        });
                    });
                    console.log(results);
                    results.forEach(function (result) {
                        if (result.parent_id === 0) {
                            var currentBool = self.queryList['boolQuery'][result['boolparam']].apply;
                            finalresult[currentBool] = result.availableQuery;
                        }
                    });
                    this.mapping.resultQuery.final = JSON.stringify(es_final, null, 2);
                    this.editorHookHelp.setValue(self.mapping.resultQuery.final);
                };
                BuildComponent.prototype.buildInsideQuery = function (result) {
                    var objChain = [];
                    result.internal.forEach(function (val0) {
                        var childExists = false;
                        val0.appliedQuery = this.createQuery(val0, childExists);
                        console.log(val0.appliedQuery);
                    }.bind(this));
                    // this.buildSubQuery()
                    result.internal.forEach(function (val) {
                        objChain.push(val.appliedQuery);
                    });
                    return objChain;
                };
                BuildComponent.prototype.buildSubQuery = function () {
                    var result = this.mapping.resultQuery.result[0];
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
                BuildComponent.prototype.createQuery = function (val, childExists) {
                    var query = this.queryList[val.analyzeTest][val.type][val.query].apply;
                    var field = this.mapping.resultQuery.availableFields[val.field].name;
                    var input = val.input;
                    var sampleobj = this.setQueryFormat(query, field, val);
                    return sampleobj;
                };
                BuildComponent.prototype.setQueryFormat = function (query, field, val) {
                    var sampleobj = {};
                    switch (query) {
                        case "gt":
                        case "lt":
                            sampleobj['range'] = {};
                            sampleobj['range'][field] = {};
                            sampleobj['range'][field][query] = val.input;
                            break;
                        case "range":
                            sampleobj['range'] = {};
                            sampleobj['range'][field] = {};
                            sampleobj['range'][field] = {
                                'from': val.from,
                                'to': val.to
                            };
                            break;
                        default:
                            sampleobj[query] = {};
                            sampleobj[query][field] = val.input;
                            break;
                    }
                    return sampleobj;
                };
                BuildComponent = __decorate([
                    core_1.Component({
                        selector: 'query-build',
                        templateUrl: './app/build/build.component.html',
                        styleUrls: ['./app/build/build.component.css'],
                        inputs: ['mapping', 'config', 'detectChange', 'editorHookHelp'],
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