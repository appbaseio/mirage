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
var select2_component_1 = require('../select2/select2.component');
var editable_component_1 = require('../editable/editable.component');
var match_query_1 = require('./queries/match.query');
var match_phrase_query_1 = require('./queries/match_phrase.query');
var match_phase_prefix_query_1 = require('./queries/match_phase_prefix.query');
var range_query_1 = require('./queries/range.query');
var gt_query_1 = require('./queries/gt.query');
var lt_query_1 = require('./queries/lt.query');
var term_query_1 = require('./queries/term.query');
var exists_query_1 = require('./queries/exists.query');
var terms_query_1 = require('./queries/terms.query');
var prefix_query_1 = require('./queries/prefix.query');
var multi_match_query_1 = require('./queries/multi-match.query');
var query_string_query_1 = require('./queries/query_string.query');
var simple_query_string_query_1 = require('./queries/simple_query_string.query');
var missing_query_1 = require('./queries/missing.query');
var wildcard_query_1 = require('./queries/wildcard.query');
var regexp_query_1 = require('./queries/regexp.query');
var fuzzy_query_1 = require('./queries/fuzzy.query');
var ids_query_1 = require('./queries/ids.query');
var common_query_1 = require('./queries/common.query');
var SinglequeryComponent = (function () {
    function SinglequeryComponent() {
        this.queryList = this.queryList;
        this.removeArray = [];
        this.selector = {
            field: 'field-select',
            query: 'query-select'
        };
        this.setDocSample = new core_1.EventEmitter();
        this.informationList = {};
    }
    // on initialize set the query selector
    SinglequeryComponent.prototype.ngOnInit = function () {
        this.querySelector = '.query-' + this.queryIndex + '-' + this.internalIndex;
    };
    SinglequeryComponent.prototype.ngOnChanges = function () {
        this.querySelector = '.query-' + this.queryIndex + '-' + this.internalIndex;
        setTimeout(function () {
            if (this.query.selectedField) {
                console.log(this.result.resultQuery.availableFields);
                var isFieldExists = this.getField(this.query.selectedField);
                if (!isFieldExists.length) {
                    this.removeQuery();
                }
            }
        }.bind(this), 300);
    };
    SinglequeryComponent.prototype.ngAfterViewInit = function () {
        this.informationList = {
            'match': this.matchQuery.information,
            'match_phrase': this.match_phraseQuery.information,
            'match_phrase_prefix': this.match_phase_prefixQuery.information,
            'range': this.rangeQuery.information,
            'gt': this.gtQuery.information,
            'lt': this.ltQuery.information,
            'term': this.termQuery.information,
            'terms': this.termsQuery.information,
            'exists': this.existsQuery.information,
            'multi_match': this.multiMatchQuery.information,
            'query_string': this.queryStringQuery.information,
            'simple_query_string': this.simpleQueryStringQuery.information,
            'missing': this.missingQuery.information,
            'prefix': this.prefixQuery.information,
            'wildcard': this.wildcardQuery.information,
            'regexp': this.regexpQuery.information,
            'fuzzy': this.fuzzyQuery.information,
            'ids': this.idsQuery.information,
            'common': this.commonQuery.information
        };
    };
    SinglequeryComponent.prototype.getQueryFormat = function (outputQuery) {
        this.query.appliedQuery = outputQuery;
        console.log(this.query.appliedQuery);
        this.buildQuery();
    };
    // delete query
    SinglequeryComponent.prototype.removeQuery = function () {
        this.internal.splice(this.internalIndex, 1);
        this.buildQuery();
    };
    // field select - change event
    // On selecting the field, we are checking if field is analyzed or not
    // and according to that show the available query
    SinglequeryComponent.prototype.analyzeTest = function (res) {
        $(res.selector).parents('.editable-pack').removeClass('on');
        this.query.field = this.getField(res.val)[0];
        this.query.analyzeTest = this.query.field.index === 'not_analyzed' ? 'not_analyzed' : 'analyzed';
        this.query.type = this.query.field.type;
        this.query.selectedField = res.val;
    };
    // Query select - change event
    SinglequeryComponent.prototype.queryCallback = function (res) {
        res.selector.parents('.editable-pack').removeClass('on');
        this.query.query = res.val;
        this.query.selectedQuery = this.queryList[this.query.analyzeTest][this.query.type][this.query.query];
        this.buildQuery();
    };
    // build the query
    // buildquery method is inside build.component
    SinglequeryComponent.prototype.exeBuild = function () {
        var _this = this;
        setTimeout(function () { return _this.buildQuery(); }, 300);
    };
    SinglequeryComponent.prototype.getField = function (fieldName) {
        return this.result.resultQuery.availableFields.filter(function (ele) {
            return ele.name === fieldName;
        });
    };
    SinglequeryComponent.prototype.setDocSampleEve = function (link) {
        this.setDocSample.emit(link);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SinglequeryComponent.prototype, "mapping", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SinglequeryComponent.prototype, "types", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SinglequeryComponent.prototype, "selectedTypes", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SinglequeryComponent.prototype, "result", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SinglequeryComponent.prototype, "setDocSample", void 0);
    __decorate([
        core_1.ViewChild(match_query_1.MatchQuery), 
        __metadata('design:type', match_query_1.MatchQuery)
    ], SinglequeryComponent.prototype, "matchQuery", void 0);
    __decorate([
        core_1.ViewChild(match_phrase_query_1.Match_phraseQuery), 
        __metadata('design:type', match_phrase_query_1.Match_phraseQuery)
    ], SinglequeryComponent.prototype, "match_phraseQuery", void 0);
    __decorate([
        core_1.ViewChild(match_phase_prefix_query_1.Match_phase_prefixQuery), 
        __metadata('design:type', match_phase_prefix_query_1.Match_phase_prefixQuery)
    ], SinglequeryComponent.prototype, "match_phase_prefixQuery", void 0);
    __decorate([
        core_1.ViewChild(range_query_1.RangeQuery), 
        __metadata('design:type', range_query_1.RangeQuery)
    ], SinglequeryComponent.prototype, "rangeQuery", void 0);
    __decorate([
        core_1.ViewChild(gt_query_1.GtQuery), 
        __metadata('design:type', gt_query_1.GtQuery)
    ], SinglequeryComponent.prototype, "gtQuery", void 0);
    __decorate([
        core_1.ViewChild(lt_query_1.LtQuery), 
        __metadata('design:type', lt_query_1.LtQuery)
    ], SinglequeryComponent.prototype, "ltQuery", void 0);
    __decorate([
        core_1.ViewChild(term_query_1.TermQuery), 
        __metadata('design:type', term_query_1.TermQuery)
    ], SinglequeryComponent.prototype, "termQuery", void 0);
    __decorate([
        core_1.ViewChild(terms_query_1.TermsQuery), 
        __metadata('design:type', terms_query_1.TermsQuery)
    ], SinglequeryComponent.prototype, "termsQuery", void 0);
    __decorate([
        core_1.ViewChild(prefix_query_1.PrefixQuery), 
        __metadata('design:type', prefix_query_1.PrefixQuery)
    ], SinglequeryComponent.prototype, "prefixQuery", void 0);
    __decorate([
        core_1.ViewChild(exists_query_1.ExistsQuery), 
        __metadata('design:type', exists_query_1.ExistsQuery)
    ], SinglequeryComponent.prototype, "existsQuery", void 0);
    __decorate([
        core_1.ViewChild(multi_match_query_1.MultiMatchQuery), 
        __metadata('design:type', multi_match_query_1.MultiMatchQuery)
    ], SinglequeryComponent.prototype, "multiMatchQuery", void 0);
    __decorate([
        core_1.ViewChild(query_string_query_1.QueryStringQuery), 
        __metadata('design:type', query_string_query_1.QueryStringQuery)
    ], SinglequeryComponent.prototype, "queryStringQuery", void 0);
    __decorate([
        core_1.ViewChild(simple_query_string_query_1.SimpleQueryStringQuery), 
        __metadata('design:type', simple_query_string_query_1.SimpleQueryStringQuery)
    ], SinglequeryComponent.prototype, "simpleQueryStringQuery", void 0);
    __decorate([
        core_1.ViewChild(missing_query_1.MissingQuery), 
        __metadata('design:type', missing_query_1.MissingQuery)
    ], SinglequeryComponent.prototype, "missingQuery", void 0);
    __decorate([
        core_1.ViewChild(wildcard_query_1.WildcardQuery), 
        __metadata('design:type', wildcard_query_1.WildcardQuery)
    ], SinglequeryComponent.prototype, "wildcardQuery", void 0);
    __decorate([
        core_1.ViewChild(regexp_query_1.RegexpQuery), 
        __metadata('design:type', regexp_query_1.RegexpQuery)
    ], SinglequeryComponent.prototype, "regexpQuery", void 0);
    __decorate([
        core_1.ViewChild(fuzzy_query_1.FuzzyQuery), 
        __metadata('design:type', fuzzy_query_1.FuzzyQuery)
    ], SinglequeryComponent.prototype, "fuzzyQuery", void 0);
    __decorate([
        core_1.ViewChild(ids_query_1.IdsQuery), 
        __metadata('design:type', ids_query_1.IdsQuery)
    ], SinglequeryComponent.prototype, "idsQuery", void 0);
    __decorate([
        core_1.ViewChild(common_query_1.CommonQuery), 
        __metadata('design:type', common_query_1.CommonQuery)
    ], SinglequeryComponent.prototype, "commonQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SinglequeryComponent.prototype, "query", void 0);
    SinglequeryComponent = __decorate([
        core_1.Component({
            selector: 'single-query',
            templateUrl: './app/queryBlocks/singlequery/singlequery.component.html',
            inputs: ['mapping', 'types', 'selectedTypes', 'result', 'config', 'query', 'queryList', 'addQuery', 'internal', 'internalIndex', 'queryIndex', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp', 'urlShare', 'setDocLink', 'setDocSample'],
            directives: [
                editable_component_1.EditableComponent,
                SinglequeryComponent,
                select2_component_1.select2Component,
                match_query_1.MatchQuery,
                match_phrase_query_1.Match_phraseQuery,
                match_phase_prefix_query_1.Match_phase_prefixQuery,
                range_query_1.RangeQuery,
                gt_query_1.GtQuery,
                lt_query_1.LtQuery,
                term_query_1.TermQuery,
                terms_query_1.TermsQuery,
                exists_query_1.ExistsQuery,
                multi_match_query_1.MultiMatchQuery,
                query_string_query_1.QueryStringQuery,
                simple_query_string_query_1.SimpleQueryStringQuery,
                missing_query_1.MissingQuery,
                prefix_query_1.PrefixQuery,
                wildcard_query_1.WildcardQuery,
                regexp_query_1.RegexpQuery,
                fuzzy_query_1.FuzzyQuery,
                ids_query_1.IdsQuery,
                common_query_1.CommonQuery
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SinglequeryComponent);
    return SinglequeryComponent;
}());
exports.SinglequeryComponent = SinglequeryComponent;
//# sourceMappingURL=singlequery.component.js.map