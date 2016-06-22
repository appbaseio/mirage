import { TreeNode, UrlSegment, rootNode, UrlTree } from './segments';
import { isBlank, isPresent, isString, isStringMap } from './facade/lang';
import { BaseException } from './facade/exceptions';
import { ListWrapper } from './facade/collection';
// TODO: vsavkin: should reuse segments
export function link(segment, routeTree, urlTree, commands) {
    if (commands.length === 0)
        return urlTree;
    let normalizedCommands = _normalizeCommands(commands);
    if (_navigateToRoot(normalizedCommands)) {
        return new UrlTree(new TreeNode(urlTree.root, []));
    }
    let startingNode = _findStartingNode(normalizedCommands, urlTree, segment, routeTree);
    let updated = normalizedCommands.commands.length > 0 ?
        _updateMany(ListWrapper.clone(startingNode.children), normalizedCommands.commands) : [];
    let newRoot = _constructNewTree(rootNode(urlTree), startingNode, updated);
    return new UrlTree(newRoot);
}
function _navigateToRoot(normalizedChange) {
    return normalizedChange.isAbsolute && normalizedChange.commands.length === 1 && normalizedChange.commands[0] == "/";
}
class _NormalizedNavigationCommands {
    constructor(isAbsolute, numberOfDoubleDots, commands) {
        this.isAbsolute = isAbsolute;
        this.numberOfDoubleDots = numberOfDoubleDots;
        this.commands = commands;
    }
}
function _normalizeCommands(commands) {
    ;
    '';
    if (isString(commands[0]) && commands.length === 1 && commands[0] == "/") {
        return new _NormalizedNavigationCommands(true, 0, commands);
    }
    let numberOfDoubleDots = 0;
    let isAbsolute = false;
    let res = [];
    for (let i = 0; i < commands.length; ++i) {
        let c = commands[i];
        if (!isString(c)) {
            res.push(c);
            continue;
        }
        let parts = c.split('/');
        for (let j = 0; j < parts.length; ++j) {
            let cc = parts[j];
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
    let s = segment;
    while (s.urlSegments.length === 0) {
        s = routeTree.parent(s);
    }
    let urlSegment = ListWrapper.last(s.urlSegments);
    let path = urlTree.pathFromRoot(urlSegment);
    if (path.length <= numberOfDoubleDots) {
        throw new BaseException("Invalid number of '../'");
    }
    return path[path.length - 1 - numberOfDoubleDots];
}
function _findStartingNode(normalizedChange, urlTree, segment, routeTree) {
    if (normalizedChange.isAbsolute) {
        return rootNode(urlTree);
    }
    else {
        let urlSegment = _findUrlSegment(segment, routeTree, urlTree, normalizedChange.numberOfDoubleDots);
        return _findMatchingNode(urlSegment, rootNode(urlTree));
    }
}
function _findMatchingNode(segment, node) {
    if (node.value === segment)
        return node;
    for (var c of node.children) {
        let r = _findMatchingNode(segment, c);
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
        return new TreeNode(node.value, node.children.map(c => _constructNewTree(c, original, updated)));
    }
}
function _update(node, commands) {
    let rest = commands.slice(1);
    let next = rest.length === 0 ? null : rest[0];
    let outlet = _outlet(commands);
    let segment = _segment(commands);
    // reach the end of the tree => create new tree nodes.
    if (isBlank(node) && !isStringMap(next)) {
        let urlSegment = new UrlSegment(segment, {}, outlet);
        let children = rest.length === 0 ? [] : [_update(null, rest)];
        return new TreeNode(urlSegment, children);
    }
    else if (isBlank(node) && isStringMap(next)) {
        let urlSegment = new UrlSegment(segment, next, outlet);
        return _recurse(urlSegment, node, rest.slice(1));
    }
    else if (outlet != node.value.outlet) {
        return node;
    }
    else if (isStringMap(segment)) {
        let newSegment = new UrlSegment(node.value.segment, segment, node.value.outlet);
        return _recurse(newSegment, node, rest);
    }
    else if (isStringMap(next)) {
        let urlSegment = new UrlSegment(segment, next, outlet);
        return _recurse(urlSegment, node, rest.slice(1));
    }
    else {
        let urlSegment = new UrlSegment(segment, {}, outlet);
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
    let outlet = _outlet(commands);
    let nodesInRightOutlet = nodes.filter(c => c.value.outlet == outlet);
    if (nodesInRightOutlet.length > 0) {
        let nodeRightOutlet = nodesInRightOutlet[0]; // there can be only one
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
    let parts = commands[0].toString().split(":");
    return parts.length > 1 ? parts[1] : commands[0];
}
function _outlet(commands) {
    if (!isString(commands[0]))
        return null;
    let parts = commands[0].toString().split(":");
    return parts.length > 1 ? parts[0] : null;
}
//# sourceMappingURL=link.js.map