'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var globalScope;
if (typeof window === 'undefined') {
    if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        // TODO: Replace any with WorkerGlobalScope from lib.webworker.d.ts #3492
        globalScope = self;
    }
    else {
        globalScope = global;
    }
}
else {
    globalScope = window;
}
function scheduleMicroTask(fn) {
    Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
}
exports.scheduleMicroTask = scheduleMicroTask;
exports.IS_DART = false;
// Need to declare a new variable for global here since TypeScript
// exports the original value of the symbol.
var _global = globalScope;
exports.global = _global;
exports.Type = Function;
function getTypeNameForDebugging(type) {
    if (type['name']) {
        return type['name'];
    }
    return typeof type;
}
exports.getTypeNameForDebugging = getTypeNameForDebugging;
exports.Math = _global.Math;
exports.Date = _global.Date;
var _devMode = true;
var _modeLocked = false;
function lockMode() {
    _modeLocked = true;
}
exports.lockMode = lockMode;
/**
 * Disable Angular's development mode, which turns off assertions and other
 * checks within the framework.
 *
 * One important assertion this disables verifies that a change detection pass
 * does not result in additional changes to any bindings (also known as
 * unidirectional data flow).
 */
function enableProdMode() {
    if (_modeLocked) {
        // Cannot use BaseException as that ends up importing from facade/lang.
        throw 'Cannot enable prod mode after platform setup.';
    }
    _devMode = false;
}
exports.enableProdMode = enableProdMode;
function assertionsEnabled() {
    return _devMode;
}
exports.assertionsEnabled = assertionsEnabled;
// TODO: remove calls to assert in production environment
// Note: Can't just export this and import in in other files
// as `assert` is a reserved keyword in Dart
_global.assert = function assert(condition) {
    // TODO: to be fixed properly via #2830, noop for now
};
// This function is needed only to properly support Dart's const expressions
// see https://github.com/angular/ts2dart/pull/151 for more info
function CONST_EXPR(expr) {
    return expr;
}
exports.CONST_EXPR = CONST_EXPR;
function CONST() {
    return function (target) { return target; };
}
exports.CONST = CONST;
function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
exports.isPresent = isPresent;
function isBlank(obj) {
    return obj === undefined || obj === null;
}
exports.isBlank = isBlank;
function isBoolean(obj) {
    return typeof obj === "boolean";
}
exports.isBoolean = isBoolean;
function isNumber(obj) {
    return typeof obj === "number";
}
exports.isNumber = isNumber;
function isString(obj) {
    return typeof obj === "string";
}
exports.isString = isString;
function isFunction(obj) {
    return typeof obj === "function";
}
exports.isFunction = isFunction;
function isType(obj) {
    return isFunction(obj);
}
exports.isType = isType;
function isStringMap(obj) {
    return typeof obj === 'object' && obj !== null;
}
exports.isStringMap = isStringMap;
function isPromise(obj) {
    return obj instanceof _global.Promise;
}
exports.isPromise = isPromise;
function isArray(obj) {
    return Array.isArray(obj);
}
exports.isArray = isArray;
function isDate(obj) {
    return obj instanceof exports.Date && !isNaN(obj.valueOf());
}
exports.isDate = isDate;
function noop() { }
exports.noop = noop;
function stringify(token) {
    if (typeof token === 'string') {
        return token;
    }
    if (token === undefined || token === null) {
        return '' + token;
    }
    if (token.name) {
        return token.name;
    }
    if (token.overriddenName) {
        return token.overriddenName;
    }
    var res = token.toString();
    var newLineIndex = res.indexOf("\n");
    return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
}
exports.stringify = stringify;
// serialize / deserialize enum exist only for consistency with dart API
// enums in typescript don't need to be serialized
function serializeEnum(val) {
    return val;
}
exports.serializeEnum = serializeEnum;
function deserializeEnum(val, values) {
    return val;
}
exports.deserializeEnum = deserializeEnum;
function resolveEnumToken(enumValue, val) {
    return enumValue[val];
}
exports.resolveEnumToken = resolveEnumToken;
var StringWrapper = (function () {
    function StringWrapper() {
    }
    StringWrapper.fromCharCode = function (code) { return String.fromCharCode(code); };
    StringWrapper.charCodeAt = function (s, index) { return s.charCodeAt(index); };
    StringWrapper.split = function (s, regExp) { return s.split(regExp); };
    StringWrapper.equals = function (s, s2) { return s === s2; };
    StringWrapper.stripLeft = function (s, charVal) {
        if (s && s.length) {
            var pos = 0;
            for (var i = 0; i < s.length; i++) {
                if (s[i] != charVal)
                    break;
                pos++;
            }
            s = s.substring(pos);
        }
        return s;
    };
    StringWrapper.stripRight = function (s, charVal) {
        if (s && s.length) {
            var pos = s.length;
            for (var i = s.length - 1; i >= 0; i--) {
                if (s[i] != charVal)
                    break;
                pos--;
            }
            s = s.substring(0, pos);
        }
        return s;
    };
    StringWrapper.replace = function (s, from, replace) {
        return s.replace(from, replace);
    };
    StringWrapper.replaceAll = function (s, from, replace) {
        return s.replace(from, replace);
    };
    StringWrapper.slice = function (s, from, to) {
        if (from === void 0) { from = 0; }
        if (to === void 0) { to = null; }
        return s.slice(from, to === null ? undefined : to);
    };
    StringWrapper.replaceAllMapped = function (s, from, cb) {
        return s.replace(from, function () {
            var matches = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                matches[_i - 0] = arguments[_i];
            }
            // Remove offset & string from the result array
            matches.splice(-2, 2);
            // The callback receives match, p1, ..., pn
            return cb(matches);
        });
    };
    StringWrapper.contains = function (s, substr) { return s.indexOf(substr) != -1; };
    StringWrapper.compare = function (a, b) {
        if (a < b) {
            return -1;
        }
        else if (a > b) {
            return 1;
        }
        else {
            return 0;
        }
    };
    return StringWrapper;
}());
exports.StringWrapper = StringWrapper;
var StringJoiner = (function () {
    function StringJoiner(parts) {
        if (parts === void 0) { parts = []; }
        this.parts = parts;
    }
    StringJoiner.prototype.add = function (part) { this.parts.push(part); };
    StringJoiner.prototype.toString = function () { return this.parts.join(""); };
    return StringJoiner;
}());
exports.StringJoiner = StringJoiner;
var NumberParseError = (function (_super) {
    __extends(NumberParseError, _super);
    function NumberParseError(message) {
        _super.call(this);
        this.message = message;
    }
    NumberParseError.prototype.toString = function () { return this.message; };
    return NumberParseError;
}(Error));
exports.NumberParseError = NumberParseError;
var NumberWrapper = (function () {
    function NumberWrapper() {
    }
    NumberWrapper.toFixed = function (n, fractionDigits) { return n.toFixed(fractionDigits); };
    NumberWrapper.equal = function (a, b) { return a === b; };
    NumberWrapper.parseIntAutoRadix = function (text) {
        var result = parseInt(text);
        if (isNaN(result)) {
            throw new NumberParseError("Invalid integer literal when parsing " + text);
        }
        return result;
    };
    NumberWrapper.parseInt = function (text, radix) {
        if (radix == 10) {
            if (/^(\-|\+)?[0-9]+$/.test(text)) {
                return parseInt(text, radix);
            }
        }
        else if (radix == 16) {
            if (/^(\-|\+)?[0-9ABCDEFabcdef]+$/.test(text)) {
                return parseInt(text, radix);
            }
        }
        else {
            var result = parseInt(text, radix);
            if (!isNaN(result)) {
                return result;
            }
        }
        throw new NumberParseError("Invalid integer literal when parsing " + text + " in base " +
            radix);
    };
    // TODO: NaN is a valid literal but is returned by parseFloat to indicate an error.
    NumberWrapper.parseFloat = function (text) { return parseFloat(text); };
    Object.defineProperty(NumberWrapper, "NaN", {
        get: function () { return NaN; },
        enumerable: true,
        configurable: true
    });
    NumberWrapper.isNaN = function (value) { return isNaN(value); };
    NumberWrapper.isInteger = function (value) { return Number.isInteger(value); };
    return NumberWrapper;
}());
exports.NumberWrapper = NumberWrapper;
exports.RegExp = _global.RegExp;
var RegExpWrapper = (function () {
    function RegExpWrapper() {
    }
    RegExpWrapper.create = function (regExpStr, flags) {
        if (flags === void 0) { flags = ''; }
        flags = flags.replace(/g/g, '');
        return new _global.RegExp(regExpStr, flags + 'g');
    };
    RegExpWrapper.firstMatch = function (regExp, input) {
        // Reset multimatch regex state
        regExp.lastIndex = 0;
        return regExp.exec(input);
    };
    RegExpWrapper.test = function (regExp, input) {
        regExp.lastIndex = 0;
        return regExp.test(input);
    };
    RegExpWrapper.matcher = function (regExp, input) {
        // Reset regex state for the case
        // someone did not loop over all matches
        // last time.
        regExp.lastIndex = 0;
        return { re: regExp, input: input };
    };
    RegExpWrapper.replaceAll = function (regExp, input, replace) {
        var c = regExp.exec(input);
        var res = '';
        regExp.lastIndex = 0;
        var prev = 0;
        while (c) {
            res += input.substring(prev, c.index);
            res += replace(c);
            prev = c.index + c[0].length;
            regExp.lastIndex = prev;
            c = regExp.exec(input);
        }
        res += input.substring(prev);
        return res;
    };
    return RegExpWrapper;
}());
exports.RegExpWrapper = RegExpWrapper;
var RegExpMatcherWrapper = (function () {
    function RegExpMatcherWrapper() {
    }
    RegExpMatcherWrapper.next = function (matcher) {
        return matcher.re.exec(matcher.input);
    };
    return RegExpMatcherWrapper;
}());
exports.RegExpMatcherWrapper = RegExpMatcherWrapper;
var FunctionWrapper = (function () {
    function FunctionWrapper() {
    }
    FunctionWrapper.apply = function (fn, posArgs) { return fn.apply(null, posArgs); };
    return FunctionWrapper;
}());
exports.FunctionWrapper = FunctionWrapper;
// JS has NaN !== NaN
function looseIdentical(a, b) {
    return a === b || typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b);
}
exports.looseIdentical = looseIdentical;
// JS considers NaN is the same as NaN for map Key (while NaN !== NaN otherwise)
// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
function getMapKey(value) {
    return value;
}
exports.getMapKey = getMapKey;
function normalizeBlank(obj) {
    return isBlank(obj) ? null : obj;
}
exports.normalizeBlank = normalizeBlank;
function normalizeBool(obj) {
    return isBlank(obj) ? false : obj;
}
exports.normalizeBool = normalizeBool;
function isJsObject(o) {
    return o !== null && (typeof o === "function" || typeof o === "object");
}
exports.isJsObject = isJsObject;
function print(obj) {
    console.log(obj);
}
exports.print = print;
// Can't be all uppercase as our transpiler would think it is a special directive...
var Json = (function () {
    function Json() {
    }
    Json.parse = function (s) { return _global.JSON.parse(s); };
    Json.stringify = function (data) {
        // Dart doesn't take 3 arguments
        return _global.JSON.stringify(data, null, 2);
    };
    return Json;
}());
exports.Json = Json;
var DateWrapper = (function () {
    function DateWrapper() {
    }
    DateWrapper.create = function (year, month, day, hour, minutes, seconds, milliseconds) {
        if (month === void 0) { month = 1; }
        if (day === void 0) { day = 1; }
        if (hour === void 0) { hour = 0; }
        if (minutes === void 0) { minutes = 0; }
        if (seconds === void 0) { seconds = 0; }
        if (milliseconds === void 0) { milliseconds = 0; }
        return new exports.Date(year, month - 1, day, hour, minutes, seconds, milliseconds);
    };
    DateWrapper.fromISOString = function (str) { return new exports.Date(str); };
    DateWrapper.fromMillis = function (ms) { return new exports.Date(ms); };
    DateWrapper.toMillis = function (date) { return date.getTime(); };
    DateWrapper.now = function () { return new exports.Date(); };
    DateWrapper.toJson = function (date) { return date.toJSON(); };
    return DateWrapper;
}());
exports.DateWrapper = DateWrapper;
function setValueOnPath(global, path, value) {
    var parts = path.split('.');
    var obj = global;
    while (parts.length > 1) {
        var name = parts.shift();
        if (obj.hasOwnProperty(name) && isPresent(obj[name])) {
            obj = obj[name];
        }
        else {
            obj = obj[name] = {};
        }
    }
    if (obj === undefined || obj === null) {
        obj = {};
    }
    obj[parts.shift()] = value;
}
exports.setValueOnPath = setValueOnPath;
var _symbolIterator = null;
function getSymbolIterator() {
    if (isBlank(_symbolIterator)) {
        if (isPresent(Symbol) && isPresent(Symbol.iterator)) {
            _symbolIterator = Symbol.iterator;
        }
        else {
            // es6-shim specific logic
            var keys = Object.getOwnPropertyNames(Map.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (key !== 'entries' && key !== 'size' &&
                    Map.prototype[key] === Map.prototype['entries']) {
                    _symbolIterator = key;
                }
            }
        }
    }
    return _symbolIterator;
}
exports.getSymbolIterator = getSymbolIterator;
function evalExpression(sourceUrl, expr, declarations, vars) {
    var fnBody = declarations + "\nreturn " + expr + "\n//# sourceURL=" + sourceUrl;
    var fnArgNames = [];
    var fnArgValues = [];
    for (var argName in vars) {
        fnArgNames.push(argName);
        fnArgValues.push(vars[argName]);
    }
    return new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat(fnBody))))().apply(void 0, fnArgValues);
}
exports.evalExpression = evalExpression;
function isPrimitive(obj) {
    return !isJsObject(obj);
}
exports.isPrimitive = isPrimitive;
function hasConstructor(value, type) {
    return value.constructor === type;
}
exports.hasConstructor = hasConstructor;
function bitWiseOr(values) {
    return values.reduce(function (a, b) { return a | b; });
}
exports.bitWiseOr = bitWiseOr;
function bitWiseAnd(values) {
    return values.reduce(function (a, b) { return a & b; });
}
exports.bitWiseAnd = bitWiseAnd;
function escape(s) {
    return _global.encodeURI(s);
}
exports.escape = escape;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUF3QkEsSUFBSSxXQUE4QixDQUFDO0FBQ25DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDbEMsRUFBRSxDQUFDLENBQUMsT0FBTyxpQkFBaUIsS0FBSyxXQUFXLElBQUksSUFBSSxZQUFZLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUNsRix5RUFBeUU7UUFDekUsV0FBVyxHQUFRLElBQUksQ0FBQztJQUMxQixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixXQUFXLEdBQVEsTUFBTSxDQUFDO0lBQzVCLENBQUM7QUFDSCxDQUFDO0FBQUMsSUFBSSxDQUFDLENBQUM7SUFDTixXQUFXLEdBQVEsTUFBTSxDQUFDO0FBQzVCLENBQUM7QUFFRCwyQkFBa0MsRUFBWTtJQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFGZSx5QkFBaUIsb0JBRWhDLENBQUE7QUFFWSxlQUFPLEdBQUcsS0FBSyxDQUFDO0FBRTdCLGtFQUFrRTtBQUNsRSw0Q0FBNEM7QUFDNUMsSUFBSSxPQUFPLEdBQXNCLFdBQVc7QUFFekIsY0FBTSxXQUZvQjtBQUlsQyxZQUFJLEdBQUcsUUFBUSxDQUFDO0FBZTNCLGlDQUF3QyxJQUFVO0lBQ2hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sSUFBSSxDQUFDO0FBQ3JCLENBQUM7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QUFNLFNBRXJCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIEJyb3dzZXJOb2RlR2xvYmFsIHtcbiAgT2JqZWN0OiB0eXBlb2YgT2JqZWN0O1xuICBBcnJheTogdHlwZW9mIEFycmF5O1xuICBNYXA6IHR5cGVvZiBNYXA7XG4gIFNldDogdHlwZW9mIFNldDtcbiAgRGF0ZTogRGF0ZUNvbnN0cnVjdG9yO1xuICBSZWdFeHA6IFJlZ0V4cENvbnN0cnVjdG9yO1xuICBKU09OOiB0eXBlb2YgSlNPTjtcbiAgTWF0aDogYW55OyAgLy8gdHlwZW9mIE1hdGg7XG4gIGFzc2VydChjb25kaXRpb246IGFueSk6IHZvaWQ7XG4gIFJlZmxlY3Q6IGFueTtcbiAgZ2V0QW5ndWxhclRlc3RhYmlsaXR5OiBGdW5jdGlvbjtcbiAgZ2V0QWxsQW5ndWxhclRlc3RhYmlsaXRpZXM6IEZ1bmN0aW9uO1xuICBnZXRBbGxBbmd1bGFyUm9vdEVsZW1lbnRzOiBGdW5jdGlvbjtcbiAgZnJhbWV3b3JrU3RhYmlsaXplcnM6IEFycmF5PEZ1bmN0aW9uPjtcbiAgc2V0VGltZW91dDogRnVuY3Rpb247XG4gIGNsZWFyVGltZW91dDogRnVuY3Rpb247XG4gIHNldEludGVydmFsOiBGdW5jdGlvbjtcbiAgY2xlYXJJbnRlcnZhbDogRnVuY3Rpb247XG4gIGVuY29kZVVSSTogRnVuY3Rpb247XG59XG5cbi8vIFRPRE8oanRlcGxpdHo2MDIpOiBMb2FkIFdvcmtlckdsb2JhbFNjb3BlIGZyb20gbGliLndlYndvcmtlci5kLnRzIGZpbGUgIzM0OTJcbmRlY2xhcmUgdmFyIFdvcmtlckdsb2JhbFNjb3BlO1xudmFyIGdsb2JhbFNjb3BlOiBCcm93c2VyTm9kZUdsb2JhbDtcbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICBpZiAodHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUpIHtcbiAgICAvLyBUT0RPOiBSZXBsYWNlIGFueSB3aXRoIFdvcmtlckdsb2JhbFNjb3BlIGZyb20gbGliLndlYndvcmtlci5kLnRzICMzNDkyXG4gICAgZ2xvYmFsU2NvcGUgPSA8YW55PnNlbGY7XG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsU2NvcGUgPSA8YW55Pmdsb2JhbDtcbiAgfVxufSBlbHNlIHtcbiAgZ2xvYmFsU2NvcGUgPSA8YW55PndpbmRvdztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlTWljcm9UYXNrKGZuOiBGdW5jdGlvbikge1xuICBab25lLmN1cnJlbnQuc2NoZWR1bGVNaWNyb1Rhc2soJ3NjaGVkdWxlTWljcm90YXNrJywgZm4pO1xufVxuXG5leHBvcnQgY29uc3QgSVNfREFSVCA9IGZhbHNlO1xuXG4vLyBOZWVkIHRvIGRlY2xhcmUgYSBuZXcgdmFyaWFibGUgZm9yIGdsb2JhbCBoZXJlIHNpbmNlIFR5cGVTY3JpcHRcbi8vIGV4cG9ydHMgdGhlIG9yaWdpbmFsIHZhbHVlIG9mIHRoZSBzeW1ib2wuXG52YXIgX2dsb2JhbDogQnJvd3Nlck5vZGVHbG9iYWwgPSBnbG9iYWxTY29wZTtcblxuZXhwb3J0IHtfZ2xvYmFsIGFzIGdsb2JhbH07XG5cbmV4cG9ydCB2YXIgVHlwZSA9IEZ1bmN0aW9uO1xuXG4vKipcbiAqIFJ1bnRpbWUgcmVwcmVzZW50YXRpb24gYSB0eXBlIHRoYXQgYSBDb21wb25lbnQgb3Igb3RoZXIgb2JqZWN0IGlzIGluc3RhbmNlcyBvZi5cbiAqXG4gKiBBbiBleGFtcGxlIG9mIGEgYFR5cGVgIGlzIGBNeUN1c3RvbUNvbXBvbmVudGAgY2xhc3MsIHdoaWNoIGluIEphdmFTY3JpcHQgaXMgYmUgcmVwcmVzZW50ZWQgYnlcbiAqIHRoZSBgTXlDdXN0b21Db21wb25lbnRgIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFR5cGUgZXh0ZW5kcyBGdW5jdGlvbiB7fVxuXG4vKipcbiAqIFJ1bnRpbWUgcmVwcmVzZW50YXRpb24gb2YgYSB0eXBlIHRoYXQgaXMgY29uc3RydWN0YWJsZSAobm9uLWFic3RyYWN0KS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb25jcmV0ZVR5cGUgZXh0ZW5kcyBUeXBlIHsgbmV3ICguLi5hcmdzKTogYW55OyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlTmFtZUZvckRlYnVnZ2luZyh0eXBlOiBUeXBlKTogc3RyaW5nIHtcbiAgaWYgKHR5cGVbJ25hbWUnXSkge1xuICAgIHJldHVybiB0eXBlWyduYW1lJ107XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiB0eXBlO1xufVxuXG5cbmV4cG9ydCB2YXIgTWF0aCA9IF9nbG9iYWwuTWF0aDtcbmV4cG9ydCB2YXIgRGF0ZSA9IF9nbG9iYWwuRGF0ZTtcblxudmFyIF9kZXZNb2RlOiBib29sZWFuID0gdHJ1ZTtcbnZhciBfbW9kZUxvY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9ja01vZGUoKSB7XG4gIF9tb2RlTG9ja2VkID0gdHJ1ZTtcbn1cblxuLyoqXG4gKiBEaXNhYmxlIEFuZ3VsYXIncyBkZXZlbG9wbWVudCBtb2RlLCB3aGljaCB0dXJucyBvZmYgYXNzZXJ0aW9ucyBhbmQgb3RoZXJcbiAqIGNoZWNrcyB3aXRoaW4gdGhlIGZyYW1ld29yay5cbiAqXG4gKiBPbmUgaW1wb3J0YW50IGFzc2VydGlvbiB0aGlzIGRpc2FibGVzIHZlcmlmaWVzIHRoYXQgYSBjaGFuZ2UgZGV0ZWN0aW9uIHBhc3NcbiAqIGRvZXMgbm90IHJlc3VsdCBpbiBhZGRpdGlvbmFsIGNoYW5nZXMgdG8gYW55IGJpbmRpbmdzIChhbHNvIGtub3duIGFzXG4gKiB1bmlkaXJlY3Rpb25hbCBkYXRhIGZsb3cpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlUHJvZE1vZGUoKSB7XG4gIGlmIChfbW9kZUxvY2tlZCkge1xuICAgIC8vIENhbm5vdCB1c2UgQmFzZUV4Y2VwdGlvbiBhcyB0aGF0IGVuZHMgdXAgaW1wb3J0aW5nIGZyb20gZmFjYWRlL2xhbmcuXG4gICAgdGhyb3cgJ0Nhbm5vdCBlbmFibGUgcHJvZCBtb2RlIGFmdGVyIHBsYXRmb3JtIHNldHVwLic7XG4gIH1cbiAgX2Rldk1vZGUgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydGlvbnNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gX2Rldk1vZGU7XG59XG5cbi8vIFRPRE86IHJlbW92ZSBjYWxscyB0byBhc3NlcnQgaW4gcHJvZHVjdGlvbiBlbnZpcm9ubWVudFxuLy8gTm90ZTogQ2FuJ3QganVzdCBleHBvcnQgdGhpcyBhbmQgaW1wb3J0IGluIGluIG90aGVyIGZpbGVzXG4vLyBhcyBgYXNzZXJ0YCBpcyBhIHJlc2VydmVkIGtleXdvcmQgaW4gRGFydFxuX2dsb2JhbC5hc3NlcnQgPSBmdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uKSB7XG4gIC8vIFRPRE86IHRvIGJlIGZpeGVkIHByb3Blcmx5IHZpYSAjMjgzMCwgbm9vcCBmb3Igbm93XG59O1xuXG4vLyBUaGlzIGZ1bmN0aW9uIGlzIG5lZWRlZCBvbmx5IHRvIHByb3Blcmx5IHN1cHBvcnQgRGFydCdzIGNvbnN0IGV4cHJlc3Npb25zXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvdHMyZGFydC9wdWxsLzE1MSBmb3IgbW9yZSBpbmZvXG5leHBvcnQgZnVuY3Rpb24gQ09OU1RfRVhQUjxUPihleHByOiBUKTogVCB7XG4gIHJldHVybiBleHByO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ09OU1QoKTogQ2xhc3NEZWNvcmF0b3IgJiBQcm9wZXJ0eURlY29yYXRvciB7XG4gIHJldHVybiAodGFyZ2V0KSA9PiB0YXJnZXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ByZXNlbnQob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIG9iaiAhPT0gdW5kZWZpbmVkICYmIG9iaiAhPT0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQmxhbmsob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIG9iaiA9PT0gdW5kZWZpbmVkIHx8IG9iaiA9PT0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm9vbGVhbihvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJib29sZWFuXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051bWJlcihvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJudW1iZXJcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKG9iajogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbihvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJmdW5jdGlvblwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUeXBlKG9iajogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0Z1bmN0aW9uKG9iaik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZ01hcChvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqICE9PSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9taXNlKG9iajogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiAoPGFueT5fZ2xvYmFsKS5Qcm9taXNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheShvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShvYmopO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEYXRlKG9iaik6IGJvb2xlYW4ge1xuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4ob2JqLnZhbHVlT2YoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub29wKCkge31cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeSh0b2tlbik6IHN0cmluZyB7XG4gIGlmICh0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9XG5cbiAgaWYgKHRva2VuID09PSB1bmRlZmluZWQgfHwgdG9rZW4gPT09IG51bGwpIHtcbiAgICByZXR1cm4gJycgKyB0b2tlbjtcbiAgfVxuXG4gIGlmICh0b2tlbi5uYW1lKSB7XG4gICAgcmV0dXJuIHRva2VuLm5hbWU7XG4gIH1cbiAgaWYgKHRva2VuLm92ZXJyaWRkZW5OYW1lKSB7XG4gICAgcmV0dXJuIHRva2VuLm92ZXJyaWRkZW5OYW1lO1xuICB9XG5cbiAgdmFyIHJlcyA9IHRva2VuLnRvU3RyaW5nKCk7XG4gIHZhciBuZXdMaW5lSW5kZXggPSByZXMuaW5kZXhPZihcIlxcblwiKTtcbiAgcmV0dXJuIChuZXdMaW5lSW5kZXggPT09IC0xKSA/IHJlcyA6IHJlcy5zdWJzdHJpbmcoMCwgbmV3TGluZUluZGV4KTtcbn1cblxuLy8gc2VyaWFsaXplIC8gZGVzZXJpYWxpemUgZW51bSBleGlzdCBvbmx5IGZvciBjb25zaXN0ZW5jeSB3aXRoIGRhcnQgQVBJXG4vLyBlbnVtcyBpbiB0eXBlc2NyaXB0IGRvbid0IG5lZWQgdG8gYmUgc2VyaWFsaXplZFxuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplRW51bSh2YWwpOiBudW1iZXIge1xuICByZXR1cm4gdmFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzZXJpYWxpemVFbnVtKHZhbCwgdmFsdWVzOiBNYXA8bnVtYmVyLCBhbnk+KTogYW55IHtcbiAgcmV0dXJuIHZhbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVFbnVtVG9rZW4oZW51bVZhbHVlLCB2YWwpOiBzdHJpbmcge1xuICByZXR1cm4gZW51bVZhbHVlW3ZhbF07XG59XG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdXcmFwcGVyIHtcbiAgc3RhdGljIGZyb21DaGFyQ29kZShjb2RlOiBudW1iZXIpOiBzdHJpbmcgeyByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTsgfVxuXG4gIHN0YXRpYyBjaGFyQ29kZUF0KHM6IHN0cmluZywgaW5kZXg6IG51bWJlcik6IG51bWJlciB7IHJldHVybiBzLmNoYXJDb2RlQXQoaW5kZXgpOyB9XG5cbiAgc3RhdGljIHNwbGl0KHM6IHN0cmluZywgcmVnRXhwOiBSZWdFeHApOiBzdHJpbmdbXSB7IHJldHVybiBzLnNwbGl0KHJlZ0V4cCk7IH1cblxuICBzdGF0aWMgZXF1YWxzKHM6IHN0cmluZywgczI6IHN0cmluZyk6IGJvb2xlYW4geyByZXR1cm4gcyA9PT0gczI7IH1cblxuICBzdGF0aWMgc3RyaXBMZWZ0KHM6IHN0cmluZywgY2hhclZhbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAocyAmJiBzLmxlbmd0aCkge1xuICAgICAgdmFyIHBvcyA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNbaV0gIT0gY2hhclZhbCkgYnJlYWs7XG4gICAgICAgIHBvcysrO1xuICAgICAgfVxuICAgICAgcyA9IHMuc3Vic3RyaW5nKHBvcyk7XG4gICAgfVxuICAgIHJldHVybiBzO1xuICB9XG5cbiAgc3RhdGljIHN0cmlwUmlnaHQoczogc3RyaW5nLCBjaGFyVmFsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmIChzICYmIHMubGVuZ3RoKSB7XG4gICAgICB2YXIgcG9zID0gcy5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAoc1tpXSAhPSBjaGFyVmFsKSBicmVhaztcbiAgICAgICAgcG9zLS07XG4gICAgICB9XG4gICAgICBzID0gcy5zdWJzdHJpbmcoMCwgcG9zKTtcbiAgICB9XG4gICAgcmV0dXJuIHM7XG4gIH1cblxuICBzdGF0aWMgcmVwbGFjZShzOiBzdHJpbmcsIGZyb206IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKGZyb20sIHJlcGxhY2UpO1xuICB9XG5cbiAgc3RhdGljIHJlcGxhY2VBbGwoczogc3RyaW5nLCBmcm9tOiBSZWdFeHAsIHJlcGxhY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHMucmVwbGFjZShmcm9tLCByZXBsYWNlKTtcbiAgfVxuXG4gIHN0YXRpYyBzbGljZTxUPihzOiBzdHJpbmcsIGZyb206IG51bWJlciA9IDAsIHRvOiBudW1iZXIgPSBudWxsKTogc3RyaW5nIHtcbiAgICByZXR1cm4gcy5zbGljZShmcm9tLCB0byA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IHRvKTtcbiAgfVxuXG4gIHN0YXRpYyByZXBsYWNlQWxsTWFwcGVkKHM6IHN0cmluZywgZnJvbTogUmVnRXhwLCBjYjogRnVuY3Rpb24pOiBzdHJpbmcge1xuICAgIHJldHVybiBzLnJlcGxhY2UoZnJvbSwgZnVuY3Rpb24oLi4ubWF0Y2hlcykge1xuICAgICAgLy8gUmVtb3ZlIG9mZnNldCAmIHN0cmluZyBmcm9tIHRoZSByZXN1bHQgYXJyYXlcbiAgICAgIG1hdGNoZXMuc3BsaWNlKC0yLCAyKTtcbiAgICAgIC8vIFRoZSBjYWxsYmFjayByZWNlaXZlcyBtYXRjaCwgcDEsIC4uLiwgcG5cbiAgICAgIHJldHVybiBjYihtYXRjaGVzKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBjb250YWlucyhzOiBzdHJpbmcsIHN1YnN0cjogc3RyaW5nKTogYm9vbGVhbiB7IHJldHVybiBzLmluZGV4T2Yoc3Vic3RyKSAhPSAtMTsgfVxuXG4gIHN0YXRpYyBjb21wYXJlKGE6IHN0cmluZywgYjogc3RyaW5nKTogbnVtYmVyIHtcbiAgICBpZiAoYSA8IGIpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9IGVsc2UgaWYgKGEgPiBiKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdKb2luZXIge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFydHMgPSBbXSkge31cblxuICBhZGQocGFydDogc3RyaW5nKTogdm9pZCB7IHRoaXMucGFydHMucHVzaChwYXJ0KTsgfVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnBhcnRzLmpvaW4oXCJcIik7IH1cbn1cblxuZXhwb3J0IGNsYXNzIE51bWJlclBhcnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIG5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWVzc2FnZTogc3RyaW5nKSB7IHN1cGVyKCk7IH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5tZXNzYWdlOyB9XG59XG5cblxuZXhwb3J0IGNsYXNzIE51bWJlcldyYXBwZXIge1xuICBzdGF0aWMgdG9GaXhlZChuOiBudW1iZXIsIGZyYWN0aW9uRGlnaXRzOiBudW1iZXIpOiBzdHJpbmcgeyByZXR1cm4gbi50b0ZpeGVkKGZyYWN0aW9uRGlnaXRzKTsgfVxuXG4gIHN0YXRpYyBlcXVhbChhOiBudW1iZXIsIGI6IG51bWJlcik6IGJvb2xlYW4geyByZXR1cm4gYSA9PT0gYjsgfVxuXG4gIHN0YXRpYyBwYXJzZUludEF1dG9SYWRpeCh0ZXh0OiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHZhciByZXN1bHQ6IG51bWJlciA9IHBhcnNlSW50KHRleHQpO1xuICAgIGlmIChpc05hTihyZXN1bHQpKSB7XG4gICAgICB0aHJvdyBuZXcgTnVtYmVyUGFyc2VFcnJvcihcIkludmFsaWQgaW50ZWdlciBsaXRlcmFsIHdoZW4gcGFyc2luZyBcIiArIHRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgc3RhdGljIHBhcnNlSW50KHRleHQ6IHN0cmluZywgcmFkaXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgaWYgKHJhZGl4ID09IDEwKSB7XG4gICAgICBpZiAoL14oXFwtfFxcKyk/WzAtOV0rJC8udGVzdCh0ZXh0KSkge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGV4dCwgcmFkaXgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmFkaXggPT0gMTYpIHtcbiAgICAgIGlmICgvXihcXC18XFwrKT9bMC05QUJDREVGYWJjZGVmXSskLy50ZXN0KHRleHQpKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0ZXh0LCByYWRpeCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXN1bHQ6IG51bWJlciA9IHBhcnNlSW50KHRleHQsIHJhZGl4KTtcbiAgICAgIGlmICghaXNOYU4ocmVzdWx0KSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgTnVtYmVyUGFyc2VFcnJvcihcIkludmFsaWQgaW50ZWdlciBsaXRlcmFsIHdoZW4gcGFyc2luZyBcIiArIHRleHQgKyBcIiBpbiBiYXNlIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYWRpeCk7XG4gIH1cblxuICAvLyBUT0RPOiBOYU4gaXMgYSB2YWxpZCBsaXRlcmFsIGJ1dCBpcyByZXR1cm5lZCBieSBwYXJzZUZsb2F0IHRvIGluZGljYXRlIGFuIGVycm9yLlxuICBzdGF0aWMgcGFyc2VGbG9hdCh0ZXh0OiBzdHJpbmcpOiBudW1iZXIgeyByZXR1cm4gcGFyc2VGbG9hdCh0ZXh0KTsgfVxuXG4gIHN0YXRpYyBnZXQgTmFOKCk6IG51bWJlciB7IHJldHVybiBOYU47IH1cblxuICBzdGF0aWMgaXNOYU4odmFsdWU6IGFueSk6IGJvb2xlYW4geyByZXR1cm4gaXNOYU4odmFsdWUpOyB9XG5cbiAgc3RhdGljIGlzSW50ZWdlcih2YWx1ZTogYW55KTogYm9vbGVhbiB7IHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTsgfVxufVxuXG5leHBvcnQgdmFyIFJlZ0V4cCA9IF9nbG9iYWwuUmVnRXhwO1xuXG5leHBvcnQgY2xhc3MgUmVnRXhwV3JhcHBlciB7XG4gIHN0YXRpYyBjcmVhdGUocmVnRXhwU3RyOiBzdHJpbmcsIGZsYWdzOiBzdHJpbmcgPSAnJyk6IFJlZ0V4cCB7XG4gICAgZmxhZ3MgPSBmbGFncy5yZXBsYWNlKC9nL2csICcnKTtcbiAgICByZXR1cm4gbmV3IF9nbG9iYWwuUmVnRXhwKHJlZ0V4cFN0ciwgZmxhZ3MgKyAnZycpO1xuICB9XG4gIHN0YXRpYyBmaXJzdE1hdGNoKHJlZ0V4cDogUmVnRXhwLCBpbnB1dDogc3RyaW5nKTogUmVnRXhwRXhlY0FycmF5IHtcbiAgICAvLyBSZXNldCBtdWx0aW1hdGNoIHJlZ2V4IHN0YXRlXG4gICAgcmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHJlZ0V4cC5leGVjKGlucHV0KTtcbiAgfVxuICBzdGF0aWMgdGVzdChyZWdFeHA6IFJlZ0V4cCwgaW5wdXQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiByZWdFeHAudGVzdChpbnB1dCk7XG4gIH1cbiAgc3RhdGljIG1hdGNoZXIocmVnRXhwOiBSZWdFeHAsIGlucHV0OiBzdHJpbmcpOiB7XG4gICAgcmU6IFJlZ0V4cDtcbiAgICBpbnB1dDogc3RyaW5nXG4gIH1cbiAge1xuICAgIC8vIFJlc2V0IHJlZ2V4IHN0YXRlIGZvciB0aGUgY2FzZVxuICAgIC8vIHNvbWVvbmUgZGlkIG5vdCBsb29wIG92ZXIgYWxsIG1hdGNoZXNcbiAgICAvLyBsYXN0IHRpbWUuXG4gICAgcmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHtyZTogcmVnRXhwLCBpbnB1dDogaW5wdXR9O1xuICB9XG4gIHN0YXRpYyByZXBsYWNlQWxsKHJlZ0V4cDogUmVnRXhwLCBpbnB1dDogc3RyaW5nLCByZXBsYWNlOiBGdW5jdGlvbik6IHN0cmluZyB7XG4gICAgbGV0IGMgPSByZWdFeHAuZXhlYyhpbnB1dCk7XG4gICAgbGV0IHJlcyA9ICcnO1xuICAgIHJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgIGxldCBwcmV2ID0gMDtcbiAgICB3aGlsZSAoYykge1xuICAgICAgcmVzICs9IGlucHV0LnN1YnN0cmluZyhwcmV2LCBjLmluZGV4KTtcbiAgICAgIHJlcyArPSByZXBsYWNlKGMpO1xuICAgICAgcHJldiA9IGMuaW5kZXggKyBjWzBdLmxlbmd0aDtcbiAgICAgIHJlZ0V4cC5sYXN0SW5kZXggPSBwcmV2O1xuICAgICAgYyA9IHJlZ0V4cC5leGVjKGlucHV0KTtcbiAgICB9XG4gICAgcmVzICs9IGlucHV0LnN1YnN0cmluZyhwcmV2KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWdFeHBNYXRjaGVyV3JhcHBlciB7XG4gIHN0YXRpYyBuZXh0KG1hdGNoZXI6IHtcbiAgICByZTogUmVnRXhwO1xuICAgIGlucHV0OiBzdHJpbmdcbiAgfSk6IFJlZ0V4cEV4ZWNBcnJheSB7XG4gICAgcmV0dXJuIG1hdGNoZXIucmUuZXhlYyhtYXRjaGVyLmlucHV0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25XcmFwcGVyIHtcbiAgc3RhdGljIGFwcGx5KGZuOiBGdW5jdGlvbiwgcG9zQXJnczogYW55KTogYW55IHsgcmV0dXJuIGZuLmFwcGx5KG51bGwsIHBvc0FyZ3MpOyB9XG59XG5cbi8vIEpTIGhhcyBOYU4gIT09IE5hTlxuZXhwb3J0IGZ1bmN0aW9uIGxvb3NlSWRlbnRpY2FsKGEsIGIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGEgPT09IGIgfHwgdHlwZW9mIGEgPT09IFwibnVtYmVyXCIgJiYgdHlwZW9mIGIgPT09IFwibnVtYmVyXCIgJiYgaXNOYU4oYSkgJiYgaXNOYU4oYik7XG59XG5cbi8vIEpTIGNvbnNpZGVycyBOYU4gaXMgdGhlIHNhbWUgYXMgTmFOIGZvciBtYXAgS2V5ICh3aGlsZSBOYU4gIT09IE5hTiBvdGhlcndpc2UpXG4vLyBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWFwXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWFwS2V5PFQ+KHZhbHVlOiBUKTogVCB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUJsYW5rKG9iajogT2JqZWN0KTogYW55IHtcbiAgcmV0dXJuIGlzQmxhbmsob2JqKSA/IG51bGwgOiBvYmo7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVCb29sKG9iajogYm9vbGVhbik6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNCbGFuayhvYmopID8gZmFsc2UgOiBvYmo7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0pzT2JqZWN0KG86IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gbyAhPT0gbnVsbCAmJiAodHlwZW9mIG8gPT09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgbyA9PT0gXCJvYmplY3RcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmludChvYmo6IEVycm9yIHwgT2JqZWN0KSB7XG4gIGNvbnNvbGUubG9nKG9iaik7XG59XG5cbi8vIENhbid0IGJlIGFsbCB1cHBlcmNhc2UgYXMgb3VyIHRyYW5zcGlsZXIgd291bGQgdGhpbmsgaXQgaXMgYSBzcGVjaWFsIGRpcmVjdGl2ZS4uLlxuZXhwb3J0IGNsYXNzIEpzb24ge1xuICBzdGF0aWMgcGFyc2Uoczogc3RyaW5nKTogT2JqZWN0IHsgcmV0dXJuIF9nbG9iYWwuSlNPTi5wYXJzZShzKTsgfVxuICBzdGF0aWMgc3RyaW5naWZ5KGRhdGE6IE9iamVjdCk6IHN0cmluZyB7XG4gICAgLy8gRGFydCBkb2Vzbid0IHRha2UgMyBhcmd1bWVudHNcbiAgICByZXR1cm4gX2dsb2JhbC5KU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCAyKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGF0ZVdyYXBwZXIge1xuICBzdGF0aWMgY3JlYXRlKHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlciA9IDEsIGRheTogbnVtYmVyID0gMSwgaG91cjogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgICBtaW51dGVzOiBudW1iZXIgPSAwLCBzZWNvbmRzOiBudW1iZXIgPSAwLCBtaWxsaXNlY29uZHM6IG51bWJlciA9IDApOiBEYXRlIHtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBkYXksIGhvdXIsIG1pbnV0ZXMsIHNlY29uZHMsIG1pbGxpc2Vjb25kcyk7XG4gIH1cbiAgc3RhdGljIGZyb21JU09TdHJpbmcoc3RyOiBzdHJpbmcpOiBEYXRlIHsgcmV0dXJuIG5ldyBEYXRlKHN0cik7IH1cbiAgc3RhdGljIGZyb21NaWxsaXMobXM6IG51bWJlcik6IERhdGUgeyByZXR1cm4gbmV3IERhdGUobXMpOyB9XG4gIHN0YXRpYyB0b01pbGxpcyhkYXRlOiBEYXRlKTogbnVtYmVyIHsgcmV0dXJuIGRhdGUuZ2V0VGltZSgpOyB9XG4gIHN0YXRpYyBub3coKTogRGF0ZSB7IHJldHVybiBuZXcgRGF0ZSgpOyB9XG4gIHN0YXRpYyB0b0pzb24oZGF0ZTogRGF0ZSk6IHN0cmluZyB7IHJldHVybiBkYXRlLnRvSlNPTigpOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRWYWx1ZU9uUGF0aChnbG9iYWw6IGFueSwgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gIHZhciBwYXJ0cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIG9iajogYW55ID0gZ2xvYmFsO1xuICB3aGlsZSAocGFydHMubGVuZ3RoID4gMSkge1xuICAgIHZhciBuYW1lID0gcGFydHMuc2hpZnQoKTtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KG5hbWUpICYmIGlzUHJlc2VudChvYmpbbmFtZV0pKSB7XG4gICAgICBvYmogPSBvYmpbbmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iaiA9IG9ialtuYW1lXSA9IHt9O1xuICAgIH1cbiAgfVxuICBpZiAob2JqID09PSB1bmRlZmluZWQgfHwgb2JqID09PSBudWxsKSB7XG4gICAgb2JqID0ge307XG4gIH1cbiAgb2JqW3BhcnRzLnNoaWZ0KCldID0gdmFsdWU7XG59XG5cbi8vIFdoZW4gU3ltYm9sLml0ZXJhdG9yIGRvZXNuJ3QgZXhpc3QsIHJldHJpZXZlcyB0aGUga2V5IHVzZWQgaW4gZXM2LXNoaW1cbmRlY2xhcmUgdmFyIFN5bWJvbDtcbnZhciBfc3ltYm9sSXRlcmF0b3IgPSBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN5bWJvbEl0ZXJhdG9yKCk6IHN0cmluZyB8IHN5bWJvbCB7XG4gIGlmIChpc0JsYW5rKF9zeW1ib2xJdGVyYXRvcikpIHtcbiAgICBpZiAoaXNQcmVzZW50KFN5bWJvbCkgJiYgaXNQcmVzZW50KFN5bWJvbC5pdGVyYXRvcikpIHtcbiAgICAgIF9zeW1ib2xJdGVyYXRvciA9IFN5bWJvbC5pdGVyYXRvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZXM2LXNoaW0gc3BlY2lmaWMgbG9naWNcbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTWFwLnByb3RvdHlwZSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgIGlmIChrZXkgIT09ICdlbnRyaWVzJyAmJiBrZXkgIT09ICdzaXplJyAmJlxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZVtrZXldID09PSBNYXAucHJvdG90eXBlWydlbnRyaWVzJ10pIHtcbiAgICAgICAgICBfc3ltYm9sSXRlcmF0b3IgPSBrZXk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIF9zeW1ib2xJdGVyYXRvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV2YWxFeHByZXNzaW9uKHNvdXJjZVVybDogc3RyaW5nLCBleHByOiBzdHJpbmcsIGRlY2xhcmF0aW9uczogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcnM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogYW55IHtcbiAgdmFyIGZuQm9keSA9IGAke2RlY2xhcmF0aW9uc31cXG5yZXR1cm4gJHtleHByfVxcbi8vIyBzb3VyY2VVUkw9JHtzb3VyY2VVcmx9YDtcbiAgdmFyIGZuQXJnTmFtZXMgPSBbXTtcbiAgdmFyIGZuQXJnVmFsdWVzID0gW107XG4gIGZvciAodmFyIGFyZ05hbWUgaW4gdmFycykge1xuICAgIGZuQXJnTmFtZXMucHVzaChhcmdOYW1lKTtcbiAgICBmbkFyZ1ZhbHVlcy5wdXNoKHZhcnNbYXJnTmFtZV0pO1xuICB9XG4gIHJldHVybiBuZXcgRnVuY3Rpb24oLi4uZm5BcmdOYW1lcy5jb25jYXQoZm5Cb2R5KSkoLi4uZm5BcmdWYWx1ZXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcmltaXRpdmUob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuICFpc0pzT2JqZWN0KG9iaik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDb25zdHJ1Y3Rvcih2YWx1ZTogT2JqZWN0LCB0eXBlOiBUeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gdHlwZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpdFdpc2VPcih2YWx1ZXM6IG51bWJlcltdKTogbnVtYmVyIHtcbiAgcmV0dXJuIHZhbHVlcy5yZWR1Y2UoKGEsIGIpID0+IHsgcmV0dXJuIGEgfCBiOyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpdFdpc2VBbmQodmFsdWVzOiBudW1iZXJbXSk6IG51bWJlciB7XG4gIHJldHVybiB2YWx1ZXMucmVkdWNlKChhLCBiKSA9PiB7IHJldHVybiBhICYgYjsgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGUoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIF9nbG9iYWwuZW5jb2RlVVJJKHMpO1xufVxuIl19