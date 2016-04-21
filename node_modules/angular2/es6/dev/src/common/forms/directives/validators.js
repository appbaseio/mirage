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
import { forwardRef, Provider, Attribute, Directive } from 'angular2/core';
import { CONST_EXPR } from 'angular2/src/facade/lang';
import { Validators, NG_VALIDATORS } from '../validators';
import { NumberWrapper } from "angular2/src/facade/lang";
const REQUIRED = Validators.required;
const REQUIRED_VALIDATOR = CONST_EXPR(new Provider(NG_VALIDATORS, { useValue: REQUIRED, multi: true }));
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
export let RequiredValidator = class RequiredValidator {
};
RequiredValidator = __decorate([
    Directive({
        selector: '[required][ngControl],[required][ngFormControl],[required][ngModel]',
        providers: [REQUIRED_VALIDATOR]
    }), 
    __metadata('design:paramtypes', [])
], RequiredValidator);
/**
 * Provivder which adds {@link MinLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='min'}
 */
const MIN_LENGTH_VALIDATOR = CONST_EXPR(new Provider(NG_VALIDATORS, { useExisting: forwardRef(() => MinLengthValidator), multi: true }));
/**
 * A directive which installs the {@link MinLengthValidator} for any `ngControl`,
 * `ngFormControl`, or control with `ngModel` that also has a `minlength` attribute.
 */
export let MinLengthValidator = class MinLengthValidator {
    constructor(minLength) {
        this._validator = Validators.minLength(NumberWrapper.parseInt(minLength, 10));
    }
    validate(c) { return this._validator(c); }
};
MinLengthValidator = __decorate([
    Directive({
        selector: '[minlength][ngControl],[minlength][ngFormControl],[minlength][ngModel]',
        providers: [MIN_LENGTH_VALIDATOR]
    }),
    __param(0, Attribute("minlength")), 
    __metadata('design:paramtypes', [String])
], MinLengthValidator);
/**
 * Provider which adds {@link MaxLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='max'}
 */
const MAX_LENGTH_VALIDATOR = CONST_EXPR(new Provider(NG_VALIDATORS, { useExisting: forwardRef(() => MaxLengthValidator), multi: true }));
/**
 * A directive which installs the {@link MaxLengthValidator} for any `ngControl, `ngFormControl`,
 * or control with `ngModel` that also has a `maxlength` attribute.
 */
export let MaxLengthValidator = class MaxLengthValidator {
    constructor(maxLength) {
        this._validator = Validators.maxLength(NumberWrapper.parseInt(maxLength, 10));
    }
    validate(c) { return this._validator(c); }
};
MaxLengthValidator = __decorate([
    Directive({
        selector: '[maxlength][ngControl],[maxlength][ngFormControl],[maxlength][ngModel]',
        providers: [MAX_LENGTH_VALIDATOR]
    }),
    __param(0, Attribute("maxlength")), 
    __metadata('design:paramtypes', [String])
], MaxLengthValidator);
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
const PATTERN_VALIDATOR = CONST_EXPR(new Provider(NG_VALIDATORS, { useExisting: forwardRef(() => PatternValidator), multi: true }));
export let PatternValidator = class PatternValidator {
    constructor(pattern) {
        this._validator = Validators.pattern(pattern);
    }
    validate(c) { return this._validator(c); }
};
PatternValidator = __decorate([
    Directive({
        selector: '[pattern][ngControl],[pattern][ngFormControl],[pattern][ngModel]',
        providers: [PATTERN_VALIDATOR]
    }),
    __param(0, Attribute("pattern")), 
    __metadata('design:paramtypes', [String])
], PatternValidator);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vZm9ybXMvZGlyZWN0aXZlcy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztPQUFPLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZTtPQUNqRSxFQUFDLFVBQVUsRUFBQyxNQUFNLDBCQUEwQjtPQUM1QyxFQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUMsTUFBTSxlQUFlO09BR2hELEVBQUMsYUFBYSxFQUFDLE1BQU0sMEJBQTBCO0FBdUJ0RCxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDO0FBRXJDLE1BQU0sa0JBQWtCLEdBQ3BCLFVBQVUsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxhQUFhLEVBQUUsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFFL0U7Ozs7Ozs7OztHQVNHO0FBS0g7QUFDQSxDQUFDO0FBTEQ7SUFBQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUscUVBQXFFO1FBQy9FLFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDO0tBQ2hDLENBQUM7O3FCQUFBO0FBU0Y7Ozs7OztHQU1HO0FBQ0gsTUFBTSxvQkFBb0IsR0FBRyxVQUFVLENBQ25DLElBQUksUUFBUSxDQUFDLGFBQWEsRUFBRSxFQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsTUFBTSxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFFbkc7OztHQUdHO0FBS0g7SUFHRSxZQUFvQyxTQUFpQjtRQUNuRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQsUUFBUSxDQUFDLENBQWtCLElBQTBCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRixDQUFDO0FBWkQ7SUFBQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsd0VBQXdFO1FBQ2xGLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO0tBQ2xDLENBQUM7ZUFJYSxTQUFTLENBQUMsV0FBVyxDQUFDOztzQkFKbkM7QUFXRjs7Ozs7O0dBTUc7QUFDSCxNQUFNLG9CQUFvQixHQUFHLFVBQVUsQ0FDbkMsSUFBSSxRQUFRLENBQUMsYUFBYSxFQUFFLEVBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxNQUFNLGtCQUFrQixDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztBQUVuRzs7O0dBR0c7QUFLSDtJQUdFLFlBQW9DLFNBQWlCO1FBQ25ELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRCxRQUFRLENBQUMsQ0FBa0IsSUFBMEIsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25GLENBQUM7QUFaRDtJQUFDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSx3RUFBd0U7UUFDbEYsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUM7S0FDbEMsQ0FBQztlQUlhLFNBQVMsQ0FBQyxXQUFXLENBQUM7O3NCQUpuQztBQVlGOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQ2hDLElBQUksUUFBUSxDQUFDLGFBQWEsRUFBRSxFQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsTUFBTSxnQkFBZ0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFLakc7SUFHRSxZQUFrQyxPQUFlO1FBQy9DLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsUUFBUSxDQUFDLENBQWtCLElBQTBCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRixDQUFDO0FBWkQ7SUFBQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsa0VBQWtFO1FBQzVFLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO0tBQy9CLENBQUM7ZUFJYSxTQUFTLENBQUMsU0FBUyxDQUFDOztvQkFKakM7QUFTRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Zm9yd2FyZFJlZiwgUHJvdmlkZXIsIEF0dHJpYnV0ZSwgRGlyZWN0aXZlfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7Q09OU1RfRVhQUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7VmFsaWRhdG9ycywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0ICogYXMgbW9kZWxNb2R1bGUgZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtOdW1iZXJXcmFwcGVyfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nXCI7XG5cblxuXG4vKipcbiAqIEFuIGludGVyZmFjZSB0aGF0IGNhbiBiZSBpbXBsZW1lbnRlZCBieSBjbGFzc2VzIHRoYXQgY2FuIGFjdCBhcyB2YWxpZGF0b3JzLlxuICpcbiAqICMjIFVzYWdlXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQERpcmVjdGl2ZSh7XG4gKiAgIHNlbGVjdG9yOiAnW2N1c3RvbS12YWxpZGF0b3JdJyxcbiAqICAgcHJvdmlkZXJzOiBbcHJvdmlkZShOR19WQUxJREFUT1JTLCB7dXNlRXhpc3Rpbmc6IEN1c3RvbVZhbGlkYXRvckRpcmVjdGl2ZSwgbXVsdGk6IHRydWV9KV1cbiAqIH0pXG4gKiBjbGFzcyBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICogICB2YWxpZGF0ZShjOiBDb250cm9sKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICogICAgIHJldHVybiB7XCJjdXN0b21cIjogdHJ1ZX07XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRvciB7IHZhbGlkYXRlKGM6IG1vZGVsTW9kdWxlLkFic3RyYWN0Q29udHJvbCk6IHtba2V5OiBzdHJpbmddOiBhbnl9OyB9XG5cbmNvbnN0IFJFUVVJUkVEID0gVmFsaWRhdG9ycy5yZXF1aXJlZDtcblxuY29uc3QgUkVRVUlSRURfVkFMSURBVE9SID1cbiAgICBDT05TVF9FWFBSKG5ldyBQcm92aWRlcihOR19WQUxJREFUT1JTLCB7dXNlVmFsdWU6IFJFUVVJUkVELCBtdWx0aTogdHJ1ZX0pKTtcblxuLyoqXG4gKiBBIERpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGByZXF1aXJlZGAgdmFsaWRhdG9yIHRvIGFueSBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGByZXF1aXJlZGAgYXR0cmlidXRlLCB2aWEgdGhlIHtAbGluayBOR19WQUxJREFUT1JTfSBiaW5kaW5nLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgbmdDb250cm9sPVwiZnVsbE5hbWVcIiByZXF1aXJlZD5cbiAqIGBgYFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcmVxdWlyZWRdW25nQ29udHJvbF0sW3JlcXVpcmVkXVtuZ0Zvcm1Db250cm9sXSxbcmVxdWlyZWRdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbUkVRVUlSRURfVkFMSURBVE9SXVxufSlcbmV4cG9ydCBjbGFzcyBSZXF1aXJlZFZhbGlkYXRvciB7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdG9yRm4geyAoYzogQWJzdHJhY3RDb250cm9sKToge1trZXk6IHN0cmluZ106IGFueX07IH1cbmV4cG9ydCBpbnRlcmZhY2UgQXN5bmNWYWxpZGF0b3JGbiB7XG4gIChjOiBBYnN0cmFjdENvbnRyb2wpOiBhbnkgLypQcm9taXNlPHtba2V5OiBzdHJpbmddOiBhbnl9PnxPYnNlcnZhYmxlPHtba2V5OiBzdHJpbmddOiBhbnl9PiovO1xufVxuXG4vKipcbiAqIFByb3ZpdmRlciB3aGljaCBhZGRzIHtAbGluayBNaW5MZW5ndGhWYWxpZGF0b3J9IHRvIHtAbGluayBOR19WQUxJREFUT1JTfS5cbiAqXG4gKiAjIyBFeGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSBjb21tb24vZm9ybXMvdHMvdmFsaWRhdG9ycy92YWxpZGF0b3JzLnRzIHJlZ2lvbj0nbWluJ31cbiAqL1xuY29uc3QgTUlOX0xFTkdUSF9WQUxJREFUT1IgPSBDT05TVF9FWFBSKFxuICAgIG5ldyBQcm92aWRlcihOR19WQUxJREFUT1JTLCB7dXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWluTGVuZ3RoVmFsaWRhdG9yKSwgbXVsdGk6IHRydWV9KSk7XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgd2hpY2ggaW5zdGFsbHMgdGhlIHtAbGluayBNaW5MZW5ndGhWYWxpZGF0b3J9IGZvciBhbnkgYG5nQ29udHJvbGAsXG4gKiBgbmdGb3JtQ29udHJvbGAsIG9yIGNvbnRyb2wgd2l0aCBgbmdNb2RlbGAgdGhhdCBhbHNvIGhhcyBhIGBtaW5sZW5ndGhgIGF0dHJpYnV0ZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21pbmxlbmd0aF1bbmdDb250cm9sXSxbbWlubGVuZ3RoXVtuZ0Zvcm1Db250cm9sXSxbbWlubGVuZ3RoXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01JTl9MRU5HVEhfVkFMSURBVE9SXVxufSlcbmV4cG9ydCBjbGFzcyBNaW5MZW5ndGhWYWxpZGF0b3IgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICBwcml2YXRlIF92YWxpZGF0b3I6IFZhbGlkYXRvckZuO1xuXG4gIGNvbnN0cnVjdG9yKEBBdHRyaWJ1dGUoXCJtaW5sZW5ndGhcIikgbWluTGVuZ3RoOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLm1pbkxlbmd0aChOdW1iZXJXcmFwcGVyLnBhcnNlSW50KG1pbkxlbmd0aCwgMTApKTtcbiAgfVxuXG4gIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHsgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvcihjKTsgfVxufVxuXG4vKipcbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMge0BsaW5rIE1heExlbmd0aFZhbGlkYXRvcn0gdG8ge0BsaW5rIE5HX1ZBTElEQVRPUlN9LlxuICpcbiAqICMjIEV4YW1wbGU6XG4gKlxuICoge0BleGFtcGxlIGNvbW1vbi9mb3Jtcy90cy92YWxpZGF0b3JzL3ZhbGlkYXRvcnMudHMgcmVnaW9uPSdtYXgnfVxuICovXG5jb25zdCBNQVhfTEVOR1RIX1ZBTElEQVRPUiA9IENPTlNUX0VYUFIoXG4gICAgbmV3IFByb3ZpZGVyKE5HX1ZBTElEQVRPUlMsIHt1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXhMZW5ndGhWYWxpZGF0b3IpLCBtdWx0aTogdHJ1ZX0pKTtcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB3aGljaCBpbnN0YWxscyB0aGUge0BsaW5rIE1heExlbmd0aFZhbGlkYXRvcn0gZm9yIGFueSBgbmdDb250cm9sLCBgbmdGb3JtQ29udHJvbGAsXG4gKiBvciBjb250cm9sIHdpdGggYG5nTW9kZWxgIHRoYXQgYWxzbyBoYXMgYSBgbWF4bGVuZ3RoYCBhdHRyaWJ1dGUuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXhsZW5ndGhdW25nQ29udHJvbF0sW21heGxlbmd0aF1bbmdGb3JtQ29udHJvbF0sW21heGxlbmd0aF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtNQVhfTEVOR1RIX1ZBTElEQVRPUl1cbn0pXG5leHBvcnQgY2xhc3MgTWF4TGVuZ3RoVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbjtcblxuICBjb25zdHJ1Y3RvcihAQXR0cmlidXRlKFwibWF4bGVuZ3RoXCIpIG1heExlbmd0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5tYXhMZW5ndGgoTnVtYmVyV3JhcHBlci5wYXJzZUludChtYXhMZW5ndGgsIDEwKSk7XG4gIH1cblxuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiB7W2tleTogc3RyaW5nXTogYW55fSB7IHJldHVybiB0aGlzLl92YWxpZGF0b3IoYyk7IH1cbn1cblxuXG4vKipcbiAqIEEgRGlyZWN0aXZlIHRoYXQgYWRkcyB0aGUgYHBhdHRlcm5gIHZhbGlkYXRvciB0byBhbnkgY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgcGF0dGVybmAgYXR0cmlidXRlLCB2aWEgdGhlIHtAbGluayBOR19WQUxJREFUT1JTfSBiaW5kaW5nLiBVc2VzIGF0dHJpYnV0ZSB2YWx1ZVxuICogYXMgdGhlIHJlZ2V4IHRvIHZhbGlkYXRlIENvbnRyb2wgdmFsdWUgYWdhaW5zdC4gIEZvbGxvd3MgcGF0dGVybiBhdHRyaWJ1dGVcbiAqIHNlbWFudGljczsgaS5lLiByZWdleCBtdXN0IG1hdGNoIGVudGlyZSBDb250cm9sIHZhbHVlLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgW25nQ29udHJvbF09XCJmdWxsTmFtZVwiIHBhdHRlcm49XCJbYS16QS1aIF0qXCI+XG4gKiBgYGBcbiAqL1xuY29uc3QgUEFUVEVSTl9WQUxJREFUT1IgPSBDT05TVF9FWFBSKFxuICAgIG5ldyBQcm92aWRlcihOR19WQUxJREFUT1JTLCB7dXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUGF0dGVyblZhbGlkYXRvciksIG11bHRpOiB0cnVlfSkpO1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3BhdHRlcm5dW25nQ29udHJvbF0sW3BhdHRlcm5dW25nRm9ybUNvbnRyb2xdLFtwYXR0ZXJuXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW1BBVFRFUk5fVkFMSURBVE9SXVxufSlcbmV4cG9ydCBjbGFzcyBQYXR0ZXJuVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbjtcblxuICBjb25zdHJ1Y3RvcihAQXR0cmlidXRlKFwicGF0dGVyblwiKSBwYXR0ZXJuOiBzdHJpbmcpIHtcbiAgICB0aGlzLl92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLnBhdHRlcm4ocGF0dGVybik7XG4gIH1cblxuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiB7W2tleTogc3RyaW5nXTogYW55fSB7IHJldHVybiB0aGlzLl92YWxpZGF0b3IoYyk7IH1cbn1cbiJdfQ==