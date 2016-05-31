import { KeyValueDiffers, ElementRef, Directive, Renderer } from '@angular/core';
import { isPresent, isBlank } from '../../src/facade/lang';
export class NgStyle {
    constructor(_differs, _ngEl, _renderer) {
        this._differs = _differs;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
    }
    set rawStyle(v) {
        this._rawStyle = v;
        if (isBlank(this._differ) && isPresent(v)) {
            this._differ = this._differs.find(this._rawStyle).create(null);
        }
    }
    ngDoCheck() {
        if (isPresent(this._differ)) {
            var changes = this._differ.diff(this._rawStyle);
            if (isPresent(changes)) {
                this._applyChanges(changes);
            }
        }
    }
    _applyChanges(changes) {
        changes.forEachAddedItem((record) => { this._setStyle(record.key, record.currentValue); });
        changes.forEachChangedItem((record) => { this._setStyle(record.key, record.currentValue); });
        changes.forEachRemovedItem((record) => { this._setStyle(record.key, null); });
    }
    _setStyle(name, val) {
        this._renderer.setElementStyle(this._ngEl.nativeElement, name, val);
    }
}
NgStyle.decorators = [
    { type: Directive, args: [{ selector: '[ngStyle]', inputs: ['rawStyle: ngStyle'] },] },
];
NgStyle.ctorParameters = [
    { type: KeyValueDiffers, },
    { type: ElementRef, },
    { type: Renderer, },
];
//# sourceMappingURL=ng_style.js.map