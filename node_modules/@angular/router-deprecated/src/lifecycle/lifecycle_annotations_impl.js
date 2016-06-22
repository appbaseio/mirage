"use strict";
/* @ts2dart_const */
var RouteLifecycleHook = (function () {
    function RouteLifecycleHook(name) {
        this.name = name;
    }
    return RouteLifecycleHook;
}());
exports.RouteLifecycleHook = RouteLifecycleHook;
/* @ts2dart_const */
var CanActivate = (function () {
    function CanActivate(fn) {
        this.fn = fn;
    }
    return CanActivate;
}());
exports.CanActivate = CanActivate;
exports.routerCanReuse = 
/*@ts2dart_const*/ new RouteLifecycleHook("routerCanReuse");
exports.routerCanDeactivate = 
/*@ts2dart_const*/ new RouteLifecycleHook("routerCanDeactivate");
exports.routerOnActivate = 
/*@ts2dart_const*/ new RouteLifecycleHook("routerOnActivate");
exports.routerOnReuse = 
/*@ts2dart_const*/ new RouteLifecycleHook("routerOnReuse");
exports.routerOnDeactivate = 
/*@ts2dart_const*/ new RouteLifecycleHook("routerOnDeactivate");
//# sourceMappingURL=lifecycle_annotations_impl.js.map