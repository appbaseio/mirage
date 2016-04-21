'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ng_zone_1 = require('angular2/src/core/zone/ng_zone');
var lang_1 = require('angular2/src/facade/lang');
var di_1 = require('angular2/src/core/di');
var application_tokens_1 = require('./application_tokens');
var async_1 = require('angular2/src/facade/async');
var collection_1 = require('angular2/src/facade/collection');
var testability_1 = require('angular2/src/core/testability/testability');
var dynamic_component_loader_1 = require('angular2/src/core/linker/dynamic_component_loader');
var exceptions_1 = require('angular2/src/facade/exceptions');
var console_1 = require('angular2/src/core/console');
var profile_1 = require('./profile/profile');
var lang_2 = require('angular2/src/facade/lang');
/**
 * Construct providers specific to an individual root component.
 */
function _componentProviders(appComponentType) {
    return [
        di_1.provide(application_tokens_1.APP_COMPONENT, { useValue: appComponentType }),
        di_1.provide(application_tokens_1.APP_COMPONENT_REF_PROMISE, {
            useFactory: function (dynamicComponentLoader, appRef, injector) {
                // Save the ComponentRef for disposal later.
                var ref;
                // TODO(rado): investigate whether to support providers on root component.
                return dynamicComponentLoader.loadAsRoot(appComponentType, null, injector, function () { appRef._unloadComponent(ref); })
                    .then(function (componentRef) {
                    ref = componentRef;
                    var testability = injector.getOptional(testability_1.Testability);
                    if (lang_1.isPresent(testability)) {
                        injector.get(testability_1.TestabilityRegistry)
                            .registerApplication(componentRef.location.nativeElement, testability);
                    }
                    return componentRef;
                });
            },
            deps: [dynamic_component_loader_1.DynamicComponentLoader, ApplicationRef, di_1.Injector]
        }),
        di_1.provide(appComponentType, {
            useFactory: function (p) { return p.then(function (ref) { return ref.instance; }); },
            deps: [application_tokens_1.APP_COMPONENT_REF_PROMISE]
        }),
    ];
}
/**
 * Create an Angular zone.
 */
function createNgZone() {
    return new ng_zone_1.NgZone({ enableLongStackTrace: lang_1.assertionsEnabled() });
}
exports.createNgZone = createNgZone;
var _platform;
var _platformProviders;
/**
 * Initialize the Angular 'platform' on the page.
 *
 * See {@link PlatformRef} for details on the Angular platform.
 *
 * It is also possible to specify providers to be made in the new platform. These providers
 * will be shared between all applications on the page. For example, an abstraction for
 * the browser cookie jar should be bound at the platform level, because there is only one
 * cookie jar regardless of how many applications on the page will be accessing it.
 *
 * The platform function can be called multiple times as long as the same list of providers
 * is passed into each call. If the platform function is called with a different set of
 * provides, Angular will throw an exception.
 */
function platform(providers) {
    lang_2.lockMode();
    if (lang_1.isPresent(_platform)) {
        if (collection_1.ListWrapper.equals(_platformProviders, providers)) {
            return _platform;
        }
        else {
            throw new exceptions_1.BaseException("platform cannot be initialized with different sets of providers.");
        }
    }
    else {
        return _createPlatform(providers);
    }
}
exports.platform = platform;
/**
 * Dispose the existing platform.
 */
function disposePlatform() {
    if (lang_1.isPresent(_platform)) {
        _platform.dispose();
        _platform = null;
    }
}
exports.disposePlatform = disposePlatform;
function _createPlatform(providers) {
    _platformProviders = providers;
    var injector = di_1.Injector.resolveAndCreate(providers);
    _platform = new PlatformRef_(injector, function () {
        _platform = null;
        _platformProviders = null;
    });
    _runPlatformInitializers(injector);
    return _platform;
}
function _runPlatformInitializers(injector) {
    var inits = injector.getOptional(application_tokens_1.PLATFORM_INITIALIZER);
    if (lang_1.isPresent(inits))
        inits.forEach(function (init) { return init(); });
}
/**
 * The Angular platform is the entry point for Angular on a web page. Each page
 * has exactly one platform, and services (such as reflection) which are common
 * to every Angular application running on the page are bound in its scope.
 *
 * A page's platform is initialized implicitly when {@link bootstrap}() is called, or
 * explicitly by calling {@link platform}().
 */
var PlatformRef = (function () {
    function PlatformRef() {
    }
    Object.defineProperty(PlatformRef.prototype, "injector", {
        /**
         * Retrieve the platform {@link Injector}, which is the parent injector for
         * every Angular application on the page and provides singleton providers.
         */
        get: function () { throw exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    ;
    return PlatformRef;
}());
exports.PlatformRef = PlatformRef;
var PlatformRef_ = (function (_super) {
    __extends(PlatformRef_, _super);
    function PlatformRef_(_injector, _dispose) {
        _super.call(this);
        this._injector = _injector;
        this._dispose = _dispose;
        /** @internal */
        this._applications = [];
        /** @internal */
        this._disposeListeners = [];
    }
    PlatformRef_.prototype.registerDisposeListener = function (dispose) { this._disposeListeners.push(dispose); };
    Object.defineProperty(PlatformRef_.prototype, "injector", {
        get: function () { return this._injector; },
        enumerable: true,
        configurable: true
    });
    PlatformRef_.prototype.application = function (providers) {
        var app = this._initApp(createNgZone(), providers);
        if (async_1.PromiseWrapper.isPromise(app)) {
            throw new exceptions_1.BaseException("Cannot use asyncronous app initializers with application. Use asyncApplication instead.");
        }
        return app;
    };
    PlatformRef_.prototype.asyncApplication = function (bindingFn, additionalProviders) {
        var _this = this;
        var zone = createNgZone();
        var completer = async_1.PromiseWrapper.completer();
        if (bindingFn === null) {
            completer.resolve(this._initApp(zone, additionalProviders));
        }
        else {
            zone.run(function () {
                async_1.PromiseWrapper.then(bindingFn(zone), function (providers) {
                    if (lang_1.isPresent(additionalProviders)) {
                        providers = collection_1.ListWrapper.concat(providers, additionalProviders);
                    }
                    var promise = _this._initApp(zone, providers);
                    completer.resolve(promise);
                });
            });
        }
        return completer.promise;
    };
    PlatformRef_.prototype._initApp = function (zone, providers) {
        var _this = this;
        var injector;
        var app;
        zone.run(function () {
            providers = collection_1.ListWrapper.concat(providers, [
                di_1.provide(ng_zone_1.NgZone, { useValue: zone }),
                di_1.provide(ApplicationRef, { useFactory: function () { return app; }, deps: [] })
            ]);
            var exceptionHandler;
            try {
                injector = _this.injector.resolveAndCreateChild(providers);
                exceptionHandler = injector.get(exceptions_1.ExceptionHandler);
                async_1.ObservableWrapper.subscribe(zone.onError, function (error) {
                    exceptionHandler.call(error.error, error.stackTrace);
                });
            }
            catch (e) {
                if (lang_1.isPresent(exceptionHandler)) {
                    exceptionHandler.call(e, e.stack);
                }
                else {
                    lang_1.print(e.toString());
                }
            }
        });
        app = new ApplicationRef_(this, zone, injector);
        this._applications.push(app);
        var promise = _runAppInitializers(injector);
        if (promise !== null) {
            return async_1.PromiseWrapper.then(promise, function (_) { return app; });
        }
        else {
            return app;
        }
    };
    PlatformRef_.prototype.dispose = function () {
        collection_1.ListWrapper.clone(this._applications).forEach(function (app) { return app.dispose(); });
        this._disposeListeners.forEach(function (dispose) { return dispose(); });
        this._dispose();
    };
    /** @internal */
    PlatformRef_.prototype._applicationDisposed = function (app) { collection_1.ListWrapper.remove(this._applications, app); };
    return PlatformRef_;
}(PlatformRef));
exports.PlatformRef_ = PlatformRef_;
function _runAppInitializers(injector) {
    var inits = injector.getOptional(application_tokens_1.APP_INITIALIZER);
    var promises = [];
    if (lang_1.isPresent(inits)) {
        inits.forEach(function (init) {
            var retVal = init();
            if (async_1.PromiseWrapper.isPromise(retVal)) {
                promises.push(retVal);
            }
        });
    }
    if (promises.length > 0) {
        return async_1.PromiseWrapper.all(promises);
    }
    else {
        return null;
    }
}
/**
 * A reference to an Angular application running on a page.
 *
 * For more about Angular applications, see the documentation for {@link bootstrap}.
 */
var ApplicationRef = (function () {
    function ApplicationRef() {
    }
    Object.defineProperty(ApplicationRef.prototype, "injector", {
        /**
         * Retrieve the application {@link Injector}.
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ApplicationRef.prototype, "zone", {
        /**
         * Retrieve the application {@link NgZone}.
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ApplicationRef.prototype, "componentTypes", {
        /**
         * Get a list of component types registered to this application.
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    ;
    return ApplicationRef;
}());
exports.ApplicationRef = ApplicationRef;
var ApplicationRef_ = (function (_super) {
    __extends(ApplicationRef_, _super);
    function ApplicationRef_(_platform, _zone, _injector) {
        var _this = this;
        _super.call(this);
        this._platform = _platform;
        this._zone = _zone;
        this._injector = _injector;
        /** @internal */
        this._bootstrapListeners = [];
        /** @internal */
        this._disposeListeners = [];
        /** @internal */
        this._rootComponents = [];
        /** @internal */
        this._rootComponentTypes = [];
        /** @internal */
        this._changeDetectorRefs = [];
        /** @internal */
        this._runningTick = false;
        /** @internal */
        this._enforceNoNewChanges = false;
        if (lang_1.isPresent(this._zone)) {
            async_1.ObservableWrapper.subscribe(this._zone.onMicrotaskEmpty, function (_) { _this._zone.run(function () { _this.tick(); }); });
        }
        this._enforceNoNewChanges = lang_1.assertionsEnabled();
    }
    ApplicationRef_.prototype.registerBootstrapListener = function (listener) {
        this._bootstrapListeners.push(listener);
    };
    ApplicationRef_.prototype.registerDisposeListener = function (dispose) { this._disposeListeners.push(dispose); };
    ApplicationRef_.prototype.registerChangeDetector = function (changeDetector) {
        this._changeDetectorRefs.push(changeDetector);
    };
    ApplicationRef_.prototype.unregisterChangeDetector = function (changeDetector) {
        collection_1.ListWrapper.remove(this._changeDetectorRefs, changeDetector);
    };
    ApplicationRef_.prototype.bootstrap = function (componentType, providers) {
        var _this = this;
        var completer = async_1.PromiseWrapper.completer();
        this._zone.run(function () {
            var componentProviders = _componentProviders(componentType);
            if (lang_1.isPresent(providers)) {
                componentProviders.push(providers);
            }
            var exceptionHandler = _this._injector.get(exceptions_1.ExceptionHandler);
            _this._rootComponentTypes.push(componentType);
            try {
                var injector = _this._injector.resolveAndCreateChild(componentProviders);
                var compRefToken = injector.get(application_tokens_1.APP_COMPONENT_REF_PROMISE);
                var tick = function (componentRef) {
                    _this._loadComponent(componentRef);
                    completer.resolve(componentRef);
                };
                var tickResult = async_1.PromiseWrapper.then(compRefToken, tick);
                async_1.PromiseWrapper.then(tickResult, null, function (err, stackTrace) {
                    completer.reject(err, stackTrace);
                    exceptionHandler.call(err, stackTrace);
                });
            }
            catch (e) {
                exceptionHandler.call(e, e.stack);
                completer.reject(e, e.stack);
            }
        });
        return completer.promise.then(function (ref) {
            var c = _this._injector.get(console_1.Console);
            if (lang_1.assertionsEnabled()) {
                c.log("Angular 2 is running in the development mode. Call enableProdMode() to enable the production mode.");
            }
            return ref;
        });
    };
    /** @internal */
    ApplicationRef_.prototype._loadComponent = function (componentRef) {
        var appChangeDetector = componentRef.location.internalElement.parentView.changeDetector;
        this._changeDetectorRefs.push(appChangeDetector.ref);
        this.tick();
        this._rootComponents.push(componentRef);
        this._bootstrapListeners.forEach(function (listener) { return listener(componentRef); });
    };
    /** @internal */
    ApplicationRef_.prototype._unloadComponent = function (componentRef) {
        if (!collection_1.ListWrapper.contains(this._rootComponents, componentRef)) {
            return;
        }
        this.unregisterChangeDetector(componentRef.location.internalElement.parentView.changeDetector.ref);
        collection_1.ListWrapper.remove(this._rootComponents, componentRef);
    };
    Object.defineProperty(ApplicationRef_.prototype, "injector", {
        get: function () { return this._injector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationRef_.prototype, "zone", {
        get: function () { return this._zone; },
        enumerable: true,
        configurable: true
    });
    ApplicationRef_.prototype.tick = function () {
        if (this._runningTick) {
            throw new exceptions_1.BaseException("ApplicationRef.tick is called recursively");
        }
        var s = ApplicationRef_._tickScope();
        try {
            this._runningTick = true;
            this._changeDetectorRefs.forEach(function (detector) { return detector.detectChanges(); });
            if (this._enforceNoNewChanges) {
                this._changeDetectorRefs.forEach(function (detector) { return detector.checkNoChanges(); });
            }
        }
        finally {
            this._runningTick = false;
            profile_1.wtfLeave(s);
        }
    };
    ApplicationRef_.prototype.dispose = function () {
        // TODO(alxhub): Dispose of the NgZone.
        collection_1.ListWrapper.clone(this._rootComponents).forEach(function (ref) { return ref.dispose(); });
        this._disposeListeners.forEach(function (dispose) { return dispose(); });
        this._platform._applicationDisposed(this);
    };
    Object.defineProperty(ApplicationRef_.prototype, "componentTypes", {
        get: function () { return this._rootComponentTypes; },
        enumerable: true,
        configurable: true
    });
    /** @internal */
    ApplicationRef_._tickScope = profile_1.wtfCreateScope('ApplicationRef#tick()');
    return ApplicationRef_;
}(ApplicationRef));
exports.ApplicationRef_ = ApplicationRef_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2NvcmUvYXBwbGljYXRpb25fcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdCQUFrQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ25FLHFCQU9PLDBCQUEwQixDQUFDLENBQUE7QUFDbEMsbUJBQXVELHNCQUFzQixDQUFDLENBQUE7QUFDOUUsbUNBTU8sc0JBQXNCLENBQUMsQ0FBQTtBQUM5QixzQkFBa0UsMkJBQTJCLENBQUMsQ0FBQTtBQUM5RiwyQkFBMEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUMzRCw0QkFBK0MsMkNBQTJDLENBQUMsQ0FBQTtBQUMzRix5Q0FHTyxtREFBbUQsQ0FBQyxDQUFBO0FBQzNELDJCQUtPLGdDQUFnQyxDQUFDLENBQUE7QUFDeEMsd0JBQXNCLDJCQUEyQixDQUFDLENBQUE7QUFDbEQsd0JBQW1ELG1CQUFtQixDQUFDLENBQUE7QUFFdkUscUJBQXVCLDBCQUEwQixDQUFDLENBQUE7QUFHbEQ7O0dBRUc7QUFDSCw2QkFBNkIsZ0JBQXNCO0lBQ2pELE1BQU0sQ0FBQztRQUNMLFlBQU8sQ0FBQyxrQ0FBYSxFQUFFLEVBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFDLENBQUM7UUFDcEQsWUFBTyxDQUFDLDhDQUF5QixFQUN6QjtZQUNFLFVBQVUsRUFBRSxVQUFDLHNCQUE4QyxFQUFFLE1BQXVCLEVBQ3ZFLFFBQWtCO2dCQUM3Qiw0Q0FBNEM7Z0JBQzVDLElBQUksR0FBaUIsQ0FBQztnQkFDdEIsMEVBQTBFO2dCQUMxRSxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxRQUFRLEVBQ2hDLGNBQVEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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QUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUSxJQUFLLE9BQUEsUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUF6QixDQUF5QixDQUFDLENBQUM7WUFDNUUsQ0FBQztRQUNILENBQUM7Z0JBQVMsQ0FBQztZQUNULElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLGtCQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUVELGlDQUFPLEdBQVA7UUFDRSx1Q0FBdUM7UUFDdkMsd0JBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBYixDQUFhLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxJQUFLLE9BQUEsT0FBTyxFQUFFLEVBQVQsQ0FBUyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsc0JBQUksMkNBQWM7YUFBbEIsY0FBK0IsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBaklqRSxnQkFBZ0I7SUFDVCwwQkFBVSxHQUFlLHdCQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQWlJMUUsc0JBQUM7QUFBRCxDQUFDLEFBbklELENBQXFDLGNBQWMsR0FtSWxEO0FBbklZLHVCQUFlLGtCQW1JM0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Tmdab25lLCBOZ1pvbmVFcnJvcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvem9uZS9uZ196b25lJztcbmltcG9ydCB7XG4gIFR5cGUsXG4gIGlzQmxhbmssXG4gIGlzUHJlc2VudCxcbiAgYXNzZXJ0aW9uc0VuYWJsZWQsXG4gIHByaW50LFxuICBJU19EQVJUXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge3Byb3ZpZGUsIFByb3ZpZGVyLCBJbmplY3RvciwgT3BhcXVlVG9rZW59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7XG4gIEFQUF9DT01QT05FTlRfUkVGX1BST01JU0UsXG4gIEFQUF9DT01QT05FTlQsXG4gIEFQUF9JRF9SQU5ET01fUFJPVklERVIsXG4gIFBMQVRGT1JNX0lOSVRJQUxJWkVSLFxuICBBUFBfSU5JVElBTElaRVJcbn0gZnJvbSAnLi9hcHBsaWNhdGlvbl90b2tlbnMnO1xuaW1wb3J0IHtQcm9taXNlV3JhcHBlciwgUHJvbWlzZUNvbXBsZXRlciwgT2JzZXJ2YWJsZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7VGVzdGFiaWxpdHlSZWdpc3RyeSwgVGVzdGFiaWxpdHl9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3Rlc3RhYmlsaXR5L3Rlc3RhYmlsaXR5JztcbmltcG9ydCB7XG4gIENvbXBvbmVudFJlZixcbiAgRHluYW1pY0NvbXBvbmVudExvYWRlclxufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvZHluYW1pY19jb21wb25lbnRfbG9hZGVyJztcbmltcG9ydCB7XG4gIEJhc2VFeGNlcHRpb24sXG4gIFdyYXBwZWRFeGNlcHRpb24sXG4gIEV4Y2VwdGlvbkhhbmRsZXIsXG4gIHVuaW1wbGVtZW50ZWRcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7Q29uc29sZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvY29uc29sZSc7XG5pbXBvcnQge3d0ZkxlYXZlLCB3dGZDcmVhdGVTY29wZSwgV3RmU2NvcGVGbn0gZnJvbSAnLi9wcm9maWxlL3Byb2ZpbGUnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3RvclJlZn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0b3JfcmVmJztcbmltcG9ydCB7bG9ja01vZGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0VsZW1lbnRSZWZffSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvZWxlbWVudF9yZWYnO1xuXG4vKipcbiAqIENvbnN0cnVjdCBwcm92aWRlcnMgc3BlY2lmaWMgdG8gYW4gaW5kaXZpZHVhbCByb290IGNvbXBvbmVudC5cbiAqL1xuZnVuY3Rpb24gX2NvbXBvbmVudFByb3ZpZGVycyhhcHBDb21wb25lbnRUeXBlOiBUeXBlKTogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+IHtcbiAgcmV0dXJuIFtcbiAgICBwcm92aWRlKEFQUF9DT01QT05FTlQsIHt1c2VWYWx1ZTogYXBwQ29tcG9uZW50VHlwZX0pLFxuICAgIHByb3ZpZGUoQVBQX0NPTVBPTkVOVF9SRUZfUFJPTUlTRSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXNlRmFjdG9yeTogKGR5bmFtaWNDb21wb25lbnRMb2FkZXI6IER5bmFtaWNDb21wb25lbnRMb2FkZXIsIGFwcFJlZjogQXBwbGljYXRpb25SZWZfLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0b3I6IEluamVjdG9yKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gU2F2ZSB0aGUgQ29tcG9uZW50UmVmIGZvciBkaXNwb3NhbCBsYXRlci5cbiAgICAgICAgICAgICAgICB2YXIgcmVmOiBDb21wb25lbnRSZWY7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyhyYWRvKTogaW52ZXN0aWdhdGUgd2hldGhlciB0byBzdXBwb3J0IHByb3ZpZGVycyBvbiByb290IGNvbXBvbmVudC5cbiAgICAgICAgICAgICAgICByZXR1cm4gZHluYW1pY0NvbXBvbmVudExvYWRlci5sb2FkQXNSb290KGFwcENvbXBvbmVudFR5cGUsIG51bGwsIGluamVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4geyBhcHBSZWYuX3VubG9hZENvbXBvbmVudChyZWYpOyB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoY29tcG9uZW50UmVmKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVmID0gY29tcG9uZW50UmVmO1xuICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0YWJpbGl0eSA9IGluamVjdG9yLmdldE9wdGlvbmFsKFRlc3RhYmlsaXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNQcmVzZW50KHRlc3RhYmlsaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0b3IuZ2V0KFRlc3RhYmlsaXR5UmVnaXN0cnkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZ2lzdGVyQXBwbGljYXRpb24oY29tcG9uZW50UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsIHRlc3RhYmlsaXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudFJlZjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGRlcHM6IFtEeW5hbWljQ29tcG9uZW50TG9hZGVyLCBBcHBsaWNhdGlvblJlZiwgSW5qZWN0b3JdXG4gICAgICAgICAgICB9KSxcbiAgICBwcm92aWRlKGFwcENvbXBvbmVudFR5cGUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVzZUZhY3Rvcnk6IChwOiBQcm9taXNlPGFueT4pID0+IHAudGhlbihyZWYgPT4gcmVmLmluc3RhbmNlKSxcbiAgICAgICAgICAgICAgZGVwczogW0FQUF9DT01QT05FTlRfUkVGX1BST01JU0VdXG4gICAgICAgICAgICB9KSxcbiAgXTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gQW5ndWxhciB6b25lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTmdab25lKCk6IE5nWm9uZSB7XG4gIHJldHVybiBuZXcgTmdab25lKHtlbmFibGVMb25nU3RhY2tUcmFjZTogYXNzZXJ0aW9uc0VuYWJsZWQoKX0pO1xufVxuXG52YXIgX3BsYXRmb3JtOiBQbGF0Zm9ybVJlZjtcbnZhciBfcGxhdGZvcm1Qcm92aWRlcnM6IGFueVtdO1xuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIEFuZ3VsYXIgJ3BsYXRmb3JtJyBvbiB0aGUgcGFnZS5cbiAqXG4gKiBTZWUge0BsaW5rIFBsYXRmb3JtUmVmfSBmb3IgZGV0YWlscyBvbiB0aGUgQW5ndWxhciBwbGF0Zm9ybS5cbiAqXG4gKiBJdCBpcyBhbHNvIHBvc3NpYmxlIHRvIHNwZWNpZnkgcHJvdmlkZXJzIHRvIGJlIG1hZGUgaW4gdGhlIG5ldyBwbGF0Zm9ybS4gVGhlc2UgcHJvdmlkZXJzXG4gKiB3aWxsIGJlIHNoYXJlZCBiZXR3ZWVuIGFsbCBhcHBsaWNhdGlvbnMgb24gdGhlIHBhZ2UuIEZvciBleGFtcGxlLCBhbiBhYnN0cmFjdGlvbiBmb3JcbiAqIHRoZSBicm93c2VyIGNvb2tpZSBqYXIgc2hvdWxkIGJlIGJvdW5kIGF0IHRoZSBwbGF0Zm9ybSBsZXZlbCwgYmVjYXVzZSB0aGVyZSBpcyBvbmx5IG9uZVxuICogY29va2llIGphciByZWdhcmRsZXNzIG9mIGhvdyBtYW55IGFwcGxpY2F0aW9ucyBvbiB0aGUgcGFnZSB3aWxsIGJlIGFjY2Vzc2luZyBpdC5cbiAqXG4gKiBUaGUgcGxhdGZvcm0gZnVuY3Rpb24gY2FuIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcyBhcyBsb25nIGFzIHRoZSBzYW1lIGxpc3Qgb2YgcHJvdmlkZXJzXG4gKiBpcyBwYXNzZWQgaW50byBlYWNoIGNhbGwuIElmIHRoZSBwbGF0Zm9ybSBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhIGRpZmZlcmVudCBzZXQgb2ZcbiAqIHByb3ZpZGVzLCBBbmd1bGFyIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhdGZvcm0ocHJvdmlkZXJzPzogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+KTogUGxhdGZvcm1SZWYge1xuICBsb2NrTW9kZSgpO1xuICBpZiAoaXNQcmVzZW50KF9wbGF0Zm9ybSkpIHtcbiAgICBpZiAoTGlzdFdyYXBwZXIuZXF1YWxzKF9wbGF0Zm9ybVByb3ZpZGVycywgcHJvdmlkZXJzKSkge1xuICAgICAgcmV0dXJuIF9wbGF0Zm9ybTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXCJwbGF0Zm9ybSBjYW5ub3QgYmUgaW5pdGlhbGl6ZWQgd2l0aCBkaWZmZXJlbnQgc2V0cyBvZiBwcm92aWRlcnMuXCIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gX2NyZWF0ZVBsYXRmb3JtKHByb3ZpZGVycyk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwb3NlIHRoZSBleGlzdGluZyBwbGF0Zm9ybS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3Bvc2VQbGF0Zm9ybSgpOiB2b2lkIHtcbiAgaWYgKGlzUHJlc2VudChfcGxhdGZvcm0pKSB7XG4gICAgX3BsYXRmb3JtLmRpc3Bvc2UoKTtcbiAgICBfcGxhdGZvcm0gPSBudWxsO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVQbGF0Zm9ybShwcm92aWRlcnM/OiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pOiBQbGF0Zm9ybVJlZiB7XG4gIF9wbGF0Zm9ybVByb3ZpZGVycyA9IHByb3ZpZGVycztcbiAgbGV0IGluamVjdG9yID0gSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShwcm92aWRlcnMpO1xuICBfcGxhdGZvcm0gPSBuZXcgUGxhdGZvcm1SZWZfKGluamVjdG9yLCAoKSA9PiB7XG4gICAgX3BsYXRmb3JtID0gbnVsbDtcbiAgICBfcGxhdGZvcm1Qcm92aWRlcnMgPSBudWxsO1xuICB9KTtcbiAgX3J1blBsYXRmb3JtSW5pdGlhbGl6ZXJzKGluamVjdG9yKTtcbiAgcmV0dXJuIF9wbGF0Zm9ybTtcbn1cblxuZnVuY3Rpb24gX3J1blBsYXRmb3JtSW5pdGlhbGl6ZXJzKGluamVjdG9yOiBJbmplY3Rvcik6IHZvaWQge1xuICBsZXQgaW5pdHM6IEZ1bmN0aW9uW10gPSA8RnVuY3Rpb25bXT5pbmplY3Rvci5nZXRPcHRpb25hbChQTEFURk9STV9JTklUSUFMSVpFUik7XG4gIGlmIChpc1ByZXNlbnQoaW5pdHMpKSBpbml0cy5mb3JFYWNoKGluaXQgPT4gaW5pdCgpKTtcbn1cblxuLyoqXG4gKiBUaGUgQW5ndWxhciBwbGF0Zm9ybSBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIEFuZ3VsYXIgb24gYSB3ZWIgcGFnZS4gRWFjaCBwYWdlXG4gKiBoYXMgZXhhY3RseSBvbmUgcGxhdGZvcm0sIGFuZCBzZXJ2aWNlcyAoc3VjaCBhcyByZWZsZWN0aW9uKSB3aGljaCBhcmUgY29tbW9uXG4gKiB0byBldmVyeSBBbmd1bGFyIGFwcGxpY2F0aW9uIHJ1bm5pbmcgb24gdGhlIHBhZ2UgYXJlIGJvdW5kIGluIGl0cyBzY29wZS5cbiAqXG4gKiBBIHBhZ2UncyBwbGF0Zm9ybSBpcyBpbml0aWFsaXplZCBpbXBsaWNpdGx5IHdoZW4ge0BsaW5rIGJvb3RzdHJhcH0oKSBpcyBjYWxsZWQsIG9yXG4gKiBleHBsaWNpdGx5IGJ5IGNhbGxpbmcge0BsaW5rIHBsYXRmb3JtfSgpLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGxhdGZvcm1SZWYge1xuICAvKipcbiAgICogUmVnaXN0ZXIgYSBsaXN0ZW5lciB0byBiZSBjYWxsZWQgd2hlbiB0aGUgcGxhdGZvcm0gaXMgZGlzcG9zZWQuXG4gICAqL1xuICBhYnN0cmFjdCByZWdpc3RlckRpc3Bvc2VMaXN0ZW5lcihkaXNwb3NlOiAoKSA9PiB2b2lkKTogdm9pZDtcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIHBsYXRmb3JtIHtAbGluayBJbmplY3Rvcn0sIHdoaWNoIGlzIHRoZSBwYXJlbnQgaW5qZWN0b3IgZm9yXG4gICAqIGV2ZXJ5IEFuZ3VsYXIgYXBwbGljYXRpb24gb24gdGhlIHBhZ2UgYW5kIHByb3ZpZGVzIHNpbmdsZXRvbiBwcm92aWRlcnMuXG4gICAqL1xuICBnZXQgaW5qZWN0b3IoKTogSW5qZWN0b3IgeyB0aHJvdyB1bmltcGxlbWVudGVkKCk7IH07XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlIGEgbmV3IEFuZ3VsYXIgYXBwbGljYXRpb24gb24gdGhlIHBhZ2UuXG4gICAqXG4gICAqICMjIyBXaGF0IGlzIGFuIGFwcGxpY2F0aW9uP1xuICAgKlxuICAgKiBFYWNoIEFuZ3VsYXIgYXBwbGljYXRpb24gaGFzIGl0cyBvd24gem9uZSwgY2hhbmdlIGRldGVjdGlvbiwgY29tcGlsZXIsXG4gICAqIHJlbmRlcmVyLCBhbmQgb3RoZXIgZnJhbWV3b3JrIGNvbXBvbmVudHMuIEFuIGFwcGxpY2F0aW9uIGhvc3RzIG9uZSBvciBtb3JlXG4gICAqIHJvb3QgY29tcG9uZW50cywgd2hpY2ggY2FuIGJlIGluaXRpYWxpemVkIHZpYSBgQXBwbGljYXRpb25SZWYuYm9vdHN0cmFwKClgLlxuICAgKlxuICAgKiAjIyMgQXBwbGljYXRpb24gUHJvdmlkZXJzXG4gICAqXG4gICAqIEFuZ3VsYXIgYXBwbGljYXRpb25zIHJlcXVpcmUgbnVtZXJvdXMgcHJvdmlkZXJzIHRvIGJlIHByb3Blcmx5IGluc3RhbnRpYXRlZC5cbiAgICogV2hlbiB1c2luZyBgYXBwbGljYXRpb24oKWAgdG8gY3JlYXRlIGEgbmV3IGFwcCBvbiB0aGUgcGFnZSwgdGhlc2UgcHJvdmlkZXJzXG4gICAqIG11c3QgYmUgcHJvdmlkZWQuIEZvcnR1bmF0ZWx5LCB0aGVyZSBhcmUgaGVscGVyIGZ1bmN0aW9ucyB0byBjb25maWd1cmVcbiAgICogdHlwaWNhbCBwcm92aWRlcnMsIGFzIHNob3duIGluIHRoZSBleGFtcGxlIGJlbG93LlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiB7QGV4YW1wbGUgY29yZS90cy9wbGF0Zm9ybS9wbGF0Zm9ybS50cyByZWdpb249J2xvbmdmb3JtJ31cbiAgICogIyMjIFNlZSBBbHNvXG4gICAqXG4gICAqIFNlZSB0aGUge0BsaW5rIGJvb3RzdHJhcH0gZG9jdW1lbnRhdGlvbiBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKi9cbiAgYWJzdHJhY3QgYXBwbGljYXRpb24ocHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pOiBBcHBsaWNhdGlvblJlZjtcblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgYSBuZXcgQW5ndWxhciBhcHBsaWNhdGlvbiBvbiB0aGUgcGFnZSwgdXNpbmcgcHJvdmlkZXJzIHdoaWNoXG4gICAqIGFyZSBvbmx5IGF2YWlsYWJsZSBhc3luY2hyb25vdXNseS4gT25lIHN1Y2ggdXNlIGNhc2UgaXMgdG8gaW5pdGlhbGl6ZSBhblxuICAgKiBhcHBsaWNhdGlvbiBydW5uaW5nIGluIGEgd2ViIHdvcmtlci5cbiAgICpcbiAgICogIyMjIFVzYWdlXG4gICAqXG4gICAqIGBiaW5kaW5nRm5gIGlzIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCBpbiB0aGUgbmV3IGFwcGxpY2F0aW9uJ3Mgem9uZS5cbiAgICogSXQgc2hvdWxkIHJldHVybiBhIGBQcm9taXNlYCB0byBhIGxpc3Qgb2YgcHJvdmlkZXJzIHRvIGJlIHVzZWQgZm9yIHRoZVxuICAgKiBuZXcgYXBwbGljYXRpb24uIE9uY2UgdGhpcyBwcm9taXNlIHJlc29sdmVzLCB0aGUgYXBwbGljYXRpb24gd2lsbCBiZVxuICAgKiBjb25zdHJ1Y3RlZCBpbiB0aGUgc2FtZSBtYW5uZXIgYXMgYSBub3JtYWwgYGFwcGxpY2F0aW9uKClgLlxuICAgKi9cbiAgYWJzdHJhY3QgYXN5bmNBcHBsaWNhdGlvbihiaW5kaW5nRm46ICh6b25lOiBOZ1pvbmUpID0+IFByb21pc2U8QXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM/OiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pOiBQcm9taXNlPEFwcGxpY2F0aW9uUmVmPjtcblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgQW5ndWxhciBwbGF0Zm9ybSBhbmQgYWxsIEFuZ3VsYXIgYXBwbGljYXRpb25zIG9uIHRoZSBwYWdlLlxuICAgKi9cbiAgYWJzdHJhY3QgZGlzcG9zZSgpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgUGxhdGZvcm1SZWZfIGV4dGVuZHMgUGxhdGZvcm1SZWYge1xuICAvKiogQGludGVybmFsICovXG4gIF9hcHBsaWNhdGlvbnM6IEFwcGxpY2F0aW9uUmVmW10gPSBbXTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZGlzcG9zZUxpc3RlbmVyczogRnVuY3Rpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBfZGlzcG9zZTogKCkgPT4gdm9pZCkgeyBzdXBlcigpOyB9XG5cbiAgcmVnaXN0ZXJEaXNwb3NlTGlzdGVuZXIoZGlzcG9zZTogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9kaXNwb3NlTGlzdGVuZXJzLnB1c2goZGlzcG9zZSk7IH1cblxuICBnZXQgaW5qZWN0b3IoKTogSW5qZWN0b3IgeyByZXR1cm4gdGhpcy5faW5qZWN0b3I7IH1cblxuICBhcHBsaWNhdGlvbihwcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPik6IEFwcGxpY2F0aW9uUmVmIHtcbiAgICB2YXIgYXBwID0gdGhpcy5faW5pdEFwcChjcmVhdGVOZ1pvbmUoKSwgcHJvdmlkZXJzKTtcbiAgICBpZiAoUHJvbWlzZVdyYXBwZXIuaXNQcm9taXNlKGFwcCkpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgIFwiQ2Fubm90IHVzZSBhc3luY3Jvbm91cyBhcHAgaW5pdGlhbGl6ZXJzIHdpdGggYXBwbGljYXRpb24uIFVzZSBhc3luY0FwcGxpY2F0aW9uIGluc3RlYWQuXCIpO1xuICAgIH1cbiAgICByZXR1cm4gPEFwcGxpY2F0aW9uUmVmPmFwcDtcbiAgfVxuXG4gIGFzeW5jQXBwbGljYXRpb24oYmluZGluZ0ZuOiAoem9uZTogTmdab25lKSA9PiBQcm9taXNlPEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPj4sXG4gICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbFByb3ZpZGVycz86IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPik6IFByb21pc2U8QXBwbGljYXRpb25SZWY+IHtcbiAgICB2YXIgem9uZSA9IGNyZWF0ZU5nWm9uZSgpO1xuICAgIHZhciBjb21wbGV0ZXIgPSBQcm9taXNlV3JhcHBlci5jb21wbGV0ZXI8QXBwbGljYXRpb25SZWY+KCk7XG4gICAgaWYgKGJpbmRpbmdGbiA9PT0gbnVsbCkge1xuICAgICAgY29tcGxldGVyLnJlc29sdmUodGhpcy5faW5pdEFwcCh6b25lLCBhZGRpdGlvbmFsUHJvdmlkZXJzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgUHJvbWlzZVdyYXBwZXIudGhlbihiaW5kaW5nRm4oem9uZSksIChwcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPikgPT4ge1xuICAgICAgICAgIGlmIChpc1ByZXNlbnQoYWRkaXRpb25hbFByb3ZpZGVycykpIHtcbiAgICAgICAgICAgIHByb3ZpZGVycyA9IExpc3RXcmFwcGVyLmNvbmNhdChwcm92aWRlcnMsIGFkZGl0aW9uYWxQcm92aWRlcnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuX2luaXRBcHAoem9uZSwgcHJvdmlkZXJzKTtcbiAgICAgICAgICBjb21wbGV0ZXIucmVzb2x2ZShwcm9taXNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBsZXRlci5wcm9taXNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdEFwcCh6b25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pOiBQcm9taXNlPEFwcGxpY2F0aW9uUmVmPnxcbiAgICAgIEFwcGxpY2F0aW9uUmVmIHtcbiAgICB2YXIgaW5qZWN0b3I6IEluamVjdG9yO1xuICAgIHZhciBhcHA6IEFwcGxpY2F0aW9uUmVmO1xuICAgIHpvbmUucnVuKCgpID0+IHtcbiAgICAgIHByb3ZpZGVycyA9IExpc3RXcmFwcGVyLmNvbmNhdChwcm92aWRlcnMsIFtcbiAgICAgICAgcHJvdmlkZShOZ1pvbmUsIHt1c2VWYWx1ZTogem9uZX0pLFxuICAgICAgICBwcm92aWRlKEFwcGxpY2F0aW9uUmVmLCB7dXNlRmFjdG9yeTogKCk6IEFwcGxpY2F0aW9uUmVmID0+IGFwcCwgZGVwczogW119KVxuICAgICAgXSk7XG5cbiAgICAgIHZhciBleGNlcHRpb25IYW5kbGVyOiBFeGNlcHRpb25IYW5kbGVyO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaW5qZWN0b3IgPSB0aGlzLmluamVjdG9yLnJlc29sdmVBbmRDcmVhdGVDaGlsZChwcm92aWRlcnMpO1xuICAgICAgICBleGNlcHRpb25IYW5kbGVyID0gaW5qZWN0b3IuZ2V0KEV4Y2VwdGlvbkhhbmRsZXIpO1xuICAgICAgICBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUoem9uZS5vbkVycm9yLCAoZXJyb3I6IE5nWm9uZUVycm9yKSA9PiB7XG4gICAgICAgICAgZXhjZXB0aW9uSGFuZGxlci5jYWxsKGVycm9yLmVycm9yLCBlcnJvci5zdGFja1RyYWNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChpc1ByZXNlbnQoZXhjZXB0aW9uSGFuZGxlcikpIHtcbiAgICAgICAgICBleGNlcHRpb25IYW5kbGVyLmNhbGwoZSwgZS5zdGFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJpbnQoZS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGFwcCA9IG5ldyBBcHBsaWNhdGlvblJlZl8odGhpcywgem9uZSwgaW5qZWN0b3IpO1xuICAgIHRoaXMuX2FwcGxpY2F0aW9ucy5wdXNoKGFwcCk7XG4gICAgdmFyIHByb21pc2UgPSBfcnVuQXBwSW5pdGlhbGl6ZXJzKGluamVjdG9yKTtcbiAgICBpZiAocHJvbWlzZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFByb21pc2VXcmFwcGVyLnRoZW4ocHJvbWlzZSwgKF8pID0+IGFwcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhcHA7XG4gICAgfVxuICB9XG5cbiAgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICBMaXN0V3JhcHBlci5jbG9uZSh0aGlzLl9hcHBsaWNhdGlvbnMpLmZvckVhY2goKGFwcCkgPT4gYXBwLmRpc3Bvc2UoKSk7XG4gICAgdGhpcy5fZGlzcG9zZUxpc3RlbmVycy5mb3JFYWNoKChkaXNwb3NlKSA9PiBkaXNwb3NlKCkpO1xuICAgIHRoaXMuX2Rpc3Bvc2UoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FwcGxpY2F0aW9uRGlzcG9zZWQoYXBwOiBBcHBsaWNhdGlvblJlZik6IHZvaWQgeyBMaXN0V3JhcHBlci5yZW1vdmUodGhpcy5fYXBwbGljYXRpb25zLCBhcHApOyB9XG59XG5cbmZ1bmN0aW9uIF9ydW5BcHBJbml0aWFsaXplcnMoaW5qZWN0b3I6IEluamVjdG9yKTogUHJvbWlzZTxhbnk+IHtcbiAgbGV0IGluaXRzOiBGdW5jdGlvbltdID0gaW5qZWN0b3IuZ2V0T3B0aW9uYWwoQVBQX0lOSVRJQUxJWkVSKTtcbiAgbGV0IHByb21pc2VzOiBQcm9taXNlPGFueT5bXSA9IFtdO1xuICBpZiAoaXNQcmVzZW50KGluaXRzKSkge1xuICAgIGluaXRzLmZvckVhY2goaW5pdCA9PiB7XG4gICAgICB2YXIgcmV0VmFsID0gaW5pdCgpO1xuICAgICAgaWYgKFByb21pc2VXcmFwcGVyLmlzUHJvbWlzZShyZXRWYWwpKSB7XG4gICAgICAgIHByb21pc2VzLnB1c2gocmV0VmFsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAocHJvbWlzZXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBQcm9taXNlV3JhcHBlci5hbGwocHJvbWlzZXMpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogQSByZWZlcmVuY2UgdG8gYW4gQW5ndWxhciBhcHBsaWNhdGlvbiBydW5uaW5nIG9uIGEgcGFnZS5cbiAqXG4gKiBGb3IgbW9yZSBhYm91dCBBbmd1bGFyIGFwcGxpY2F0aW9ucywgc2VlIHRoZSBkb2N1bWVudGF0aW9uIGZvciB7QGxpbmsgYm9vdHN0cmFwfS5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFwcGxpY2F0aW9uUmVmIHtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgdG8gYmUgY2FsbGVkIGVhY2ggdGltZSBgYm9vdHN0cmFwKClgIGlzIGNhbGxlZCB0byBib290c3RyYXBcbiAgICogYSBuZXcgcm9vdCBjb21wb25lbnQuXG4gICAqL1xuICBhYnN0cmFjdCByZWdpc3RlckJvb3RzdHJhcExpc3RlbmVyKGxpc3RlbmVyOiAocmVmOiBDb21wb25lbnRSZWYpID0+IHZvaWQpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGxpc3RlbmVyIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhcHBsaWNhdGlvbiBpcyBkaXNwb3NlZC5cbiAgICovXG4gIGFic3RyYWN0IHJlZ2lzdGVyRGlzcG9zZUxpc3RlbmVyKGRpc3Bvc2U6ICgpID0+IHZvaWQpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBCb290c3RyYXAgYSBuZXcgY29tcG9uZW50IGF0IHRoZSByb290IGxldmVsIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogIyMjIEJvb3RzdHJhcCBwcm9jZXNzXG4gICAqXG4gICAqIFdoZW4gYm9vdHN0cmFwcGluZyBhIG5ldyByb290IGNvbXBvbmVudCBpbnRvIGFuIGFwcGxpY2F0aW9uLCBBbmd1bGFyIG1vdW50cyB0aGVcbiAgICogc3BlY2lmaWVkIGFwcGxpY2F0aW9uIGNvbXBvbmVudCBvbnRvIERPTSBlbGVtZW50cyBpZGVudGlmaWVkIGJ5IHRoZSBbY29tcG9uZW50VHlwZV0nc1xuICAgKiBzZWxlY3RvciBhbmQga2lja3Mgb2ZmIGF1dG9tYXRpYyBjaGFuZ2UgZGV0ZWN0aW9uIHRvIGZpbmlzaCBpbml0aWFsaXppbmcgdGhlIGNvbXBvbmVudC5cbiAgICpcbiAgICogIyMjIE9wdGlvbmFsIFByb3ZpZGVyc1xuICAgKlxuICAgKiBQcm92aWRlcnMgZm9yIHRoZSBnaXZlbiBjb21wb25lbnQgY2FuIG9wdGlvbmFsbHkgYmUgb3ZlcnJpZGRlbiB2aWEgdGhlIGBwcm92aWRlcnNgXG4gICAqIHBhcmFtZXRlci4gVGhlc2UgcHJvdmlkZXJzIHdpbGwgb25seSBhcHBseSBmb3IgdGhlIHJvb3QgY29tcG9uZW50IGJlaW5nIGFkZGVkIGFuZCBhbnlcbiAgICogY2hpbGQgY29tcG9uZW50cyB1bmRlciBpdC5cbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICoge0BleGFtcGxlIGNvcmUvdHMvcGxhdGZvcm0vcGxhdGZvcm0udHMgcmVnaW9uPSdsb25nZm9ybSd9XG4gICAqL1xuICBhYnN0cmFjdCBib290c3RyYXAoY29tcG9uZW50VHlwZTogVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVycz86IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPik6IFByb21pc2U8Q29tcG9uZW50UmVmPjtcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGFwcGxpY2F0aW9uIHtAbGluayBJbmplY3Rvcn0uXG4gICAqL1xuICBnZXQgaW5qZWN0b3IoKTogSW5qZWN0b3IgeyByZXR1cm4gPEluamVjdG9yPnVuaW1wbGVtZW50ZWQoKTsgfTtcblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGFwcGxpY2F0aW9uIHtAbGluayBOZ1pvbmV9LlxuICAgKi9cbiAgZ2V0IHpvbmUoKTogTmdab25lIHsgcmV0dXJuIDxOZ1pvbmU+dW5pbXBsZW1lbnRlZCgpOyB9O1xuXG4gIC8qKlxuICAgKiBEaXNwb3NlIG9mIHRoaXMgYXBwbGljYXRpb24gYW5kIGFsbCBvZiBpdHMgY29tcG9uZW50cy5cbiAgICovXG4gIGFic3RyYWN0IGRpc3Bvc2UoKTogdm9pZDtcblxuICAvKipcbiAgICogSW52b2tlIHRoaXMgbWV0aG9kIHRvIGV4cGxpY2l0bHkgcHJvY2VzcyBjaGFuZ2UgZGV0ZWN0aW9uIGFuZCBpdHMgc2lkZS1lZmZlY3RzLlxuICAgKlxuICAgKiBJbiBkZXZlbG9wbWVudCBtb2RlLCBgdGljaygpYCBhbHNvIHBlcmZvcm1zIGEgc2Vjb25kIGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUgdG8gZW5zdXJlIHRoYXQgbm9cbiAgICogZnVydGhlciBjaGFuZ2VzIGFyZSBkZXRlY3RlZC4gSWYgYWRkaXRpb25hbCBjaGFuZ2VzIGFyZSBwaWNrZWQgdXAgZHVyaW5nIHRoaXMgc2Vjb25kIGN5Y2xlLFxuICAgKiBiaW5kaW5ncyBpbiB0aGUgYXBwIGhhdmUgc2lkZS1lZmZlY3RzIHRoYXQgY2Fubm90IGJlIHJlc29sdmVkIGluIGEgc2luZ2xlIGNoYW5nZSBkZXRlY3Rpb25cbiAgICogcGFzcy5cbiAgICogSW4gdGhpcyBjYXNlLCBBbmd1bGFyIHRocm93cyBhbiBlcnJvciwgc2luY2UgYW4gQW5ndWxhciBhcHBsaWNhdGlvbiBjYW4gb25seSBoYXZlIG9uZSBjaGFuZ2VcbiAgICogZGV0ZWN0aW9uIHBhc3MgZHVyaW5nIHdoaWNoIGFsbCBjaGFuZ2UgZGV0ZWN0aW9uIG11c3QgY29tcGxldGUuXG4gICAqL1xuICBhYnN0cmFjdCB0aWNrKCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEdldCBhIGxpc3Qgb2YgY29tcG9uZW50IHR5cGVzIHJlZ2lzdGVyZWQgdG8gdGhpcyBhcHBsaWNhdGlvbi5cbiAgICovXG4gIGdldCBjb21wb25lbnRUeXBlcygpOiBUeXBlW10geyByZXR1cm4gPFR5cGVbXT51bmltcGxlbWVudGVkKCk7IH07XG59XG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvblJlZl8gZXh0ZW5kcyBBcHBsaWNhdGlvblJlZiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgc3RhdGljIF90aWNrU2NvcGU6IFd0ZlNjb3BlRm4gPSB3dGZDcmVhdGVTY29wZSgnQXBwbGljYXRpb25SZWYjdGljaygpJyk7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9ib290c3RyYXBMaXN0ZW5lcnM6IEZ1bmN0aW9uW10gPSBbXTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9kaXNwb3NlTGlzdGVuZXJzOiBGdW5jdGlvbltdID0gW107XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBfcm9vdENvbXBvbmVudHM6IENvbXBvbmVudFJlZltdID0gW107XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBfcm9vdENvbXBvbmVudFR5cGVzOiBUeXBlW10gPSBbXTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZnM6IENoYW5nZURldGVjdG9yUmVmW10gPSBbXTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9ydW5uaW5nVGljazogYm9vbGVhbiA9IGZhbHNlO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX2VuZm9yY2VOb05ld0NoYW5nZXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm1SZWZfLCBwcml2YXRlIF96b25lOiBOZ1pvbmUsIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKCk7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl96b25lKSkge1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuc3Vic2NyaWJlKHRoaXMuX3pvbmUub25NaWNyb3Rhc2tFbXB0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXykgPT4geyB0aGlzLl96b25lLnJ1bigoKSA9PiB7IHRoaXMudGljaygpOyB9KTsgfSk7XG4gICAgfVxuICAgIHRoaXMuX2VuZm9yY2VOb05ld0NoYW5nZXMgPSBhc3NlcnRpb25zRW5hYmxlZCgpO1xuICB9XG5cbiAgcmVnaXN0ZXJCb290c3RyYXBMaXN0ZW5lcihsaXN0ZW5lcjogKHJlZjogQ29tcG9uZW50UmVmKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fYm9vdHN0cmFwTGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICB9XG5cbiAgcmVnaXN0ZXJEaXNwb3NlTGlzdGVuZXIoZGlzcG9zZTogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9kaXNwb3NlTGlzdGVuZXJzLnB1c2goZGlzcG9zZSk7IH1cblxuICByZWdpc3RlckNoYW5nZURldGVjdG9yKGNoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZik6IHZvaWQge1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmcy5wdXNoKGNoYW5nZURldGVjdG9yKTtcbiAgfVxuXG4gIHVucmVnaXN0ZXJDaGFuZ2VEZXRlY3RvcihjaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYpOiB2b2lkIHtcbiAgICBMaXN0V3JhcHBlci5yZW1vdmUodGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWZzLCBjaGFuZ2VEZXRlY3Rvcik7XG4gIH1cblxuICBib290c3RyYXAoY29tcG9uZW50VHlwZTogVHlwZSxcbiAgICAgICAgICAgIHByb3ZpZGVycz86IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPik6IFByb21pc2U8Q29tcG9uZW50UmVmPiB7XG4gICAgdmFyIGNvbXBsZXRlciA9IFByb21pc2VXcmFwcGVyLmNvbXBsZXRlcigpO1xuICAgIHRoaXMuX3pvbmUucnVuKCgpID0+IHtcbiAgICAgIHZhciBjb21wb25lbnRQcm92aWRlcnMgPSBfY29tcG9uZW50UHJvdmlkZXJzKGNvbXBvbmVudFR5cGUpO1xuICAgICAgaWYgKGlzUHJlc2VudChwcm92aWRlcnMpKSB7XG4gICAgICAgIGNvbXBvbmVudFByb3ZpZGVycy5wdXNoKHByb3ZpZGVycyk7XG4gICAgICB9XG4gICAgICB2YXIgZXhjZXB0aW9uSGFuZGxlciA9IHRoaXMuX2luamVjdG9yLmdldChFeGNlcHRpb25IYW5kbGVyKTtcbiAgICAgIHRoaXMuX3Jvb3RDb21wb25lbnRUeXBlcy5wdXNoKGNvbXBvbmVudFR5cGUpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGluamVjdG9yOiBJbmplY3RvciA9IHRoaXMuX2luamVjdG9yLnJlc29sdmVBbmRDcmVhdGVDaGlsZChjb21wb25lbnRQcm92aWRlcnMpO1xuICAgICAgICB2YXIgY29tcFJlZlRva2VuOiBQcm9taXNlPENvbXBvbmVudFJlZj4gPSBpbmplY3Rvci5nZXQoQVBQX0NPTVBPTkVOVF9SRUZfUFJPTUlTRSk7XG4gICAgICAgIHZhciB0aWNrID0gKGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbG9hZENvbXBvbmVudChjb21wb25lbnRSZWYpO1xuICAgICAgICAgIGNvbXBsZXRlci5yZXNvbHZlKGNvbXBvbmVudFJlZik7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHRpY2tSZXN1bHQgPSBQcm9taXNlV3JhcHBlci50aGVuKGNvbXBSZWZUb2tlbiwgdGljayk7XG5cbiAgICAgICAgUHJvbWlzZVdyYXBwZXIudGhlbih0aWNrUmVzdWx0LCBudWxsLCAoZXJyLCBzdGFja1RyYWNlKSA9PiB7XG4gICAgICAgICAgY29tcGxldGVyLnJlamVjdChlcnIsIHN0YWNrVHJhY2UpO1xuICAgICAgICAgIGV4Y2VwdGlvbkhhbmRsZXIuY2FsbChlcnIsIHN0YWNrVHJhY2UpO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXhjZXB0aW9uSGFuZGxlci5jYWxsKGUsIGUuc3RhY2spO1xuICAgICAgICBjb21wbGV0ZXIucmVqZWN0KGUsIGUuc3RhY2spO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBjb21wbGV0ZXIucHJvbWlzZS50aGVuPENvbXBvbmVudFJlZj4oKHJlZjogQ29tcG9uZW50UmVmKSA9PiB7XG4gICAgICBsZXQgYyA9IHRoaXMuX2luamVjdG9yLmdldChDb25zb2xlKTtcbiAgICAgIGlmIChhc3NlcnRpb25zRW5hYmxlZCgpKSB7XG4gICAgICAgIGMubG9nKFxuICAgICAgICAgICAgXCJBbmd1bGFyIDIgaXMgcnVubmluZyBpbiB0aGUgZGV2ZWxvcG1lbnQgbW9kZS4gQ2FsbCBlbmFibGVQcm9kTW9kZSgpIHRvIGVuYWJsZSB0aGUgcHJvZHVjdGlvbiBtb2RlLlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZWY7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9sb2FkQ29tcG9uZW50KGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmKTogdm9pZCB7XG4gICAgdmFyIGFwcENoYW5nZURldGVjdG9yID1cbiAgICAgICAgKDxFbGVtZW50UmVmXz5jb21wb25lbnRSZWYubG9jYXRpb24pLmludGVybmFsRWxlbWVudC5wYXJlbnRWaWV3LmNoYW5nZURldGVjdG9yO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmcy5wdXNoKGFwcENoYW5nZURldGVjdG9yLnJlZik7XG4gICAgdGhpcy50aWNrKCk7XG4gICAgdGhpcy5fcm9vdENvbXBvbmVudHMucHVzaChjb21wb25lbnRSZWYpO1xuICAgIHRoaXMuX2Jvb3RzdHJhcExpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4gbGlzdGVuZXIoY29tcG9uZW50UmVmKSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91bmxvYWRDb21wb25lbnQoY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWYpOiB2b2lkIHtcbiAgICBpZiAoIUxpc3RXcmFwcGVyLmNvbnRhaW5zKHRoaXMuX3Jvb3RDb21wb25lbnRzLCBjb21wb25lbnRSZWYpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudW5yZWdpc3RlckNoYW5nZURldGVjdG9yKFxuICAgICAgICAoPEVsZW1lbnRSZWZfPmNvbXBvbmVudFJlZi5sb2NhdGlvbikuaW50ZXJuYWxFbGVtZW50LnBhcmVudFZpZXcuY2hhbmdlRGV0ZWN0b3IucmVmKTtcbiAgICBMaXN0V3JhcHBlci5yZW1vdmUodGhpcy5fcm9vdENvbXBvbmVudHMsIGNvbXBvbmVudFJlZik7XG4gIH1cblxuICBnZXQgaW5qZWN0b3IoKTogSW5qZWN0b3IgeyByZXR1cm4gdGhpcy5faW5qZWN0b3I7IH1cblxuICBnZXQgem9uZSgpOiBOZ1pvbmUgeyByZXR1cm4gdGhpcy5fem9uZTsgfVxuXG4gIHRpY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3J1bm5pbmdUaWNrKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcIkFwcGxpY2F0aW9uUmVmLnRpY2sgaXMgY2FsbGVkIHJlY3Vyc2l2ZWx5XCIpO1xuICAgIH1cblxuICAgIHZhciBzID0gQXBwbGljYXRpb25SZWZfLl90aWNrU2NvcGUoKTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fcnVubmluZ1RpY2sgPSB0cnVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWZzLmZvckVhY2goKGRldGVjdG9yKSA9PiBkZXRlY3Rvci5kZXRlY3RDaGFuZ2VzKCkpO1xuICAgICAgaWYgKHRoaXMuX2VuZm9yY2VOb05ld0NoYW5nZXMpIHtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWZzLmZvckVhY2goKGRldGVjdG9yKSA9PiBkZXRlY3Rvci5jaGVja05vQ2hhbmdlcygpKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5fcnVubmluZ1RpY2sgPSBmYWxzZTtcbiAgICAgIHd0ZkxlYXZlKHMpO1xuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2UoKTogdm9pZCB7XG4gICAgLy8gVE9ETyhhbHhodWIpOiBEaXNwb3NlIG9mIHRoZSBOZ1pvbmUuXG4gICAgTGlzdFdyYXBwZXIuY2xvbmUodGhpcy5fcm9vdENvbXBvbmVudHMpLmZvckVhY2goKHJlZikgPT4gcmVmLmRpc3Bvc2UoKSk7XG4gICAgdGhpcy5fZGlzcG9zZUxpc3RlbmVycy5mb3JFYWNoKChkaXNwb3NlKSA9PiBkaXNwb3NlKCkpO1xuICAgIHRoaXMuX3BsYXRmb3JtLl9hcHBsaWNhdGlvbkRpc3Bvc2VkKHRoaXMpO1xuICB9XG5cbiAgZ2V0IGNvbXBvbmVudFR5cGVzKCk6IFR5cGVbXSB7IHJldHVybiB0aGlzLl9yb290Q29tcG9uZW50VHlwZXM7IH1cbn1cbiJdfQ==