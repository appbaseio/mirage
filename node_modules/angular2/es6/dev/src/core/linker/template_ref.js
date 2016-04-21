/**
 * Represents an Embedded Template that can be used to instantiate Embedded Views.
 *
 * You can access a `TemplateRef`, in two ways. Via a directive placed on a `<template>` element (or
 * directive prefixed with `*`) and have the `TemplateRef` for this Embedded View injected into the
 * constructor of the directive using the `TemplateRef` Token. Alternatively you can query for the
 * `TemplateRef` from a Component or a Directive via {@link Query}.
 *
 * To instantiate Embedded Views based on a Template, use
 * {@link ViewContainerRef#createEmbeddedView}, which will create the View and attach it to the
 * View Container.
 */
export class TemplateRef {
    /**
     * The location in the View where the Embedded View logically belongs to.
     *
     * The data-binding and injection contexts of Embedded Views created from this `TemplateRef`
     * inherit from the contexts of this location.
     *
     * Typically new Embedded Views are attached to the View Container of this location, but in
     * advanced use-cases, the View can be attached to a different container while keeping the
     * data-binding and injection context from the original location.
     *
     */
    // TODO(i): rename to anchor or location
    get elementRef() { return null; }
}
export class TemplateRef_ extends TemplateRef {
    constructor(_elementRef) {
        super();
        this._elementRef = _elementRef;
    }
    get elementRef() { return this._elementRef; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3RlbXBsYXRlX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTs7Ozs7Ozs7Ozs7R0FXRztBQUNIO0lBQ0U7Ozs7Ozs7Ozs7T0FVRztJQUNILHdDQUF3QztJQUN4QyxJQUFJLFVBQVUsS0FBaUIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUVELGtDQUFrQyxXQUFXO0lBQzNDLFlBQW9CLFdBQXdCO1FBQUksT0FBTyxDQUFDO1FBQXBDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQWEsQ0FBQztJQUUxRCxJQUFJLFVBQVUsS0FBa0IsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RWxlbWVudFJlZiwgRWxlbWVudFJlZl99IGZyb20gJy4vZWxlbWVudF9yZWYnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gRW1iZWRkZWQgVGVtcGxhdGUgdGhhdCBjYW4gYmUgdXNlZCB0byBpbnN0YW50aWF0ZSBFbWJlZGRlZCBWaWV3cy5cbiAqXG4gKiBZb3UgY2FuIGFjY2VzcyBhIGBUZW1wbGF0ZVJlZmAsIGluIHR3byB3YXlzLiBWaWEgYSBkaXJlY3RpdmUgcGxhY2VkIG9uIGEgYDx0ZW1wbGF0ZT5gIGVsZW1lbnQgKG9yXG4gKiBkaXJlY3RpdmUgcHJlZml4ZWQgd2l0aCBgKmApIGFuZCBoYXZlIHRoZSBgVGVtcGxhdGVSZWZgIGZvciB0aGlzIEVtYmVkZGVkIFZpZXcgaW5qZWN0ZWQgaW50byB0aGVcbiAqIGNvbnN0cnVjdG9yIG9mIHRoZSBkaXJlY3RpdmUgdXNpbmcgdGhlIGBUZW1wbGF0ZVJlZmAgVG9rZW4uIEFsdGVybmF0aXZlbHkgeW91IGNhbiBxdWVyeSBmb3IgdGhlXG4gKiBgVGVtcGxhdGVSZWZgIGZyb20gYSBDb21wb25lbnQgb3IgYSBEaXJlY3RpdmUgdmlhIHtAbGluayBRdWVyeX0uXG4gKlxuICogVG8gaW5zdGFudGlhdGUgRW1iZWRkZWQgVmlld3MgYmFzZWQgb24gYSBUZW1wbGF0ZSwgdXNlXG4gKiB7QGxpbmsgVmlld0NvbnRhaW5lclJlZiNjcmVhdGVFbWJlZGRlZFZpZXd9LCB3aGljaCB3aWxsIGNyZWF0ZSB0aGUgVmlldyBhbmQgYXR0YWNoIGl0IHRvIHRoZVxuICogVmlldyBDb250YWluZXIuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUZW1wbGF0ZVJlZiB7XG4gIC8qKlxuICAgKiBUaGUgbG9jYXRpb24gaW4gdGhlIFZpZXcgd2hlcmUgdGhlIEVtYmVkZGVkIFZpZXcgbG9naWNhbGx5IGJlbG9uZ3MgdG8uXG4gICAqXG4gICAqIFRoZSBkYXRhLWJpbmRpbmcgYW5kIGluamVjdGlvbiBjb250ZXh0cyBvZiBFbWJlZGRlZCBWaWV3cyBjcmVhdGVkIGZyb20gdGhpcyBgVGVtcGxhdGVSZWZgXG4gICAqIGluaGVyaXQgZnJvbSB0aGUgY29udGV4dHMgb2YgdGhpcyBsb2NhdGlvbi5cbiAgICpcbiAgICogVHlwaWNhbGx5IG5ldyBFbWJlZGRlZCBWaWV3cyBhcmUgYXR0YWNoZWQgdG8gdGhlIFZpZXcgQ29udGFpbmVyIG9mIHRoaXMgbG9jYXRpb24sIGJ1dCBpblxuICAgKiBhZHZhbmNlZCB1c2UtY2FzZXMsIHRoZSBWaWV3IGNhbiBiZSBhdHRhY2hlZCB0byBhIGRpZmZlcmVudCBjb250YWluZXIgd2hpbGUga2VlcGluZyB0aGVcbiAgICogZGF0YS1iaW5kaW5nIGFuZCBpbmplY3Rpb24gY29udGV4dCBmcm9tIHRoZSBvcmlnaW5hbCBsb2NhdGlvbi5cbiAgICpcbiAgICovXG4gIC8vIFRPRE8oaSk6IHJlbmFtZSB0byBhbmNob3Igb3IgbG9jYXRpb25cbiAgZ2V0IGVsZW1lbnRSZWYoKTogRWxlbWVudFJlZiB7IHJldHVybiBudWxsOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVJlZl8gZXh0ZW5kcyBUZW1wbGF0ZVJlZiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWZfKSB7IHN1cGVyKCk7IH1cblxuICBnZXQgZWxlbWVudFJlZigpOiBFbGVtZW50UmVmXyB7IHJldHVybiB0aGlzLl9lbGVtZW50UmVmOyB9XG59XG4iXX0=