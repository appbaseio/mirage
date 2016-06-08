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
var query_1 = require('./queries/match/query');
var SinglequeryComponent = (function () {
    function SinglequeryComponent() {
        this.queryList = this.queryList;
        this.removeArray = [];
        this.selector = {
            field: 'field-select',
            query: 'query-select'
        };
    }
    // on initialize set the query selector
    SinglequeryComponent.prototype.ngOnInit = function () {
        this.querySelector = '.query-' + this.queryIndex + '-' + this.internalIndex;
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
        this.query.field = res.val;
        var self = this;
        $(res.selector).parents('.editable-pack').removeClass('on');
        var field = self.mapping.resultQuery.availableFields[self.query.field];
        self.query.analyzeTest = field.index === 'not_analyzed' ? 'not_analyzed' : 'analyzed';
        self.query.type = field.type;
        self.buildQuery();
    };
    // Query select - change event
    SinglequeryComponent.prototype.queryCallback = function (res) {
        res.selector.parents('.editable-pack').removeClass('on');
        this.query.query = res.val;
        this.buildQuery();
    };
    // build the query
    // buildquery method is inside build.component
    SinglequeryComponent.prototype.exeBuild = function () {
        var _this = this;
        setTimeout(function () { return _this.buildQuery(); }, 300);
    };
    // allow user to select field, or query
    // toggle between editable-front and editable-back
    // focus to select element
    SinglequeryComponent.prototype.editable_on = function ($event) {
        $('.editable-pack').removeClass('on');
        $($event.currentTarget).parents('.editable-pack').addClass('on');
        $($event.currentTarget).parents('.editable-pack').find('select').select2('open');
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SinglequeryComponent.prototype, "query", void 0);
    SinglequeryComponent = __decorate([
        core_1.Component({
            selector: 'single-query',
            templateUrl: './app/build/singlequery/singlequery.component.html',
            inputs: ['mapping', 'config', 'query', 'queryList', 'addQuery', 'internal', 'internalIndex', 'queryIndex', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp'],
            directives: [
                SinglequeryComponent,
                select2_component_1.select2Component,
                query_1.MatchQuery
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SinglequeryComponent);
    return SinglequeryComponent;
}());
exports.SinglequeryComponent = SinglequeryComponent;
//# sourceMappingURL=singlequery.component.js.map