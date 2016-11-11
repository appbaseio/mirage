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
var geodistance_query_1 = require('./queries/geodistance.query');
var geoboundingbox_query_1 = require('./queries/geoboundingbox.query');
var geodistancerange_query_1 = require('./queries/geodistancerange.query');
var geopolygon_query_1 = require('./queries/geopolygon.query');
var geohashcell_query_1 = require('./queries/geohashcell.query');
var geoshape_query_1 = require('./queries/geoshape.query');
var span_term_query_1 = require('./queries/span_term.query');
var span_first_query_1 = require('./queries/span_first.query');
var SinglequeryComponent = (function () {
    function SinglequeryComponent() {
        this.queryList = this.queryList;
        this.removeArray = [];
        this.selector = {
            field: 'field-select',
            query: 'query-select'
        };
        this.joiningQuery = [''];
        this.setDocSample = new core_1.EventEmitter();
        this.informationList = {};
    }
    // on initialize set the query selector
    SinglequeryComponent.prototype.ngOnInit = function () {
        this.querySelector = '.query-' + this.queryIndex + '-' + this.internalIndex;
        this.allFields = this.result.resultQuery.availableFields.slice();
    };
    SinglequeryComponent.prototype.ngOnChanges = function () {
        var _this = this;
        this.allFields = this.result.resultQuery.availableFields.slice();
        this.querySelector = '.query-' + this.queryIndex + '-' + this.internalIndex;
        setTimeout(function () {
            _this.result.resultQuery.availableFields = _this.checkAvailableFields();
            if (_this.query.selectedField) {
                var isFieldExists = _this.getField(_this.query.selectedField);
                if (!isFieldExists.length) {
                    _this.removeQuery();
                }
            }
        }, 300);
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
            'common': this.commonQuery.information,
            'geo_distance': this.geoDistanceQuery.information,
            'geo_bounding_box': this.geoBoundingBoxQuery.information,
            'geo_distance_range': this.geoDistanceRangeQuery.information,
            'geo_polygon': this.geoPolygonQuery.information,
            'geohash_cell': this.geoHashCellQuery.information,
            'geo_shape': this.geoShapeQuery.information,
            'span_term': this.spanTermQuery.information,
            'span_first': this.spanFirstQuery.information
        };
    };
    SinglequeryComponent.prototype.checkAvailableFields = function () {
        var fields = this.allFields;
        var allMappings = this.mapping[this.config.appname].mappings;
        if (this.joiningQuery[this.joiningQueryParam] == 'nested') {
            var mapObj = {};
            this.selectedTypes.forEach(function (type) {
                Object.assign(mapObj, allMappings[type].properties);
            });
            var _loop_1 = function(obj) {
                if (mapObj[obj].type === 'nested') {
                    fields = fields.filter(function (field) { return (field.name.indexOf(obj + ".") > -1); });
                }
            };
            for (var obj in mapObj) {
                _loop_1(obj);
            }
        }
        if (this.joiningQuery[this.joiningQueryParam] == 'has_child') {
            fields = [];
            for (var type in allMappings) {
                if (allMappings[type].hasOwnProperty('_parent')) {
                    var fieldObj = allMappings[type].properties;
                    for (var field in fieldObj) {
                        var index = typeof fieldObj[field]['index'] != 'undefined' ? fieldObj[field]['index'] : null;
                        var obj = {
                            name: field,
                            type: fieldObj[field]['type'],
                            index: index
                        };
                        switch (obj.type) {
                            case 'long':
                            case 'integer':
                            case 'short':
                            case 'byte':
                            case 'double':
                            case 'float':
                                obj.type = 'numeric';
                                break;
                            case 'text':
                            case 'keyword':
                                obj.type = 'string';
                                break;
                        }
                        fields.push(obj);
                    }
                }
            }
        }
        return fields;
    };
    SinglequeryComponent.prototype.getQueryFormat = function (outputQuery) {
        this.query.appliedQuery = outputQuery;
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
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SinglequeryComponent.prototype, "query", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SinglequeryComponent.prototype, "boolQueryName", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SinglequeryComponent.prototype, "joiningQuery", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SinglequeryComponent.prototype, "joiningQueryParam", void 0);
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
        core_1.ViewChild(geodistance_query_1.GeoDistanceQuery), 
        __metadata('design:type', geodistance_query_1.GeoDistanceQuery)
    ], SinglequeryComponent.prototype, "geoDistanceQuery", void 0);
    __decorate([
        core_1.ViewChild(geoboundingbox_query_1.GeoBoundingBoxQuery), 
        __metadata('design:type', geoboundingbox_query_1.GeoBoundingBoxQuery)
    ], SinglequeryComponent.prototype, "geoBoundingBoxQuery", void 0);
    __decorate([
        core_1.ViewChild(geodistancerange_query_1.GeoDistanceRangeQuery), 
        __metadata('design:type', geodistancerange_query_1.GeoDistanceRangeQuery)
    ], SinglequeryComponent.prototype, "geoDistanceRangeQuery", void 0);
    __decorate([
        core_1.ViewChild(geopolygon_query_1.GeoPolygonQuery), 
        __metadata('design:type', geopolygon_query_1.GeoPolygonQuery)
    ], SinglequeryComponent.prototype, "geoPolygonQuery", void 0);
    __decorate([
        core_1.ViewChild(geohashcell_query_1.GeoHashCellQuery), 
        __metadata('design:type', geohashcell_query_1.GeoHashCellQuery)
    ], SinglequeryComponent.prototype, "geoHashCellQuery", void 0);
    __decorate([
        core_1.ViewChild(geoshape_query_1.GeoShapeQuery), 
        __metadata('design:type', geoshape_query_1.GeoShapeQuery)
    ], SinglequeryComponent.prototype, "geoShapeQuery", void 0);
    __decorate([
        core_1.ViewChild(span_term_query_1.SpanTermQuery), 
        __metadata('design:type', span_term_query_1.SpanTermQuery)
    ], SinglequeryComponent.prototype, "spanTermQuery", void 0);
    __decorate([
        core_1.ViewChild(span_first_query_1.SpanFirstQuery), 
        __metadata('design:type', span_first_query_1.SpanFirstQuery)
    ], SinglequeryComponent.prototype, "spanFirstQuery", void 0);
    SinglequeryComponent = __decorate([
        core_1.Component({
            selector: 'single-query',
            templateUrl: './app/queryBlocks/singlequery/singlequery.component.html',
            inputs: ['config', 'queryList', 'addQuery', 'internal', 'internalIndex', 'queryIndex', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp', 'urlShare', 'setDocLink', 'setDocSample']
        }), 
        __metadata('design:paramtypes', [])
    ], SinglequeryComponent);
    return SinglequeryComponent;
}());
exports.SinglequeryComponent = SinglequeryComponent;
//# sourceMappingURL=singlequery.component.js.map