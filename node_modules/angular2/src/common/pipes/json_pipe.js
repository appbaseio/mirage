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
/**
 * Transforms any input value using `JSON.stringify`. Useful for debugging.
 *
 * ### Example
 * {@example core/pipes/ts/json_pipe/json_pipe_example.ts region='JsonPipe'}
 */
var JsonPipe = (function () {
    function JsonPipe() {
    }
    JsonPipe.prototype.transform = function (value, args) {
        if (args === void 0) { args = null; }
        return lang_1.Json.stringify(value);
    };
    JsonPipe = __decorate([
        lang_1.CONST(),
        core_1.Pipe({ name: 'json', pure: false }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], JsonPipe);
    return JsonPipe;
}());
exports.JsonPipe = JsonPipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbl9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2NvbW1vbi9waXBlcy9qc29uX3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUE4QywwQkFBMEIsQ0FBQyxDQUFBO0FBQ3pFLHFCQUE0RCxlQUFlLENBQUMsQ0FBQTtBQUU1RTs7Ozs7R0FLRztBQUlIO0lBQUE7SUFFQSxDQUFDO0lBREMsNEJBQVMsR0FBVCxVQUFVLEtBQVUsRUFBRSxJQUFrQjtRQUFsQixvQkFBa0IsR0FBbEIsV0FBa0I7UUFBWSxNQUFNLENBQUMsV0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUFDLENBQUM7SUFKckY7UUFBQyxZQUFLLEVBQUU7UUFDUCxXQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUNqQyxpQkFBVSxFQUFFOztnQkFBQTtJQUdiLGVBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLGdCQUFRLFdBRXBCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQmxhbmssIGlzUHJlc2VudCwgSnNvbiwgQ09OU1R9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0luamVjdGFibGUsIFBpcGVUcmFuc2Zvcm0sIFdyYXBwZWRWYWx1ZSwgUGlwZX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5cbi8qKlxuICogVHJhbnNmb3JtcyBhbnkgaW5wdXQgdmFsdWUgdXNpbmcgYEpTT04uc3RyaW5naWZ5YC4gVXNlZnVsIGZvciBkZWJ1Z2dpbmcuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqIHtAZXhhbXBsZSBjb3JlL3BpcGVzL3RzL2pzb25fcGlwZS9qc29uX3BpcGVfZXhhbXBsZS50cyByZWdpb249J0pzb25QaXBlJ31cbiAqL1xuQENPTlNUKClcbkBQaXBlKHtuYW1lOiAnanNvbicsIHB1cmU6IGZhbHNlfSlcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBKc29uUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWU6IGFueSwgYXJnczogYW55W10gPSBudWxsKTogc3RyaW5nIHsgcmV0dXJuIEpzb24uc3RyaW5naWZ5KHZhbHVlKTsgfVxufVxuIl19