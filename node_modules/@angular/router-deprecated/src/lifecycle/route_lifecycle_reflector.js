"use strict";
var core_1 = require('@angular/core');
var lifecycle_annotations_impl_1 = require('./lifecycle_annotations_impl');
var core_2 = require('@angular/core');
function hasLifecycleHook(e, type) {
    if (!(type instanceof core_1.Type))
        return false;
    return e.name in type.prototype;
}
exports.hasLifecycleHook = hasLifecycleHook;
function getCanActivateHook(type) {
    var annotations = core_2.reflector.annotations(type);
    for (var i = 0; i < annotations.length; i += 1) {
        var annotation = annotations[i];
        if (annotation instanceof lifecycle_annotations_impl_1.CanActivate) {
            return annotation.fn;
        }
    }
    return null;
}
exports.getCanActivateHook = getCanActivateHook;
//# sourceMappingURL=route_lifecycle_reflector.js.map