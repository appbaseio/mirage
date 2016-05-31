import { Directive, forwardRef, Inject, Optional, Self } from '@angular/core';
import { EventEmitter, ObservableWrapper } from '../../../src/facade/async';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import { NgControl } from './ng_control';
import { Control } from '../model';
import { NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '../validators';
import { setUpControl, isPropertyUpdated, selectValueAccessor, composeValidators, composeAsyncValidators } from './shared';
export const formControlBinding = 
/*@ts2dart_const*/ /* @ts2dart_Provider */ {
    provide: NgControl,
    useExisting: forwardRef(() => NgModel)
};
export class NgModel extends NgControl {
    constructor(_validators, _asyncValidators, valueAccessors) {
        super();
        this._validators = _validators;
        this._asyncValidators = _asyncValidators;
        /** @internal */
        this._control = new Control();
        /** @internal */
        this._added = false;
        this.update = new EventEmitter();
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    ngOnChanges(changes) {
        if (!this._added) {
            setUpControl(this._control, this);
            this._control.updateValueAndValidity({ emitEvent: false });
            this._added = true;
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
            this._control.updateValue(this.model);
            this.viewModel = this.model;
        }
    }
    get control() { return this._control; }
    get path() { return []; }
    get validator() { return composeValidators(this._validators); }
    get asyncValidator() { return composeAsyncValidators(this._asyncValidators); }
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        ObservableWrapper.callEmit(this.update, newValue);
    }
}
NgModel.decorators = [
    { type: Directive, args: [{
                selector: '[ngModel]:not([ngControl]):not([ngFormControl])',
                bindings: [formControlBinding],
                inputs: ['model: ngModel'],
                outputs: ['update: ngModelChange'],
                exportAs: 'ngForm'
            },] },
];
NgModel.ctorParameters = [
    { type: undefined, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALUE_ACCESSOR,] },] },
];
//# sourceMappingURL=ng_model.js.map