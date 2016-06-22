"use strict";
var segments_1 = require('./segments');
var lang_1 = require('./facade/lang');
var exceptions_1 = require('./facade/exceptions');
var collection_1 = require('./facade/collection');
// TODO: vsavkin: should reuse segments
function link(segment, routeTree, urlTree, commands) {
    if (commands.length === 0)
        return urlTree;
    var normalizedCommands = _normalizeCommands(commands);
    if (_navigateToRoot(normalizedCommands)) {
        return new segments_1.UrlTree(new segments_1.TreeNode(urlTree.root, []));
    }
    var startingNode = _findStartingNode(normalizedCommands, urlTree, segment, routeTree);
    var updated = normalizedCommands.commands.length > 0 ?
        _updateMany(collection_1.ListWrapper.clone(startingNode.children), normalizedCommands.commands) : [];
    var newRoot = _constructNewTree(segments_1.rootNode(urlTree), startingNode, updated);
    return new segments_1.UrlTree(newRoot);
}
exports.link = link;
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
    if (lang_1.isString(commands[0]) && commands.length === 1 && commands[0] == "/") {
        return new _NormalizedNavigationCommands(true, 0, commands);
    }
    var numberOfDoubleDots = 0;
    var isAbsolute = false;
    var res = [];
    for (var i = 0; i < commands.length; ++i) {
        var c = commands[i];
        if (!lang_1.isString(c)) {
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
    var urlSegment = collection_1.ListWrapper.last(s.urlSegments);
    var path = urlTree.pathFromRoot(urlSegment);
    if (path.length <= numberOfDoubleDots) {
        throw new exceptions_1.BaseException("Invalid number of '../'");
    }
    return path[path.length - 1 - numberOfDoubleDots];
}
function _findStartingNode(normalizedChange, urlTree, segment, routeTree) {
    if (normalizedChange.isAbsolute) {
        return segments_1.rootNode(urlTree);
    }
    else {
        var urlSegment = _findUrlSegment(segment, routeTree, urlTree, normalizedChange.numberOfDoubleDots);
        return _findMatchingNode(urlSegment, segments_1.rootNode(urlTree));
    }
}
function _findMatchingNode(segment, node) {
    if (node.value === segment)
        return node;
    for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
        var c = _a[_i];
        var r = _findMatchingNode(segment, c);
        if (lang_1.isPresent(r))
            return r;
    }
    return null;
}
function _constructNewTree(node, original, updated) {
    if (node === original) {
        return new segments_1.TreeNode(node.value, updated);
    }
    else {
        return new segments_1.TreeNode(node.value, node.children.map(function (c) { return _constructNewTree(c, original, updated); }));
    }
}
function _update(node, commands) {
    var rest = commands.slice(1);
    var next = rest.length === 0 ? null : rest[0];
    var outlet = _outlet(commands);
    var segment = _segment(commands);
    // reach the end of the tree => create new tree nodes.
    if (lang_1.isBlank(node) && !lang_1.isStringMap(next)) {
        var urlSegment = new segments_1.UrlSegment(segment, {}, outlet);
        var children = rest.length === 0 ? [] : [_update(null, rest)];
        return new segments_1.TreeNode(urlSegment, children);
    }
    else if (lang_1.isBlank(node) && lang_1.isStringMap(next)) {
        var urlSegment = new segments_1.UrlSegment(segment, next, outlet);
        return _recurse(urlSegment, node, rest.slice(1));
    }
    else if (outlet != node.value.outlet) {
        return node;
    }
    else if (lang_1.isStringMap(segment)) {
        var newSegment = new segments_1.UrlSegment(node.value.segment, segment, node.value.outlet);
        return _recurse(newSegment, node, rest);
    }
    else if (lang_1.isStringMap(next)) {
        var urlSegment = new segments_1.UrlSegment(segment, next, outlet);
        return _recurse(urlSegment, node, rest.slice(1));
    }
    else {
        var urlSegment = new segments_1.UrlSegment(segment, {}, outlet);
        return _recurse(urlSegment, node, rest);
    }
}
function _recurse(urlSegment, node, rest) {
    if (rest.length === 0) {
        return new segments_1.TreeNode(urlSegment, []);
    }
    return new segments_1.TreeNode(urlSegment, _updateMany(collection_1.ListWrapper.clone(node.children), rest));
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
    if (!lang_1.isString(commands[0]))
        return commands[0];
    var parts = commands[0].toString().split(":");
    return parts.length > 1 ? parts[1] : commands[0];
}
function _outlet(commands) {
    if (!lang_1.isString(commands[0]))
        return null;
    var parts = commands[0].toString().split(":");
    return parts.length > 1 ? parts[0] : null;
}
//# sourceMappingURL=link.js.map