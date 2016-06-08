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
var boolquery_component_1 = require("./boolquery/boolquery.component");
var queryList_1 = require("../shared/queryList");
var types_component_1 = require("./types/types.component");
var BuildComponent = (function () {
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
                internal: [],
                minimum_should_match: ''
            }
        };
    }
    BuildComponent.prototype.ngOnInit = function () {
        this.handleEditable();
    };
    // Add the boolean query
    // get the default format for query and internal query
    // set the format and push into result array
    BuildComponent.prototype.addBoolQuery = function (parent_id) {
        if (this.mapping.selectedTypes) {
            var queryObj = JSON.parse(JSON.stringify(this.queryFormat.bool));
            var internalObj = JSON.parse(JSON.stringify(this.queryFormat.internal));
            queryObj.internal.push(internalObj);
            queryObj.id = this.mapping.queryId;
            queryObj.parent_id = parent_id;
            this.mapping.queryId += 1;
            this.mapping.resultQuery.result.push(queryObj);
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
        this.mapping.resultQuery.final = JSON.stringify(es_final, null, 2);
        this.editorHookHelp.setValue(self.mapping.resultQuery.final);
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
                queryParam.field = this.mapping.resultQuery.availableFields[val.field].name;
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
            if (target.hasClass('.editable-pack') || target.parents('.editable-pack').length) {
            }
            else {
                $('.editable-pack').removeClass('on');
            }
        });
    };
    // open save query modal
    BuildComponent.prototype.openModal = function () {
        $('#saveQueryModal').modal('show');
    };
    // save query
    BuildComponent.prototype.save = function () {
        this.savedQueryList.forEach(function (query, index) {
            if (query.name === this.query_info.name && query.tag === this.query_info.tag) {
                this.savedQueryList.splice(index, 1);
            }
        }.bind(this));
        var queryData = {
            mapping: this.mapping,
            config: this.config,
            name: this.query_info.name,
            tag: this.query_info.tag
        };
        this.savedQueryList.push(queryData);
        try {
            window.localStorage.setItem('queryList', JSON.stringify(this.savedQueryList));
        }
        catch (e) { }
        $('#saveQueryModal').modal('hide');
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], BuildComponent.prototype, "query_info", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], BuildComponent.prototype, "savedQueryList", void 0);
    BuildComponent = __decorate([
        core_1.Component({
            selector: 'query-build',
            templateUrl: './app/build/build.component.html',
            inputs: ['mapping', 'config', 'detectChange', 'editorHookHelp', 'savedQueryList', "query_info"],
            directives: [types_component_1.TypesComponent, boolquery_component_1.BoolqueryComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], BuildComponent);
    return BuildComponent;
}());
exports.BuildComponent = BuildComponent;
//# sourceMappingURL=build.component.js.map