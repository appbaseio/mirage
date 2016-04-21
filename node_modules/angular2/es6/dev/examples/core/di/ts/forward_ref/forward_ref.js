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
import { Inject, Injector, forwardRef, resolveForwardRef } from 'angular2/core';
// #docregion forward_ref_fn
var ref = forwardRef(() => Lock);
// #enddocregion
// #docregion forward_ref
class Door {
    constructor(lock) {
        this.lock = lock;
    }
}
Door = __decorate([
    __param(0, Inject(forwardRef(() => Lock))), 
    __metadata('design:paramtypes', [Lock])
], Door);
// Only at this point Lock is defined.
class Lock {
}
var injector = Injector.resolveAndCreate([Door, Lock]);
var door = injector.get(Door);
expect(door instanceof Door).toBe(true);
expect(door.lock instanceof Lock).toBe(true);
// #enddocregion
// #docregion resolve_forward_ref
var ref = forwardRef(() => "refValue");
expect(resolveForwardRef(ref)).toEqual("refValue");
expect(resolveForwardRef("regularValue")).toEqual("regularValue");
// #enddocregion 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yd2FyZF9yZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9leGFtcGxlcy9jb3JlL2RpL3RzL2ZvcndhcmRfcmVmL2ZvcndhcmRfcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztPQUFPLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQWUsTUFBTSxlQUFlO0FBRTNGLDRCQUE0QjtBQUM1QixJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztBQUNqQyxnQkFBZ0I7QUFFaEIseUJBQXlCO0FBQ3pCO0lBRUUsWUFBNEMsSUFBVTtRQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQUMsQ0FBQztBQUMvRSxDQUFDO0FBRGE7ZUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7O1FBQUE7QUFHN0Msc0NBQXNDO0FBQ3RDO0FBQVksQ0FBQztBQUViLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsTUFBTSxDQUFDLElBQUksWUFBWSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdDLGdCQUFnQjtBQUVoQixpQ0FBaUM7QUFDakMsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLE1BQU0sVUFBVSxDQUFDLENBQUM7QUFDdkMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25ELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNsRSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdCwgSW5qZWN0b3IsIGZvcndhcmRSZWYsIHJlc29sdmVGb3J3YXJkUmVmLCBGb3J3YXJkUmVmRm59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG4vLyAjZG9jcmVnaW9uIGZvcndhcmRfcmVmX2ZuXG52YXIgcmVmID0gZm9yd2FyZFJlZigoKSA9PiBMb2NrKTtcbi8vICNlbmRkb2NyZWdpb25cblxuLy8gI2RvY3JlZ2lvbiBmb3J3YXJkX3JlZlxuY2xhc3MgRG9vciB7XG4gIGxvY2s6IExvY2s7XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBMb2NrKSkgbG9jazogTG9jaykgeyB0aGlzLmxvY2sgPSBsb2NrOyB9XG59XG5cbi8vIE9ubHkgYXQgdGhpcyBwb2ludCBMb2NrIGlzIGRlZmluZWQuXG5jbGFzcyBMb2NrIHt9XG5cbnZhciBpbmplY3RvciA9IEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW0Rvb3IsIExvY2tdKTtcbnZhciBkb29yID0gaW5qZWN0b3IuZ2V0KERvb3IpO1xuZXhwZWN0KGRvb3IgaW5zdGFuY2VvZiBEb29yKS50b0JlKHRydWUpO1xuZXhwZWN0KGRvb3IubG9jayBpbnN0YW5jZW9mIExvY2spLnRvQmUodHJ1ZSk7XG4vLyAjZW5kZG9jcmVnaW9uXG5cbi8vICNkb2NyZWdpb24gcmVzb2x2ZV9mb3J3YXJkX3JlZlxudmFyIHJlZiA9IGZvcndhcmRSZWYoKCkgPT4gXCJyZWZWYWx1ZVwiKTtcbmV4cGVjdChyZXNvbHZlRm9yd2FyZFJlZihyZWYpKS50b0VxdWFsKFwicmVmVmFsdWVcIik7XG5leHBlY3QocmVzb2x2ZUZvcndhcmRSZWYoXCJyZWd1bGFyVmFsdWVcIikpLnRvRXF1YWwoXCJyZWd1bGFyVmFsdWVcIik7XG4vLyAjZW5kZG9jcmVnaW9uIl19