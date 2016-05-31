"use strict";
var segments_1 = require('./segments');
var metadata_1 = require('./metadata/metadata');
var lang_1 = require('./facade/lang');
var collection_1 = require('./facade/collection');
var promise_1 = require('./facade/promise');
var core_1 = require('@angular/core');
var constants_1 = require('./constants');
var core_2 = require('@angular/core');
// TODO: vsavkin: recognize should take the old tree and merge it
function recognize(componentResolver, type, url) {
    var matched = new _MatchResult(type, [url.root], {}, segments_1.rootNode(url).children, []);
    return _constructSegment(componentResolver, matched).then(function (roots) { return new segments_1.RouteTree(roots[0]); });
}
exports.recognize = recognize;
function _recognize(componentResolver, parentType, url) {
    var metadata = _readMetadata(parentType); // should read from the factory instead
    if (lang_1.isBlank(metadata)) {
        throw new core_1.BaseException("Component '" + lang_1.stringify(parentType) + "' does not have route configuration");
    }
    var match;
    try {
        match = _match(metadata, url);
    }
    catch (e) {
        return promise_1.PromiseWrapper.reject(e, null);
    }
    var main = _constructSegment(componentResolver, match);
    var aux = _recognizeMany(componentResolver, parentType, match.aux).then(_checkOutletNameUniqueness);
    return promise_1.PromiseWrapper.all([main, aux]).then(collection_1.ListWrapper.flatten);
}
function _recognizeMany(componentResolver, parentType, urls) {
    var recognized = urls.map(function (u) { return _recognize(componentResolver, parentType, u); });
    return promise_1.PromiseWrapper.all(recognized).then(collection_1.ListWrapper.flatten);
}
function _constructSegment(componentResolver, matched) {
    return componentResolver.resolveComponent(matched.component)
        .then(function (factory) {
        var urlOutlet = matched.consumedUrlSegments.length === 0 ||
            lang_1.isBlank(matched.consumedUrlSegments[0].outlet) ?
            constants_1.DEFAULT_OUTLET_NAME :
            matched.consumedUrlSegments[0].outlet;
        var segment = new segments_1.RouteSegment(matched.consumedUrlSegments, matched.parameters, urlOutlet, matched.component, factory);
        if (matched.leftOverUrl.length > 0) {
            return _recognizeMany(componentResolver, matched.component, matched.leftOverUrl)
                .then(function (children) { return [new segments_1.TreeNode(segment, children)]; });
        }
        else {
            return _recognizeLeftOvers(componentResolver, matched.component)
                .then(function (children) { return [new segments_1.TreeNode(segment, children)]; });
        }
    });
}
function _recognizeLeftOvers(componentResolver, parentType) {
    return componentResolver.resolveComponent(parentType)
        .then(function (factory) {
        var metadata = _readMetadata(parentType);
        if (lang_1.isBlank(metadata)) {
            return [];
        }
        var r = metadata.routes.filter(function (r) { return r.path == "" || r.path == "/"; });
        if (r.length === 0) {
            return promise_1.PromiseWrapper.resolve([]);
        }
        else {
            return _recognizeLeftOvers(componentResolver, r[0].component)
                .then(function (children) {
                return componentResolver.resolveComponent(r[0].component)
                    .then(function (factory) {
                    var segment = new segments_1.RouteSegment([], {}, constants_1.DEFAULT_OUTLET_NAME, r[0].component, factory);
                    return [new segments_1.TreeNode(segment, children)];
                });
            });
        }
    });
}
function _match(metadata, url) {
    for (var _i = 0, _a = metadata.routes; _i < _a.length; _i++) {
        var r = _a[_i];
        var matchingResult = _matchWithParts(r, url);
        if (lang_1.isPresent(matchingResult)) {
            return matchingResult;
        }
    }
    var availableRoutes = metadata.routes.map(function (r) { return ("'" + r.path + "'"); }).join(", ");
    throw new core_1.BaseException("Cannot match any routes. Current segment: '" + url.value + "'. Available routes: [" + availableRoutes + "].");
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
        if (lang_1.isBlank(current))
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
        current = collection_1.ListWrapper.first(current.children);
    }
    var p = lastSegment.value.parameters;
    var parameters = collection_1.StringMapWrapper.merge(p, positionalParams);
    var axuUrlSubtrees = lang_1.isPresent(lastParent) ? lastParent.children.slice(1) : [];
    return new _MatchResult(route.component, consumedUrlSegments, parameters, lastSegment.children, axuUrlSubtrees);
}
function _checkOutletNameUniqueness(nodes) {
    var names = {};
    nodes.forEach(function (n) {
        var segmentWithSameOutletName = names[n.value.outlet];
        if (lang_1.isPresent(segmentWithSameOutletName)) {
            var p = segmentWithSameOutletName.stringifiedUrlSegments;
            var c = n.value.stringifiedUrlSegments;
            throw new core_1.BaseException("Two segments cannot have the same outlet name: '" + p + "' and '" + c + "'.");
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
    var metadata = core_2.reflector.annotations(componentType).filter(function (f) { return f instanceof metadata_1.RoutesMetadata; });
    return collection_1.ListWrapper.first(metadata);
}
//# sourceMappingURL=recognize.js.map