var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/src/core/di';
import { Map, ListWrapper } from 'angular2/src/facade/collection';
import { isPresent, stringify, isBlank } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { ViewMetadata } from '../core/metadata';
import { ViewResolver } from 'angular2/src/core/linker/view_resolver';
export let MockViewResolver = class MockViewResolver extends ViewResolver {
    constructor() {
        super();
        /** @internal */
        this._views = new Map();
        /** @internal */
        this._inlineTemplates = new Map();
        /** @internal */
        this._viewCache = new Map();
        /** @internal */
        this._directiveOverrides = new Map();
    }
    /**
     * Overrides the {@link ViewMetadata} for a component.
     *
     * @param {Type} component
     * @param {ViewDefinition} view
     */
    setView(component, view) {
        this._checkOverrideable(component);
        this._views.set(component, view);
    }
    /**
     * Overrides the inline template for a component - other configuration remains unchanged.
     *
     * @param {Type} component
     * @param {string} template
     */
    setInlineTemplate(component, template) {
        this._checkOverrideable(component);
        this._inlineTemplates.set(component, template);
    }
    /**
     * Overrides a directive from the component {@link ViewMetadata}.
     *
     * @param {Type} component
     * @param {Type} from
     * @param {Type} to
     */
    overrideViewDirective(component, from, to) {
        this._checkOverrideable(component);
        var overrides = this._directiveOverrides.get(component);
        if (isBlank(overrides)) {
            overrides = new Map();
            this._directiveOverrides.set(component, overrides);
        }
        overrides.set(from, to);
    }
    /**
     * Returns the {@link ViewMetadata} for a component:
     * - Set the {@link ViewMetadata} to the overridden view when it exists or fallback to the default
     * `ViewResolver`,
     *   see `setView`.
     * - Override the directives, see `overrideViewDirective`.
     * - Override the @View definition, see `setInlineTemplate`.
     *
     * @param component
     * @returns {ViewDefinition}
     */
    resolve(component) {
        var view = this._viewCache.get(component);
        if (isPresent(view))
            return view;
        view = this._views.get(component);
        if (isBlank(view)) {
            view = super.resolve(component);
        }
        var directives = view.directives;
        var overrides = this._directiveOverrides.get(component);
        if (isPresent(overrides) && isPresent(directives)) {
            directives = ListWrapper.clone(view.directives);
            overrides.forEach((to, from) => {
                var srcIndex = directives.indexOf(from);
                if (srcIndex == -1) {
                    throw new BaseException(`Overriden directive ${stringify(from)} not found in the template of ${stringify(component)}`);
                }
                directives[srcIndex] = to;
            });
            view = new ViewMetadata({ template: view.template, templateUrl: view.templateUrl, directives: directives });
        }
        var inlineTemplate = this._inlineTemplates.get(component);
        if (isPresent(inlineTemplate)) {
            view = new ViewMetadata({ template: inlineTemplate, templateUrl: null, directives: view.directives });
        }
        this._viewCache.set(component, view);
        return view;
    }
    /**
     * @internal
     *
     * Once a component has been compiled, the AppProtoView is stored in the compiler cache.
     *
     * Then it should not be possible to override the component configuration after the component
     * has been compiled.
     *
     * @param {Type} component
     */
    _checkOverrideable(component) {
        var cached = this._viewCache.get(component);
        if (isPresent(cached)) {
            throw new BaseException(`The component ${stringify(component)} has already been compiled, its configuration can not be changed`);
        }
    }
};
MockViewResolver = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], MockViewResolver);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19yZXNvbHZlcl9tb2NrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL21vY2svdmlld19yZXNvbHZlcl9tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCO09BQ3hDLEVBQUMsR0FBRyxFQUFjLFdBQVcsRUFBQyxNQUFNLGdDQUFnQztPQUNwRSxFQUFPLFNBQVMsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFDLE1BQU0sMEJBQTBCO09BQ3JFLEVBQUMsYUFBYSxFQUFtQixNQUFNLGdDQUFnQztPQUV2RSxFQUFDLFlBQVksRUFBQyxNQUFNLGtCQUFrQjtPQUN0QyxFQUFDLFlBQVksRUFBQyxNQUFNLHdDQUF3QztBQUduRSw2REFBc0MsWUFBWTtJQVVoRDtRQUFnQixPQUFPLENBQUM7UUFUeEIsZ0JBQWdCO1FBQ2hCLFdBQU0sR0FBRyxJQUFJLEdBQUcsRUFBc0IsQ0FBQztRQUN2QyxnQkFBZ0I7UUFDaEIscUJBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQWdCLENBQUM7UUFDM0MsZ0JBQWdCO1FBQ2hCLGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBc0IsQ0FBQztRQUMzQyxnQkFBZ0I7UUFDaEIsd0JBQW1CLEdBQUcsSUFBSSxHQUFHLEVBQXlCLENBQUM7SUFFOUIsQ0FBQztJQUUxQjs7Ozs7T0FLRztJQUNILE9BQU8sQ0FBQyxTQUFlLEVBQUUsSUFBa0I7UUFDekMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxpQkFBaUIsQ0FBQyxTQUFlLEVBQUUsUUFBZ0I7UUFDakQsSUFBSSxDQUFD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Q0FBQyxDQUFDO1FBQ2xGLENBQUM7UUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxrQkFBa0IsQ0FBQyxTQUFlO1FBQ2hDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTVDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsTUFBTSxJQUFJLGFBQWEsQ0FDbkIsaUJBQWlCLFNBQVMsQ0FBQyxTQUFTLENBQUMsa0VBQWtFLENBQUMsQ0FBQztRQUMvRyxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUF4SEQ7SUFBQyxVQUFVLEVBQUU7O29CQUFBO0FBd0haIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge01hcCwgTWFwV3JhcHBlciwgTGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1R5cGUsIGlzUHJlc2VudCwgc3RyaW5naWZ5LCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBXcmFwcGVkRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuXG5pbXBvcnQge1ZpZXdNZXRhZGF0YX0gZnJvbSAnLi4vY29yZS9tZXRhZGF0YSc7XG5pbXBvcnQge1ZpZXdSZXNvbHZlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3ZpZXdfcmVzb2x2ZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTW9ja1ZpZXdSZXNvbHZlciBleHRlbmRzIFZpZXdSZXNvbHZlciB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3ZpZXdzID0gbmV3IE1hcDxUeXBlLCBWaWV3TWV0YWRhdGE+KCk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2lubGluZVRlbXBsYXRlcyA9IG5ldyBNYXA8VHlwZSwgc3RyaW5nPigpO1xuICAvKiogQGludGVybmFsICovXG4gIF92aWV3Q2FjaGUgPSBuZXcgTWFwPFR5cGUsIFZpZXdNZXRhZGF0YT4oKTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZGlyZWN0aXZlT3ZlcnJpZGVzID0gbmV3IE1hcDxUeXBlLCBNYXA8VHlwZSwgVHlwZT4+KCk7XG5cbiAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIHRoZSB7QGxpbmsgVmlld01ldGFkYXRhfSBmb3IgYSBjb21wb25lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7VHlwZX0gY29tcG9uZW50XG4gICAqIEBwYXJhbSB7Vmlld0RlZmluaXRpb259IHZpZXdcbiAgICovXG4gIHNldFZpZXcoY29tcG9uZW50OiBUeXBlLCB2aWV3OiBWaWV3TWV0YWRhdGEpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGVja092ZXJyaWRlYWJsZShjb21wb25lbnQpO1xuICAgIHRoaXMuX3ZpZXdzLnNldChjb21wb25lbnQsIHZpZXcpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUgaW5saW5lIHRlbXBsYXRlIGZvciBhIGNvbXBvbmVudCAtIG90aGVyIGNvbmZpZ3VyYXRpb24gcmVtYWlucyB1bmNoYW5nZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7VHlwZX0gY29tcG9uZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZVxuICAgKi9cbiAgc2V0SW5saW5lVGVtcGxhdGUoY29tcG9uZW50OiBUeXBlLCB0ZW1wbGF0ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tPdmVycmlkZWFibGUoY29tcG9uZW50KTtcbiAgICB0aGlzLl9pbmxpbmVUZW1wbGF0ZXMuc2V0KGNvbXBvbmVudCwgdGVtcGxhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyBhIGRpcmVjdGl2ZSBmcm9tIHRoZSBjb21wb25lbnQge0BsaW5rIFZpZXdNZXRhZGF0YX0uXG4gICAqXG4gICAqIEBwYXJhbSB7VHlwZX0gY29tcG9uZW50XG4gICAqIEBwYXJhbSB7VHlwZX0gZnJvbVxuICAgKiBAcGFyYW0ge1R5cGV9IHRvXG4gICAqL1xuICBvdmVycmlkZVZpZXdEaXJlY3RpdmUoY29tcG9uZW50OiBUeXBlLCBmcm9tOiBUeXBlLCB0bzogVHlwZSk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrT3ZlcnJpZGVhYmxlKGNvbXBvbmVudCk7XG5cbiAgICB2YXIgb3ZlcnJpZGVzID0gdGhpcy5fZGlyZWN0aXZlT3ZlcnJpZGVzLmdldChjb21wb25lbnQpO1xuXG4gICAgaWYgKGlzQmxhbmsob3ZlcnJpZGVzKSkge1xuICAgICAgb3ZlcnJpZGVzID0gbmV3IE1hcDxUeXBlLCBUeXBlPigpO1xuICAgICAgdGhpcy5fZGlyZWN0aXZlT3ZlcnJpZGVzLnNldChjb21wb25lbnQsIG92ZXJyaWRlcyk7XG4gICAgfVxuXG4gICAgb3ZlcnJpZGVzLnNldChmcm9tLCB0byk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUge0BsaW5rIFZpZXdNZXRhZGF0YX0gZm9yIGEgY29tcG9uZW50OlxuICAgKiAtIFNldCB0aGUge0BsaW5rIFZpZXdNZXRhZGF0YX0gdG8gdGhlIG92ZXJyaWRkZW4gdmlldyB3aGVuIGl0IGV4aXN0cyBvciBmYWxsYmFjayB0byB0aGUgZGVmYXVsdFxuICAgKiBgVmlld1Jlc29sdmVyYCxcbiAgICogICBzZWUgYHNldFZpZXdgLlxuICAgKiAtIE92ZXJyaWRlIHRoZSBkaXJlY3RpdmVzLCBzZWUgYG92ZXJyaWRlVmlld0RpcmVjdGl2ZWAuXG4gICAqIC0gT3ZlcnJpZGUgdGhlIEBWaWV3IGRlZmluaXRpb24sIHNlZSBgc2V0SW5saW5lVGVtcGxhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0gY29tcG9uZW50XG4gICAqIEByZXR1cm5zIHtWaWV3RGVmaW5pdGlvbn1cbiAgICovXG4gIHJlc29sdmUoY29tcG9uZW50OiBUeXBlKTogVmlld01ldGFkYXRhIHtcbiAgICB2YXIgdmlldyA9IHRoaXMuX3ZpZXdDYWNoZS5nZXQoY29tcG9uZW50KTtcbiAgICBpZiAoaXNQcmVzZW50KHZpZXcpKSByZXR1cm4gdmlldztcblxuICAgIHZpZXcgPSB0aGlzLl92aWV3cy5nZXQoY29tcG9uZW50KTtcbiAgICBpZiAoaXNCbGFuayh2aWV3KSkge1xuICAgICAgdmlldyA9IHN1cGVyLnJlc29sdmUoY29tcG9uZW50KTtcbiAgICB9XG5cbiAgICB2YXIgZGlyZWN0aXZlcyA9IHZpZXcuZGlyZWN0aXZlcztcbiAgICB2YXIgb3ZlcnJpZGVzID0gdGhpcy5fZGlyZWN0aXZlT3ZlcnJpZGVzLmdldChjb21wb25lbnQpO1xuXG4gICAgaWYgKGlzUHJlc2VudChvdmVycmlkZXMpICYmIGlzUHJlc2VudChkaXJlY3RpdmVzKSkge1xuICAgICAgZGlyZWN0aXZlcyA9IExpc3RXcmFwcGVyLmNsb25lKHZpZXcuZGlyZWN0aXZlcyk7XG4gICAgICBvdmVycmlkZXMuZm9yRWFjaCgodG8sIGZyb20pID0+IHtcbiAgICAgICAgdmFyIHNyY0luZGV4ID0gZGlyZWN0aXZlcy5pbmRleE9mKGZyb20pO1xuICAgICAgICBpZiAoc3JjSW5kZXggPT0gLTEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcbiAgICAgICAgICAgICAgYE92ZXJyaWRlbiBkaXJlY3RpdmUgJHtzdHJpbmdpZnkoZnJvbSl9IG5vdCBmb3VuZCBpbiB0aGUgdGVtcGxhdGUgb2YgJHtzdHJpbmdpZnkoY29tcG9uZW50KX1gKTtcbiAgICAgICAgfVxuICAgICAgICBkaXJlY3RpdmVzW3NyY0luZGV4XSA9IHRvO1xuICAgICAgfSk7XG4gICAgICB2aWV3ID0gbmV3IFZpZXdNZXRhZGF0YShcbiAgICAgICAgICB7dGVtcGxhdGU6IHZpZXcudGVtcGxhdGUsIHRlbXBsYXRlVXJsOiB2aWV3LnRlbXBsYXRlVXJsLCBkaXJlY3RpdmVzOiBkaXJlY3RpdmVzfSk7XG4gICAgfVxuXG4gICAgdmFyIGlubGluZVRlbXBsYXRlID0gdGhpcy5faW5saW5lVGVtcGxhdGVzLmdldChjb21wb25lbnQpO1xuICAgIGlmIChpc1ByZXNlbnQoaW5saW5lVGVtcGxhdGUpKSB7XG4gICAgICB2aWV3ID0gbmV3IFZpZXdNZXRhZGF0YShcbiAgICAgICAgICB7dGVtcGxhdGU6IGlubGluZVRlbXBsYXRlLCB0ZW1wbGF0ZVVybDogbnVsbCwgZGlyZWN0aXZlczogdmlldy5kaXJlY3RpdmVzfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fdmlld0NhY2hlLnNldChjb21wb25lbnQsIHZpZXcpO1xuICAgIHJldHVybiB2aWV3O1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKlxuICAgKiBPbmNlIGEgY29tcG9uZW50IGhhcyBiZWVuIGNvbXBpbGVkLCB0aGUgQXBwUHJvdG9WaWV3IGlzIHN0b3JlZCBpbiB0aGUgY29tcGlsZXIgY2FjaGUuXG4gICAqXG4gICAqIFRoZW4gaXQgc2hvdWxkIG5vdCBiZSBwb3NzaWJsZSB0byBvdmVycmlkZSB0aGUgY29tcG9uZW50IGNvbmZpZ3VyYXRpb24gYWZ0ZXIgdGhlIGNvbXBvbmVudFxuICAgKiBoYXMgYmVlbiBjb21waWxlZC5cbiAgICpcbiAgICogQHBhcmFtIHtUeXBlfSBjb21wb25lbnRcbiAgICovXG4gIF9jaGVja092ZXJyaWRlYWJsZShjb21wb25lbnQ6IFR5cGUpOiB2b2lkIHtcbiAgICB2YXIgY2FjaGVkID0gdGhpcy5fdmlld0NhY2hlLmdldChjb21wb25lbnQpO1xuXG4gICAgaWYgKGlzUHJlc2VudChjYWNoZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcbiAgICAgICAgICBgVGhlIGNvbXBvbmVudCAke3N0cmluZ2lmeShjb21wb25lbnQpfSBoYXMgYWxyZWFkeSBiZWVuIGNvbXBpbGVkLCBpdHMgY29uZmlndXJhdGlvbiBjYW4gbm90IGJlIGNoYW5nZWRgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==