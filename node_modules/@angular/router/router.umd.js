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
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Subject'), require('rxjs/observable/PromiseObservable'), require('rxjs/operator/toPromise'), require('rxjs/Observable'), require('@angular/common'), require('@angular/platform-browser')) :
        typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Subject', 'rxjs/observable/PromiseObservable', 'rxjs/operator/toPromise', 'rxjs/Observable', '@angular/common', '@angular/platform-browser'], factory) :
            (factory((global.ng = global.ng || {}, global.ng.router = global.ng.router || {}), global.ng.core, global.Rx, global.Rx, global.Rx.Observable.prototype, global.Rx, global.ng.common, global.ng.platformBrowser));
}(this, function (exports, _angular_core, rxjs_Subject, rxjs_observable_PromiseObservable, rxjs_operator_toPromise, rxjs_Observable, _angular_common, _angular_platformBrowser) {
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
    var Type = Function;
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
    function isStringMap(obj) {
        return typeof obj === 'object' && obj !== null;
    }
    function isArray(obj) {
        return Array.isArray(obj);
    }
    function noop() { }
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
    var Tree = (function () {
        function Tree(root) {
            this._root = root;
        }
        Object.defineProperty(Tree.prototype, "root", {
            get: function () { return this._root.value; },
            enumerable: true,
            configurable: true
        });
        Tree.prototype.parent = function (t) {
            var p = this.pathFromRoot(t);
            return p.length > 1 ? p[p.length - 2] : null;
        };
        Tree.prototype.children = function (t) {
            var n = _findNode(t, this._root);
            return isPresent(n) ? n.children.map(function (t) { return t.value; }) : null;
        };
        Tree.prototype.firstChild = function (t) {
            var n = _findNode(t, this._root);
            return isPresent(n) && n.children.length > 0 ? n.children[0].value : null;
        };
        Tree.prototype.pathFromRoot = function (t) { return _findPath(t, this._root, []).map(function (s) { return s.value; }); };
        Tree.prototype.contains = function (tree) { return _contains(this._root, tree._root); };
        return Tree;
    }());
    var UrlTree = (function (_super) {
        __extends(UrlTree, _super);
        function UrlTree(root) {
            _super.call(this, root);
        }
        return UrlTree;
    }(Tree));
    var RouteTree = (function (_super) {
        __extends(RouteTree, _super);
        function RouteTree(root) {
            _super.call(this, root);
        }
        return RouteTree;
    }(Tree));
    function rootNode(tree) {
        return tree._root;
    }
    function _findNode(expected, c) {
        // TODO: vsavkin remove it once recognize is fixed
        if (expected instanceof RouteSegment && equalSegments(expected, c.value))
            return c;
        if (expected === c.value)
            return c;
        for (var _i = 0, _a = c.children; _i < _a.length; _i++) {
            var cc = _a[_i];
            var r = _findNode(expected, cc);
            if (isPresent(r))
                return r;
        }
        return null;
    }
    function _findPath(expected, c, collected) {
        collected.push(c);
        // TODO: vsavkin remove it once recognize is fixed
        if (_equalValues(expected, c.value))
            return collected;
        for (var _i = 0, _a = c.children; _i < _a.length; _i++) {
            var cc = _a[_i];
            var r = _findPath(expected, cc, ListWrapper.clone(collected));
            if (isPresent(r))
                return r;
        }
        return null;
    }
    function _contains(tree, subtree) {
        if (!_equalValues(tree.value, subtree.value))
            return false;
        var _loop_1 = function(subtreeNode) {
            var s = tree.children.filter(function (child) { return _equalValues(child.value, subtreeNode.value); });
            if (s.length === 0)
                return { value: false };
            if (!_contains(s[0], subtreeNode))
                return { value: false };
        };
        for (var _i = 0, _a = subtree.children; _i < _a.length; _i++) {
            var subtreeNode = _a[_i];
            var state_1 = _loop_1(subtreeNode);
            if (typeof state_1 === "object") return state_1.value;
        }
        return true;
    }
    function _equalValues(a, b) {
        if (a instanceof RouteSegment)
            return equalSegments(a, b);
        if (a instanceof UrlSegment)
            return equalUrlSegments(a, b);
        return a === b;
    }
    var TreeNode = (function () {
        function TreeNode(value, children) {
            this.value = value;
            this.children = children;
        }
        return TreeNode;
    }());
    var UrlSegment = (function () {
        function UrlSegment(segment, parameters, outlet) {
            this.segment = segment;
            this.parameters = parameters;
            this.outlet = outlet;
        }
        UrlSegment.prototype.toString = function () {
            var outletPrefix = isBlank(this.outlet) ? "" : this.outlet + ":";
            return "" + outletPrefix + this.segment + _serializeParams(this.parameters);
        };
        return UrlSegment;
    }());
    function _serializeParams(params) {
        var res = "";
        StringMapWrapper.forEach(params, function (v, k) { return res += ";" + k + "=" + v; });
        return res;
    }
    var RouteSegment = (function () {
        function RouteSegment(urlSegments, parameters, outlet, type, componentFactory) {
            this.urlSegments = urlSegments;
            this.parameters = parameters;
            this.outlet = outlet;
            this._type = type;
            this._componentFactory = componentFactory;
        }
        RouteSegment.prototype.getParam = function (param) {
            return isPresent(this.parameters) ? this.parameters[param] : null;
        };
        Object.defineProperty(RouteSegment.prototype, "type", {
            get: function () { return this._type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RouteSegment.prototype, "stringifiedUrlSegments", {
            get: function () { return this.urlSegments.map(function (s) { return s.toString(); }).join("/"); },
            enumerable: true,
            configurable: true
        });
        return RouteSegment;
    }());
    function equalSegments(a, b) {
        if (isBlank(a) && !isBlank(b))
            return false;
        if (!isBlank(a) && isBlank(b))
            return false;
        if (a._type !== b._type)
            return false;
        if (a.outlet != b.outlet)
            return false;
        return StringMapWrapper.equals(a.parameters, b.parameters);
    }
    function equalUrlSegments(a, b) {
        if (isBlank(a) && !isBlank(b))
            return false;
        if (!isBlank(a) && isBlank(b))
            return false;
        if (a.segment != b.segment)
            return false;
        if (a.outlet != b.outlet)
            return false;
        if (isBlank(a.parameters)) {
            console.log("a", a);
        }
        if (isBlank(b.parameters)) {
            console.log("b", b);
        }
        return StringMapWrapper.equals(a.parameters, b.parameters);
    }
    function routeSegmentComponentFactory(a) {
        return a._componentFactory;
    }
    /**
     * See {@link RouteMetadata} for more information.
     * @ts2dart_const
     */
    var Route = (function () {
        function Route(_a) {
            var _b = _a === void 0 ? {} : _a, path = _b.path, component = _b.component;
            this.path = path;
            this.component = component;
        }
        Route.prototype.toString = function () { return "@Route(" + this.path + ", " + stringify(this.component) + ")"; };
        return Route;
    }());
    /**
     * Defines routes for a given component.
     *
     * It takes an array of {@link RouteMetadata}s.
     * @ts2dart_const
     */
    var RoutesMetadata = (function () {
        function RoutesMetadata(routes) {
            this.routes = routes;
        }
        RoutesMetadata.prototype.toString = function () { return "@Routes(" + this.routes + ")"; };
        return RoutesMetadata;
    }());
    /**
    * Name of the default outlet outlet.
    * @type {string}
    */
    var DEFAULT_OUTLET_NAME = "__DEFAULT";
    // TODO: vsavkin: recognize should take the old tree and merge it
    function recognize(componentResolver, type, url) {
        var matched = new _MatchResult(type, [url.root], {}, rootNode(url).children, []);
        return _constructSegment(componentResolver, matched).then(function (roots) { return new RouteTree(roots[0]); });
    }
    function _recognize(componentResolver, parentType, url) {
        var metadata = _readMetadata(parentType); // should read from the factory instead
        if (isBlank(metadata)) {
            throw new _angular_core.BaseException("Component '" + stringify(parentType) + "' does not have route configuration");
        }
        var match;
        try {
            match = _match(metadata, url);
        }
        catch (e) {
            return PromiseWrapper.reject(e, null);
        }
        var main = _constructSegment(componentResolver, match);
        var aux = _recognizeMany(componentResolver, parentType, match.aux).then(_checkOutletNameUniqueness);
        return PromiseWrapper.all([main, aux]).then(ListWrapper.flatten);
    }
    function _recognizeMany(componentResolver, parentType, urls) {
        var recognized = urls.map(function (u) { return _recognize(componentResolver, parentType, u); });
        return PromiseWrapper.all(recognized).then(ListWrapper.flatten);
    }
    function _constructSegment(componentResolver, matched) {
        return componentResolver.resolveComponent(matched.component)
            .then(function (factory) {
            var urlOutlet = matched.consumedUrlSegments.length === 0 ||
                isBlank(matched.consumedUrlSegments[0].outlet) ?
                DEFAULT_OUTLET_NAME :
                matched.consumedUrlSegments[0].outlet;
            var segment = new RouteSegment(matched.consumedUrlSegments, matched.parameters, urlOutlet, matched.component, factory);
            if (matched.leftOverUrl.length > 0) {
                return _recognizeMany(componentResolver, matched.component, matched.leftOverUrl)
                    .then(function (children) { return [new TreeNode(segment, children)]; });
            }
            else {
                return _recognizeLeftOvers(componentResolver, matched.component)
                    .then(function (children) { return [new TreeNode(segment, children)]; });
            }
        });
    }
    function _recognizeLeftOvers(componentResolver, parentType) {
        return componentResolver.resolveComponent(parentType)
            .then(function (factory) {
            var metadata = _readMetadata(parentType);
            if (isBlank(metadata)) {
                return [];
            }
            var r = metadata.routes.filter(function (r) { return r.path == "" || r.path == "/"; });
            if (r.length === 0) {
                return PromiseWrapper.resolve([]);
            }
            else {
                return _recognizeLeftOvers(componentResolver, r[0].component)
                    .then(function (children) {
                    return componentResolver.resolveComponent(r[0].component)
                        .then(function (factory) {
                        var segment = new RouteSegment([], {}, DEFAULT_OUTLET_NAME, r[0].component, factory);
                        return [new TreeNode(segment, children)];
                    });
                });
            }
        });
    }
    function _match(metadata, url) {
        for (var _i = 0, _a = metadata.routes; _i < _a.length; _i++) {
            var r = _a[_i];
            var matchingResult = _matchWithParts(r, url);
            if (isPresent(matchingResult)) {
                return matchingResult;
            }
        }
        var availableRoutes = metadata.routes.map(function (r) { return ("'" + r.path + "'"); }).join(", ");
        throw new _angular_core.BaseException("Cannot match any routes. Current segment: '" + url.value + "'. Available routes: [" + availableRoutes + "].");
    }
    function _matchWithParts(route, url) {
        var path = route.path.startsWith("/") ? route.path.substring(1) : route.path;
        if (path == "*") {
            return new _MatchResult(route.component, [], null, [], []);
        }
        var parts = path.split("/");
        var positionalParams = {};
        var consumedUrlSegments = [];
        var lastParent = null;
        var lastSegment = null;
        var current = url;
        for (var i = 0; i < parts.length; ++i) {
            if (isBlank(current))
                return null;
            var p_1 = parts[i];
            var isLastSegment = i === parts.length - 1;
            var isLastParent = i === parts.length - 2;
            var isPosParam = p_1.startsWith(":");
            if (!isPosParam && p_1 != current.value.segment)
                return null;
            if (isLastSegment) {
                lastSegment = current;
            }
            if (isLastParent) {
                lastParent = current;
            }
            if (isPosParam) {
                positionalParams[p_1.substring(1)] = current.value.segment;
            }
            consumedUrlSegments.push(current.value);
            current = ListWrapper.first(current.children);
        }
        var p = lastSegment.value.parameters;
        var parameters = StringMapWrapper.merge(p, positionalParams);
        var axuUrlSubtrees = isPresent(lastParent) ? lastParent.children.slice(1) : [];
        return new _MatchResult(route.component, consumedUrlSegments, parameters, lastSegment.children, axuUrlSubtrees);
    }
    function _checkOutletNameUniqueness(nodes) {
        var names = {};
        nodes.forEach(function (n) {
            var segmentWithSameOutletName = names[n.value.outlet];
            if (isPresent(segmentWithSameOutletName)) {
                var p = segmentWithSameOutletName.stringifiedUrlSegments;
                var c = n.value.stringifiedUrlSegments;
                throw new _angular_core.BaseException("Two segments cannot have the same outlet name: '" + p + "' and '" + c + "'.");
            }
            names[n.value.outlet] = n.value;
        });
        return nodes;
    }
    var _MatchResult = (function () {
        function _MatchResult(component, consumedUrlSegments, parameters, leftOverUrl, aux) {
            this.component = component;
            this.consumedUrlSegments = consumedUrlSegments;
            this.parameters = parameters;
            this.leftOverUrl = leftOverUrl;
            this.aux = aux;
        }
        return _MatchResult;
    }());
    function _readMetadata(componentType) {
        var metadata = _angular_core.reflector.annotations(componentType).filter(function (f) { return f instanceof RoutesMetadata; });
        return ListWrapper.first(metadata);
    }
    var BaseException$1 = (function (_super) {
        __extends(BaseException$1, _super);
        function BaseException$1(message) {
            if (message === void 0) { message = "--"; }
            _super.call(this, message);
            this.message = message;
            this.stack = (new Error(message)).stack;
        }
        BaseException$1.prototype.toString = function () { return this.message; };
        return BaseException$1;
    }(Error));
    // TODO: vsavkin: should reuse segments
    function link(segment, routeTree, urlTree, commands) {
        if (commands.length === 0)
            return urlTree;
        var normalizedCommands = _normalizeCommands(commands);
        if (_navigateToRoot(normalizedCommands)) {
            return new UrlTree(new TreeNode(urlTree.root, []));
        }
        var startingNode = _findStartingNode(normalizedCommands, urlTree, segment, routeTree);
        var updated = normalizedCommands.commands.length > 0 ?
            _updateMany(ListWrapper.clone(startingNode.children), normalizedCommands.commands) : [];
        var newRoot = _constructNewTree(rootNode(urlTree), startingNode, updated);
        return new UrlTree(newRoot);
    }
    function _navigateToRoot(normalizedChange) {
        return normalizedChange.isAbsolute && normalizedChange.commands.length === 1 && normalizedChange.commands[0] == "/";
    }
    var _NormalizedNavigationCommands = (function () {
        function _NormalizedNavigationCommands(isAbsolute, numberOfDoubleDots, commands) {
            this.isAbsolute = isAbsolute;
            this.numberOfDoubleDots = numberOfDoubleDots;
            this.commands = commands;
        }
        return _NormalizedNavigationCommands;
    }());
    function _normalizeCommands(commands) {
        ;
        '';
        if (isString(commands[0]) && commands.length === 1 && commands[0] == "/") {
            return new _NormalizedNavigationCommands(true, 0, commands);
        }
        var numberOfDoubleDots = 0;
        var isAbsolute = false;
        var res = [];
        for (var i = 0; i < commands.length; ++i) {
            var c = commands[i];
            if (!isString(c)) {
                res.push(c);
                continue;
            }
            var parts = c.split('/');
            for (var j = 0; j < parts.length; ++j) {
                var cc = parts[j];
                // first exp is treated in a special way
                if (i == 0) {
                    if (j == 0 && cc == ".") {
                    }
                    else if (j == 0 && cc == "") {
                        isAbsolute = true;
                    }
                    else if (cc == "..") {
                        numberOfDoubleDots++;
                    }
                    else if (cc != '') {
                        res.push(cc);
                    }
                }
                else {
                    if (cc != '') {
                        res.push(cc);
                    }
                }
            }
        }
        return new _NormalizedNavigationCommands(isAbsolute, numberOfDoubleDots, res);
    }
    function _findUrlSegment(segment, routeTree, urlTree, numberOfDoubleDots) {
        var s = segment;
        while (s.urlSegments.length === 0) {
            s = routeTree.parent(s);
        }
        var urlSegment = ListWrapper.last(s.urlSegments);
        var path = urlTree.pathFromRoot(urlSegment);
        if (path.length <= numberOfDoubleDots) {
            throw new BaseException$1("Invalid number of '../'");
        }
        return path[path.length - 1 - numberOfDoubleDots];
    }
    function _findStartingNode(normalizedChange, urlTree, segment, routeTree) {
        if (normalizedChange.isAbsolute) {
            return rootNode(urlTree);
        }
        else {
            var urlSegment = _findUrlSegment(segment, routeTree, urlTree, normalizedChange.numberOfDoubleDots);
            return _findMatchingNode(urlSegment, rootNode(urlTree));
        }
    }
    function _findMatchingNode(segment, node) {
        if (node.value === segment)
            return node;
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var c = _a[_i];
            var r = _findMatchingNode(segment, c);
            if (isPresent(r))
                return r;
        }
        return null;
    }
    function _constructNewTree(node, original, updated) {
        if (node === original) {
            return new TreeNode(node.value, updated);
        }
        else {
            return new TreeNode(node.value, node.children.map(function (c) { return _constructNewTree(c, original, updated); }));
        }
    }
    function _update(node, commands) {
        var rest = commands.slice(1);
        var next = rest.length === 0 ? null : rest[0];
        var outlet = _outlet(commands);
        var segment = _segment(commands);
        // reach the end of the tree => create new tree nodes.
        if (isBlank(node) && !isStringMap(next)) {
            var urlSegment = new UrlSegment(segment, {}, outlet);
            var children = rest.length === 0 ? [] : [_update(null, rest)];
            return new TreeNode(urlSegment, children);
        }
        else if (isBlank(node) && isStringMap(next)) {
            var urlSegment = new UrlSegment(segment, next, outlet);
            return _recurse(urlSegment, node, rest.slice(1));
        }
        else if (outlet != node.value.outlet) {
            return node;
        }
        else if (isStringMap(segment)) {
            var newSegment = new UrlSegment(node.value.segment, segment, node.value.outlet);
            return _recurse(newSegment, node, rest);
        }
        else if (isStringMap(next)) {
            var urlSegment = new UrlSegment(segment, next, outlet);
            return _recurse(urlSegment, node, rest.slice(1));
        }
        else {
            var urlSegment = new UrlSegment(segment, {}, outlet);
            return _recurse(urlSegment, node, rest);
        }
    }
    function _recurse(urlSegment, node, rest) {
        if (rest.length === 0) {
            return new TreeNode(urlSegment, []);
        }
        return new TreeNode(urlSegment, _updateMany(ListWrapper.clone(node.children), rest));
    }
    function _updateMany(nodes, commands) {
        var outlet = _outlet(commands);
        var nodesInRightOutlet = nodes.filter(function (c) { return c.value.outlet == outlet; });
        if (nodesInRightOutlet.length > 0) {
            var nodeRightOutlet = nodesInRightOutlet[0]; // there can be only one
            nodes[nodes.indexOf(nodeRightOutlet)] = _update(nodeRightOutlet, commands);
        }
        else {
            nodes.push(_update(null, commands));
        }
        return nodes;
    }
    function _segment(commands) {
        if (!isString(commands[0]))
            return commands[0];
        var parts = commands[0].toString().split(":");
        return parts.length > 1 ? parts[1] : commands[0];
    }
    function _outlet(commands) {
        if (!isString(commands[0]))
            return null;
        var parts = commands[0].toString().split(":");
        return parts.length > 1 ? parts[0] : null;
    }
    function hasLifecycleHook(name, obj) {
        if (isBlank(obj))
            return false;
        var type = obj.constructor;
        if (!(type instanceof Type))
            return false;
        return name in type.prototype;
    }
    /**
     * @internal
     */
    var RouterOutletMap = (function () {
        function RouterOutletMap() {
            /** @internal */
            this._outlets = {};
        }
        RouterOutletMap.prototype.registerOutlet = function (name, outlet) { this._outlets[name] = outlet; };
        return RouterOutletMap;
    }());
    /**
     * The `Router` is responsible for mapping URLs to components.
     *
     * You can see the state of the router by inspecting the read-only fields `router.urlTree`
     * and `router.routeTree`.
     */
    var Router = (function () {
        /**
         * @internal
         */
        function Router(_rootComponent, _rootComponentType, _componentResolver, _urlSerializer, _routerOutletMap, _location) {
            this._rootComponent = _rootComponent;
            this._rootComponentType = _rootComponentType;
            this._componentResolver = _componentResolver;
            this._urlSerializer = _urlSerializer;
            this._routerOutletMap = _routerOutletMap;
            this._location = _location;
            this._changes = new EventEmitter();
            this._prevTree = this._createInitialTree();
            this._setUpLocationChangeListener();
            this.navigateByUrl(this._location.path());
        }
        Object.defineProperty(Router.prototype, "urlTree", {
            /**
             * Returns the current url tree.
             */
            get: function () { return this._urlTree; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "routeTree", {
            /**
             * Returns the current route tree.
             */
            get: function () { return this._prevTree; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "changes", {
            /**
             * An observable or url changes from the router.
             */
            get: function () { return this._changes; },
            enumerable: true,
            configurable: true
        });
        /**
         * Navigate based on the provided url. This navigation is always absolute.
         *
         * ### Usage
         *
         * ```
         * router.navigateByUrl("/team/33/user/11");
         * ```
         */
        Router.prototype.navigateByUrl = function (url) {
            return this._navigate(this._urlSerializer.parse(url));
        };
        /**
         * Navigate based on the provided array of commands and a starting point.
         * If no segment is provided, the navigation is absolute.
         *
         * ### Usage
         *
         * ```
         * router.navigate(['team', 33, 'team', '11], segment);
         * ```
         */
        Router.prototype.navigate = function (commands, segment) {
            return this._navigate(this.createUrlTree(commands, segment));
        };
        /**
         * @internal
         */
        Router.prototype.dispose = function () { ObservableWrapper.dispose(this._locationSubscription); };
        /**
         * Applies an array of commands to the current url tree and creates
         * a new url tree.
         *
         * When given a segment, applies the given commands starting from the segment.
         * When not given a segment, applies the given command starting from the root.
         *
         * ### Usage
         *
         * ```
         * // create /team/33/user/11
         * router.createUrlTree(['/team', 33, 'user', 11]);
         *
         * // create /team/33;expand=true/user/11
         * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
         *
         * // you can collapse static fragments like this
         * router.createUrlTree(['/team/33/user', userId]);
         *
         * // assuming the current url is `/team/33/user/11` and the segment points to `user/11`
         *
         * // navigate to /team/33/user/11/details
         * router.createUrlTree(['details'], segment);
         *
         * // navigate to /team/33/user/22
         * router.createUrlTree(['../22'], segment);
         *
         * // navigate to /team/44/user/22
         * router.createUrlTree(['../../team/44/user/22'], segment);
         * ```
         */
        Router.prototype.createUrlTree = function (commands, segment) {
            var s = isPresent(segment) ? segment : this._prevTree.root;
            return link(s, this._prevTree, this.urlTree, commands);
        };
        /**
         * Serializes a {@link UrlTree} into a string.
         */
        Router.prototype.serializeUrl = function (url) { return this._urlSerializer.serialize(url); };
        Router.prototype._createInitialTree = function () {
            var root = new RouteSegment([new UrlSegment("", {}, null)], {}, DEFAULT_OUTLET_NAME, this._rootComponentType, null);
            return new RouteTree(new TreeNode(root, []));
        };
        Router.prototype._setUpLocationChangeListener = function () {
            var _this = this;
            this._locationSubscription = this._location.subscribe(function (change) { _this._navigate(_this._urlSerializer.parse(change['url'])); });
        };
        Router.prototype._navigate = function (url) {
            var _this = this;
            this._urlTree = url;
            return recognize(this._componentResolver, this._rootComponentType, url)
                .then(function (currTree) {
                return new _LoadSegments(currTree, _this._prevTree)
                    .load(_this._routerOutletMap, _this._rootComponent)
                    .then(function (updated) {
                    if (updated) {
                        _this._prevTree = currTree;
                        _this._location.go(_this._urlSerializer.serialize(_this._urlTree));
                        _this._changes.emit(null);
                    }
                });
            });
        };
        return Router;
    }());
    var _LoadSegments = (function () {
        function _LoadSegments(currTree, prevTree) {
            this.currTree = currTree;
            this.prevTree = prevTree;
            this.deactivations = [];
            this.performMutation = true;
        }
        _LoadSegments.prototype.load = function (parentOutletMap, rootComponent) {
            var _this = this;
            var prevRoot = isPresent(this.prevTree) ? rootNode(this.prevTree) : null;
            var currRoot = rootNode(this.currTree);
            return this.canDeactivate(currRoot, prevRoot, parentOutletMap, rootComponent)
                .then(function (res) {
                _this.performMutation = true;
                if (res) {
                    _this.loadChildSegments(currRoot, prevRoot, parentOutletMap, [rootComponent]);
                }
                return res;
            });
        };
        _LoadSegments.prototype.canDeactivate = function (currRoot, prevRoot, outletMap, rootComponent) {
            var _this = this;
            this.performMutation = false;
            this.loadChildSegments(currRoot, prevRoot, outletMap, [rootComponent]);
            var allPaths = PromiseWrapper.all(this.deactivations.map(function (r) { return _this.checkCanDeactivatePath(r); }));
            return allPaths.then(function (values) { return values.filter(function (v) { return v; }).length === values.length; });
        };
        _LoadSegments.prototype.checkCanDeactivatePath = function (path) {
            var _this = this;
            var curr = PromiseWrapper.resolve(true);
            var _loop_2 = function(p) {
                curr = curr.then(function (_) {
                    if (hasLifecycleHook("routerCanDeactivate", p)) {
                        return p.routerCanDeactivate(_this.prevTree, _this.currTree);
                    }
                    else {
                        return _;
                    }
                });
            };
            for (var _i = 0, _a = ListWrapper.reversed(path); _i < _a.length; _i++) {
                var p = _a[_i];
                _loop_2(p);
            }
            return curr;
        };
        _LoadSegments.prototype.loadChildSegments = function (currNode, prevNode, outletMap, components) {
            var _this = this;
            var prevChildren = isPresent(prevNode) ?
                prevNode.children.reduce(function (m, c) {
                    m[c.value.outlet] = c;
                    return m;
                }, {}) :
                {};
            currNode.children.forEach(function (c) {
                _this.loadSegments(c, prevChildren[c.value.outlet], outletMap, components);
                StringMapWrapper.delete(prevChildren, c.value.outlet);
            });
            StringMapWrapper.forEach(prevChildren, function (v, k) { return _this.unloadOutlet(outletMap._outlets[k], components); });
        };
        _LoadSegments.prototype.loadSegments = function (currNode, prevNode, parentOutletMap, components) {
            var curr = currNode.value;
            var prev = isPresent(prevNode) ? prevNode.value : null;
            var outlet = this.getOutlet(parentOutletMap, currNode.value);
            if (equalSegments(curr, prev)) {
                this.loadChildSegments(currNode, prevNode, outlet.outletMap, components.concat([outlet.loadedComponent]));
            }
            else {
                this.unloadOutlet(outlet, components);
                if (this.performMutation) {
                    var outletMap = new RouterOutletMap();
                    var loadedComponent = this.loadNewSegment(outletMap, curr, prev, outlet);
                    this.loadChildSegments(currNode, prevNode, outletMap, components.concat([loadedComponent]));
                }
            }
        };
        _LoadSegments.prototype.loadNewSegment = function (outletMap, curr, prev, outlet) {
            var resolved = _angular_core.ReflectiveInjector.resolve([_angular_core.provide(RouterOutletMap, { useValue: outletMap }), _angular_core.provide(RouteSegment, { useValue: curr })]);
            var ref = outlet.load(routeSegmentComponentFactory(curr), resolved, outletMap);
            if (hasLifecycleHook("routerOnActivate", ref.instance)) {
                ref.instance.routerOnActivate(curr, prev, this.currTree, this.prevTree);
            }
            return ref.instance;
        };
        _LoadSegments.prototype.getOutlet = function (outletMap, segment) {
            var outlet = outletMap._outlets[segment.outlet];
            if (isBlank(outlet)) {
                if (segment.outlet == DEFAULT_OUTLET_NAME) {
                    throw new _angular_core.BaseException("Cannot find default outlet");
                }
                else {
                    throw new _angular_core.BaseException("Cannot find the outlet " + segment.outlet);
                }
            }
            return outlet;
        };
        _LoadSegments.prototype.unloadOutlet = function (outlet, components) {
            var _this = this;
            if (isPresent(outlet) && outlet.isLoaded) {
                StringMapWrapper.forEach(outlet.outletMap._outlets, function (v, k) { return _this.unloadOutlet(v, components); });
                if (this.performMutation) {
                    outlet.unload();
                }
                else {
                    this.deactivations.push(components.concat([outlet.loadedComponent]));
                }
            }
        };
        return _LoadSegments;
    }());
    var makeDecorator = _angular_core.__core_private__.makeDecorator;
    /**
     * Defines routes for a given component.
     *
     * It takes an array of {@link RouteMetadata}s.
     */
    var Routes = makeDecorator(RoutesMetadata);
    /**
     * Defines a way to serialize/deserialize a url tree.
     */
    var RouterUrlSerializer = (function () {
        function RouterUrlSerializer() {
        }
        return RouterUrlSerializer;
    }());
    /**
     * A default implementation of the serialization.
     */
    var DefaultRouterUrlSerializer = (function (_super) {
        __extends(DefaultRouterUrlSerializer, _super);
        function DefaultRouterUrlSerializer() {
            _super.apply(this, arguments);
        }
        DefaultRouterUrlSerializer.prototype.parse = function (url) {
            var root = new _UrlParser().parse(url);
            return new UrlTree(root);
        };
        DefaultRouterUrlSerializer.prototype.serialize = function (tree) { return _serializeUrlTreeNode(rootNode(tree)); };
        return DefaultRouterUrlSerializer;
    }(RouterUrlSerializer));
    function _serializeUrlTreeNode(node) {
        return "" + node.value + _serializeChildren(node);
    }
    function _serializeUrlTreeNodes(nodes) {
        var main = nodes[0].value.toString();
        var auxNodes = nodes.slice(1);
        var aux = auxNodes.length > 0 ? "(" + auxNodes.map(_serializeUrlTreeNode).join("//") + ")" : "";
        var children = _serializeChildren(nodes[0]);
        return "" + main + aux + children;
    }
    function _serializeChildren(node) {
        if (node.children.length > 0) {
            return "/" + _serializeUrlTreeNodes(node.children);
        }
        else {
            return "";
        }
    }
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
    var _UrlParser = (function () {
        function _UrlParser() {
        }
        _UrlParser.prototype.peekStartsWith = function (str) { return this._remaining.startsWith(str); };
        _UrlParser.prototype.capture = function (str) {
            if (!this._remaining.startsWith(str)) {
                throw new _angular_core.BaseException("Expected \"" + str + "\".");
            }
            this._remaining = this._remaining.substring(str.length);
        };
        _UrlParser.prototype.parse = function (url) {
            this._remaining = url;
            if (url == '' || url == '/') {
                return new TreeNode(new UrlSegment('', {}, null), []);
            }
            else {
                return this.parseRoot();
            }
        };
        _UrlParser.prototype.parseRoot = function () {
            var segments = this.parseSegments();
            return new TreeNode(new UrlSegment('', {}, null), segments);
        };
        _UrlParser.prototype.parseSegments = function (outletName) {
            if (outletName === void 0) { outletName = null; }
            if (this._remaining.length == 0) {
                return [];
            }
            if (this.peekStartsWith('/')) {
                this.capture('/');
            }
            var path = matchUrlSegment(this._remaining);
            this.capture(path);
            if (path.indexOf(":") > -1) {
                var parts = path.split(":");
                outletName = parts[0];
                path = parts[1];
            }
            var matrixParams = {};
            if (this.peekStartsWith(';')) {
                matrixParams = this.parseMatrixParams();
            }
            var aux = [];
            if (this.peekStartsWith('(')) {
                aux = this.parseAuxiliaryRoutes();
            }
            var children = [];
            if (this.peekStartsWith('/') && !this.peekStartsWith('//')) {
                this.capture('/');
                children = this.parseSegments();
            }
            var segment = new UrlSegment(path, matrixParams, outletName);
            var node = new TreeNode(segment, children);
            return [node].concat(aux);
        };
        _UrlParser.prototype.parseQueryParams = function () {
            var params = {};
            this.capture('?');
            this.parseQueryParam(params);
            while (this._remaining.length > 0 && this.peekStartsWith('&')) {
                this.capture('&');
                this.parseQueryParam(params);
            }
            return params;
        };
        _UrlParser.prototype.parseMatrixParams = function () {
            var params = {};
            while (this._remaining.length > 0 && this.peekStartsWith(';')) {
                this.capture(';');
                this.parseParam(params);
            }
            return params;
        };
        _UrlParser.prototype.parseParam = function (params) {
            var key = matchUrlSegment(this._remaining);
            if (isBlank(key)) {
                return;
            }
            this.capture(key);
            var value = "true";
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
        _UrlParser.prototype.parseQueryParam = function (params) {
            var key = matchUrlSegment(this._remaining);
            if (isBlank(key)) {
                return;
            }
            this.capture(key);
            var value = "true";
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
        _UrlParser.prototype.parseAuxiliaryRoutes = function () {
            var segments = [];
            this.capture('(');
            while (!this.peekStartsWith(')') && this._remaining.length > 0) {
                segments = segments.concat(this.parseSegments("aux"));
                if (this.peekStartsWith('//')) {
                    this.capture('//');
                }
            }
            this.capture(')');
            return segments;
        };
        return _UrlParser;
    }());
    /**
     * The Platform agnostic ROUTER PROVIDERS
     */
    var ROUTER_PROVIDERS_COMMON = [
        RouterOutletMap,
        /*@ts2dart_Provider*/ { provide: RouterUrlSerializer, useClass: DefaultRouterUrlSerializer },
        /*@ts2dart_Provider*/ { provide: _angular_common.LocationStrategy, useClass: _angular_common.PathLocationStrategy }, _angular_common.Location,
        /*@ts2dart_Provider*/ {
            provide: Router,
            useFactory: routerFactory,
            deps: /*@ts2dart_const*/ [_angular_core.ApplicationRef, _angular_core.ComponentResolver, RouterUrlSerializer, RouterOutletMap, _angular_common.Location],
        },
    ];
    function routerFactory(app, componentResolver, urlSerializer, routerOutletMap, location) {
        if (app.componentTypes.length == 0) {
            throw new _angular_core.BaseException("Bootstrap at least one component before injecting Router.");
        }
        // TODO: vsavkin this should not be null
        var router = new Router(null, app.componentTypes[0], componentResolver, urlSerializer, routerOutletMap, location);
        app.registerDisposeListener(function () { return router.dispose(); });
        return router;
    }
    /**
     * A list of {@link Provider}s. To use the router, you must add this to your application.
     *
     * ```
     * import {Component} from '@angular/core';
     * import {
     *   ROUTER_DIRECTIVES,
     *   ROUTER_PROVIDERS,
     *   Routes
     * } from '@angular/router';
     *
     * @Component({directives: [ROUTER_DIRECTIVES]})
     * @Routes([
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
        /*@ts2dart_Provider*/ { provide: _angular_common.PlatformLocation, useClass: _angular_platformBrowser.BrowserPlatformLocation },
    ];
    var RouterOutlet = (function () {
        function RouterOutlet(parentOutletMap, _location, name) {
            this._location = _location;
            parentOutletMap.registerOutlet(isBlank(name) ? DEFAULT_OUTLET_NAME : name, this);
        }
        RouterOutlet.prototype.unload = function () {
            this._loaded.destroy();
            this._loaded = null;
        };
        Object.defineProperty(RouterOutlet.prototype, "loadedComponent", {
            /**
             * Returns the loaded component.
             */
            get: function () { return isPresent(this._loaded) ? this._loaded.instance : null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RouterOutlet.prototype, "isLoaded", {
            /**
             * Returns true is the outlet is not empty.
             */
            get: function () { return isPresent(this._loaded); },
            enumerable: true,
            configurable: true
        });
        /**
         * Called by the Router to instantiate a new component.
         */
        RouterOutlet.prototype.load = function (factory, providers, outletMap) {
            this.outletMap = outletMap;
            var inj = _angular_core.ReflectiveInjector.fromResolvedProviders(providers, this._location.parentInjector);
            this._loaded = this._location.createComponent(factory, this._location.length, inj, []);
            return this._loaded;
        };
        return RouterOutlet;
    }());
    RouterOutlet.decorators = [
        { type: _angular_core.Directive, args: [{ selector: 'router-outlet' },] },
    ];
    RouterOutlet.ctorParameters = [
        { type: RouterOutletMap, },
        { type: _angular_core.ViewContainerRef, },
        { type: undefined, decorators: [{ type: _angular_core.Attribute, args: ['name',] },] },
    ];
    var RouterLink = (function () {
        function RouterLink(_routeSegment, _router) {
            var _this = this;
            this._routeSegment = _routeSegment;
            this._router = _router;
            this._commands = [];
            this.isActive = false;
            // because auxiliary links take existing primary and auxiliary routes into account,
            // we need to update the link whenever params or other routes change.
            this._subscription =
                ObservableWrapper.subscribe(_router.changes, function (_) { _this._updateTargetUrlAndHref(); });
        }
        RouterLink.prototype.ngOnDestroy = function () { ObservableWrapper.dispose(this._subscription); };
        Object.defineProperty(RouterLink.prototype, "routerLink", {
            set: function (data) {
                if (isArray(data)) {
                    this._commands = data;
                }
                else {
                    this._commands = [data];
                }
                this._updateTargetUrlAndHref();
            },
            enumerable: true,
            configurable: true
        });
        RouterLink.prototype.onClick = function () {
            // If no target, or if target is _self, prevent default browser behavior
            if (!isString(this.target) || this.target == '_self') {
                this._router.navigate(this._commands, this._routeSegment);
                return false;
            }
            return true;
        };
        RouterLink.prototype._updateTargetUrlAndHref = function () {
            var tree = this._router.createUrlTree(this._commands, this._routeSegment);
            if (isPresent(tree)) {
                this.href = this._router.serializeUrl(tree);
                this.isActive = this._router.urlTree.contains(tree);
            }
            else {
                this.isActive = false;
            }
        };
        return RouterLink;
    }());
    RouterLink.decorators = [
        { type: _angular_core.Directive, args: [{ selector: '[routerLink]' },] },
    ];
    RouterLink.ctorParameters = [
        { type: RouteSegment, decorators: [{ type: _angular_core.Optional },] },
        { type: Router, },
    ];
    RouterLink.propDecorators = {
        'target': [{ type: _angular_core.Input },],
        'href': [{ type: _angular_core.HostBinding },],
        'isActive': [{ type: _angular_core.HostBinding, args: ['class.router-link-active',] },],
        'routerLink': [{ type: _angular_core.Input },],
        'onClick': [{ type: _angular_core.HostListener, args: ["click",] },],
    };
    /**
     * A list of directives. To use the router directives like {@link RouterOutlet} and
     * {@link RouterLink}, add this to your `directives` array in the {@link View} decorator of your
     * component.
     *
     * ```
     * import {Component} from '@angular/core';
     * import {ROUTER_DIRECTIVES, Routes} from '@angular/router-deprecated';
     *
     * @Component({directives: [ROUTER_DIRECTIVES]})
     * @RouteConfig([
     *  {...},
     * ])
     * class AppCmp {
     *    // ...
     * }
     *
     * bootstrap(AppCmp);
     * ```
     */
    var ROUTER_DIRECTIVES = [RouterOutlet, RouterLink];
    exports.ROUTER_DIRECTIVES = ROUTER_DIRECTIVES;
    exports.Router = Router;
    exports.RouterOutletMap = RouterOutletMap;
    exports.RouteSegment = RouteSegment;
    exports.UrlSegment = UrlSegment;
    exports.Tree = Tree;
    exports.UrlTree = UrlTree;
    exports.RouteTree = RouteTree;
    exports.Routes = Routes;
    exports.Route = Route;
    exports.RouterUrlSerializer = RouterUrlSerializer;
    exports.DefaultRouterUrlSerializer = DefaultRouterUrlSerializer;
    exports.ROUTER_PROVIDERS = ROUTER_PROVIDERS;
}));
