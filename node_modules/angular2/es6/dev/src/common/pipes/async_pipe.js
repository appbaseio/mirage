var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { isBlank, isPresent, isPromise } from 'angular2/src/facade/lang';
import { ObservableWrapper } from 'angular2/src/facade/async';
import { Pipe, Injectable, ChangeDetectorRef, WrappedValue } from 'angular2/core';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
class ObservableStrategy {
    createSubscription(async, updateLatestValue) {
        return ObservableWrapper.subscribe(async, updateLatestValue, e => { throw e; });
    }
    dispose(subscription) { ObservableWrapper.dispose(subscription); }
    onDestroy(subscription) { ObservableWrapper.dispose(subscription); }
}
class PromiseStrategy {
    createSubscription(async, updateLatestValue) {
        return async.then(updateLatestValue);
    }
    dispose(subscription) { }
    onDestroy(subscription) { }
}
var _promiseStrategy = new PromiseStrategy();
var _observableStrategy = new ObservableStrategy();
var __unused; // avoid unused import when Promise union types are erased
/**
 * The `async` pipe subscribes to an Observable or Promise and returns the latest value it has
 * emitted.
 * When a new value is emitted, the `async` pipe marks the component to be checked for changes.
 *
 * ### Example
 *
 * This example binds a `Promise` to the view. Clicking the `Resolve` button resolves the
 * promise.
 *
 * {@example core/pipes/ts/async_pipe/async_pipe_example.ts region='AsyncPipe'}
 *
 * It's also possible to use `async` with Observables. The example below binds the `time` Observable
 * to the view. Every 500ms, the `time` Observable updates the view with the current time.
 *
 * ```typescript
 * ```
 */
let AsyncPipe_1;
export let AsyncPipe = AsyncPipe_1 = class AsyncPipe {
    constructor(_ref) {
        /** @internal */
        this._latestValue = null;
        /** @internal */
        this._latestReturnedValue = null;
        /** @internal */
        this._subscription = null;
        /** @internal */
        this._obj = null;
        this._strategy = null;
        this._ref = _ref;
    }
    ngOnDestroy() {
        if (isPresent(this._subscription)) {
            this._dispose();
        }
    }
    transform(obj, args) {
        if (isBlank(this._obj)) {
            if (isPresent(obj)) {
                this._subscribe(obj);
            }
            this._latestReturnedValue = this._latestValue;
            return this._latestValue;
        }
        if (obj !== this._obj) {
            this._dispose();
            return this.transform(obj);
        }
        if (this._latestValue === this._latestReturnedValue) {
            return this._latestReturnedValue;
        }
        else {
            this._latestReturnedValue = this._latestValue;
            return WrappedValue.wrap(this._latestValue);
        }
    }
    /** @internal */
    _subscribe(obj) {
        this._obj = obj;
        this._strategy = this._selectStrategy(obj);
        this._subscription = this._strategy.createSubscription(obj, (value) => this._updateLatestValue(obj, value));
    }
    /** @internal */
    _selectStrategy(obj) {
        if (isPromise(obj)) {
            return _promiseStrategy;
        }
        else if (ObservableWrapper.isObservable(obj)) {
            return _observableStrategy;
        }
        else {
            throw new InvalidPipeArgumentException(AsyncPipe_1, obj);
        }
    }
    /** @internal */
    _dispose() {
        this._strategy.dispose(this._subscription);
        this._latestValue = null;
        this._latestReturnedValue = null;
        this._subscription = null;
        this._obj = null;
    }
    /** @internal */
    _updateLatestValue(async, value) {
        if (async === this._obj) {
            this._latestValue = value;
            this._ref.markForCheck();
        }
    }
};
AsyncPipe = AsyncPipe_1 = __decorate([
    // avoid unused import when Promise union types are erased
    Pipe({ name: 'async', pure: false }),
    Injectable(), 
    __metadata('design:paramtypes', [ChangeDetectorRef])
], AsyncPipe);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmNfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vcGlwZXMvYXN5bmNfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFRLE1BQU0sMEJBQTBCO09BQ3RFLEVBQUMsaUJBQWlCLEVBQTJCLE1BQU0sMkJBQTJCO09BQzlFLEVBQ0wsSUFBSSxFQUNKLFVBQVUsRUFDVixpQkFBaUIsRUFHakIsWUFBWSxFQUNiLE1BQU0sZUFBZTtPQUVmLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxtQ0FBbUM7QUFFOUU7SUFDRSxrQkFBa0IsQ0FBQyxLQUFVLEVBQUUsaUJBQXNCO1FBQ25ELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFLENBQUMsTUFBTSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRCxPQUFPLENBQUMsWUFBaUIsSUFBVSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdFLFNBQVMsQ0FBQyxZQUFpQixJQUFVLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakYsQ0FBQztBQUVEO0lBQ0Usa0JBQWtCLENBQUMsS0FBbUIsRUFBRSxpQkFBa0M7UUFDeEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsT0FBTyxDQUFDLFlBQWlCLElBQVMsQ0FBQztJQUVuQyxTQUFTLENBQUMsWUFBaUIsSUFBUyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxJQUFJLGdCQUFnQixHQUFHLElBQUksZUFBZSxFQUFF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QUcsQ0FBQyxDQUFDO1FBQ3pELENBQUM7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLFFBQVE7UUFDTixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGtCQUFrQixDQUFDLEtBQVUsRUFBRSxLQUFhO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzNCLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQWhGRDtJQXBCNkIsMERBQTBEO0lBb0J0RixJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQztJQUNsQyxVQUFVLEVBQUU7O2FBQUE7QUErRVoiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQmxhbmssIGlzUHJlc2VudCwgaXNQcm9taXNlLCBDT05TVH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7T2JzZXJ2YWJsZVdyYXBwZXIsIE9ic2VydmFibGUsIEV2ZW50RW1pdHRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge1xuICBQaXBlLFxuICBJbmplY3RhYmxlLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT25EZXN0cm95LFxuICBQaXBlVHJhbnNmb3JtLFxuICBXcmFwcGVkVmFsdWVcbn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5cbmltcG9ydCB7SW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbn0gZnJvbSAnLi9pbnZhbGlkX3BpcGVfYXJndW1lbnRfZXhjZXB0aW9uJztcblxuY2xhc3MgT2JzZXJ2YWJsZVN0cmF0ZWd5IHtcbiAgY3JlYXRlU3Vic2NyaXB0aW9uKGFzeW5jOiBhbnksIHVwZGF0ZUxhdGVzdFZhbHVlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUoYXN5bmMsIHVwZGF0ZUxhdGVzdFZhbHVlLCBlID0+IHsgdGhyb3cgZTsgfSk7XG4gIH1cblxuICBkaXNwb3NlKHN1YnNjcmlwdGlvbjogYW55KTogdm9pZCB7IE9ic2VydmFibGVXcmFwcGVyLmRpc3Bvc2Uoc3Vic2NyaXB0aW9uKTsgfVxuXG4gIG9uRGVzdHJveShzdWJzY3JpcHRpb246IGFueSk6IHZvaWQgeyBPYnNlcnZhYmxlV3JhcHBlci5kaXNwb3NlKHN1YnNjcmlwdGlvbik7IH1cbn1cblxuY2xhc3MgUHJvbWlzZVN0cmF0ZWd5IHtcbiAgY3JlYXRlU3Vic2NyaXB0aW9uKGFzeW5jOiBQcm9taXNlPGFueT4sIHVwZGF0ZUxhdGVzdFZhbHVlOiAodjogYW55KSA9PiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBhc3luYy50aGVuKHVwZGF0ZUxhdGVzdFZhbHVlKTtcbiAgfVxuXG4gIGRpc3Bvc2Uoc3Vic2NyaXB0aW9uOiBhbnkpOiB2b2lkIHt9XG5cbiAgb25EZXN0cm95KHN1YnNjcmlwdGlvbjogYW55KTogdm9pZCB7fVxufVxuXG52YXIgX3Byb21pc2VTdHJhdGVneSA9IG5ldyBQcm9taXNlU3RyYXRlZ3koKTtcbnZhciBfb2JzZXJ2YWJsZVN0cmF0ZWd5ID0gbmV3IE9ic2VydmFibGVTdHJhdGVneSgpO1xudmFyIF9fdW51c2VkOiBQcm9taXNlPGFueT47ICAvLyBhdm9pZCB1bnVzZWQgaW1wb3J0IHdoZW4gUHJvbWlzZSB1bmlvbiB0eXBlcyBhcmUgZXJhc2VkXG5cbi8qKlxuICogVGhlIGBhc3luY2AgcGlwZSBzdWJzY3JpYmVzIHRvIGFuIE9ic2VydmFibGUgb3IgUHJvbWlzZSBhbmQgcmV0dXJucyB0aGUgbGF0ZXN0IHZhbHVlIGl0IGhhc1xuICogZW1pdHRlZC5cbiAqIFdoZW4gYSBuZXcgdmFsdWUgaXMgZW1pdHRlZCwgdGhlIGBhc3luY2AgcGlwZSBtYXJrcyB0aGUgY29tcG9uZW50IHRvIGJlIGNoZWNrZWQgZm9yIGNoYW5nZXMuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBUaGlzIGV4YW1wbGUgYmluZHMgYSBgUHJvbWlzZWAgdG8gdGhlIHZpZXcuIENsaWNraW5nIHRoZSBgUmVzb2x2ZWAgYnV0dG9uIHJlc29sdmVzIHRoZVxuICogcHJvbWlzZS5cbiAqXG4gKiB7QGV4YW1wbGUgY29yZS9waXBlcy90cy9hc3luY19waXBlL2FzeW5jX3BpcGVfZXhhbXBsZS50cyByZWdpb249J0FzeW5jUGlwZSd9XG4gKlxuICogSXQncyBhbHNvIHBvc3NpYmxlIHRvIHVzZSBgYXN5bmNgIHdpdGggT2JzZXJ2YWJsZXMuIFRoZSBleGFtcGxlIGJlbG93IGJpbmRzIHRoZSBgdGltZWAgT2JzZXJ2YWJsZVxuICogdG8gdGhlIHZpZXcuIEV2ZXJ5IDUwMG1zLCB0aGUgYHRpbWVgIE9ic2VydmFibGUgdXBkYXRlcyB0aGUgdmlldyB3aXRoIHRoZSBjdXJyZW50IHRpbWUuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogYGBgXG4gKi9cbkBQaXBlKHtuYW1lOiAnYXN5bmMnLCBwdXJlOiBmYWxzZX0pXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXN5bmNQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSwgT25EZXN0cm95IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbGF0ZXN0VmFsdWU6IE9iamVjdCA9IG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2xhdGVzdFJldHVybmVkVmFsdWU6IE9iamVjdCA9IG51bGw7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3Vic2NyaXB0aW9uOiBPYmplY3QgPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIF9vYmo6IE9ic2VydmFibGU8YW55PnwgUHJvbWlzZTxhbnk+fCBFdmVudEVtaXR0ZXI8YW55PiA9IG51bGw7XG4gIHByaXZhdGUgX3N0cmF0ZWd5OiBhbnkgPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfcmVmOiBDaGFuZ2VEZXRlY3RvclJlZjtcbiAgY29uc3RydWN0b3IoX3JlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHsgdGhpcy5fcmVmID0gX3JlZjsgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5fc3Vic2NyaXB0aW9uKSkge1xuICAgICAgdGhpcy5fZGlzcG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIHRyYW5zZm9ybShvYmo6IE9ic2VydmFibGU8YW55PnwgUHJvbWlzZTxhbnk+fCBFdmVudEVtaXR0ZXI8YW55PiwgYXJncz86IGFueVtdKTogYW55IHtcbiAgICBpZiAoaXNCbGFuayh0aGlzLl9vYmopKSB7XG4gICAgICBpZiAoaXNQcmVzZW50KG9iaikpIHtcbiAgICAgICAgdGhpcy5fc3Vic2NyaWJlKG9iaik7XG4gICAgICB9XG4gICAgICB0aGlzLl9sYXRlc3RSZXR1cm5lZFZhbHVlID0gdGhpcy5fbGF0ZXN0VmFsdWU7XG4gICAgICByZXR1cm4gdGhpcy5fbGF0ZXN0VmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG9iaiAhPT0gdGhpcy5fb2JqKSB7XG4gICAgICB0aGlzLl9kaXNwb3NlKCk7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0ob2JqKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbGF0ZXN0VmFsdWUgPT09IHRoaXMuX2xhdGVzdFJldHVybmVkVmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9sYXRlc3RSZXR1cm5lZFZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9sYXRlc3RSZXR1cm5lZFZhbHVlID0gdGhpcy5fbGF0ZXN0VmFsdWU7XG4gICAgICByZXR1cm4gV3JhcHBlZFZhbHVlLndyYXAodGhpcy5fbGF0ZXN0VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N1YnNjcmliZShvYmo6IE9ic2VydmFibGU8YW55PnwgUHJvbWlzZTxhbnk+fCBFdmVudEVtaXR0ZXI8YW55Pik6IHZvaWQge1xuICAgIHRoaXMuX29iaiA9IG9iajtcbiAgICB0aGlzLl9zdHJhdGVneSA9IHRoaXMuX3NlbGVjdFN0cmF0ZWd5KG9iaik7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uID0gdGhpcy5fc3RyYXRlZ3kuY3JlYXRlU3Vic2NyaXB0aW9uKFxuICAgICAgICBvYmosICh2YWx1ZTogT2JqZWN0KSA9PiB0aGlzLl91cGRhdGVMYXRlc3RWYWx1ZShvYmosIHZhbHVlKSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZWxlY3RTdHJhdGVneShvYmo6IE9ic2VydmFibGU8YW55PnwgUHJvbWlzZTxhbnk+fCBFdmVudEVtaXR0ZXI8YW55Pik6IGFueSB7XG4gICAgaWYgKGlzUHJvbWlzZShvYmopKSB7XG4gICAgICByZXR1cm4gX3Byb21pc2VTdHJhdGVneTtcbiAgICB9IGVsc2UgaWYgKE9ic2VydmFibGVXcmFwcGVyLmlzT2JzZXJ2YWJsZShvYmopKSB7XG4gICAgICByZXR1cm4gX29ic2VydmFibGVTdHJhdGVneTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRQaXBlQXJndW1lbnRFeGNlcHRpb24oQXN5bmNQaXBlLCBvYmopO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Rpc3Bvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5fc3RyYXRlZ3kuZGlzcG9zZSh0aGlzLl9zdWJzY3JpcHRpb24pO1xuICAgIHRoaXMuX2xhdGVzdFZhbHVlID0gbnVsbDtcbiAgICB0aGlzLl9sYXRlc3RSZXR1cm5lZFZhbHVlID0gbnVsbDtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSBudWxsO1xuICAgIHRoaXMuX29iaiA9IG51bGw7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVMYXRlc3RWYWx1ZShhc3luYzogYW55LCB2YWx1ZTogT2JqZWN0KSB7XG4gICAgaWYgKGFzeW5jID09PSB0aGlzLl9vYmopIHtcbiAgICAgIHRoaXMuX2xhdGVzdFZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9yZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG59XG4iXX0=