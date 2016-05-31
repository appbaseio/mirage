var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CONST, isStringMap } from 'angular2/src/facade/lang';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { Injectable, Pipe } from 'angular2/core';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
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
let I18nSelectPipe_1;
export let I18nSelectPipe = I18nSelectPipe_1 = class I18nSelectPipe {
    transform(value, args = null) {
        var mapping = (args[0]);
        if (!isStringMap(mapping)) {
            throw new InvalidPipeArgumentException(I18nSelectPipe_1, mapping);
        }
        return StringMapWrapper.contains(mapping, value) ? mapping[value] : mapping['other'];
    }
};
I18nSelectPipe = I18nSelectPipe_1 = __decorate([
    CONST(),
    Pipe({ name: 'i18nSelect', pure: true }),
    Injectable(), 
    __metadata('design:paramtypes', [])
], I18nSelectPipe);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9zZWxlY3RfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vcGlwZXMvaTE4bl9zZWxlY3RfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLEtBQUssRUFBRSxXQUFXLEVBQUMsTUFBTSwwQkFBMEI7T0FDcEQsRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQztPQUN4RCxFQUFDLFVBQVUsRUFBaUIsSUFBSSxFQUFDLE1BQU0sZUFBZTtPQUN0RCxFQUFDLDRCQUE0QixFQUFDLE1BQU0sbUNBQW1DO0FBRTlFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBSUg7O0lBQ0UsU0FBUyxDQUFDLEtBQWEsRUFBRSxJQUFJLEdBQVUsSUFBSTtRQUN6QyxJQUFJLE9BQU8sR0FBdUQsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxJQUFJLDRCQUE0QixDQUFDLGdCQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEUsQ0FBQztRQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkYsQ0FBQztBQUNILENBQUM7QUFaRDtJQUFDLEtBQUssRUFBRTtJQUNQLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO0lBQ3RDLFVBQVUsRUFBRTs7a0JBQUE7QUFVWiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q09OU1QsIGlzU3RyaW5nTWFwfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtJbmplY3RhYmxlLCBQaXBlVHJhbnNmb3JtLCBQaXBlfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7SW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbn0gZnJvbSAnLi9pbnZhbGlkX3BpcGVfYXJndW1lbnRfZXhjZXB0aW9uJztcblxuLyoqXG4gKlxuICogIEdlbmVyaWMgc2VsZWN0b3IgdGhhdCBkaXNwbGF5cyB0aGUgc3RyaW5nIHRoYXQgbWF0Y2hlcyB0aGUgY3VycmVudCB2YWx1ZS5cbiAqXG4gKiAgIyMgVXNhZ2VcbiAqXG4gKiAgZXhwcmVzc2lvbiB8IGkxOG5TZWxlY3Q6bWFwcGluZ1xuICpcbiAqICB3aGVyZSBgbWFwcGluZ2AgaXMgYW4gb2JqZWN0IHRoYXQgaW5kaWNhdGVzIHRoZSB0ZXh0IHRoYXQgc2hvdWxkIGJlIGRpc3BsYXllZFxuICogIGZvciBkaWZmZXJlbnQgdmFsdWVzIG9mIHRoZSBwcm92aWRlZCBgZXhwcmVzc2lvbmAuXG4gKlxuICogICMjIEV4YW1wbGVcbiAqXG4gKiAgYGBgXG4gKiAgPGRpdj5cbiAqICAgIHt7IGdlbmRlciB8IGkxOG5TZWxlY3Q6IGludml0ZU1hcCB9fVxuICogIDwvZGl2PlxuICpcbiAqICBjbGFzcyBNeUFwcCB7XG4gKiAgICBnZW5kZXI6IHN0cmluZyA9ICdtYWxlJztcbiAqICAgIGludml0ZU1hcDogYW55ID0ge1xuICogICAgICAnbWFsZSc6ICdJbnZpdGUgaGVyLicsXG4gKiAgICAgICdmZW1hbGUnOiAnSW52aXRlIGhpbS4nLFxuICogICAgICAnb3RoZXInOiAnSW52aXRlIHRoZW0uJ1xuICogICAgfVxuICogICAgLi4uXG4gKiAgfVxuICogIGBgYFxuICovXG5AQ09OU1QoKVxuQFBpcGUoe25hbWU6ICdpMThuU2VsZWN0JywgcHVyZTogdHJ1ZX0pXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSTE4blNlbGVjdFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKHZhbHVlOiBzdHJpbmcsIGFyZ3M6IGFueVtdID0gbnVsbCk6IHN0cmluZyB7XG4gICAgdmFyIG1hcHBpbmc6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0gPHtbY291bnQ6IHN0cmluZ106IHN0cmluZ30+KGFyZ3NbMF0pO1xuICAgIGlmICghaXNTdHJpbmdNYXAobWFwcGluZykpIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkUGlwZUFyZ3VtZW50RXhjZXB0aW9uKEkxOG5TZWxlY3RQaXBlLCBtYXBwaW5nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gU3RyaW5nTWFwV3JhcHBlci5jb250YWlucyhtYXBwaW5nLCB2YWx1ZSkgPyBtYXBwaW5nW3ZhbHVlXSA6IG1hcHBpbmdbJ290aGVyJ107XG4gIH1cbn1cbiJdfQ==