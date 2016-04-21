'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var intl_1 = require('angular2/src/facade/intl');
var core_1 = require('angular2/core');
var collection_1 = require('angular2/src/facade/collection');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var defaultLocale = 'en-US';
var _re = lang_1.RegExpWrapper.create('^(\\d+)?\\.((\\d+)(\\-(\\d+))?)?$');
/**
 * Internal base class for numeric pipes.
 */
var NumberPipe = (function () {
    function NumberPipe() {
    }
    /** @internal */
    NumberPipe._format = function (value, style, digits, currency, currencyAsSymbol) {
        if (currency === void 0) { currency = null; }
        if (currencyAsSymbol === void 0) { currencyAsSymbol = false; }
        if (lang_1.isBlank(value))
            return null;
        if (!lang_1.isNumber(value)) {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(NumberPipe, value);
        }
        var minInt = 1, minFraction = 0, maxFraction = 3;
        if (lang_1.isPresent(digits)) {
            var parts = lang_1.RegExpWrapper.firstMatch(_re, digits);
            if (lang_1.isBlank(parts)) {
                throw new exceptions_1.BaseException(digits + " is not a valid digit info for number pipes");
            }
            if (lang_1.isPresent(parts[1])) {
                minInt = lang_1.NumberWrapper.parseIntAutoRadix(parts[1]);
            }
            if (lang_1.isPresent(parts[3])) {
                minFraction = lang_1.NumberWrapper.parseIntAutoRadix(parts[3]);
            }
            if (lang_1.isPresent(parts[5])) {
                maxFraction = lang_1.NumberWrapper.parseIntAutoRadix(parts[5]);
            }
        }
        return intl_1.NumberFormatter.format(value, defaultLocale, style, {
            minimumIntegerDigits: minInt,
            minimumFractionDigits: minFraction,
            maximumFractionDigits: maxFraction,
            currency: currency,
            currencyAsSymbol: currencyAsSymbol
        });
    };
    NumberPipe = __decorate([
        lang_1.CONST(),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], NumberPipe);
    return NumberPipe;
}());
exports.NumberPipe = NumberPipe;
/**
 * WARNING: this pipe uses the Internationalization API.
 * Therefore it is only reliable in Chrome and Opera browsers.
 *
 * Formats a number as local text. i.e. group sizing and separator and other locale-specific
 * configurations are based on the active locale.
 *
 * ### Usage
 *
 *     expression | number[:digitInfo]
 *
 * where `expression` is a number and `digitInfo` has the following format:
 *
 *     {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}
 *
 * - minIntegerDigits is the minimum number of integer digits to use. Defaults to 1.
 * - minFractionDigits is the minimum number of digits after fraction. Defaults to 0.
 * - maxFractionDigits is the maximum number of digits after fraction. Defaults to 3.
 *
 * For more information on the acceptable range for each of these numbers and other
 * details see your native internationalization library.
 *
 * ### Example
 *
 * {@example core/pipes/ts/number_pipe/number_pipe_example.ts region='NumberPipe'}
 */
var DecimalPipe = (function (_super) {
    __extends(DecimalPipe, _super);
    function DecimalPipe() {
        _super.apply(this, arguments);
    }
    DecimalPipe.prototype.transform = function (value, args) {
        var digits = collection_1.ListWrapper.first(args);
        return NumberPipe._format(value, intl_1.NumberFormatStyle.Decimal, digits);
    };
    DecimalPipe = __decorate([
        lang_1.CONST(),
        core_1.Pipe({ name: 'number' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DecimalPipe);
    return DecimalPipe;
}(NumberPipe));
exports.DecimalPipe = DecimalPipe;
/**
 * WARNING: this pipe uses the Internationalization API.
 * Therefore it is only reliable in Chrome and Opera browsers.
 *
 * Formats a number as local percent.
 *
 * ### Usage
 *
 *     expression | percent[:digitInfo]
 *
 * For more information about `digitInfo` see {@link DecimalPipe}
 *
 * ### Example
 *
 * {@example core/pipes/ts/number_pipe/number_pipe_example.ts region='PercentPipe'}
 */
var PercentPipe = (function (_super) {
    __extends(PercentPipe, _super);
    function PercentPipe() {
        _super.apply(this, arguments);
    }
    PercentPipe.prototype.transform = function (value, args) {
        var digits = collection_1.ListWrapper.first(args);
        return NumberPipe._format(value, intl_1.NumberFormatStyle.Percent, digits);
    };
    PercentPipe = __decorate([
        lang_1.CONST(),
        core_1.Pipe({ name: 'percent' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], PercentPipe);
    return PercentPipe;
}(NumberPipe));
exports.PercentPipe = PercentPipe;
/**
 * WARNING: this pipe uses the Internationalization API.
 * Therefore it is only reliable in Chrome and Opera browsers.
 *
 * Formats a number as local currency.
 *
 * ### Usage
 *
 *     expression | currency[:currencyCode[:symbolDisplay[:digitInfo]]]
 *
 * where `currencyCode` is the ISO 4217 currency code, such as "USD" for the US dollar and
 * "EUR" for the euro. `symbolDisplay` is a boolean indicating whether to use the currency
 * symbol (e.g. $) or the currency code (e.g. USD) in the output. The default for this value
 * is `false`.
 * For more information about `digitInfo` see {@link DecimalPipe}
 *
 * ### Example
 *
 * {@example core/pipes/ts/number_pipe/number_pipe_example.ts region='CurrencyPipe'}
 */
var CurrencyPipe = (function (_super) {
    __extends(CurrencyPipe, _super);
    function CurrencyPipe() {
        _super.apply(this, arguments);
    }
    CurrencyPipe.prototype.transform = function (value, args) {
        var currencyCode = lang_1.isPresent(args) && args.length > 0 ? args[0] : 'USD';
        var symbolDisplay = lang_1.isPresent(args) && args.length > 1 ? args[1] : false;
        var digits = lang_1.isPresent(args) && args.length > 2 ? args[2] : null;
        return NumberPipe._format(value, intl_1.NumberFormatStyle.Currency, digits, currencyCode, symbolDisplay);
    };
    CurrencyPipe = __decorate([
        lang_1.CONST(),
        core_1.Pipe({ name: 'currency' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], CurrencyPipe);
    return CurrencyPipe;
}(NumberPipe));
exports.CurrencyPipe = CurrencyPipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyX3BpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvY29tbW9uL3BpcGVzL251bWJlcl9waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFCQVNPLDBCQUEwQixDQUFDLENBQUE7QUFDbEMsMkJBQThDLGdDQUFnQyxDQUFDLENBQUE7QUFDL0UscUJBQWlELDBCQUEwQixDQUFDLENBQUE7QUFDNUUscUJBQTRELGVBQWUsQ0FBQyxDQUFBO0FBQzVFLDJCQUEwQixnQ0FBZ0MsQ0FBQyxDQUFBO0FBRTNELGdEQUEyQyxtQ0FBbUMsQ0FBQyxDQUFBO0FBRS9FLElBQUksYUFBYSxHQUFXLE9BQU8sQ0FBQztBQUNwQyxJQUFJLEdBQUcsR0FBRyxvQkFBYSxDQUFDLE1BQU0sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBRXBFOztHQUVHO0FBR0g7SUFBQTtJQWdDQSxDQUFDO0lBL0JDLGdCQUFnQjtJQUNULGtCQUFPLEdBQWQsVUFBZSxLQUFhLEVBQUUsS0FBd0IsRUFBRSxNQUFjLEVBQUUsUUFBdUIsRUFDaEYsZ0JBQWlDO1FBRHdCLHdCQUF1QixHQUF2QixlQUF1QjtRQUNoRixnQ0FBaUMsR0FBakMsd0JBQWlDO1FBQzlDLEVBQUUsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sSUFBSSw4REFBNEIsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUNELElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDakQs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QUxELENBQWlDLFVBQVUsR0FLMUM7QUFMWSxtQkFBVyxjQUt2QixDQUFBO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFJSDtJQUFrQyxnQ0FBVTtJQUE1QztRQUFrQyw4QkFBVTtJQVE1QyxDQUFDO0lBUEMsZ0NBQVMsR0FBVCxVQUFVLEtBQVUsRUFBRSxJQUFXO1FBQy9CLElBQUksWUFBWSxHQUFXLGdCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNoRixJQUFJLGFBQWEsR0FBWSxnQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDbEYsSUFBSSxNQUFNLEdBQVcsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSx3QkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFDdkQsYUFBYSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQVZIO1FBQUMsWUFBSyxFQUFFO1FBQ1AsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBQyxDQUFDO1FBQ3hCLGlCQUFVLEVBQUU7O29CQUFBO0lBU2IsbUJBQUM7QUFBRCxDQUFDLEFBUkQsQ0FBa0MsVUFBVSxHQVEzQztBQVJZLG9CQUFZLGVBUXhCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBpc051bWJlcixcbiAgaXNQcmVzZW50LFxuICBpc0JsYW5rLFxuICBTdHJpbmdXcmFwcGVyLFxuICBOdW1iZXJXcmFwcGVyLFxuICBSZWdFeHBXcmFwcGVyLFxuICBDT05TVCxcbiAgRnVuY3Rpb25XcmFwcGVyXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge051bWJlckZvcm1hdHRlciwgTnVtYmVyRm9ybWF0U3R5bGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvaW50bCc7XG5pbXBvcnQge0luamVjdGFibGUsIFBpcGVUcmFuc2Zvcm0sIFdyYXBwZWRWYWx1ZSwgUGlwZX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge0xpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge0ludmFsaWRQaXBlQXJndW1lbnRFeGNlcHRpb259IGZyb20gJy4vaW52YWxpZF9waXBlX2FyZ3VtZW50X2V4Y2VwdGlvbic7XG5cbnZhciBkZWZhdWx0TG9jYWxlOiBzdHJpbmcgPSAnZW4tVVMnO1xudmFyIF9yZSA9IFJlZ0V4cFdyYXBwZXIuY3JlYXRlKCdeKFxcXFxkKyk/XFxcXC4oKFxcXFxkKykoXFxcXC0oXFxcXGQrKSk/KT8kJyk7XG5cbi8qKlxuICogSW50ZXJuYWwgYmFzZSBjbGFzcyBmb3IgbnVtZXJpYyBwaXBlcy5cbiAqL1xuQENPTlNUKClcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOdW1iZXJQaXBlIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBzdGF0aWMgX2Zvcm1hdCh2YWx1ZTogbnVtYmVyLCBzdHlsZTogTnVtYmVyRm9ybWF0U3R5bGUsIGRpZ2l0czogc3RyaW5nLCBjdXJyZW5jeTogc3RyaW5nID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgY3VycmVuY3lBc1N5bWJvbDogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICBpZiAoaXNCbGFuayh2YWx1ZSkpIHJldHVybiBudWxsO1xuICAgIGlmICghaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbihOdW1iZXJQaXBlLCB2YWx1ZSk7XG4gICAgfVxuICAgIHZhciBtaW5JbnQgPSAxLCBtaW5GcmFjdGlvbiA9IDAsIG1heEZyYWN0aW9uID0gMztcbiAgICBpZiAoaXNQcmVzZW50KGRpZ2l0cykpIHtcbiAgICAgIHZhciBwYXJ0cyA9IFJlZ0V4cFdyYXBwZXIuZmlyc3RNYXRjaChfcmUsIGRpZ2l0cyk7XG4gICAgICBpZiAoaXNCbGFuayhwYXJ0cykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYCR7ZGlnaXRzfSBpcyBub3QgYSB2YWxpZCBkaWdpdCBpbmZvIGZvciBudW1iZXIgcGlwZXNgKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1ByZXNlbnQocGFydHNbMV0pKSB7ICAvLyBtaW4gaW50ZWdlciBkaWdpdHNcbiAgICAgICAgbWluSW50ID0gTnVtYmVyV3JhcHBlci5wYXJzZUludEF1dG9SYWRpeChwYXJ0c1sxXSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNQcmVzZW50KHBhcnRzWzNdKSkgeyAgLy8gbWluIGZyYWN0aW9uIGRpZ2l0c1xuICAgICAgICBtaW5GcmFjdGlvbiA9IE51bWJlcldyYXBwZXIucGFyc2VJbnRBdXRvUmFkaXgocGFydHNbM10pO1xuICAgICAgfVxuICAgICAgaWYgKGlzUHJlc2VudChwYXJ0c1s1XSkpIHsgIC8vIG1heCBmcmFjdGlvbiBkaWdpdHNcbiAgICAgICAgbWF4RnJhY3Rpb24gPSBOdW1iZXJXcmFwcGVyLnBhcnNlSW50QXV0b1JhZGl4KHBhcnRzWzVdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIE51bWJlckZvcm1hdHRlci5mb3JtYXQodmFsdWUsIGRlZmF1bHRMb2NhbGUsIHN0eWxlLCB7XG4gICAgICBtaW5pbXVtSW50ZWdlckRpZ2l0czogbWluSW50LFxuICAgICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiBtaW5GcmFjdGlvbixcbiAgICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogbWF4RnJhY3Rpb24sXG4gICAgICBjdXJyZW5jeTogY3VycmVuY3ksXG4gICAgICBjdXJyZW5jeUFzU3ltYm9sOiBjdXJyZW5jeUFzU3ltYm9sXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXQVJOSU5HOiB0aGlzIHBpcGUgdXNlcyB0aGUgSW50ZXJuYXRpb25hbGl6YXRpb24gQVBJLlxuICogVGhlcmVmb3JlIGl0IGlzIG9ubHkgcmVsaWFibGUgaW4gQ2hyb21lIGFuZCBPcGVyYSBicm93c2Vycy5cbiAqXG4gKiBGb3JtYXRzIGEgbnVtYmVyIGFzIGxvY2FsIHRleHQuIGkuZS4gZ3JvdXAgc2l6aW5nIGFuZCBzZXBhcmF0b3IgYW5kIG90aGVyIGxvY2FsZS1zcGVjaWZpY1xuICogY29uZmlndXJhdGlvbnMgYXJlIGJhc2VkIG9uIHRoZSBhY3RpdmUgbG9jYWxlLlxuICpcbiAqICMjIyBVc2FnZVxuICpcbiAqICAgICBleHByZXNzaW9uIHwgbnVtYmVyWzpkaWdpdEluZm9dXG4gKlxuICogd2hlcmUgYGV4cHJlc3Npb25gIGlzIGEgbnVtYmVyIGFuZCBgZGlnaXRJbmZvYCBoYXMgdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gKlxuICogICAgIHttaW5JbnRlZ2VyRGlnaXRzfS57bWluRnJhY3Rpb25EaWdpdHN9LXttYXhGcmFjdGlvbkRpZ2l0c31cbiAqXG4gKiAtIG1pbkludGVnZXJEaWdpdHMgaXMgdGhlIG1pbmltdW0gbnVtYmVyIG9mIGludGVnZXIgZGlnaXRzIHRvIHVzZS4gRGVmYXVsdHMgdG8gMS5cbiAqIC0gbWluRnJhY3Rpb25EaWdpdHMgaXMgdGhlIG1pbmltdW0gbnVtYmVyIG9mIGRpZ2l0cyBhZnRlciBmcmFjdGlvbi4gRGVmYXVsdHMgdG8gMC5cbiAqIC0gbWF4RnJhY3Rpb25EaWdpdHMgaXMgdGhlIG1heGltdW0gbnVtYmVyIG9mIGRpZ2l0cyBhZnRlciBmcmFjdGlvbi4gRGVmYXVsdHMgdG8gMy5cbiAqXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiB0aGUgYWNjZXB0YWJsZSByYW5nZSBmb3IgZWFjaCBvZiB0aGVzZSBudW1iZXJzIGFuZCBvdGhlclxuICogZGV0YWlscyBzZWUgeW91ciBuYXRpdmUgaW50ZXJuYXRpb25hbGl6YXRpb24gbGlicmFyeS5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIHtAZXhhbXBsZSBjb3JlL3BpcGVzL3RzL251bWJlcl9waXBlL251bWJlcl9waXBlX2V4YW1wbGUudHMgcmVnaW9uPSdOdW1iZXJQaXBlJ31cbiAqL1xuQENPTlNUKClcbkBQaXBlKHtuYW1lOiAnbnVtYmVyJ30pXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVjaW1hbFBpcGUgZXh0ZW5kcyBOdW1iZXJQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBhcmdzOiBhbnlbXSk6IHN0cmluZyB7XG4gICAgdmFyIGRpZ2l0czogc3RyaW5nID0gTGlzdFdyYXBwZXIuZmlyc3QoYXJncyk7XG4gICAgcmV0dXJuIE51bWJlclBpcGUuX2Zvcm1hdCh2YWx1ZSwgTnVtYmVyRm9ybWF0U3R5bGUuRGVjaW1hbCwgZGlnaXRzKTtcbiAgfVxufVxuXG4vKipcbiAqIFdBUk5JTkc6IHRoaXMgcGlwZSB1c2VzIHRoZSBJbnRlcm5hdGlvbmFsaXphdGlvbiBBUEkuXG4gKiBUaGVyZWZvcmUgaXQgaXMgb25seSByZWxpYWJsZSBpbiBDaHJvbWUgYW5kIE9wZXJhIGJyb3dzZXJzLlxuICpcbiAqIEZvcm1hdHMgYSBudW1iZXIgYXMgbG9jYWwgcGVyY2VudC5cbiAqXG4gKiAjIyMgVXNhZ2VcbiAqXG4gKiAgICAgZXhwcmVzc2lvbiB8IHBlcmNlbnRbOmRpZ2l0SW5mb11cbiAqXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBgZGlnaXRJbmZvYCBzZWUge0BsaW5rIERlY2ltYWxQaXBlfVxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICoge0BleGFtcGxlIGNvcmUvcGlwZXMvdHMvbnVtYmVyX3BpcGUvbnVtYmVyX3BpcGVfZXhhbXBsZS50cyByZWdpb249J1BlcmNlbnRQaXBlJ31cbiAqL1xuQENPTlNUKClcbkBQaXBlKHtuYW1lOiAncGVyY2VudCd9KVxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBlcmNlbnRQaXBlIGV4dGVuZHMgTnVtYmVyUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWU6IGFueSwgYXJnczogYW55W10pOiBzdHJpbmcge1xuICAgIHZhciBkaWdpdHM6IHN0cmluZyA9IExpc3RXcmFwcGVyLmZpcnN0KGFyZ3MpO1xuICAgIHJldHVybiBOdW1iZXJQaXBlLl9mb3JtYXQodmFsdWUsIE51bWJlckZvcm1hdFN0eWxlLlBlcmNlbnQsIGRpZ2l0cyk7XG4gIH1cbn1cblxuLyoqXG4gKiBXQVJOSU5HOiB0aGlzIHBpcGUgdXNlcyB0aGUgSW50ZXJuYXRpb25hbGl6YXRpb24gQVBJLlxuICogVGhlcmVmb3JlIGl0IGlzIG9ubHkgcmVsaWFibGUgaW4gQ2hyb21lIGFuZCBPcGVyYSBicm93c2Vycy5cbiAqXG4gKiBGb3JtYXRzIGEgbnVtYmVyIGFzIGxvY2FsIGN1cnJlbmN5LlxuICpcbiAqICMjIyBVc2FnZVxuICpcbiAqICAgICBleHByZXNzaW9uIHwgY3VycmVuY3lbOmN1cnJlbmN5Q29kZVs6c3ltYm9sRGlzcGxheVs6ZGlnaXRJbmZvXV1dXG4gKlxuICogd2hlcmUgYGN1cnJlbmN5Q29kZWAgaXMgdGhlIElTTyA0MjE3IGN1cnJlbmN5IGNvZGUsIHN1Y2ggYXMgXCJVU0RcIiBmb3IgdGhlIFVTIGRvbGxhciBhbmRcbiAqIFwiRVVSXCIgZm9yIHRoZSBldXJvLiBgc3ltYm9sRGlzcGxheWAgaXMgYSBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0byB1c2UgdGhlIGN1cnJlbmN5XG4gKiBzeW1ib2wgKGUuZy4gJCkgb3IgdGhlIGN1cnJlbmN5IGNvZGUgKGUuZy4gVVNEKSBpbiB0aGUgb3V0cHV0LiBUaGUgZGVmYXVsdCBmb3IgdGhpcyB2YWx1ZVxuICogaXMgYGZhbHNlYC5cbiAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGBkaWdpdEluZm9gIHNlZSB7QGxpbmsgRGVjaW1hbFBpcGV9XG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiB7QGV4YW1wbGUgY29yZS9waXBlcy90cy9udW1iZXJfcGlwZS9udW1iZXJfcGlwZV9leGFtcGxlLnRzIHJlZ2lvbj0nQ3VycmVuY3lQaXBlJ31cbiAqL1xuQENPTlNUKClcbkBQaXBlKHtuYW1lOiAnY3VycmVuY3knfSlcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDdXJyZW5jeVBpcGUgZXh0ZW5kcyBOdW1iZXJQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBhcmdzOiBhbnlbXSk6IHN0cmluZyB7XG4gICAgdmFyIGN1cnJlbmN5Q29kZTogc3RyaW5nID0gaXNQcmVzZW50KGFyZ3MpICYmIGFyZ3MubGVuZ3RoID4gMCA/IGFyZ3NbMF0gOiAnVVNEJztcbiAgICB2YXIgc3ltYm9sRGlzcGxheTogYm9vbGVhbiA9IGlzUHJlc2VudChhcmdzKSAmJiBhcmdzLmxlbmd0aCA+IDEgPyBhcmdzWzFdIDogZmFsc2U7XG4gICAgdmFyIGRpZ2l0czogc3RyaW5nID0gaXNQcmVzZW50KGFyZ3MpICYmIGFyZ3MubGVuZ3RoID4gMiA/IGFyZ3NbMl0gOiBudWxsO1xuICAgIHJldHVybiBOdW1iZXJQaXBlLl9mb3JtYXQodmFsdWUsIE51bWJlckZvcm1hdFN0eWxlLkN1cnJlbmN5LCBkaWdpdHMsIGN1cnJlbmN5Q29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN5bWJvbERpc3BsYXkpO1xuICB9XG59XG4iXX0=