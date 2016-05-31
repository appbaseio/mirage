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
var SinglequeryComponent = (function () {
    function SinglequeryComponent() {
        this.queryList = this.queryList;
        this.removeArray = [];
        this.query = this.query;
    }
    // on initialize set the select2 on field select element
    SinglequeryComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            var field_select = $('.query-' + _this.queryIndex + '-' + _this.internalIndex).find('.field-select');
            _this.setSelect2(field_select, function (val) {
                this.query.field = val;
                this.analyzeTest(field_select);
            }.bind(_this));
        }, 300);
    };
    // delete query
    SinglequeryComponent.prototype.removeQuery = function () {
        this.internal.splice(this.internalIndex, 1);
    };
    // On selecting the field, we are checking if field is analyzed or not
    // and according to that show the available query
    // and then apply select2 for query select element
    SinglequeryComponent.prototype.analyzeTest = function ($event) {
        var self = this;
        $($event).parents('.editable-pack').removeClass('on');
        setTimeout(function () {
            var field = self.mapping.resultQuery.availableFields[self.query.field];
            self.query.analyzeTest = field.index === 'not_analyzed' ? 'not_analyzed' : 'analyzed';
            self.query.type = field.type;
            self.buildQuery();
            setTimeout(function () {
                var field_select = $('.query-' + self.queryIndex + '-' + self.internalIndex).find('.query-select');
                self.setSelect2(field_select, function (val) {
                    field_select.parents('.editable-pack').removeClass('on');
                    self.query.query = val;
                    self.exeBuild();
                });
            }, 300);
        }, 300);
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
    // set the select2 - autocomplete.
    SinglequeryComponent.prototype.setSelect2 = function (field_select, callback) {
        field_select.select2({
            placeholder: "Select from the option"
        });
        field_select.on("change", function (e) {
            callback(field_select.val());
        }.bind(this));
    };
    SinglequeryComponent = __decorate([
        core_1.Component({
            selector: 'single-query',
            templateUrl: './app/build/singlequery/singlequery.component.html',
            styleUrls: ['./app/build/singlequery/singlequery.component.css'],
            inputs: ['mapping', 'config', 'query', 'queryList', 'addQuery', 'internal', 'internalIndex', 'queryIndex', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp'],
            directives: [SinglequeryComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], SinglequeryComponent);
    return SinglequeryComponent;
}());
exports.SinglequeryComponent = SinglequeryComponent;
//# sourceMappingURL=singlequery.component.js.map