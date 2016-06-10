"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('../../src/facade/lang');
var collection_1 = require('../../src/facade/collection');
var ng_switch_1 = require('./ng_switch');
var _CATEGORY_DEFAULT = 'other';
var NgLocalization = (function () {
    function NgLocalization() {
    }
    return NgLocalization;
}());
exports.NgLocalization = NgLocalization;
var NgPluralCase = (function () {
    function NgPluralCase(value, template, viewContainer) {
        this.value = value;
        this._view = new ng_switch_1.SwitchView(viewContainer, template);
    }
    NgPluralCase.decorators = [
        { type: core_1.Directive, args: [{ selector: '[ngPluralCase]' },] },
    ];
    NgPluralCase.ctorParameters = [
        { type: undefined, decorators: [{ type: core_1.Attribute, args: ['ngPluralCase',] },] },
        { type: core_1.TemplateRef, },
        { type: core_1.ViewContainerRef, },
    ];
    return NgPluralCase;
}());
exports.NgPluralCase = NgPluralCase;
var NgPlural = (function () {
    function NgPlural(_localization) {
        this._localization = _localization;
        this._caseViews = new collection_1.Map();
        this.cases = null;
    }
    Object.defineProperty(NgPlural.prototype, "ngPlural", {
        set: function (value) {
            this._switchValue = value;
            this._updateView();
        },
        enumerable: true,
        configurable: true
    });
    NgPlural.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.cases.forEach(function (pluralCase) {
            _this._caseViews.set(_this._formatValue(pluralCase), pluralCase._view);
        });
        this._updateView();
    };
    /** @internal */
    NgPlural.prototype._updateView = function () {
        this._clearViews();
        var view = this._caseViews.get(this._switchValue);
        if (!lang_1.isPresent(view))
            view = this._getCategoryView(this._switchValue);
        this._activateView(view);
    };
    /** @internal */
    NgPlural.prototype._clearViews = function () {
        if (lang_1.isPresent(this._activeView))
            this._activeView.destroy();
    };
    /** @internal */
    NgPlural.prototype._activateView = function (view) {
        if (!lang_1.isPresent(view))
            return;
        this._activeView = view;
        this._activeView.create();
    };
    /** @internal */
    NgPlural.prototype._getCategoryView = function (value) {
        var category = this._localization.getPluralCategory(value);
        var categoryView = this._caseViews.get(category);
        return lang_1.isPresent(categoryView) ? categoryView : this._caseViews.get(_CATEGORY_DEFAULT);
    };
    /** @internal */
    NgPlural.prototype._isValueView = function (pluralCase) { return pluralCase.value[0] === "="; };
    /** @internal */
    NgPlural.prototype._formatValue = function (pluralCase) {
        return this._isValueView(pluralCase) ? this._stripValue(pluralCase.value) : pluralCase.value;
    };
    /** @internal */
    NgPlural.prototype._stripValue = function (value) { return lang_1.NumberWrapper.parseInt(value.substring(1), 10); };
    NgPlural.decorators = [
        { type: core_1.Directive, args: [{ selector: '[ngPlural]' },] },
    ];
    NgPlural.ctorParameters = [
        { type: NgLocalization, },
    ];
    NgPlural.propDecorators = {
        'cases': [{ type: core_1.ContentChildren, args: [NgPluralCase,] },],
        'ngPlural': [{ type: core_1.Input },],
    };
    return NgPlural;
}());
exports.NgPlural = NgPlural;
//# sourceMappingURL=ng_plural.js.map