var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Json, CONST } from 'angular2/src/facade/lang';
import { Injectable, Pipe } from 'angular2/core';
/**
 * Transforms any input value using `JSON.stringify`. Useful for debugging.
 *
 * ### Example
 * {@example core/pipes/ts/json_pipe/json_pipe_example.ts region='JsonPipe'}
 */
export let JsonPipe = class JsonPipe {
    transform(value, args = null) { return Json.stringify(value); }
};
JsonPipe = __decorate([
    CONST(),
    Pipe({ name: 'json', pure: false }),
    Injectable(), 
    __metadata('design:paramtypes', [])
], JsonPipe);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbl9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL2NvbW1vbi9waXBlcy9qc29uX3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFBcUIsSUFBSSxFQUFFLEtBQUssRUFBQyxNQUFNLDBCQUEwQjtPQUNqRSxFQUFDLFVBQVUsRUFBK0IsSUFBSSxFQUFDLE1BQU0sZUFBZTtBQUUzRTs7Ozs7R0FLRztBQUlIO0lBQ0UsU0FBUyxDQUFDLEtBQVUsRUFBRSxJQUFJLEdBQVUsSUFBSSxJQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRixDQUFDO0FBTEQ7SUFBQyxLQUFLLEVBQUU7SUFDUCxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQztJQUNqQyxVQUFVLEVBQUU7O1lBQUE7QUFHWiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNCbGFuaywgaXNQcmVzZW50LCBKc29uLCBDT05TVH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7SW5qZWN0YWJsZSwgUGlwZVRyYW5zZm9ybSwgV3JhcHBlZFZhbHVlLCBQaXBlfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIGFueSBpbnB1dCB2YWx1ZSB1c2luZyBgSlNPTi5zdHJpbmdpZnlgLiBVc2VmdWwgZm9yIGRlYnVnZ2luZy5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICoge0BleGFtcGxlIGNvcmUvcGlwZXMvdHMvanNvbl9waXBlL2pzb25fcGlwZV9leGFtcGxlLnRzIHJlZ2lvbj0nSnNvblBpcGUnfVxuICovXG5AQ09OU1QoKVxuQFBpcGUoe25hbWU6ICdqc29uJywgcHVyZTogZmFsc2V9KVxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEpzb25QaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBhcmdzOiBhbnlbXSA9IG51bGwpOiBzdHJpbmcgeyByZXR1cm4gSnNvbi5zdHJpbmdpZnkodmFsdWUpOyB9XG59XG4iXX0=