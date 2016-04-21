'use strict';"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('angular2/core');
var lang_1 = require('angular2/src/facade/lang');
var validators_1 = require('../validators');
var lang_2 = require("angular2/src/facade/lang");
var REQUIRED = validators_1.Validators.required;
var REQUIRED_VALIDATOR = lang_1.CONST_EXPR(new core_1.Provider(validators_1.NG_VALIDATORS, { useValue: REQUIRED, multi: true }));
/**
 * A Directive that adds the `required` validator to any controls marked with the
 * `required` attribute, via the {@link NG_VALIDATORS} binding.
 *
 * ### Example
 *
 * ```
 * <input ngControl="fullName" required>
 * ```
 */
var RequiredValidator = (function () {
    function RequiredValidator() {
    }
    RequiredValidator = __decorate([
        core_1.Directive({
            selector: '[required][ngControl],[required][ngFormControl],[required][ngModel]',
            providers: [REQUIRED_VALIDATOR]
        }), 
        __metadata('design:paramtypes', [])
    ], RequiredValidator);
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
var MIN_LENGTH_VALIDATOR = lang_1.CONST_EXPR(new core_1.Provider(validators_1.NG_VALIDATORS, { useExisting: core_1.forwardRef(function () { return MinLengthValidator; }), multi: true }));
/**
 * A directive which installs the {@link MinLengthValidator} for any `ngControl`,
 * `ngFormControl`, or control with `ngModel` that also has a `minlength` attribute.
 */
var MinLengthValidator = (function () {
    function MinLengthValidator(minLength) {
        this._validator = validators_1.Validators.minLength(lang_2.NumberWrapper.parseInt(minLength, 10));
    }
    MinLengthValidator.prototype.validate = function (c) { return this._validator(c); };
    MinLengthValidator = __decorate([
        core_1.Directive({
            selector: '[minlength][ngControl],[minlength][ngFormControl],[minlength][ngModel]',
            providers: [MIN_LENGTH_VALIDATOR]
        }),
        __param(0, core_1.Attribute("minlength")), 
        __metadata('design:paramtypes', [String])
    ], MinLengthValidator);
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
var MAX_LENGTH_VALIDATOR = lang_1.CONST_EXPR(new core_1.Provider(validators_1.NG_VALIDATORS, { useExisting: core_1.forwardRef(function () { return MaxLengthValidator; }), multi: true }));
/**
 * A directive which installs the {@link MaxLengthValidator} for any `ngControl, `ngFormControl`,
 * or control with `ngModel` that also has a `maxlength` attribute.
 */
var MaxLengthValidator = (function () {
    function MaxLengthValidator(maxLength) {
        this._validator = validators_1.Validators.maxLength(lang_2.NumberWrapper.parseInt(maxLength, 10));
    }
    MaxLengthValidator.prototype.validate = function (c) { return this._validator(c); };
    MaxLengthValidator = __decorate([
        core_1.Directive({
            selector: '[maxlength][ngControl],[maxlength][ngFormControl],[maxlength][ngModel]',
            providers: [MAX_LENGTH_VALIDATOR]
        }),
        __param(0, core_1.Attribute("maxlength")), 
        __metadata('design:paramtypes', [String])
    ], MaxLengthValidator);
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
var PATTERN_VALIDATOR = lang_1.CONST_EXPR(new core_1.Provider(validators_1.NG_VALIDATORS, { useExisting: core_1.forwardRef(function () { return PatternValidator; }), multi: true }));
var PatternValidator = (function () {
    function PatternValidator(pattern) {
        this._validator = validators_1.Validators.pattern(pattern);
    }
    PatternValidator.prototype.validate = function (c) { return this._validator(c); };
    PatternValidator = __decorate([
        core_1.Directive({
            selector: '[pattern][ngControl],[pattern][ngFormControl],[pattern][ngModel]',
            providers: [PATTERN_VALIDATOR]
        }),
        __param(0, core_1.Attribute("pattern")), 
        __metadata('design:paramtypes', [String])
    ], PatternValidator);
    return PatternValidator;
}());
exports.PatternValidator = PatternValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vZm9ybXMvZGlyZWN0aXZlcy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQkFBeUQsZUFBZSxDQUFDLENBQUE7QUFDekUscUJBQXlCLDBCQUEwQixDQUFDLENBQUE7QUFDcEQsMkJBQXdDLGVBQWUsQ0FBQyxDQUFBO0FBR3hELHFCQUE0QiwwQkFBMEIsQ0FBQyxDQUFBO0FBdUJ2RCxJQUFNLFFBQVEsR0FBRyx1QkFBVSxDQUFDLFFBQVEsQ0FBQztBQUVyQyxJQUFNLGtCQUFrQixHQUNwQixpQkFBVSxDQUFDLElBQUksZUFBUSxDQUFDLDBCQUFhLEVBQUUsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFFL0U7Ozs7Ozs7OztHQVNHO0FBS0g7SUFBQTtJQUNBLENBQUM7SUFMRDtRQUFDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUscUVBQXFFO1lBQy9FLFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDO1NBQ2hDLENBQUM7O3lCQUFBO0lBRUYsd0JBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURZLHlCQUFpQixvQkFDN0IsQ0FBQTtBQU9EOzs7Ozs7R0FNRztBQUNILElBQU0sb0JBQW9CLEdBQUcsaUJBQVUsQ0FDbkMsSUFBSSxlQUFRLENBQUMsMEJBQWEsRUFBRSxFQUFDLFdBQVcsRUFBRSxpQkFBVSxDQUFDLGNBQU0sT0FBQSxrQkFBa0IsRUFBbEIsQ0FBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFFbkc7OztHQUdHO0FBS0g7SUFHRSw0QkFBb0MsU0FBaUI7UUFDbkQsSUFBSSxDQUFDLFVBQVUsR0FBRyx1QkFBVSxDQUFDLFNBQVMsQ0FBQyxvQkFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQscUNBQVEsR0FBUixVQUFTLENBQWtCLElBQTBCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQVhuRjtRQUFDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsd0VBQXdFO1lBQ2xGLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO1NBQ2xDLENBQUM7bUJBSWEsZ0JBQVMsQ0FBQyxXQUFXLENBQUM7OzBCQUpuQztJQVNGLHlCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFSWSwwQkFBa0IscUJBUTlCLENBQUE7QUFFRDs7Ozs7O0dBTUc7QUFDSCxJQUFNLG9CQUFvQixHQUFHLGlCQUFVLENBQ25DLElBQUksZUFBUSxDQUFDLDBCQUFhLEVBQUUsRUFBQyxXQUFXLEVBQUUsaUJBQVUsQ0FBQyxjQUFNLE9BQUEsa0JBQWtCLEVBQWxCLENBQWtCLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDO0FBRW5HOzs7R0FHRztBQUtIO0lBR0UsNEJBQW9DLFNBQWlCO1FBQ25ELElBQUksQ0FBQyxVQUFVLEdBQUcsdUJBQVUsQ0FBQyxTQUFTLENBQUMsb0JBQWEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELHFDQUFRLEdBQVIsVUFBUyxDQUFrQixJQUEwQixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFYbkY7UUFBQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHdFQUF3RTtZQUNsRixTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztTQUNsQyxDQUFDO21CQUlhLGdCQUFTLENBQUMsV0FBVyxDQUFDOzswQkFKbkM7SUFTRix5QkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBUlksMEJBQWtCLHFCQVE5QixDQUFBO0FBR0Q7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxJQUFNLGlCQUFpQixHQUFHLGlCQUFVLENBQ2hDLElBQUksZUFBUSxDQUFDLDBCQUFhLEVBQUUsRUFBQyxXQUFXLEVBQUUsaUJBQVUsQ0FBQyxjQUFNLE9BQUEsZ0JBQWdCLEVBQWhCLENBQWdCLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDO0FBS2pHO0lBR0UsMEJBQWtDLE9BQWU7UUFDL0MsSUFBSSxDQUFDLFVBQVUsR0FBRyx1QkFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsbUNBQVEsR0FBUixVQUFTLENBQWtCLElBQTBCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQVhuRjtRQUFDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsa0VBQWtFO1lBQzVFLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO1NBQy9CLENBQUM7bUJBSWEsZ0JBQVMsQ0FBQyxTQUFTLENBQUM7O3dCQUpqQztJQVNGLHVCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFSWSx3QkFBZ0IsbUJBUTVCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2ZvcndhcmRSZWYsIFByb3ZpZGVyLCBBdHRyaWJ1dGUsIERpcmVjdGl2ZX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge0NPTlNUX0VYUFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1ZhbGlkYXRvcnMsIE5HX1ZBTElEQVRPUlN9IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2x9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCAqIGFzIG1vZGVsTW9kdWxlIGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7TnVtYmVyV3JhcHBlcn0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZ1wiO1xuXG5cblxuLyoqXG4gKiBBbiBpbnRlcmZhY2UgdGhhdCBjYW4gYmUgaW1wbGVtZW50ZWQgYnkgY2xhc3NlcyB0aGF0IGNhbiBhY3QgYXMgdmFsaWRhdG9ycy5cbiAqXG4gKiAjIyBVc2FnZVxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBEaXJlY3RpdmUoe1xuICogICBzZWxlY3RvcjogJ1tjdXN0b20tdmFsaWRhdG9yXScsXG4gKiAgIHByb3ZpZGVyczogW3Byb3ZpZGUoTkdfVkFMSURBVE9SUywge3VzZUV4aXN0aW5nOiBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUsIG11bHRpOiB0cnVlfSldXG4gKiB9KVxuICogY2xhc3MgQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoYzogQ29udHJvbCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAqICAgICByZXR1cm4ge1wiY3VzdG9tXCI6IHRydWV9O1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0b3IgeyB2YWxpZGF0ZShjOiBtb2RlbE1vZHVsZS5BYnN0cmFjdENvbnRyb2wpOiB7W2tleTogc3RyaW5nXTogYW55fTsgfVxuXG5jb25zdCBSRVFVSVJFRCA9IFZhbGlkYXRvcnMucmVxdWlyZWQ7XG5cbmNvbnN0IFJFUVVJUkVEX1ZBTElEQVRPUiA9XG4gICAgQ09OU1RfRVhQUihuZXcgUHJvdmlkZXIoTkdfVkFMSURBVE9SUywge3VzZVZhbHVlOiBSRVFVSVJFRCwgbXVsdGk6IHRydWV9KSk7XG5cbi8qKlxuICogQSBEaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgcmVxdWlyZWRgIHZhbGlkYXRvciB0byBhbnkgY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgcmVxdWlyZWRgIGF0dHJpYnV0ZSwgdmlhIHRoZSB7QGxpbmsgTkdfVkFMSURBVE9SU30gYmluZGluZy5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogPGlucHV0IG5nQ29udHJvbD1cImZ1bGxOYW1lXCIgcmVxdWlyZWQ+XG4gKiBgYGBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3JlcXVpcmVkXVtuZ0NvbnRyb2xdLFtyZXF1aXJlZF1bbmdGb3JtQ29udHJvbF0sW3JlcXVpcmVkXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW1JFUVVJUkVEX1ZBTElEQVRPUl1cbn0pXG5leHBvcnQgY2xhc3MgUmVxdWlyZWRWYWxpZGF0b3Ige1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRvckZuIHsgKGM6IEFic3RyYWN0Q29udHJvbCk6IHtba2V5OiBzdHJpbmddOiBhbnl9OyB9XG5leHBvcnQgaW50ZXJmYWNlIEFzeW5jVmFsaWRhdG9yRm4ge1xuICAoYzogQWJzdHJhY3RDb250cm9sKTogYW55IC8qUHJvbWlzZTx7W2tleTogc3RyaW5nXTogYW55fT58T2JzZXJ2YWJsZTx7W2tleTogc3RyaW5nXTogYW55fT4qLztcbn1cblxuLyoqXG4gKiBQcm92aXZkZXIgd2hpY2ggYWRkcyB7QGxpbmsgTWluTGVuZ3RoVmFsaWRhdG9yfSB0byB7QGxpbmsgTkdfVkFMSURBVE9SU30uXG4gKlxuICogIyMgRXhhbXBsZTpcbiAqXG4gKiB7QGV4YW1wbGUgY29tbW9uL2Zvcm1zL3RzL3ZhbGlkYXRvcnMvdmFsaWRhdG9ycy50cyByZWdpb249J21pbid9XG4gKi9cbmNvbnN0IE1JTl9MRU5HVEhfVkFMSURBVE9SID0gQ09OU1RfRVhQUihcbiAgICBuZXcgUHJvdmlkZXIoTkdfVkFMSURBVE9SUywge3VzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1pbkxlbmd0aFZhbGlkYXRvciksIG11bHRpOiB0cnVlfSkpO1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHdoaWNoIGluc3RhbGxzIHRoZSB7QGxpbmsgTWluTGVuZ3RoVmFsaWRhdG9yfSBmb3IgYW55IGBuZ0NvbnRyb2xgLFxuICogYG5nRm9ybUNvbnRyb2xgLCBvciBjb250cm9sIHdpdGggYG5nTW9kZWxgIHRoYXQgYWxzbyBoYXMgYSBgbWlubGVuZ3RoYCBhdHRyaWJ1dGUuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttaW5sZW5ndGhdW25nQ29udHJvbF0sW21pbmxlbmd0aF1bbmdGb3JtQ29udHJvbF0sW21pbmxlbmd0aF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtNSU5fTEVOR1RIX1ZBTElEQVRPUl1cbn0pXG5leHBvcnQgY2xhc3MgTWluTGVuZ3RoVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbjtcblxuICBjb25zdHJ1Y3RvcihAQXR0cmlidXRlKFwibWlubGVuZ3RoXCIpIG1pbkxlbmd0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5taW5MZW5ndGgoTnVtYmVyV3JhcHBlci5wYXJzZUludChtaW5MZW5ndGgsIDEwKSk7XG4gIH1cblxuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiB7W2tleTogc3RyaW5nXTogYW55fSB7IHJldHVybiB0aGlzLl92YWxpZGF0b3IoYyk7IH1cbn1cblxuLyoqXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIHtAbGluayBNYXhMZW5ndGhWYWxpZGF0b3J9IHRvIHtAbGluayBOR19WQUxJREFUT1JTfS5cbiAqXG4gKiAjIyBFeGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSBjb21tb24vZm9ybXMvdHMvdmFsaWRhdG9ycy92YWxpZGF0b3JzLnRzIHJlZ2lvbj0nbWF4J31cbiAqL1xuY29uc3QgTUFYX0xFTkdUSF9WQUxJREFUT1IgPSBDT05TVF9FWFBSKFxuICAgIG5ldyBQcm92aWRlcihOR19WQUxJREFUT1JTLCB7dXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF4TGVuZ3RoVmFsaWRhdG9yKSwgbXVsdGk6IHRydWV9KSk7XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgd2hpY2ggaW5zdGFsbHMgdGhlIHtAbGluayBNYXhMZW5ndGhWYWxpZGF0b3J9IGZvciBhbnkgYG5nQ29udHJvbCwgYG5nRm9ybUNvbnRyb2xgLFxuICogb3IgY29udHJvbCB3aXRoIGBuZ01vZGVsYCB0aGF0IGFsc28gaGFzIGEgYG1heGxlbmd0aGAgYXR0cmlidXRlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF4bGVuZ3RoXVtuZ0NvbnRyb2xdLFttYXhsZW5ndGhdW25nRm9ybUNvbnRyb2xdLFttYXhsZW5ndGhdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbTUFYX0xFTkdUSF9WQUxJREFUT1JdXG59KVxuZXhwb3J0IGNsYXNzIE1heExlbmd0aFZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvciB7XG4gIHByaXZhdGUgX3ZhbGlkYXRvcjogVmFsaWRhdG9yRm47XG5cbiAgY29uc3RydWN0b3IoQEF0dHJpYnV0ZShcIm1heGxlbmd0aFwiKSBtYXhMZW5ndGg6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMubWF4TGVuZ3RoKE51bWJlcldyYXBwZXIucGFyc2VJbnQobWF4TGVuZ3RoLCAxMCkpO1xuICB9XG5cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKToge1trZXk6IHN0cmluZ106IGFueX0geyByZXR1cm4gdGhpcy5fdmFsaWRhdG9yKGMpOyB9XG59XG5cblxuLyoqXG4gKiBBIERpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGBwYXR0ZXJuYCB2YWxpZGF0b3IgdG8gYW55IGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHBhdHRlcm5gIGF0dHJpYnV0ZSwgdmlhIHRoZSB7QGxpbmsgTkdfVkFMSURBVE9SU30gYmluZGluZy4gVXNlcyBhdHRyaWJ1dGUgdmFsdWVcbiAqIGFzIHRoZSByZWdleCB0byB2YWxpZGF0ZSBDb250cm9sIHZhbHVlIGFnYWluc3QuICBGb2xsb3dzIHBhdHRlcm4gYXR0cmlidXRlXG4gKiBzZW1hbnRpY3M7IGkuZS4gcmVnZXggbXVzdCBtYXRjaCBlbnRpcmUgQ29udHJvbCB2YWx1ZS5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogPGlucHV0IFtuZ0NvbnRyb2xdPVwiZnVsbE5hbWVcIiBwYXR0ZXJuPVwiW2EtekEtWiBdKlwiPlxuICogYGBgXG4gKi9cbmNvbnN0IFBBVFRFUk5fVkFMSURBVE9SID0gQ09OU1RfRVhQUihcbiAgICBuZXcgUHJvdmlkZXIoTkdfVkFMSURBVE9SUywge3VzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFBhdHRlcm5WYWxpZGF0b3IpLCBtdWx0aTogdHJ1ZX0pKTtcbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1twYXR0ZXJuXVtuZ0NvbnRyb2xdLFtwYXR0ZXJuXVtuZ0Zvcm1Db250cm9sXSxbcGF0dGVybl1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtQQVRURVJOX1ZBTElEQVRPUl1cbn0pXG5leHBvcnQgY2xhc3MgUGF0dGVyblZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvciB7XG4gIHByaXZhdGUgX3ZhbGlkYXRvcjogVmFsaWRhdG9yRm47XG5cbiAgY29uc3RydWN0b3IoQEF0dHJpYnV0ZShcInBhdHRlcm5cIikgcGF0dGVybjogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5wYXR0ZXJuKHBhdHRlcm4pO1xuICB9XG5cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKToge1trZXk6IHN0cmluZ106IGFueX0geyByZXR1cm4gdGhpcy5fdmFsaWRhdG9yKGMpOyB9XG59XG4iXX0=