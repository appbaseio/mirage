'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var exceptions_1 = require("angular2/src/facade/exceptions");
/**
 * An error thrown if application changes model breaking the top-down data flow.
 *
 * This exception is only thrown in dev mode.
 *
 * <!-- TODO: Add a link once the dev mode option is configurable -->
 *
 * ### Example
 *
 * ```typescript
 * @Component({
 *   selector: 'parent',
 *   template: `
 *     <child [prop]="parentProp"></child>
 *   `,
 *   directives: [forwardRef(() => Child)]
 * })
 * class Parent {
 *   parentProp = "init";
 * }
 *
 * @Directive({selector: 'child', inputs: ['prop']})
 * class Child {
 *   constructor(public parent: Parent) {}
 *
 *   set prop(v) {
 *     // this updates the parent property, which is disallowed during change detection
 *     // this will result in ExpressionChangedAfterItHasBeenCheckedException
 *     this.parent.parentProp = "updated";
 *   }
 * }
 * ```
 */
var ExpressionChangedAfterItHasBeenCheckedException = (function (_super) {
    __extends(ExpressionChangedAfterItHasBeenCheckedException, _super);
    function ExpressionChangedAfterItHasBeenCheckedException(exp, oldValue, currValue, context) {
        _super.call(this, ("Expression '" + exp + "' has changed after it was checked. ") +
            ("Previous value: '" + oldValue + "'. Current value: '" + currValue + "'"));
    }
    return ExpressionChangedAfterItHasBeenCheckedException;
}(exceptions_1.BaseException));
exports.ExpressionChangedAfterItHasBeenCheckedException = ExpressionChangedAfterItHasBeenCheckedException;
/**
 * Thrown when an expression evaluation raises an exception.
 *
 * This error wraps the original exception to attach additional contextual information that can
 * be useful for debugging.
 *
 * ### Example ([live demo](http://plnkr.co/edit/2Kywoz?p=preview))
 *
 * ```typescript
 * @Directive({selector: 'child', inputs: ['prop']})
 * class Child {
 *   prop;
 * }
 *
 * @Component({
 *   selector: 'app',
 *   template: `
 *     <child [prop]="field.first"></child>
 *   `,
 *   directives: [Child]
 * })
 * class App {
 *   field = null;
 * }
 *
 * bootstrap(App);
 * ```
 *
 * You can access the original exception and stack through the `originalException` and
 * `originalStack` properties.
 */
var ChangeDetectionError = (function (_super) {
    __extends(ChangeDetectionError, _super);
    function ChangeDetectionError(exp, originalException, originalStack, context) {
        _super.call(this, originalException + " in [" + exp + "]", originalException, originalStack, context);
        this.location = exp;
    }
    return ChangeDetectionError;
}(exceptions_1.WrappedException));
exports.ChangeDetectionError = ChangeDetectionError;
/**
 * Thrown when change detector executes on dehydrated view.
 *
 * This error indicates a bug in the framework.
 *
 * This is an internal Angular error.
 */
var DehydratedException = (function (_super) {
    __extends(DehydratedException, _super);
    function DehydratedException(details) {
        _super.call(this, "Attempt to use a dehydrated detector: " + details);
    }
    return DehydratedException;
}(exceptions_1.BaseException));
exports.DehydratedException = DehydratedException;
/**
 * Wraps an exception thrown by an event handler.
 */
var EventEvaluationError = (function (_super) {
    __extends(EventEvaluationError, _super);
    function EventEvaluationError(eventName, originalException, originalStack, context) {
        _super.call(this, "Error during evaluation of \"" + eventName + "\"", originalException, originalStack, context);
    }
    return EventEvaluationError;
}(exceptions_1.WrappedException));
exports.EventEvaluationError = EventEvaluationError;
/**
 * Error context included when an event handler throws an exception.
 */
var EventEvaluationErrorContext = (function () {
    function EventEvaluationErrorContext(element, componentElement, context, locals, injector) {
        this.element = element;
        this.componentElement = componentElement;
        this.context = context;
        this.locals = locals;
        this.injector = injector;
    }
    return EventEvaluationErrorContext;
}());
exports.EventEvaluationErrorContext = EventEvaluationErrorContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vZXhjZXB0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyQkFBOEMsZ0NBQWdDLENBQUMsQ0FBQTtBQUUvRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQ0c7QUFDSDtJQUFxRSxtRUFBYTtJQUNoRix5REFBWSxHQUFXLEVBQUUsUUFBYSxFQUFFLFNBQWMsRUFBRSxPQUFZO1FBQ2xFLGtCQUFNLGtCQUFlLEdBQUcsMENBQXNDO1lBQ3hELHVCQUFvQixRQUFRLDJCQUFzQixTQUFTLE9BQUcsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDSCxzREFBQztBQUFELENBQUMsQUFMRCxDQUFxRSwwQkFBYSxHQUtqRjtBQUxZLHVEQUErQyxrREFLM0QsQ0FBQTtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Qkc7QUFDSDtJQUEwQyx3Q0FBZ0I7SUFNeEQsOEJBQVksR0FBVyxFQUFFLGlCQUFzQixFQUFFLGFBQWtCLEVBQUUsT0FBWTtRQUMvRSxrQkFBUyxpQkFBaUIsYUFBUSxHQUFHLE1BQUcsRUFBRSxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7SUFDdEIsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQVZELENBQTBDLDZCQUFnQixHQVV6RDtBQVZZLDRCQUFvQix1QkFVaEMsQ0FBQTtBQUVEOzs7Ozs7R0FNRztBQUNIO0lBQXlDLHVDQUFhO0lBQ3BELDZCQUFZLE9BQWU7UUFBSSxrQkFBTSwyQ0FBeUMsT0FBUyxDQUFDLENBQUM7SUFBQyxDQUFDO0lBQzdGLDBCQUFDO0FBQUQsQ0FBQyxBQUZELENBQXlDLDBCQUFhLEdBRXJEO0FBRlksMkJBQW1CLHNCQUUvQixDQUFBO0FBRUQ7O0dBRUc7QUFDSDtJQUEwQyx3Q0FBZ0I7SUFDeEQsOEJBQVksU0FBaUIsRUFBRSxpQkFBc0IsRUFBRSxhQUFrQixFQUFFLE9BQVk7UUFDckYsa0JBQU0sa0NBQStCLFNBQVMsT0FBRyxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBQ0gsMkJBQUM7QUFBRCxDQUFDLEFBSkQsQ0FBMEMsNkJBQWdCLEdBSXpEO0FBSlksNEJBQW9CLHVCQUloQyxDQUFBO0FBRUQ7O0dBRUc7QUFDSDtJQUNFLHFDQUFtQixPQUFZLEVBQVMsZ0JBQXFCLEVBQVMsT0FBWSxFQUMvRCxNQUFXLEVBQVMsUUFBYTtRQURqQyxZQUFPLEdBQVAsT0FBTyxDQUFLO1FBQVMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFLO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBSztRQUMvRCxXQUFNLEdBQU4sTUFBTSxDQUFLO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBSztJQUFHLENBQUM7SUFDMUQsa0NBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhZLG1DQUEyQiw4QkFHdkMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgV3JhcHBlZEV4Y2VwdGlvbn0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9uc1wiO1xuXG4vKipcbiAqIEFuIGVycm9yIHRocm93biBpZiBhcHBsaWNhdGlvbiBjaGFuZ2VzIG1vZGVsIGJyZWFraW5nIHRoZSB0b3AtZG93biBkYXRhIGZsb3cuXG4gKlxuICogVGhpcyBleGNlcHRpb24gaXMgb25seSB0aHJvd24gaW4gZGV2IG1vZGUuXG4gKlxuICogPCEtLSBUT0RPOiBBZGQgYSBsaW5rIG9uY2UgdGhlIGRldiBtb2RlIG9wdGlvbiBpcyBjb25maWd1cmFibGUgLS0+XG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBAQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICdwYXJlbnQnLFxuICogICB0ZW1wbGF0ZTogYFxuICogICAgIDxjaGlsZCBbcHJvcF09XCJwYXJlbnRQcm9wXCI+PC9jaGlsZD5cbiAqICAgYCxcbiAqICAgZGlyZWN0aXZlczogW2ZvcndhcmRSZWYoKCkgPT4gQ2hpbGQpXVxuICogfSlcbiAqIGNsYXNzIFBhcmVudCB7XG4gKiAgIHBhcmVudFByb3AgPSBcImluaXRcIjtcbiAqIH1cbiAqXG4gKiBARGlyZWN0aXZlKHtzZWxlY3RvcjogJ2NoaWxkJywgaW5wdXRzOiBbJ3Byb3AnXX0pXG4gKiBjbGFzcyBDaGlsZCB7XG4gKiAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXJlbnQ6IFBhcmVudCkge31cbiAqXG4gKiAgIHNldCBwcm9wKHYpIHtcbiAqICAgICAvLyB0aGlzIHVwZGF0ZXMgdGhlIHBhcmVudCBwcm9wZXJ0eSwgd2hpY2ggaXMgZGlzYWxsb3dlZCBkdXJpbmcgY2hhbmdlIGRldGVjdGlvblxuICogICAgIC8vIHRoaXMgd2lsbCByZXN1bHQgaW4gRXhwcmVzc2lvbkNoYW5nZWRBZnRlckl0SGFzQmVlbkNoZWNrZWRFeGNlcHRpb25cbiAqICAgICB0aGlzLnBhcmVudC5wYXJlbnRQcm9wID0gXCJ1cGRhdGVkXCI7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgRXhwcmVzc2lvbkNoYW5nZWRBZnRlckl0SGFzQmVlbkNoZWNrZWRFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IoZXhwOiBzdHJpbmcsIG9sZFZhbHVlOiBhbnksIGN1cnJWYWx1ZTogYW55LCBjb250ZXh0OiBhbnkpIHtcbiAgICBzdXBlcihgRXhwcmVzc2lvbiAnJHtleHB9JyBoYXMgY2hhbmdlZCBhZnRlciBpdCB3YXMgY2hlY2tlZC4gYCArXG4gICAgICAgICAgYFByZXZpb3VzIHZhbHVlOiAnJHtvbGRWYWx1ZX0nLiBDdXJyZW50IHZhbHVlOiAnJHtjdXJyVmFsdWV9J2ApO1xuICB9XG59XG5cbi8qKlxuICogVGhyb3duIHdoZW4gYW4gZXhwcmVzc2lvbiBldmFsdWF0aW9uIHJhaXNlcyBhbiBleGNlcHRpb24uXG4gKlxuICogVGhpcyBlcnJvciB3cmFwcyB0aGUgb3JpZ2luYWwgZXhjZXB0aW9uIHRvIGF0dGFjaCBhZGRpdGlvbmFsIGNvbnRleHR1YWwgaW5mb3JtYXRpb24gdGhhdCBjYW5cbiAqIGJlIHVzZWZ1bCBmb3IgZGVidWdnaW5nLlxuICpcbiAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC8yS3l3b3o/cD1wcmV2aWV3KSlcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBARGlyZWN0aXZlKHtzZWxlY3RvcjogJ2NoaWxkJywgaW5wdXRzOiBbJ3Byb3AnXX0pXG4gKiBjbGFzcyBDaGlsZCB7XG4gKiAgIHByb3A7XG4gKiB9XG4gKlxuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAnYXBwJyxcbiAqICAgdGVtcGxhdGU6IGBcbiAqICAgICA8Y2hpbGQgW3Byb3BdPVwiZmllbGQuZmlyc3RcIj48L2NoaWxkPlxuICogICBgLFxuICogICBkaXJlY3RpdmVzOiBbQ2hpbGRdXG4gKiB9KVxuICogY2xhc3MgQXBwIHtcbiAqICAgZmllbGQgPSBudWxsO1xuICogfVxuICpcbiAqIGJvb3RzdHJhcChBcHApO1xuICogYGBgXG4gKlxuICogWW91IGNhbiBhY2Nlc3MgdGhlIG9yaWdpbmFsIGV4Y2VwdGlvbiBhbmQgc3RhY2sgdGhyb3VnaCB0aGUgYG9yaWdpbmFsRXhjZXB0aW9uYCBhbmRcbiAqIGBvcmlnaW5hbFN0YWNrYCBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgY2xhc3MgQ2hhbmdlRGV0ZWN0aW9uRXJyb3IgZXh0ZW5kcyBXcmFwcGVkRXhjZXB0aW9uIHtcbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBleHByZXNzaW9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBleGNlcHRpb24uXG4gICAqL1xuICBsb2NhdGlvbjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGV4cDogc3RyaW5nLCBvcmlnaW5hbEV4Y2VwdGlvbjogYW55LCBvcmlnaW5hbFN0YWNrOiBhbnksIGNvbnRleHQ6IGFueSkge1xuICAgIHN1cGVyKGAke29yaWdpbmFsRXhjZXB0aW9ufSBpbiBbJHtleHB9XWAsIG9yaWdpbmFsRXhjZXB0aW9uLCBvcmlnaW5hbFN0YWNrLCBjb250ZXh0KTtcbiAgICB0aGlzLmxvY2F0aW9uID0gZXhwO1xuICB9XG59XG5cbi8qKlxuICogVGhyb3duIHdoZW4gY2hhbmdlIGRldGVjdG9yIGV4ZWN1dGVzIG9uIGRlaHlkcmF0ZWQgdmlldy5cbiAqXG4gKiBUaGlzIGVycm9yIGluZGljYXRlcyBhIGJ1ZyBpbiB0aGUgZnJhbWV3b3JrLlxuICpcbiAqIFRoaXMgaXMgYW4gaW50ZXJuYWwgQW5ndWxhciBlcnJvci5cbiAqL1xuZXhwb3J0IGNsYXNzIERlaHlkcmF0ZWRFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IoZGV0YWlsczogc3RyaW5nKSB7IHN1cGVyKGBBdHRlbXB0IHRvIHVzZSBhIGRlaHlkcmF0ZWQgZGV0ZWN0b3I6ICR7ZGV0YWlsc31gKTsgfVxufVxuXG4vKipcbiAqIFdyYXBzIGFuIGV4Y2VwdGlvbiB0aHJvd24gYnkgYW4gZXZlbnQgaGFuZGxlci5cbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50RXZhbHVhdGlvbkVycm9yIGV4dGVuZHMgV3JhcHBlZEV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGV2ZW50TmFtZTogc3RyaW5nLCBvcmlnaW5hbEV4Y2VwdGlvbjogYW55LCBvcmlnaW5hbFN0YWNrOiBhbnksIGNvbnRleHQ6IGFueSkge1xuICAgIHN1cGVyKGBFcnJvciBkdXJpbmcgZXZhbHVhdGlvbiBvZiBcIiR7ZXZlbnROYW1lfVwiYCwgb3JpZ2luYWxFeGNlcHRpb24sIG9yaWdpbmFsU3RhY2ssIGNvbnRleHQpO1xuICB9XG59XG5cbi8qKlxuICogRXJyb3IgY29udGV4dCBpbmNsdWRlZCB3aGVuIGFuIGV2ZW50IGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50RXZhbHVhdGlvbkVycm9yQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50OiBhbnksIHB1YmxpYyBjb21wb25lbnRFbGVtZW50OiBhbnksIHB1YmxpYyBjb250ZXh0OiBhbnksXG4gICAgICAgICAgICAgIHB1YmxpYyBsb2NhbHM6IGFueSwgcHVibGljIGluamVjdG9yOiBhbnkpIHt9XG59XG4iXX0=