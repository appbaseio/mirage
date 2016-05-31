var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { isBlank, isString, isNumber, isFunction, RegExpWrapper, StringWrapper } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { Injectable, Pipe } from 'angular2/core';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
/**
 * Creates a new String with some or all of the matches of a pattern replaced by
 * a replacement.
 *
 * The pattern to be matched is specified by the 'pattern' parameter.
 *
 * The replacement to be set is specified by the 'replacement' parameter.
 *
 * An optional 'flags' parameter can be set.
 *
 * ### Usage
 *
 *     expression | replace:pattern:replacement
 *
 * All behavior is based on the expected behavior of the JavaScript API
 * String.prototype.replace() function.
 *
 * Where the input expression is a [String] or [Number] (to be treated as a string),
 * the `pattern` is a [String] or [RegExp],
 * the 'replacement' is a [String] or [Function].
 *
 * --Note--: The 'pattern' parameter will be converted to a RegExp instance. Make sure to escape the
 * string properly if you are matching for regular expression special characters like parenthesis,
 * brackets etc.
 */
let ReplacePipe_1;
export let ReplacePipe = ReplacePipe_1 = class ReplacePipe {
    transform(value, args) {
        if (isBlank(args) || args.length !== 2) {
            throw new BaseException('ReplacePipe requires two arguments');
        }
        if (isBlank(value)) {
            return value;
        }
        if (!this._supportedInput(value)) {
            throw new InvalidPipeArgumentException(ReplacePipe_1, value);
        }
        var input = value.toString();
        var pattern = args[0];
        var replacement = args[1];
        if (!this._supportedPattern(pattern)) {
            throw new InvalidPipeArgumentException(ReplacePipe_1, pattern);
        }
        if (!this._supportedReplacement(replacement)) {
            throw new InvalidPipeArgumentException(ReplacePipe_1, replacement);
        }
        // template fails with literal RegExp e.g /pattern/igm
        // var rgx = pattern instanceof RegExp ? pattern : RegExpWrapper.create(pattern);
        if (isFunction(replacement)) {
            var rgxPattern = isString(pattern) ? RegExpWrapper.create(pattern) : pattern;
            return StringWrapper.replaceAllMapped(input, rgxPattern, replacement);
        }
        if (pattern instanceof RegExp) {
            // use the replaceAll variant
            return StringWrapper.replaceAll(input, pattern, replacement);
        }
        return StringWrapper.replace(input, pattern, replacement);
    }
    _supportedInput(input) { return isString(input) || isNumber(input); }
    _supportedPattern(pattern) {
        return isString(pattern) || pattern instanceof RegExp;
    }
    _supportedReplacement(replacement) {
        return isString(replacement) || isFunction(replacement);
    }
};
ReplacePipe = ReplacePipe_1 = __decorate([
    Pipe({ name: 'replace' }),
    Injectable(), 
    __metadata('design:paramtypes', [])
], ReplacePipe);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZV9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL2NvbW1vbi9waXBlcy9yZXBsYWNlX3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFDTCxPQUFPLEVBQ1AsUUFBUSxFQUNSLFFBQVEsRUFDUixVQUFVLEVBQ1YsYUFBYSxFQUNiLGFBQWEsRUFDZCxNQUFNLDBCQUEwQjtPQUMxQixFQUFDLGFBQWEsRUFBQyxNQUFNLGdDQUFnQztPQUNyRCxFQUFDLFVBQVUsRUFBaUIsSUFBSSxFQUFDLE1BQU0sZUFBZTtPQUN0RCxFQUFDLDRCQUE0QixFQUFDLE1BQU0sbUNBQW1DO0FBRTlFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFJSDs7SUFDRSxTQUFTLENBQUMsS0FBVSxFQUFFLElBQVc7UUFDL0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxNQUFNLElBQUksYUFBYSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sSUFBSSw0QkFBNEIsQ0FBQyxhQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUVELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLElBQUksNEJBQTRCLENBQUMsYUFBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxJQUFJLDRCQUE0QixDQUFDLGFBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBQ0Qsc0RBQXNEO1FBQ3RELGlGQUFpRjtRQUVqRixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLE9BQU8sQ0FBQztZQUU3RSxNQUFNLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzlCLDZCQUE2QjtZQUM3QixNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFFRCxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTyxlQUFlLENBQUMsS0FBVSxJQUFhLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuRixpQkFBaUIsQ0FBQyxPQUFZO1FBQ3BDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxZQUFZLE1BQU0sQ0FBQztJQUN4RCxDQUFDO0lBRU8scUJBQXFCLENBQUMsV0FBZ0I7UUFDNUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUQsQ0FBQztBQUNILENBQUM7QUFwREQ7SUFBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFDLENBQUM7SUFDdkIsVUFBVSxFQUFFOztlQUFBO0FBbURaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgaXNCbGFuayxcbiAgaXNTdHJpbmcsXG4gIGlzTnVtYmVyLFxuICBpc0Z1bmN0aW9uLFxuICBSZWdFeHBXcmFwcGVyLFxuICBTdHJpbmdXcmFwcGVyXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0luamVjdGFibGUsIFBpcGVUcmFuc2Zvcm0sIFBpcGV9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtJbnZhbGlkUGlwZUFyZ3VtZW50RXhjZXB0aW9ufSBmcm9tICcuL2ludmFsaWRfcGlwZV9hcmd1bWVudF9leGNlcHRpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgU3RyaW5nIHdpdGggc29tZSBvciBhbGwgb2YgdGhlIG1hdGNoZXMgb2YgYSBwYXR0ZXJuIHJlcGxhY2VkIGJ5XG4gKiBhIHJlcGxhY2VtZW50LlxuICpcbiAqIFRoZSBwYXR0ZXJuIHRvIGJlIG1hdGNoZWQgaXMgc3BlY2lmaWVkIGJ5IHRoZSAncGF0dGVybicgcGFyYW1ldGVyLlxuICpcbiAqIFRoZSByZXBsYWNlbWVudCB0byBiZSBzZXQgaXMgc3BlY2lmaWVkIGJ5IHRoZSAncmVwbGFjZW1lbnQnIHBhcmFtZXRlci5cbiAqXG4gKiBBbiBvcHRpb25hbCAnZmxhZ3MnIHBhcmFtZXRlciBjYW4gYmUgc2V0LlxuICpcbiAqICMjIyBVc2FnZVxuICpcbiAqICAgICBleHByZXNzaW9uIHwgcmVwbGFjZTpwYXR0ZXJuOnJlcGxhY2VtZW50XG4gKlxuICogQWxsIGJlaGF2aW9yIGlzIGJhc2VkIG9uIHRoZSBleHBlY3RlZCBiZWhhdmlvciBvZiB0aGUgSmF2YVNjcmlwdCBBUElcbiAqIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZSgpIGZ1bmN0aW9uLlxuICpcbiAqIFdoZXJlIHRoZSBpbnB1dCBleHByZXNzaW9uIGlzIGEgW1N0cmluZ10gb3IgW051bWJlcl0gKHRvIGJlIHRyZWF0ZWQgYXMgYSBzdHJpbmcpLFxuICogdGhlIGBwYXR0ZXJuYCBpcyBhIFtTdHJpbmddIG9yIFtSZWdFeHBdLFxuICogdGhlICdyZXBsYWNlbWVudCcgaXMgYSBbU3RyaW5nXSBvciBbRnVuY3Rpb25dLlxuICpcbiAqIC0tTm90ZS0tOiBUaGUgJ3BhdHRlcm4nIHBhcmFtZXRlciB3aWxsIGJlIGNvbnZlcnRlZCB0byBhIFJlZ0V4cCBpbnN0YW5jZS4gTWFrZSBzdXJlIHRvIGVzY2FwZSB0aGVcbiAqIHN0cmluZyBwcm9wZXJseSBpZiB5b3UgYXJlIG1hdGNoaW5nIGZvciByZWd1bGFyIGV4cHJlc3Npb24gc3BlY2lhbCBjaGFyYWN0ZXJzIGxpa2UgcGFyZW50aGVzaXMsXG4gKiBicmFja2V0cyBldGMuXG4gKi9cblxuQFBpcGUoe25hbWU6ICdyZXBsYWNlJ30pXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVwbGFjZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKHZhbHVlOiBhbnksIGFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBpZiAoaXNCbGFuayhhcmdzKSB8fCBhcmdzLmxlbmd0aCAhPT0gMikge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oJ1JlcGxhY2VQaXBlIHJlcXVpcmVzIHR3byBhcmd1bWVudHMnKTtcbiAgICB9XG5cbiAgICBpZiAoaXNCbGFuayh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX3N1cHBvcnRlZElucHV0KHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRQaXBlQXJndW1lbnRFeGNlcHRpb24oUmVwbGFjZVBpcGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICB2YXIgaW5wdXQgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgIHZhciBwYXR0ZXJuID0gYXJnc1swXTtcbiAgICB2YXIgcmVwbGFjZW1lbnQgPSBhcmdzWzFdO1xuXG5cbiAgICBpZiAoIXRoaXMuX3N1cHBvcnRlZFBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkUGlwZUFyZ3VtZW50RXhjZXB0aW9uKFJlcGxhY2VQaXBlLCBwYXR0ZXJuKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9zdXBwb3J0ZWRSZXBsYWNlbWVudChyZXBsYWNlbWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkUGlwZUFyZ3VtZW50RXhjZXB0aW9uKFJlcGxhY2VQaXBlLCByZXBsYWNlbWVudCk7XG4gICAgfVxuICAgIC8vIHRlbXBsYXRlIGZhaWxzIHdpdGggbGl0ZXJhbCBSZWdFeHAgZS5nIC9wYXR0ZXJuL2lnbVxuICAgIC8vIHZhciByZ3ggPSBwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwID8gcGF0dGVybiA6IFJlZ0V4cFdyYXBwZXIuY3JlYXRlKHBhdHRlcm4pO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24ocmVwbGFjZW1lbnQpKSB7XG4gICAgICB2YXIgcmd4UGF0dGVybiA9IGlzU3RyaW5nKHBhdHRlcm4pID8gUmVnRXhwV3JhcHBlci5jcmVhdGUocGF0dGVybikgOiBwYXR0ZXJuO1xuXG4gICAgICByZXR1cm4gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsTWFwcGVkKGlucHV0LCByZ3hQYXR0ZXJuLCByZXBsYWNlbWVudCk7XG4gICAgfVxuICAgIGlmIChwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAvLyB1c2UgdGhlIHJlcGxhY2VBbGwgdmFyaWFudFxuICAgICAgcmV0dXJuIFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbChpbnB1dCwgcGF0dGVybiwgcmVwbGFjZW1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBTdHJpbmdXcmFwcGVyLnJlcGxhY2UoaW5wdXQsIHBhdHRlcm4sIHJlcGxhY2VtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgX3N1cHBvcnRlZElucHV0KGlucHV0OiBhbnkpOiBib29sZWFuIHsgcmV0dXJuIGlzU3RyaW5nKGlucHV0KSB8fCBpc051bWJlcihpbnB1dCk7IH1cblxuICBwcml2YXRlIF9zdXBwb3J0ZWRQYXR0ZXJuKHBhdHRlcm46IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc1N0cmluZyhwYXR0ZXJuKSB8fCBwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwO1xuICB9XG5cbiAgcHJpdmF0ZSBfc3VwcG9ydGVkUmVwbGFjZW1lbnQocmVwbGFjZW1lbnQ6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc1N0cmluZyhyZXBsYWNlbWVudCkgfHwgaXNGdW5jdGlvbihyZXBsYWNlbWVudCk7XG4gIH1cbn1cbiJdfQ==