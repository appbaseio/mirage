import { unimplemented } from 'angular2/src/facade/exceptions';
export class ViewRef {
    /**
     * @internal
     */
    get changeDetectorRef() { return unimplemented(); }
    ;
    get destroyed() { return unimplemented(); }
}
/**
 * Represents a View containing a single Element that is the Host Element of a {@link Component}
 * instance.
 *
 * A Host View is created for every dynamically created Component that was compiled on its own (as
 * opposed to as a part of another Component's Template) via {@link Compiler#compileInHost} or one
 * of the higher-level APIs: {@link AppViewManager#createRootHostView},
 * {@link AppViewManager#createHostViewInContainer}, {@link ViewContainerRef#createHostView}.
 */
export class HostViewRef extends ViewRef {
    get rootNodes() { return unimplemented(); }
    ;
}
/**
 * Represents an Angular View.
 *
 * <!-- TODO: move the next two paragraphs to the dev guide -->
 * A View is a fundamental building block of the application UI. It is the smallest grouping of
 * Elements which are created and destroyed together.
 *
 * Properties of elements in a View can change, but the structure (number and order) of elements in
 * a View cannot. Changing the structure of Elements can only be done by inserting, moving or
 * removing nested Views via a {@link ViewContainerRef}. Each View can contain many View Containers.
 * <!-- /TODO -->
 *
 * ### Example
 *
 * Given this template...
 *
 * ```
 * Count: {{items.length}}
 * <ul>
 *   <li *ngFor="var item of items">{{item}}</li>
 * </ul>
 * ```
 *
 * ... we have two {@link ProtoViewRef}s:
 *
 * Outer {@link ProtoViewRef}:
 * ```
 * Count: {{items.length}}
 * <ul>
 *   <template ngFor var-item [ngForOf]="items"></template>
 * </ul>
 * ```
 *
 * Inner {@link ProtoViewRef}:
 * ```
 *   <li>{{item}}</li>
 * ```
 *
 * Notice that the original template is broken down into two separate {@link ProtoViewRef}s.
 *
 * The outer/inner {@link ProtoViewRef}s are then assembled into views like so:
 *
 * ```
 * <!-- ViewRef: outer-0 -->
 * Count: 2
 * <ul>
 *   <template view-container-ref></template>
 *   <!-- ViewRef: inner-1 --><li>first</li><!-- /ViewRef: inner-1 -->
 *   <!-- ViewRef: inner-2 --><li>second</li><!-- /ViewRef: inner-2 -->
 * </ul>
 * <!-- /ViewRef: outer-0 -->
 * ```
 */
export class EmbeddedViewRef extends ViewRef {
    get rootNodes() { return unimplemented(); }
    ;
}
export class ViewRef_ {
    constructor(_view) {
        this._view = _view;
        this._view = _view;
    }
    get internalView() { return this._view; }
    /**
     * Return `ChangeDetectorRef`
     */
    get changeDetectorRef() { return this._view.changeDetector.ref; }
    get rootNodes() { return this._view.flatRootNodes; }
    setLocal(variableName, value) { this._view.setLocal(variableName, value); }
    hasLocal(variableName) { return this._view.hasLocal(variableName); }
    get destroyed() { return this._view.destroyed; }
}
export class HostViewFactoryRef {
}
export class HostViewFactoryRef_ {
    constructor(_hostViewFactory) {
        this._hostViewFactory = _hostViewFactory;
    }
    get internalHostViewFactory() { return this._hostViewFactory; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19yZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlld19yZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxnQ0FBZ0M7QUFJNUQ7SUFDRTs7T0FFRztJQUNILElBQUksaUJBQWlCLEtBQXdCLE1BQU0sQ0FBb0IsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDOztJQUV6RixJQUFJLFNBQVMsS0FBYyxNQUFNLENBQVUsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILGlDQUEwQyxPQUFPO0lBQy9DLElBQUksU0FBUyxLQUFZLE1BQU0sQ0FBUSxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBQzNELENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9ERztBQUNILHFDQUE4QyxPQUFPO0lBV25ELElBQUksU0FBUyxLQUFZLE1BQU0sQ0FBUSxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBQzNELENBQUM7QUFFRDtJQUNFLFlBQW9CLEtBQWM7UUFBZCxVQUFLLEdBQUwsS0FBSyxDQUFTO1FBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFBQyxDQUFDO0lBRTNELElBQUksWUFBWSxLQUFjLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUVsRDs7T0FFRztJQUNILElBQUksaUJBQWlCLEtBQXdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRXBGLElBQUksU0FBUyxLQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFFM0QsUUFBUSxDQUFDLFlBQW9CLEVBQUUsS0FBVSxJQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFOUYsUUFBUSxDQUFDLFlBQW9CLElBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVyRixJQUFJLFNBQVMsS0FBYyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRDtBQUEwQyxDQUFDO0FBRTNDO0lBQ0UsWUFBb0IsZ0JBQWlDO1FBQWpDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBaUI7SUFBRyxDQUFDO0lBRXpELElBQUksdUJBQXVCLEtBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dW5pbXBsZW1lbnRlZH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJy4uL2NoYW5nZV9kZXRlY3Rpb24vY2hhbmdlX2RldGVjdG9yX3JlZic7XG5pbXBvcnQge0FwcFZpZXcsIEhvc3RWaWV3RmFjdG9yeX0gZnJvbSAnLi92aWV3JztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZpZXdSZWYge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBnZXQgY2hhbmdlRGV0ZWN0b3JSZWYoKTogQ2hhbmdlRGV0ZWN0b3JSZWYgeyByZXR1cm4gPENoYW5nZURldGVjdG9yUmVmPnVuaW1wbGVtZW50ZWQoKTsgfTtcblxuICBnZXQgZGVzdHJveWVkKCk6IGJvb2xlYW4geyByZXR1cm4gPGJvb2xlYW4+dW5pbXBsZW1lbnRlZCgpOyB9XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIFZpZXcgY29udGFpbmluZyBhIHNpbmdsZSBFbGVtZW50IHRoYXQgaXMgdGhlIEhvc3QgRWxlbWVudCBvZiBhIHtAbGluayBDb21wb25lbnR9XG4gKiBpbnN0YW5jZS5cbiAqXG4gKiBBIEhvc3QgVmlldyBpcyBjcmVhdGVkIGZvciBldmVyeSBkeW5hbWljYWxseSBjcmVhdGVkIENvbXBvbmVudCB0aGF0IHdhcyBjb21waWxlZCBvbiBpdHMgb3duIChhc1xuICogb3Bwb3NlZCB0byBhcyBhIHBhcnQgb2YgYW5vdGhlciBDb21wb25lbnQncyBUZW1wbGF0ZSkgdmlhIHtAbGluayBDb21waWxlciNjb21waWxlSW5Ib3N0fSBvciBvbmVcbiAqIG9mIHRoZSBoaWdoZXItbGV2ZWwgQVBJczoge0BsaW5rIEFwcFZpZXdNYW5hZ2VyI2NyZWF0ZVJvb3RIb3N0Vmlld30sXG4gKiB7QGxpbmsgQXBwVmlld01hbmFnZXIjY3JlYXRlSG9zdFZpZXdJbkNvbnRhaW5lcn0sIHtAbGluayBWaWV3Q29udGFpbmVyUmVmI2NyZWF0ZUhvc3RWaWV3fS5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEhvc3RWaWV3UmVmIGV4dGVuZHMgVmlld1JlZiB7XG4gIGdldCByb290Tm9kZXMoKTogYW55W10geyByZXR1cm4gPGFueVtdPnVuaW1wbGVtZW50ZWQoKTsgfTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIEFuZ3VsYXIgVmlldy5cbiAqXG4gKiA8IS0tIFRPRE86IG1vdmUgdGhlIG5leHQgdHdvIHBhcmFncmFwaHMgdG8gdGhlIGRldiBndWlkZSAtLT5cbiAqIEEgVmlldyBpcyBhIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrIG9mIHRoZSBhcHBsaWNhdGlvbiBVSS4gSXQgaXMgdGhlIHNtYWxsZXN0IGdyb3VwaW5nIG9mXG4gKiBFbGVtZW50cyB3aGljaCBhcmUgY3JlYXRlZCBhbmQgZGVzdHJveWVkIHRvZ2V0aGVyLlxuICpcbiAqIFByb3BlcnRpZXMgb2YgZWxlbWVudHMgaW4gYSBWaWV3IGNhbiBjaGFuZ2UsIGJ1dCB0aGUgc3RydWN0dXJlIChudW1iZXIgYW5kIG9yZGVyKSBvZiBlbGVtZW50cyBpblxuICogYSBWaWV3IGNhbm5vdC4gQ2hhbmdpbmcgdGhlIHN0cnVjdHVyZSBvZiBFbGVtZW50cyBjYW4gb25seSBiZSBkb25lIGJ5IGluc2VydGluZywgbW92aW5nIG9yXG4gKiByZW1vdmluZyBuZXN0ZWQgVmlld3MgdmlhIGEge0BsaW5rIFZpZXdDb250YWluZXJSZWZ9LiBFYWNoIFZpZXcgY2FuIGNvbnRhaW4gbWFueSBWaWV3IENvbnRhaW5lcnMuXG4gKiA8IS0tIC9UT0RPIC0tPlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogR2l2ZW4gdGhpcyB0ZW1wbGF0ZS4uLlxuICpcbiAqIGBgYFxuICogQ291bnQ6IHt7aXRlbXMubGVuZ3RofX1cbiAqIDx1bD5cbiAqICAgPGxpICpuZ0Zvcj1cInZhciBpdGVtIG9mIGl0ZW1zXCI+e3tpdGVtfX08L2xpPlxuICogPC91bD5cbiAqIGBgYFxuICpcbiAqIC4uLiB3ZSBoYXZlIHR3byB7QGxpbmsgUHJvdG9WaWV3UmVmfXM6XG4gKlxuICogT3V0ZXIge0BsaW5rIFByb3RvVmlld1JlZn06XG4gKiBgYGBcbiAqIENvdW50OiB7e2l0ZW1zLmxlbmd0aH19XG4gKiA8dWw+XG4gKiAgIDx0ZW1wbGF0ZSBuZ0ZvciB2YXItaXRlbSBbbmdGb3JPZl09XCJpdGVtc1wiPjwvdGVtcGxhdGU+XG4gKiA8L3VsPlxuICogYGBgXG4gKlxuICogSW5uZXIge0BsaW5rIFByb3RvVmlld1JlZn06XG4gKiBgYGBcbiAqICAgPGxpPnt7aXRlbX19PC9saT5cbiAqIGBgYFxuICpcbiAqIE5vdGljZSB0aGF0IHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSBpcyBicm9rZW4gZG93biBpbnRvIHR3byBzZXBhcmF0ZSB7QGxpbmsgUHJvdG9WaWV3UmVmfXMuXG4gKlxuICogVGhlIG91dGVyL2lubmVyIHtAbGluayBQcm90b1ZpZXdSZWZ9cyBhcmUgdGhlbiBhc3NlbWJsZWQgaW50byB2aWV3cyBsaWtlIHNvOlxuICpcbiAqIGBgYFxuICogPCEtLSBWaWV3UmVmOiBvdXRlci0wIC0tPlxuICogQ291bnQ6IDJcbiAqIDx1bD5cbiAqICAgPHRlbXBsYXRlIHZpZXctY29udGFpbmVyLXJlZj48L3RlbXBsYXRlPlxuICogICA8IS0tIFZpZXdSZWY6IGlubmVyLTEgLS0+PGxpPmZpcnN0PC9saT48IS0tIC9WaWV3UmVmOiBpbm5lci0xIC0tPlxuICogICA8IS0tIFZpZXdSZWY6IGlubmVyLTIgLS0+PGxpPnNlY29uZDwvbGk+PCEtLSAvVmlld1JlZjogaW5uZXItMiAtLT5cbiAqIDwvdWw+XG4gKiA8IS0tIC9WaWV3UmVmOiBvdXRlci0wIC0tPlxuICogYGBgXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbWJlZGRlZFZpZXdSZWYgZXh0ZW5kcyBWaWV3UmVmIHtcbiAgLyoqXG4gICAqIFNldHMgYHZhbHVlYCBvZiBsb2NhbCB2YXJpYWJsZSBjYWxsZWQgYHZhcmlhYmxlTmFtZWAgaW4gdGhpcyBWaWV3LlxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0TG9jYWwodmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGlzIHZpZXcgaGFzIGEgbG9jYWwgdmFyaWFibGUgY2FsbGVkIGB2YXJpYWJsZU5hbWVgLlxuICAgKi9cbiAgYWJzdHJhY3QgaGFzTG9jYWwodmFyaWFibGVOYW1lOiBzdHJpbmcpOiBib29sZWFuO1xuXG4gIGdldCByb290Tm9kZXMoKTogYW55W10geyByZXR1cm4gPGFueVtdPnVuaW1wbGVtZW50ZWQoKTsgfTtcbn1cblxuZXhwb3J0IGNsYXNzIFZpZXdSZWZfIGltcGxlbWVudHMgRW1iZWRkZWRWaWV3UmVmLCBIb3N0Vmlld1JlZiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3ZpZXc6IEFwcFZpZXcpIHsgdGhpcy5fdmlldyA9IF92aWV3OyB9XG5cbiAgZ2V0IGludGVybmFsVmlldygpOiBBcHBWaWV3IHsgcmV0dXJuIHRoaXMuX3ZpZXc7IH1cblxuICAvKipcbiAgICogUmV0dXJuIGBDaGFuZ2VEZXRlY3RvclJlZmBcbiAgICovXG4gIGdldCBjaGFuZ2VEZXRlY3RvclJlZigpOiBDaGFuZ2VEZXRlY3RvclJlZiB7IHJldHVybiB0aGlzLl92aWV3LmNoYW5nZURldGVjdG9yLnJlZjsgfVxuXG4gIGdldCByb290Tm9kZXMoKTogYW55W10geyByZXR1cm4gdGhpcy5fdmlldy5mbGF0Um9vdE5vZGVzOyB9XG5cbiAgc2V0TG9jYWwodmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHsgdGhpcy5fdmlldy5zZXRMb2NhbCh2YXJpYWJsZU5hbWUsIHZhbHVlKTsgfVxuXG4gIGhhc0xvY2FsKHZhcmlhYmxlTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl92aWV3Lmhhc0xvY2FsKHZhcmlhYmxlTmFtZSk7IH1cblxuICBnZXQgZGVzdHJveWVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fdmlldy5kZXN0cm95ZWQ7IH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEhvc3RWaWV3RmFjdG9yeVJlZiB7fVxuXG5leHBvcnQgY2xhc3MgSG9zdFZpZXdGYWN0b3J5UmVmXyBpbXBsZW1lbnRzIEhvc3RWaWV3RmFjdG9yeVJlZiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2hvc3RWaWV3RmFjdG9yeTogSG9zdFZpZXdGYWN0b3J5KSB7fVxuXG4gIGdldCBpbnRlcm5hbEhvc3RWaWV3RmFjdG9yeSgpOiBIb3N0Vmlld0ZhY3RvcnkgeyByZXR1cm4gdGhpcy5faG9zdFZpZXdGYWN0b3J5OyB9XG59XG4iXX0=