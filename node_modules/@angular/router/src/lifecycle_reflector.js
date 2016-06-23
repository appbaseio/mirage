"use strict";
var lang_1 = require('./facade/lang');
function hasLifecycleHook(name, obj) {
    if (lang_1.isBlank(obj))
        return false;
    var type = obj.constructor;
    if (!(type instanceof lang_1.Type))
        return false;
    return name in type.prototype;
}
exports.hasLifecycleHook = hasLifecycleHook;
//# sourceMappingURL=lifecycle_reflector.js.map