import { BaseException, WrappedException } from "angular2/src/facade/exceptions";
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
export class ExpressionChangedAfterItHasBeenCheckedException extends BaseException {
    constructor(exp, oldValue, currValue, context) {
        super(`Expression '${exp}' has changed after it was checked. ` +
            `Previous value: '${oldValue}'. Current value: '${currValue}'`);
    }
}
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
export class ChangeDetectionError extends WrappedException {
    constructor(exp, originalException, originalStack, context) {
        super(`${originalException} in [${exp}]`, originalException, originalStack, context);
        this.location = exp;
    }
}
/**
 * Thrown when change detector executes on dehydrated view.
 *
 * This error indicates a bug in the framework.
 *
 * This is an internal Angular error.
 */
export class DehydratedException extends BaseException {
    constructor(details) {
        super(`Attempt to use a dehydrated detector: ${details}`);
    }
}
/**
 * Wraps an exception thrown by an event handler.
 */
export class EventEvaluationError extends WrappedException {
    constructor(eventName, originalException, originalStack, context) {
        super(`Error during evaluation of "${eventName}"`, originalException, originalStack, context);
    }
}
/**
 * Error context included when an event handler throws an exception.
 */
export class EventEvaluationErrorContext {
    constructor(element, componentElement, context, locals, injector) {
        this.element = element;
        this.componentElement = componentElement;
        this.context = context;
        this.locals = locals;
        this.injector = injector;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vZXhjZXB0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLGFBQWEsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQztBQUU5RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQ0c7QUFDSCxxRUFBcUUsYUFBYTtJQUNoRixZQUFZLEdBQVcsRUFBRSxRQUFhLEVBQUUsU0FBYyxFQUFFLE9BQVk7UUFDbEUsTUFBTSxlQUFlLEdBQUcsc0NBQXNDO1lBQ3hELG9CQUFvQixRQUFRLHNCQUFzQixTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7QUFDSCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCRztBQUNILDBDQUEwQyxnQkFBZ0I7SUFNeEQsWUFBWSxHQUFXLEVBQUUsaUJBQXNCLEVBQUUsYUFBa0IsRUFBRSxPQUFZO1FBQy9FLE1BQU0sR0FBRyxpQkFBaUIsUUFBUSxHQUFHLEdBQUcsRUFBRSxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7SUFDdEIsQ0FBQztBQUNILENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCx5Q0FBeUMsYUFBYTtJQUNwRCxZQUFZLE9BQWU7UUFBSSxNQUFNLHlDQUF5QyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQUMsQ0FBQztBQUM3RixDQUFDO0FBRUQ7O0dBRUc7QUFDSCwwQ0FBMEMsZ0JBQWdCO0lBQ3hELFlBQVksU0FBaUIsRUFBRSxpQkFBc0IsRUFBRSxhQUFrQixFQUFFLE9BQVk7UUFDckYsTUFBTSwrQkFBK0IsU0FBUyxHQUFHLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hHLENBQUM7QUFDSCxDQUFDO0FBRUQ7O0dBRUc7QUFDSDtJQUNFLFlBQW1CLE9BQVksRUFBUyxnQkFBcUIsRUFBUyxPQUFZLEVBQy9ELE1BQVcsRUFBUyxRQUFhO1FBRGpDLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFBUyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQUs7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFLO1FBQy9ELFdBQU0sR0FBTixNQUFNLENBQUs7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFLO0lBQUcsQ0FBQztBQUMxRCxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnNcIjtcblxuLyoqXG4gKiBBbiBlcnJvciB0aHJvd24gaWYgYXBwbGljYXRpb24gY2hhbmdlcyBtb2RlbCBicmVha2luZyB0aGUgdG9wLWRvd24gZGF0YSBmbG93LlxuICpcbiAqIFRoaXMgZXhjZXB0aW9uIGlzIG9ubHkgdGhyb3duIGluIGRldiBtb2RlLlxuICpcbiAqIDwhLS0gVE9ETzogQWRkIGEgbGluayBvbmNlIHRoZSBkZXYgbW9kZSBvcHRpb24gaXMgY29uZmlndXJhYmxlIC0tPlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAncGFyZW50JyxcbiAqICAgdGVtcGxhdGU6IGBcbiAqICAgICA8Y2hpbGQgW3Byb3BdPVwicGFyZW50UHJvcFwiPjwvY2hpbGQ+XG4gKiAgIGAsXG4gKiAgIGRpcmVjdGl2ZXM6IFtmb3J3YXJkUmVmKCgpID0+IENoaWxkKV1cbiAqIH0pXG4gKiBjbGFzcyBQYXJlbnQge1xuICogICBwYXJlbnRQcm9wID0gXCJpbml0XCI7XG4gKiB9XG4gKlxuICogQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdjaGlsZCcsIGlucHV0czogWydwcm9wJ119KVxuICogY2xhc3MgQ2hpbGQge1xuICogICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFyZW50OiBQYXJlbnQpIHt9XG4gKlxuICogICBzZXQgcHJvcCh2KSB7XG4gKiAgICAgLy8gdGhpcyB1cGRhdGVzIHRoZSBwYXJlbnQgcHJvcGVydHksIHdoaWNoIGlzIGRpc2FsbG93ZWQgZHVyaW5nIGNoYW5nZSBkZXRlY3Rpb25cbiAqICAgICAvLyB0aGlzIHdpbGwgcmVzdWx0IGluIEV4cHJlc3Npb25DaGFuZ2VkQWZ0ZXJJdEhhc0JlZW5DaGVja2VkRXhjZXB0aW9uXG4gKiAgICAgdGhpcy5wYXJlbnQucGFyZW50UHJvcCA9IFwidXBkYXRlZFwiO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25DaGFuZ2VkQWZ0ZXJJdEhhc0JlZW5DaGVja2VkRXhjZXB0aW9uIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGV4cDogc3RyaW5nLCBvbGRWYWx1ZTogYW55LCBjdXJyVmFsdWU6IGFueSwgY29udGV4dDogYW55KSB7XG4gICAgc3VwZXIoYEV4cHJlc3Npb24gJyR7ZXhwfScgaGFzIGNoYW5nZWQgYWZ0ZXIgaXQgd2FzIGNoZWNrZWQuIGAgK1xuICAgICAgICAgIGBQcmV2aW91cyB2YWx1ZTogJyR7b2xkVmFsdWV9Jy4gQ3VycmVudCB2YWx1ZTogJyR7Y3VyclZhbHVlfSdgKTtcbiAgfVxufVxuXG4vKipcbiAqIFRocm93biB3aGVuIGFuIGV4cHJlc3Npb24gZXZhbHVhdGlvbiByYWlzZXMgYW4gZXhjZXB0aW9uLlxuICpcbiAqIFRoaXMgZXJyb3Igd3JhcHMgdGhlIG9yaWdpbmFsIGV4Y2VwdGlvbiB0byBhdHRhY2ggYWRkaXRpb25hbCBjb250ZXh0dWFsIGluZm9ybWF0aW9uIHRoYXQgY2FuXG4gKiBiZSB1c2VmdWwgZm9yIGRlYnVnZ2luZy5cbiAqXG4gKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvMkt5d296P3A9cHJldmlldykpXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdjaGlsZCcsIGlucHV0czogWydwcm9wJ119KVxuICogY2xhc3MgQ2hpbGQge1xuICogICBwcm9wO1xuICogfVxuICpcbiAqIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ2FwcCcsXG4gKiAgIHRlbXBsYXRlOiBgXG4gKiAgICAgPGNoaWxkIFtwcm9wXT1cImZpZWxkLmZpcnN0XCI+PC9jaGlsZD5cbiAqICAgYCxcbiAqICAgZGlyZWN0aXZlczogW0NoaWxkXVxuICogfSlcbiAqIGNsYXNzIEFwcCB7XG4gKiAgIGZpZWxkID0gbnVsbDtcbiAqIH1cbiAqXG4gKiBib290c3RyYXAoQXBwKTtcbiAqIGBgYFxuICpcbiAqIFlvdSBjYW4gYWNjZXNzIHRoZSBvcmlnaW5hbCBleGNlcHRpb24gYW5kIHN0YWNrIHRocm91Z2ggdGhlIGBvcmlnaW5hbEV4Y2VwdGlvbmAgYW5kXG4gKiBgb3JpZ2luYWxTdGFja2AgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGNsYXNzIENoYW5nZURldGVjdGlvbkVycm9yIGV4dGVuZHMgV3JhcHBlZEV4Y2VwdGlvbiB7XG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgZXhwcmVzc2lvbiB0aGF0IHRyaWdnZXJlZCB0aGUgZXhjZXB0aW9uLlxuICAgKi9cbiAgbG9jYXRpb246IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihleHA6IHN0cmluZywgb3JpZ2luYWxFeGNlcHRpb246IGFueSwgb3JpZ2luYWxTdGFjazogYW55LCBjb250ZXh0OiBhbnkpIHtcbiAgICBzdXBlcihgJHtvcmlnaW5hbEV4Y2VwdGlvbn0gaW4gWyR7ZXhwfV1gLCBvcmlnaW5hbEV4Y2VwdGlvbiwgb3JpZ2luYWxTdGFjaywgY29udGV4dCk7XG4gICAgdGhpcy5sb2NhdGlvbiA9IGV4cDtcbiAgfVxufVxuXG4vKipcbiAqIFRocm93biB3aGVuIGNoYW5nZSBkZXRlY3RvciBleGVjdXRlcyBvbiBkZWh5ZHJhdGVkIHZpZXcuXG4gKlxuICogVGhpcyBlcnJvciBpbmRpY2F0ZXMgYSBidWcgaW4gdGhlIGZyYW1ld29yay5cbiAqXG4gKiBUaGlzIGlzIGFuIGludGVybmFsIEFuZ3VsYXIgZXJyb3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWh5ZHJhdGVkRXhjZXB0aW9uIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGRldGFpbHM6IHN0cmluZykgeyBzdXBlcihgQXR0ZW1wdCB0byB1c2UgYSBkZWh5ZHJhdGVkIGRldGVjdG9yOiAke2RldGFpbHN9YCk7IH1cbn1cblxuLyoqXG4gKiBXcmFwcyBhbiBleGNlcHRpb24gdGhyb3duIGJ5IGFuIGV2ZW50IGhhbmRsZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudEV2YWx1YXRpb25FcnJvciBleHRlbmRzIFdyYXBwZWRFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihldmVudE5hbWU6IHN0cmluZywgb3JpZ2luYWxFeGNlcHRpb246IGFueSwgb3JpZ2luYWxTdGFjazogYW55LCBjb250ZXh0OiBhbnkpIHtcbiAgICBzdXBlcihgRXJyb3IgZHVyaW5nIGV2YWx1YXRpb24gb2YgXCIke2V2ZW50TmFtZX1cImAsIG9yaWdpbmFsRXhjZXB0aW9uLCBvcmlnaW5hbFN0YWNrLCBjb250ZXh0KTtcbiAgfVxufVxuXG4vKipcbiAqIEVycm9yIGNvbnRleHQgaW5jbHVkZWQgd2hlbiBhbiBldmVudCBoYW5kbGVyIHRocm93cyBhbiBleGNlcHRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudEV2YWx1YXRpb25FcnJvckNvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDogYW55LCBwdWJsaWMgY29tcG9uZW50RWxlbWVudDogYW55LCBwdWJsaWMgY29udGV4dDogYW55LFxuICAgICAgICAgICAgICBwdWJsaWMgbG9jYWxzOiBhbnksIHB1YmxpYyBpbmplY3RvcjogYW55KSB7fVxufVxuIl19