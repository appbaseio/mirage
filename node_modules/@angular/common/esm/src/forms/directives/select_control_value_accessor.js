import { Directive, Renderer, forwardRef, ElementRef, Input, Host, Optional } from '@angular/core';
import { StringWrapper, isPrimitive, isPresent, isBlank, looseIdentical } from '../../../src/facade/lang';
import { MapWrapper } from '../../../src/facade/collection';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
export const SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectControlValueAccessor),
    multi: true
};
function _buildValueString(id, value) {
    if (isBlank(id))
        return `${value}`;
    if (!isPrimitive(value))
        value = "Object";
    return StringWrapper.slice(`${id}: ${value}`, 0, 50);
}
function _extractId(valueString) {
    return valueString.split(":")[0];
}
export class SelectControlValueAccessor {
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /** @internal */
        this._optionMap = new Map();
        /** @internal */
        this._idCounter = 0;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    writeValue(value) {
        this.value = value;
        var valueString = _buildValueString(this._getOptionId(value), value);
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', valueString);
    }
    registerOnChange(fn) {
        this.onChange = (valueString) => { fn(this._getOptionValue(valueString)); };
    }
    registerOnTouched(fn) { this.onTouched = fn; }
    /** @internal */
    _registerOption() { return (this._idCounter++).toString(); }
    /** @internal */
    _getOptionId(value) {
        for (let id of MapWrapper.keys(this._optionMap)) {
            if (looseIdentical(this._optionMap.get(id), value))
                return id;
        }
        return null;
    }
    /** @internal */
    _getOptionValue(valueString) {
        let value = this._optionMap.get(_extractId(valueString));
        return isPresent(value) ? value : valueString;
    }
}
SelectControlValueAccessor.decorators = [
    { type: Directive, args: [{
                selector: 'select[ngControl],select[ngFormControl],select[ngModel]',
                host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
                providers: [SELECT_VALUE_ACCESSOR]
            },] },
];
SelectControlValueAccessor.ctorParameters = [
    { type: Renderer, },
    { type: ElementRef, },
];
export class NgSelectOption {
    constructor(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (isPresent(this._select))
            this.id = this._select._registerOption();
    }
    set ngValue(value) {
        if (this._select == null)
            return;
        this._select._optionMap.set(this.id, value);
        this._setElementValue(_buildValueString(this.id, value));
        this._select.writeValue(this._select.value);
    }
    set value(value) {
        this._setElementValue(value);
        if (isPresent(this._select))
            this._select.writeValue(this._select.value);
    }
    /** @internal */
    _setElementValue(value) {
        this._renderer.setElementProperty(this._element.nativeElement, 'value', value);
    }
    ngOnDestroy() {
        if (isPresent(this._select)) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    }
}
NgSelectOption.decorators = [
    { type: Directive, args: [{ selector: 'option' },] },
];
NgSelectOption.ctorParameters = [
    { type: ElementRef, },
    { type: Renderer, },
    { type: SelectControlValueAccessor, decorators: [{ type: Optional }, { type: Host },] },
];
NgSelectOption.propDecorators = {
    'ngValue': [{ type: Input, args: ['ngValue',] },],
    'value': [{ type: Input, args: ['value',] },],
};
//# sourceMappingURL=select_control_value_accessor.js.map