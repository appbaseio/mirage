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
var collection_1 = require('angular2/src/facade/collection');
var core_1 = require('angular2/core');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
/**
 *
 *  Generic selector that displays the string that matches the current value.
 *
 *  ## Usage
 *
 *  expression | i18nSelect:mapping
 *
 *  where `mapping` is an object that indicates the text that should be displayed
 *  for different values of the provided `expression`.
 *
 *  ## Example
 *
 *  ```
 *  <div>
 *    {{ gender | i18nSelect: inviteMap }}
 *  </div>
 *
 *  class MyApp {
 *    gender: string = 'male';
 *    inviteMap: any = {
 *      'male': 'Invite her.',
 *      'female': 'Invite him.',
 *      'other': 'Invite them.'
 *    }
 *    ...
 *  }
 *  ```
 */
var I18nSelectPipe = (function () {
    function I18nSelectPipe() {
    }
    I18nSelectPipe.prototype.transform = function (value, args) {
        if (args === void 0) { args = null; }
        var mapping = (args[0]);
        if (!lang_1.isStringMap(mapping)) {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(I18nSelectPipe, mapping);
        }
        return collection_1.StringMapWrapper.contains(mapping, value) ? mapping[value] : mapping['other'];
    };
    I18nSelectPipe = __decorate([
        lang_1.CONST(),
        core_1.Pipe({ name: 'i18nSelect', pure: true }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], I18nSelectPipe);
    return I18nSelectPipe;
}());
exports.I18nSelectPipe = I18nSelectPipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9zZWxlY3RfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vcGlwZXMvaTE4bl9zZWxlY3RfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQWlDLDBCQUEwQixDQUFDLENBQUE7QUFDNUQsMkJBQStCLGdDQUFnQyxDQUFDLENBQUE7QUFDaEUscUJBQThDLGVBQWUsQ0FBQyxDQUFBO0FBQzlELGdEQUEyQyxtQ0FBbUMsQ0FBQyxDQUFBO0FBRS9FOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBSUg7SUFBQTtJQVNBLENBQUM7SUFSQyxrQ0FBUyxHQUFULFVBQVUsS0FBYSxFQUFFLElBQWtCO1FBQWxCLG9CQUFrQixHQUFsQixXQUFrQjtRQUN6QyxJQUFJLE9BQU8sR0FBdUQsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sSUFBSSw4REFBNEIsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEUsQ0FBQztRQUVELE1BQU0sQ0FBQyw2QkFBZ0IsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQVhIO1FBQUMsWUFBSyxFQUFFO1FBQ1AsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDdEMsaUJBQVUsRUFBRTs7c0JBQUE7SUFVYixxQkFBQztBQUFELENBQUMsQUFURCxJQVNDO0FBVFksc0JBQWMsaUJBUzFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NPTlNULCBpc1N0cmluZ01hcH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7U3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7SW5qZWN0YWJsZSwgUGlwZVRyYW5zZm9ybSwgUGlwZX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge0ludmFsaWRQaXBlQXJndW1lbnRFeGNlcHRpb259IGZyb20gJy4vaW52YWxpZF9waXBlX2FyZ3VtZW50X2V4Y2VwdGlvbic7XG5cbi8qKlxuICpcbiAqICBHZW5lcmljIHNlbGVjdG9yIHRoYXQgZGlzcGxheXMgdGhlIHN0cmluZyB0aGF0IG1hdGNoZXMgdGhlIGN1cnJlbnQgdmFsdWUuXG4gKlxuICogICMjIFVzYWdlXG4gKlxuICogIGV4cHJlc3Npb24gfCBpMThuU2VsZWN0Om1hcHBpbmdcbiAqXG4gKiAgd2hlcmUgYG1hcHBpbmdgIGlzIGFuIG9iamVjdCB0aGF0IGluZGljYXRlcyB0aGUgdGV4dCB0aGF0IHNob3VsZCBiZSBkaXNwbGF5ZWRcbiAqICBmb3IgZGlmZmVyZW50IHZhbHVlcyBvZiB0aGUgcHJvdmlkZWQgYGV4cHJlc3Npb25gLlxuICpcbiAqICAjIyBFeGFtcGxlXG4gKlxuICogIGBgYFxuICogIDxkaXY+XG4gKiAgICB7eyBnZW5kZXIgfCBpMThuU2VsZWN0OiBpbnZpdGVNYXAgfX1cbiAqICA8L2Rpdj5cbiAqXG4gKiAgY2xhc3MgTXlBcHAge1xuICogICAgZ2VuZGVyOiBzdHJpbmcgPSAnbWFsZSc7XG4gKiAgICBpbnZpdGVNYXA6IGFueSA9IHtcbiAqICAgICAgJ21hbGUnOiAnSW52aXRlIGhlci4nLFxuICogICAgICAnZmVtYWxlJzogJ0ludml0ZSBoaW0uJyxcbiAqICAgICAgJ290aGVyJzogJ0ludml0ZSB0aGVtLidcbiAqICAgIH1cbiAqICAgIC4uLlxuICogIH1cbiAqICBgYGBcbiAqL1xuQENPTlNUKClcbkBQaXBlKHtuYW1lOiAnaTE4blNlbGVjdCcsIHB1cmU6IHRydWV9KVxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEkxOG5TZWxlY3RQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybSh2YWx1ZTogc3RyaW5nLCBhcmdzOiBhbnlbXSA9IG51bGwpOiBzdHJpbmcge1xuICAgIHZhciBtYXBwaW5nOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IDx7W2NvdW50OiBzdHJpbmddOiBzdHJpbmd9PihhcmdzWzBdKTtcbiAgICBpZiAoIWlzU3RyaW5nTWFwKG1hcHBpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbihJMThuU2VsZWN0UGlwZSwgbWFwcGluZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmluZ01hcFdyYXBwZXIuY29udGFpbnMobWFwcGluZywgdmFsdWUpID8gbWFwcGluZ1t2YWx1ZV0gOiBtYXBwaW5nWydvdGhlciddO1xuICB9XG59XG4iXX0=