'use strict';"use strict";
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
var async_1 = require('angular2/src/facade/async');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var core_1 = require('angular2/core');
var routerMod = require('../router');
var instruction_1 = require('../instruction');
var hookMod = require('../lifecycle/lifecycle_annotations');
var route_lifecycle_reflector_1 = require('../lifecycle/route_lifecycle_reflector');
var _resolveToTrue = async_1.PromiseWrapper.resolve(true);
/**
 * A router outlet is a placeholder that Angular dynamically fills based on the application's route.
 *
 * ## Use
 *
 * ```
 * <router-outlet></router-outlet>
 * ```
 */
var RouterOutlet = (function () {
    function RouterOutlet(_elementRef, _loader, _parentRouter, nameAttr) {
        this._elementRef = _elementRef;
        this._loader = _loader;
        this._parentRouter = _parentRouter;
        this.name = null;
        this._componentRef = null;
        this._currentInstruction = null;
        if (lang_1.isPresent(nameAttr)) {
            this.name = nameAttr;
            this._parentRouter.registerAuxOutlet(this);
        }
        else {
            this._parentRouter.registerPrimaryOutlet(this);
        }
    }
    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    RouterOutlet.prototype.activate = function (nextInstruction) {
        var _this = this;
        var previousInstruction = this._currentInstruction;
        this._currentInstruction = nextInstruction;
        var componentType = nextInstruction.componentType;
        var childRouter = this._parentRouter.childRouter(componentType);
        var providers = core_1.Injector.resolve([
            core_1.provide(instruction_1.RouteData, { useValue: nextInstruction.routeData }),
            core_1.provide(instruction_1.RouteParams, { useValue: new instruction_1.RouteParams(nextInstruction.params) }),
            core_1.provide(routerMod.Router, { useValue: childRouter })
        ]);
        this._componentRef =
            this._loader.loadNextToLocation(componentType, this._elementRef, providers);
        return this._componentRef.then(function (componentRef) {
            if (route_lifecycle_reflector_1.hasLifecycleHook(hookMod.routerOnActivate, componentType)) {
                return _this._componentRef.then(function (ref) {
                    return ref.instance.routerOnActivate(nextInstruction, previousInstruction);
                });
            }
            else {
                return componentRef;
            }
        });
    };
    /**
     * Called by the {@link Router} during the commit phase of a navigation when an outlet
     * reuses a component between different routes.
     * This method in turn is responsible for calling the `routerOnReuse` hook of its child.
     */
    RouterOutlet.prototype.reuse = function (nextInstruction) {
        var previousInstruction = this._currentInstruction;
        this._currentInstruction = nextInstruction;
        // it's possible the component is removed before it can be reactivated (if nested withing
        // another dynamically loaded component, for instance). In that case, we simply activate
        // a new one.
        if (lang_1.isBlank(this._componentRef)) {
            return this.activate(nextInstruction);
        }
        else {
            return async_1.PromiseWrapper.resolve(route_lifecycle_reflector_1.hasLifecycleHook(hookMod.routerOnReuse, this._currentInstruction.componentType) ?
                this._componentRef.then(function (ref) {
                    return ref.instance.routerOnReuse(nextInstruction, previousInstruction);
                }) :
                true);
        }
    };
    /**
     * Called by the {@link Router} when an outlet disposes of a component's contents.
     * This method in turn is responsible for calling the `routerOnDeactivate` hook of its child.
     */
    RouterOutlet.prototype.deactivate = function (nextInstruction) {
        var _this = this;
        var next = _resolveToTrue;
        if (lang_1.isPresent(this._componentRef) && lang_1.isPresent(this._currentInstruction) &&
            route_lifecycle_reflector_1.hasLifecycleHook(hookMod.routerOnDeactivate, this._currentInstruction.componentType)) {
            next = this._componentRef.then(function (ref) {
                return ref.instance
                    .routerOnDeactivate(nextInstruction, _this._currentInstruction);
            });
        }
        return next.then(function (_) {
            if (lang_1.isPresent(_this._componentRef)) {
                var onDispose = _this._componentRef.then(function (ref) { return ref.dispose(); });
                _this._componentRef = null;
                return onDispose;
            }
        });
    };
    /**
     * Called by the {@link Router} during recognition phase of a navigation.
     *
     * If this resolves to `false`, the given navigation is cancelled.
     *
     * This method delegates to the child component's `routerCanDeactivate` hook if it exists,
     * and otherwise resolves to true.
     */
    RouterOutlet.prototype.routerCanDeactivate = function (nextInstruction) {
        var _this = this;
        if (lang_1.isBlank(this._currentInstruction)) {
            return _resolveToTrue;
        }
        if (route_lifecycle_reflector_1.hasLifecycleHook(hookMod.routerCanDeactivate, this._currentInstruction.componentType)) {
            return this._componentRef.then(function (ref) {
                return ref.instance
                    .routerCanDeactivate(nextInstruction, _this._currentInstruction);
            });
        }
        else {
            return _resolveToTrue;
        }
    };
    /**
     * Called by the {@link Router} during recognition phase of a navigation.
     *
     * If the new child component has a different Type than the existing child component,
     * this will resolve to `false`. You can't reuse an old component when the new component
     * is of a different Type.
     *
     * Otherwise, this method delegates to the child component's `routerCanReuse` hook if it exists,
     * or resolves to true if the hook is not present.
     */
    RouterOutlet.prototype.routerCanReuse = function (nextInstruction) {
        var _this = this;
        var result;
        if (lang_1.isBlank(this._currentInstruction) ||
            this._currentInstruction.componentType != nextInstruction.componentType) {
            result = false;
        }
        else if (route_lifecycle_reflector_1.hasLifecycleHook(hookMod.routerCanReuse, this._currentInstruction.componentType)) {
            result = this._componentRef.then(function (ref) {
                return ref.instance.routerCanReuse(nextInstruction, _this._currentInstruction);
            });
        }
        else {
            result = nextInstruction == this._currentInstruction ||
                (lang_1.isPresent(nextInstruction.params) && lang_1.isPresent(this._currentInstruction.params) &&
                    collection_1.StringMapWrapper.equals(nextInstruction.params, this._currentInstruction.params));
        }
        return async_1.PromiseWrapper.resolve(result);
    };
    RouterOutlet.prototype.ngOnDestroy = function () { this._parentRouter.unregisterPrimaryOutlet(this); };
    RouterOutlet = __decorate([
        core_1.Directive({ selector: 'router-outlet' }),
        __param(3, core_1.Attribute('name')), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.DynamicComponentLoader, routerMod.Router, String])
    ], RouterOutlet);
    return RouterOutlet;
}());
exports.RouterOutlet = RouterOutlet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX291dGxldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9yb3V0ZXIvZGlyZWN0aXZlcy9yb3V0ZXJfb3V0bGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQkFBNkIsMkJBQTJCLENBQUMsQ0FBQTtBQUN6RCwyQkFBK0IsZ0NBQWdDLENBQUMsQ0FBQTtBQUNoRSxxQkFBaUMsMEJBQTBCLENBQUMsQ0FBQTtBQUU1RCxxQkFVTyxlQUFlLENBQUMsQ0FBQTtBQUV2QixJQUFZLFNBQVMsV0FBTSxXQUFXLENBQUMsQ0FBQTtBQUN2Qyw0QkFBMkQsZ0JBQWdCLENBQUMsQ0FBQTtBQUM1RSxJQUFZLE9BQU8sV0FBTSxvQ0FBb0MsQ0FBQyxDQUFBO0FBQzlELDBDQUErQix3Q0FBd0MsQ0FBQyxDQUFBO0FBR3hFLElBQUksY0FBYyxHQUFHLHNCQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRWxEOzs7Ozs7OztHQVFHO0FBRUg7SUFLRSxzQkFBb0IsV0FBdUIsRUFBVSxPQUErQixFQUNoRSxhQUErQixFQUFxQixRQUFnQjtRQURwRSxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQXdCO1FBQ2hFLGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtRQUxuRCxTQUFJLEdBQVcsSUFBSSxDQUFDO1FBQ1osa0JBQWEsR0FBMEIsSUFBSSxDQUFDO1FBQzVDLHdCQUFtQixHQUF5QixJQUFJLENBQUM7UUFJdkQsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7WUFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxD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Qy9FLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzlGLENBQUM7UUFDRCxNQUFNLENBQW1CLHNCQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxrQ0FBVyxHQUFYLGNBQXNCLElBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBNUkzRTtRQUFDLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFDLENBQUM7bUJBT2lCLGdCQUFTLENBQUMsTUFBTSxDQUFDO3FHQUExQixNQUFNO29CQVBkO0lBNkl2QyxtQkFBQztBQUFELENBQUMsQUE1SUQsSUE0SUM7QUE1SVksb0JBQVksZUE0SXhCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1Byb21pc2VXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcbmltcG9ydCB7U3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7aXNCbGFuaywgaXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEF0dHJpYnV0ZSxcbiAgRHluYW1pY0NvbXBvbmVudExvYWRlcixcbiAgQ29tcG9uZW50UmVmLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3RvcixcbiAgcHJvdmlkZSxcbiAgRGVwZW5kZW5jeSxcbiAgT25EZXN0cm95XG59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5pbXBvcnQgKiBhcyByb3V0ZXJNb2QgZnJvbSAnLi4vcm91dGVyJztcbmltcG9ydCB7Q29tcG9uZW50SW5zdHJ1Y3Rpb24sIFJvdXRlUGFyYW1zLCBSb3V0ZURhdGF9IGZyb20gJy4uL2luc3RydWN0aW9uJztcbmltcG9ydCAqIGFzIGhvb2tNb2QgZnJvbSAnLi4vbGlmZWN5Y2xlL2xpZmVjeWNsZV9hbm5vdGF0aW9ucyc7XG5pbXBvcnQge2hhc0xpZmVjeWNsZUhvb2t9IGZyb20gJy4uL2xpZmVjeWNsZS9yb3V0ZV9saWZlY3ljbGVfcmVmbGVjdG9yJztcbmltcG9ydCB7T25BY3RpdmF0ZSwgQ2FuUmV1c2UsIE9uUmV1c2UsIE9uRGVhY3RpdmF0ZSwgQ2FuRGVhY3RpdmF0ZX0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5cbmxldCBfcmVzb2x2ZVRvVHJ1ZSA9IFByb21pc2VXcmFwcGVyLnJlc29sdmUodHJ1ZSk7XG5cbi8qKlxuICogQSByb3V0ZXIgb3V0bGV0IGlzIGEgcGxhY2Vob2xkZXIgdGhhdCBBbmd1bGFyIGR5bmFtaWNhbGx5IGZpbGxzIGJhc2VkIG9uIHRoZSBhcHBsaWNhdGlvbidzIHJvdXRlLlxuICpcbiAqICMjIFVzZVxuICpcbiAqIGBgYFxuICogPHJvdXRlci1vdXRsZXQ+PC9yb3V0ZXItb3V0bGV0PlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAncm91dGVyLW91dGxldCd9KVxuZXhwb3J0IGNsYXNzIFJvdXRlck91dGxldCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIG5hbWU6IHN0cmluZyA9IG51bGw7XG4gIHByaXZhdGUgX2NvbXBvbmVudFJlZjogUHJvbWlzZTxDb21wb25lbnRSZWY+ID0gbnVsbDtcbiAgcHJpdmF0ZSBfY3VycmVudEluc3RydWN0aW9uOiBDb21wb25lbnRJbnN0cnVjdGlvbiA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBfbG9hZGVyOiBEeW5hbWljQ29tcG9uZW50TG9hZGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF9wYXJlbnRSb3V0ZXI6IHJvdXRlck1vZC5Sb3V0ZXIsIEBBdHRyaWJ1dGUoJ25hbWUnKSBuYW1lQXR0cjogc3RyaW5nKSB7XG4gICAgaWYgKGlzUHJlc2VudChuYW1lQXR0cikpIHtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWVBdHRyO1xuICAgICAgdGhpcy5fcGFyZW50Um91dGVyLnJlZ2lzdGVyQXV4T3V0bGV0KHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9wYXJlbnRSb3V0ZXIucmVnaXN0ZXJQcmltYXJ5T3V0bGV0KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgYnkgdGhlIFJvdXRlciB0byBpbnN0YW50aWF0ZSBhIG5ldyBjb21wb25lbnQgZHVyaW5nIHRoZSBjb21taXQgcGhhc2Ugb2YgYSBuYXZpZ2F0aW9uLlxuICAgKiBUaGlzIG1ldGhvZCBpbiB0dXJuIGlzIHJlc3BvbnNpYmxlIGZvciBjYWxsaW5nIHRoZSBgcm91dGVyT25BY3RpdmF0ZWAgaG9vayBvZiBpdHMgY2hpbGQuXG4gICAqL1xuICBhY3RpdmF0ZShuZXh0SW5zdHJ1Y3Rpb246IENvbXBvbmVudEluc3RydWN0aW9uKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgcHJldmlvdXNJbnN0cnVjdGlvbiA9IHRoaXMuX2N1cnJlbnRJbnN0cnVjdGlvbjtcbiAgICB0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24gPSBuZXh0SW5zdHJ1Y3Rpb247XG4gICAgdmFyIGNvbXBvbmVudFR5cGUgPSBuZXh0SW5zdHJ1Y3Rpb24uY29tcG9uZW50VHlwZTtcbiAgICB2YXIgY2hpbGRSb3V0ZXIgPSB0aGlzLl9wYXJlbnRSb3V0ZXIuY2hpbGRSb3V0ZXIoY29tcG9uZW50VHlwZSk7XG5cbiAgICB2YXIgcHJvdmlkZXJzID0gSW5qZWN0b3IucmVzb2x2ZShbXG4gICAgICBwcm92aWRlKFJvdXRlRGF0YSwge3VzZVZhbHVlOiBuZXh0SW5zdHJ1Y3Rpb24ucm91dGVEYXRhfSksXG4gICAgICBwcm92aWRlKFJvdXRlUGFyYW1zLCB7dXNlVmFsdWU6IG5ldyBSb3V0ZVBhcmFtcyhuZXh0SW5zdHJ1Y3Rpb24ucGFyYW1zKX0pLFxuICAgICAgcHJvdmlkZShyb3V0ZXJNb2QuUm91dGVyLCB7dXNlVmFsdWU6IGNoaWxkUm91dGVyfSlcbiAgICBdKTtcbiAgICB0aGlzLl9jb21wb25lbnRSZWYgPVxuICAgICAgICB0aGlzLl9sb2FkZXIubG9hZE5leHRUb0xvY2F0aW9uKGNvbXBvbmVudFR5cGUsIHRoaXMuX2VsZW1lbnRSZWYsIHByb3ZpZGVycyk7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudFJlZi50aGVuKChjb21wb25lbnRSZWYpID0+IHtcbiAgICAgIGlmIChoYXNMaWZlY3ljbGVIb29rKGhvb2tNb2Qucm91dGVyT25BY3RpdmF0ZSwgY29tcG9uZW50VHlwZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudFJlZi50aGVuKFxuICAgICAgICAgICAgKHJlZjogQ29tcG9uZW50UmVmKSA9PlxuICAgICAgICAgICAgICAgICg8T25BY3RpdmF0ZT5yZWYuaW5zdGFuY2UpLnJvdXRlck9uQWN0aXZhdGUobmV4dEluc3RydWN0aW9uLCBwcmV2aW91c0luc3RydWN0aW9uKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29tcG9uZW50UmVmO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBieSB0aGUge0BsaW5rIFJvdXRlcn0gZHVyaW5nIHRoZSBjb21taXQgcGhhc2Ugb2YgYSBuYXZpZ2F0aW9uIHdoZW4gYW4gb3V0bGV0XG4gICAqIHJldXNlcyBhIGNvbXBvbmVudCBiZXR3ZWVuIGRpZmZlcmVudCByb3V0ZXMuXG4gICAqIFRoaXMgbWV0aG9kIGluIHR1cm4gaXMgcmVzcG9uc2libGUgZm9yIGNhbGxpbmcgdGhlIGByb3V0ZXJPblJldXNlYCBob29rIG9mIGl0cyBjaGlsZC5cbiAgICovXG4gIHJldXNlKG5leHRJbnN0cnVjdGlvbjogQ29tcG9uZW50SW5zdHJ1Y3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBwcmV2aW91c0luc3RydWN0aW9uID0gdGhpcy5fY3VycmVudEluc3RydWN0aW9uO1xuICAgIHRoaXMuX2N1cnJlbnRJbnN0cnVjdGlvbiA9IG5leHRJbnN0cnVjdGlvbjtcblxuICAgIC8vIGl0J3MgcG9zc2libGUgdGhlIGNvbXBvbmVudCBpcyByZW1vdmVkIGJlZm9yZSBpdCBjYW4gYmUgcmVhY3RpdmF0ZWQgKGlmIG5lc3RlZCB3aXRoaW5nXG4gICAgLy8gYW5vdGhlciBkeW5hbWljYWxseSBsb2FkZWQgY29tcG9uZW50LCBmb3IgaW5zdGFuY2UpLiBJbiB0aGF0IGNhc2UsIHdlIHNpbXBseSBhY3RpdmF0ZVxuICAgIC8vIGEgbmV3IG9uZS5cbiAgICBpZiAoaXNCbGFuayh0aGlzLl9jb21wb25lbnRSZWYpKSB7XG4gICAgICByZXR1cm4gdGhpcy5hY3RpdmF0ZShuZXh0SW5zdHJ1Y3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIucmVzb2x2ZShcbiAgICAgICAgICBoYXNMaWZlY3ljbGVIb29rKGhvb2tNb2Qucm91dGVyT25SZXVzZSwgdGhpcy5fY3VycmVudEluc3RydWN0aW9uLmNvbXBvbmVudFR5cGUpID9cbiAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50UmVmLnRoZW4oXG4gICAgICAgICAgICAgICAgICAocmVmOiBDb21wb25lbnRSZWYpID0+XG4gICAgICAgICAgICAgICAgICAgICAgKDxPblJldXNlPnJlZi5pbnN0YW5jZSkucm91dGVyT25SZXVzZShuZXh0SW5zdHJ1Y3Rpb24sIHByZXZpb3VzSW5zdHJ1Y3Rpb24pKSA6XG4gICAgICAgICAgICAgIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgYnkgdGhlIHtAbGluayBSb3V0ZXJ9IHdoZW4gYW4gb3V0bGV0IGRpc3Bvc2VzIG9mIGEgY29tcG9uZW50J3MgY29udGVudHMuXG4gICAqIFRoaXMgbWV0aG9kIGluIHR1cm4gaXMgcmVzcG9uc2libGUgZm9yIGNhbGxpbmcgdGhlIGByb3V0ZXJPbkRlYWN0aXZhdGVgIGhvb2sgb2YgaXRzIGNoaWxkLlxuICAgKi9cbiAgZGVhY3RpdmF0ZShuZXh0SW5zdHJ1Y3Rpb246IENvbXBvbmVudEluc3RydWN0aW9uKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgbmV4dCA9IF9yZXNvbHZlVG9UcnVlO1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5fY29tcG9uZW50UmVmKSAmJiBpc1ByZXNlbnQodGhpcy5fY3VycmVudEluc3RydWN0aW9uKSAmJlxuICAgICAgICBoYXNMaWZlY3ljbGVIb29rKGhvb2tNb2Qucm91dGVyT25EZWFjdGl2YXRlLCB0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24uY29tcG9uZW50VHlwZSkpIHtcbiAgICAgIG5leHQgPSB0aGlzLl9jb21wb25lbnRSZWYudGhlbihcbiAgICAgICAgICAocmVmOiBDb21wb25lbnRSZWYpID0+XG4gICAgICAgICAgICAgICg8T25EZWFjdGl2YXRlPnJlZi5pbnN0YW5jZSlcbiAgICAgICAgICAgICAgICAgIC5yb3V0ZXJPbkRlYWN0aXZhdGUobmV4dEluc3RydWN0aW9uLCB0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24pKTtcbiAgICB9XG4gICAgcmV0dXJuIG5leHQudGhlbigoXykgPT4ge1xuICAgICAgaWYgKGlzUHJlc2VudCh0aGlzLl9jb21wb25lbnRSZWYpKSB7XG4gICAgICAgIHZhciBvbkRpc3Bvc2UgPSB0aGlzLl9jb21wb25lbnRSZWYudGhlbigocmVmOiBDb21wb25lbnRSZWYpID0+IHJlZi5kaXNwb3NlKCkpO1xuICAgICAgICB0aGlzLl9jb21wb25lbnRSZWYgPSBudWxsO1xuICAgICAgICByZXR1cm4gb25EaXNwb3NlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBieSB0aGUge0BsaW5rIFJvdXRlcn0gZHVyaW5nIHJlY29nbml0aW9uIHBoYXNlIG9mIGEgbmF2aWdhdGlvbi5cbiAgICpcbiAgICogSWYgdGhpcyByZXNvbHZlcyB0byBgZmFsc2VgLCB0aGUgZ2l2ZW4gbmF2aWdhdGlvbiBpcyBjYW5jZWxsZWQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGRlbGVnYXRlcyB0byB0aGUgY2hpbGQgY29tcG9uZW50J3MgYHJvdXRlckNhbkRlYWN0aXZhdGVgIGhvb2sgaWYgaXQgZXhpc3RzLFxuICAgKiBhbmQgb3RoZXJ3aXNlIHJlc29sdmVzIHRvIHRydWUuXG4gICAqL1xuICByb3V0ZXJDYW5EZWFjdGl2YXRlKG5leHRJbnN0cnVjdGlvbjogQ29tcG9uZW50SW5zdHJ1Y3Rpb24pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAoaXNCbGFuayh0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24pKSB7XG4gICAgICByZXR1cm4gX3Jlc29sdmVUb1RydWU7XG4gICAgfVxuICAgIGlmIChoYXNMaWZlY3ljbGVIb29rKGhvb2tNb2Qucm91dGVyQ2FuRGVhY3RpdmF0ZSwgdGhpcy5fY3VycmVudEluc3RydWN0aW9uLmNvbXBvbmVudFR5cGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50UmVmLnRoZW4oXG4gICAgICAgICAgKHJlZjogQ29tcG9uZW50UmVmKSA9PlxuICAgICAgICAgICAgICAoPENhbkRlYWN0aXZhdGU+cmVmLmluc3RhbmNlKVxuICAgICAgICAgICAgICAgICAgLnJvdXRlckNhbkRlYWN0aXZhdGUobmV4dEluc3RydWN0aW9uLCB0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF9yZXNvbHZlVG9UcnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgYnkgdGhlIHtAbGluayBSb3V0ZXJ9IGR1cmluZyByZWNvZ25pdGlvbiBwaGFzZSBvZiBhIG5hdmlnYXRpb24uXG4gICAqXG4gICAqIElmIHRoZSBuZXcgY2hpbGQgY29tcG9uZW50IGhhcyBhIGRpZmZlcmVudCBUeXBlIHRoYW4gdGhlIGV4aXN0aW5nIGNoaWxkIGNvbXBvbmVudCxcbiAgICogdGhpcyB3aWxsIHJlc29sdmUgdG8gYGZhbHNlYC4gWW91IGNhbid0IHJldXNlIGFuIG9sZCBjb21wb25lbnQgd2hlbiB0aGUgbmV3IGNvbXBvbmVudFxuICAgKiBpcyBvZiBhIGRpZmZlcmVudCBUeXBlLlxuICAgKlxuICAgKiBPdGhlcndpc2UsIHRoaXMgbWV0aG9kIGRlbGVnYXRlcyB0byB0aGUgY2hpbGQgY29tcG9uZW50J3MgYHJvdXRlckNhblJldXNlYCBob29rIGlmIGl0IGV4aXN0cyxcbiAgICogb3IgcmVzb2x2ZXMgdG8gdHJ1ZSBpZiB0aGUgaG9vayBpcyBub3QgcHJlc2VudC5cbiAgICovXG4gIHJvdXRlckNhblJldXNlKG5leHRJbnN0cnVjdGlvbjogQ29tcG9uZW50SW5zdHJ1Y3Rpb24pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB2YXIgcmVzdWx0O1xuXG4gICAgaWYgKGlzQmxhbmsodGhpcy5fY3VycmVudEluc3RydWN0aW9uKSB8fFxuICAgICAgICB0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24uY29tcG9uZW50VHlwZSAhPSBuZXh0SW5zdHJ1Y3Rpb24uY29tcG9uZW50VHlwZSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChoYXNMaWZlY3ljbGVIb29rKGhvb2tNb2Qucm91dGVyQ2FuUmV1c2UsIHRoaXMuX2N1cnJlbnRJbnN0cnVjdGlvbi5jb21wb25lbnRUeXBlKSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5fY29tcG9uZW50UmVmLnRoZW4oXG4gICAgICAgICAgKHJlZjogQ29tcG9uZW50UmVmKSA9PlxuICAgICAgICAgICAgICAoPENhblJldXNlPnJlZi5pbnN0YW5jZSkucm91dGVyQ2FuUmV1c2UobmV4dEluc3RydWN0aW9uLCB0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gbmV4dEluc3RydWN0aW9uID09IHRoaXMuX2N1cnJlbnRJbnN0cnVjdGlvbiB8fFxuICAgICAgICAgICAgICAgKGlzUHJlc2VudChuZXh0SW5zdHJ1Y3Rpb24ucGFyYW1zKSAmJiBpc1ByZXNlbnQodGhpcy5fY3VycmVudEluc3RydWN0aW9uLnBhcmFtcykgJiZcbiAgICAgICAgICAgICAgICBTdHJpbmdNYXBXcmFwcGVyLmVxdWFscyhuZXh0SW5zdHJ1Y3Rpb24ucGFyYW1zLCB0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24ucGFyYW1zKSk7XG4gICAgfVxuICAgIHJldHVybiA8UHJvbWlzZTxib29sZWFuPj5Qcm9taXNlV3JhcHBlci5yZXNvbHZlKHJlc3VsdCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHsgdGhpcy5fcGFyZW50Um91dGVyLnVucmVnaXN0ZXJQcmltYXJ5T3V0bGV0KHRoaXMpOyB9XG59XG4iXX0=