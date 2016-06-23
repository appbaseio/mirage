"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var collection_1 = require('./facade/collection');
var lang_1 = require('./facade/lang');
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
        return lang_1.isPresent(n) ? n.children.map(function (t) { return t.value; }) : null;
    };
    Tree.prototype.firstChild = function (t) {
        var n = _findNode(t, this._root);
        return lang_1.isPresent(n) && n.children.length > 0 ? n.children[0].value : null;
    };
    Tree.prototype.pathFromRoot = function (t) { return _findPath(t, this._root, []).map(function (s) { return s.value; }); };
    Tree.prototype.contains = function (tree) { return _contains(this._root, tree._root); };
    return Tree;
}());
exports.Tree = Tree;
var UrlTree = (function (_super) {
    __extends(UrlTree, _super);
    function UrlTree(root) {
        _super.call(this, root);
    }
    return UrlTree;
}(Tree));
exports.UrlTree = UrlTree;
var RouteTree = (function (_super) {
    __extends(RouteTree, _super);
    function RouteTree(root) {
        _super.call(this, root);
    }
    return RouteTree;
}(Tree));
exports.RouteTree = RouteTree;
function rootNode(tree) {
    return tree._root;
}
exports.rootNode = rootNode;
function _findNode(expected, c) {
    // TODO: vsavkin remove it once recognize is fixed
    if (expected instanceof RouteSegment && equalSegments(expected, c.value))
        return c;
    if (expected === c.value)
        return c;
    for (var _i = 0, _a = c.children; _i < _a.length; _i++) {
        var cc = _a[_i];
        var r = _findNode(expected, cc);
        if (lang_1.isPresent(r))
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
        var r = _findPath(expected, cc, collection_1.ListWrapper.clone(collected));
        if (lang_1.isPresent(r))
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
exports.TreeNode = TreeNode;
var UrlSegment = (function () {
    function UrlSegment(segment, parameters, outlet) {
        this.segment = segment;
        this.parameters = parameters;
        this.outlet = outlet;
    }
    UrlSegment.prototype.toString = function () {
        var outletPrefix = lang_1.isBlank(this.outlet) ? "" : this.outlet + ":";
        return "" + outletPrefix + this.segment + _serializeParams(this.parameters);
    };
    return UrlSegment;
}());
exports.UrlSegment = UrlSegment;
function _serializeParams(params) {
    var res = "";
    collection_1.StringMapWrapper.forEach(params, function (v, k) { return res += ";" + k + "=" + v; });
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
        return lang_1.isPresent(this.parameters) ? this.parameters[param] : null;
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
exports.RouteSegment = RouteSegment;
function serializeRouteSegmentTree(tree) {
    return _serializeRouteSegmentTree(tree._root);
}
exports.serializeRouteSegmentTree = serializeRouteSegmentTree;
function _serializeRouteSegmentTree(node) {
    var v = node.value;
    var children = node.children.map(function (c) { return _serializeRouteSegmentTree(c); }).join(", ");
    return v.outlet + ":" + v.stringifiedUrlSegments + "(" + lang_1.stringify(v.type) + ") [" + children + "]";
}
function equalSegments(a, b) {
    if (lang_1.isBlank(a) && !lang_1.isBlank(b))
        return false;
    if (!lang_1.isBlank(a) && lang_1.isBlank(b))
        return false;
    if (a._type !== b._type)
        return false;
    if (a.outlet != b.outlet)
        return false;
    return collection_1.StringMapWrapper.equals(a.parameters, b.parameters);
}
exports.equalSegments = equalSegments;
function equalUrlSegments(a, b) {
    if (lang_1.isBlank(a) && !lang_1.isBlank(b))
        return false;
    if (!lang_1.isBlank(a) && lang_1.isBlank(b))
        return false;
    if (a.segment != b.segment)
        return false;
    if (a.outlet != b.outlet)
        return false;
    if (lang_1.isBlank(a.parameters)) {
        console.log("a", a);
    }
    if (lang_1.isBlank(b.parameters)) {
        console.log("b", b);
    }
    return collection_1.StringMapWrapper.equals(a.parameters, b.parameters);
}
exports.equalUrlSegments = equalUrlSegments;
function routeSegmentComponentFactory(a) {
    return a._componentFactory;
}
exports.routeSegmentComponentFactory = routeSegmentComponentFactory;
//# sourceMappingURL=segments.js.map