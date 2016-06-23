import { IS_DART, StringWrapper, isBlank, isArray, isStrictStringMap, isPrimitive } from './facade/lang';
import { StringMapWrapper } from './facade/collection';
export var MODULE_SUFFIX = IS_DART ? '.dart' : '';
var CAMEL_CASE_REGEXP = /([A-Z])/g;
var DASH_CASE_REGEXP = /-([a-z])/g;
export function camelCaseToDashCase(input) {
    return StringWrapper.replaceAllMapped(input, CAMEL_CASE_REGEXP, (m) => { return '-' + m[1].toLowerCase(); });
}
export function dashCaseToCamelCase(input) {
    return StringWrapper.replaceAllMapped(input, DASH_CASE_REGEXP, (m) => { return m[1].toUpperCase(); });
}
export function splitAtColon(input, defaultValues) {
    var parts = StringWrapper.split(input.trim(), /\s*:\s*/g);
    if (parts.length > 1) {
        return parts;
    }
    else {
        return defaultValues;
    }
}
export function sanitizeIdentifier(name) {
    return StringWrapper.replaceAll(name, /\W/g, '_');
}
export function visitValue(value, visitor, context) {
    if (isArray(value)) {
        return visitor.visitArray(value, context);
    }
    else if (isStrictStringMap(value)) {
        return visitor.visitStringMap(value, context);
    }
    else if (isBlank(value) || isPrimitive(value)) {
        return visitor.visitPrimitive(value, context);
    }
    else {
        return visitor.visitOther(value, context);
    }
}
export class ValueTransformer {
    visitArray(arr, context) {
        return arr.map(value => visitValue(value, this, context));
    }
    visitStringMap(map, context) {
        var result = {};
        StringMapWrapper.forEach(map, (value, key) => { result[key] = visitValue(value, this, context); });
        return result;
    }
    visitPrimitive(value, context) { return value; }
    visitOther(value, context) { return value; }
}
export function assetUrl(pkg, path = null, type = 'src') {
    if (IS_DART) {
        if (path == null) {
            return `asset:angular2/${pkg}/${pkg}.dart`;
        }
        else {
            return `asset:angular2/lib/${pkg}/src/${path}.dart`;
        }
    }
    else {
        if (path == null) {
            return `asset:@angular/lib/${pkg}/index`;
        }
        else {
            return `asset:@angular/lib/${pkg}/src/${path}`;
        }
    }
}
//# sourceMappingURL=util.js.map