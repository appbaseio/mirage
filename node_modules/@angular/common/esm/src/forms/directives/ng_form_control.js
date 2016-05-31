import { Directive, forwardRef, Inject, Optional, Self } from '@angular/core';
import { StringMapWrapper } from '../../../src/facade/collection';
import { EventEmitter, ObservableWrapper } from '../../../src/facade/async';
import { NgControl } from './ng_control';
import { NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '../validators';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import { setUpControl, composeValidators, composeAsyncValidators, isPropertyUpdated, selectValueAccessor } from './shared';
export const formControlBinding = 
/*@ts2dart_const*/ /* @ts2dart_Provider */ {
    provide: NgControl,
    useExisting: forwardRef(() => NgFormControl)
};
export class NgFormControl extends NgControl {
    constructor(_validators, _asyncValidators, valueAccessors) {
        super();
        this._validators = _validators;
        this._asyncValidators = _asyncValidators;
        this.update = new EventEmitter();
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    ngOnChanges(changes) {
        if (this._isControlChanged(changes)) {
            setUpControl(this.form, this);
            this.form.updateValueAndValidity({ emitEvent: false });
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
            this.form.updateValue(this.model);
            this.viewModel = this.model;
        }
    }
    get path() { return []; }
    get validator() { return composeValidators(this._validators); }
    get asyncValidator() { return composeAsyncValidators(this._asyncValidators); }
    get control() { return this.form; }
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        ObservableWrapper.callEmit(this.update, newValue);
    }
    _isControlChanged(changes) {
        return StringMapWrapper.contains(changes, "form");
    }
}
NgFormControl.decorators = [
    { type: Directive, args: [{
                selector: '[ngFormControl]',
                bindings: [formControlBinding],
                inputs: ['form: ngFormControl', 'model: ngModel'],
                outputs: ['update: ngModelChange'],
                exportAs: 'ngForm'
            },] },
];
NgFormControl.ctorParameters = [
    { type: undefined, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALUE_ACCESSOR,] },] },
];
//# sourceMappingURL=ng_form_control.js.map