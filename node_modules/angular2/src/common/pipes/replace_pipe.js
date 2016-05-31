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
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var core_1 = require('angular2/core');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
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
var ReplacePipe = (function () {
    function ReplacePipe() {
    }
    ReplacePipe.prototype.transform = function (value, args) {
        if (lang_1.isBlank(args) || args.length !== 2) {
            throw new exceptions_1.BaseException('ReplacePipe requires two arguments');
        }
        if (lang_1.isBlank(value)) {
            return value;
        }
        if (!this._supportedInput(value)) {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(ReplacePipe, value);
        }
        var input = value.toString();
        var pattern = args[0];
        var replacement = args[1];
        if (!this._supportedPattern(pattern)) {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(ReplacePipe, pattern);
        }
        if (!this._supportedReplacement(replacement)) {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(ReplacePipe, replacement);
        }
        // template fails with literal RegExp e.g /pattern/igm
        // var rgx = pattern instanceof RegExp ? pattern : RegExpWrapper.create(pattern);
        if (lang_1.isFunction(replacement)) {
            var rgxPattern = lang_1.isString(pattern) ? lang_1.RegExpWrapper.create(pattern) : pattern;
            return lang_1.StringWrapper.replaceAllMapped(input, rgxPattern, replacement);
        }
        if (pattern instanceof RegExp) {
            // use the replaceAll variant
            return lang_1.StringWrapper.replaceAll(input, pattern, replacement);
        }
        return lang_1.StringWrapper.replace(input, pattern, replacement);
    };
    ReplacePipe.prototype._supportedInput = function (input) { return lang_1.isString(input) || lang_1.isNumber(input); };
    ReplacePipe.prototype._supportedPattern = function (pattern) {
        return lang_1.isString(pattern) || pattern instanceof RegExp;
    };
    ReplacePipe.prototype._supportedReplacement = function (replacement) {
        return lang_1.isString(replacement) || lang_1.isFunction(replacement);
    };
    ReplacePipe = __decorate([
        core_1.Pipe({ name: 'replace' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ReplacePipe);
    return ReplacePipe;
}());
exports.ReplacePipe = ReplacePipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZV9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2NvbW1vbi9waXBlcy9yZXBsYWNlX3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQU9PLDBCQUEwQixDQUFDLENBQUE7QUFDbEMsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFDN0QscUJBQThDLGVBQWUsQ0FBQyxDQUFBO0FBQzlELGdEQUEyQyxtQ0FBbUMsQ0FBQyxDQUFBO0FBRS9FOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFJSDtJQUFBO0lBa0RBLENBQUM7SUFqREMsK0JBQVMsR0FBVCxVQUFVLEtBQVUsRUFBRSxJQUFXO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxJQUFJLDBCQUFhLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxJQUFJLDhEQUE0QixDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBRUQsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFHMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sSUFBSSw4REFBNEIsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLElBQUksOERBQTRCLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFDRCxzREFBc0Q7UUFDdEQsaUZBQWlGO1FBRWpGLEVBQUUsQ0FBQyxDQUFDLGlCQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksVUFBVSxHQUFHLGVBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxvQkFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7WUFFN0UsTUFBTSxDQUFDLG9CQUFhLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN4RSxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxZQUFZLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDOUIsNkJBQTZCO1lBQzdCLE1BQU0sQ0FBQyxvQkFBYSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFFRCxNQUFNLENBQUMsb0JBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU8scUNBQWUsR0FBdkIsVUFBd0IsS0FBVSxJQUFhLE1BQU0sQ0FBQyxlQUFRLENBQUMsS0FBSyxDQUFDLElBQUksZUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuRix1Q0FBaUIsR0FBekIsVUFBMEIsT0FBWTtRQUNwQyxNQUFNLENBQUMsZUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sWUFBWSxNQUFNLENBQUM7SUFDeEQsQ0FBQztJQUVPLDJDQUFxQixHQUE3QixVQUE4QixXQUFnQjtRQUM1QyxNQUFNLENBQUMsZUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLGlCQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQW5ESDtRQUFDLFdBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQztRQUN2QixpQkFBVSxFQUFFOzttQkFBQTtJQW1EYixrQkFBQztBQUFELENBQUMsQUFsREQsSUFrREM7QUFsRFksbUJBQVcsY0FrRHZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBpc0JsYW5rLFxuICBpc1N0cmluZyxcbiAgaXNOdW1iZXIsXG4gIGlzRnVuY3Rpb24sXG4gIFJlZ0V4cFdyYXBwZXIsXG4gIFN0cmluZ1dyYXBwZXJcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7SW5qZWN0YWJsZSwgUGlwZVRyYW5zZm9ybSwgUGlwZX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge0ludmFsaWRQaXBlQXJndW1lbnRFeGNlcHRpb259IGZyb20gJy4vaW52YWxpZF9waXBlX2FyZ3VtZW50X2V4Y2VwdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBTdHJpbmcgd2l0aCBzb21lIG9yIGFsbCBvZiB0aGUgbWF0Y2hlcyBvZiBhIHBhdHRlcm4gcmVwbGFjZWQgYnlcbiAqIGEgcmVwbGFjZW1lbnQuXG4gKlxuICogVGhlIHBhdHRlcm4gdG8gYmUgbWF0Y2hlZCBpcyBzcGVjaWZpZWQgYnkgdGhlICdwYXR0ZXJuJyBwYXJhbWV0ZXIuXG4gKlxuICogVGhlIHJlcGxhY2VtZW50IHRvIGJlIHNldCBpcyBzcGVjaWZpZWQgYnkgdGhlICdyZXBsYWNlbWVudCcgcGFyYW1ldGVyLlxuICpcbiAqIEFuIG9wdGlvbmFsICdmbGFncycgcGFyYW1ldGVyIGNhbiBiZSBzZXQuXG4gKlxuICogIyMjIFVzYWdlXG4gKlxuICogICAgIGV4cHJlc3Npb24gfCByZXBsYWNlOnBhdHRlcm46cmVwbGFjZW1lbnRcbiAqXG4gKiBBbGwgYmVoYXZpb3IgaXMgYmFzZWQgb24gdGhlIGV4cGVjdGVkIGJlaGF2aW9yIG9mIHRoZSBKYXZhU2NyaXB0IEFQSVxuICogU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlKCkgZnVuY3Rpb24uXG4gKlxuICogV2hlcmUgdGhlIGlucHV0IGV4cHJlc3Npb24gaXMgYSBbU3RyaW5nXSBvciBbTnVtYmVyXSAodG8gYmUgdHJlYXRlZCBhcyBhIHN0cmluZyksXG4gKiB0aGUgYHBhdHRlcm5gIGlzIGEgW1N0cmluZ10gb3IgW1JlZ0V4cF0sXG4gKiB0aGUgJ3JlcGxhY2VtZW50JyBpcyBhIFtTdHJpbmddIG9yIFtGdW5jdGlvbl0uXG4gKlxuICogLS1Ob3RlLS06IFRoZSAncGF0dGVybicgcGFyYW1ldGVyIHdpbGwgYmUgY29udmVydGVkIHRvIGEgUmVnRXhwIGluc3RhbmNlLiBNYWtlIHN1cmUgdG8gZXNjYXBlIHRoZVxuICogc3RyaW5nIHByb3Blcmx5IGlmIHlvdSBhcmUgbWF0Y2hpbmcgZm9yIHJlZ3VsYXIgZXhwcmVzc2lvbiBzcGVjaWFsIGNoYXJhY3RlcnMgbGlrZSBwYXJlbnRoZXNpcyxcbiAqIGJyYWNrZXRzIGV0Yy5cbiAqL1xuXG5AUGlwZSh7bmFtZTogJ3JlcGxhY2UnfSlcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSZXBsYWNlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWU6IGFueSwgYXJnczogYW55W10pOiBhbnkge1xuICAgIGlmIChpc0JsYW5rKGFyZ3MpIHx8IGFyZ3MubGVuZ3RoICE9PSAyKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbignUmVwbGFjZVBpcGUgcmVxdWlyZXMgdHdvIGFyZ3VtZW50cycpO1xuICAgIH1cblxuICAgIGlmIChpc0JsYW5rKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fc3VwcG9ydGVkSW5wdXQodmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbihSZXBsYWNlUGlwZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHZhciBpbnB1dCA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgdmFyIHBhdHRlcm4gPSBhcmdzWzBdO1xuICAgIHZhciByZXBsYWNlbWVudCA9IGFyZ3NbMV07XG5cblxuICAgIGlmICghdGhpcy5fc3VwcG9ydGVkUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRQaXBlQXJndW1lbnRFeGNlcHRpb24oUmVwbGFjZVBpcGUsIHBhdHRlcm4pO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX3N1cHBvcnRlZFJlcGxhY2VtZW50KHJlcGxhY2VtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRQaXBlQXJndW1lbnRFeGNlcHRpb24oUmVwbGFjZVBpcGUsIHJlcGxhY2VtZW50KTtcbiAgICB9XG4gICAgLy8gdGVtcGxhdGUgZmFpbHMgd2l0aCBsaXRlcmFsIFJlZ0V4cCBlLmcgL3BhdHRlcm4vaWdtXG4gICAgLy8gdmFyIHJneCA9IHBhdHRlcm4gaW5zdGFuY2VvZiBSZWdFeHAgPyBwYXR0ZXJuIDogUmVnRXhwV3JhcHBlci5jcmVhdGUocGF0dGVybik7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihyZXBsYWNlbWVudCkpIHtcbiAgICAgIHZhciByZ3hQYXR0ZXJuID0gaXNTdHJpbmcocGF0dGVybikgPyBSZWdFeHBXcmFwcGVyLmNyZWF0ZShwYXR0ZXJuKSA6IHBhdHRlcm47XG5cbiAgICAgIHJldHVybiBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGxNYXBwZWQoaW5wdXQsIHJneFBhdHRlcm4sIHJlcGxhY2VtZW50KTtcbiAgICB9XG4gICAgaWYgKHBhdHRlcm4gaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIC8vIHVzZSB0aGUgcmVwbGFjZUFsbCB2YXJpYW50XG4gICAgICByZXR1cm4gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsKGlucHV0LCBwYXR0ZXJuLCByZXBsYWNlbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmluZ1dyYXBwZXIucmVwbGFjZShpbnB1dCwgcGF0dGVybiwgcmVwbGFjZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc3VwcG9ydGVkSW5wdXQoaW5wdXQ6IGFueSk6IGJvb2xlYW4geyByZXR1cm4gaXNTdHJpbmcoaW5wdXQpIHx8IGlzTnVtYmVyKGlucHV0KTsgfVxuXG4gIHByaXZhdGUgX3N1cHBvcnRlZFBhdHRlcm4ocGF0dGVybjogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGlzU3RyaW5nKHBhdHRlcm4pIHx8IHBhdHRlcm4gaW5zdGFuY2VvZiBSZWdFeHA7XG4gIH1cblxuICBwcml2YXRlIF9zdXBwb3J0ZWRSZXBsYWNlbWVudChyZXBsYWNlbWVudDogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGlzU3RyaW5nKHJlcGxhY2VtZW50KSB8fCBpc0Z1bmN0aW9uKHJlcGxhY2VtZW50KTtcbiAgfVxufVxuIl19