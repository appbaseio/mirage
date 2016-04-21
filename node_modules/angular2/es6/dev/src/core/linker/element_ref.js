import { unimplemented } from 'angular2/src/facade/exceptions';
/**
 * Represents a location in a View that has an injection, change-detection and render context
 * associated with it.
 *
 * An `ElementRef` is created for each element in the Template that contains a Directive, Component
 * or data-binding.
 *
 * An `ElementRef` is backed by a render-specific element. In the browser, this is usually a DOM
 * element.
 */
export class ElementRef {
    /**
     * The underlying native element or `null` if direct access to native elements is not supported
     * (e.g. when the application runs in a web worker).
     *
     * <div class="callout is-critical">
     *   <header>Use with caution</header>
     *   <p>
     *    Use this API as the last resort when direct access to DOM is needed. Use templating and
     *    data-binding provided by Angular instead. Alternatively you take a look at {@link Renderer}
     *    which provides API that can safely be used even when direct access to native elements is not
     *    supported.
     *   </p>
     *   <p>
     *    Relying on direct DOM access creates tight coupling between your application and rendering
     *    layers which will make it impossible to separate the two and deploy your application into a
     *    web worker.
     *   </p>
     * </div>
     */
    get nativeElement() { return unimplemented(); }
}
export class ElementRef_ {
    constructor(_appElement) {
        this._appElement = _appElement;
    }
    get internalElement() { return this._appElement; }
    get nativeElement() { return this._appElement.nativeElement; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudF9yZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvZWxlbWVudF9yZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxnQ0FBZ0M7QUFHNUQ7Ozs7Ozs7OztHQVNHO0FBQ0g7SUFDRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Ba0JHO0lBQ0gsSUFBSSxhQUFhLEtBQVUsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBRUQ7SUFDRSxZQUFvQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7SUFFL0MsSUFBSSxlQUFlLEtBQWlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUU5RCxJQUFJLGFBQWEsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dW5pbXBsZW1lbnRlZH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7QXBwRWxlbWVudH0gZnJvbSAnLi9lbGVtZW50JztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgbG9jYXRpb24gaW4gYSBWaWV3IHRoYXQgaGFzIGFuIGluamVjdGlvbiwgY2hhbmdlLWRldGVjdGlvbiBhbmQgcmVuZGVyIGNvbnRleHRcbiAqIGFzc29jaWF0ZWQgd2l0aCBpdC5cbiAqXG4gKiBBbiBgRWxlbWVudFJlZmAgaXMgY3JlYXRlZCBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBUZW1wbGF0ZSB0aGF0IGNvbnRhaW5zIGEgRGlyZWN0aXZlLCBDb21wb25lbnRcbiAqIG9yIGRhdGEtYmluZGluZy5cbiAqXG4gKiBBbiBgRWxlbWVudFJlZmAgaXMgYmFja2VkIGJ5IGEgcmVuZGVyLXNwZWNpZmljIGVsZW1lbnQuIEluIHRoZSBicm93c2VyLCB0aGlzIGlzIHVzdWFsbHkgYSBET01cbiAqIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbGVtZW50UmVmIHtcbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIG5hdGl2ZSBlbGVtZW50IG9yIGBudWxsYCBpZiBkaXJlY3QgYWNjZXNzIHRvIG5hdGl2ZSBlbGVtZW50cyBpcyBub3Qgc3VwcG9ydGVkXG4gICAqIChlLmcuIHdoZW4gdGhlIGFwcGxpY2F0aW9uIHJ1bnMgaW4gYSB3ZWIgd29ya2VyKS5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cImNhbGxvdXQgaXMtY3JpdGljYWxcIj5cbiAgICogICA8aGVhZGVyPlVzZSB3aXRoIGNhdXRpb248L2hlYWRlcj5cbiAgICogICA8cD5cbiAgICogICAgVXNlIHRoaXMgQVBJIGFzIHRoZSBsYXN0IHJlc29ydCB3aGVuIGRpcmVjdCBhY2Nlc3MgdG8gRE9NIGlzIG5lZWRlZC4gVXNlIHRlbXBsYXRpbmcgYW5kXG4gICAqICAgIGRhdGEtYmluZGluZyBwcm92aWRlZCBieSBBbmd1bGFyIGluc3RlYWQuIEFsdGVybmF0aXZlbHkgeW91IHRha2UgYSBsb29rIGF0IHtAbGluayBSZW5kZXJlcn1cbiAgICogICAgd2hpY2ggcHJvdmlkZXMgQVBJIHRoYXQgY2FuIHNhZmVseSBiZSB1c2VkIGV2ZW4gd2hlbiBkaXJlY3QgYWNjZXNzIHRvIG5hdGl2ZSBlbGVtZW50cyBpcyBub3RcbiAgICogICAgc3VwcG9ydGVkLlxuICAgKiAgIDwvcD5cbiAgICogICA8cD5cbiAgICogICAgUmVseWluZyBvbiBkaXJlY3QgRE9NIGFjY2VzcyBjcmVhdGVzIHRpZ2h0IGNvdXBsaW5nIGJldHdlZW4geW91ciBhcHBsaWNhdGlvbiBhbmQgcmVuZGVyaW5nXG4gICAqICAgIGxheWVycyB3aGljaCB3aWxsIG1ha2UgaXQgaW1wb3NzaWJsZSB0byBzZXBhcmF0ZSB0aGUgdHdvIGFuZCBkZXBsb3kgeW91ciBhcHBsaWNhdGlvbiBpbnRvIGFcbiAgICogICAgd2ViIHdvcmtlci5cbiAgICogICA8L3A+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgZ2V0IG5hdGl2ZUVsZW1lbnQoKTogYW55IHsgcmV0dXJuIHVuaW1wbGVtZW50ZWQoKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudFJlZl8gaW1wbGVtZW50cyBFbGVtZW50UmVmIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfYXBwRWxlbWVudDogQXBwRWxlbWVudCkge31cblxuICBnZXQgaW50ZXJuYWxFbGVtZW50KCk6IEFwcEVsZW1lbnQgeyByZXR1cm4gdGhpcy5fYXBwRWxlbWVudDsgfVxuXG4gIGdldCBuYXRpdmVFbGVtZW50KCkgeyByZXR1cm4gdGhpcy5fYXBwRWxlbWVudC5uYXRpdmVFbGVtZW50OyB9XG59XG4iXX0=