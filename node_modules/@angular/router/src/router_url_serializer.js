"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var segments_1 = require('./segments');
var core_1 = require('@angular/core');
var lang_1 = require('./facade/lang');
/**
 * Defines a way to serialize/deserialize a url tree.
 */
var RouterUrlSerializer = (function () {
    function RouterUrlSerializer() {
    }
    return RouterUrlSerializer;
}());
exports.RouterUrlSerializer = RouterUrlSerializer;
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
        return new segments_1.UrlTree(root);
    };
    DefaultRouterUrlSerializer.prototype.serialize = function (tree) { return _serializeUrlTreeNode(segments_1.rootNode(tree)); };
    return DefaultRouterUrlSerializer;
}(RouterUrlSerializer));
exports.DefaultRouterUrlSerializer = DefaultRouterUrlSerializer;
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
var SEGMENT_RE = lang_1.RegExpWrapper.create('^[^\\/\\(\\)\\?;=&#]+');
function matchUrlSegment(str) {
    var match = lang_1.RegExpWrapper.firstMatch(SEGMENT_RE, str);
    return lang_1.isPresent(match) ? match[0] : '';
}
var QUERY_PARAM_VALUE_RE = lang_1.RegExpWrapper.create('^[^\\(\\)\\?;&#]+');
function matchUrlQueryParamValue(str) {
    var match = lang_1.RegExpWrapper.firstMatch(QUERY_PARAM_VALUE_RE, str);
    return lang_1.isPresent(match) ? match[0] : '';
}
var _UrlParser = (function () {
    function _UrlParser() {
    }
    _UrlParser.prototype.peekStartsWith = function (str) { return this._remaining.startsWith(str); };
    _UrlParser.prototype.capture = function (str) {
        if (!this._remaining.startsWith(str)) {
            throw new core_1.BaseException("Expected \"" + str + "\".");
        }
        this._remaining = this._remaining.substring(str.length);
    };
    _UrlParser.prototype.parse = function (url) {
        this._remaining = url;
        if (url == '' || url == '/') {
            return new segments_1.TreeNode(new segments_1.UrlSegment('', {}, null), []);
        }
        else {
            return this.parseRoot();
        }
    };
    _UrlParser.prototype.parseRoot = function () {
        var segments = this.parseSegments();
        return new segments_1.TreeNode(new segments_1.UrlSegment('', {}, null), segments);
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
        var segment = new segments_1.UrlSegment(path, matrixParams, outletName);
        var node = new segments_1.TreeNode(segment, children);
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
        if (lang_1.isBlank(key)) {
            return;
        }
        this.capture(key);
        var value = "true";
        if (this.peekStartsWith('=')) {
            this.capture('=');
            var valueMatch = matchUrlSegment(this._remaining);
            if (lang_1.isPresent(valueMatch)) {
                value = valueMatch;
                this.capture(value);
            }
        }
        params[key] = value;
    };
    _UrlParser.prototype.parseQueryParam = function (params) {
        var key = matchUrlSegment(this._remaining);
        if (lang_1.isBlank(key)) {
            return;
        }
        this.capture(key);
        var value = "true";
        if (this.peekStartsWith('=')) {
            this.capture('=');
            var valueMatch = matchUrlQueryParamValue(this._remaining);
            if (lang_1.isPresent(valueMatch)) {
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
//# sourceMappingURL=router_url_serializer.js.map