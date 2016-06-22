import { forwardRef, Attribute, Directive } from '@angular/core';
import { NumberWrapper } from '../../facade/lang';
import { Validators, NG_VALIDATORS } from '../validators';
const REQUIRED = Validators.required;
export const REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useValue: REQUIRED,
    multi: true
};
export class RequiredValidator {
}
RequiredValidator.decorators = [
    { type: Directive, args: [{
                selector: '[required][ngControl],[required][ngFormControl],[required][ngModel]',
                providers: [REQUIRED_VALIDATOR]
            },] },
];
/**
 * Provivder which adds {@link MinLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='min'}
 */
export const MIN_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinLengthValidator),
    multi: true
};
export class MinLengthValidator {
    constructor(minLength) {
        this._validator = Validators.minLength(NumberWrapper.parseInt(minLength, 10));
    }
    validate(c) { return this._validator(c); }
}
MinLengthValidator.decorators = [
    { type: Directive, args: [{
                selector: '[minlength][ngControl],[minlength][ngFormControl],[minlength][ngModel]',
                providers: [MIN_LENGTH_VALIDATOR]
            },] },
];
MinLengthValidator.ctorParameters = [
    { type: undefined, decorators: [{ type: Attribute, args: ["minlength",] },] },
];
/**
 * Provider which adds {@link MaxLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='max'}
 */
export const MAX_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxLengthValidator),
    multi: true
};
export class MaxLengthValidator {
    constructor(maxLength) {
        this._validator = Validators.maxLength(NumberWrapper.parseInt(maxLength, 10));
    }
    validate(c) { return this._validator(c); }
}
MaxLengthValidator.decorators = [
    { type: Directive, args: [{
                selector: '[maxlength][ngControl],[maxlength][ngFormControl],[maxlength][ngModel]',
                providers: [MAX_LENGTH_VALIDATOR]
            },] },
];
MaxLengthValidator.ctorParameters = [
    { type: undefined, decorators: [{ type: Attribute, args: ["maxlength",] },] },
];
/**
 * A Directive that adds the `pattern` validator to any controls marked with the
 * `pattern` attribute, via the {@link NG_VALIDATORS} binding. Uses attribute value
 * as the regex to validate Control value against.  Follows pattern attribute
 * semantics; i.e. regex must match entire Control value.
 *
 * ### Example
 *
 * ```
 * <input [ngControl]="fullName" pattern="[a-zA-Z ]*">
 * ```
 */
export const PATTERN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PatternValidator),
    multi: true
};
export class PatternValidator {
    constructor(pattern) {
        this._validator = Validators.pattern(pattern);
    }
    validate(c) { return this._validator(c); }
}
PatternValidator.decorators = [
    { type: Directive, args: [{
                selector: '[pattern][ngControl],[pattern][ngFormControl],[pattern][ngModel]',
                providers: [PATTERN_VALIDATOR]
            },] },
];
PatternValidator.ctorParameters = [
    { type: undefined, decorators: [{ type: Attribute, args: ["pattern",] },] },
];
//# sourceMappingURL=validators.js.map