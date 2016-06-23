import { Directive, ElementRef, Renderer, forwardRef } from '@angular/core';
import { NumberWrapper } from '../../../src/facade/lang';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
export const NUMBER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberValueAccessor),
    multi: true
};
export class NumberValueAccessor {
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    writeValue(value) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', value);
    }
    registerOnChange(fn) {
        this.onChange = (value) => { fn(value == '' ? null : NumberWrapper.parseFloat(value)); };
    }
    registerOnTouched(fn) { this.onTouched = fn; }
}
NumberValueAccessor.decorators = [
    { type: Directive, args: [{
                selector: 'input[type=number][ngControl],input[type=number][ngFormControl],input[type=number][ngModel]',
                host: {
                    '(change)': 'onChange($event.target.value)',
                    '(input)': 'onChange($event.target.value)',
                    '(blur)': 'onTouched()'
                },
                bindings: [NUMBER_VALUE_ACCESSOR]
            },] },
];
NumberValueAccessor.ctorParameters = [
    { type: Renderer, },
    { type: ElementRef, },
];
//# sourceMappingURL=number_value_accessor.js.map