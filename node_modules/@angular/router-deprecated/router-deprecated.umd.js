/**
 * @license AngularJS v2.0.0-rc.1
 * (c) 2010-2016 Google, Inc. https://angular.io/
 * License: MIT
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/Subject'), require('rxjs/observable/PromiseObservable'), require('rxjs/operator/toPromise'), require('rxjs/Observable'), require('@angular/common'), require('@angular/core'), require('@angular/platform-browser')) :
        typeof define === 'function' && define.amd ? define(['exports', 'rxjs/Subject', 'rxjs/observable/PromiseObservable', 'rxjs/operator/toPromise', 'rxjs/Observable', '@angular/common', '@angular/core', '@angular/platform-browser'], factory) :
            (factory((global.ng = global.ng || {}, global.ng.router_deprecated = global.ng.router_deprecated || {}), global.Rx, global.Rx, global.Rx.Observable.prototype, global.Rx, global.ng.common, global.ng.core, global.ng.platformBrowser));
}(this, function (exports, rxjs_Subject, rxjs_observable_PromiseObservable, rxjs_operator_toPromise, rxjs_Observable, _angular_common, _angular_core, _angular_platformBrowser) {
    'use strict';
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
    // Need to declare a new variable for global here since TypeScript
    // exports the original value of the symbol.
    var global$1 = globalScope;
    var Type$1 = Function;
    function getTypeNameForDebugging(type) {
        if (type['name']) {
            return type['name'];
        }
        return typeof type;
    }
    var Math = global$1.Math;
    // TODO: remove calls to assert in production environment
    // Note: Can't just export this and import in in other files
    // as `assert` is a reserved keyword in Dart
    global$1.assert = function assert(condition) {
        // TODO: to be fixed properly via #2830, noop for now
    };
    function isPresent(obj) {
        return obj !== undefined && obj !== null;
    }
    function isBlank(obj) {
        return obj === undefined || obj === null;
    }
    function isString(obj) {
        return typeof obj === "string";
    }
    function isFunction(obj) {
        return typeof obj === "function";
    }
    function isType(obj) {
        return isFunction(obj);
    }
    function isStringMap(obj) {
        return typeof obj === 'object' && obj !== null;
    }
    function isArray(obj) {
        return Array.isArray(obj);
    }
    function noop() { }
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
    var RegExpWrapper = (function () {
        function RegExpWrapper() {
        }
        RegExpWrapper.create = function (regExpStr, flags) {
            if (flags === void 0) { flags = ''; }
            flags = flags.replace(/g/g, '');
            return new global$1.RegExp(regExpStr, flags + 'g');
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
    var RegExpMatcherWrapper = (function () {
        function RegExpMatcherWrapper() {
        }
        RegExpMatcherWrapper.next = function (matcher) {
            return matcher.re.exec(matcher.input);
        };
        return RegExpMatcherWrapper;
    }());
    function normalizeBlank(obj) {
        return isBlank(obj) ? null : obj;
    }
    var PromiseCompleter = (function () {
        function PromiseCompleter() {
            var _this = this;
            this.promise = new Promise(function (res, rej) {
                _this.resolve = res;
                _this.reject = rej;
            });
        }
        return PromiseCompleter;
    }());
    var PromiseWrapper = (function () {
        function PromiseWrapper() {
        }
        PromiseWrapper.resolve = function (obj) { return Promise.resolve(obj); };
        PromiseWrapper.reject = function (obj, _) { return Promise.reject(obj); };
        // Note: We can't rename this method into `catch`, as this is not a valid
        // method name in Dart.
        PromiseWrapper.catchError = function (promise, onError) {
            return promise.catch(onError);
        };
        PromiseWrapper.all = function (promises) {
            if (promises.length == 0)
                return Promise.resolve([]);
            return Promise.all(promises);
        };
        PromiseWrapper.then = function (promise, success, rejection) {
            return promise.then(success, rejection);
        };
        PromiseWrapper.wrap = function (computation) {
            return new Promise(function (res, rej) {
                try {
                    res(computation());
                }
                catch (e) {
                    rej(e);
                }
            });
        };
        PromiseWrapper.scheduleMicrotask = function (computation) {
            PromiseWrapper.then(PromiseWrapper.resolve(null), computation, function (_) { });
        };
        PromiseWrapper.isPromise = function (obj) { return obj instanceof Promise; };
        PromiseWrapper.completer = function () { return new PromiseCompleter(); };
        return PromiseWrapper;
    }());
    var ObservableWrapper = (function () {
        function ObservableWrapper() {
        }
        // TODO(vsavkin): when we use rxnext, try inferring the generic type from the first arg
        ObservableWrapper.subscribe = function (emitter, onNext, onError, onComplete) {
            if (onComplete === void 0) { onComplete = function () { }; }
            onError = (typeof onError === "function") && onError || noop;
            onComplete = (typeof onComplete === "function") && onComplete || noop;
            return emitter.subscribe({ next: onNext, error: onError, complete: onComplete });
        };
        ObservableWrapper.isObservable = function (obs) { return !!obs.subscribe; };
        /**
         * Returns whether `obs` has any subscribers listening to events.
         */
        ObservableWrapper.hasSubscribers = function (obs) { return obs.observers.length > 0; };
        ObservableWrapper.dispose = function (subscription) { subscription.unsubscribe(); };
        /**
         * @deprecated - use callEmit() instead
         */
        ObservableWrapper.callNext = function (emitter, value) { emitter.next(value); };
        ObservableWrapper.callEmit = function (emitter, value) { emitter.emit(value); };
        ObservableWrapper.callError = function (emitter, error) { emitter.error(error); };
        ObservableWrapper.callComplete = function (emitter) { emitter.complete(); };
        ObservableWrapper.fromPromise = function (promise) {
            return rxjs_observable_PromiseObservable.PromiseObservable.create(promise);
        };
        ObservableWrapper.toPromise = function (obj) { return rxjs_operator_toPromise.toPromise.call(obj); };
        return ObservableWrapper;
    }());
    /**
     * Use by directives and components to emit custom Events.
     *
     * ### Examples
     *
     * In the following example, `Zippy` alternatively emits `open` and `close` events when its
     * title gets clicked:
     *
     * ```
     * @Component({
     *   selector: 'zippy',
     *   template: `
     *   <div class="zippy">
     *     <div (click)="toggle()">Toggle</div>
     *     <div [hidden]="!visible">
     *       <ng-content></ng-content>
     *     </div>
     *  </div>`})
     * export class Zippy {
     *   visible: boolean = true;
     *   @Output() open: EventEmitter<any> = new EventEmitter();
     *   @Output() close: EventEmitter<any> = new EventEmitter();
     *
     *   toggle() {
     *     this.visible = !this.visible;
     *     if (this.visible) {
     *       this.open.emit(null);
     *     } else {
     *       this.close.emit(null);
     *     }
     *   }
     * }
     * ```
     *
     * Use Rx.Observable but provides an adapter to make it work as specified here:
     * https://github.com/jhusain/observable-spec
     *
     * Once a reference implementation of the spec is available, switch to it.
     */
    var EventEmitter = (function (_super) {
        __extends(EventEmitter, _super);
        /**
         * Creates an instance of [EventEmitter], which depending on [isAsync],
         * delivers events synchronously or asynchronously.
         */
        function EventEmitter(isAsync) {
            if (isAsync === void 0) { isAsync = true; }
            _super.call(this);
            this._isAsync = isAsync;
        }
        EventEmitter.prototype.emit = function (value) { _super.prototype.next.call(this, value); };
        /**
         * @deprecated - use .emit(value) instead
         */
        EventEmitter.prototype.next = function (value) { _super.prototype.next.call(this, value); };
        EventEmitter.prototype.subscribe = function (generatorOrNext, error, complete) {
            var schedulerFn;
            var errorFn = function (err) { return null; };
            var completeFn = function () { return null; };
            if (generatorOrNext && typeof generatorOrNext === 'object') {
                schedulerFn = this._isAsync ? function (value) { setTimeout(function () { return generatorOrNext.next(value); }); } :
                    function (value) { generatorOrNext.next(value); };
                if (generatorOrNext.error) {
                    errorFn = this._isAsync ? function (err) { setTimeout(function () { return generatorOrNext.error(err); }); } :
                        function (err) { generatorOrNext.error(err); };
                }
                if (generatorOrNext.complete) {
                    completeFn = this._isAsync ? function () { setTimeout(function () { return generatorOrNext.complete(); }); } :
                        function () { generatorOrNext.complete(); };
                }
            }
            else {
                schedulerFn = this._isAsync ? function (value) { setTimeout(function () { return generatorOrNext(value); }); } :
                    function (value) { generatorOrNext(value); };
                if (error) {
                    errorFn =
                        this._isAsync ? function (err) { setTimeout(function () { return error(err); }); } : function (err) { error(err); };
                }
                if (complete) {
                    completeFn =
                        this._isAsync ? function () { setTimeout(function () { return complete(); }); } : function () { complete(); };
                }
            }
            return _super.prototype.subscribe.call(this, schedulerFn, errorFn, completeFn);
        };
        return EventEmitter;
    }(rxjs_Subject.Subject));
    var Map$1 = global$1.Map;
    var Set = global$1.Set;
    // Safari and Internet Explorer do not support the iterable parameter to the
    // Map constructor.  We work around that by manually adding the items.
    var createMapFromPairs = (function () {
        try {
            if (new Map$1([[1, 2]]).size === 1) {
                return function createMapFromPairs(pairs) { return new Map$1(pairs); };
            }
        }
        catch (e) {
        }
        return function createMapAndPopulateFromPairs(pairs) {
            var map = new Map$1();
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                map.set(pair[0], pair[1]);
            }
            return map;
        };
    })();
    var createMapFromMap = (function () {
        try {
            if (new Map$1(new Map$1())) {
                return function createMapFromMap(m) { return new Map$1(m); };
            }
        }
        catch (e) {
        }
        return function createMapAndPopulateFromMap(m) {
            var map = new Map$1();
            m.forEach(function (v, k) { map.set(k, v); });
            return map;
        };
    })();
    var _clearValues = (function () {
        if ((new Map$1()).keys().next) {
            return function _clearValues(m) {
                var keyIterator = m.keys();
                var k;
                while (!((k = keyIterator.next()).done)) {
                    m.set(k.value, null);
                }
            };
        }
        else {
            return function _clearValuesWithForeEach(m) {
                m.forEach(function (v, k) { m.set(k, null); });
            };
        }
    })();
    // Safari doesn't implement MapIterator.next(), which is used is Traceur's polyfill of Array.from
    // TODO(mlaval): remove the work around once we have a working polyfill of Array.from
    var _arrayFromMap = (function () {
        try {
            if ((new Map$1()).values().next) {
                return function createArrayFromMap(m, getValues) {
                    return getValues ? Array.from(m.values()) : Array.from(m.keys());
                };
            }
        }
        catch (e) {
        }
        return function createArrayFromMapWithForeach(m, getValues) {
            var res = ListWrapper.createFixedSize(m.size), i = 0;
            m.forEach(function (v, k) {
                res[i] = getValues ? v : k;
                i++;
            });
            return res;
        };
    })();
    /**
     * Wraps Javascript Objects
     */
    var StringMapWrapper = (function () {
        function StringMapWrapper() {
        }
        StringMapWrapper.create = function () {
            // Note: We are not using Object.create(null) here due to
            // performance!
            // http://jsperf.com/ng2-object-create-null
            return {};
        };
        StringMapWrapper.contains = function (map, key) {
            return map.hasOwnProperty(key);
        };
        StringMapWrapper.get = function (map, key) {
            return map.hasOwnProperty(key) ? map[key] : undefined;
        };
        StringMapWrapper.set = function (map, key, value) { map[key] = value; };
        StringMapWrapper.keys = function (map) { return Object.keys(map); };
        StringMapWrapper.values = function (map) {
            return Object.keys(map).reduce(function (r, a) {
                r.push(map[a]);
                return r;
            }, []);
        };
        StringMapWrapper.isEmpty = function (map) {
            for (var prop in map) {
                return false;
            }
            return true;
        };
        StringMapWrapper.delete = function (map, key) { delete map[key]; };
        StringMapWrapper.forEach = function (map, callback) {
            for (var prop in map) {
                if (map.hasOwnProperty(prop)) {
                    callback(map[prop], prop);
                }
            }
        };
        StringMapWrapper.merge = function (m1, m2) {
            var m = {};
            for (var attr in m1) {
                if (m1.hasOwnProperty(attr)) {
                    m[attr] = m1[attr];
                }
            }
            for (var attr in m2) {
                if (m2.hasOwnProperty(attr)) {
                    m[attr] = m2[attr];
                }
            }
            return m;
        };
        StringMapWrapper.equals = function (m1, m2) {
            var k1 = Object.keys(m1);
            var k2 = Object.keys(m2);
            if (k1.length != k2.length) {
                return false;
            }
            var key;
            for (var i = 0; i < k1.length; i++) {
                key = k1[i];
                if (m1[key] !== m2[key]) {
                    return false;
                }
            }
            return true;
        };
        return StringMapWrapper;
    }());
    var ListWrapper = (function () {
        function ListWrapper() {
        }
        // JS has no way to express a statically fixed size list, but dart does so we
        // keep both methods.
        ListWrapper.createFixedSize = function (size) { return new Array(size); };
        ListWrapper.createGrowableSize = function (size) { return new Array(size); };
        ListWrapper.clone = function (array) { return array.slice(0); };
        ListWrapper.forEachWithIndex = function (array, fn) {
            for (var i = 0; i < array.length; i++) {
                fn(array[i], i);
            }
        };
        ListWrapper.first = function (array) {
            if (!array)
                return null;
            return array[0];
        };
        ListWrapper.last = function (array) {
            if (!array || array.length == 0)
                return null;
            return array[array.length - 1];
        };
        ListWrapper.indexOf = function (array, value, startIndex) {
            if (startIndex === void 0) { startIndex = 0; }
            return array.indexOf(value, startIndex);
        };
        ListWrapper.contains = function (list, el) { return list.indexOf(el) !== -1; };
        ListWrapper.reversed = function (array) {
            var a = ListWrapper.clone(array);
            return a.reverse();
        };
        ListWrapper.concat = function (a, b) { return a.concat(b); };
        ListWrapper.insert = function (list, index, value) { list.splice(index, 0, value); };
        ListWrapper.removeAt = function (list, index) {
            var res = list[index];
            list.splice(index, 1);
            return res;
        };
        ListWrapper.removeAll = function (list, items) {
            for (var i = 0; i < items.length; ++i) {
                var index = list.indexOf(items[i]);
                list.splice(index, 1);
            }
        };
        ListWrapper.remove = function (list, el) {
            var index = list.indexOf(el);
            if (index > -1) {
                list.splice(index, 1);
                return true;
            }
            return false;
        };
        ListWrapper.clear = function (list) { list.length = 0; };
        ListWrapper.isEmpty = function (list) { return list.length == 0; };
        ListWrapper.fill = function (list, value, start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = null; }
            list.fill(value, start, end === null ? list.length : end);
        };
        ListWrapper.equals = function (a, b) {
            if (a.length != b.length)
                return false;
            for (var i = 0; i < a.length; ++i) {
                if (a[i] !== b[i])
                    return false;
            }
            return true;
        };
        ListWrapper.slice = function (l, from, to) {
            if (from === void 0) { from = 0; }
            if (to === void 0) { to = null; }
            return l.slice(from, to === null ? undefined : to);
        };
        ListWrapper.splice = function (l, from, length) { return l.splice(from, length); };
        ListWrapper.sort = function (l, compareFn) {
            if (isPresent(compareFn)) {
                l.sort(compareFn);
            }
            else {
                l.sort();
            }
        };
        ListWrapper.toString = function (l) { return l.toString(); };
        ListWrapper.toJSON = function (l) { return JSON.stringify(l); };
        ListWrapper.maximum = function (list, predicate) {
            if (list.length == 0) {
                return null;
            }
            var solution = null;
            var maxValue = -Infinity;
            for (var index = 0; index < list.length; index++) {
                var candidate = list[index];
                if (isBlank(candidate)) {
                    continue;
                }
                var candidateValue = predicate(candidate);
                if (candidateValue > maxValue) {
                    solution = candidate;
                    maxValue = candidateValue;
                }
            }
            return solution;
        };
        ListWrapper.flatten = function (list) {
            var target = [];
            _flattenArray(list, target);
            return target;
        };
        ListWrapper.addAll = function (list, source) {
            for (var i = 0; i < source.length; i++) {
                list.push(source[i]);
            }
        };
        return ListWrapper;
    }());
    function _flattenArray(source, target) {
        if (isPresent(source)) {
            for (var i = 0; i < source.length; i++) {
                var item = source[i];
                if (isArray(item)) {
                    _flattenArray(item, target);
                }
                else {
                    target.push(item);
                }
            }
        }
        return target;
    }
    // Safari and Internet Explorer do not support the iterable parameter to the
    // Set constructor.  We work around that by manually adding the items.
    var createSetFromList = (function () {
        var test = new Set([1, 2, 3]);
        if (test.size === 3) {
            return function createSetFromList(lst) { return new Set(lst); };
        }
        else {
            return function createSetAndPopulateFromList(lst) {
                var res = new Set(lst);
                if (res.size !== lst.length) {
                    for (var i = 0; i < lst.length; i++) {
                        res.add(lst[i]);
                    }
                }
                return res;
            };
        }
    })();
    var BaseException = (function (_super) {
        __extends(BaseException, _super);
        function BaseException(message) {
            if (message === void 0) { message = "--"; }
            _super.call(this, message);
            this.message = message;
            this.stack = (new Error(message)).stack;
        }
        BaseException.prototype.toString = function () { return this.message; };
        return BaseException;
    }(Error));
    /**
     * The `RouteConfig` decorator defines routes for a given component.
     *
     * It takes an array of {@link RouteDefinition}s.
     * @ts2dart_const
     */
    var RouteConfigAnnotation = (function () {
        function RouteConfigAnnotation(configs) {
            this.configs = configs;
        }
        return RouteConfigAnnotation;
    }());
    /* @ts2dart_const */
    var AbstractRoute = (function () {
        function AbstractRoute(_a) {
            var name = _a.name, useAsDefault = _a.useAsDefault, path = _a.path, regex = _a.regex, serializer = _a.serializer, data = _a.data;
            this.name = name;
            this.useAsDefault = useAsDefault;
            this.path = path;
            this.regex = regex;
            this.serializer = serializer;
            this.data = data;
        }
        return AbstractRoute;
    }());
    /**
     * `Route` is a type of {@link RouteDefinition} used to route a path to a component.
     *
     * It has the following properties:
     * - `path` is a string that uses the route matcher DSL.
     * - `component` a component type.
     * - `name` is an optional `CamelCase` string representing the name of the route.
     * - `data` is an optional property of any type representing arbitrary route metadata for the given
     * route. It is injectable via {@link RouteData}.
     * - `useAsDefault` is a boolean value. If `true`, the child route will be navigated to if no child
     * route is specified during the navigation.
     *
     * ### Example
     * ```
     * import {RouteConfig, Route} from '@angular/router-deprecated';
     *
     * @RouteConfig([
     *   new Route({path: '/home', component: HomeCmp, name: 'HomeCmp' })
     * ])
     * class MyApp {}
     * ```
     * @ts2dart_const
     */
    var Route = (function (_super) {
        __extends(Route, _super);
        function Route(_a) {
            var name = _a.name, useAsDefault = _a.useAsDefault, path = _a.path, regex = _a.regex, serializer = _a.serializer, data = _a.data, component = _a.component;
            _super.call(this, {
                name: name,
                useAsDefault: useAsDefault,
                path: path,
                regex: regex,
                serializer: serializer,
                data: data
            });
            this.aux = null;
            this.component = component;
        }
        return Route;
    }(AbstractRoute));
    /**
     * `AuxRoute` is a type of {@link RouteDefinition} used to define an auxiliary route.
     *
     * It takes an object with the following properties:
     * - `path` is a string that uses the route matcher DSL.
     * - `component` a component type.
     * - `name` is an optional `CamelCase` string representing the name of the route.
     * - `data` is an optional property of any type representing arbitrary route metadata for the given
     * route. It is injectable via {@link RouteData}.
     *
     * ### Example
     * ```
     * import {RouteConfig, AuxRoute} from '@angular/router-deprecated';
     *
     * @RouteConfig([
     *   new AuxRoute({path: '/home', component: HomeCmp})
     * ])
     * class MyApp {}
     * ```
     * @ts2dart_const
     */
    var AuxRoute = (function (_super) {
        __extends(AuxRoute, _super);
        function AuxRoute(_a) {
            var name = _a.name, useAsDefault = _a.useAsDefault, path = _a.path, regex = _a.regex, serializer = _a.serializer, data = _a.data, component = _a.component;
            _super.call(this, {
                name: name,
                useAsDefault: useAsDefault,
                path: path,
                regex: regex,
                serializer: serializer,
                data: data
            });
            this.component = component;
        }
        return AuxRoute;
    }(AbstractRoute));
    /**
     * `AsyncRoute` is a type of {@link RouteDefinition} used to route a path to an asynchronously
     * loaded component.
     *
     * It has the following properties:
     * - `path` is a string that uses the route matcher DSL.
     * - `loader` is a function that returns a promise that resolves to a component.
     * - `name` is an optional `CamelCase` string representing the name of the route.
     * - `data` is an optional property of any type representing arbitrary route metadata for the given
     * route. It is injectable via {@link RouteData}.
     * - `useAsDefault` is a boolean value. If `true`, the child route will be navigated to if no child
     * route is specified during the navigation.
     *
     * ### Example
     * ```
     * import {RouteConfig, AsyncRoute} from '@angular/router-deprecated';
     *
     * @RouteConfig([
     *   new AsyncRoute({path: '/home', loader: () => Promise.resolve(MyLoadedCmp), name:
     * 'MyLoadedCmp'})
     * ])
     * class MyApp {}
     * ```
     * @ts2dart_const
     */
    var AsyncRoute = (function (_super) {
        __extends(AsyncRoute, _super);
        function AsyncRoute(_a) {
            var name = _a.name, useAsDefault = _a.useAsDefault, path = _a.path, regex = _a.regex, serializer = _a.serializer, data = _a.data, loader = _a.loader;
            _super.call(this, {
                name: name,
                useAsDefault: useAsDefault,
                path: path,
                regex: regex,
                serializer: serializer,
                data: data
            });
            this.aux = null;
            this.loader = loader;
        }
        return AsyncRoute;
    }(AbstractRoute));
    /**
     * `Redirect` is a type of {@link RouteDefinition} used to route a path to a canonical route.
     *
     * It has the following properties:
     * - `path` is a string that uses the route matcher DSL.
     * - `redirectTo` is an array representing the link DSL.
     *
     * Note that redirects **do not** affect how links are generated. For that, see the `useAsDefault`
     * option.
     *
     * ### Example
     * ```
     * import {RouteConfig, Route, Redirect} from '@angular/router-deprecated';
     *
     * @RouteConfig([
     *   new Redirect({path: '/', redirectTo: ['/Home'] }),
     *   new Route({path: '/home', component: HomeCmp, name: 'Home'})
     * ])
     * class MyApp {}
     * ```
     * @ts2dart_const
     */
    var Redirect = (function (_super) {
        __extends(Redirect, _super);
        function Redirect(_a) {
            var name = _a.name, useAsDefault = _a.useAsDefault, path = _a.path, regex = _a.regex, serializer = _a.serializer, data = _a.data, redirectTo = _a.redirectTo;
            _super.call(this, {
                name: name,
                useAsDefault: useAsDefault,
                path: path,
                regex: regex,
                serializer: serializer,
                data: data
            });
            this.redirectTo = redirectTo;
        }
        return Redirect;
    }(AbstractRoute));
    function convertUrlParamsToArray(urlParams) {
        var paramsArray = [];
        if (isBlank(urlParams)) {
            return [];
        }
        StringMapWrapper.forEach(urlParams, function (value, key) { paramsArray.push((value === true) ? key : key + '=' + value); });
        return paramsArray;
    }
    // Convert an object of url parameters into a string that can be used in an URL
    function serializeParams(urlParams, joiner) {
        if (joiner === void 0) { joiner = '&'; }
        return convertUrlParamsToArray(urlParams).join(joiner);
    }
    /**
     * This class represents a parsed URL
     */
    var Url = (function () {
        function Url(path, child, auxiliary, params) {
            if (child === void 0) { child = null; }
            if (auxiliary === void 0) { auxiliary = []; }
            if (params === void 0) { params = {}; }
            this.path = path;
            this.child = child;
            this.auxiliary = auxiliary;
            this.params = params;
        }
        Url.prototype.toString = function () {
            return this.path + this._matrixParamsToString() + this._auxToString() + this._childString();
        };
        Url.prototype.segmentToString = function () { return this.path + this._matrixParamsToString(); };
        /** @internal */
        Url.prototype._auxToString = function () {
            return this.auxiliary.length > 0 ?
                ('(' + this.auxiliary.map(function (sibling) { return sibling.toString(); }).join('//') + ')') :
                '';
        };
        Url.prototype._matrixParamsToString = function () {
            var paramString = serializeParams(this.params, ';');
            if (paramString.length > 0) {
                return ';' + paramString;
            }
            return '';
        };
        /** @internal */
        Url.prototype._childString = function () { return isPresent(this.child) ? ('/' + this.child.toString()) : ''; };
        return Url;
    }());
    var RootUrl = (function (_super) {
        __extends(RootUrl, _super);
        function RootUrl(path, child, auxiliary, params) {
            if (child === void 0) { child = null; }
            if (auxiliary === void 0) { auxiliary = []; }
            if (params === void 0) { params = null; }
            _super.call(this, path, child, auxiliary, params);
        }
        RootUrl.prototype.toString = function () {
            return this.path + this._auxToString() + this._childString() + this._queryParamsToString();
        };
        RootUrl.prototype.segmentToString = function () { return this.path + this._queryParamsToString(); };
        RootUrl.prototype._queryParamsToString = function () {
            if (isBlank(this.params)) {
                return '';
            }
            return '?' + serializeParams(this.params);
        };
        return RootUrl;
    }(Url));
    var SEGMENT_RE = RegExpWrapper.create('^[^\\/\\(\\)\\?;=&#]+');
    function matchUrlSegment(str) {
        var match = RegExpWrapper.firstMatch(SEGMENT_RE, str);
        return isPresent(match) ? match[0] : '';
    }
    var QUERY_PARAM_VALUE_RE = RegExpWrapper.create('^[^\\(\\)\\?;&#]+');
    function matchUrlQueryParamValue(str) {
        var match = RegExpWrapper.firstMatch(QUERY_PARAM_VALUE_RE, str);
        return isPresent(match) ? match[0] : '';
    }
    var UrlParser = (function () {
        function UrlParser() {
        }
        UrlParser.prototype.peekStartsWith = function (str) { return this._remaining.startsWith(str); };
        UrlParser.prototype.capture = function (str) {
            if (!this._remaining.startsWith(str)) {
                throw new BaseException("Expected \"" + str + "\".");
            }
            this._remaining = this._remaining.substring(str.length);
        };
        UrlParser.prototype.parse = function (url) {
            this._remaining = url;
            if (url == '' || url == '/') {
                return new Url('');
            }
            return this.parseRoot();
        };
        // segment + (aux segments) + (query params)
        UrlParser.prototype.parseRoot = function () {
            if (this.peekStartsWith('/')) {
                this.capture('/');
            }
            var path = matchUrlSegment(this._remaining);
            this.capture(path);
            var aux = [];
            if (this.peekStartsWith('(')) {
                aux = this.parseAuxiliaryRoutes();
            }
            if (this.peekStartsWith(';')) {
                // TODO: should these params just be dropped?
                this.parseMatrixParams();
            }
            var child = null;
            if (this.peekStartsWith('/') && !this.peekStartsWith('//')) {
                this.capture('/');
                child = this.parseSegment();
            }
            var queryParams = null;
            if (this.peekStartsWith('?')) {
                queryParams = this.parseQueryParams();
            }
            return new RootUrl(path, child, aux, queryParams);
        };
        // segment + (matrix params) + (aux segments)
        UrlParser.prototype.parseSegment = function () {
            if (this._remaining.length == 0) {
                return null;
            }
            if (this.peekStartsWith('/')) {
                this.capture('/');
            }
            var path = matchUrlSegment(this._remaining);
            this.capture(path);
            var matrixParams = null;
            if (this.peekStartsWith(';')) {
                matrixParams = this.parseMatrixParams();
            }
            var aux = [];
            if (this.peekStartsWith('(')) {
                aux = this.parseAuxiliaryRoutes();
            }
            var child = null;
            if (this.peekStartsWith('/') && !this.peekStartsWith('//')) {
                this.capture('/');
                child = this.parseSegment();
            }
            return new Url(path, child, aux, matrixParams);
        };
        UrlParser.prototype.parseQueryParams = function () {
            var params = {};
            this.capture('?');
            this.parseQueryParam(params);
            while (this._remaining.length > 0 && this.peekStartsWith('&')) {
                this.capture('&');
                this.parseQueryParam(params);
            }
            return params;
        };
        UrlParser.prototype.parseMatrixParams = function () {
            var params = {};
            while (this._remaining.length > 0 && this.peekStartsWith(';')) {
                this.capture(';');
                this.parseParam(params);
            }
            return params;
        };
        UrlParser.prototype.parseParam = function (params) {
            var key = matchUrlSegment(this._remaining);
            if (isBlank(key)) {
                return;
            }
            this.capture(key);
            var value = true;
            if (this.peekStartsWith('=')) {
                this.capture('=');
                var valueMatch = matchUrlSegment(this._remaining);
                if (isPresent(valueMatch)) {
                    value = valueMatch;
                    this.capture(value);
                }
            }
            params[key] = value;
        };
        UrlParser.prototype.parseQueryParam = function (params) {
            var key = matchUrlSegment(this._remaining);
            if (isBlank(key)) {
                return;
            }
            this.capture(key);
            var value = true;
            if (this.peekStartsWith('=')) {
                this.capture('=');
                var valueMatch = matchUrlQueryParamValue(this._remaining);
                if (isPresent(valueMatch)) {
                    value = valueMatch;
                    this.capture(value);
                }
            }
            params[key] = value;
        };
        UrlParser.prototype.parseAuxiliaryRoutes = function () {
            var routes = [];
            this.capture('(');
            while (!this.peekStartsWith(')') && this._remaining.length > 0) {
                routes.push(this.parseSegment());
                if (this.peekStartsWith('//')) {
                    this.capture('//');
                }
            }
            this.capture(')');
            return routes;
        };
        return UrlParser;
    }());
    var parser = new UrlParser();
    /**
     * `RouteParams` is an immutable map of parameters for the given route
     * based on the url matcher and optional parameters for that route.
     *
     * You can inject `RouteParams` into the constructor of a component to use it.
     *
     * ### Example
     *
     * ```
     * import {Component} from '@angular/core';
     * import {bootstrap} from '@angular/platform-browser/browser';
     * import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams} from
     * 'angular2/router';
     *
     * @Component({directives: [ROUTER_DIRECTIVES]})
     * @RouteConfig([
     *  {path: '/user/:id', component: UserCmp, name: 'UserCmp'},
     * ])
     * class AppCmp {}
     *
     * @Component({ template: 'user: {{id}}' })
     * class UserCmp {
     *   id: string;
     *   constructor(params: RouteParams) {
     *     this.id = params.get('id');
     *   }
     * }
     *
     * bootstrap(AppCmp, ROUTER_PROVIDERS);
     * ```
     */
    var RouteParams = (function () {
        function RouteParams(params) {
            this.params = params;
        }
        RouteParams.prototype.get = function (param) { return normalizeBlank(StringMapWrapper.get(this.params, param)); };
        return RouteParams;
    }());
    /**
     * `RouteData` is an immutable map of additional data you can configure in your {@link Route}.
     *
     * You can inject `RouteData` into the constructor of a component to use it.
     *
     * ### Example
     *
     * ```
     * import {Component} from '@angular/core';
     * import {bootstrap} from '@angular/platform-browser/browser';
     * import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteData} from
     * 'angular2/router';
     *
     * @Component({directives: [ROUTER_DIRECTIVES]})
     * @RouteConfig([
     *  {path: '/user/:id', component: UserCmp, name: 'UserCmp', data: {isAdmin: true}},
     * ])
     * class AppCmp {}
     *
     * @Component({
     *   ...,
     *   template: 'user: {{isAdmin}}'
     * })
     * class UserCmp {
     *   string: isAdmin;
     *   constructor(data: RouteData) {
     *     this.isAdmin = data.get('isAdmin');
     *   }
     * }
     *
     * bootstrap(AppCmp, ROUTER_PROVIDERS);
     * ```
     */
    var RouteData = (function () {
        function RouteData(data) {
            if (data === void 0) { data = {}; }
            this.data = data;
        }
        RouteData.prototype.get = function (key) { return normalizeBlank(StringMapWrapper.get(this.data, key)); };
        return RouteData;
    }());
    var BLANK_ROUTE_DATA = new RouteData();
    /**
     * `Instruction` is a tree of {@link ComponentInstruction}s with all the information needed
     * to transition each component in the app to a given route, including all auxiliary routes.
     *
     * `Instruction`s can be created using {@link Router#generate}, and can be used to
     * perform route changes with {@link Router#navigateByInstruction}.
     *
     * ### Example
     *
     * ```
     * import {Component} from '@angular/core';
     * import {bootstrap} from '@angular/platform-browser/browser';
     * import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig} from
     * '@angular/router-deprecated';
     *
     * @Component({directives: [ROUTER_DIRECTIVES]})
     * @RouteConfig([
     *  {...},
     * ])
     * class AppCmp {
     *   constructor(router: Router) {
     *     var instruction = router.generate(['/MyRoute']);
     *     router.navigateByInstruction(instruction);
     *   }
     * }
     *
     * bootstrap(AppCmp, ROUTER_PROVIDERS);
     * ```
     */
    var Instruction = (function () {
        function Instruction(component, child, auxInstruction) {
            this.component = component;
            this.child = child;
            this.auxInstruction = auxInstruction;
        }
        Object.defineProperty(Instruction.prototype, "urlPath", {
            get: function () { return isPresent(this.component) ? this.component.urlPath : ''; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Instruction.prototype, "urlParams", {
            get: function () { return isPresent(this.component) ? this.component.urlParams : []; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Instruction.prototype, "specificity", {
            get: function () {
                var total = '';
                if (isPresent(this.component)) {
                    total += this.component.specificity;
                }
                if (isPresent(this.child)) {
                    total += this.child.specificity;
                }
                return total;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * converts the instruction into a URL string
         */
        Instruction.prototype.toRootUrl = function () { return this.toUrlPath() + this.toUrlQuery(); };
        /** @internal */
        Instruction.prototype._toNonRootUrl = function () {
            return this._stringifyPathMatrixAuxPrefixed() +
                (isPresent(this.child) ? this.child._toNonRootUrl() : '');
        };
        Instruction.prototype.toUrlQuery = function () { return this.urlParams.length > 0 ? ('?' + this.urlParams.join('&')) : ''; };
        /**
         * Returns a new instruction that shares the state of the existing instruction, but with
         * the given child {@link Instruction} replacing the existing child.
         */
        Instruction.prototype.replaceChild = function (child) {
            return new ResolvedInstruction(this.component, child, this.auxInstruction);
        };
        /**
         * If the final URL for the instruction is ``
         */
        Instruction.prototype.toUrlPath = function () {
            return this.urlPath + this._stringifyAux() +
                (isPresent(this.child) ? this.child._toNonRootUrl() : '');
        };
        // default instructions override these
        Instruction.prototype.toLinkUrl = function () {
            return this.urlPath + this._stringifyAux() +
                (isPresent(this.child) ? this.child._toLinkUrl() : '') + this.toUrlQuery();
        };
        // this is the non-root version (called recursively)
        /** @internal */
        Instruction.prototype._toLinkUrl = function () {
            return this._stringifyPathMatrixAuxPrefixed() +
                (isPresent(this.child) ? this.child._toLinkUrl() : '');
        };
        /** @internal */
        Instruction.prototype._stringifyPathMatrixAuxPrefixed = function () {
            var primary = this._stringifyPathMatrixAux();
            if (primary.length > 0) {
                primary = '/' + primary;
            }
            return primary;
        };
        /** @internal */
        Instruction.prototype._stringifyMatrixParams = function () {
            return this.urlParams.length > 0 ? (';' + this.urlParams.join(';')) : '';
        };
        /** @internal */
        Instruction.prototype._stringifyPathMatrixAux = function () {
            if (isBlank(this.component)) {
                return '';
            }
            return this.urlPath + this._stringifyMatrixParams() + this._stringifyAux();
        };
        /** @internal */
        Instruction.prototype._stringifyAux = function () {
            var routes = [];
            StringMapWrapper.forEach(this.auxInstruction, function (auxInstruction, _) {
                routes.push(auxInstruction._stringifyPathMatrixAux());
            });
            if (routes.length > 0) {
                return '(' + routes.join('//') + ')';
            }
            return '';
        };
        return Instruction;
    }());
    /**
     * a resolved instruction has an outlet instruction for itself, but maybe not for...
     */
    var ResolvedInstruction = (function (_super) {
        __extends(ResolvedInstruction, _super);
        function ResolvedInstruction(component, child, auxInstruction) {
            _super.call(this, component, child, auxInstruction);
        }
        ResolvedInstruction.prototype.resolveComponent = function () {
            return PromiseWrapper.resolve(this.component);
        };
        return ResolvedInstruction;
    }(Instruction));
    /**
     * Represents a resolved default route
     */
    var DefaultInstruction = (function (_super) {
        __extends(DefaultInstruction, _super);
        function DefaultInstruction(component, child) {
            _super.call(this, component, child, {});
        }
        DefaultInstruction.prototype.toLinkUrl = function () { return ''; };
        /** @internal */
        DefaultInstruction.prototype._toLinkUrl = function () { return ''; };
        return DefaultInstruction;
    }(ResolvedInstruction));
    /**
     * Represents a component that may need to do some redirection or lazy loading at a later time.
     */
    var UnresolvedInstruction = (function (_super) {
        __extends(UnresolvedInstruction, _super);
        function UnresolvedInstruction(_resolver, _urlPath, _urlParams) {
            if (_urlPath === void 0) { _urlPath = ''; }
            if (_urlParams === void 0) { _urlParams = []; }
            _super.call(this, null, null, {});
            this._resolver = _resolver;
            this._urlPath = _urlPath;
            this._urlParams = _urlParams;
        }
        Object.defineProperty(UnresolvedInstruction.prototype, "urlPath", {
            get: function () {
                if (isPresent(this.component)) {
                    return this.component.urlPath;
                }
                if (isPresent(this._urlPath)) {
                    return this._urlPath;
                }
                return '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnresolvedInstruction.prototype, "urlParams", {
            get: function () {
                if (isPresent(this.component)) {
                    return this.component.urlParams;
                }
                if (isPresent(this._urlParams)) {
                    return this._urlParams;
                }
                return [];
            },
            enumerable: true,
            configurable: true
        });
        UnresolvedInstruction.prototype.resolveComponent = function () {
            var _this = this;
            if (isPresent(this.component)) {
                return PromiseWrapper.resolve(this.component);
            }
            return this._resolver().then(function (instruction) {
                _this.child = isPresent(instruction) ? instruction.child : null;
                return _this.component = isPresent(instruction) ? instruction.component : null;
            });
        };
        return UnresolvedInstruction;
    }(Instruction));
    var RedirectInstruction = (function (_super) {
        __extends(RedirectInstruction, _super);
        function RedirectInstruction(component, child, auxInstruction, _specificity) {
            _super.call(this, component, child, auxInstruction);
            this._specificity = _specificity;
        }
        Object.defineProperty(RedirectInstruction.prototype, "specificity", {
            get: function () { return this._specificity; },
            enumerable: true,
            configurable: true
        });
        return RedirectInstruction;
    }(ResolvedInstruction));
    /**
     * A `ComponentInstruction` represents the route state for a single component.
     *
     * `ComponentInstructions` is a public API. Instances of `ComponentInstruction` are passed
     * to route lifecycle hooks, like {@link CanActivate}.
     *
     * `ComponentInstruction`s are [hash consed](https://en.wikipedia.org/wiki/Hash_consing). You should
     * never construct one yourself with "new." Instead, rely on router's internal recognizer to
     * construct `ComponentInstruction`s.
     *
     * You should not modify this object. It should be treated as immutable.
     */
    var ComponentInstruction = (function () {
        /**
         * @internal
         */
        function ComponentInstruction(urlPath, urlParams, data, componentType, terminal, specificity, params, routeName) {
            if (params === void 0) { params = null; }
            this.urlPath = urlPath;
            this.urlParams = urlParams;
            this.componentType = componentType;
            this.terminal = terminal;
            this.specificity = specificity;
            this.params = params;
            this.routeName = routeName;
            this.reuse = false;
            this.routeData = isPresent(data) ? data : BLANK_ROUTE_DATA;
        }
        return ComponentInstruction;
    }());
    // RouteMatch objects hold information about a match between a rule and a URL
    var RouteMatch = (function () {
        function RouteMatch() {
        }
        return RouteMatch;
    }());
    var PathMatch = (function (_super) {
        __extends(PathMatch, _super);
        function PathMatch(instruction, remaining, remainingAux) {
            _super.call(this);
            this.instruction = instruction;
            this.remaining = remaining;
            this.remainingAux = remainingAux;
        }
        return PathMatch;
    }(RouteMatch));
    var RedirectMatch = (function (_super) {
        __extends(RedirectMatch, _super);
        function RedirectMatch(redirectTo, specificity) {
            _super.call(this);
            this.redirectTo = redirectTo;
            this.specificity = specificity;
        }
        return RedirectMatch;
    }(RouteMatch));
    var RedirectRule = (function () {
        function RedirectRule(_pathRecognizer, redirectTo) {
            this._pathRecognizer = _pathRecognizer;
            this.redirectTo = redirectTo;
            this.hash = this._pathRecognizer.hash;
        }
        Object.defineProperty(RedirectRule.prototype, "path", {
            get: function () { return this._pathRecognizer.toString(); },
            set: function (val) { throw new BaseException('you cannot set the path of a RedirectRule directly'); },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns `null` or a `ParsedUrl` representing the new path to match
         */
        RedirectRule.prototype.recognize = function (beginningSegment) {
            var match = null;
            if (isPresent(this._pathRecognizer.matchUrl(beginningSegment))) {
                match = new RedirectMatch(this.redirectTo, this._pathRecognizer.specificity);
            }
            return PromiseWrapper.resolve(match);
        };
        RedirectRule.prototype.generate = function (params) {
            throw new BaseException("Tried to generate a redirect.");
        };
        return RedirectRule;
    }());
    // represents something like '/foo/:bar'
    var RouteRule = (function () {
        // TODO: cache component instruction instances by params and by ParsedUrl instance
        function RouteRule(_routePath, handler, _routeName) {
            this._routePath = _routePath;
            this.handler = handler;
            this._routeName = _routeName;
            this._cache = new Map$1();
            this.specificity = this._routePath.specificity;
            this.hash = this._routePath.hash;
            this.terminal = this._routePath.terminal;
        }
        Object.defineProperty(RouteRule.prototype, "path", {
            get: function () { return this._routePath.toString(); },
            set: function (val) { throw new BaseException('you cannot set the path of a RouteRule directly'); },
            enumerable: true,
            configurable: true
        });
        RouteRule.prototype.recognize = function (beginningSegment) {
            var _this = this;
            var res = this._routePath.matchUrl(beginningSegment);
            if (isBlank(res)) {
                return null;
            }
            return this.handler.resolveComponentType().then(function (_) {
                var componentInstruction = _this._getInstruction(res.urlPath, res.urlParams, res.allParams);
                return new PathMatch(componentInstruction, res.rest, res.auxiliary);
            });
        };
        RouteRule.prototype.generate = function (params) {
            var generated = this._routePath.generateUrl(params);
            var urlPath = generated.urlPath;
            var urlParams = generated.urlParams;
            return this._getInstruction(urlPath, convertUrlParamsToArray(urlParams), params);
        };
        RouteRule.prototype.generateComponentPathValues = function (params) {
            return this._routePath.generateUrl(params);
        };
        RouteRule.prototype._getInstruction = function (urlPath, urlParams, params) {
            if (isBlank(this.handler.componentType)) {
                throw new BaseException("Tried to get instruction before the type was loaded.");
            }
            var hashKey = urlPath + '?' + urlParams.join('&');
            if (this._cache.has(hashKey)) {
                return this._cache.get(hashKey);
            }
            var instruction = new ComponentInstruction(urlPath, urlParams, this.handler.data, this.handler.componentType, this.terminal, this.specificity, params, this._routeName);
            this._cache.set(hashKey, instruction);
            return instruction;
        };
        return RouteRule;
    }());
    var AsyncRouteHandler = (function () {
        function AsyncRouteHandler(_loader, data) {
            if (data === void 0) { data = null; }
            this._loader = _loader;
            /** @internal */
            this._resolvedComponent = null;
            this.data = isPresent(data) ? new RouteData(data) : BLANK_ROUTE_DATA;
        }
        AsyncRouteHandler.prototype.resolveComponentType = function () {
            var _this = this;
            if (isPresent(this._resolvedComponent)) {
                return this._resolvedComponent;
            }
            return this._resolvedComponent = this._loader().then(function (componentType) {
                _this.componentType = componentType;
                return componentType;
            });
        };
        return AsyncRouteHandler;
    }());
    var SyncRouteHandler = (function () {
        function SyncRouteHandler(componentType, data) {
            this.componentType = componentType;
            /** @internal */
            this._resolvedComponent = null;
            this._resolvedComponent = PromiseWrapper.resolve(componentType);
            this.data = isPresent(data) ? new RouteData(data) : BLANK_ROUTE_DATA;
        }
        SyncRouteHandler.prototype.resolveComponentType = function () { return this._resolvedComponent; };
        return SyncRouteHandler;
    }());
    var TouchMap = (function () {
        function TouchMap(map) {
            var _this = this;
            this.map = {};
            this.keys = {};
            if (isPresent(map)) {
                StringMapWrapper.forEach(map, function (value, key) {
                    _this.map[key] = isPresent(value) ? value.toString() : null;
                    _this.keys[key] = true;
                });
            }
        }
        TouchMap.prototype.get = function (key) {
            StringMapWrapper.delete(this.keys, key);
            return this.map[key];
        };
        TouchMap.prototype.getUnused = function () {
            var _this = this;
            var unused = {};
            var keys = StringMapWrapper.keys(this.keys);
            keys.forEach(function (key) { return unused[key] = StringMapWrapper.get(_this.map, key); });
            return unused;
        };
        return TouchMap;
    }());
    function normalizeString(obj) {
        if (isBlank(obj)) {
            return null;
        }
        else {
            return obj.toString();
        }
    }
    var MatchedUrl = (function () {
        function MatchedUrl(urlPath, urlParams, allParams, auxiliary, rest) {
            this.urlPath = urlPath;
            this.urlParams = urlParams;
            this.allParams = allParams;
            this.auxiliary = auxiliary;
            this.rest = rest;
        }
        return MatchedUrl;
    }());
    var GeneratedUrl = (function () {
        function GeneratedUrl(urlPath, urlParams) {
            this.urlPath = urlPath;
            this.urlParams = urlParams;
        }
        return GeneratedUrl;
    }());
    /**
     * Identified by a `...` URL segment. This indicates that the
     * Route will continue to be matched by child `Router`s.
     */
    var ContinuationPathSegment = (function () {
        function ContinuationPathSegment() {
            this.name = '';
            this.specificity = '';
            this.hash = '...';
        }
        ContinuationPathSegment.prototype.generate = function (params) { return ''; };
        ContinuationPathSegment.prototype.match = function (path) { return true; };
        return ContinuationPathSegment;
    }());
    /**
     * Identified by a string not starting with a `:` or `*`.
     * Only matches the URL segments that equal the segment path
     */
    var StaticPathSegment = (function () {
        function StaticPathSegment(path) {
            this.path = path;
            this.name = '';
            this.specificity = '2';
            this.hash = path;
        }
        StaticPathSegment.prototype.match = function (path) { return path == this.path; };
        StaticPathSegment.prototype.generate = function (params) { return this.path; };
        return StaticPathSegment;
    }());
    /**
     * Identified by a string starting with `:`. Indicates a segment
     * that can contain a value that will be extracted and provided to
     * a matching `Instruction`.
     */
    var DynamicPathSegment = (function () {
        function DynamicPathSegment(name) {
            this.name = name;
            this.specificity = '1';
            this.hash = ':';
        }
        DynamicPathSegment.prototype.match = function (path) { return path.length > 0; };
        DynamicPathSegment.prototype.generate = function (params) {
            if (!StringMapWrapper.contains(params.map, this.name)) {
                throw new BaseException("Route generator for '" + this.name + "' was not included in parameters passed.");
            }
            return encodeDynamicSegment(normalizeString(params.get(this.name)));
        };
        return DynamicPathSegment;
    }());
    DynamicPathSegment.paramMatcher = /^:([^\/]+)$/g;
    /**
     * Identified by a string starting with `*` Indicates that all the following
     * segments match this route and that the value of these segments should
     * be provided to a matching `Instruction`.
     */
    var StarPathSegment = (function () {
        function StarPathSegment(name) {
            this.name = name;
            this.specificity = '0';
            this.hash = '*';
        }
        StarPathSegment.prototype.match = function (path) { return true; };
        StarPathSegment.prototype.generate = function (params) { return normalizeString(params.get(this.name)); };
        return StarPathSegment;
    }());
    StarPathSegment.wildcardMatcher = /^\*([^\/]+)$/g;
    /**
     * Parses a URL string using a given matcher DSL, and generates URLs from param maps
     */
    var ParamRoutePath = (function () {
        /**
         * Takes a string representing the matcher DSL
         */
        function ParamRoutePath(routePath) {
            this.routePath = routePath;
            this.terminal = true;
            this._assertValidPath(routePath);
            this._parsePathString(routePath);
            this.specificity = this._calculateSpecificity();
            this.hash = this._calculateHash();
            var lastSegment = this._segments[this._segments.length - 1];
            this.terminal = !(lastSegment instanceof ContinuationPathSegment);
        }
        ParamRoutePath.prototype.matchUrl = function (url) {
            var nextUrlSegment = url;
            var currentUrlSegment;
            var positionalParams = {};
            var captured = [];
            for (var i = 0; i < this._segments.length; i += 1) {
                var pathSegment = this._segments[i];
                currentUrlSegment = nextUrlSegment;
                if (pathSegment instanceof ContinuationPathSegment) {
                    break;
                }
                if (isPresent(currentUrlSegment)) {
                    // the star segment consumes all of the remaining URL, including matrix params
                    if (pathSegment instanceof StarPathSegment) {
                        positionalParams[pathSegment.name] = currentUrlSegment.toString();
                        captured.push(currentUrlSegment.toString());
                        nextUrlSegment = null;
                        break;
                    }
                    captured.push(currentUrlSegment.path);
                    if (pathSegment instanceof DynamicPathSegment) {
                        positionalParams[pathSegment.name] = decodeDynamicSegment(currentUrlSegment.path);
                    }
                    else if (!pathSegment.match(currentUrlSegment.path)) {
                        return null;
                    }
                    nextUrlSegment = currentUrlSegment.child;
                }
                else if (!pathSegment.match('')) {
                    return null;
                }
            }
            if (this.terminal && isPresent(nextUrlSegment)) {
                return null;
            }
            var urlPath = captured.join('/');
            var auxiliary = [];
            var urlParams = [];
            var allParams = positionalParams;
            if (isPresent(currentUrlSegment)) {
                // If this is the root component, read query params. Otherwise, read matrix params.
                var paramsSegment = url instanceof RootUrl ? url : currentUrlSegment;
                if (isPresent(paramsSegment.params)) {
                    allParams = StringMapWrapper.merge(paramsSegment.params, positionalParams);
                    urlParams = convertUrlParamsToArray(paramsSegment.params);
                }
                else {
                    allParams = positionalParams;
                }
                auxiliary = currentUrlSegment.auxiliary;
            }
            return new MatchedUrl(urlPath, urlParams, allParams, auxiliary, nextUrlSegment);
        };
        ParamRoutePath.prototype.generateUrl = function (params) {
            var paramTokens = new TouchMap(params);
            var path = [];
            for (var i = 0; i < this._segments.length; i++) {
                var segment = this._segments[i];
                if (!(segment instanceof ContinuationPathSegment)) {
                    path.push(segment.generate(paramTokens));
                }
            }
            var urlPath = path.join('/');
            var nonPositionalParams = paramTokens.getUnused();
            var urlParams = nonPositionalParams;
            return new GeneratedUrl(urlPath, urlParams);
        };
        ParamRoutePath.prototype.toString = function () { return this.routePath; };
        ParamRoutePath.prototype._parsePathString = function (routePath) {
            // normalize route as not starting with a "/". Recognition will
            // also normalize.
            if (routePath.startsWith("/")) {
                routePath = routePath.substring(1);
            }
            var segmentStrings = routePath.split('/');
            this._segments = [];
            var limit = segmentStrings.length - 1;
            for (var i = 0; i <= limit; i++) {
                var segment = segmentStrings[i], match;
                if (isPresent(match = RegExpWrapper.firstMatch(DynamicPathSegment.paramMatcher, segment))) {
                    this._segments.push(new DynamicPathSegment(match[1]));
                }
                else if (isPresent(match = RegExpWrapper.firstMatch(StarPathSegment.wildcardMatcher, segment))) {
                    this._segments.push(new StarPathSegment(match[1]));
                }
                else if (segment == '...') {
                    if (i < limit) {
                        throw new BaseException("Unexpected \"...\" before the end of the path for \"" + routePath + "\".");
                    }
                    this._segments.push(new ContinuationPathSegment());
                }
                else {
                    this._segments.push(new StaticPathSegment(segment));
                }
            }
        };
        ParamRoutePath.prototype._calculateSpecificity = function () {
            // The "specificity" of a path is used to determine which route is used when multiple routes
            // match
            // a URL. Static segments (like "/foo") are the most specific, followed by dynamic segments
            // (like
            // "/:id"). Star segments add no specificity. Segments at the start of the path are more
            // specific
            // than proceeding ones.
            //
            // The code below uses place values to combine the different types of segments into a single
            // string that we can sort later. Each static segment is marked as a specificity of "2," each
            // dynamic segment is worth "1" specificity, and stars are worth "0" specificity.
            var i, length = this._segments.length, specificity;
            if (length == 0) {
                // a single slash (or "empty segment" is as specific as a static segment
                specificity += '2';
            }
            else {
                specificity = '';
                for (i = 0; i < length; i++) {
                    specificity += this._segments[i].specificity;
                }
            }
            return specificity;
        };
        ParamRoutePath.prototype._calculateHash = function () {
            // this function is used to determine whether a route config path like `/foo/:id` collides with
            // `/foo/:name`
            var i, length = this._segments.length;
            var hashParts = [];
            for (i = 0; i < length; i++) {
                hashParts.push(this._segments[i].hash);
            }
            return hashParts.join('/');
        };
        ParamRoutePath.prototype._assertValidPath = function (path) {
            if (StringWrapper.contains(path, '#')) {
                throw new BaseException("Path \"" + path + "\" should not include \"#\". Use \"HashLocationStrategy\" instead.");
            }
            var illegalCharacter = RegExpWrapper.firstMatch(ParamRoutePath.RESERVED_CHARS, path);
            if (isPresent(illegalCharacter)) {
                throw new BaseException("Path \"" + path + "\" contains \"" + illegalCharacter[0] + "\" which is not allowed in a route config.");
            }
        };
        return ParamRoutePath;
    }());
    ParamRoutePath.RESERVED_CHARS = RegExpWrapper.create('//|\\(|\\)|;|\\?|=');
    var REGEXP_PERCENT = /%/g;
    var REGEXP_SLASH = /\//g;
    var REGEXP_OPEN_PARENT = /\(/g;
    var REGEXP_CLOSE_PARENT = /\)/g;
    var REGEXP_SEMICOLON = /;/g;
    function encodeDynamicSegment(value) {
        if (isBlank(value)) {
            return null;
        }
        value = StringWrapper.replaceAll(value, REGEXP_PERCENT, '%25');
        value = StringWrapper.replaceAll(value, REGEXP_SLASH, '%2F');
        value = StringWrapper.replaceAll(value, REGEXP_OPEN_PARENT, '%28');
        value = StringWrapper.replaceAll(value, REGEXP_CLOSE_PARENT, '%29');
        value = StringWrapper.replaceAll(value, REGEXP_SEMICOLON, '%3B');
        return value;
    }
    var REGEXP_ENC_SEMICOLON = /%3B/ig;
    var REGEXP_ENC_CLOSE_PARENT = /%29/ig;
    var REGEXP_ENC_OPEN_PARENT = /%28/ig;
    var REGEXP_ENC_SLASH = /%2F/ig;
    var REGEXP_ENC_PERCENT = /%25/ig;
    function decodeDynamicSegment(value) {
        if (isBlank(value)) {
            return null;
        }
        value = StringWrapper.replaceAll(value, REGEXP_ENC_SEMICOLON, ';');
        value = StringWrapper.replaceAll(value, REGEXP_ENC_CLOSE_PARENT, ')');
        value = StringWrapper.replaceAll(value, REGEXP_ENC_OPEN_PARENT, '(');
        value = StringWrapper.replaceAll(value, REGEXP_ENC_SLASH, '/');
        value = StringWrapper.replaceAll(value, REGEXP_ENC_PERCENT, '%');
        return value;
    }
    var RegexRoutePath = (function () {
        function RegexRoutePath(_reString, _serializer) {
            this._reString = _reString;
            this._serializer = _serializer;
            this.terminal = true;
            this.specificity = '2';
            this.hash = this._reString;
            this._regex = RegExpWrapper.create(this._reString);
        }
        RegexRoutePath.prototype.matchUrl = function (url) {
            var urlPath = url.toString();
            var params = {};
            var matcher = RegExpWrapper.matcher(this._regex, urlPath);
            var match = RegExpMatcherWrapper.next(matcher);
            if (isBlank(match)) {
                return null;
            }
            for (var i = 0; i < match.length; i += 1) {
                params[i.toString()] = match[i];
            }
            return new MatchedUrl(urlPath, [], params, [], null);
        };
        RegexRoutePath.prototype.generateUrl = function (params) { return this._serializer(params); };
        RegexRoutePath.prototype.toString = function () { return this._reString; };
        return RegexRoutePath;
    }());
    /**
     * A `RuleSet` is responsible for recognizing routes for a particular component.
     * It is consumed by `RouteRegistry`, which knows how to recognize an entire hierarchy of
     * components.
     */
    var RuleSet = (function () {
        function RuleSet() {
            this.rulesByName = new Map$1();
            // map from name to rule
            this.auxRulesByName = new Map$1();
            // map from starting path to rule
            this.auxRulesByPath = new Map$1();
            // TODO: optimize this into a trie
            this.rules = [];
            // the rule to use automatically when recognizing or generating from this rule set
            this.defaultRule = null;
        }
        /**
         * Configure additional rules in this rule set from a route definition
         * @returns {boolean} true if the config is terminal
         */
        RuleSet.prototype.config = function (config) {
            var handler;
            if (isPresent(config.name) && config.name[0].toUpperCase() != config.name[0]) {
                var suggestedName = config.name[0].toUpperCase() + config.name.substring(1);
                throw new BaseException("Route \"" + config.path + "\" with name \"" + config.name + "\" does not begin with an uppercase letter. Route names should be CamelCase like \"" + suggestedName + "\".");
            }
            if (config instanceof AuxRoute) {
                handler = new SyncRouteHandler(config.component, config.data);
                var routePath_1 = this._getRoutePath(config);
                var auxRule = new RouteRule(routePath_1, handler, config.name);
                this.auxRulesByPath.set(routePath_1.toString(), auxRule);
                if (isPresent(config.name)) {
                    this.auxRulesByName.set(config.name, auxRule);
                }
                return auxRule.terminal;
            }
            var useAsDefault = false;
            if (config instanceof Redirect) {
                var routePath_2 = this._getRoutePath(config);
                var redirector = new RedirectRule(routePath_2, config.redirectTo);
                this._assertNoHashCollision(redirector.hash, config.path);
                this.rules.push(redirector);
                return true;
            }
            if (config instanceof Route) {
                handler = new SyncRouteHandler(config.component, config.data);
                useAsDefault = isPresent(config.useAsDefault) && config.useAsDefault;
            }
            else if (config instanceof AsyncRoute) {
                handler = new AsyncRouteHandler(config.loader, config.data);
                useAsDefault = isPresent(config.useAsDefault) && config.useAsDefault;
            }
            var routePath = this._getRoutePath(config);
            var newRule = new RouteRule(routePath, handler, config.name);
            this._assertNoHashCollision(newRule.hash, config.path);
            if (useAsDefault) {
                if (isPresent(this.defaultRule)) {
                    throw new BaseException("Only one route can be default");
                }
                this.defaultRule = newRule;
            }
            this.rules.push(newRule);
            if (isPresent(config.name)) {
                this.rulesByName.set(config.name, newRule);
            }
            return newRule.terminal;
        };
        /**
         * Given a URL, returns a list of `RouteMatch`es, which are partial recognitions for some route.
         */
        RuleSet.prototype.recognize = function (urlParse) {
            var solutions = [];
            this.rules.forEach(function (routeRecognizer) {
                var pathMatch = routeRecognizer.recognize(urlParse);
                if (isPresent(pathMatch)) {
                    solutions.push(pathMatch);
                }
            });
            // handle cases where we are routing just to an aux route
            if (solutions.length == 0 && isPresent(urlParse) && urlParse.auxiliary.length > 0) {
                return [PromiseWrapper.resolve(new PathMatch(null, null, urlParse.auxiliary))];
            }
            return solutions;
        };
        RuleSet.prototype.recognizeAuxiliary = function (urlParse) {
            var routeRecognizer = this.auxRulesByPath.get(urlParse.path);
            if (isPresent(routeRecognizer)) {
                return [routeRecognizer.recognize(urlParse)];
            }
            return [PromiseWrapper.resolve(null)];
        };
        RuleSet.prototype.hasRoute = function (name) { return this.rulesByName.has(name); };
        RuleSet.prototype.componentLoaded = function (name) {
            return this.hasRoute(name) && isPresent(this.rulesByName.get(name).handler.componentType);
        };
        RuleSet.prototype.loadComponent = function (name) {
            return this.rulesByName.get(name).handler.resolveComponentType();
        };
        RuleSet.prototype.generate = function (name, params) {
            var rule = this.rulesByName.get(name);
            if (isBlank(rule)) {
                return null;
            }
            return rule.generate(params);
        };
        RuleSet.prototype.generateAuxiliary = function (name, params) {
            var rule = this.auxRulesByName.get(name);
            if (isBlank(rule)) {
                return null;
            }
            return rule.generate(params);
        };
        RuleSet.prototype._assertNoHashCollision = function (hash, path) {
            this.rules.forEach(function (rule) {
                if (hash == rule.hash) {
                    throw new BaseException("Configuration '" + path + "' conflicts with existing route '" + rule.path + "'");
                }
            });
        };
        RuleSet.prototype._getRoutePath = function (config) {
            if (isPresent(config.regex)) {
                if (isFunction(config.serializer)) {
                    return new RegexRoutePath(config.regex, config.serializer);
                }
                else {
                    throw new BaseException("Route provides a regex property, '" + config.regex + "', but no serializer property");
                }
            }
            if (isPresent(config.path)) {
                // Auxiliary routes do not have a slash at the start
                var path = (config instanceof AuxRoute && config.path.startsWith('/')) ?
                    config.path.substring(1) :
                    config.path;
                return new ParamRoutePath(path);
            }
            throw new BaseException('Route must provide either a path or regex property');
        };
        return RuleSet;
    }());
    var makeDecorator = _angular_core.__core_private__.makeDecorator;
    // Copied from RouteConfig in route_config_impl.
    /**
     * The `RouteConfig` decorator defines routes for a given component.
     *
     * It takes an array of {@link RouteDefinition}s.
     */
    var RouteConfig = makeDecorator(RouteConfigAnnotation);
    /**
     * Given a JS Object that represents a route config, returns a corresponding Route, AsyncRoute,
     * AuxRoute or Redirect object.
     *
     * Also wraps an AsyncRoute's loader function to add the loaded component's route config to the
     * `RouteRegistry`.
     */
    function normalizeRouteConfig(config, registry) {
        if (config instanceof AsyncRoute) {
            var wrappedLoader = wrapLoaderToReconfigureRegistry(config.loader, registry);
            return new AsyncRoute({
                path: config.path,
                loader: wrappedLoader,
                name: config.name,
                data: config.data,
                useAsDefault: config.useAsDefault
            });
        }
        if (config instanceof Route || config instanceof Redirect || config instanceof AuxRoute) {
            return config;
        }
        if ((+!!config.component) + (+!!config.redirectTo) + (+!!config.loader) != 1) {
            throw new BaseException("Route config should contain exactly one \"component\", \"loader\", or \"redirectTo\" property.");
        }
        if (config.as && config.name) {
            throw new BaseException("Route config should contain exactly one \"as\" or \"name\" property.");
        }
        if (config.as) {
            config.name = config.as;
        }
        if (config.loader) {
            var wrappedLoader = wrapLoaderToReconfigureRegistry(config.loader, registry);
            return new AsyncRoute({
                path: config.path,
                loader: wrappedLoader,
                name: config.name,
                data: config.data,
                useAsDefault: config.useAsDefault
            });
        }
        if (config.aux) {
            return new AuxRoute({ path: config.aux, component: config.component, name: config.name });
        }
        if (config.component) {
            if (typeof config.component == 'object') {
                var componentDefinitionObject = config.component;
                if (componentDefinitionObject.type == 'constructor') {
                    return new Route({
                        path: config.path,
                        component: componentDefinitionObject.constructor,
                        name: config.name,
                        data: config.data,
                        useAsDefault: config.useAsDefault
                    });
                }
                else if (componentDefinitionObject.type == 'loader') {
                    return new AsyncRoute({
                        path: config.path,
                        loader: componentDefinitionObject.loader,
                        name: config.name,
                        data: config.data,
                        useAsDefault: config.useAsDefault
                    });
                }
                else {
                    throw new BaseException("Invalid component type \"" + componentDefinitionObject.type + "\". Valid types are \"constructor\" and \"loader\".");
                }
            }
            return new Route(config);
        }
        if (config.redirectTo) {
            return new Redirect({ path: config.path, redirectTo: config.redirectTo });
        }
        return config;
    }
    function wrapLoaderToReconfigureRegistry(loader, registry) {
        return function () {
            return loader().then(function (componentType) {
                registry.configFromComponent(componentType);
                return componentType;
            });
        };
    }
    function assertComponentExists(component, path) {
        if (!isType(component)) {
            throw new BaseException("Component for route \"" + path + "\" is not defined, or is not a class.");
        }
    }
    var __decorate$1 = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata$1 = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
    var __param$1 = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    };
    var _resolveToNull = PromiseWrapper.resolve(null);
    // A LinkItemArray is an array, which describes a set of routes
    // The items in the array are found in groups:
    // - the first item is the name of the route
    // - the next items are:
    //   - an object containing parameters
    //   - or an array describing an aux route
    // export type LinkRouteItem = string | Object;
    // export type LinkItem = LinkRouteItem | Array<LinkRouteItem>;
    // export type LinkItemArray = Array<LinkItem>;
    /**
     * Token used to bind the component with the top-level {@link RouteConfig}s for the
     * application.
     *
     * ### Example ([live demo](http://plnkr.co/edit/iRUP8B5OUbxCWQ3AcIDm))
     *
     * ```
     * import {Component} from '@angular/core';
     * import {
     *   ROUTER_DIRECTIVES,
     *   ROUTER_PROVIDERS,
     *   RouteConfig
     * } from '@angular/router-deprecated';
     *
     * @Component({directives: [ROUTER_DIRECTIVES]})
     * @RouteConfig([
     *  {...},
     * ])
     * class AppCmp {
     *   // ...
     * }
     *
     * bootstrap(AppCmp, [ROUTER_PROVIDERS]);
     * ```
     */
    var ROUTER_PRIMARY_COMPONENT = 
    /*@ts2dart_const*/ new _angular_core.OpaqueToken('RouterPrimaryComponent');
    /**
     * The RouteRegistry holds route configurations for each component in an Angular app.
     * It is responsible for creating Instructions from URLs, and generating URLs based on route and
     * parameters.
     */
    exports.RouteRegistry = (function () {
        function RouteRegistry(_rootComponent) {
            this._rootComponent = _rootComponent;
            this._rules = new Map$1();
        }
        /**
         * Given a component and a configuration object, add the route to this registry
         */
        RouteRegistry.prototype.config = function (parentComponent, config) {
            config = normalizeRouteConfig(config, this);
            // this is here because Dart type guard reasons
            if (config instanceof Route) {
                assertComponentExists(config.component, config.path);
            }
            else if (config instanceof AuxRoute) {
                assertComponentExists(config.component, config.path);
            }
            var rules = this._rules.get(parentComponent);
            if (isBlank(rules)) {
                rules = new RuleSet();
                this._rules.set(parentComponent, rules);
            }
            var terminal = rules.config(config);
            if (config instanceof Route) {
                if (terminal) {
                    assertTerminalComponent(config.component, config.path);
                }
                else {
                    this.configFromComponent(config.component);
                }
            }
        };
        /**
         * Reads the annotations of a component and configures the registry based on them
         */
        RouteRegistry.prototype.configFromComponent = function (component) {
            var _this = this;
            if (!isType(component)) {
                return;
            }
            // Don't read the annotations from a type more than once –
            // this prevents an infinite loop if a component routes recursively.
            if (this._rules.has(component)) {
                return;
            }
            var annotations = _angular_core.reflector.annotations(component);
            if (isPresent(annotations)) {
                for (var i = 0; i < annotations.length; i++) {
                    var annotation = annotations[i];
                    if (annotation instanceof RouteConfigAnnotation) {
                        var routeCfgs = annotation.configs;
                        routeCfgs.forEach(function (config) { return _this.config(component, config); });
                    }
                }
            }
        };
        /**
         * Given a URL and a parent component, return the most specific instruction for navigating
         * the application into the state specified by the url
         */
        RouteRegistry.prototype.recognize = function (url, ancestorInstructions) {
            var parsedUrl = parser.parse(url);
            return this._recognize(parsedUrl, []);
        };
        /**
         * Recognizes all parent-child routes, but creates unresolved auxiliary routes
         */
        RouteRegistry.prototype._recognize = function (parsedUrl, ancestorInstructions, _aux) {
            var _this = this;
            if (_aux === void 0) { _aux = false; }
            var parentInstruction = ListWrapper.last(ancestorInstructions);
            var parentComponent = isPresent(parentInstruction) ? parentInstruction.component.componentType :
                this._rootComponent;
            var rules = this._rules.get(parentComponent);
            if (isBlank(rules)) {
                return _resolveToNull;
            }
            // Matches some beginning part of the given URL
            var possibleMatches = _aux ? rules.recognizeAuxiliary(parsedUrl) : rules.recognize(parsedUrl);
            var matchPromises = possibleMatches.map(function (candidate) { return candidate.then(function (candidate) {
                if (candidate instanceof PathMatch) {
                    var auxParentInstructions = ancestorInstructions.length > 0 ? [ListWrapper.last(ancestorInstructions)] : [];
                    var auxInstructions = _this._auxRoutesToUnresolved(candidate.remainingAux, auxParentInstructions);
                    var instruction = new ResolvedInstruction(candidate.instruction, null, auxInstructions);
                    if (isBlank(candidate.instruction) || candidate.instruction.terminal) {
                        return instruction;
                    }
                    var newAncestorInstructions = ancestorInstructions.concat([instruction]);
                    return _this._recognize(candidate.remaining, newAncestorInstructions)
                        .then(function (childInstruction) {
                        if (isBlank(childInstruction)) {
                            return null;
                        }
                        // redirect instructions are already absolute
                        if (childInstruction instanceof RedirectInstruction) {
                            return childInstruction;
                        }
                        instruction.child = childInstruction;
                        return instruction;
                    });
                }
                if (candidate instanceof RedirectMatch) {
                    var instruction = _this.generate(candidate.redirectTo, ancestorInstructions.concat([null]));
                    return new RedirectInstruction(instruction.component, instruction.child, instruction.auxInstruction, candidate.specificity);
                }
            }); });
            if ((isBlank(parsedUrl) || parsedUrl.path == '') && possibleMatches.length == 0) {
                return PromiseWrapper.resolve(this.generateDefault(parentComponent));
            }
            return PromiseWrapper.all(matchPromises).then(mostSpecific);
        };
        RouteRegistry.prototype._auxRoutesToUnresolved = function (auxRoutes, parentInstructions) {
            var _this = this;
            var unresolvedAuxInstructions = {};
            auxRoutes.forEach(function (auxUrl) {
                unresolvedAuxInstructions[auxUrl.path] = new UnresolvedInstruction(function () { return _this._recognize(auxUrl, parentInstructions, true); });
            });
            return unresolvedAuxInstructions;
        };
        /**
         * Given a normalized list with component names and params like: `['user', {id: 3 }]`
         * generates a url with a leading slash relative to the provided `parentComponent`.
         *
         * If the optional param `_aux` is `true`, then we generate starting at an auxiliary
         * route boundary.
         */
        RouteRegistry.prototype.generate = function (linkParams, ancestorInstructions, _aux) {
            if (_aux === void 0) { _aux = false; }
            var params = splitAndFlattenLinkParams(linkParams);
            var prevInstruction;
            // The first segment should be either '.' (generate from parent) or '' (generate from root).
            // When we normalize above, we strip all the slashes, './' becomes '.' and '/' becomes ''.
            if (ListWrapper.first(params) == '') {
                params.shift();
                prevInstruction = ListWrapper.first(ancestorInstructions);
                ancestorInstructions = [];
            }
            else {
                prevInstruction = ancestorInstructions.length > 0 ? ancestorInstructions.pop() : null;
                if (ListWrapper.first(params) == '.') {
                    params.shift();
                }
                else if (ListWrapper.first(params) == '..') {
                    while (ListWrapper.first(params) == '..') {
                        if (ancestorInstructions.length <= 0) {
                            throw new BaseException("Link \"" + ListWrapper.toJSON(linkParams) + "\" has too many \"../\" segments.");
                        }
                        prevInstruction = ancestorInstructions.pop();
                        params = ListWrapper.slice(params, 1);
                    }
                }
                else {
                    // we must only peak at the link param, and not consume it
                    var routeName = ListWrapper.first(params);
                    var parentComponentType = this._rootComponent;
                    var grandparentComponentType = null;
                    if (ancestorInstructions.length > 1) {
                        var parentComponentInstruction = ancestorInstructions[ancestorInstructions.length - 1];
                        var grandComponentInstruction = ancestorInstructions[ancestorInstructions.length - 2];
                        parentComponentType = parentComponentInstruction.component.componentType;
                        grandparentComponentType = grandComponentInstruction.component.componentType;
                    }
                    else if (ancestorInstructions.length == 1) {
                        parentComponentType = ancestorInstructions[0].component.componentType;
                        grandparentComponentType = this._rootComponent;
                    }
                    // For a link with no leading `./`, `/`, or `../`, we look for a sibling and child.
                    // If both exist, we throw. Otherwise, we prefer whichever exists.
                    var childRouteExists = this.hasRoute(routeName, parentComponentType);
                    var parentRouteExists = isPresent(grandparentComponentType) &&
                        this.hasRoute(routeName, grandparentComponentType);
                    if (parentRouteExists && childRouteExists) {
                        var msg = "Link \"" + ListWrapper.toJSON(linkParams) + "\" is ambiguous, use \"./\" or \"../\" to disambiguate.";
                        throw new BaseException(msg);
                    }
                    if (parentRouteExists) {
                        prevInstruction = ancestorInstructions.pop();
                    }
                }
            }
            if (params[params.length - 1] == '') {
                params.pop();
            }
            if (params.length > 0 && params[0] == '') {
                params.shift();
            }
            if (params.length < 1) {
                var msg = "Link \"" + ListWrapper.toJSON(linkParams) + "\" must include a route name.";
                throw new BaseException(msg);
            }
            var generatedInstruction = this._generate(params, ancestorInstructions, prevInstruction, _aux, linkParams);
            // we don't clone the first (root) element
            for (var i = ancestorInstructions.length - 1; i >= 0; i--) {
                var ancestorInstruction = ancestorInstructions[i];
                if (isBlank(ancestorInstruction)) {
                    break;
                }
                generatedInstruction = ancestorInstruction.replaceChild(generatedInstruction);
            }
            return generatedInstruction;
        };
        /*
         * Internal helper that does not make any assertions about the beginning of the link DSL.
         * `ancestorInstructions` are parents that will be cloned.
         * `prevInstruction` is the existing instruction that would be replaced, but which might have
         * aux routes that need to be cloned.
         */
        RouteRegistry.prototype._generate = function (linkParams, ancestorInstructions, prevInstruction, _aux, _originalLink) {
            var _this = this;
            if (_aux === void 0) { _aux = false; }
            var parentComponentType = this._rootComponent;
            var componentInstruction = null;
            var auxInstructions = {};
            var parentInstruction = ListWrapper.last(ancestorInstructions);
            if (isPresent(parentInstruction) && isPresent(parentInstruction.component)) {
                parentComponentType = parentInstruction.component.componentType;
            }
            if (linkParams.length == 0) {
                var defaultInstruction = this.generateDefault(parentComponentType);
                if (isBlank(defaultInstruction)) {
                    throw new BaseException("Link \"" + ListWrapper.toJSON(_originalLink) + "\" does not resolve to a terminal instruction.");
                }
                return defaultInstruction;
            }
            // for non-aux routes, we want to reuse the predecessor's existing primary and aux routes
            // and only override routes for which the given link DSL provides
            if (isPresent(prevInstruction) && !_aux) {
                auxInstructions = StringMapWrapper.merge(prevInstruction.auxInstruction, auxInstructions);
                componentInstruction = prevInstruction.component;
            }
            var rules = this._rules.get(parentComponentType);
            if (isBlank(rules)) {
                throw new BaseException("Component \"" + getTypeNameForDebugging(parentComponentType) + "\" has no route config.");
            }
            var linkParamIndex = 0;
            var routeParams = {};
            // first, recognize the primary route if one is provided
            if (linkParamIndex < linkParams.length && isString(linkParams[linkParamIndex])) {
                var routeName = linkParams[linkParamIndex];
                if (routeName == '' || routeName == '.' || routeName == '..') {
                    throw new BaseException("\"" + routeName + "/\" is only allowed at the beginning of a link DSL.");
                }
                linkParamIndex += 1;
                if (linkParamIndex < linkParams.length) {
                    var linkParam = linkParams[linkParamIndex];
                    if (isStringMap(linkParam) && !isArray(linkParam)) {
                        routeParams = linkParam;
                        linkParamIndex += 1;
                    }
                }
                var routeRecognizer = (_aux ? rules.auxRulesByName : rules.rulesByName).get(routeName);
                if (isBlank(routeRecognizer)) {
                    throw new BaseException("Component \"" + getTypeNameForDebugging(parentComponentType) + "\" has no route named \"" + routeName + "\".");
                }
                // Create an "unresolved instruction" for async routes
                // we'll figure out the rest of the route when we resolve the instruction and
                // perform a navigation
                if (isBlank(routeRecognizer.handler.componentType)) {
                    var generatedUrl = routeRecognizer.generateComponentPathValues(routeParams);
                    return new UnresolvedInstruction(function () {
                        return routeRecognizer.handler.resolveComponentType().then(function (_) {
                            return _this._generate(linkParams, ancestorInstructions, prevInstruction, _aux, _originalLink);
                        });
                    }, generatedUrl.urlPath, convertUrlParamsToArray(generatedUrl.urlParams));
                }
                componentInstruction = _aux ? rules.generateAuxiliary(routeName, routeParams) :
                    rules.generate(routeName, routeParams);
            }
            // Next, recognize auxiliary instructions.
            // If we have an ancestor instruction, we preserve whatever aux routes are active from it.
            while (linkParamIndex < linkParams.length && isArray(linkParams[linkParamIndex])) {
                var auxParentInstruction = [parentInstruction];
                var auxInstruction = this._generate(linkParams[linkParamIndex], auxParentInstruction, null, true, _originalLink);
                // TODO: this will not work for aux routes with parameters or multiple segments
                auxInstructions[auxInstruction.component.urlPath] = auxInstruction;
                linkParamIndex += 1;
            }
            var instruction = new ResolvedInstruction(componentInstruction, null, auxInstructions);
            // If the component is sync, we can generate resolved child route instructions
            // If not, we'll resolve the instructions at navigation time
            if (isPresent(componentInstruction) && isPresent(componentInstruction.componentType)) {
                var childInstruction = null;
                if (componentInstruction.terminal) {
                    if (linkParamIndex >= linkParams.length) {
                    }
                }
                else {
                    var childAncestorComponents = ancestorInstructions.concat([instruction]);
                    var remainingLinkParams = linkParams.slice(linkParamIndex);
                    childInstruction = this._generate(remainingLinkParams, childAncestorComponents, null, false, _originalLink);
                }
                instruction.child = childInstruction;
            }
            return instruction;
        };
        RouteRegistry.prototype.hasRoute = function (name, parentComponent) {
            var rules = this._rules.get(parentComponent);
            if (isBlank(rules)) {
                return false;
            }
            return rules.hasRoute(name);
        };
        RouteRegistry.prototype.generateDefault = function (componentCursor) {
            var _this = this;
            if (isBlank(componentCursor)) {
                return null;
            }
            var rules = this._rules.get(componentCursor);
            if (isBlank(rules) || isBlank(rules.defaultRule)) {
                return null;
            }
            var defaultChild = null;
            if (isPresent(rules.defaultRule.handler.componentType)) {
                var componentInstruction = rules.defaultRule.generate({});
                if (!rules.defaultRule.terminal) {
                    defaultChild = this.generateDefault(rules.defaultRule.handler.componentType);
                }
                return new DefaultInstruction(componentInstruction, defaultChild);
            }
            return new UnresolvedInstruction(function () {
                return rules.defaultRule.handler.resolveComponentType().then(function (_) { return _this.generateDefault(componentCursor); });
            });
        };
        return RouteRegistry;
    }());
    exports.RouteRegistry = __decorate$1([
        _angular_core.Injectable(),
        __param$1(0, _angular_core.Inject(ROUTER_PRIMARY_COMPONENT)),
        __metadata$1('design:paramtypes', [Type$1])
    ], exports.RouteRegistry);
    /*
     * Given: ['/a/b', {c: 2}]
     * Returns: ['', 'a', 'b', {c: 2}]
     */
    function splitAndFlattenLinkParams(linkParams) {
        var accumulation = [];
        linkParams.forEach(function (item) {
            if (isString(item)) {
                var strItem = item;
                accumulation = accumulation.concat(strItem.split('/'));
            }
            else {
                accumulation.push(item);
            }
        });
        return accumulation;
    }
    /*
     * Given a list of instructions, returns the most specific instruction
     */
    function mostSpecific(instructions) {
        instructions = instructions.filter(function (instruction) { return isPresent(instruction); });
        if (instructions.length == 0) {
            return null;
        }
        if (instructions.length == 1) {
            return instructions[0];
        }
        var first = instructions[0];
        var rest = instructions.slice(1);
        return rest.reduce(function (instruction, contender) {
            if (compareSpecificityStrings(contender.specificity, instruction.specificity) == -1) {
                return contender;
            }
            return instruction;
        }, first);
    }
    /*
     * Expects strings to be in the form of "[0-2]+"
     * Returns -1 if string A should be sorted above string B, 1 if it should be sorted after,
     * or 0 if they are the same.
     */
    function compareSpecificityStrings(a, b) {
        var l = Math.min(a.length, b.length);
        for (var i = 0; i < l; i += 1) {
            var ai = StringWrapper.charCodeAt(a, i);
            var bi = StringWrapper.charCodeAt(b, i);
            var difference = bi - ai;
            if (difference != 0) {
                return difference;
            }
        }
        return a.length - b.length;
    }
    function assertTerminalComponent(component, path) {
        if (!isType(component)) {
            return;
        }
        var annotations = _angular_core.reflector.annotations(component);
        if (isPresent(annotations)) {
            for (var i = 0; i < annotations.length; i++) {
                var annotation = annotations[i];
                if (annotation instanceof RouteConfigAnnotation) {
                    throw new BaseException("Child routes are not allowed for \"" + path + "\". Use \"...\" on the parent's route path.");
                }
            }
        }
    }
    /* @ts2dart_const */
    var RouteLifecycleHook = (function () {
        function RouteLifecycleHook(name) {
            this.name = name;
        }
        return RouteLifecycleHook;
    }());
    /* @ts2dart_const */
    var CanActivateAnnotation = (function () {
        function CanActivateAnnotation(fn) {
            this.fn = fn;
        }
        return CanActivateAnnotation;
    }());
    var routerCanReuse = 
    /*@ts2dart_const*/ new RouteLifecycleHook("routerCanReuse");
    var routerCanDeactivate = 
    /*@ts2dart_const*/ new RouteLifecycleHook("routerCanDeactivate");
    var routerOnActivate = 
    /*@ts2dart_const*/ new RouteLifecycleHook("routerOnActivate");
    var routerOnReuse = 
    /*@ts2dart_const*/ new RouteLifecycleHook("routerOnReuse");
    var routerOnDeactivate = 
    /*@ts2dart_const*/ new RouteLifecycleHook("routerOnDeactivate");
    function hasLifecycleHook(e, type) {
        if (!(type instanceof _angular_core.Type))
            return false;
        return e.name in type.prototype;
    }
    function getCanActivateHook(type) {
        var annotations = _angular_core.reflector.annotations(type);
        for (var i = 0; i < annotations.length; i += 1) {
            var annotation = annotations[i];
            if (annotation instanceof CanActivateAnnotation) {
                return annotation.fn;
            }
        }
        return null;
    }
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    };
    var _resolveToTrue = PromiseWrapper.resolve(true);
    var _resolveToFalse = PromiseWrapper.resolve(false);
    /**
     * The `Router` is responsible for mapping URLs to components.
     *
     * You can see the state of the router by inspecting the read-only field `router.navigating`.
     * This may be useful for showing a spinner, for instance.
     *
     * ## Concepts
     *
     * Routers and component instances have a 1:1 correspondence.
     *
     * The router holds reference to a number of {@link RouterOutlet}.
     * An outlet is a placeholder that the router dynamically fills in depending on the current URL.
     *
     * When the router navigates from a URL, it must first recognize it and serialize it into an
     * `Instruction`.
     * The router uses the `RouteRegistry` to get an `Instruction`.
     */
    exports.Router = (function () {
        function Router(registry, parent, hostComponent, root) {
            this.registry = registry;
            this.parent = parent;
            this.hostComponent = hostComponent;
            this.root = root;
            this.navigating = false;
            /**
             * The current `Instruction` for the router
             */
            this.currentInstruction = null;
            this._currentNavigation = _resolveToTrue;
            this._outlet = null;
            this._auxRouters = new Map$1();
            this._subject = new EventEmitter();
        }
        /**
         * Constructs a child router. You probably don't need to use this unless you're writing a reusable
         * component.
         */
        Router.prototype.childRouter = function (hostComponent) {
            return this._childRouter = new ChildRouter(this, hostComponent);
        };
        /**
         * Constructs a child router. You probably don't need to use this unless you're writing a reusable
         * component.
         */
        Router.prototype.auxRouter = function (hostComponent) { return new ChildRouter(this, hostComponent); };
        /**
         * Register an outlet to be notified of primary route changes.
         *
         * You probably don't need to use this unless you're writing a reusable component.
         */
        Router.prototype.registerPrimaryOutlet = function (outlet) {
            if (isPresent(outlet.name)) {
                throw new BaseException("registerPrimaryOutlet expects to be called with an unnamed outlet.");
            }
            if (isPresent(this._outlet)) {
                throw new BaseException("Primary outlet is already registered.");
            }
            this._outlet = outlet;
            if (isPresent(this.currentInstruction)) {
                return this.commit(this.currentInstruction, false);
            }
            return _resolveToTrue;
        };
        /**
         * Unregister an outlet (because it was destroyed, etc).
         *
         * You probably don't need to use this unless you're writing a custom outlet implementation.
         */
        Router.prototype.unregisterPrimaryOutlet = function (outlet) {
            if (isPresent(outlet.name)) {
                throw new BaseException("registerPrimaryOutlet expects to be called with an unnamed outlet.");
            }
            this._outlet = null;
        };
        /**
         * Register an outlet to notified of auxiliary route changes.
         *
         * You probably don't need to use this unless you're writing a reusable component.
         */
        Router.prototype.registerAuxOutlet = function (outlet) {
            var outletName = outlet.name;
            if (isBlank(outletName)) {
                throw new BaseException("registerAuxOutlet expects to be called with an outlet with a name.");
            }
            var router = this.auxRouter(this.hostComponent);
            this._auxRouters.set(outletName, router);
            router._outlet = outlet;
            var auxInstruction;
            if (isPresent(this.currentInstruction) &&
                isPresent(auxInstruction = this.currentInstruction.auxInstruction[outletName])) {
                return router.commit(auxInstruction);
            }
            return _resolveToTrue;
        };
        /**
         * Given an instruction, returns `true` if the instruction is currently active,
         * otherwise `false`.
         */
        Router.prototype.isRouteActive = function (instruction) {
            var _this = this;
            var router = this;
            if (isBlank(this.currentInstruction)) {
                return false;
            }
            // `instruction` corresponds to the root router
            while (isPresent(router.parent) && isPresent(instruction.child)) {
                router = router.parent;
                instruction = instruction.child;
            }
            if (isBlank(instruction.component) || isBlank(this.currentInstruction.component) ||
                this.currentInstruction.component.routeName != instruction.component.routeName) {
                return false;
            }
            var paramEquals = true;
            if (isPresent(this.currentInstruction.component.params)) {
                StringMapWrapper.forEach(instruction.component.params, function (value, key) {
                    if (_this.currentInstruction.component.params[key] !== value) {
                        paramEquals = false;
                    }
                });
            }
            return paramEquals;
        };
        /**
         * Dynamically update the routing configuration and trigger a navigation.
         *
         * ### Usage
         *
         * ```
         * router.config([
         *   { 'path': '/', 'component': IndexComp },
         *   { 'path': '/user/:id', 'component': UserComp },
         * ]);
         * ```
         */
        Router.prototype.config = function (definitions) {
            var _this = this;
            definitions.forEach(function (routeDefinition) { _this.registry.config(_this.hostComponent, routeDefinition); });
            return this.renavigate();
        };
        /**
         * Navigate based on the provided Route Link DSL. It's preferred to navigate with this method
         * over `navigateByUrl`.
         *
         * ### Usage
         *
         * This method takes an array representing the Route Link DSL:
         * ```
         * ['./MyCmp', {param: 3}]
         * ```
         * See the {@link RouterLink} directive for more.
         */
        Router.prototype.navigate = function (linkParams) {
            var instruction = this.generate(linkParams);
            return this.navigateByInstruction(instruction, false);
        };
        /**
         * Navigate to a URL. Returns a promise that resolves when navigation is complete.
         * It's preferred to navigate with `navigate` instead of this method, since URLs are more brittle.
         *
         * If the given URL begins with a `/`, router will navigate absolutely.
         * If the given URL does not begin with `/`, the router will navigate relative to this component.
         */
        Router.prototype.navigateByUrl = function (url, _skipLocationChange) {
            var _this = this;
            if (_skipLocationChange === void 0) { _skipLocationChange = false; }
            return this._currentNavigation = this._currentNavigation.then(function (_) {
                _this.lastNavigationAttempt = url;
                _this._startNavigating();
                return _this._afterPromiseFinishNavigating(_this.recognize(url).then(function (instruction) {
                    if (isBlank(instruction)) {
                        return false;
                    }
                    return _this._navigate(instruction, _skipLocationChange);
                }));
            });
        };
        /**
         * Navigate via the provided instruction. Returns a promise that resolves when navigation is
         * complete.
         */
        Router.prototype.navigateByInstruction = function (instruction, _skipLocationChange) {
            var _this = this;
            if (_skipLocationChange === void 0) { _skipLocationChange = false; }
            if (isBlank(instruction)) {
                return _resolveToFalse;
            }
            return this._currentNavigation = this._currentNavigation.then(function (_) {
                _this._startNavigating();
                return _this._afterPromiseFinishNavigating(_this._navigate(instruction, _skipLocationChange));
            });
        };
        /** @internal */
        Router.prototype._settleInstruction = function (instruction) {
            var _this = this;
            return instruction.resolveComponent().then(function (_) {
                var unsettledInstructions = [];
                if (isPresent(instruction.component)) {
                    instruction.component.reuse = false;
                }
                if (isPresent(instruction.child)) {
                    unsettledInstructions.push(_this._settleInstruction(instruction.child));
                }
                StringMapWrapper.forEach(instruction.auxInstruction, function (instruction, _) {
                    unsettledInstructions.push(_this._settleInstruction(instruction));
                });
                return PromiseWrapper.all(unsettledInstructions);
            });
        };
        /** @internal */
        Router.prototype._navigate = function (instruction, _skipLocationChange) {
            var _this = this;
            return this._settleInstruction(instruction)
                .then(function (_) { return _this._routerCanReuse(instruction); })
                .then(function (_) { return _this._canActivate(instruction); })
                .then(function (result) {
                if (!result) {
                    return false;
                }
                return _this._routerCanDeactivate(instruction)
                    .then(function (result) {
                    if (result) {
                        return _this.commit(instruction, _skipLocationChange)
                            .then(function (_) {
                            _this._emitNavigationFinish(instruction.toRootUrl());
                            return true;
                        });
                    }
                });
            });
        };
        Router.prototype._emitNavigationFinish = function (url) { ObservableWrapper.callEmit(this._subject, url); };
        /** @internal */
        Router.prototype._emitNavigationFail = function (url) { ObservableWrapper.callError(this._subject, url); };
        Router.prototype._afterPromiseFinishNavigating = function (promise) {
            var _this = this;
            return PromiseWrapper.catchError(promise.then(function (_) { return _this._finishNavigating(); }), function (err) {
                _this._finishNavigating();
                throw err;
            });
        };
        /*
         * Recursively set reuse flags
         */
        /** @internal */
        Router.prototype._routerCanReuse = function (instruction) {
            var _this = this;
            if (isBlank(this._outlet)) {
                return _resolveToFalse;
            }
            if (isBlank(instruction.component)) {
                return _resolveToTrue;
            }
            return this._outlet.routerCanReuse(instruction.component)
                .then(function (result) {
                instruction.component.reuse = result;
                if (result && isPresent(_this._childRouter) && isPresent(instruction.child)) {
                    return _this._childRouter._routerCanReuse(instruction.child);
                }
            });
        };
        Router.prototype._canActivate = function (nextInstruction) {
            return canActivateOne(nextInstruction, this.currentInstruction);
        };
        Router.prototype._routerCanDeactivate = function (instruction) {
            var _this = this;
            if (isBlank(this._outlet)) {
                return _resolveToTrue;
            }
            var next;
            var childInstruction = null;
            var reuse = false;
            var componentInstruction = null;
            if (isPresent(instruction)) {
                childInstruction = instruction.child;
                componentInstruction = instruction.component;
                reuse = isBlank(instruction.component) || instruction.component.reuse;
            }
            if (reuse) {
                next = _resolveToTrue;
            }
            else {
                next = this._outlet.routerCanDeactivate(componentInstruction);
            }
            // TODO: aux route lifecycle hooks
            return next.then(function (result) {
                if (result == false) {
                    return false;
                }
                if (isPresent(_this._childRouter)) {
                    // TODO: ideally, this closure would map to async-await in Dart.
                    // For now, casting to any to suppress an error.
                    return _this._childRouter._routerCanDeactivate(childInstruction);
                }
                return true;
            });
        };
        /**
         * Updates this router and all descendant routers according to the given instruction
         */
        Router.prototype.commit = function (instruction, _skipLocationChange) {
            var _this = this;
            if (_skipLocationChange === void 0) { _skipLocationChange = false; }
            this.currentInstruction = instruction;
            var next = _resolveToTrue;
            if (isPresent(this._outlet) && isPresent(instruction.component)) {
                var componentInstruction = instruction.component;
                if (componentInstruction.reuse) {
                    next = this._outlet.reuse(componentInstruction);
                }
                else {
                    next =
                        this.deactivate(instruction).then(function (_) { return _this._outlet.activate(componentInstruction); });
                }
                if (isPresent(instruction.child)) {
                    next = next.then(function (_) {
                        if (isPresent(_this._childRouter)) {
                            return _this._childRouter.commit(instruction.child);
                        }
                    });
                }
            }
            var promises = [];
            this._auxRouters.forEach(function (router, name) {
                if (isPresent(instruction.auxInstruction[name])) {
                    promises.push(router.commit(instruction.auxInstruction[name]));
                }
            });
            return next.then(function (_) { return PromiseWrapper.all(promises); });
        };
        /** @internal */
        Router.prototype._startNavigating = function () { this.navigating = true; };
        /** @internal */
        Router.prototype._finishNavigating = function () { this.navigating = false; };
        /**
         * Subscribe to URL updates from the router
         */
        Router.prototype.subscribe = function (onNext, onError) {
            return ObservableWrapper.subscribe(this._subject, onNext, onError);
        };
        /**
         * Removes the contents of this router's outlet and all descendant outlets
         */
        Router.prototype.deactivate = function (instruction) {
            var _this = this;
            var childInstruction = null;
            var componentInstruction = null;
            if (isPresent(instruction)) {
                childInstruction = instruction.child;
                componentInstruction = instruction.component;
            }
            var next = _resolveToTrue;
            if (isPresent(this._childRouter)) {
                next = this._childRouter.deactivate(childInstruction);
            }
            if (isPresent(this._outlet)) {
                next = next.then(function (_) { return _this._outlet.deactivate(componentInstruction); });
            }
            // TODO: handle aux routes
            return next;
        };
        /**
         * Given a URL, returns an instruction representing the component graph
         */
        Router.prototype.recognize = function (url) {
            var ancestorComponents = this._getAncestorInstructions();
            return this.registry.recognize(url, ancestorComponents);
        };
        Router.prototype._getAncestorInstructions = function () {
            var ancestorInstructions = [this.currentInstruction];
            var ancestorRouter = this;
            while (isPresent(ancestorRouter = ancestorRouter.parent)) {
                ancestorInstructions.unshift(ancestorRouter.currentInstruction);
            }
            return ancestorInstructions;
        };
        /**
         * Navigates to either the last URL successfully navigated to, or the last URL requested if the
         * router has yet to successfully navigate.
         */
        Router.prototype.renavigate = function () {
            if (isBlank(this.lastNavigationAttempt)) {
                return this._currentNavigation;
            }
            return this.navigateByUrl(this.lastNavigationAttempt);
        };
        /**
         * Generate an `Instruction` based on the provided Route Link DSL.
         */
        Router.prototype.generate = function (linkParams) {
            var ancestorInstructions = this._getAncestorInstructions();
            return this.registry.generate(linkParams, ancestorInstructions);
        };
        return Router;
    }());
    exports.Router = __decorate([
        _angular_core.Injectable(),
        __metadata('design:paramtypes', [exports.RouteRegistry, exports.Router, Object, exports.Router])
    ], exports.Router);
    var RootRouter = (function (_super) {
        __extends(RootRouter, _super);
        function RootRouter(registry, location, primaryComponent) {
            var _this = this;
            _super.call(this, registry, null, primaryComponent);
            this.root = this;
            this._location = location;
            this._locationSub = this._location.subscribe(function (change) {
                // we call recognize ourselves
                _this.recognize(change['url'])
                    .then(function (instruction) {
                    if (isPresent(instruction)) {
                        _this.navigateByInstruction(instruction, isPresent(change['pop']))
                            .then(function (_) {
                            // this is a popstate event; no need to change the URL
                            if (isPresent(change['pop']) && change['type'] != 'hashchange') {
                                return;
                            }
                            var emitPath = instruction.toUrlPath();
                            var emitQuery = instruction.toUrlQuery();
                            if (emitPath.length > 0 && emitPath[0] != '/') {
                                emitPath = '/' + emitPath;
                            }
                            // We've opted to use pushstate and popState APIs regardless of whether you
                            // an app uses HashLocationStrategy or PathLocationStrategy.
                            // However, apps that are migrating might have hash links that operate outside
                            // angular to which routing must respond.
                            // Therefore we know that all hashchange events occur outside Angular.
                            // To support these cases where we respond to hashchanges and redirect as a
                            // result, we need to replace the top item on the stack.
                            if (change['type'] == 'hashchange') {
                                if (instruction.toRootUrl() != _this._location.path()) {
                                    _this._location.replaceState(emitPath, emitQuery);
                                }
                            }
                            else {
                                _this._location.go(emitPath, emitQuery);
                            }
                        });
                    }
                    else {
                        _this._emitNavigationFail(change['url']);
                    }
                });
            });
            this.registry.configFromComponent(primaryComponent);
            this.navigateByUrl(location.path());
        }
        RootRouter.prototype.commit = function (instruction, _skipLocationChange) {
            var _this = this;
            if (_skipLocationChange === void 0) { _skipLocationChange = false; }
            var emitPath = instruction.toUrlPath();
            var emitQuery = instruction.toUrlQuery();
            if (emitPath.length > 0 && emitPath[0] != '/') {
                emitPath = '/' + emitPath;
            }
            var promise = _super.prototype.commit.call(this, instruction);
            if (!_skipLocationChange) {
                promise = promise.then(function (_) { _this._location.go(emitPath, emitQuery); });
            }
            return promise;
        };
        RootRouter.prototype.dispose = function () {
            if (isPresent(this._locationSub)) {
                ObservableWrapper.dispose(this._locationSub);
                this._locationSub = null;
            }
        };
        return RootRouter;
    }(exports.Router));
    RootRouter = __decorate([
        _angular_core.Injectable(),
        __param(2, _angular_core.Inject(ROUTER_PRIMARY_COMPONENT)),
        __metadata('design:paramtypes', [exports.RouteRegistry, _angular_common.Location, Type$1])
    ], RootRouter);
    var ChildRouter = (function (_super) {
        __extends(ChildRouter, _super);
        function ChildRouter(parent, hostComponent) {
            _super.call(this, parent.registry, parent, hostComponent, parent.root);
            this.parent = parent;
        }
        ChildRouter.prototype.navigateByUrl = function (url, _skipLocationChange) {
            if (_skipLocationChange === void 0) { _skipLocationChange = false; }
            // Delegate navigation to the root router
            return this.parent.navigateByUrl(url, _skipLocationChange);
        };
        ChildRouter.prototype.navigateByInstruction = function (instruction, _skipLocationChange) {
            if (_skipLocationChange === void 0) { _skipLocationChange = false; }
            // Delegate navigation to the root router
            return this.parent.navigateByInstruction(instruction, _skipLocationChange);
        };
        return ChildRouter;
    }(exports.Router));
    function canActivateOne(nextInstruction, prevInstruction) {
        var next = _resolveToTrue;
        if (isBlank(nextInstruction.component)) {
            return next;
        }
        if (isPresent(nextInstruction.child)) {
            next = canActivateOne(nextInstruction.child, isPresent(prevInstruction) ? prevInstruction.child : null);
        }
        return next.then(function (result) {
            if (result == false) {
                return false;
            }
            if (nextInstruction.component.reuse) {
                return true;
            }
            var hook = getCanActivateHook(nextInstruction.component.componentType);
            if (isPresent(hook)) {
                return hook(nextInstruction.component, isPresent(prevInstruction) ? prevInstruction.component : null);
            }
            return true;
        });
    }
    /**
     * Defines route lifecycle hook `CanActivate`, which is called by the router to determine
     * if a component can be instantiated as part of a navigation.
     *
     * <aside class="is-right">
     * Note that unlike other lifecycle hooks, this one uses an annotation rather than an interface.
     * This is because the `CanActivate` function is called before the component is instantiated.
     * </aside>
     *
     * The `CanActivate` hook is called with two {@link ComponentInstruction}s as parameters, the first
     * representing the current route being navigated to, and the second parameter representing the
     * previous route or `null`.
     *
     * ```typescript
     * @CanActivate((next, prev) => boolean | Promise<boolean>)
     * ```
     *
     * If `CanActivate` returns or resolves to `false`, the navigation is cancelled.
     * If `CanActivate` throws or rejects, the navigation is also cancelled.
     * If `CanActivate` returns or resolves to `true`, navigation continues, the component is
     * instantiated, and the {@link OnActivate} hook of that component is called if implemented.
     *
     * ### Example
     *
     * {@example router/ts/can_activate/can_activate_example.ts region='canActivate' }
     */
    var CanActivate = makeDecorator(CanActivateAnnotation);
    var __decorate$2 = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata$2 = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
    var __param$2 = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    };
    var _resolveToTrue$1 = PromiseWrapper.resolve(true);
    /**
     * A router outlet is a placeholder that Angular dynamically fills based on the application's route.
     *
     * ## Use
     *
     * ```
     * <router-outlet></router-outlet>
     * ```
     */
    exports.RouterOutlet = (function () {
        function RouterOutlet(_viewContainerRef, _loader, _parentRouter, nameAttr) {
            this._viewContainerRef = _viewContainerRef;
            this._loader = _loader;
            this._parentRouter = _parentRouter;
            this.name = null;
            this._componentRef = null;
            this._currentInstruction = null;
            this.activateEvents = new EventEmitter();
            if (isPresent(nameAttr)) {
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
            var providers = _angular_core.ReflectiveInjector.resolve([
                _angular_core.provide(RouteData, { useValue: nextInstruction.routeData }),
                _angular_core.provide(RouteParams, { useValue: new RouteParams(nextInstruction.params) }),
                _angular_core.provide(exports.Router, { useValue: childRouter })
            ]);
            this._componentRef =
                this._loader.loadNextToLocation(componentType, this._viewContainerRef, providers);
            return this._componentRef.then(function (componentRef) {
                _this.activateEvents.emit(componentRef.instance);
                if (hasLifecycleHook(routerOnActivate, componentType)) {
                    return _this._componentRef.then(function (ref) { return ref.instance.routerOnActivate(nextInstruction, previousInstruction); });
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
            if (isBlank(this._componentRef)) {
                return this.activate(nextInstruction);
            }
            else {
                return PromiseWrapper.resolve(hasLifecycleHook(routerOnReuse, this._currentInstruction.componentType) ?
                    this._componentRef.then(function (ref) { return ref.instance.routerOnReuse(nextInstruction, previousInstruction); }) :
                    true);
            }
        };
        /**
         * Called by the {@link Router} when an outlet disposes of a component's contents.
         * This method in turn is responsible for calling the `routerOnDeactivate` hook of its child.
         */
        RouterOutlet.prototype.deactivate = function (nextInstruction) {
            var _this = this;
            var next = _resolveToTrue$1;
            if (isPresent(this._componentRef) && isPresent(this._currentInstruction) &&
                hasLifecycleHook(routerOnDeactivate, this._currentInstruction.componentType)) {
                next = this._componentRef.then(function (ref) { return ref.instance
                    .routerOnDeactivate(nextInstruction, _this._currentInstruction); });
            }
            return next.then(function (_) {
                if (isPresent(_this._componentRef)) {
                    var onDispose = _this._componentRef.then(function (ref) { return ref.destroy(); });
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
            if (isBlank(this._currentInstruction)) {
                return _resolveToTrue$1;
            }
            if (hasLifecycleHook(routerCanDeactivate, this._currentInstruction.componentType)) {
                return this._componentRef.then(function (ref) { return ref.instance
                    .routerCanDeactivate(nextInstruction, _this._currentInstruction); });
            }
            else {
                return _resolveToTrue$1;
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
            if (isBlank(this._currentInstruction) ||
                this._currentInstruction.componentType != nextInstruction.componentType) {
                result = false;
            }
            else if (hasLifecycleHook(routerCanReuse, this._currentInstruction.componentType)) {
                result = this._componentRef.then(function (ref) { return ref.instance.routerCanReuse(nextInstruction, _this._currentInstruction); });
            }
            else {
                result = nextInstruction == this._currentInstruction ||
                    (isPresent(nextInstruction.params) && isPresent(this._currentInstruction.params) &&
                        StringMapWrapper.equals(nextInstruction.params, this._currentInstruction.params));
            }
            return PromiseWrapper.resolve(result);
        };
        RouterOutlet.prototype.ngOnDestroy = function () { this._parentRouter.unregisterPrimaryOutlet(this); };
        return RouterOutlet;
    }());
    __decorate$2([
        _angular_core.Output('activate'),
        __metadata$2('design:type', Object)
    ], exports.RouterOutlet.prototype, "activateEvents", void 0);
    exports.RouterOutlet = __decorate$2([
        _angular_core.Directive({ selector: 'router-outlet' }),
        __param$2(3, _angular_core.Attribute('name')),
        __metadata$2('design:paramtypes', [_angular_core.ViewContainerRef, _angular_core.DynamicComponentLoader, exports.Router, String])
    ], exports.RouterOutlet);
    var __decorate$3 = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata$3 = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
    /**
     * The RouterLink directive lets you link to specific parts of your app.
     *
     * Consider the following route configuration:

     * ```
     * @RouteConfig([
     *   { path: '/user', component: UserCmp, as: 'User' }
     * ]);
     * class MyComp {}
     * ```
     *
     * When linking to this `User` route, you can write:
     *
     * ```
     * <a [routerLink]="['./User']">link to user component</a>
     * ```
     *
     * RouterLink expects the value to be an array of route names, followed by the params
     * for that level of routing. For instance `['/Team', {teamId: 1}, 'User', {userId: 2}]`
     * means that we want to generate a link for the `Team` route with params `{teamId: 1}`,
     * and with a child route `User` with params `{userId: 2}`.
     *
     * The first route name should be prepended with `/`, `./`, or `../`.
     * If the route begins with `/`, the router will look up the route from the root of the app.
     * If the route begins with `./`, the router will instead look in the current component's
     * children for the route. And if the route begins with `../`, the router will look at the
     * current component's parent.
     */
    exports.RouterLink = (function () {
        function RouterLink(_router, _location) {
            var _this = this;
            this._router = _router;
            this._location = _location;
            // we need to update the link whenever a route changes to account for aux routes
            this._router.subscribe(function (_) { return _this._updateLink(); });
        }
        // because auxiliary links take existing primary and auxiliary routes into account,
        // we need to update the link whenever params or other routes change.
        RouterLink.prototype._updateLink = function () {
            this._navigationInstruction = this._router.generate(this._routeParams);
            var navigationHref = this._navigationInstruction.toLinkUrl();
            this.visibleHref = this._location.prepareExternalUrl(navigationHref);
        };
        Object.defineProperty(RouterLink.prototype, "isRouteActive", {
            get: function () { return this._router.isRouteActive(this._navigationInstruction); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RouterLink.prototype, "routeParams", {
            set: function (changes) {
                this._routeParams = changes;
                this._updateLink();
            },
            enumerable: true,
            configurable: true
        });
        RouterLink.prototype.onClick = function () {
            // If no target, or if target is _self, prevent default browser behavior
            if (!isString(this.target) || this.target == '_self') {
                this._router.navigateByInstruction(this._navigationInstruction);
                return false;
            }
            return true;
        };
        return RouterLink;
    }());
    exports.RouterLink = __decorate$3([
        _angular_core.Directive({
            selector: '[routerLink]',
            inputs: ['routeParams: routerLink', 'target: target'],
            host: {
                '(click)': 'onClick()',
                '[attr.href]': 'visibleHref',
                '[class.router-link-active]': 'isRouteActive'
            }
        }),
        __metadata$3('design:paramtypes', [exports.Router, _angular_common.Location])
    ], exports.RouterLink);
    /**
     * The Platform agnostic ROUTER PROVIDERS
     */
    var ROUTER_PROVIDERS_COMMON = [
        exports.RouteRegistry,
        /* @ts2dart_Provider */ { provide: _angular_common.LocationStrategy, useClass: _angular_common.PathLocationStrategy },
        _angular_common.Location,
        {
            provide: exports.Router,
            useFactory: routerFactory,
            deps: [exports.RouteRegistry, _angular_common.Location, ROUTER_PRIMARY_COMPONENT, _angular_core.ApplicationRef]
        },
        {
            provide: ROUTER_PRIMARY_COMPONENT,
            useFactory: routerPrimaryComponentFactory,
            deps: /*@ts2dart_const*/ ([_angular_core.ApplicationRef])
        }
    ];
    function routerFactory(registry, location, primaryComponent, appRef) {
        var rootRouter = new RootRouter(registry, location, primaryComponent);
        appRef.registerDisposeListener(function () { return rootRouter.dispose(); });
        return rootRouter;
    }
    function routerPrimaryComponentFactory(app) {
        if (app.componentTypes.length == 0) {
            throw new BaseException("Bootstrap at least one component before injecting Router.");
        }
        return app.componentTypes[0];
    }
    /**
     * A list of {@link Provider}s. To use the router, you must add this to your application.
     *
     * ### Example ([live demo](http://plnkr.co/edit/iRUP8B5OUbxCWQ3AcIDm))
     *
     * ```
     * import {Component} from '@angular/core';
     * import {
     *   ROUTER_DIRECTIVES,
     *   ROUTER_PROVIDERS,
     *   RouteConfig
     * } from '@angular/router-deprecated';
     *
     * @Component({directives: [ROUTER_DIRECTIVES]})
     * @RouteConfig([
     *  {...},
     * ])
     * class AppCmp {
     *   // ...
     * }
     *
     * bootstrap(AppCmp, [ROUTER_PROVIDERS]);
     * ```
     */
    var ROUTER_PROVIDERS = [
        ROUTER_PROVIDERS_COMMON,
        /*@ts2dart_const*/ (
        /* @ts2dart_Provider */ { provide: _angular_common.PlatformLocation, useClass: _angular_platformBrowser.BrowserPlatformLocation }),
    ];
    /**
     * Use {@link ROUTER_PROVIDERS} instead.
     *
     * @deprecated
     */
    var ROUTER_BINDINGS = ROUTER_PROVIDERS;
    /**
     * A list of directives. To use the router directives like {@link RouterOutlet} and
     * {@link RouterLink}, add this to your `directives` array in the {@link View} decorator of your
     * component.
     *
     * ### Example ([live demo](http://plnkr.co/edit/iRUP8B5OUbxCWQ3AcIDm))
     *
     * ```
     * import {Component} from '@angular/core';
     * import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig} from '@angular/router-deprecated';
     *
     * @Component({directives: [ROUTER_DIRECTIVES]})
     * @RouteConfig([
     *  {...},
     * ])
     * class AppCmp {
     *    // ...
     * }
     *
     * bootstrap(AppCmp, [ROUTER_PROVIDERS]);
     * ```
     */
    var ROUTER_DIRECTIVES = [exports.RouterOutlet, exports.RouterLink];
    exports.ROUTER_DIRECTIVES = ROUTER_DIRECTIVES;
    exports.RouteParams = RouteParams;
    exports.RouteData = RouteData;
    exports.ROUTER_PRIMARY_COMPONENT = ROUTER_PRIMARY_COMPONENT;
    exports.CanActivate = CanActivate;
    exports.Instruction = Instruction;
    exports.ComponentInstruction = ComponentInstruction;
    exports.OpaqueToken = _angular_core.OpaqueToken;
    exports.ROUTER_PROVIDERS_COMMON = ROUTER_PROVIDERS_COMMON;
    exports.ROUTER_PROVIDERS = ROUTER_PROVIDERS;
    exports.ROUTER_BINDINGS = ROUTER_BINDINGS;
    exports.RouteConfig = RouteConfig;
    exports.Route = Route;
    exports.Redirect = Redirect;
    exports.AuxRoute = AuxRoute;
    exports.AsyncRoute = AsyncRoute;
}));
