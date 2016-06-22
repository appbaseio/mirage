"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('./facade/lang');
var collection_1 = require('./facade/collection');
var async_1 = require('./facade/async');
var collection_2 = require('./facade/collection');
var core_2 = require('@angular/core');
var recognize_1 = require('./recognize');
var link_1 = require('./link');
var segments_1 = require('./segments');
var lifecycle_reflector_1 = require('./lifecycle_reflector');
var constants_1 = require('./constants');
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
exports.RouterOutletMap = RouterOutletMap;
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
        this._changes = new async_1.EventEmitter();
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
    Router.prototype.dispose = function () { async_1.ObservableWrapper.dispose(this._locationSubscription); };
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
        var s = lang_1.isPresent(segment) ? segment : this._prevTree.root;
        return link_1.link(s, this._prevTree, this.urlTree, commands);
    };
    /**
     * Serializes a {@link UrlTree} into a string.
     */
    Router.prototype.serializeUrl = function (url) { return this._urlSerializer.serialize(url); };
    Router.prototype._createInitialTree = function () {
        var root = new segments_1.RouteSegment([new segments_1.UrlSegment("", {}, null)], {}, constants_1.DEFAULT_OUTLET_NAME, this._rootComponentType, null);
        return new segments_1.RouteTree(new segments_1.TreeNode(root, []));
    };
    Router.prototype._setUpLocationChangeListener = function () {
        var _this = this;
        this._locationSubscription = this._location.subscribe(function (change) { _this._navigate(_this._urlSerializer.parse(change['url'])); });
    };
    Router.prototype._navigate = function (url) {
        var _this = this;
        this._urlTree = url;
        return recognize_1.recognize(this._componentResolver, this._rootComponentType, url)
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
exports.Router = Router;
var _LoadSegments = (function () {
    function _LoadSegments(currTree, prevTree) {
        this.currTree = currTree;
        this.prevTree = prevTree;
        this.deactivations = [];
        this.performMutation = true;
    }
    _LoadSegments.prototype.load = function (parentOutletMap, rootComponent) {
        var _this = this;
        var prevRoot = lang_1.isPresent(this.prevTree) ? segments_1.rootNode(this.prevTree) : null;
        var currRoot = segments_1.rootNode(this.currTree);
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
        var allPaths = async_1.PromiseWrapper.all(this.deactivations.map(function (r) { return _this.checkCanDeactivatePath(r); }));
        return allPaths.then(function (values) { return values.filter(function (v) { return v; }).length === values.length; });
    };
    _LoadSegments.prototype.checkCanDeactivatePath = function (path) {
        var _this = this;
        var curr = async_1.PromiseWrapper.resolve(true);
        var _loop_1 = function(p) {
            curr = curr.then(function (_) {
                if (lifecycle_reflector_1.hasLifecycleHook("routerCanDeactivate", p)) {
                    return p.routerCanDeactivate(_this.prevTree, _this.currTree);
                }
                else {
                    return _;
                }
            });
        };
        for (var _i = 0, _a = collection_1.ListWrapper.reversed(path); _i < _a.length; _i++) {
            var p = _a[_i];
            _loop_1(p);
        }
        return curr;
    };
    _LoadSegments.prototype.loadChildSegments = function (currNode, prevNode, outletMap, components) {
        var _this = this;
        var prevChildren = lang_1.isPresent(prevNode) ?
            prevNode.children.reduce(function (m, c) {
                m[c.value.outlet] = c;
                return m;
            }, {}) :
            {};
        currNode.children.forEach(function (c) {
            _this.loadSegments(c, prevChildren[c.value.outlet], outletMap, components);
            collection_2.StringMapWrapper.delete(prevChildren, c.value.outlet);
        });
        collection_2.StringMapWrapper.forEach(prevChildren, function (v, k) { return _this.unloadOutlet(outletMap._outlets[k], components); });
    };
    _LoadSegments.prototype.loadSegments = function (currNode, prevNode, parentOutletMap, components) {
        var curr = currNode.value;
        var prev = lang_1.isPresent(prevNode) ? prevNode.value : null;
        var outlet = this.getOutlet(parentOutletMap, currNode.value);
        if (segments_1.equalSegments(curr, prev)) {
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
        var resolved = core_1.ReflectiveInjector.resolve([core_1.provide(RouterOutletMap, { useValue: outletMap }), core_1.provide(segments_1.RouteSegment, { useValue: curr })]);
        var ref = outlet.load(segments_1.routeSegmentComponentFactory(curr), resolved, outletMap);
        if (lifecycle_reflector_1.hasLifecycleHook("routerOnActivate", ref.instance)) {
            ref.instance.routerOnActivate(curr, prev, this.currTree, this.prevTree);
        }
        return ref.instance;
    };
    _LoadSegments.prototype.getOutlet = function (outletMap, segment) {
        var outlet = outletMap._outlets[segment.outlet];
        if (lang_1.isBlank(outlet)) {
            if (segment.outlet == constants_1.DEFAULT_OUTLET_NAME) {
                throw new core_2.BaseException("Cannot find default outlet");
            }
            else {
                throw new core_2.BaseException("Cannot find the outlet " + segment.outlet);
            }
        }
        return outlet;
    };
    _LoadSegments.prototype.unloadOutlet = function (outlet, components) {
        var _this = this;
        if (lang_1.isPresent(outlet) && outlet.isLoaded) {
            collection_2.StringMapWrapper.forEach(outlet.outletMap._outlets, function (v, k) { return _this.unloadOutlet(v, components); });
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
//# sourceMappingURL=router.js.map