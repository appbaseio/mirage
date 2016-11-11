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
var BoolqueryComponent = (function () {
    function BoolqueryComponent() {
        this.queryList = this.queryList;
        this.removeArray = [];
        this.query = this.query;
        this.informationList = {
            'nested': {
                title: 'nested',
                content: "<span class=\"description\">Nested query allows you to run a query against the nested documents and filter parent docs by those that have at least one nested document matching the query.</span>\n\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-nested-query.html#query-dsl-nested-query\">Read more</a>"
            },
            'has_child': {
                title: 'has_child',
                content: "<span class=\"description\">has_child filter accepts a query and the child type to run against, and results in parent documents that have child docs matching the query.</span>\n\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-child-query.html#query-dsl-has-child-query\">Read more</a>"
            },
            'has_parent': {
                title: 'has_parent',
                content: "<span class=\"description\">has_parent query accepts a query and a parent type. The query is executed in the parent document space, which is specified by the parent type, and returns child documents which associated parents have matched.</span>\n\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-parent-query.html#query-dsl-has-parent-query\">Read more</a>"
            },
            'parent_id': {
                title: 'parent_id',
                content: "<span class=\"description\">parent_id query can be used to find child documents which belong to a particular parent. </span>\n\t\t\t\t<a class=\"link\" href=\"https://www.elastic.co/guide/en/elasticsearch/reference/5.0/query-dsl-parent-id-query.html#query-dsl-parent-id-query\">Read more</a>"
            }
        };
        this.joiningQuery = [''];
        this.setJoiningQuery = new core_1.EventEmitter();
        this.setDocSample = new core_1.EventEmitter();
    }
    BoolqueryComponent.prototype.ngOnInit = function () {
        this.allFields = this.result.resultQuery.availableFields;
        this.exeBuild();
    };
    BoolqueryComponent.prototype.ngOnChanges = function () {
        this.allFields = this.result.resultQuery.availableFields;
    };
    BoolqueryComponent.prototype.addSubQuery = function (id) {
        this.addBoolQuery(id);
    };
    BoolqueryComponent.prototype.removeInQuery = function (id) {
        var resulQueries = this.result.resultQuery.result;
        this.removeArray.push(id);
        var removeFlag = true;
        resulQueries.forEach(function (v, i) {
            if (v.parent_id == id) {
                this.removeInQuery(v.id);
                removeFlag = false;
            }
        }.bind(this));
        if (removeFlag) {
            this.removeArray.forEach(function (remove_q) {
                resulQueries.forEach(function (v, i) {
                    if (v.id == remove_q) {
                        resulQueries.splice(i, 1);
                    }
                }.bind(this));
            }.bind(this));
        }
        this.buildQuery();
    };
    BoolqueryComponent.prototype.exeBuild = function () {
        var _this = this;
        setTimeout(function () { return _this.buildQuery(); }, 300);
    };
    BoolqueryComponent.prototype.booleanChange = function (boolVal) {
        this.query.boolparam = boolVal;
        this.exeBuild();
    };
    BoolqueryComponent.prototype.joiningQueryChange = function (val) {
        if (val.val) {
            val = this.joiningQuery.indexOf(val.val);
        }
        this.joiningQueryParam = val;
        this.setJoiningQuery.emit({
            param: val,
            allFields: this.allFields
        });
        this.exeBuild();
    };
    BoolqueryComponent.prototype.show_hidden_btns = function (event) {
        $('.bool_query').removeClass('show_hidden');
        $(event.currentTarget).addClass('show_hidden');
        event.stopPropagation();
    };
    BoolqueryComponent.prototype.hide_hidden_btns = function () {
        $('.bool_query').removeClass('show_hidden');
    };
    BoolqueryComponent.prototype.setDocSampleEve = function (link) {
        this.setDocSample.emit(link);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], BoolqueryComponent.prototype, "mapping", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], BoolqueryComponent.prototype, "types", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], BoolqueryComponent.prototype, "selectedTypes", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], BoolqueryComponent.prototype, "result", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], BoolqueryComponent.prototype, "joiningQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], BoolqueryComponent.prototype, "joiningQueryParam", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], BoolqueryComponent.prototype, "setJoiningQuery", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], BoolqueryComponent.prototype, "setDocSample", void 0);
    BoolqueryComponent = __decorate([
        core_1.Component({
            selector: 'bool-query',
            templateUrl: './app/queryBlocks/boolquery/boolquery.component.html',
            inputs: ['config', 'query', 'queryList', 'addQuery', 'removeQuery', 'addBoolQuery', 'queryFormat', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp', 'urlShare', 'setDocSample']
        }), 
        __metadata('design:paramtypes', [])
    ], BoolqueryComponent);
    return BoolqueryComponent;
}());
exports.BoolqueryComponent = BoolqueryComponent;
//# sourceMappingURL=boolquery.component.js.map