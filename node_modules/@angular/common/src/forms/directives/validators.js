"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('../../facade/lang');
var validators_1 = require('../validators');
var REQUIRED = validators_1.Validators.required;
exports.REQUIRED_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useValue: REQUIRED,
    multi: true
};
var RequiredValidator = (function () {
    function RequiredValidator() {
    }
    RequiredValidator.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[required][ngControl],[required][ngFormControl],[required][ngModel]',
                    providers: [exports.REQUIRED_VALIDATOR]
                },] },
    ];
    return RequiredValidator;
}());
exports.RequiredValidator = RequiredValidator;
/**
 * Provivder which adds {@link MinLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='min'}
 */
exports.MIN_LENGTH_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return MinLengthValidator; }),
    multi: true
};
var MinLengthValidator = (function () {
    function MinLengthValidator(minLength) {
        this._validator = validators_1.Validators.minLength(lang_1.NumberWrapper.parseInt(minLength, 10));
    }
    MinLengthValidator.prototype.validate = function (c) { return this._validator(c); };
    MinLengthValidator.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[minlength][ngControl],[minlength][ngFormControl],[minlength][ngModel]',
                    providers: [exports.MIN_LENGTH_VALIDATOR]
                },] },
    ];
    MinLengthValidator.ctorParameters = [
        { type: undefined, decorators: [{ type: core_1.Attribute, args: ["minlength",] },] },
    ];
    return MinLengthValidator;
}());
exports.MinLengthValidator = MinLengthValidator;
/**
 * Provider which adds {@link MaxLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='max'}
 */
exports.MAX_LENGTH_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return MaxLengthValidator; }),
    multi: true
};
var MaxLengthValidator = (function () {
    function MaxLengthValidator(maxLength) {
        this._validator = validators_1.Validators.maxLength(lang_1.NumberWrapper.parseInt(maxLength, 10));
    }
    MaxLengthValidator.prototype.validate = function (c) { return this._validator(c); };
    MaxLengthValidator.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[maxlength][ngControl],[maxlength][ngFormControl],[maxlength][ngModel]',
                    providers: [exports.MAX_LENGTH_VALIDATOR]
                },] },
    ];
    MaxLengthValidator.ctorParameters = [
        { type: undefined, decorators: [{ type: core_1.Attribute, args: ["maxlength",] },] },
    ];
    return MaxLengthValidator;
}());
exports.MaxLengthValidator = MaxLengthValidator;
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
exports.PATTERN_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return PatternValidator; }),
    multi: true
};
var PatternValidator = (function () {
    function PatternValidator(pattern) {
        this._validator = validators_1.Validators.pattern(pattern);
    }
    PatternValidator.prototype.validate = function (c) { return this._validator(c); };
    PatternValidator.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[pattern][ngControl],[pattern][ngFormControl],[pattern][ngModel]',
                    providers: [exports.PATTERN_VALIDATOR]
                },] },
    ];
    PatternValidator.ctorParameters = [
        { type: undefined, decorators: [{ type: core_1.Attribute, args: ["pattern",] },] },
    ];
    return PatternValidator;
}());
exports.PatternValidator = PatternValidator;
//# sourceMappingURL=validators.js.map