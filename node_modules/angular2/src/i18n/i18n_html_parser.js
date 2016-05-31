'use strict';"use strict";
var html_parser_1 = require('angular2/src/compiler/html_parser');
var html_ast_1 = require('angular2/src/compiler/html_ast');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var message_1 = require('./message');
var shared_1 = require('./shared');
var _I18N_ATTR = "i18n";
var _PLACEHOLDER_ELEMENT = "ph";
var _NAME_ATTR = "name";
var _I18N_ATTR_PREFIX = "i18n-";
var _PLACEHOLDER_EXPANDED_REGEXP = lang_1.RegExpWrapper.create("\\<ph(\\s)+name=(\"(\\d)+\")\\>\\<\\/ph\\>");
/**
 * Creates an i18n-ed version of the parsed template.
 *
 * Algorithm:
 *
 * To understand the algorithm, you need to know how partitioning works.
 * Partitioning is required as we can use two i18n comments to group node siblings together.
 * That is why we cannot just use nodes.
 *
 * Partitioning transforms an array of HtmlAst into an array of Part.
 * A part can optionally contain a root element or a root text node. And it can also contain
 * children.
 * A part can contain i18n property, in which case it needs to be transalted.
 *
 * Example:
 *
 * The following array of nodes will be split into four parts:
 *
 * ```
 * <a>A</a>
 * <b i18n>B</b>
 * <!-- i18n -->
 * <c>C</c>
 * D
 * <!-- /i18n -->
 * E
 * ```
 *
 * Part 1 containing the a tag. It should not be translated.
 * Part 2 containing the b tag. It should be translated.
 * Part 3 containing the c tag and the D text node. It should be translated.
 * Part 4 containing the E text node. It should not be translated.
 *
 *
 * It is also important to understand how we stringify nodes to create a message.
 *
 * We walk the tree and replace every element node with a placeholder. We also replace
 * all expressions in interpolation with placeholders. We also insert a placeholder element
 * to wrap a text node containing interpolation.
 *
 * Example:
 *
 * The following tree:
 *
 * ```
 * <a>A{{I}}</a><b>B</b>
 * ```
 *
 * will be stringified into:
 * ```
 * <ph name="e0"><ph name="t1">A<ph name="0"/></ph></ph><ph name="e2">B</ph>
 * ```
 *
 * This is what the algorithm does:
 *
 * 1. Use the provided html parser to get the html AST of the template.
 * 2. Partition the root nodes, and process each part separately.
 * 3. If a part does not have the i18n attribute, recurse to process children and attributes.
 * 4. If a part has the i18n attribute, merge the translated i18n part with the original tree.
 *
 * This is how the merging works:
 *
 * 1. Use the stringify function to get the message id. Look up the message in the map.
 * 2. Get the translated message. At this point we have two trees: the original tree
 * and the translated tree, where all the elements are replaced with placeholders.
 * 3. Use the original tree to create a mapping Index:number -> HtmlAst.
 * 4. Walk the translated tree.
 * 5. If we encounter a placeholder element, get is name property.
 * 6. Get the type and the index of the node using the name property.
 * 7. If the type is 'e', which means element, then:
 *     - translate the attributes of the original element
 *     - recurse to merge the children
 *     - create a new element using the original element name, original position,
 *     and translated children and attributes
 * 8. If the type if 't', which means text, then:
 *     - get the list of expressions from the original node.
 *     - get the string version of the interpolation subtree
 *     - find all the placeholders in the translated message, and replace them with the
 *     corresponding original expressions
 */
var I18nHtmlParser = (function () {
    function I18nHtmlParser(_htmlParser, _parser, _messagesContent, _messages) {
        this._htmlParser = _htmlParser;
        this._parser = _parser;
        this._messagesContent = _messagesContent;
        this._messages = _messages;
    }
    I18nHtmlParser.prototype.parse = function (sourceContent, sourceUrl) {
        this.errors = [];
        var res = this._htmlParser.parse(sourceContent, sourceUrl);
        if (res.errors.length > 0) {
            return res;
        }
        else {
            var nodes = this._recurse(res.rootNodes);
            return this.errors.length > 0 ? new html_parser_1.HtmlParseTreeResult([], this.errors) :
                new html_parser_1.HtmlParseTreeResult(nodes, []);
        }
    };
    I18nHtmlParser.prototype._processI18nPart = function (p) {
        try {
            return p.hasI18n ? this._mergeI18Part(p) : this._recurseIntoI18nPart(p);
        }
        catch (e) {
            if (e instanceof shared_1.I18nError) {
                this.errors.push(e);
                return [];
            }
            else {
                throw e;
            }
        }
    };
    I18nHtmlParser.prototype._mergeI18Part = function (p) {
        var messageId = message_1.id(p.createMessage(this._parser));
        if (!collection_1.StringMapWrapper.contains(this._messages, messageId)) {
            throw new shared_1.I18nError(p.sourceSpan, "Cannot find message for id '" + messageId + "'");
        }
        var parsedMessage = this._messages[messageId];
        return this._mergeTrees(p, parsedMessage, p.children);
    };
    I18nHtmlParser.prototype._recurseIntoI18nPart = function (p) {
        // we found an element without an i18n attribute
        // we need to recurse in cause its children may have i18n set
        // we also need to translate its attributes
        if (lang_1.isPresent(p.rootElement)) {
            var root = p.rootElement;
            var children = this._recurse(p.children);
            var attrs = this._i18nAttributes(root);
            return [
                new html_ast_1.HtmlElementAst(root.name, attrs, children, root.sourceSpan, root.startSourceSpan, root.endSourceSpan)
            ];
        }
        else if (lang_1.isPresent(p.rootTextNode)) {
            return [p.rootTextNode];
        }
        else {
            return this._recurse(p.children);
        }
    };
    I18nHtmlParser.prototype._recurse = function (nodes) {
        var _this = this;
        var ps = shared_1.partition(nodes, this.errors);
        return collection_1.ListWrapper.flatten(ps.map(function (p) { return _this._processI18nPart(p); }));
    };
    I18nHtmlParser.prototype._mergeTrees = function (p, translated, original) {
        var l = new _CreateNodeMapping();
        html_ast_1.htmlVisitAll(l, original);
        // merge the translated tree with the original tree.
        // we do it by preserving the source code position of the original tree
        var merged = this._mergeTreesHelper(translated, l.mapping);
        // if the root element is present, we need to create a new root element with its attributes
        // translated
        if (lang_1.isPresent(p.rootElement)) {
            var root = p.rootElement;
            var attrs = this._i18nAttributes(root);
            return [
                new html_ast_1.HtmlElementAst(root.name, attrs, merged, root.sourceSpan, root.startSourceSpan, root.endSourceSpan)
            ];
        }
        else if (lang_1.isPresent(p.rootTextNode)) {
            throw new exceptions_1.BaseException("should not be reached");
        }
        else {
            return merged;
        }
    };
    I18nHtmlParser.prototype._mergeTreesHelper = function (translated, mapping) {
        var _this = this;
        return translated.map(function (t) {
            if (t instanceof html_ast_1.HtmlElementAst) {
                return _this._mergeElementOrInterpolation(t, translated, mapping);
            }
            else if (t instanceof html_ast_1.HtmlTextAst) {
                return t;
            }
            else {
                throw new exceptions_1.BaseException("should not be reached");
            }
        });
    };
    I18nHtmlParser.prototype._mergeElementOrInterpolation = function (t, translated, mapping) {
        var name = this._getName(t);
        var type = name[0];
        var index = lang_1.NumberWrapper.parseInt(name.substring(1), 10);
        var originalNode = mapping[index];
        if (type == "t") {
            return this._mergeTextInterpolation(t, originalNode);
        }
        else if (type == "e") {
            return this._mergeElement(t, originalNode, mapping);
        }
        else {
            throw new exceptions_1.BaseException("should not be reached");
        }
    };
    I18nHtmlParser.prototype._getName = function (t) {
        if (t.name != _PLACEHOLDER_ELEMENT) {
            throw new shared_1.I18nError(t.sourceSpan, "Unexpected tag \"" + t.name + "\". Only \"" + _PLACEHOLDER_ELEMENT + "\" tags are allowed.");
        }
        var names = t.attrs.filter(function (a) { return a.name == _NAME_ATTR; });
        if (names.length == 0) {
            throw new shared_1.I18nError(t.sourceSpan, "Missing \"" + _NAME_ATTR + "\" attribute.");
        }
        return names[0].value;
    };
    I18nHtmlParser.prototype._mergeTextInterpolation = function (t, originalNode) {
        var split = this._parser.splitInterpolation(originalNode.value, originalNode.sourceSpan.toString());
        var exps = lang_1.isPresent(split) ? split.expressions : [];
        var messageSubstring = this._messagesContent.substring(t.startSourceSpan.end.offset, t.endSourceSpan.start.offset);
        var translated = this._replacePlaceholdersWithExpressions(messageSubstring, exps, originalNode.sourceSpan);
        return new html_ast_1.HtmlTextAst(translated, originalNode.sourceSpan);
    };
    I18nHtmlParser.prototype._mergeElement = function (t, originalNode, mapping) {
        var children = this._mergeTreesHelper(t.children, mapping);
        return new html_ast_1.HtmlElementAst(originalNode.name, this._i18nAttributes(originalNode), children, originalNode.sourceSpan, originalNode.startSourceSpan, originalNode.endSourceSpan);
    };
    I18nHtmlParser.prototype._i18nAttributes = function (el) {
        var _this = this;
        var res = [];
        el.attrs.forEach(function (attr) {
            if (attr.name.startsWith(shared_1.I18N_ATTR_PREFIX) || attr.name == shared_1.I18N_ATTR)
                return;
            var i18ns = el.attrs.filter(function (a) { return a.name == "i18n-" + attr.name; });
            if (i18ns.length == 0) {
                res.push(attr);
                return;
            }
            var i18n = i18ns[0];
            var messageId = message_1.id(shared_1.messageFromAttribute(_this._parser, el, i18n));
            if (collection_1.StringMapWrapper.contains(_this._messages, messageId)) {
                var updatedMessage = _this._replaceInterpolationInAttr(attr, _this._messages[messageId]);
                res.push(new html_ast_1.HtmlAttrAst(attr.name, updatedMessage, attr.sourceSpan));
            }
            else {
                throw new shared_1.I18nError(attr.sourceSpan, "Cannot find message for id '" + messageId + "'");
            }
        });
        return res;
    };
    I18nHtmlParser.prototype._replaceInterpolationInAttr = function (attr, msg) {
        var split = this._parser.splitInterpolation(attr.value, attr.sourceSpan.toString());
        var exps = lang_1.isPresent(split) ? split.expressions : [];
        var first = msg[0];
        var last = msg[msg.length - 1];
        var start = first.sourceSpan.start.offset;
        var end = last instanceof html_ast_1.HtmlElementAst ? last.endSourceSpan.end.offset : last.sourceSpan.end.offset;
        var messageSubstring = this._messagesContent.substring(start, end);
        return this._replacePlaceholdersWithExpressions(messageSubstring, exps, attr.sourceSpan);
    };
    ;
    I18nHtmlParser.prototype._replacePlaceholdersWithExpressions = function (message, exps, sourceSpan) {
        var _this = this;
        return lang_1.RegExpWrapper.replaceAll(_PLACEHOLDER_EXPANDED_REGEXP, message, function (match) {
            var nameWithQuotes = match[2];
            var name = nameWithQuotes.substring(1, nameWithQuotes.length - 1);
            var index = lang_1.NumberWrapper.parseInt(name, 10);
            return _this._convertIntoExpression(index, exps, sourceSpan);
        });
    };
    I18nHtmlParser.prototype._convertIntoExpression = function (index, exps, sourceSpan) {
        if (index >= 0 && index < exps.length) {
            return "{{" + exps[index] + "}}";
        }
        else {
            throw new shared_1.I18nError(sourceSpan, "Invalid interpolation index '" + index + "'");
        }
    };
    return I18nHtmlParser;
}());
exports.I18nHtmlParser = I18nHtmlParser;
var _CreateNodeMapping = (function () {
    function _CreateNodeMapping() {
        this.mapping = [];
    }
    _CreateNodeMapping.prototype.visitElement = function (ast, context) {
        this.mapping.push(ast);
        html_ast_1.htmlVisitAll(this, ast.children);
        return null;
    };
    _CreateNodeMapping.prototype.visitAttr = function (ast, context) { return null; };
    _CreateNodeMapping.prototype.visitText = function (ast, context) {
        this.mapping.push(ast);
        return null;
    };
    _CreateNodeMapping.prototype.visitComment = function (ast, context) { return ""; };
    return _CreateNodeMapping;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9odG1sX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9pMThuL2kxOG5faHRtbF9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRCQUE4QyxtQ0FBbUMsQ0FBQyxDQUFBO0FBRWxGLHlCQVFPLGdDQUFnQyxDQUFDLENBQUE7QUFDeEMsMkJBQTRDLGdDQUFnQyxDQUFDLENBQUE7QUFDN0UscUJBQXNELDBCQUEwQixDQUFDLENBQUE7QUFDakYsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFFN0Qsd0JBQTBCLFdBQVcsQ0FBQyxDQUFBO0FBQ3RDLHVCQVNPLFVBQVUsQ0FBQyxDQUFBO0FBRWxCLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUMxQixJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUNsQyxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUM7QUFDMUIsSUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUM7QUFDbEMsSUFBSSw0QkFBNEIsR0FBRyxvQkFBYSxDQUFDLE1BQU0sQ0FBQyw0Q0FBMEMsQ0FBQyxDQUFDO0FBRXBHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBK0VHO0FBQ0g7SUFHRSx3QkFBb0IsV0FBdUIsRUFBVSxPQUFlLEVBQ2hELGdCQUF3QixFQUFVLFNBQXFDO1FBRHZFLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNoRCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVE7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUE0QjtJQUFHLENBQUM7SUFFL0YsOEJBQUssR0FBTCxVQUFNLGFBQXFCLEVBQUUsU0FBaUI7UUFDNUMsSUFBSSxDQUFDLE1BQU0s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O0lBZ0IxQixDQUFDO0lBZEMseUNBQVksR0FBWixVQUFhLEdBQW1CLEVBQUUsT0FBWTtRQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2Qix1QkFBWSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxzQ0FBUyxHQUFULFVBQVUsR0FBZ0IsRUFBRSxPQUFZLElBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFL0Qsc0NBQVMsR0FBVCxVQUFVLEdBQWdCLEVBQUUsT0FBWTtRQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHlDQUFZLEdBQVosVUFBYSxHQUFtQixFQUFFLE9BQVksSUFBUyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyRSx5QkFBQztBQUFELENBQUMsQUFqQkQsSUFpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0h0bWxQYXJzZXIsIEh0bWxQYXJzZVRyZWVSZXN1bHR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9odG1sX3BhcnNlcic7XG5pbXBvcnQge1BhcnNlU291cmNlU3BhbiwgUGFyc2VFcnJvcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3BhcnNlX3V0aWwnO1xuaW1wb3J0IHtcbiAgSHRtbEFzdCxcbiAgSHRtbEFzdFZpc2l0b3IsXG4gIEh0bWxFbGVtZW50QXN0LFxuICBIdG1sQXR0ckFzdCxcbiAgSHRtbFRleHRBc3QsXG4gIEh0bWxDb21tZW50QXN0LFxuICBodG1sVmlzaXRBbGxcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL2h0bWxfYXN0JztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIFN0cmluZ01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1JlZ0V4cFdyYXBwZXIsIE51bWJlcldyYXBwZXIsIGlzUHJlc2VudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7UGFyc2VyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL3BhcnNlci9wYXJzZXInO1xuaW1wb3J0IHtNZXNzYWdlLCBpZH0gZnJvbSAnLi9tZXNzYWdlJztcbmltcG9ydCB7XG4gIG1lc3NhZ2VGcm9tQXR0cmlidXRlLFxuICBJMThuRXJyb3IsXG4gIEkxOE5fQVRUUl9QUkVGSVgsXG4gIEkxOE5fQVRUUixcbiAgcGFydGl0aW9uLFxuICBQYXJ0LFxuICBzdHJpbmdpZnlOb2RlcyxcbiAgbWVhbmluZ1xufSBmcm9tICcuL3NoYXJlZCc7XG5cbmNvbnN0IF9JMThOX0FUVFIgPSBcImkxOG5cIjtcbmNvbnN0IF9QTEFDRUhPTERFUl9FTEVNRU5UID0gXCJwaFwiO1xuY29uc3QgX05BTUVfQVRUUiA9IFwibmFtZVwiO1xuY29uc3QgX0kxOE5fQVRUUl9QUkVGSVggPSBcImkxOG4tXCI7XG5sZXQgX1BMQUNFSE9MREVSX0VYUEFOREVEX1JFR0VYUCA9IFJlZ0V4cFdyYXBwZXIuY3JlYXRlKGBcXFxcPHBoKFxcXFxzKStuYW1lPShcIihcXFxcZCkrXCIpXFxcXD5cXFxcPFxcXFwvcGhcXFxcPmApO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gaTE4bi1lZCB2ZXJzaW9uIG9mIHRoZSBwYXJzZWQgdGVtcGxhdGUuXG4gKlxuICogQWxnb3JpdGhtOlxuICpcbiAqIFRvIHVuZGVyc3RhbmQgdGhlIGFsZ29yaXRobSwgeW91IG5lZWQgdG8ga25vdyBob3cgcGFydGl0aW9uaW5nIHdvcmtzLlxuICogUGFydGl0aW9uaW5nIGlzIHJlcXVpcmVkIGFzIHdlIGNhbiB1c2UgdHdvIGkxOG4gY29tbWVudHMgdG8gZ3JvdXAgbm9kZSBzaWJsaW5ncyB0b2dldGhlci5cbiAqIFRoYXQgaXMgd2h5IHdlIGNhbm5vdCBqdXN0IHVzZSBub2Rlcy5cbiAqXG4gKiBQYXJ0aXRpb25pbmcgdHJhbnNmb3JtcyBhbiBhcnJheSBvZiBIdG1sQXN0IGludG8gYW4gYXJyYXkgb2YgUGFydC5cbiAqIEEgcGFydCBjYW4gb3B0aW9uYWxseSBjb250YWluIGEgcm9vdCBlbGVtZW50IG9yIGEgcm9vdCB0ZXh0IG5vZGUuIEFuZCBpdCBjYW4gYWxzbyBjb250YWluXG4gKiBjaGlsZHJlbi5cbiAqIEEgcGFydCBjYW4gY29udGFpbiBpMThuIHByb3BlcnR5LCBpbiB3aGljaCBjYXNlIGl0IG5lZWRzIHRvIGJlIHRyYW5zYWx0ZWQuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGFycmF5IG9mIG5vZGVzIHdpbGwgYmUgc3BsaXQgaW50byBmb3VyIHBhcnRzOlxuICpcbiAqIGBgYFxuICogPGE+QTwvYT5cbiAqIDxiIGkxOG4+QjwvYj5cbiAqIDwhLS0gaTE4biAtLT5cbiAqIDxjPkM8L2M+XG4gKiBEXG4gKiA8IS0tIC9pMThuIC0tPlxuICogRVxuICogYGBgXG4gKlxuICogUGFydCAxIGNvbnRhaW5pbmcgdGhlIGEgdGFnLiBJdCBzaG91bGQgbm90IGJlIHRyYW5zbGF0ZWQuXG4gKiBQYXJ0IDIgY29udGFpbmluZyB0aGUgYiB0YWcuIEl0IHNob3VsZCBiZSB0cmFuc2xhdGVkLlxuICogUGFydCAzIGNvbnRhaW5pbmcgdGhlIGMgdGFnIGFuZCB0aGUgRCB0ZXh0IG5vZGUuIEl0IHNob3VsZCBiZSB0cmFuc2xhdGVkLlxuICogUGFydCA0IGNvbnRhaW5pbmcgdGhlIEUgdGV4dCBub2RlLiBJdCBzaG91bGQgbm90IGJlIHRyYW5zbGF0ZWQuXG4gKlxuICpcbiAqIEl0IGlzIGFsc28gaW1wb3J0YW50IHRvIHVuZGVyc3RhbmQgaG93IHdlIHN0cmluZ2lmeSBub2RlcyB0byBjcmVhdGUgYSBtZXNzYWdlLlxuICpcbiAqIFdlIHdhbGsgdGhlIHRyZWUgYW5kIHJlcGxhY2UgZXZlcnkgZWxlbWVudCBub2RlIHdpdGggYSBwbGFjZWhvbGRlci4gV2UgYWxzbyByZXBsYWNlXG4gKiBhbGwgZXhwcmVzc2lvbnMgaW4gaW50ZXJwb2xhdGlvbiB3aXRoIHBsYWNlaG9sZGVycy4gV2UgYWxzbyBpbnNlcnQgYSBwbGFjZWhvbGRlciBlbGVtZW50XG4gKiB0byB3cmFwIGEgdGV4dCBub2RlIGNvbnRhaW5pbmcgaW50ZXJwb2xhdGlvbi5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIFRoZSBmb2xsb3dpbmcgdHJlZTpcbiAqXG4gKiBgYGBcbiAqIDxhPkF7e0l9fTwvYT48Yj5CPC9iPlxuICogYGBgXG4gKlxuICogd2lsbCBiZSBzdHJpbmdpZmllZCBpbnRvOlxuICogYGBgXG4gKiA8cGggbmFtZT1cImUwXCI+PHBoIG5hbWU9XCJ0MVwiPkE8cGggbmFtZT1cIjBcIi8+PC9waD48L3BoPjxwaCBuYW1lPVwiZTJcIj5CPC9waD5cbiAqIGBgYFxuICpcbiAqIFRoaXMgaXMgd2hhdCB0aGUgYWxnb3JpdGhtIGRvZXM6XG4gKlxuICogMS4gVXNlIHRoZSBwcm92aWRlZCBodG1sIHBhcnNlciB0byBnZXQgdGhlIGh0bWwgQVNUIG9mIHRoZSB0ZW1wbGF0ZS5cbiAqIDIuIFBhcnRpdGlvbiB0aGUgcm9vdCBub2RlcywgYW5kIHByb2Nlc3MgZWFjaCBwYXJ0IHNlcGFyYXRlbHkuXG4gKiAzLiBJZiBhIHBhcnQgZG9lcyBub3QgaGF2ZSB0aGUgaTE4biBhdHRyaWJ1dGUsIHJlY3Vyc2UgdG8gcHJvY2VzcyBjaGlsZHJlbiBhbmQgYXR0cmlidXRlcy5cbiAqIDQuIElmIGEgcGFydCBoYXMgdGhlIGkxOG4gYXR0cmlidXRlLCBtZXJnZSB0aGUgdHJhbnNsYXRlZCBpMThuIHBhcnQgd2l0aCB0aGUgb3JpZ2luYWwgdHJlZS5cbiAqXG4gKiBUaGlzIGlzIGhvdyB0aGUgbWVyZ2luZyB3b3JrczpcbiAqXG4gKiAxLiBVc2UgdGhlIHN0cmluZ2lmeSBmdW5jdGlvbiB0byBnZXQgdGhlIG1lc3NhZ2UgaWQuIExvb2sgdXAgdGhlIG1lc3NhZ2UgaW4gdGhlIG1hcC5cbiAqIDIuIEdldCB0aGUgdHJhbnNsYXRlZCBtZXNzYWdlLiBBdCB0aGlzIHBvaW50IHdlIGhhdmUgdHdvIHRyZWVzOiB0aGUgb3JpZ2luYWwgdHJlZVxuICogYW5kIHRoZSB0cmFuc2xhdGVkIHRyZWUsIHdoZXJlIGFsbCB0aGUgZWxlbWVudHMgYXJlIHJlcGxhY2VkIHdpdGggcGxhY2Vob2xkZXJzLlxuICogMy4gVXNlIHRoZSBvcmlnaW5hbCB0cmVlIHRvIGNyZWF0ZSBhIG1hcHBpbmcgSW5kZXg6bnVtYmVyIC0+IEh0bWxBc3QuXG4gKiA0LiBXYWxrIHRoZSB0cmFuc2xhdGVkIHRyZWUuXG4gKiA1LiBJZiB3ZSBlbmNvdW50ZXIgYSBwbGFjZWhvbGRlciBlbGVtZW50LCBnZXQgaXMgbmFtZSBwcm9wZXJ0eS5cbiAqIDYuIEdldCB0aGUgdHlwZSBhbmQgdGhlIGluZGV4IG9mIHRoZSBub2RlIHVzaW5nIHRoZSBuYW1lIHByb3BlcnR5LlxuICogNy4gSWYgdGhlIHR5cGUgaXMgJ2UnLCB3aGljaCBtZWFucyBlbGVtZW50LCB0aGVuOlxuICogICAgIC0gdHJhbnNsYXRlIHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBvcmlnaW5hbCBlbGVtZW50XG4gKiAgICAgLSByZWN1cnNlIHRvIG1lcmdlIHRoZSBjaGlsZHJlblxuICogICAgIC0gY3JlYXRlIGEgbmV3IGVsZW1lbnQgdXNpbmcgdGhlIG9yaWdpbmFsIGVsZW1lbnQgbmFtZSwgb3JpZ2luYWwgcG9zaXRpb24sXG4gKiAgICAgYW5kIHRyYW5zbGF0ZWQgY2hpbGRyZW4gYW5kIGF0dHJpYnV0ZXNcbiAqIDguIElmIHRoZSB0eXBlIGlmICd0Jywgd2hpY2ggbWVhbnMgdGV4dCwgdGhlbjpcbiAqICAgICAtIGdldCB0aGUgbGlzdCBvZiBleHByZXNzaW9ucyBmcm9tIHRoZSBvcmlnaW5hbCBub2RlLlxuICogICAgIC0gZ2V0IHRoZSBzdHJpbmcgdmVyc2lvbiBvZiB0aGUgaW50ZXJwb2xhdGlvbiBzdWJ0cmVlXG4gKiAgICAgLSBmaW5kIGFsbCB0aGUgcGxhY2Vob2xkZXJzIGluIHRoZSB0cmFuc2xhdGVkIG1lc3NhZ2UsIGFuZCByZXBsYWNlIHRoZW0gd2l0aCB0aGVcbiAqICAgICBjb3JyZXNwb25kaW5nIG9yaWdpbmFsIGV4cHJlc3Npb25zXG4gKi9cbmV4cG9ydCBjbGFzcyBJMThuSHRtbFBhcnNlciBpbXBsZW1lbnRzIEh0bWxQYXJzZXIge1xuICBlcnJvcnM6IFBhcnNlRXJyb3JbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9odG1sUGFyc2VyOiBIdG1sUGFyc2VyLCBwcml2YXRlIF9wYXJzZXI6IFBhcnNlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbWVzc2FnZXNDb250ZW50OiBzdHJpbmcsIHByaXZhdGUgX21lc3NhZ2VzOiB7W2tleTogc3RyaW5nXTogSHRtbEFzdFtdfSkge31cblxuICBwYXJzZShzb3VyY2VDb250ZW50OiBzdHJpbmcsIHNvdXJjZVVybDogc3RyaW5nKTogSHRtbFBhcnNlVHJlZVJlc3VsdCB7XG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcblxuICAgIGxldCByZXMgPSB0aGlzLl9odG1sUGFyc2VyLnBhcnNlKHNvdXJjZUNvbnRlbnQsIHNvdXJjZVVybCk7XG4gICAgaWYgKHJlcy5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5vZGVzID0gdGhpcy5fcmVjdXJzZShyZXMucm9vdE5vZGVzKTtcbiAgICAgIHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGggPiAwID8gbmV3IEh0bWxQYXJzZVRyZWVSZXN1bHQoW10sIHRoaXMuZXJyb3JzKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBIdG1sUGFyc2VUcmVlUmVzdWx0KG5vZGVzLCBbXSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcHJvY2Vzc0kxOG5QYXJ0KHA6IFBhcnQpOiBIdG1sQXN0W10ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gcC5oYXNJMThuID8gdGhpcy5fbWVyZ2VJMThQYXJ0KHApIDogdGhpcy5fcmVjdXJzZUludG9JMThuUGFydChwKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEkxOG5FcnJvcikge1xuICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGUpO1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX21lcmdlSTE4UGFydChwOiBQYXJ0KTogSHRtbEFzdFtdIHtcbiAgICBsZXQgbWVzc2FnZUlkID0gaWQocC5jcmVhdGVNZXNzYWdlKHRoaXMuX3BhcnNlcikpO1xuICAgIGlmICghU3RyaW5nTWFwV3JhcHBlci5jb250YWlucyh0aGlzLl9tZXNzYWdlcywgbWVzc2FnZUlkKSkge1xuICAgICAgdGhyb3cgbmV3IEkxOG5FcnJvcihwLnNvdXJjZVNwYW4sIGBDYW5ub3QgZmluZCBtZXNzYWdlIGZvciBpZCAnJHttZXNzYWdlSWR9J2ApO1xuICAgIH1cblxuICAgIGxldCBwYXJzZWRNZXNzYWdlID0gdGhpcy5fbWVzc2FnZXNbbWVzc2FnZUlkXTtcbiAgICByZXR1cm4gdGhpcy5fbWVyZ2VUcmVlcyhwLCBwYXJzZWRNZXNzYWdlLCBwLmNoaWxkcmVuKTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlY3Vyc2VJbnRvSTE4blBhcnQocDogUGFydCk6IEh0bWxBc3RbXSB7XG4gICAgLy8gd2UgZm91bmQgYW4gZWxlbWVudCB3aXRob3V0IGFuIGkxOG4gYXR0cmlidXRlXG4gICAgLy8gd2UgbmVlZCB0byByZWN1cnNlIGluIGNhdXNlIGl0cyBjaGlsZHJlbiBtYXkgaGF2ZSBpMThuIHNldFxuICAgIC8vIHdlIGFsc28gbmVlZCB0byB0cmFuc2xhdGUgaXRzIGF0dHJpYnV0ZXNcbiAgICBpZiAoaXNQcmVzZW50KHAucm9vdEVsZW1lbnQpKSB7XG4gICAgICBsZXQgcm9vdCA9IHAucm9vdEVsZW1lbnQ7XG4gICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLl9yZWN1cnNlKHAuY2hpbGRyZW4pO1xuICAgICAgbGV0IGF0dHJzID0gdGhpcy5faTE4bkF0dHJpYnV0ZXMocm9vdCk7XG4gICAgICByZXR1cm4gW1xuICAgICAgICBuZXcgSHRtbEVsZW1lbnRBc3Qocm9vdC5uYW1lLCBhdHRycywgY2hpbGRyZW4sIHJvb3Quc291cmNlU3Bhbiwgcm9vdC5zdGFydFNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICByb290LmVuZFNvdXJjZVNwYW4pXG4gICAgICBdO1xuXG4gICAgICAvLyBhIHRleHQgbm9kZSB3aXRob3V0IGkxOG4gb3IgaW50ZXJwb2xhdGlvbiwgbm90aGluZyB0byBkb1xuICAgIH0gZWxzZSBpZiAoaXNQcmVzZW50KHAucm9vdFRleHROb2RlKSkge1xuICAgICAgcmV0dXJuIFtwLnJvb3RUZXh0Tm9kZV07XG5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlY3Vyc2UocC5jaGlsZHJlbik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcmVjdXJzZShub2RlczogSHRtbEFzdFtdKTogSHRtbEFzdFtdIHtcbiAgICBsZXQgcHMgPSBwYXJ0aXRpb24obm9kZXMsIHRoaXMuZXJyb3JzKTtcbiAgICByZXR1cm4gTGlzdFdyYXBwZXIuZmxhdHRlbihwcy5tYXAocCA9PiB0aGlzLl9wcm9jZXNzSTE4blBhcnQocCkpKTtcbiAgfVxuXG4gIHByaXZhdGUgX21lcmdlVHJlZXMocDogUGFydCwgdHJhbnNsYXRlZDogSHRtbEFzdFtdLCBvcmlnaW5hbDogSHRtbEFzdFtdKTogSHRtbEFzdFtdIHtcbiAgICBsZXQgbCA9IG5ldyBfQ3JlYXRlTm9kZU1hcHBpbmcoKTtcbiAgICBodG1sVmlzaXRBbGwobCwgb3JpZ2luYWwpO1xuXG4gICAgLy8gbWVyZ2UgdGhlIHRyYW5zbGF0ZWQgdHJlZSB3aXRoIHRoZSBvcmlnaW5hbCB0cmVlLlxuICAgIC8vIHdlIGRvIGl0IGJ5IHByZXNlcnZpbmcgdGhlIHNvdXJjZSBjb2RlIHBvc2l0aW9uIG9mIHRoZSBvcmlnaW5hbCB0cmVlXG4gICAgbGV0IG1lcmdlZCA9IHRoaXMuX21lcmdlVHJlZXNIZWxwZXIodHJhbnNsYXRlZCwgbC5tYXBwaW5nKTtcblxuICAgIC8vIGlmIHRoZSByb290IGVsZW1lbnQgaXMgcHJlc2VudCwgd2UgbmVlZCB0byBjcmVhdGUgYSBuZXcgcm9vdCBlbGVtZW50IHdpdGggaXRzIGF0dHJpYnV0ZXNcbiAgICAvLyB0cmFuc2xhdGVkXG4gICAgaWYgKGlzUHJlc2VudChwLnJvb3RFbGVtZW50KSkge1xuICAgICAgbGV0IHJvb3QgPSBwLnJvb3RFbGVtZW50O1xuICAgICAgbGV0IGF0dHJzID0gdGhpcy5faTE4bkF0dHJpYnV0ZXMocm9vdCk7XG4gICAgICByZXR1cm4gW1xuICAgICAgICBuZXcgSHRtbEVsZW1lbnRBc3Qocm9vdC5uYW1lLCBhdHRycywgbWVyZ2VkLCByb290LnNvdXJjZVNwYW4sIHJvb3Quc3RhcnRTb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdC5lbmRTb3VyY2VTcGFuKVxuICAgICAgXTtcblxuICAgICAgLy8gdGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuIHdpdGggYSBwYXJ0LiBQYXJ0cyB0aGF0IGhhdmUgcm9vdCB0ZXh0IG5vZGUgc2hvdWxkIG5vdCBiZSBtZXJnZWQuXG4gICAgfSBlbHNlIGlmIChpc1ByZXNlbnQocC5yb290VGV4dE5vZGUpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcInNob3VsZCBub3QgYmUgcmVhY2hlZFwiKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbWVyZ2VkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX21lcmdlVHJlZXNIZWxwZXIodHJhbnNsYXRlZDogSHRtbEFzdFtdLCBtYXBwaW5nOiBIdG1sQXN0W10pOiBIdG1sQXN0W10ge1xuICAgIHJldHVybiB0cmFuc2xhdGVkLm1hcCh0ID0+IHtcbiAgICAgIGlmICh0IGluc3RhbmNlb2YgSHRtbEVsZW1lbnRBc3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21lcmdlRWxlbWVudE9ySW50ZXJwb2xhdGlvbih0LCB0cmFuc2xhdGVkLCBtYXBwaW5nKTtcblxuICAgICAgfSBlbHNlIGlmICh0IGluc3RhbmNlb2YgSHRtbFRleHRBc3QpIHtcbiAgICAgICAgcmV0dXJuIHQ7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFwic2hvdWxkIG5vdCBiZSByZWFjaGVkXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfbWVyZ2VFbGVtZW50T3JJbnRlcnBvbGF0aW9uKHQ6IEh0bWxFbGVtZW50QXN0LCB0cmFuc2xhdGVkOiBIdG1sQXN0W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBwaW5nOiBIdG1sQXN0W10pOiBIdG1sQXN0IHtcbiAgICBsZXQgbmFtZSA9IHRoaXMuX2dldE5hbWUodCk7XG4gICAgbGV0IHR5cGUgPSBuYW1lWzBdO1xuICAgIGxldCBpbmRleCA9IE51bWJlcldyYXBwZXIucGFyc2VJbnQobmFtZS5zdWJzdHJpbmcoMSksIDEwKTtcbiAgICBsZXQgb3JpZ2luYWxOb2RlID0gbWFwcGluZ1tpbmRleF07XG5cbiAgICBpZiAodHlwZSA9PSBcInRcIikge1xuICAgICAgcmV0dXJuIHRoaXMuX21lcmdlVGV4dEludGVycG9sYXRpb24odCwgPEh0bWxUZXh0QXN0Pm9yaWdpbmFsTm9kZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09IFwiZVwiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWVyZ2VFbGVtZW50KHQsIDxIdG1sRWxlbWVudEFzdD5vcmlnaW5hbE5vZGUsIG1hcHBpbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcInNob3VsZCBub3QgYmUgcmVhY2hlZFwiKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXROYW1lKHQ6IEh0bWxFbGVtZW50QXN0KTogc3RyaW5nIHtcbiAgICBpZiAodC5uYW1lICE9IF9QTEFDRUhPTERFUl9FTEVNRU5UKSB7XG4gICAgICB0aHJvdyBuZXcgSTE4bkVycm9yKFxuICAgICAgICAgIHQuc291cmNlU3BhbixcbiAgICAgICAgICBgVW5leHBlY3RlZCB0YWcgXCIke3QubmFtZX1cIi4gT25seSBcIiR7X1BMQUNFSE9MREVSX0VMRU1FTlR9XCIgdGFncyBhcmUgYWxsb3dlZC5gKTtcbiAgICB9XG4gICAgbGV0IG5hbWVzID0gdC5hdHRycy5maWx0ZXIoYSA9PiBhLm5hbWUgPT0gX05BTUVfQVRUUik7XG4gICAgaWYgKG5hbWVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgSTE4bkVycm9yKHQuc291cmNlU3BhbiwgYE1pc3NpbmcgXCIke19OQU1FX0FUVFJ9XCIgYXR0cmlidXRlLmApO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXNbMF0udmFsdWU7XG4gIH1cblxuICBwcml2YXRlIF9tZXJnZVRleHRJbnRlcnBvbGF0aW9uKHQ6IEh0bWxFbGVtZW50QXN0LCBvcmlnaW5hbE5vZGU6IEh0bWxUZXh0QXN0KTogSHRtbFRleHRBc3Qge1xuICAgIGxldCBzcGxpdCA9XG4gICAgICAgIHRoaXMuX3BhcnNlci5zcGxpdEludGVycG9sYXRpb24ob3JpZ2luYWxOb2RlLnZhbHVlLCBvcmlnaW5hbE5vZGUuc291cmNlU3Bhbi50b1N0cmluZygpKTtcbiAgICBsZXQgZXhwcyA9IGlzUHJlc2VudChzcGxpdCkgPyBzcGxpdC5leHByZXNzaW9ucyA6IFtdO1xuXG4gICAgbGV0IG1lc3NhZ2VTdWJzdHJpbmcgPVxuICAgICAgICB0aGlzLl9tZXNzYWdlc0NvbnRlbnQuc3Vic3RyaW5nKHQuc3RhcnRTb3VyY2VTcGFuLmVuZC5vZmZzZXQsIHQuZW5kU291cmNlU3Bhbi5zdGFydC5vZmZzZXQpO1xuICAgIGxldCB0cmFuc2xhdGVkID1cbiAgICAgICAgdGhpcy5fcmVwbGFjZVBsYWNlaG9sZGVyc1dpdGhFeHByZXNzaW9ucyhtZXNzYWdlU3Vic3RyaW5nLCBleHBzLCBvcmlnaW5hbE5vZGUuc291cmNlU3Bhbik7XG5cbiAgICByZXR1cm4gbmV3IEh0bWxUZXh0QXN0KHRyYW5zbGF0ZWQsIG9yaWdpbmFsTm9kZS5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHByaXZhdGUgX21lcmdlRWxlbWVudCh0OiBIdG1sRWxlbWVudEFzdCwgb3JpZ2luYWxOb2RlOiBIdG1sRWxlbWVudEFzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcHBpbmc6IEh0bWxBc3RbXSk6IEh0bWxFbGVtZW50QXN0IHtcbiAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLl9tZXJnZVRyZWVzSGVscGVyKHQuY2hpbGRyZW4sIG1hcHBpbmcpO1xuICAgIHJldHVybiBuZXcgSHRtbEVsZW1lbnRBc3Qob3JpZ2luYWxOb2RlLm5hbWUsIHRoaXMuX2kxOG5BdHRyaWJ1dGVzKG9yaWdpbmFsTm9kZSksIGNoaWxkcmVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxOb2RlLnNvdXJjZVNwYW4sIG9yaWdpbmFsTm9kZS5zdGFydFNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbE5vZGUuZW5kU291cmNlU3Bhbik7XG4gIH1cblxuICBwcml2YXRlIF9pMThuQXR0cmlidXRlcyhlbDogSHRtbEVsZW1lbnRBc3QpOiBIdG1sQXR0ckFzdFtdIHtcbiAgICBsZXQgcmVzID0gW107XG4gICAgZWwuYXR0cnMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aChJMThOX0FUVFJfUFJFRklYKSB8fCBhdHRyLm5hbWUgPT0gSTE4Tl9BVFRSKSByZXR1cm47XG5cbiAgICAgIGxldCBpMThucyA9IGVsLmF0dHJzLmZpbHRlcihhID0+IGEubmFtZSA9PSBgaTE4bi0ke2F0dHIubmFtZX1gKTtcbiAgICAgIGlmIChpMThucy5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXMucHVzaChhdHRyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgaTE4biA9IGkxOG5zWzBdO1xuICAgICAgbGV0IG1lc3NhZ2VJZCA9IGlkKG1lc3NhZ2VGcm9tQXR0cmlidXRlKHRoaXMuX3BhcnNlciwgZWwsIGkxOG4pKTtcblxuICAgICAgaWYgKFN0cmluZ01hcFdyYXBwZXIuY29udGFpbnModGhpcy5fbWVzc2FnZXMsIG1lc3NhZ2VJZCkpIHtcbiAgICAgICAgbGV0IHVwZGF0ZWRNZXNzYWdlID0gdGhpcy5fcmVwbGFjZUludGVycG9sYXRpb25JbkF0dHIoYXR0ciwgdGhpcy5fbWVzc2FnZXNbbWVzc2FnZUlkXSk7XG4gICAgICAgIHJlcy5wdXNoKG5ldyBIdG1sQXR0ckFzdChhdHRyLm5hbWUsIHVwZGF0ZWRNZXNzYWdlLCBhdHRyLnNvdXJjZVNwYW4pKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEkxOG5FcnJvcihhdHRyLnNvdXJjZVNwYW4sIGBDYW5ub3QgZmluZCBtZXNzYWdlIGZvciBpZCAnJHttZXNzYWdlSWR9J2ApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBwcml2YXRlIF9yZXBsYWNlSW50ZXJwb2xhdGlvbkluQXR0cihhdHRyOiBIdG1sQXR0ckFzdCwgbXNnOiBIdG1sQXN0W10pOiBzdHJpbmcge1xuICAgIGxldCBzcGxpdCA9IHRoaXMuX3BhcnNlci5zcGxpdEludGVycG9sYXRpb24oYXR0ci52YWx1ZSwgYXR0ci5zb3VyY2VTcGFuLnRvU3RyaW5nKCkpO1xuICAgIGxldCBleHBzID0gaXNQcmVzZW50KHNwbGl0KSA/IHNwbGl0LmV4cHJlc3Npb25zIDogW107XG5cbiAgICBsZXQgZmlyc3QgPSBtc2dbMF07XG4gICAgbGV0IGxhc3QgPSBtc2dbbXNnLmxlbmd0aCAtIDFdO1xuXG4gICAgbGV0IHN0YXJ0ID0gZmlyc3Quc291cmNlU3Bhbi5zdGFydC5vZmZzZXQ7XG4gICAgbGV0IGVuZCA9XG4gICAgICAgIGxhc3QgaW5zdGFuY2VvZiBIdG1sRWxlbWVudEFzdCA/IGxhc3QuZW5kU291cmNlU3Bhbi5lbmQub2Zmc2V0IDogbGFzdC5zb3VyY2VTcGFuLmVuZC5vZmZzZXQ7XG4gICAgbGV0IG1lc3NhZ2VTdWJzdHJpbmcgPSB0aGlzLl9tZXNzYWdlc0NvbnRlbnQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xuXG4gICAgcmV0dXJuIHRoaXMuX3JlcGxhY2VQbGFjZWhvbGRlcnNXaXRoRXhwcmVzc2lvbnMobWVzc2FnZVN1YnN0cmluZywgZXhwcywgYXR0ci5zb3VyY2VTcGFuKTtcbiAgfTtcblxuICBwcml2YXRlIF9yZXBsYWNlUGxhY2Vob2xkZXJzV2l0aEV4cHJlc3Npb25zKG1lc3NhZ2U6IHN0cmluZywgZXhwczogc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKTogc3RyaW5nIHtcbiAgICByZXR1cm4gUmVnRXhwV3JhcHBlci5yZXBsYWNlQWxsKF9QTEFDRUhPTERFUl9FWFBBTkRFRF9SRUdFWFAsIG1lc3NhZ2UsIChtYXRjaCkgPT4ge1xuICAgICAgbGV0IG5hbWVXaXRoUXVvdGVzID0gbWF0Y2hbMl07XG4gICAgICBsZXQgbmFtZSA9IG5hbWVXaXRoUXVvdGVzLnN1YnN0cmluZygxLCBuYW1lV2l0aFF1b3Rlcy5sZW5ndGggLSAxKTtcbiAgICAgIGxldCBpbmRleCA9IE51bWJlcldyYXBwZXIucGFyc2VJbnQobmFtZSwgMTApO1xuICAgICAgcmV0dXJuIHRoaXMuX2NvbnZlcnRJbnRvRXhwcmVzc2lvbihpbmRleCwgZXhwcywgc291cmNlU3Bhbik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9jb252ZXJ0SW50b0V4cHJlc3Npb24oaW5kZXg6IG51bWJlciwgZXhwczogc3RyaW5nW10sIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge1xuICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDwgZXhwcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBge3ske2V4cHNbaW5kZXhdfX19YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEkxOG5FcnJvcihzb3VyY2VTcGFuLCBgSW52YWxpZCBpbnRlcnBvbGF0aW9uIGluZGV4ICcke2luZGV4fSdgKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgX0NyZWF0ZU5vZGVNYXBwaW5nIGltcGxlbWVudHMgSHRtbEFzdFZpc2l0b3Ige1xuICBtYXBwaW5nOiBIdG1sQXN0W10gPSBbXTtcblxuICB2aXNpdEVsZW1lbnQoYXN0OiBIdG1sRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB0aGlzLm1hcHBpbmcucHVzaChhc3QpO1xuICAgIGh0bWxWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRBdHRyKGFzdDogSHRtbEF0dHJBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmlzaXRUZXh0KGFzdDogSHRtbFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy5tYXBwaW5nLnB1c2goYXN0KTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0Q29tbWVudChhc3Q6IEh0bWxDb21tZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gXCJcIjsgfVxufSJdfQ==