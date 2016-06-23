import { Directive, ViewContainerRef, TemplateRef } from '@angular/core';
import { isBlank } from '../../src/facade/lang';
export class NgIf {
    constructor(_viewContainer, _templateRef) {
        this._viewContainer = _viewContainer;
        this._templateRef = _templateRef;
        this._prevCondition = null;
    }
    set ngIf(newCondition /* boolean */) {
        if (newCondition && (isBlank(this._prevCondition) || !this._prevCondition)) {
            this._prevCondition = true;
            this._viewContainer.createEmbeddedView(this._templateRef);
        }
        else if (!newCondition && (isBlank(this._prevCondition) || this._prevCondition)) {
            this._prevCondition = false;
            this._viewContainer.clear();
        }
    }
}
NgIf.decorators = [
    { type: Directive, args: [{ selector: '[ngIf]', inputs: ['ngIf'] },] },
];
NgIf.ctorParameters = [
    { type: ViewContainerRef, },
    { type: TemplateRef, },
];
//# sourceMappingURL=ng_if.js.map