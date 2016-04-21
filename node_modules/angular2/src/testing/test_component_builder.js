'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var utils_1 = require('./utils');
var dom_tokens_1 = require('angular2/src/platform/dom/dom_tokens');
var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var debug_node_1 = require('angular2/src/core/debug/debug_node');
/**
 * Fixture for debugging and testing a component.
 */
var ComponentFixture = (function () {
    function ComponentFixture() {
    }
    return ComponentFixture;
}());
exports.ComponentFixture = ComponentFixture;
var ComponentFixture_ = (function (_super) {
    __extends(ComponentFixture_, _super);
    function ComponentFixture_(componentRef) {
        _super.call(this);
        this._componentParentView = componentRef.hostView.internalView;
        this.elementRef = this._componentParentView.appElements[0].ref;
        this.debugElement = debug_node_1.getDebugNode(this._componentParentView.rootNodesOrAppElements[0].nativeElement);
        this.componentInstance = this.debugElement.componentInstance;
        this.nativeElement = this.debugElement.nativeElement;
        this._componentRef = componentRef;
    }
    ComponentFixture_.prototype.detectChanges = function () {
        this._componentParentView.changeDetector.detectChanges();
        this._componentParentView.changeDetector.checkNoChanges();
    };
    ComponentFixture_.prototype.destroy = function () { this._componentRef.dispose(); };
    return ComponentFixture_;
}(ComponentFixture));
exports.ComponentFixture_ = ComponentFixture_;
var _nextRootElementId = 0;
/**
 * Builds a ComponentFixture for use in component level tests.
 */
var TestComponentBuilder = (function () {
    function TestComponentBuilder(_injector) {
        this._injector = _injector;
        /** @internal */
        this._bindingsOverrides = new Map();
        /** @internal */
        this._directiveOverrides = new Map();
        /** @internal */
        this._templateOverrides = new Map();
        /** @internal */
        this._viewBindingsOverrides = new Map();
        /** @internal */
        this._viewOverrides = new Map();
    }
    /** @internal */
    TestComponentBuilder.prototype._clone = function () {
        var clone = new TestComponentBuilder(this._injector);
        clone._viewOverrides = collection_1.MapWrapper.clone(this._viewOverrides);
        clone._directiveOverrides = collection_1.MapWrapper.clone(this._directiveOverrides);
        clone._templateOverrides = collection_1.MapWrapper.clone(this._templateOverrides);
        return clone;
    };
    /**
     * Overrides only the html of a {@link ComponentMetadata}.
     * All the other properties of the component's {@link ViewMetadata} are preserved.
     *
     * @param {Type} component
     * @param {string} html
     *
     * @return {TestComponentBuilder}
     */
    TestComponentBuilder.prototype.overrideTemplate = function (componentType, template) {
        var clone = this._clone();
        clone._templateOverrides.set(componentType, template);
        return clone;
    };
    /**
     * Overrides a component's {@link ViewMetadata}.
     *
     * @param {Type} component
     * @param {view} View
     *
     * @return {TestComponentBuilder}
     */
    TestComponentBuilder.prototype.overrideView = function (componentType, view) {
        var clone = this._clone();
        clone._viewOverrides.set(componentType, view);
        return clone;
    };
    /**
     * Overrides the directives from the component {@link ViewMetadata}.
     *
     * @param {Type} component
     * @param {Type} from
     * @param {Type} to
     *
     * @return {TestComponentBuilder}
     */
    TestComponentBuilder.prototype.overrideDirective = function (componentType, from, to) {
        var clone = this._clone();
        var overridesForComponent = clone._directiveOverrides.get(componentType);
        if (!lang_1.isPresent(overridesForComponent)) {
            clone._directiveOverrides.set(componentType, new Map());
            overridesForComponent = clone._directiveOverrides.get(componentType);
        }
        overridesForComponent.set(from, to);
        return clone;
    };
    /**
     * Overrides one or more injectables configured via `providers` metadata property of a directive
     * or
     * component.
     * Very useful when certain providers need to be mocked out.
     *
     * The providers specified via this method are appended to the existing `providers` causing the
     * duplicated providers to
     * be overridden.
     *
     * @param {Type} component
     * @param {any[]} providers
     *
     * @return {TestComponentBuilder}
     */
    TestComponentBuilder.prototype.overrideProviders = function (type, providers) {
        var clone = this._clone();
        clone._bindingsOverrides.set(type, providers);
        return clone;
    };
    /**
     * @deprecated
     */
    TestComponentBuilder.prototype.overrideBindings = function (type, providers) {
        return this.overrideProviders(type, providers);
    };
    /**
     * Overrides one or more injectables configured via `providers` metadata property of a directive
     * or
     * component.
     * Very useful when certain providers need to be mocked out.
     *
     * The providers specified via this method are appended to the existing `providers` causing the
     * duplicated providers to
     * be overridden.
     *
     * @param {Type} component
     * @param {any[]} providers
     *
     * @return {TestComponentBuilder}
     */
    TestComponentBuilder.prototype.overrideViewProviders = function (type, providers) {
        var clone = this._clone();
        clone._viewBindingsOverrides.set(type, providers);
        return clone;
    };
    /**
     * @deprecated
     */
    TestComponentBuilder.prototype.overrideViewBindings = function (type, providers) {
        return this.overrideViewProviders(type, providers);
    };
    /**
     * Builds and returns a ComponentFixture.
     *
     * @return {Promise<ComponentFixture>}
     */
    TestComponentBuilder.prototype.createAsync = function (rootComponentType) {
        var mockDirectiveResolver = this._injector.get(core_1.DirectiveResolver);
        var mockViewResolver = this._injector.get(core_1.ViewResolver);
        this._viewOverrides.forEach(function (view, type) { return mockViewResolver.setView(type, view); });
        this._templateOverrides.forEach(function (template, type) {
            return mockViewResolver.setInlineTemplate(type, template);
        });
        this._directiveOverrides.forEach(function (overrides, component) {
            overrides.forEach(function (to, from) { mockViewResolver.overrideViewDirective(component, from, to); });
        });
        this._bindingsOverrides.forEach(function (bindings, type) {
            return mockDirectiveResolver.setBindingsOverride(type, bindings);
        });
        this._viewBindingsOverrides.forEach(function (bindings, type) { return mockDirectiveResolver.setViewBindingsOverride(type, bindings); });
        var rootElId = "root" + _nextRootElementId++;
        var rootEl = utils_1.el("<div id=\"" + rootElId + "\"></div>");
        var doc = this._injector.get(dom_tokens_1.DOCUMENT);
        // TODO(juliemr): can/should this be optional?
        var oldRoots = dom_adapter_1.DOM.querySelectorAll(doc, '[id^=root]');
        for (var i = 0; i < oldRoots.length; i++) {
            dom_adapter_1.DOM.remove(oldRoots[i]);
        }
        dom_adapter_1.DOM.appendChild(doc.body, rootEl);
        var promise = this._injector.get(core_1.DynamicComponentLoader)
            .loadAsRoot(rootComponentType, "#" + rootElId, this._injector);
        return promise.then(function (componentRef) { return new ComponentFixture_(componentRef); });
    };
    TestComponentBuilder = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.Injector])
    ], TestComponentBuilder);
    return TestComponentBuilder;
}());
exports.TestComponentBuilder = TestComponentBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9jb21wb25lbnRfYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtY25SOXVlbGUudG1wL2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RfY29tcG9uZW50X2J1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUJBV08sZUFBZSxDQUFDLENBQUE7QUFFdkIscUJBQXVDLDBCQUEwQixDQUFDLENBQUE7QUFDbEUsMkJBQXNDLGdDQUFnQyxDQUFDLENBQUE7QUFLdkUsc0JBQWlCLFNBQVMsQ0FBQyxDQUFBO0FBRTNCLDJCQUF1QixzQ0FBc0MsQ0FBQyxDQUFBO0FBQzlELDRCQUFrQix1Q0FBdUMsQ0FBQyxDQUFBO0FBRTFELDJCQUFvRCxvQ0FBb0MsQ0FBQyxDQUFBO0FBR3pGOztHQUVHO0FBQ0g7SUFBQTtJQThCQSxDQUFDO0lBQUQsdUJBQUM7QUFBRCxDQUFDLEFBOUJELElBOEJDO0FBOUJxQix3QkFBZ0IsbUJBOEJyQyxDQUFBO0FBR0Q7SUFBdUMscUNBQWdCO0lBTXJELDJCQUFZLFlBQTBCO1FBQ3BDLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsb0JBQW9CLEdBQWMsWUFBWSxDQUFDLFFBQVMsQ0FBQyxZQUFZLENBQUM7UUFDM0UsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUMvRCxJQUFJLENBQUMsWUFBWSxHQUFpQix5QkFBWSxDQUMxQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUM7UUFDN0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMs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WSxRQUFRLGNBQVUsQ0FBQyxDQUFDO1FBQ2hELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHFCQUFRLENBQUMsQ0FBQztRQUV2Qyw4Q0FBOEM7UUFDOUMsSUFBSSxRQUFRLEdBQUcsaUJBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDdkQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDekMsaUJBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUNELGlCQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFHbEMsSUFBSSxPQUFPLEdBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsNkJBQXNCLENBQUM7YUFDckMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLE1BQUksUUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2RSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLFlBQVksSUFBTyxNQUFNLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUF2S0g7UUFBQyxpQkFBVSxFQUFFOzs0QkFBQTtJQXdLYiwyQkFBQztBQUFELENBQUMsQUF2S0QsSUF1S0M7QUF2S1ksNEJBQW9CLHVCQXVLaEMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudFJlZixcbiAgRGlyZWN0aXZlUmVzb2x2ZXIsXG4gIER5bmFtaWNDb21wb25lbnRMb2FkZXIsXG4gIEluamVjdG9yLFxuICBJbmplY3RhYmxlLFxuICBWaWV3TWV0YWRhdGEsXG4gIEVsZW1lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgVmlld1Jlc29sdmVyLFxuICBwcm92aWRlXG59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5pbXBvcnQge1R5cGUsIGlzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIE1hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5cbmltcG9ydCB7Vmlld1JlZl99IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3X3JlZic7XG5pbXBvcnQge0FwcFZpZXd9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3JztcblxuaW1wb3J0IHtlbH0gZnJvbSAnLi91dGlscyc7XG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZG9tX3Rva2Vucyc7XG5pbXBvcnQge0RPTX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fYWRhcHRlcic7XG5cbmltcG9ydCB7RGVidWdOb2RlLCBEZWJ1Z0VsZW1lbnQsIGdldERlYnVnTm9kZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGVidWcvZGVidWdfbm9kZSc7XG5cblxuLyoqXG4gKiBGaXh0dXJlIGZvciBkZWJ1Z2dpbmcgYW5kIHRlc3RpbmcgYSBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21wb25lbnRGaXh0dXJlIHtcbiAgLyoqXG4gICAqIFRoZSBEZWJ1Z0VsZW1lbnQgYXNzb2NpYXRlZCB3aXRoIHRoZSByb290IGVsZW1lbnQgb2YgdGhpcyBjb21wb25lbnQuXG4gICAqL1xuICBkZWJ1Z0VsZW1lbnQ6IERlYnVnRWxlbWVudDtcblxuICAvKipcbiAgICogVGhlIGluc3RhbmNlIG9mIHRoZSByb290IGNvbXBvbmVudCBjbGFzcy5cbiAgICovXG4gIGNvbXBvbmVudEluc3RhbmNlOiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBuYXRpdmUgZWxlbWVudCBhdCB0aGUgcm9vdCBvZiB0aGUgY29tcG9uZW50LlxuICAgKi9cbiAgbmF0aXZlRWxlbWVudDogYW55O1xuXG4gIC8qKlxuICAgKiBUaGUgRWxlbWVudFJlZiBmb3IgdGhlIGVsZW1lbnQgYXQgdGhlIHJvb3Qgb2YgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlIGZvciB0aGUgY29tcG9uZW50LlxuICAgKi9cbiAgYWJzdHJhY3QgZGV0ZWN0Q2hhbmdlcygpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIGNvbXBvbmVudCBkZXN0cnVjdGlvbi5cbiAgICovXG4gIGFic3RyYWN0IGRlc3Ryb3koKTogdm9pZDtcbn1cblxuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50Rml4dHVyZV8gZXh0ZW5kcyBDb21wb25lbnRGaXh0dXJlIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbXBvbmVudFBhcmVudFZpZXc6IEFwcFZpZXc7XG5cbiAgY29uc3RydWN0b3IoY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWYpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2NvbXBvbmVudFBhcmVudFZpZXcgPSAoPFZpZXdSZWZfPmNvbXBvbmVudFJlZi5ob3N0VmlldykuaW50ZXJuYWxWaWV3O1xuICAgIHRoaXMuZWxlbWVudFJlZiA9IHRoaXMuX2NvbXBvbmVudFBhcmVudFZpZXcuYXBwRWxlbWVudHNbMF0ucmVmO1xuICAgIHRoaXMuZGVidWdFbGVtZW50ID0gPERlYnVnRWxlbWVudD5nZXREZWJ1Z05vZGUoXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFBhcmVudFZpZXcucm9vdE5vZGVzT3JBcHBFbGVtZW50c1swXS5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmNvbXBvbmVudEluc3RhbmNlID0gdGhpcy5kZWJ1Z0VsZW1lbnQuY29tcG9uZW50SW5zdGFuY2U7XG4gICAgdGhpcy5uYXRpdmVFbGVtZW50ID0gdGhpcy5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLl9jb21wb25lbnRSZWYgPSBjb21wb25lbnRSZWY7XG4gIH1cblxuICBkZXRlY3RDaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbXBvbmVudFBhcmVudFZpZXcuY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHRoaXMuX2NvbXBvbmVudFBhcmVudFZpZXcuY2hhbmdlRGV0ZWN0b3IuY2hlY2tOb0NoYW5nZXMoKTtcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7IHRoaXMuX2NvbXBvbmVudFJlZi5kaXNwb3NlKCk7IH1cbn1cblxudmFyIF9uZXh0Um9vdEVsZW1lbnRJZCA9IDA7XG5cbi8qKlxuICogQnVpbGRzIGEgQ29tcG9uZW50Rml4dHVyZSBmb3IgdXNlIGluIGNvbXBvbmVudCBsZXZlbCB0ZXN0cy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRlc3RDb21wb25lbnRCdWlsZGVyIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYmluZGluZ3NPdmVycmlkZXMgPSBuZXcgTWFwPFR5cGUsIGFueVtdPigpO1xuICAvKiogQGludGVybmFsICovXG4gIF9kaXJlY3RpdmVPdmVycmlkZXMgPSBuZXcgTWFwPFR5cGUsIE1hcDxUeXBlLCBUeXBlPj4oKTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdGVtcGxhdGVPdmVycmlkZXMgPSBuZXcgTWFwPFR5cGUsIHN0cmluZz4oKTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdmlld0JpbmRpbmdzT3ZlcnJpZGVzID0gbmV3IE1hcDxUeXBlLCBhbnlbXT4oKTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdmlld092ZXJyaWRlcyA9IG5ldyBNYXA8VHlwZSwgVmlld01ldGFkYXRhPigpO1xuXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yKSB7fVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb25lKCk6IFRlc3RDb21wb25lbnRCdWlsZGVyIHtcbiAgICB2YXIgY2xvbmUgPSBuZXcgVGVzdENvbXBvbmVudEJ1aWxkZXIodGhpcy5faW5qZWN0b3IpO1xuICAgIGNsb25lLl92aWV3T3ZlcnJpZGVzID0gTWFwV3JhcHBlci5jbG9uZSh0aGlzLl92aWV3T3ZlcnJpZGVzKTtcbiAgICBjbG9uZS5fZGlyZWN0aXZlT3ZlcnJpZGVzID0gTWFwV3JhcHBlci5jbG9uZSh0aGlzLl9kaXJlY3RpdmVPdmVycmlkZXMpO1xuICAgIGNsb25lLl90ZW1wbGF0ZU92ZXJyaWRlcyA9IE1hcFdyYXBwZXIuY2xvbmUodGhpcy5fdGVtcGxhdGVPdmVycmlkZXMpO1xuICAgIHJldHVybiBjbG9uZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZXMgb25seSB0aGUgaHRtbCBvZiBhIHtAbGluayBDb21wb25lbnRNZXRhZGF0YX0uXG4gICAqIEFsbCB0aGUgb3RoZXIgcHJvcGVydGllcyBvZiB0aGUgY29tcG9uZW50J3Mge0BsaW5rIFZpZXdNZXRhZGF0YX0gYXJlIHByZXNlcnZlZC5cbiAgICpcbiAgICogQHBhcmFtIHtUeXBlfSBjb21wb25lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGh0bWxcbiAgICpcbiAgICogQHJldHVybiB7VGVzdENvbXBvbmVudEJ1aWxkZXJ9XG4gICAqL1xuICBvdmVycmlkZVRlbXBsYXRlKGNvbXBvbmVudFR5cGU6IFR5cGUsIHRlbXBsYXRlOiBzdHJpbmcpOiBUZXN0Q29tcG9uZW50QnVpbGRlciB7XG4gICAgdmFyIGNsb25lID0gdGhpcy5fY2xvbmUoKTtcbiAgICBjbG9uZS5fdGVtcGxhdGVPdmVycmlkZXMuc2V0KGNvbXBvbmVudFR5cGUsIHRlbXBsYXRlKTtcbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIGEgY29tcG9uZW50J3Mge0BsaW5rIFZpZXdNZXRhZGF0YX0uXG4gICAqXG4gICAqIEBwYXJhbSB7VHlwZX0gY29tcG9uZW50XG4gICAqIEBwYXJhbSB7dmlld30gVmlld1xuICAgKlxuICAgKiBAcmV0dXJuIHtUZXN0Q29tcG9uZW50QnVpbGRlcn1cbiAgICovXG4gIG92ZXJyaWRlVmlldyhjb21wb25lbnRUeXBlOiBUeXBlLCB2aWV3OiBWaWV3TWV0YWRhdGEpOiBUZXN0Q29tcG9uZW50QnVpbGRlciB7XG4gICAgdmFyIGNsb25lID0gdGhpcy5fY2xvbmUoKTtcbiAgICBjbG9uZS5fdmlld092ZXJyaWRlcy5zZXQoY29tcG9uZW50VHlwZSwgdmlldyk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUgZGlyZWN0aXZlcyBmcm9tIHRoZSBjb21wb25lbnQge0BsaW5rIFZpZXdNZXRhZGF0YX0uXG4gICAqXG4gICAqIEBwYXJhbSB7VHlwZX0gY29tcG9uZW50XG4gICAqIEBwYXJhbSB7VHlwZX0gZnJvbVxuICAgKiBAcGFyYW0ge1R5cGV9IHRvXG4gICAqXG4gICAqIEByZXR1cm4ge1Rlc3RDb21wb25lbnRCdWlsZGVyfVxuICAgKi9cbiAgb3ZlcnJpZGVEaXJlY3RpdmUoY29tcG9uZW50VHlwZTogVHlwZSwgZnJvbTogVHlwZSwgdG86IFR5cGUpOiBUZXN0Q29tcG9uZW50QnVpbGRlciB7XG4gICAgdmFyIGNsb25lID0gdGhpcy5fY2xvbmUoKTtcbiAgICB2YXIgb3ZlcnJpZGVzRm9yQ29tcG9uZW50ID0gY2xvbmUuX2RpcmVjdGl2ZU92ZXJyaWRlcy5nZXQoY29tcG9uZW50VHlwZSk7XG4gICAgaWYgKCFpc1ByZXNlbnQob3ZlcnJpZGVzRm9yQ29tcG9uZW50KSkge1xuICAgICAgY2xvbmUuX2RpcmVjdGl2ZU92ZXJyaWRlcy5zZXQoY29tcG9uZW50VHlwZSwgbmV3IE1hcDxUeXBlLCBUeXBlPigpKTtcbiAgICAgIG92ZXJyaWRlc0ZvckNvbXBvbmVudCA9IGNsb25lLl9kaXJlY3RpdmVPdmVycmlkZXMuZ2V0KGNvbXBvbmVudFR5cGUpO1xuICAgIH1cbiAgICBvdmVycmlkZXNGb3JDb21wb25lbnQuc2V0KGZyb20sIHRvKTtcbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIG9uZSBvciBtb3JlIGluamVjdGFibGVzIGNvbmZpZ3VyZWQgdmlhIGBwcm92aWRlcnNgIG1ldGFkYXRhIHByb3BlcnR5IG9mIGEgZGlyZWN0aXZlXG4gICAqIG9yXG4gICAqIGNvbXBvbmVudC5cbiAgICogVmVyeSB1c2VmdWwgd2hlbiBjZXJ0YWluIHByb3ZpZGVycyBuZWVkIHRvIGJlIG1vY2tlZCBvdXQuXG4gICAqXG4gICAqIFRoZSBwcm92aWRlcnMgc3BlY2lmaWVkIHZpYSB0aGlzIG1ldGhvZCBhcmUgYXBwZW5kZWQgdG8gdGhlIGV4aXN0aW5nIGBwcm92aWRlcnNgIGNhdXNpbmcgdGhlXG4gICAqIGR1cGxpY2F0ZWQgcHJvdmlkZXJzIHRvXG4gICAqIGJlIG92ZXJyaWRkZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7VHlwZX0gY29tcG9uZW50XG4gICAqIEBwYXJhbSB7YW55W119IHByb3ZpZGVyc1xuICAgKlxuICAgKiBAcmV0dXJuIHtUZXN0Q29tcG9uZW50QnVpbGRlcn1cbiAgICovXG4gIG92ZXJyaWRlUHJvdmlkZXJzKHR5cGU6IFR5cGUsIHByb3ZpZGVyczogYW55W10pOiBUZXN0Q29tcG9uZW50QnVpbGRlciB7XG4gICAgdmFyIGNsb25lID0gdGhpcy5fY2xvbmUoKTtcbiAgICBjbG9uZS5fYmluZGluZ3NPdmVycmlkZXMuc2V0KHR5cGUsIHByb3ZpZGVycyk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBvdmVycmlkZUJpbmRpbmdzKHR5cGU6IFR5cGUsIHByb3ZpZGVyczogYW55W10pOiBUZXN0Q29tcG9uZW50QnVpbGRlciB7XG4gICAgcmV0dXJuIHRoaXMub3ZlcnJpZGVQcm92aWRlcnModHlwZSwgcHJvdmlkZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZXMgb25lIG9yIG1vcmUgaW5qZWN0YWJsZXMgY29uZmlndXJlZCB2aWEgYHByb3ZpZGVyc2AgbWV0YWRhdGEgcHJvcGVydHkgb2YgYSBkaXJlY3RpdmVcbiAgICogb3JcbiAgICogY29tcG9uZW50LlxuICAgKiBWZXJ5IHVzZWZ1bCB3aGVuIGNlcnRhaW4gcHJvdmlkZXJzIG5lZWQgdG8gYmUgbW9ja2VkIG91dC5cbiAgICpcbiAgICogVGhlIHByb3ZpZGVycyBzcGVjaWZpZWQgdmlhIHRoaXMgbWV0aG9kIGFyZSBhcHBlbmRlZCB0byB0aGUgZXhpc3RpbmcgYHByb3ZpZGVyc2AgY2F1c2luZyB0aGVcbiAgICogZHVwbGljYXRlZCBwcm92aWRlcnMgdG9cbiAgICogYmUgb3ZlcnJpZGRlbi5cbiAgICpcbiAgICogQHBhcmFtIHtUeXBlfSBjb21wb25lbnRcbiAgICogQHBhcmFtIHthbnlbXX0gcHJvdmlkZXJzXG4gICAqXG4gICAqIEByZXR1cm4ge1Rlc3RDb21wb25lbnRCdWlsZGVyfVxuICAgKi9cbiAgb3ZlcnJpZGVWaWV3UHJvdmlkZXJzKHR5cGU6IFR5cGUsIHByb3ZpZGVyczogYW55W10pOiBUZXN0Q29tcG9uZW50QnVpbGRlciB7XG4gICAgdmFyIGNsb25lID0gdGhpcy5fY2xvbmUoKTtcbiAgICBjbG9uZS5fdmlld0JpbmRpbmdzT3ZlcnJpZGVzLnNldCh0eXBlLCBwcm92aWRlcnMpO1xuICAgIHJldHVybiBjbG9uZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgb3ZlcnJpZGVWaWV3QmluZGluZ3ModHlwZTogVHlwZSwgcHJvdmlkZXJzOiBhbnlbXSk6IFRlc3RDb21wb25lbnRCdWlsZGVyIHtcbiAgICByZXR1cm4gdGhpcy5vdmVycmlkZVZpZXdQcm92aWRlcnModHlwZSwgcHJvdmlkZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgYW5kIHJldHVybnMgYSBDb21wb25lbnRGaXh0dXJlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPENvbXBvbmVudEZpeHR1cmU+fVxuICAgKi9cbiAgY3JlYXRlQXN5bmMocm9vdENvbXBvbmVudFR5cGU6IFR5cGUpOiBQcm9taXNlPENvbXBvbmVudEZpeHR1cmU+IHtcbiAgICB2YXIgbW9ja0RpcmVjdGl2ZVJlc29sdmVyID0gdGhpcy5faW5qZWN0b3IuZ2V0KERpcmVjdGl2ZVJlc29sdmVyKTtcbiAgICB2YXIgbW9ja1ZpZXdSZXNvbHZlciA9IHRoaXMuX2luamVjdG9yLmdldChWaWV3UmVzb2x2ZXIpO1xuICAgIHRoaXMuX3ZpZXdPdmVycmlkZXMuZm9yRWFjaCgodmlldywgdHlwZSkgPT4gbW9ja1ZpZXdSZXNvbHZlci5zZXRWaWV3KHR5cGUsIHZpZXcpKTtcbiAgICB0aGlzLl90ZW1wbGF0ZU92ZXJyaWRlcy5mb3JFYWNoKCh0ZW1wbGF0ZSwgdHlwZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2NrVmlld1Jlc29sdmVyLnNldElubGluZVRlbXBsYXRlKHR5cGUsIHRlbXBsYXRlKSk7XG4gICAgdGhpcy5fZGlyZWN0aXZlT3ZlcnJpZGVzLmZvckVhY2goKG92ZXJyaWRlcywgY29tcG9uZW50KSA9PiB7XG4gICAgICBvdmVycmlkZXMuZm9yRWFjaChcbiAgICAgICAgICAodG8sIGZyb20pID0+IHsgbW9ja1ZpZXdSZXNvbHZlci5vdmVycmlkZVZpZXdEaXJlY3RpdmUoY29tcG9uZW50LCBmcm9tLCB0byk7IH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fYmluZGluZ3NPdmVycmlkZXMuZm9yRWFjaCgoYmluZGluZ3MsIHR5cGUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ja0RpcmVjdGl2ZVJlc29sdmVyLnNldEJpbmRpbmdzT3ZlcnJpZGUodHlwZSwgYmluZGluZ3MpKTtcbiAgICB0aGlzLl92aWV3QmluZGluZ3NPdmVycmlkZXMuZm9yRWFjaChcbiAgICAgICAgKGJpbmRpbmdzLCB0eXBlKSA9PiBtb2NrRGlyZWN0aXZlUmVzb2x2ZXIuc2V0Vmlld0JpbmRpbmdzT3ZlcnJpZGUodHlwZSwgYmluZGluZ3MpKTtcblxuICAgIHZhciByb290RWxJZCA9IGByb290JHtfbmV4dFJvb3RFbGVtZW50SWQrK31gO1xuICAgIHZhciByb290RWwgPSBlbChgPGRpdiBpZD1cIiR7cm9vdEVsSWR9XCI+PC9kaXY+YCk7XG4gICAgdmFyIGRvYyA9IHRoaXMuX2luamVjdG9yLmdldChET0NVTUVOVCk7XG5cbiAgICAvLyBUT0RPKGp1bGllbXIpOiBjYW4vc2hvdWxkIHRoaXMgYmUgb3B0aW9uYWw/XG4gICAgdmFyIG9sZFJvb3RzID0gRE9NLnF1ZXJ5U2VsZWN0b3JBbGwoZG9jLCAnW2lkXj1yb290XScpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkUm9vdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIERPTS5yZW1vdmUob2xkUm9vdHNbaV0pO1xuICAgIH1cbiAgICBET00uYXBwZW5kQ2hpbGQoZG9jLmJvZHksIHJvb3RFbCk7XG5cblxuICAgIHZhciBwcm9taXNlOiBQcm9taXNlPENvbXBvbmVudFJlZj4gPVxuICAgICAgICB0aGlzLl9pbmplY3Rvci5nZXQoRHluYW1pY0NvbXBvbmVudExvYWRlcilcbiAgICAgICAgICAgIC5sb2FkQXNSb290KHJvb3RDb21wb25lbnRUeXBlLCBgIyR7cm9vdEVsSWR9YCwgdGhpcy5faW5qZWN0b3IpO1xuICAgIHJldHVybiBwcm9taXNlLnRoZW4oKGNvbXBvbmVudFJlZikgPT4geyByZXR1cm4gbmV3IENvbXBvbmVudEZpeHR1cmVfKGNvbXBvbmVudFJlZik7IH0pO1xuICB9XG59XG4iXX0=