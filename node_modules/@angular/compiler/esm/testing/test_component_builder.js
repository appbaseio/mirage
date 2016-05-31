import { OpaqueToken, ComponentResolver, Injector, Injectable, NgZone, getDebugNode } from '@angular/core';
import { DirectiveResolver, ViewResolver } from '../index';
import { BaseException } from '../src/facade/exceptions';
import { isPresent, IS_DART, scheduleMicroTask } from '../src/facade/lang';
import { PromiseWrapper, ObservableWrapper, PromiseCompleter } from '../src/facade/async';
import { MapWrapper } from '../src/facade/collection';
import { tick } from '@angular/core/testing';
/**
 * An abstract class for inserting the root test component element in a platform independent way.
 */
export class TestComponentRenderer {
    insertRootElement(rootElementId) { }
}
export var ComponentFixtureAutoDetect = new OpaqueToken("ComponentFixtureAutoDetect");
export var ComponentFixtureNoNgZone = new OpaqueToken("ComponentFixtureNoNgZone");
/**
 * Fixture for debugging and testing a component.
 */
export class ComponentFixture {
    constructor(componentRef, ngZone, autoDetect) {
        this._isStable = true;
        this._completer = null;
        this._onUnstableSubscription = null;
        this._onStableSubscription = null;
        this._onMicrotaskEmptySubscription = null;
        this._onErrorSubscription = null;
        this.changeDetectorRef = componentRef.changeDetectorRef;
        this.elementRef = componentRef.location;
        this.debugElement = getDebugNode(this.elementRef.nativeElement);
        this.componentInstance = componentRef.instance;
        this.nativeElement = this.elementRef.nativeElement;
        this.componentRef = componentRef;
        this.ngZone = ngZone;
        this._autoDetect = autoDetect;
        if (ngZone != null) {
            this._onUnstableSubscription =
                ObservableWrapper.subscribe(ngZone.onUnstable, (_) => { this._isStable = false; });
            this._onMicrotaskEmptySubscription =
                ObservableWrapper.subscribe(ngZone.onMicrotaskEmpty, (_) => {
                    if (this._autoDetect) {
                        // Do a change detection run with checkNoChanges set to true to check
                        // there are no changes on the second run.
                        this.detectChanges(true);
                    }
                });
            this._onStableSubscription = ObservableWrapper.subscribe(ngZone.onStable, (_) => {
                this._isStable = true;
                // Check whether there are no pending macrotasks in a microtask so that ngZone gets a chance
                // to update the state of pending macrotasks.
                scheduleMicroTask(() => {
                    if (!this.ngZone.hasPendingMacrotasks) {
                        if (this._completer != null) {
                            this._completer.resolve(true);
                            this._completer = null;
                        }
                    }
                });
            });
            this._onErrorSubscription = ObservableWrapper.subscribe(ngZone.onError, (error) => { throw error.error; });
        }
    }
    _tick(checkNoChanges) {
        this.changeDetectorRef.detectChanges();
        if (checkNoChanges) {
            this.checkNoChanges();
        }
    }
    /**
     * Trigger a change detection cycle for the component.
     */
    detectChanges(checkNoChanges = true) {
        if (this.ngZone != null) {
            // Run the change detection inside the NgZone so that any async tasks as part of the change
            // detection are captured by the zone and can be waited for in isStable.
            this.ngZone.run(() => { this._tick(checkNoChanges); });
        }
        else {
            // Running without zone. Just do the change detection.
            this._tick(checkNoChanges);
        }
    }
    /**
     * Do a change detection run to make sure there were no changes.
     */
    checkNoChanges() { this.changeDetectorRef.checkNoChanges(); }
    /**
     * Set whether the fixture should autodetect changes.
     *
     * Also runs detectChanges once so that any existing change is detected.
     */
    autoDetectChanges(autoDetect = true) {
        if (this.ngZone == null) {
            throw new BaseException('Cannot call autoDetectChanges when ComponentFixtureNoNgZone is set');
        }
        this._autoDetect = autoDetect;
        this.detectChanges();
    }
    /**
     * Return whether the fixture is currently stable or has async tasks that have not been completed
     * yet.
     */
    isStable() { return this._isStable && !this.ngZone.hasPendingMacrotasks; }
    /**
     * Get a promise that resolves when the fixture is stable.
     *
     * This can be used to resume testing after events have triggered asynchronous activity or
     * asynchronous change detection.
     */
    whenStable() {
        if (this.isStable()) {
            return PromiseWrapper.resolve(false);
        }
        else if (this._completer !== null) {
            return this._completer.promise;
        }
        else {
            this._completer = new PromiseCompleter();
            return this._completer.promise;
        }
    }
    /**
     * Trigger component destruction.
     */
    destroy() {
        this.componentRef.destroy();
        if (this._onUnstableSubscription != null) {
            ObservableWrapper.dispose(this._onUnstableSubscription);
            this._onUnstableSubscription = null;
        }
        if (this._onStableSubscription != null) {
            ObservableWrapper.dispose(this._onStableSubscription);
            this._onStableSubscription = null;
        }
        if (this._onMicrotaskEmptySubscription != null) {
            ObservableWrapper.dispose(this._onMicrotaskEmptySubscription);
            this._onMicrotaskEmptySubscription = null;
        }
        if (this._onErrorSubscription != null) {
            ObservableWrapper.dispose(this._onErrorSubscription);
            this._onErrorSubscription = null;
        }
    }
}
var _nextRootElementId = 0;
export class TestComponentBuilder {
    constructor(_injector) {
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
    _clone() {
        let clone = new TestComponentBuilder(this._injector);
        clone._viewOverrides = MapWrapper.clone(this._viewOverrides);
        clone._directiveOverrides = MapWrapper.clone(this._directiveOverrides);
        clone._templateOverrides = MapWrapper.clone(this._templateOverrides);
        clone._bindingsOverrides = MapWrapper.clone(this._bindingsOverrides);
        clone._viewBindingsOverrides = MapWrapper.clone(this._viewBindingsOverrides);
        return clone;
    }
    /**
     * Overrides only the html of a {@link ComponentMetadata}.
     * All the other properties of the component's {@link ViewMetadata} are preserved.
     *
     * @param {Type} component
     * @param {string} html
     *
     * @return {TestComponentBuilder}
     */
    overrideTemplate(componentType, template) {
        let clone = this._clone();
        clone._templateOverrides.set(componentType, template);
        return clone;
    }
    /**
     * Overrides a component's {@link ViewMetadata}.
     *
     * @param {Type} component
     * @param {view} View
     *
     * @return {TestComponentBuilder}
     */
    overrideView(componentType, view) {
        let clone = this._clone();
        clone._viewOverrides.set(componentType, view);
        return clone;
    }
    /**
     * Overrides the directives from the component {@link ViewMetadata}.
     *
     * @param {Type} component
     * @param {Type} from
     * @param {Type} to
     *
     * @return {TestComponentBuilder}
     */
    overrideDirective(componentType, from, to) {
        let clone = this._clone();
        let overridesForComponent = clone._directiveOverrides.get(componentType);
        if (!isPresent(overridesForComponent)) {
            clone._directiveOverrides.set(componentType, new Map());
            overridesForComponent = clone._directiveOverrides.get(componentType);
        }
        overridesForComponent.set(from, to);
        return clone;
    }
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
    overrideProviders(type, providers) {
        let clone = this._clone();
        clone._bindingsOverrides.set(type, providers);
        return clone;
    }
    /**
     * @deprecated
     */
    overrideBindings(type, providers) {
        return this.overrideProviders(type, providers);
    }
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
    overrideViewProviders(type, providers) {
        let clone = this._clone();
        clone._viewBindingsOverrides.set(type, providers);
        return clone;
    }
    /**
     * @deprecated
     */
    overrideViewBindings(type, providers) {
        return this.overrideViewProviders(type, providers);
    }
    _create(ngZone, componentFactory) {
        let rootElId = `root${_nextRootElementId++}`;
        var testComponentRenderer = this._injector.get(TestComponentRenderer);
        testComponentRenderer.insertRootElement(rootElId);
        var componentRef = componentFactory.create(this._injector, [], `#${rootElId}`);
        let autoDetect = this._injector.get(ComponentFixtureAutoDetect, false);
        return new ComponentFixture(componentRef, ngZone, autoDetect);
    }
    /**
     * Builds and returns a ComponentFixture.
     *
     * @return {Promise<ComponentFixture>}
     */
    createAsync(rootComponentType) {
        let noNgZone = IS_DART || this._injector.get(ComponentFixtureNoNgZone, false);
        let ngZone = noNgZone ? null : this._injector.get(NgZone, null);
        let initComponent = () => {
            let mockDirectiveResolver = this._injector.get(DirectiveResolver);
            let mockViewResolver = this._injector.get(ViewResolver);
            this._viewOverrides.forEach((view, type) => mockViewResolver.setView(type, view));
            this._templateOverrides.forEach((template, type) => mockViewResolver.setInlineTemplate(type, template));
            this._directiveOverrides.forEach((overrides, component) => {
                overrides.forEach((to, from) => { mockViewResolver.overrideViewDirective(component, from, to); });
            });
            this._bindingsOverrides.forEach((bindings, type) => mockDirectiveResolver.setBindingsOverride(type, bindings));
            this._viewBindingsOverrides.forEach((bindings, type) => mockDirectiveResolver.setViewBindingsOverride(type, bindings));
            let promise = this._injector.get(ComponentResolver).resolveComponent(rootComponentType);
            return promise.then(componentFactory => this._create(ngZone, componentFactory));
        };
        return ngZone == null ? initComponent() : ngZone.run(initComponent);
    }
    createFakeAsync(rootComponentType) {
        let result;
        let error;
        PromiseWrapper.then(this.createAsync(rootComponentType), (_result) => { result = _result; }, (_error) => { error = _error; });
        tick();
        if (isPresent(error)) {
            throw error;
        }
        return result;
    }
    createSync(componentFactory) {
        let noNgZone = IS_DART || this._injector.get(ComponentFixtureNoNgZone, false);
        let ngZone = noNgZone ? null : this._injector.get(NgZone, null);
        let initComponent = () => this._create(ngZone, componentFactory);
        return ngZone == null ? initComponent() : ngZone.run(initComponent);
    }
}
TestComponentBuilder.decorators = [
    { type: Injectable },
];
TestComponentBuilder.ctorParameters = [
    { type: Injector, },
];
//# sourceMappingURL=test_component_builder.js.map