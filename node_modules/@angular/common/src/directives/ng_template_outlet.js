"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('../../src/facade/lang');
var NgTemplateOutlet = (function () {
    function NgTemplateOutlet(_viewContainerRef) {
        this._viewContainerRef = _viewContainerRef;
    }
    Object.defineProperty(NgTemplateOutlet.prototype, "ngTemplateOutlet", {
        set: function (templateRef) {
            if (lang_1.isPresent(this._insertedViewRef)) {
                this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._insertedViewRef));
            }
            if (lang_1.isPresent(templateRef)) {
                this._insertedViewRef = this._viewContainerRef.createEmbeddedView(templateRef);
            }
        },
        enumerable: true,
        configurable: true
    });
    NgTemplateOutlet.decorators = [
        { type: core_1.Directive, args: [{ selector: '[ngTemplateOutlet]' },] },
    ];
    NgTemplateOutlet.ctorParameters = [
        { type: core_1.ViewContainerRef, },
    ];
    NgTemplateOutlet.propDecorators = {
        'ngTemplateOutlet': [{ type: core_1.Input },],
    };
    return NgTemplateOutlet;
}());
exports.NgTemplateOutlet = NgTemplateOutlet;
//# sourceMappingURL=ng_template_outlet.js.map