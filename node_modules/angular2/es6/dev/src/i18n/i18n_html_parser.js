import { HtmlParseTreeResult } from 'angular2/src/compiler/html_parser';
import { HtmlElementAst, HtmlAttrAst, HtmlTextAst, htmlVisitAll } from 'angular2/src/compiler/html_ast';
import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { RegExpWrapper, NumberWrapper, isPresent } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { id } from './message';
import { messageFromAttribute, I18nError, I18N_ATTR_PREFIX, I18N_ATTR, partition } from './shared';
const _I18N_ATTR = "i18n";
const _PLACEHOLDER_ELEMENT = "ph";
const _NAME_ATTR = "name";
const _I18N_ATTR_PREFIX = "i18n-";
let _PLACEHOLDER_EXPANDED_REGEXP = RegExpWrapper.create(`\\<ph(\\s)+name=("(\\d)+")\\>\\<\\/ph\\>`);
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
export class I18nHtmlParser {
    constructor(_htmlParser, _parser, _messagesContent, _messages) {
        this._htmlParser = _htmlParser;
        this._parser = _parser;
        this._messagesContent = _messagesContent;
        this._messages = _messages;
    }
    parse(sourceContent, sourceUrl) {
        this.errors = [];
        let res = this._htmlParser.parse(sourceContent, sourceUrl);
        if (res.errors.length > 0) {
            return res;
        }
        else {
            let nodes = this._recurse(res.rootNodes);
            return this.errors.length > 0 ? new HtmlParseTreeResult([], this.errors) :
                new HtmlParseTreeResult(nodes, []);
        }
    }
    _processI18nPart(p) {
        try {
            return p.hasI18n ? this._mergeI18Part(p) : this._recurseIntoI18nPart(p);
        }
        catch (e) {
            if (e instanceof I18nError) {
                this.errors.push(e);
                return [];
            }
            else {
                throw e;
            }
        }
    }
    _mergeI18Part(p) {
        let messageId = id(p.createMessage(this._parser));
        if (!StringMapWrapper.contains(this._messages, messageId)) {
            throw new I18nError(p.sourceSpan, `Cannot find message for id '${messageId}'`);
        }
        let parsedMessage = this._messages[messageId];
        return this._mergeTrees(p, parsedMessage, p.children);
    }
    _recurseIntoI18nPart(p) {
        // we found an element without an i18n attribute
        // we need to recurse in cause its children may have i18n set
        // we also need to translate its attributes
        if (isPresent(p.rootElement)) {
            let root = p.rootElement;
            let children = this._recurse(p.children);
            let attrs = this._i18nAttributes(root);
            return [
                new HtmlElementAst(root.name, attrs, children, root.sourceSpan, root.startSourceSpan, root.endSourceSpan)
            ];
        }
        else if (isPresent(p.rootTextNode)) {
            return [p.rootTextNode];
        }
        else {
            return this._recurse(p.children);
        }
    }
    _recurse(nodes) {
        let ps = partition(nodes, this.errors);
        return ListWrapper.flatten(ps.map(p => this._processI18nPart(p)));
    }
    _mergeTrees(p, translated, original) {
        let l = new _CreateNodeMapping();
        htmlVisitAll(l, original);
        // merge the translated tree with the original tree.
        // we do it by preserving the source code position of the original tree
        let merged = this._mergeTreesHelper(translated, l.mapping);
        // if the root element is present, we need to create a new root element with its attributes
        // translated
        if (isPresent(p.rootElement)) {
            let root = p.rootElement;
            let attrs = this._i18nAttributes(root);
            return [
                new HtmlElementAst(root.name, attrs, merged, root.sourceSpan, root.startSourceSpan, root.endSourceSpan)
            ];
        }
        else if (isPresent(p.rootTextNode)) {
            throw new BaseException("should not be reached");
        }
        else {
            return merged;
        }
    }
    _mergeTreesHelper(translated, mapping) {
        return translated.map(t => {
            if (t instanceof HtmlElementAst) {
                return this._mergeElementOrInterpolation(t, translated, mapping);
            }
            else if (t instanceof HtmlTextAst) {
                return t;
            }
            else {
                throw new BaseException("should not be reached");
            }
        });
    }
    _mergeElementOrInterpolation(t, translated, mapping) {
        let name = this._getName(t);
        let type = name[0];
        let index = NumberWrapper.parseInt(name.substring(1), 10);
        let originalNode = mapping[index];
        if (type == "t") {
            return this._mergeTextInterpolation(t, originalNode);
        }
        else if (type == "e") {
            return this._mergeElement(t, originalNode, mapping);
        }
        else {
            throw new BaseException("should not be reached");
        }
    }
    _getName(t) {
        if (t.name != _PLACEHOLDER_ELEMENT) {
            throw new I18nError(t.sourceSpan, `Unexpected tag "${t.name}". Only "${_PLACEHOLDER_ELEMENT}" tags are allowed.`);
        }
        let names = t.attrs.filter(a => a.name == _NAME_ATTR);
        if (names.length == 0) {
            throw new I18nError(t.sourceSpan, `Missing "${_NAME_ATTR}" attribute.`);
        }
        return names[0].value;
    }
    _mergeTextInterpolation(t, originalNode) {
        let split = this._parser.splitInterpolation(originalNode.value, originalNode.sourceSpan.toString());
        let exps = isPresent(split) ? split.expressions : [];
        let messageSubstring = this._messagesContent.substring(t.startSourceSpan.end.offset, t.endSourceSpan.start.offset);
        let translated = this._replacePlaceholdersWithExpressions(messageSubstring, exps, originalNode.sourceSpan);
        return new HtmlTextAst(translated, originalNode.sourceSpan);
    }
    _mergeElement(t, originalNode, mapping) {
        let children = this._mergeTreesHelper(t.children, mapping);
        return new HtmlElementAst(originalNode.name, this._i18nAttributes(originalNode), children, originalNode.sourceSpan, originalNode.startSourceSpan, originalNode.endSourceSpan);
    }
    _i18nAttributes(el) {
        let res = [];
        el.attrs.forEach(attr => {
            if (attr.name.startsWith(I18N_ATTR_PREFIX) || attr.name == I18N_ATTR)
                return;
            let i18ns = el.attrs.filter(a => a.name == `i18n-${attr.name}`);
            if (i18ns.length == 0) {
                res.push(attr);
                return;
            }
            let i18n = i18ns[0];
            let messageId = id(messageFromAttribute(this._parser, el, i18n));
            if (StringMapWrapper.contains(this._messages, messageId)) {
                let updatedMessage = this._replaceInterpolationInAttr(attr, this._messages[messageId]);
                res.push(new HtmlAttrAst(attr.name, updatedMessage, attr.sourceSpan));
            }
            else {
                throw new I18nError(attr.sourceSpan, `Cannot find message for id '${messageId}'`);
            }
        });
        return res;
    }
    _replaceInterpolationInAttr(attr, msg) {
        let split = this._parser.splitInterpolation(attr.value, attr.sourceSpan.toString());
        let exps = isPresent(split) ? split.expressions : [];
        let first = msg[0];
        let last = msg[msg.length - 1];
        let start = first.sourceSpan.start.offset;
        let end = last instanceof HtmlElementAst ? last.endSourceSpan.end.offset : last.sourceSpan.end.offset;
        let messageSubstring = this._messagesContent.substring(start, end);
        return this._replacePlaceholdersWithExpressions(messageSubstring, exps, attr.sourceSpan);
    }
    ;
    _replacePlaceholdersWithExpressions(message, exps, sourceSpan) {
        return RegExpWrapper.replaceAll(_PLACEHOLDER_EXPANDED_REGEXP, message, (match) => {
            let nameWithQuotes = match[2];
            let name = nameWithQuotes.substring(1, nameWithQuotes.length - 1);
            let index = NumberWrapper.parseInt(name, 10);
            return this._convertIntoExpression(index, exps, sourceSpan);
        });
    }
    _convertIntoExpression(index, exps, sourceSpan) {
        if (index >= 0 && index < exps.length) {
            return `{{${exps[index]}}}`;
        }
        else {
            throw new I18nError(sourceSpan, `Invalid interpolation index '${index}'`);
        }
    }
}
class _CreateNodeMapping {
    constructor() {
        this.mapping = [];
    }
    visitElement(ast, context) {
        this.mapping.push(ast);
        htmlVisitAll(this, ast.children);
        return null;
    }
    visitAttr(ast, context) { return null; }
    visitText(ast, context) {
        this.mapping.push(ast);
        return null;
    }
    visitComment(ast, context) { return ""; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9odG1sX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9pMThuL2kxOG5faHRtbF9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBYSxtQkFBbUIsRUFBQyxNQUFNLG1DQUFtQztPQUUxRSxFQUdMLGNBQWMsRUFDZCxXQUFXLEVBQ1gsV0FBVyxFQUVYLFlBQVksRUFDYixNQUFNLGdDQUFnQztPQUNoQyxFQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQztPQUNyRSxFQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFDLE1BQU0sMEJBQTBCO09BQ3pFLEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO09BRXJELEVBQVUsRUFBRSxFQUFDLE1BQU0sV0FBVztPQUM5QixFQUNMLG9CQUFvQixFQUNwQixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVCxTQUFTLEVBSVYsTUFBTSxVQUFVO0FBRWpCLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUMxQixNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUNsQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUM7QUFDMUIsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUM7QUFDbEMsSUFBSSw0QkFBNEIsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7QUFFcEc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErRUc7QUFDSDtJQUdFLFlBQW9CLFdBQXVCLEVBQVUsT0FBZSxFQUNoRCxnQkFBd0IsRUFBVSxTQUFxQztRQUR2RSxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUFVLFlBQU8sR0FBUCxPQUFPLENB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Q0FBQztJQUVELFNBQVMsQ0FBQyxHQUFnQixFQUFFLE9BQVksSUFBUyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUUvRCxTQUFTLENBQUMsR0FBZ0IsRUFBRSxPQUFZO1FBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsWUFBWSxDQUFDLEdBQW1CLEVBQUUsT0FBWSxJQUFTLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SHRtbFBhcnNlciwgSHRtbFBhcnNlVHJlZVJlc3VsdH0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL2h0bWxfcGFyc2VyJztcbmltcG9ydCB7UGFyc2VTb3VyY2VTcGFuLCBQYXJzZUVycm9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvcGFyc2VfdXRpbCc7XG5pbXBvcnQge1xuICBIdG1sQXN0LFxuICBIdG1sQXN0VmlzaXRvcixcbiAgSHRtbEVsZW1lbnRBc3QsXG4gIEh0bWxBdHRyQXN0LFxuICBIdG1sVGV4dEFzdCxcbiAgSHRtbENvbW1lbnRBc3QsXG4gIGh0bWxWaXNpdEFsbFxufSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvaHRtbF9hc3QnO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgU3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7UmVnRXhwV3JhcHBlciwgTnVtYmVyV3JhcHBlciwgaXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtQYXJzZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vcGFyc2VyL3BhcnNlcic7XG5pbXBvcnQge01lc3NhZ2UsIGlkfSBmcm9tICcuL21lc3NhZ2UnO1xuaW1wb3J0IHtcbiAgbWVzc2FnZUZyb21BdHRyaWJ1dGUsXG4gIEkxOG5FcnJvcixcbiAgSTE4Tl9BVFRSX1BSRUZJWCxcbiAgSTE4Tl9BVFRSLFxuICBwYXJ0aXRpb24sXG4gIFBhcnQsXG4gIHN0cmluZ2lmeU5vZGVzLFxuICBtZWFuaW5nXG59IGZyb20gJy4vc2hhcmVkJztcblxuY29uc3QgX0kxOE5fQVRUUiA9IFwiaTE4blwiO1xuY29uc3QgX1BMQUNFSE9MREVSX0VMRU1FTlQgPSBcInBoXCI7XG5jb25zdCBfTkFNRV9BVFRSID0gXCJuYW1lXCI7XG5jb25zdCBfSTE4Tl9BVFRSX1BSRUZJWCA9IFwiaTE4bi1cIjtcbmxldCBfUExBQ0VIT0xERVJfRVhQQU5ERURfUkVHRVhQID0gUmVnRXhwV3JhcHBlci5jcmVhdGUoYFxcXFw8cGgoXFxcXHMpK25hbWU9KFwiKFxcXFxkKStcIilcXFxcPlxcXFw8XFxcXC9waFxcXFw+YCk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBpMThuLWVkIHZlcnNpb24gb2YgdGhlIHBhcnNlZCB0ZW1wbGF0ZS5cbiAqXG4gKiBBbGdvcml0aG06XG4gKlxuICogVG8gdW5kZXJzdGFuZCB0aGUgYWxnb3JpdGhtLCB5b3UgbmVlZCB0byBrbm93IGhvdyBwYXJ0aXRpb25pbmcgd29ya3MuXG4gKiBQYXJ0aXRpb25pbmcgaXMgcmVxdWlyZWQgYXMgd2UgY2FuIHVzZSB0d28gaTE4biBjb21tZW50cyB0byBncm91cCBub2RlIHNpYmxpbmdzIHRvZ2V0aGVyLlxuICogVGhhdCBpcyB3aHkgd2UgY2Fubm90IGp1c3QgdXNlIG5vZGVzLlxuICpcbiAqIFBhcnRpdGlvbmluZyB0cmFuc2Zvcm1zIGFuIGFycmF5IG9mIEh0bWxBc3QgaW50byBhbiBhcnJheSBvZiBQYXJ0LlxuICogQSBwYXJ0IGNhbiBvcHRpb25hbGx5IGNvbnRhaW4gYSByb290IGVsZW1lbnQgb3IgYSByb290IHRleHQgbm9kZS4gQW5kIGl0IGNhbiBhbHNvIGNvbnRhaW5cbiAqIGNoaWxkcmVuLlxuICogQSBwYXJ0IGNhbiBjb250YWluIGkxOG4gcHJvcGVydHksIGluIHdoaWNoIGNhc2UgaXQgbmVlZHMgdG8gYmUgdHJhbnNhbHRlZC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIFRoZSBmb2xsb3dpbmcgYXJyYXkgb2Ygbm9kZXMgd2lsbCBiZSBzcGxpdCBpbnRvIGZvdXIgcGFydHM6XG4gKlxuICogYGBgXG4gKiA8YT5BPC9hPlxuICogPGIgaTE4bj5CPC9iPlxuICogPCEtLSBpMThuIC0tPlxuICogPGM+QzwvYz5cbiAqIERcbiAqIDwhLS0gL2kxOG4gLS0+XG4gKiBFXG4gKiBgYGBcbiAqXG4gKiBQYXJ0IDEgY29udGFpbmluZyB0aGUgYSB0YWcuIEl0IHNob3VsZCBub3QgYmUgdHJhbnNsYXRlZC5cbiAqIFBhcnQgMiBjb250YWluaW5nIHRoZSBiIHRhZy4gSXQgc2hvdWxkIGJlIHRyYW5zbGF0ZWQuXG4gKiBQYXJ0IDMgY29udGFpbmluZyB0aGUgYyB0YWcgYW5kIHRoZSBEIHRleHQgbm9kZS4gSXQgc2hvdWxkIGJlIHRyYW5zbGF0ZWQuXG4gKiBQYXJ0IDQgY29udGFpbmluZyB0aGUgRSB0ZXh0IG5vZGUuIEl0IHNob3VsZCBub3QgYmUgdHJhbnNsYXRlZC5cbiAqXG4gKlxuICogSXQgaXMgYWxzbyBpbXBvcnRhbnQgdG8gdW5kZXJzdGFuZCBob3cgd2Ugc3RyaW5naWZ5IG5vZGVzIHRvIGNyZWF0ZSBhIG1lc3NhZ2UuXG4gKlxuICogV2Ugd2FsayB0aGUgdHJlZSBhbmQgcmVwbGFjZSBldmVyeSBlbGVtZW50IG5vZGUgd2l0aCBhIHBsYWNlaG9sZGVyLiBXZSBhbHNvIHJlcGxhY2VcbiAqIGFsbCBleHByZXNzaW9ucyBpbiBpbnRlcnBvbGF0aW9uIHdpdGggcGxhY2Vob2xkZXJzLiBXZSBhbHNvIGluc2VydCBhIHBsYWNlaG9sZGVyIGVsZW1lbnRcbiAqIHRvIHdyYXAgYSB0ZXh0IG5vZGUgY29udGFpbmluZyBpbnRlcnBvbGF0aW9uLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogVGhlIGZvbGxvd2luZyB0cmVlOlxuICpcbiAqIGBgYFxuICogPGE+QXt7SX19PC9hPjxiPkI8L2I+XG4gKiBgYGBcbiAqXG4gKiB3aWxsIGJlIHN0cmluZ2lmaWVkIGludG86XG4gKiBgYGBcbiAqIDxwaCBuYW1lPVwiZTBcIj48cGggbmFtZT1cInQxXCI+QTxwaCBuYW1lPVwiMFwiLz48L3BoPjwvcGg+PHBoIG5hbWU9XCJlMlwiPkI8L3BoPlxuICogYGBgXG4gKlxuICogVGhpcyBpcyB3aGF0IHRoZSBhbGdvcml0aG0gZG9lczpcbiAqXG4gKiAxLiBVc2UgdGhlIHByb3ZpZGVkIGh0bWwgcGFyc2VyIHRvIGdldCB0aGUgaHRtbCBBU1Qgb2YgdGhlIHRlbXBsYXRlLlxuICogMi4gUGFydGl0aW9uIHRoZSByb290IG5vZGVzLCBhbmQgcHJvY2VzcyBlYWNoIHBhcnQgc2VwYXJhdGVseS5cbiAqIDMuIElmIGEgcGFydCBkb2VzIG5vdCBoYXZlIHRoZSBpMThuIGF0dHJpYnV0ZSwgcmVjdXJzZSB0byBwcm9jZXNzIGNoaWxkcmVuIGFuZCBhdHRyaWJ1dGVzLlxuICogNC4gSWYgYSBwYXJ0IGhhcyB0aGUgaTE4biBhdHRyaWJ1dGUsIG1lcmdlIHRoZSB0cmFuc2xhdGVkIGkxOG4gcGFydCB3aXRoIHRoZSBvcmlnaW5hbCB0cmVlLlxuICpcbiAqIFRoaXMgaXMgaG93IHRoZSBtZXJnaW5nIHdvcmtzOlxuICpcbiAqIDEuIFVzZSB0aGUgc3RyaW5naWZ5IGZ1bmN0aW9uIHRvIGdldCB0aGUgbWVzc2FnZSBpZC4gTG9vayB1cCB0aGUgbWVzc2FnZSBpbiB0aGUgbWFwLlxuICogMi4gR2V0IHRoZSB0cmFuc2xhdGVkIG1lc3NhZ2UuIEF0IHRoaXMgcG9pbnQgd2UgaGF2ZSB0d28gdHJlZXM6IHRoZSBvcmlnaW5hbCB0cmVlXG4gKiBhbmQgdGhlIHRyYW5zbGF0ZWQgdHJlZSwgd2hlcmUgYWxsIHRoZSBlbGVtZW50cyBhcmUgcmVwbGFjZWQgd2l0aCBwbGFjZWhvbGRlcnMuXG4gKiAzLiBVc2UgdGhlIG9yaWdpbmFsIHRyZWUgdG8gY3JlYXRlIGEgbWFwcGluZyBJbmRleDpudW1iZXIgLT4gSHRtbEFzdC5cbiAqIDQuIFdhbGsgdGhlIHRyYW5zbGF0ZWQgdHJlZS5cbiAqIDUuIElmIHdlIGVuY291bnRlciBhIHBsYWNlaG9sZGVyIGVsZW1lbnQsIGdldCBpcyBuYW1lIHByb3BlcnR5LlxuICogNi4gR2V0IHRoZSB0eXBlIGFuZCB0aGUgaW5kZXggb2YgdGhlIG5vZGUgdXNpbmcgdGhlIG5hbWUgcHJvcGVydHkuXG4gKiA3LiBJZiB0aGUgdHlwZSBpcyAnZScsIHdoaWNoIG1lYW5zIGVsZW1lbnQsIHRoZW46XG4gKiAgICAgLSB0cmFuc2xhdGUgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIG9yaWdpbmFsIGVsZW1lbnRcbiAqICAgICAtIHJlY3Vyc2UgdG8gbWVyZ2UgdGhlIGNoaWxkcmVuXG4gKiAgICAgLSBjcmVhdGUgYSBuZXcgZWxlbWVudCB1c2luZyB0aGUgb3JpZ2luYWwgZWxlbWVudCBuYW1lLCBvcmlnaW5hbCBwb3NpdGlvbixcbiAqICAgICBhbmQgdHJhbnNsYXRlZCBjaGlsZHJlbiBhbmQgYXR0cmlidXRlc1xuICogOC4gSWYgdGhlIHR5cGUgaWYgJ3QnLCB3aGljaCBtZWFucyB0ZXh0LCB0aGVuOlxuICogICAgIC0gZ2V0IHRoZSBsaXN0IG9mIGV4cHJlc3Npb25zIGZyb20gdGhlIG9yaWdpbmFsIG5vZGUuXG4gKiAgICAgLSBnZXQgdGhlIHN0cmluZyB2ZXJzaW9uIG9mIHRoZSBpbnRlcnBvbGF0aW9uIHN1YnRyZWVcbiAqICAgICAtIGZpbmQgYWxsIHRoZSBwbGFjZWhvbGRlcnMgaW4gdGhlIHRyYW5zbGF0ZWQgbWVzc2FnZSwgYW5kIHJlcGxhY2UgdGhlbSB3aXRoIHRoZVxuICogICAgIGNvcnJlc3BvbmRpbmcgb3JpZ2luYWwgZXhwcmVzc2lvbnNcbiAqL1xuZXhwb3J0IGNsYXNzIEkxOG5IdG1sUGFyc2VyIGltcGxlbWVudHMgSHRtbFBhcnNlciB7XG4gIGVycm9yczogUGFyc2VFcnJvcltdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2h0bWxQYXJzZXI6IEh0bWxQYXJzZXIsIHByaXZhdGUgX3BhcnNlcjogUGFyc2VyLFxuICAgICAgICAgICAgICBwcml2YXRlIF9tZXNzYWdlc0NvbnRlbnQ6IHN0cmluZywgcHJpdmF0ZSBfbWVzc2FnZXM6IHtba2V5OiBzdHJpbmddOiBIdG1sQXN0W119KSB7fVxuXG4gIHBhcnNlKHNvdXJjZUNvbnRlbnQ6IHN0cmluZywgc291cmNlVXJsOiBzdHJpbmcpOiBIdG1sUGFyc2VUcmVlUmVzdWx0IHtcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xuXG4gICAgbGV0IHJlcyA9IHRoaXMuX2h0bWxQYXJzZXIucGFyc2Uoc291cmNlQ29udGVudCwgc291cmNlVXJsKTtcbiAgICBpZiAocmVzLmVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbm9kZXMgPSB0aGlzLl9yZWN1cnNlKHJlcy5yb290Tm9kZXMpO1xuICAgICAgcmV0dXJuIHRoaXMuZXJyb3JzLmxlbmd0aCA+IDAgPyBuZXcgSHRtbFBhcnNlVHJlZVJlc3VsdChbXSwgdGhpcy5lcnJvcnMpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEh0bWxQYXJzZVRyZWVSZXN1bHQobm9kZXMsIFtdKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9wcm9jZXNzSTE4blBhcnQocDogUGFydCk6IEh0bWxBc3RbXSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBwLmhhc0kxOG4gPyB0aGlzLl9tZXJnZUkxOFBhcnQocCkgOiB0aGlzLl9yZWN1cnNlSW50b0kxOG5QYXJ0KHApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgSTE4bkVycm9yKSB7XG4gICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZSk7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbWVyZ2VJMThQYXJ0KHA6IFBhcnQpOiBIdG1sQXN0W10ge1xuICAgIGxldCBtZXNzYWdlSWQgPSBpZChwLmNyZWF0ZU1lc3NhZ2UodGhpcy5fcGFyc2VyKSk7XG4gICAgaWYgKCFTdHJpbmdNYXBXcmFwcGVyLmNvbnRhaW5zKHRoaXMuX21lc3NhZ2VzLCBtZXNzYWdlSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgSTE4bkVycm9yKHAuc291cmNlU3BhbiwgYENhbm5vdCBmaW5kIG1lc3NhZ2UgZm9yIGlkICcke21lc3NhZ2VJZH0nYCk7XG4gICAgfVxuXG4gICAgbGV0IHBhcnNlZE1lc3NhZ2UgPSB0aGlzLl9tZXNzYWdlc1ttZXNzYWdlSWRdO1xuICAgIHJldHVybiB0aGlzLl9tZXJnZVRyZWVzKHAsIHBhcnNlZE1lc3NhZ2UsIHAuY2hpbGRyZW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVjdXJzZUludG9JMThuUGFydChwOiBQYXJ0KTogSHRtbEFzdFtdIHtcbiAgICAvLyB3ZSBmb3VuZCBhbiBlbGVtZW50IHdpdGhvdXQgYW4gaTE4biBhdHRyaWJ1dGVcbiAgICAvLyB3ZSBuZWVkIHRvIHJlY3Vyc2UgaW4gY2F1c2UgaXRzIGNoaWxkcmVuIG1heSBoYXZlIGkxOG4gc2V0XG4gICAgLy8gd2UgYWxzbyBuZWVkIHRvIHRyYW5zbGF0ZSBpdHMgYXR0cmlidXRlc1xuICAgIGlmIChpc1ByZXNlbnQocC5yb290RWxlbWVudCkpIHtcbiAgICAgIGxldCByb290ID0gcC5yb290RWxlbWVudDtcbiAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuX3JlY3Vyc2UocC5jaGlsZHJlbik7XG4gICAgICBsZXQgYXR0cnMgPSB0aGlzLl9pMThuQXR0cmlidXRlcyhyb290KTtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIG5ldyBIdG1sRWxlbWVudEFzdChyb290Lm5hbWUsIGF0dHJzLCBjaGlsZHJlbiwgcm9vdC5zb3VyY2VTcGFuLCByb290LnN0YXJ0U291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3QuZW5kU291cmNlU3BhbilcbiAgICAgIF07XG5cbiAgICAgIC8vIGEgdGV4dCBub2RlIHdpdGhvdXQgaTE4biBvciBpbnRlcnBvbGF0aW9uLCBub3RoaW5nIHRvIGRvXG4gICAgfSBlbHNlIGlmIChpc1ByZXNlbnQocC5yb290VGV4dE5vZGUpKSB7XG4gICAgICByZXR1cm4gW3Aucm9vdFRleHROb2RlXTtcblxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVjdXJzZShwLmNoaWxkcmVuKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9yZWN1cnNlKG5vZGVzOiBIdG1sQXN0W10pOiBIdG1sQXN0W10ge1xuICAgIGxldCBwcyA9IHBhcnRpdGlvbihub2RlcywgdGhpcy5lcnJvcnMpO1xuICAgIHJldHVybiBMaXN0V3JhcHBlci5mbGF0dGVuKHBzLm1hcChwID0+IHRoaXMuX3Byb2Nlc3NJMThuUGFydChwKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfbWVyZ2VUcmVlcyhwOiBQYXJ0LCB0cmFuc2xhdGVkOiBIdG1sQXN0W10sIG9yaWdpbmFsOiBIdG1sQXN0W10pOiBIdG1sQXN0W10ge1xuICAgIGxldCBsID0gbmV3IF9DcmVhdGVOb2RlTWFwcGluZygpO1xuICAgIGh0bWxWaXNpdEFsbChsLCBvcmlnaW5hbCk7XG5cbiAgICAvLyBtZXJnZSB0aGUgdHJhbnNsYXRlZCB0cmVlIHdpdGggdGhlIG9yaWdpbmFsIHRyZWUuXG4gICAgLy8gd2UgZG8gaXQgYnkgcHJlc2VydmluZyB0aGUgc291cmNlIGNvZGUgcG9zaXRpb24gb2YgdGhlIG9yaWdpbmFsIHRyZWVcbiAgICBsZXQgbWVyZ2VkID0gdGhpcy5fbWVyZ2VUcmVlc0hlbHBlcih0cmFuc2xhdGVkLCBsLm1hcHBpbmcpO1xuXG4gICAgLy8gaWYgdGhlIHJvb3QgZWxlbWVudCBpcyBwcmVzZW50LCB3ZSBuZWVkIHRvIGNyZWF0ZSBhIG5ldyByb290IGVsZW1lbnQgd2l0aCBpdHMgYXR0cmlidXRlc1xuICAgIC8vIHRyYW5zbGF0ZWRcbiAgICBpZiAoaXNQcmVzZW50KHAucm9vdEVsZW1lbnQpKSB7XG4gICAgICBsZXQgcm9vdCA9IHAucm9vdEVsZW1lbnQ7XG4gICAgICBsZXQgYXR0cnMgPSB0aGlzLl9pMThuQXR0cmlidXRlcyhyb290KTtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIG5ldyBIdG1sRWxlbWVudEFzdChyb290Lm5hbWUsIGF0dHJzLCBtZXJnZWQsIHJvb3Quc291cmNlU3Bhbiwgcm9vdC5zdGFydFNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICByb290LmVuZFNvdXJjZVNwYW4pXG4gICAgICBdO1xuXG4gICAgICAvLyB0aGlzIHNob3VsZCBuZXZlciBoYXBwZW4gd2l0aCBhIHBhcnQuIFBhcnRzIHRoYXQgaGF2ZSByb290IHRleHQgbm9kZSBzaG91bGQgbm90IGJlIG1lcmdlZC5cbiAgICB9IGVsc2UgaWYgKGlzUHJlc2VudChwLnJvb3RUZXh0Tm9kZSkpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFwic2hvdWxkIG5vdCBiZSByZWFjaGVkXCIpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtZXJnZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbWVyZ2VUcmVlc0hlbHBlcih0cmFuc2xhdGVkOiBIdG1sQXN0W10sIG1hcHBpbmc6IEh0bWxBc3RbXSk6IEh0bWxBc3RbXSB7XG4gICAgcmV0dXJuIHRyYW5zbGF0ZWQubWFwKHQgPT4ge1xuICAgICAgaWYgKHQgaW5zdGFuY2VvZiBIdG1sRWxlbWVudEFzdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWVyZ2VFbGVtZW50T3JJbnRlcnBvbGF0aW9uKHQsIHRyYW5zbGF0ZWQsIG1hcHBpbmcpO1xuXG4gICAgICB9IGVsc2UgaWYgKHQgaW5zdGFuY2VvZiBIdG1sVGV4dEFzdCkge1xuICAgICAgICByZXR1cm4gdDtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXCJzaG91bGQgbm90IGJlIHJlYWNoZWRcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9tZXJnZUVsZW1lbnRPckludGVycG9sYXRpb24odDogSHRtbEVsZW1lbnRBc3QsIHRyYW5zbGF0ZWQ6IEh0bWxBc3RbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcHBpbmc6IEh0bWxBc3RbXSk6IEh0bWxBc3Qge1xuICAgIGxldCBuYW1lID0gdGhpcy5fZ2V0TmFtZSh0KTtcbiAgICBsZXQgdHlwZSA9IG5hbWVbMF07XG4gICAgbGV0IGluZGV4ID0gTnVtYmVyV3JhcHBlci5wYXJzZUludChuYW1lLnN1YnN0cmluZygxKSwgMTApO1xuICAgIGxldCBvcmlnaW5hbE5vZGUgPSBtYXBwaW5nW2luZGV4XTtcblxuICAgIGlmICh0eXBlID09IFwidFwiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWVyZ2VUZXh0SW50ZXJwb2xhdGlvbih0LCA8SHRtbFRleHRBc3Q+b3JpZ2luYWxOb2RlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJlXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tZXJnZUVsZW1lbnQodCwgPEh0bWxFbGVtZW50QXN0Pm9yaWdpbmFsTm9kZSwgbWFwcGluZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFwic2hvdWxkIG5vdCBiZSByZWFjaGVkXCIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dldE5hbWUodDogSHRtbEVsZW1lbnRBc3QpOiBzdHJpbmcge1xuICAgIGlmICh0Lm5hbWUgIT0gX1BMQUNFSE9MREVSX0VMRU1FTlQpIHtcbiAgICAgIHRocm93IG5ldyBJMThuRXJyb3IoXG4gICAgICAgICAgdC5zb3VyY2VTcGFuLFxuICAgICAgICAgIGBVbmV4cGVjdGVkIHRhZyBcIiR7dC5uYW1lfVwiLiBPbmx5IFwiJHtfUExBQ0VIT0xERVJfRUxFTUVOVH1cIiB0YWdzIGFyZSBhbGxvd2VkLmApO1xuICAgIH1cbiAgICBsZXQgbmFtZXMgPSB0LmF0dHJzLmZpbHRlcihhID0+IGEubmFtZSA9PSBfTkFNRV9BVFRSKTtcbiAgICBpZiAobmFtZXMubGVuZ3RoID09IDApIHtcbiAgICAgIHRocm93IG5ldyBJMThuRXJyb3IodC5zb3VyY2VTcGFuLCBgTWlzc2luZyBcIiR7X05BTUVfQVRUUn1cIiBhdHRyaWJ1dGUuYCk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lc1swXS52YWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX21lcmdlVGV4dEludGVycG9sYXRpb24odDogSHRtbEVsZW1lbnRBc3QsIG9yaWdpbmFsTm9kZTogSHRtbFRleHRBc3QpOiBIdG1sVGV4dEFzdCB7XG4gICAgbGV0IHNwbGl0ID1cbiAgICAgICAgdGhpcy5fcGFyc2VyLnNwbGl0SW50ZXJwb2xhdGlvbihvcmlnaW5hbE5vZGUudmFsdWUsIG9yaWdpbmFsTm9kZS5zb3VyY2VTcGFuLnRvU3RyaW5nKCkpO1xuICAgIGxldCBleHBzID0gaXNQcmVzZW50KHNwbGl0KSA/IHNwbGl0LmV4cHJlc3Npb25zIDogW107XG5cbiAgICBsZXQgbWVzc2FnZVN1YnN0cmluZyA9XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzQ29udGVudC5zdWJzdHJpbmcodC5zdGFydFNvdXJjZVNwYW4uZW5kLm9mZnNldCwgdC5lbmRTb3VyY2VTcGFuLnN0YXJ0Lm9mZnNldCk7XG4gICAgbGV0IHRyYW5zbGF0ZWQgPVxuICAgICAgICB0aGlzLl9yZXBsYWNlUGxhY2Vob2xkZXJzV2l0aEV4cHJlc3Npb25zKG1lc3NhZ2VTdWJzdHJpbmcsIGV4cHMsIG9yaWdpbmFsTm9kZS5zb3VyY2VTcGFuKTtcblxuICAgIHJldHVybiBuZXcgSHRtbFRleHRBc3QodHJhbnNsYXRlZCwgb3JpZ2luYWxOb2RlLnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfbWVyZ2VFbGVtZW50KHQ6IEh0bWxFbGVtZW50QXN0LCBvcmlnaW5hbE5vZGU6IEh0bWxFbGVtZW50QXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwcGluZzogSHRtbEFzdFtdKTogSHRtbEVsZW1lbnRBc3Qge1xuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuX21lcmdlVHJlZXNIZWxwZXIodC5jaGlsZHJlbiwgbWFwcGluZyk7XG4gICAgcmV0dXJuIG5ldyBIdG1sRWxlbWVudEFzdChvcmlnaW5hbE5vZGUubmFtZSwgdGhpcy5faTE4bkF0dHJpYnV0ZXMob3JpZ2luYWxOb2RlKSwgY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbE5vZGUuc291cmNlU3Bhbiwgb3JpZ2luYWxOb2RlLnN0YXJ0U291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsTm9kZS5lbmRTb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHByaXZhdGUgX2kxOG5BdHRyaWJ1dGVzKGVsOiBIdG1sRWxlbWVudEFzdCk6IEh0bWxBdHRyQXN0W10ge1xuICAgIGxldCByZXMgPSBbXTtcbiAgICBlbC5hdHRycy5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKEkxOE5fQVRUUl9QUkVGSVgpIHx8IGF0dHIubmFtZSA9PSBJMThOX0FUVFIpIHJldHVybjtcblxuICAgICAgbGV0IGkxOG5zID0gZWwuYXR0cnMuZmlsdGVyKGEgPT4gYS5uYW1lID09IGBpMThuLSR7YXR0ci5uYW1lfWApO1xuICAgICAgaWYgKGkxOG5zLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJlcy5wdXNoKGF0dHIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBpMThuID0gaTE4bnNbMF07XG4gICAgICBsZXQgbWVzc2FnZUlkID0gaWQobWVzc2FnZUZyb21BdHRyaWJ1dGUodGhpcy5fcGFyc2VyLCBlbCwgaTE4bikpO1xuXG4gICAgICBpZiAoU3RyaW5nTWFwV3JhcHBlci5jb250YWlucyh0aGlzLl9tZXNzYWdlcywgbWVzc2FnZUlkKSkge1xuICAgICAgICBsZXQgdXBkYXRlZE1lc3NhZ2UgPSB0aGlzLl9yZXBsYWNlSW50ZXJwb2xhdGlvbkluQXR0cihhdHRyLCB0aGlzLl9tZXNzYWdlc1ttZXNzYWdlSWRdKTtcbiAgICAgICAgcmVzLnB1c2gobmV3IEh0bWxBdHRyQXN0KGF0dHIubmFtZSwgdXBkYXRlZE1lc3NhZ2UsIGF0dHIuc291cmNlU3BhbikpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgSTE4bkVycm9yKGF0dHIuc291cmNlU3BhbiwgYENhbm5vdCBmaW5kIG1lc3NhZ2UgZm9yIGlkICcke21lc3NhZ2VJZH0nYCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHByaXZhdGUgX3JlcGxhY2VJbnRlcnBvbGF0aW9uSW5BdHRyKGF0dHI6IEh0bWxBdHRyQXN0LCBtc2c6IEh0bWxBc3RbXSk6IHN0cmluZyB7XG4gICAgbGV0IHNwbGl0ID0gdGhpcy5fcGFyc2VyLnNwbGl0SW50ZXJwb2xhdGlvbihhdHRyLnZhbHVlLCBhdHRyLnNvdXJjZVNwYW4udG9TdHJpbmcoKSk7XG4gICAgbGV0IGV4cHMgPSBpc1ByZXNlbnQoc3BsaXQpID8gc3BsaXQuZXhwcmVzc2lvbnMgOiBbXTtcblxuICAgIGxldCBmaXJzdCA9IG1zZ1swXTtcbiAgICBsZXQgbGFzdCA9IG1zZ1ttc2cubGVuZ3RoIC0gMV07XG5cbiAgICBsZXQgc3RhcnQgPSBmaXJzdC5zb3VyY2VTcGFuLnN0YXJ0Lm9mZnNldDtcbiAgICBsZXQgZW5kID1cbiAgICAgICAgbGFzdCBpbnN0YW5jZW9mIEh0bWxFbGVtZW50QXN0ID8gbGFzdC5lbmRTb3VyY2VTcGFuLmVuZC5vZmZzZXQgOiBsYXN0LnNvdXJjZVNwYW4uZW5kLm9mZnNldDtcbiAgICBsZXQgbWVzc2FnZVN1YnN0cmluZyA9IHRoaXMuX21lc3NhZ2VzQ29udGVudC5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG5cbiAgICByZXR1cm4gdGhpcy5fcmVwbGFjZVBsYWNlaG9sZGVyc1dpdGhFeHByZXNzaW9ucyhtZXNzYWdlU3Vic3RyaW5nLCBleHBzLCBhdHRyLnNvdXJjZVNwYW4pO1xuICB9O1xuXG4gIHByaXZhdGUgX3JlcGxhY2VQbGFjZWhvbGRlcnNXaXRoRXhwcmVzc2lvbnMobWVzc2FnZTogc3RyaW5nLCBleHBzOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pOiBzdHJpbmcge1xuICAgIHJldHVybiBSZWdFeHBXcmFwcGVyLnJlcGxhY2VBbGwoX1BMQUNFSE9MREVSX0VYUEFOREVEX1JFR0VYUCwgbWVzc2FnZSwgKG1hdGNoKSA9PiB7XG4gICAgICBsZXQgbmFtZVdpdGhRdW90ZXMgPSBtYXRjaFsyXTtcbiAgICAgIGxldCBuYW1lID0gbmFtZVdpdGhRdW90ZXMuc3Vic3RyaW5nKDEsIG5hbWVXaXRoUXVvdGVzLmxlbmd0aCAtIDEpO1xuICAgICAgbGV0IGluZGV4ID0gTnVtYmVyV3JhcHBlci5wYXJzZUludChuYW1lLCAxMCk7XG4gICAgICByZXR1cm4gdGhpcy5fY29udmVydEludG9FeHByZXNzaW9uKGluZGV4LCBleHBzLCBzb3VyY2VTcGFuKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnZlcnRJbnRvRXhwcmVzc2lvbihpbmRleDogbnVtYmVyLCBleHBzOiBzdHJpbmdbXSwgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7XG4gICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCBleHBzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGB7eyR7ZXhwc1tpbmRleF19fX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgSTE4bkVycm9yKHNvdXJjZVNwYW4sIGBJbnZhbGlkIGludGVycG9sYXRpb24gaW5kZXggJyR7aW5kZXh9J2ApO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBfQ3JlYXRlTm9kZU1hcHBpbmcgaW1wbGVtZW50cyBIdG1sQXN0VmlzaXRvciB7XG4gIG1hcHBpbmc6IEh0bWxBc3RbXSA9IFtdO1xuXG4gIHZpc2l0RWxlbWVudChhc3Q6IEh0bWxFbGVtZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRoaXMubWFwcGluZy5wdXNoKGFzdCk7XG4gICAgaHRtbFZpc2l0QWxsKHRoaXMsIGFzdC5jaGlsZHJlbik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2aXNpdEF0dHIoYXN0OiBIdG1sQXR0ckFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cblxuICB2aXNpdFRleHQoYXN0OiBIdG1sVGV4dEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB0aGlzLm1hcHBpbmcucHVzaChhc3QpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRDb21tZW50KGFzdDogSHRtbENvbW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBcIlwiOyB9XG59Il19