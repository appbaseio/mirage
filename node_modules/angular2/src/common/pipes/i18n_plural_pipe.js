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
var core_1 = require('angular2/core');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var interpolationExp = lang_1.RegExpWrapper.create('#');
/**
 *
 *  Maps a value to a string that pluralizes the value properly.
 *
 *  ## Usage
 *
 *  expression | i18nPlural:mapping
 *
 *  where `expression` is a number and `mapping` is an object that indicates the proper text for
 *  when the `expression` evaluates to 0, 1, or some other number.  You can interpolate the actual
 *  value into the text using the `#` sign.
 *
 *  ## Example
 *
 *  ```
 *  <div>
 *    {{ messages.length | i18nPlural: messageMapping }}
 *  </div>
 *
 *  class MyApp {
 *    messages: any[];
 *    messageMapping: any = {
 *      '=0': 'No messages.',
 *      '=1': 'One message.',
 *      'other': '# messages.'
 *    }
 *    ...
 *  }
 *  ```
 *
 */
var I18nPluralPipe = (function () {
    function I18nPluralPipe() {
    }
    I18nPluralPipe.prototype.transform = function (value, args) {
        if (args === void 0) { args = null; }
        var key;
        var valueStr;
        var pluralMap = (args[0]);
        if (!lang_1.isStringMap(pluralMap)) {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(I18nPluralPipe, pluralMap);
        }
        key = value === 0 || value === 1 ? "=" + value : 'other';
        valueStr = lang_1.isPresent(value) ? value.toString() : '';
        return lang_1.StringWrapper.replaceAll(pluralMap[key], interpolationExp, valueStr);
    };
    I18nPluralPipe = __decorate([
        lang_1.CONST(),
        core_1.Pipe({ name: 'i18nPlural', pure: true }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], I18nPluralPipe);
    return I18nPluralPipe;
}());
exports.I18nPluralPipe = I18nPluralPipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9wbHVyYWxfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vcGlwZXMvaTE4bl9wbHVyYWxfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBTU8sMEJBQTBCLENBQUMsQ0FBQTtBQUNsQyxxQkFBOEMsZUFBZSxDQUFDLENBQUE7QUFDOUQsZ0RBQTJDLG1DQUFtQyxDQUFDLENBQUE7QUFFL0UsSUFBSSxnQkFBZ0IsR0FBVyxvQkFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV6RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOEJHO0FBSUg7SUFBQTtJQWVBLENBQUM7SUFkQyxrQ0FBUyxHQUFULFVBQVUsS0FBYSxFQUFFLElBQWtCO1FBQWxCLG9CQUFrQixHQUFsQixXQUFrQjtRQUN6QyxJQUFJLEdBQVcsQ0FBQztRQUNoQixJQUFJLFFBQWdCLENBQUM7UUFDckIsSUFBSSxTQUFTLEdBQXlELENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxrQkFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixNQUFNLElBQUksOERBQTRCLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFFRCxHQUFHLEdBQUcsS0FBSyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxHQUFHLE1BQUksS0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN6RCxRQUFRLEdBQUcsZ0JBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBRXBELE1BQU0sQ0FBQyxvQkFBYSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQWpCSDtRQUFDLFlBQUssRUFBRTtRQUNQLFdBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3RDLGlCQUFVLEVBQUU7O3NCQUFBO0lBZ0JiLHFCQUFDO0FBQUQsQ0FBQyxBQWZELElBZUM7QUFmWSxzQkFBYyxpQkFlMUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENPTlNULFxuICBpc1N0cmluZ01hcCxcbiAgU3RyaW5nV3JhcHBlcixcbiAgaXNQcmVzZW50LFxuICBSZWdFeHBXcmFwcGVyXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0luamVjdGFibGUsIFBpcGVUcmFuc2Zvcm0sIFBpcGV9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtJbnZhbGlkUGlwZUFyZ3VtZW50RXhjZXB0aW9ufSBmcm9tICcuL2ludmFsaWRfcGlwZV9hcmd1bWVudF9leGNlcHRpb24nO1xuXG52YXIgaW50ZXJwb2xhdGlvbkV4cDogUmVnRXhwID0gUmVnRXhwV3JhcHBlci5jcmVhdGUoJyMnKTtcblxuLyoqXG4gKlxuICogIE1hcHMgYSB2YWx1ZSB0byBhIHN0cmluZyB0aGF0IHBsdXJhbGl6ZXMgdGhlIHZhbHVlIHByb3Blcmx5LlxuICpcbiAqICAjIyBVc2FnZVxuICpcbiAqICBleHByZXNzaW9uIHwgaTE4blBsdXJhbDptYXBwaW5nXG4gKlxuICogIHdoZXJlIGBleHByZXNzaW9uYCBpcyBhIG51bWJlciBhbmQgYG1hcHBpbmdgIGlzIGFuIG9iamVjdCB0aGF0IGluZGljYXRlcyB0aGUgcHJvcGVyIHRleHQgZm9yXG4gKiAgd2hlbiB0aGUgYGV4cHJlc3Npb25gIGV2YWx1YXRlcyB0byAwLCAxLCBvciBzb21lIG90aGVyIG51bWJlci4gIFlvdSBjYW4gaW50ZXJwb2xhdGUgdGhlIGFjdHVhbFxuICogIHZhbHVlIGludG8gdGhlIHRleHQgdXNpbmcgdGhlIGAjYCBzaWduLlxuICpcbiAqICAjIyBFeGFtcGxlXG4gKlxuICogIGBgYFxuICogIDxkaXY+XG4gKiAgICB7eyBtZXNzYWdlcy5sZW5ndGggfCBpMThuUGx1cmFsOiBtZXNzYWdlTWFwcGluZyB9fVxuICogIDwvZGl2PlxuICpcbiAqICBjbGFzcyBNeUFwcCB7XG4gKiAgICBtZXNzYWdlczogYW55W107XG4gKiAgICBtZXNzYWdlTWFwcGluZzogYW55ID0ge1xuICogICAgICAnPTAnOiAnTm8gbWVzc2FnZXMuJyxcbiAqICAgICAgJz0xJzogJ09uZSBtZXNzYWdlLicsXG4gKiAgICAgICdvdGhlcic6ICcjIG1lc3NhZ2VzLidcbiAqICAgIH1cbiAqICAgIC4uLlxuICogIH1cbiAqICBgYGBcbiAqXG4gKi9cbkBDT05TVCgpXG5AUGlwZSh7bmFtZTogJ2kxOG5QbHVyYWwnLCBwdXJlOiB0cnVlfSlcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJMThuUGx1cmFsUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWU6IG51bWJlciwgYXJnczogYW55W10gPSBudWxsKTogc3RyaW5nIHtcbiAgICB2YXIga2V5OiBzdHJpbmc7XG4gICAgdmFyIHZhbHVlU3RyOiBzdHJpbmc7XG4gICAgdmFyIHBsdXJhbE1hcDoge1tjb3VudDogc3RyaW5nXTogc3RyaW5nfSA9IDx7W2NvdW50OiBzdHJpbmddOiBzdHJpbmd9PihhcmdzWzBdKTtcblxuICAgIGlmICghaXNTdHJpbmdNYXAocGx1cmFsTWFwKSkge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRQaXBlQXJndW1lbnRFeGNlcHRpb24oSTE4blBsdXJhbFBpcGUsIHBsdXJhbE1hcCk7XG4gICAgfVxuXG4gICAga2V5ID0gdmFsdWUgPT09IDAgfHwgdmFsdWUgPT09IDEgPyBgPSR7dmFsdWV9YCA6ICdvdGhlcic7XG4gICAgdmFsdWVTdHIgPSBpc1ByZXNlbnQodmFsdWUpID8gdmFsdWUudG9TdHJpbmcoKSA6ICcnO1xuXG4gICAgcmV0dXJuIFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbChwbHVyYWxNYXBba2V5XSwgaW50ZXJwb2xhdGlvbkV4cCwgdmFsdWVTdHIpO1xuICB9XG59XG4iXX0=