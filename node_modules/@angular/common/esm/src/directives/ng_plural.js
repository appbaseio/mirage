import { Directive, ViewContainerRef, TemplateRef, ContentChildren, Attribute, Input } from '@angular/core';
import { isPresent, NumberWrapper } from '../../src/facade/lang';
import { Map } from '../../src/facade/collection';
import { SwitchView } from './ng_switch';
const _CATEGORY_DEFAULT = 'other';
export class NgLocalization {
}
export class NgPluralCase {
    constructor(value, template, viewContainer) {
        this.value = value;
        this._view = new SwitchView(viewContainer, template);
    }
}
NgPluralCase.decorators = [
    { type: Directive, args: [{ selector: '[ngPluralCase]' },] },
];
NgPluralCase.ctorParameters = [
    { type: undefined, decorators: [{ type: Attribute, args: ['ngPluralCase',] },] },
    { type: TemplateRef, },
    { type: ViewContainerRef, },
];
export class NgPlural {
    constructor(_localization) {
        this._localization = _localization;
        this._caseViews = new Map();
        this.cases = null;
    }
    set ngPlural(value) {
        this._switchValue = value;
        this._updateView();
    }
    ngAfterContentInit() {
        this.cases.forEach((pluralCase) => {
            this._caseViews.set(this._formatValue(pluralCase), pluralCase._view);
        });
        this._updateView();
    }
    /** @internal */
    _updateView() {
        this._clearViews();
        var view = this._caseViews.get(this._switchValue);
        if (!isPresent(view))
            view = this._getCategoryView(this._switchValue);
        this._activateView(view);
    }
    /** @internal */
    _clearViews() {
        if (isPresent(this._activeView))
            this._activeView.destroy();
    }
    /** @internal */
    _activateView(view) {
        if (!isPresent(view))
            return;
        this._activeView = view;
        this._activeView.create();
    }
    /** @internal */
    _getCategoryView(value) {
        var category = this._localization.getPluralCategory(value);
        var categoryView = this._caseViews.get(category);
        return isPresent(categoryView) ? categoryView : this._caseViews.get(_CATEGORY_DEFAULT);
    }
    /** @internal */
    _isValueView(pluralCase) { return pluralCase.value[0] === "="; }
    /** @internal */
    _formatValue(pluralCase) {
        return this._isValueView(pluralCase) ? this._stripValue(pluralCase.value) : pluralCase.value;
    }
    /** @internal */
    _stripValue(value) { return NumberWrapper.parseInt(value.substring(1), 10); }
}
NgPlural.decorators = [
    { type: Directive, args: [{ selector: '[ngPlural]' },] },
];
NgPlural.ctorParameters = [
    { type: NgLocalization, },
];
NgPlural.propDecorators = {
    'cases': [{ type: ContentChildren, args: [NgPluralCase,] },],
    'ngPlural': [{ type: Input },],
};
//# sourceMappingURL=ng_plural.js.map