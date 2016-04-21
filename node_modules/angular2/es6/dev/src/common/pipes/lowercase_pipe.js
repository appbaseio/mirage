var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { isString, CONST, isBlank } from 'angular2/src/facade/lang';
import { Injectable, Pipe } from 'angular2/core';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
/**
 * Transforms text to lowercase.
 *
 * ### Example
 *
 * {@example core/pipes/ts/lowerupper_pipe/lowerupper_pipe_example.ts region='LowerUpperPipe'}
 */
let LowerCasePipe_1;
export let LowerCasePipe = LowerCasePipe_1 = class LowerCasePipe {
    transform(value, args = null) {
        if (isBlank(value))
            return value;
        if (!isString(value)) {
            throw new InvalidPipeArgumentException(LowerCasePipe_1, value);
        }
        return value.toLowerCase();
    }
};
LowerCasePipe = LowerCasePipe_1 = __decorate([
    CONST(),
    Pipe({ name: 'lowercase' }),
    Injectable(), 
    __metadata('design:paramtypes', [])
], LowerCasePipe);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93ZXJjYXNlX3BpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvY29tbW9uL3BpcGVzL2xvd2VyY2FzZV9waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUMsTUFBTSwwQkFBMEI7T0FDMUQsRUFBQyxVQUFVLEVBQStCLElBQUksRUFBQyxNQUFNLGVBQWU7T0FDcEUsRUFBQyw0QkFBNEIsRUFBQyxNQUFNLG1DQUFtQztBQUU5RTs7Ozs7O0dBTUc7QUFJSDs7SUFDRSxTQUFTLENBQUMsS0FBYSxFQUFFLElBQUksR0FBVSxJQUFJO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sSUFBSSw0QkFBNEIsQ0FBQyxlQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDN0IsQ0FBQztBQUNILENBQUM7QUFYRDtJQUFDLEtBQUssRUFBRTtJQUNQLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUMsQ0FBQztJQUN6QixVQUFVLEVBQUU7O2lCQUFBO0FBU1oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzU3RyaW5nLCBDT05TVCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7SW5qZWN0YWJsZSwgUGlwZVRyYW5zZm9ybSwgV3JhcHBlZFZhbHVlLCBQaXBlfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7SW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbn0gZnJvbSAnLi9pbnZhbGlkX3BpcGVfYXJndW1lbnRfZXhjZXB0aW9uJztcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRleHQgdG8gbG93ZXJjYXNlLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICoge0BleGFtcGxlIGNvcmUvcGlwZXMvdHMvbG93ZXJ1cHBlcl9waXBlL2xvd2VydXBwZXJfcGlwZV9leGFtcGxlLnRzIHJlZ2lvbj0nTG93ZXJVcHBlclBpcGUnfVxuICovXG5AQ09OU1QoKVxuQFBpcGUoe25hbWU6ICdsb3dlcmNhc2UnfSlcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMb3dlckNhc2VQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybSh2YWx1ZTogc3RyaW5nLCBhcmdzOiBhbnlbXSA9IG51bGwpOiBzdHJpbmcge1xuICAgIGlmIChpc0JsYW5rKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuICAgIGlmICghaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbihMb3dlckNhc2VQaXBlLCB2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICB9XG59XG4iXX0=