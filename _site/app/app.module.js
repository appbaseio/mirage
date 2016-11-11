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
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var app_component_1 = require('./app.component');
var queryBlocks_component_1 = require("./queryBlocks/queryBlocks.component");
var jsonEditor_component_1 = require("./jsonEditor/jsonEditor.component");
var result_component_1 = require("./result/result.component");
var save_query_component_1 = require('./features/save/save.query.component');
var list_query_component_1 = require('./features/list/list.query.component');
var share_url_component_1 = require('./features/share/share.url.component');
var error_modal_component_1 = require("./features/modal/error-modal.component");
var confirm_modal_component_1 = require("./features/confirm/confirm-modal.component");
var appselect_component_1 = require("./features/appselect/appselect.component");
var docsidebar_component_1 = require("./features/docSidebar/docsidebar.component");
var learn_component_1 = require("./features/learn/learn.component");
// queryBlocks
var boolquery_component_1 = require("./queryBlocks/boolquery/boolquery.component");
var types_component_1 = require("./queryBlocks/types/types.component");
// boolquery
var singlequery_component_1 = require("./queryBlocks/singlequery/singlequery.component");
var editable_component_1 = require('./queryBlocks/editable/editable.component');
// editable
var select2_component_1 = require('./queryBlocks/select2/select2.component');
// subscribe modal
var subscribe_component_1 = require('./features/subscribe/subscribe.component');
var AuthOperation_1 = require('./features/subscribe/AuthOperation');
// singlequery
var match_query_1 = require('./queryBlocks/singlequery/queries/match.query');
var match_phrase_query_1 = require('./queryBlocks/singlequery/queries/match_phrase.query');
var match_phase_prefix_query_1 = require('./queryBlocks/singlequery/queries/match_phase_prefix.query');
var range_query_1 = require('./queryBlocks/singlequery/queries/range.query');
var gt_query_1 = require('./queryBlocks/singlequery/queries/gt.query');
var lt_query_1 = require('./queryBlocks/singlequery/queries/lt.query');
var term_query_1 = require('./queryBlocks/singlequery/queries/term.query');
var exists_query_1 = require('./queryBlocks/singlequery/queries/exists.query');
var terms_query_1 = require('./queryBlocks/singlequery/queries/terms.query');
var prefix_query_1 = require('./queryBlocks/singlequery/queries/prefix.query');
var multi_match_query_1 = require('./queryBlocks/singlequery/queries/multi-match.query');
var query_string_query_1 = require('./queryBlocks/singlequery/queries/query_string.query');
var simple_query_string_query_1 = require('./queryBlocks/singlequery/queries/simple_query_string.query');
var missing_query_1 = require('./queryBlocks/singlequery/queries/missing.query');
var wildcard_query_1 = require('./queryBlocks/singlequery/queries/wildcard.query');
var regexp_query_1 = require('./queryBlocks/singlequery/queries/regexp.query');
var fuzzy_query_1 = require('./queryBlocks/singlequery/queries/fuzzy.query');
var ids_query_1 = require('./queryBlocks/singlequery/queries/ids.query');
var common_query_1 = require('./queryBlocks/singlequery/queries/common.query');
var geodistance_query_1 = require('./queryBlocks/singlequery/queries/geodistance.query');
var geoboundingbox_query_1 = require('./queryBlocks/singlequery/queries/geoboundingbox.query');
var geodistancerange_query_1 = require('./queryBlocks/singlequery/queries/geodistancerange.query');
var geopolygon_query_1 = require('./queryBlocks/singlequery/queries/geopolygon.query');
var geohashcell_query_1 = require('./queryBlocks/singlequery/queries/geohashcell.query');
var geoshape_query_1 = require('./queryBlocks/singlequery/queries/geoshape.query');
var span_term_query_1 = require('./queryBlocks/singlequery/queries/span_term.query');
var span_first_query_1 = require('./queryBlocks/singlequery/queries/span_first.query');
// Pipes
var prettyJson_1 = require("./shared/pipes/prettyJson");
var prettyTime_1 = require("./shared/pipes/prettyTime");
// list
var time_component_1 = require("./features/list/time/time.component");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule
            ],
            declarations: [
                app_component_1.AppComponent,
                queryBlocks_component_1.QueryBlocksComponent,
                jsonEditor_component_1.JsonEditorComponent,
                result_component_1.ResultComponent,
                save_query_component_1.SaveQueryComponent,
                list_query_component_1.ListQueryComponent,
                share_url_component_1.ShareUrlComponent,
                appselect_component_1.AppselectComponent,
                error_modal_component_1.ErrorModalComponent,
                docsidebar_component_1.DocSidebarComponent,
                confirm_modal_component_1.ConfirmModalComponent,
                learn_component_1.LearnModalComponent,
                boolquery_component_1.BoolqueryComponent,
                types_component_1.TypesComponent,
                singlequery_component_1.SinglequeryComponent,
                editable_component_1.EditableComponent,
                select2_component_1.select2Component,
                subscribe_component_1.SubscribeModalComponent,
                AuthOperation_1.AuthOperation,
                editable_component_1.EditableComponent,
                singlequery_component_1.SinglequeryComponent,
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
                geodistance_query_1.GeoDistanceQuery,
                geoboundingbox_query_1.GeoBoundingBoxQuery,
                geodistancerange_query_1.GeoDistanceRangeQuery,
                geopolygon_query_1.GeoPolygonQuery,
                geohashcell_query_1.GeoHashCellQuery,
                geoshape_query_1.GeoShapeQuery,
                common_query_1.CommonQuery,
                span_term_query_1.SpanTermQuery,
                span_first_query_1.SpanFirstQuery,
                prettyJson_1.prettyJson,
                time_component_1.TimeComponent,
                prettyTime_1.prettyTime
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map