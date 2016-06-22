import { Directive, Input, ViewContainerRef } from '@angular/core';
import { isPresent } from '../../src/facade/lang';
export class NgTemplateOutlet {
    constructor(_viewContainerRef) {
        this._viewContainerRef = _viewContainerRef;
    }
    set ngTemplateOutlet(templateRef) {
        if (isPresent(this._insertedViewRef)) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._insertedViewRef));
        }
        if (isPresent(templateRef)) {
            this._insertedViewRef = this._viewContainerRef.createEmbeddedView(templateRef);
        }
    }
}
NgTemplateOutlet.decorators = [
    { type: Directive, args: [{ selector: '[ngTemplateOutlet]' },] },
];
NgTemplateOutlet.ctorParameters = [
    { type: ViewContainerRef, },
];
NgTemplateOutlet.propDecorators = {
    'ngTemplateOutlet': [{ type: Input },],
};
//# sourceMappingURL=ng_template_outlet.js.map