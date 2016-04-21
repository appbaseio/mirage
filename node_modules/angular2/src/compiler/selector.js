'use strict';"use strict";
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var _EMPTY_ATTR_VALUE = '';
// TODO: Can't use `const` here as
// in Dart this is not transpiled into `final` yet...
var _SELECTOR_REGEXP = lang_1.RegExpWrapper.create('(\\:not\\()|' +
    '([-\\w]+)|' +
    '(?:\\.([-\\w]+))|' +
    '(?:\\[([-\\w*]+)(?:=([^\\]]*))?\\])|' +
    '(\\))|' +
    '(\\s*,\\s*)'); // ","
/**
 * A css selector contains an element name,
 * css classes and attribute/value pairs with the purpose
 * of selecting subsets out of them.
 */
var CssSelector = (function () {
    function CssSelector() {
        this.element = null;
        this.classNames = [];
        this.attrs = [];
        this.notSelectors = [];
    }
    CssSelector.parse = function (selector) {
        var results = [];
        var _addResult = function (res, cssSel) {
            if (cssSel.notSelectors.length > 0 && lang_1.isBlank(cssSel.element) &&
                collection_1.ListWrapper.isEmpty(cssSel.classNames) && collection_1.ListWrapper.isEmpty(cssSel.attrs)) {
                cssSel.element = "*";
            }
            res.push(cssSel);
        };
        var cssSelector = new CssSelector();
        var matcher = lang_1.RegExpWrapper.matcher(_SELECTOR_REGEXP, selector);
        var match;
        var current = cssSelector;
        var inNot = false;
        while (lang_1.isPresent(match = lang_1.RegExpMatcherWrapper.next(matcher))) {
            if (lang_1.isPresent(match[1])) {
                if (inNot) {
                    throw new exceptions_1.BaseException('Nesting :not is not allowed in a selector');
                }
                inNot = true;
                current = new CssSelector();
                cssSelector.notSelectors.push(current);
            }
            if (lang_1.isPresent(match[2])) {
                current.setElement(match[2]);
            }
            if (lang_1.isPresent(match[3])) {
                current.addClassName(match[3]);
            }
            if (lang_1.isPresent(match[4])) {
                current.addAttribute(match[4], match[5]);
            }
            if (lang_1.isPresent(match[6])) {
                inNot = false;
                current = cssSelector;
            }
            if (lang_1.isPresent(match[7])) {
                if (inNot) {
                    throw new exceptions_1.BaseException('Multiple selectors in :not are not supported');
                }
                _addResult(results, cssSelector);
                cssSelector = current = new CssSelector();
            }
        }
        _addResult(results, cssSelector);
        return results;
    };
    CssSelector.prototype.isElementSelector = function () {
        return lang_1.isPresent(this.element) && collection_1.ListWrapper.isEmpty(this.classNames) &&
            collection_1.ListWrapper.isEmpty(this.attrs) && this.notSelectors.length === 0;
    };
    CssSelector.prototype.setElement = function (element) {
        if (element === void 0) { element = null; }
        this.element = element;
    };
    /** Gets a template string for an element that matches the selector. */
    CssSelector.prototype.getMatchingElementTemplate = function () {
        var tagName = lang_1.isPresent(this.element) ? this.element : 'div';
        var classAttr = this.classNames.length > 0 ? " class=\"" + this.classNames.join(' ') + "\"" : '';
        var attrs = '';
        for (var i = 0; i < this.attrs.length; i += 2) {
            var attrName = this.attrs[i];
            var attrValue = this.attrs[i + 1] !== '' ? "=\"" + this.attrs[i + 1] + "\"" : '';
            attrs += " " + attrName + attrValue;
        }
        return "<" + tagName + classAttr + attrs + "></" + tagName + ">";
    };
    CssSelector.prototype.addAttribute = function (name, value) {
        if (value === void 0) { value = _EMPTY_ATTR_VALUE; }
        this.attrs.push(name);
        if (lang_1.isPresent(value)) {
            value = value.toLowerCase();
        }
        else {
            value = _EMPTY_ATTR_VALUE;
        }
        this.attrs.push(value);
    };
    CssSelector.prototype.addClassName = function (name) { this.classNames.push(name.toLowerCase()); };
    CssSelector.prototype.toString = function () {
        var res = '';
        if (lang_1.isPresent(this.element)) {
            res += this.element;
        }
        if (lang_1.isPresent(this.classNames)) {
            for (var i = 0; i < this.classNames.length; i++) {
                res += '.' + this.classNames[i];
            }
        }
        if (lang_1.isPresent(this.attrs)) {
            for (var i = 0; i < this.attrs.length;) {
                var attrName = this.attrs[i++];
                var attrValue = this.attrs[i++];
                res += '[' + attrName;
                if (attrValue.length > 0) {
                    res += '=' + attrValue;
                }
                res += ']';
            }
        }
        this.notSelectors.forEach(function (notSelector) { return res += ":not(" + notSelector + ")"; });
        return res;
    };
    return CssSelector;
}());
exports.CssSelector = CssSelector;
/**
 * Reads a list of CssSelectors and allows to calculate which ones
 * are contained in a given CssSelector.
 */
var SelectorMatcher = (function () {
    function SelectorMatcher() {
        this._elementMap = new collection_1.Map();
        this._elementPartialMap = new collection_1.Map();
        this._classMap = new collection_1.Map();
        this._classPartialMap = new collection_1.Map();
        this._attrValueMap = new collection_1.Map();
        this._attrValuePartialMap = new collection_1.Map();
        this._listContexts = [];
    }
    SelectorMatcher.createNotMatcher = function (notSelectors) {
        var notMatcher = new SelectorMatcher();
        notMatcher.addSelectables(notSelectors, null);
        return notMatcher;
    };
    SelectorMatcher.prototype.addSelectables = function (cssSelectors, callbackCtxt) {
        var listContext = null;
        if (cssSelectors.length > 1) {
            listContext = new SelectorListContext(cssSelectors);
            this._listContexts.push(listContext);
        }
        for (var i = 0; i < cssSelectors.length; i++) {
            this._addSelectable(cssSelectors[i], callbackCtxt, listContext);
        }
    };
    /**
     * Add an object that can be found later on by calling `match`.
     * @param cssSelector A css selector
     * @param callbackCtxt An opaque object that will be given to the callback of the `match` function
     */
    SelectorMatcher.prototype._addSelectable = function (cssSelector, callbackCtxt, listContext) {
        var matcher = this;
        var element = cssSelector.element;
        var classNames = cssSelector.classNames;
        var attrs = cssSelector.attrs;
        var selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
        if (lang_1.isPresent(element)) {
            var isTerminal = attrs.length === 0 && classNames.length === 0;
            if (isTerminal) {
                this._addTerminal(matcher._elementMap, element, selectable);
            }
            else {
                matcher = this._addPartial(matcher._elementPartialMap, element);
            }
        }
        if (lang_1.isPresent(classNames)) {
            for (var index = 0; index < classNames.length; index++) {
                var isTerminal = attrs.length === 0 && index === classNames.length - 1;
                var className = classNames[index];
                if (isTerminal) {
                    this._addTerminal(matcher._classMap, className, selectable);
                }
                else {
                    matcher = this._addPartial(matcher._classPartialMap, className);
                }
            }
        }
        if (lang_1.isPresent(attrs)) {
            for (var index = 0; index < attrs.length;) {
                var isTerminal = index === attrs.length - 2;
                var attrName = attrs[index++];
                var attrValue = attrs[index++];
                if (isTerminal) {
                    var terminalMap = matcher._attrValueMap;
                    var terminalValuesMap = terminalMap.get(attrName);
                    if (lang_1.isBlank(terminalValuesMap)) {
                        terminalValuesMap = new collection_1.Map();
                        terminalMap.set(attrName, terminalValuesMap);
                    }
                    this._addTerminal(terminalValuesMap, attrValue, selectable);
                }
                else {
                    var parttialMap = matcher._attrValuePartialMap;
                    var partialValuesMap = parttialMap.get(attrName);
                    if (lang_1.isBlank(partialValuesMap)) {
                        partialValuesMap = new collection_1.Map();
                        parttialMap.set(attrName, partialValuesMap);
                    }
                    matcher = this._addPartial(partialValuesMap, attrValue);
                }
            }
        }
    };
    SelectorMatcher.prototype._addTerminal = function (map, name, selectable) {
        var terminalList = map.get(name);
        if (lang_1.isBlank(terminalList)) {
            terminalList = [];
            map.set(name, terminalList);
        }
        terminalList.push(selectable);
    };
    SelectorMatcher.prototype._addPartial = function (map, name) {
        var matcher = map.get(name);
        if (lang_1.isBlank(matcher)) {
            matcher = new SelectorMatcher();
            map.set(name, matcher);
        }
        return matcher;
    };
    /**
     * Find the objects that have been added via `addSelectable`
     * whose css selector is contained in the given css selector.
     * @param cssSelector A css selector
     * @param matchedCallback This callback will be called with the object handed into `addSelectable`
     * @return boolean true if a match was found
    */
    SelectorMatcher.prototype.match = function (cssSelector, matchedCallback) {
        var result = false;
        var element = cssSelector.element;
        var classNames = cssSelector.classNames;
        var attrs = cssSelector.attrs;
        for (var i = 0; i < this._listContexts.length; i++) {
            this._listContexts[i].alreadyMatched = false;
        }
        result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
        result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) ||
            result;
        if (lang_1.isPresent(classNames)) {
            for (var index = 0; index < classNames.length; index++) {
                var className = classNames[index];
                result =
                    this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
                result =
                    this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) ||
                        result;
            }
        }
        if (lang_1.isPresent(attrs)) {
            for (var index = 0; index < attrs.length;) {
                var attrName = attrs[index++];
                var attrValue = attrs[index++];
                var terminalValuesMap = this._attrValueMap.get(attrName);
                if (!lang_1.StringWrapper.equals(attrValue, _EMPTY_ATTR_VALUE)) {
                    result = this._matchTerminal(terminalValuesMap, _EMPTY_ATTR_VALUE, cssSelector, matchedCallback) ||
                        result;
                }
                result = this._matchTerminal(terminalValuesMap, attrValue, cssSelector, matchedCallback) ||
                    result;
                var partialValuesMap = this._attrValuePartialMap.get(attrName);
                if (!lang_1.StringWrapper.equals(attrValue, _EMPTY_ATTR_VALUE)) {
                    result = this._matchPartial(partialValuesMap, _EMPTY_ATTR_VALUE, cssSelector, matchedCallback) ||
                        result;
                }
                result =
                    this._matchPartial(partialValuesMap, attrValue, cssSelector, matchedCallback) || result;
            }
        }
        return result;
    };
    /** @internal */
    SelectorMatcher.prototype._matchTerminal = function (map, name, cssSelector, matchedCallback) {
        if (lang_1.isBlank(map) || lang_1.isBlank(name)) {
            return false;
        }
        var selectables = map.get(name);
        var starSelectables = map.get("*");
        if (lang_1.isPresent(starSelectables)) {
            selectables = selectables.concat(starSelectables);
        }
        if (lang_1.isBlank(selectables)) {
            return false;
        }
        var selectable;
        var result = false;
        for (var index = 0; index < selectables.length; index++) {
            selectable = selectables[index];
            result = selectable.finalize(cssSelector, matchedCallback) || result;
        }
        return result;
    };
    /** @internal */
    SelectorMatcher.prototype._matchPartial = function (map, name, cssSelector, matchedCallback /*: (c: CssSelector, a: any) => void*/) {
        if (lang_1.isBlank(map) || lang_1.isBlank(name)) {
            return false;
        }
        var nestedSelector = map.get(name);
        if (lang_1.isBlank(nestedSelector)) {
            return false;
        }
        // TODO(perf): get rid of recursion and measure again
        // TODO(perf): don't pass the whole selector into the recursion,
        // but only the not processed parts
        return nestedSelector.match(cssSelector, matchedCallback);
    };
    return SelectorMatcher;
}());
exports.SelectorMatcher = SelectorMatcher;
var SelectorListContext = (function () {
    function SelectorListContext(selectors) {
        this.selectors = selectors;
        this.alreadyMatched = false;
    }
    return SelectorListContext;
}());
exports.SelectorListContext = SelectorListContext;
// Store context to pass back selector and context when a selector is matched
var SelectorContext = (function () {
    function SelectorContext(selector, cbContext, listContext) {
        this.selector = selector;
        this.cbContext = cbContext;
        this.listContext = listContext;
        this.notSelectors = selector.notSelectors;
    }
    SelectorContext.prototype.finalize = function (cssSelector, callback) {
        var result = true;
        if (this.notSelectors.length > 0 &&
            (lang_1.isBlank(this.listContext) || !this.listContext.alreadyMatched)) {
            var notMatcher = SelectorMatcher.createNotMatcher(this.notSelectors);
            result = !notMatcher.match(cssSelector, null);
        }
        if (result && lang_1.isPresent(callback) &&
            (lang_1.isBlank(this.listContext) || !this.listContext.alreadyMatched)) {
            if (lang_1.isPresent(this.listContext)) {
                this.listContext.alreadyMatched = true;
            }
            callback(this.selector, this.cbContext);
        }
        return result;
    };
    return SelectorContext;
}());
exports.SelectorContext = SelectorContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvc2VsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDJCQUEyQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzVFLHFCQU1PLDBCQUEwQixDQUFDLENBQUE7QUFDbEMsMkJBQThDLGdDQUFnQyxDQUFDLENBQUE7QUFFL0UsSUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFFN0Isa0NBQWtDO0FBQ2xDLHFEQUFxRDtBQUNyRCxJQUFJLGdCQUFnQixHQUFHLG9CQUFhLENBQUMsTUFBTSxDQUN2QyxjQUFjO0lBQ2QsWUFBWTtJQUNaLG1CQUFtQjtJQUNuQixzQ0FBc0M7SUFDdEMsUUFBUTtJQUNSLGFBQWEsQ0FBQyxDQUFDLENBQTJCLE1BQU07QUFFcEQ7Ozs7R0FJRztBQUNIO0lBQUE7UUFDRSxZQUFPLEdBQVcsSUFBSSxDQUFDO1FBQ3ZCLGVBQVUsR0FBYSxFQUFFLENBQUM7UUFDMUIsVUFBSyxHQUFhLEVBQUUsQ0FBQztRQUNyQixpQkFBWSxHQUFrQixFQUFFLENBQUM7SUE0R25DLENBQUM7SUExR1EsaUJBQUssR0FBWixVQUFhLFFBQWdCO1FBQzNCLElBQUksT0FBTyxHQUFrQixFQUFFLENBQUM7UUFDaEMsSUFBSSxVQUFVLEdBQUcsVUFBQyxHQUFrQixFQUFFLE1BQU07WUFDMUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLGNBQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUN6RCx3QkFBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksd0JBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEYsTUFBTSxD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LENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQzVCLENBQUMsY0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLElBQUksVUFBVSxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckUsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxnQkFBUyxDQUFDLFFBQVEsQ0FBQztZQUM3QixDQUFDLGNBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRSxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztZQUN6QyxDQUFDO1lBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUF4QkQsSUF3QkM7QUF4QlksdUJBQWUsa0JBd0IzQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNYXAsIExpc3RXcmFwcGVyLCBNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtcbiAgaXNQcmVzZW50LFxuICBpc0JsYW5rLFxuICBSZWdFeHBXcmFwcGVyLFxuICBSZWdFeHBNYXRjaGVyV3JhcHBlcixcbiAgU3RyaW5nV3JhcHBlclxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBXcmFwcGVkRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuXG5jb25zdCBfRU1QVFlfQVRUUl9WQUxVRSA9ICcnO1xuXG4vLyBUT0RPOiBDYW4ndCB1c2UgYGNvbnN0YCBoZXJlIGFzXG4vLyBpbiBEYXJ0IHRoaXMgaXMgbm90IHRyYW5zcGlsZWQgaW50byBgZmluYWxgIHlldC4uLlxudmFyIF9TRUxFQ1RPUl9SRUdFWFAgPSBSZWdFeHBXcmFwcGVyLmNyZWF0ZShcbiAgICAnKFxcXFw6bm90XFxcXCgpfCcgKyAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cIjpub3QoXCJcbiAgICAnKFstXFxcXHddKyl8JyArICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwidGFnXCJcbiAgICAnKD86XFxcXC4oWy1cXFxcd10rKSl8JyArICAgICAgICAgICAgICAgICAgICAgLy8gXCIuY2xhc3NcIlxuICAgICcoPzpcXFxcWyhbLVxcXFx3Kl0rKSg/Oj0oW15cXFxcXV0qKSk/XFxcXF0pfCcgKyAgLy8gXCJbbmFtZV1cIiwgXCJbbmFtZT12YWx1ZV1cIiBvciBcIltuYW1lKj12YWx1ZV1cIlxuICAgICcoXFxcXCkpfCcgKyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCIpXCJcbiAgICAnKFxcXFxzKixcXFxccyopJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCIsXCJcblxuLyoqXG4gKiBBIGNzcyBzZWxlY3RvciBjb250YWlucyBhbiBlbGVtZW50IG5hbWUsXG4gKiBjc3MgY2xhc3NlcyBhbmQgYXR0cmlidXRlL3ZhbHVlIHBhaXJzIHdpdGggdGhlIHB1cnBvc2VcbiAqIG9mIHNlbGVjdGluZyBzdWJzZXRzIG91dCBvZiB0aGVtLlxuICovXG5leHBvcnQgY2xhc3MgQ3NzU2VsZWN0b3Ige1xuICBlbGVtZW50OiBzdHJpbmcgPSBudWxsO1xuICBjbGFzc05hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICBhdHRyczogc3RyaW5nW10gPSBbXTtcbiAgbm90U2VsZWN0b3JzOiBDc3NTZWxlY3RvcltdID0gW107XG5cbiAgc3RhdGljIHBhcnNlKHNlbGVjdG9yOiBzdHJpbmcpOiBDc3NTZWxlY3RvcltdIHtcbiAgICB2YXIgcmVzdWx0czogQ3NzU2VsZWN0b3JbXSA9IFtdO1xuICAgIHZhciBfYWRkUmVzdWx0ID0gKHJlczogQ3NzU2VsZWN0b3JbXSwgY3NzU2VsKSA9PiB7XG4gICAgICBpZiAoY3NzU2VsLm5vdFNlbGVjdG9ycy5sZW5ndGggPiAwICYmIGlzQmxhbmsoY3NzU2VsLmVsZW1lbnQpICYmXG4gICAgICAgICAgTGlzdFdyYXBwZXIuaXNFbXB0eShjc3NTZWwuY2xhc3NOYW1lcykgJiYgTGlzdFdyYXBwZXIuaXNFbXB0eShjc3NTZWwuYXR0cnMpKSB7XG4gICAgICAgIGNzc1NlbC5lbGVtZW50ID0gXCIqXCI7XG4gICAgICB9XG4gICAgICByZXMucHVzaChjc3NTZWwpO1xuICAgIH07XG4gICAgdmFyIGNzc1NlbGVjdG9yID0gbmV3IENzc1NlbGVjdG9yKCk7XG4gICAgdmFyIG1hdGNoZXIgPSBSZWdFeHBXcmFwcGVyLm1hdGNoZXIoX1NFTEVDVE9SX1JFR0VYUCwgc2VsZWN0b3IpO1xuICAgIHZhciBtYXRjaDtcbiAgICB2YXIgY3VycmVudCA9IGNzc1NlbGVjdG9yO1xuICAgIHZhciBpbk5vdCA9IGZhbHNlO1xuICAgIHdoaWxlIChpc1ByZXNlbnQobWF0Y2ggPSBSZWdFeHBNYXRjaGVyV3JhcHBlci5uZXh0KG1hdGNoZXIpKSkge1xuICAgICAgaWYgKGlzUHJlc2VudChtYXRjaFsxXSkpIHtcbiAgICAgICAgaWYgKGluTm90KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oJ05lc3RpbmcgOm5vdCBpcyBub3QgYWxsb3dlZCBpbiBhIHNlbGVjdG9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgaW5Ob3QgPSB0cnVlO1xuICAgICAgICBjdXJyZW50ID0gbmV3IENzc1NlbGVjdG9yKCk7XG4gICAgICAgIGNzc1NlbGVjdG9yLm5vdFNlbGVjdG9ycy5wdXNoKGN1cnJlbnQpO1xuICAgICAgfVxuICAgICAgaWYgKGlzUHJlc2VudChtYXRjaFsyXSkpIHtcbiAgICAgICAgY3VycmVudC5zZXRFbGVtZW50KG1hdGNoWzJdKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1ByZXNlbnQobWF0Y2hbM10pKSB7XG4gICAgICAgIGN1cnJlbnQuYWRkQ2xhc3NOYW1lKG1hdGNoWzNdKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1ByZXNlbnQobWF0Y2hbNF0pKSB7XG4gICAgICAgIGN1cnJlbnQuYWRkQXR0cmlidXRlKG1hdGNoWzRdLCBtYXRjaFs1XSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNQcmVzZW50KG1hdGNoWzZdKSkge1xuICAgICAgICBpbk5vdCA9IGZhbHNlO1xuICAgICAgICBjdXJyZW50ID0gY3NzU2VsZWN0b3I7XG4gICAgICB9XG4gICAgICBpZiAoaXNQcmVzZW50KG1hdGNoWzddKSkge1xuICAgICAgICBpZiAoaW5Ob3QpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbignTXVsdGlwbGUgc2VsZWN0b3JzIGluIDpub3QgYXJlIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBfYWRkUmVzdWx0KHJlc3VsdHMsIGNzc1NlbGVjdG9yKTtcbiAgICAgICAgY3NzU2VsZWN0b3IgPSBjdXJyZW50ID0gbmV3IENzc1NlbGVjdG9yKCk7XG4gICAgICB9XG4gICAgfVxuICAgIF9hZGRSZXN1bHQocmVzdWx0cywgY3NzU2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgaXNFbGVtZW50U2VsZWN0b3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGlzUHJlc2VudCh0aGlzLmVsZW1lbnQpICYmIExpc3RXcmFwcGVyLmlzRW1wdHkodGhpcy5jbGFzc05hbWVzKSAmJlxuICAgICAgICAgICBMaXN0V3JhcHBlci5pc0VtcHR5KHRoaXMuYXR0cnMpICYmIHRoaXMubm90U2VsZWN0b3JzLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIHNldEVsZW1lbnQoZWxlbWVudDogc3RyaW5nID0gbnVsbCkgeyB0aGlzLmVsZW1lbnQgPSBlbGVtZW50OyB9XG5cbiAgLyoqIEdldHMgYSB0ZW1wbGF0ZSBzdHJpbmcgZm9yIGFuIGVsZW1lbnQgdGhhdCBtYXRjaGVzIHRoZSBzZWxlY3Rvci4gKi9cbiAgZ2V0TWF0Y2hpbmdFbGVtZW50VGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICBsZXQgdGFnTmFtZSA9IGlzUHJlc2VudCh0aGlzLmVsZW1lbnQpID8gdGhpcy5lbGVtZW50IDogJ2Rpdic7XG4gICAgbGV0IGNsYXNzQXR0ciA9IHRoaXMuY2xhc3NOYW1lcy5sZW5ndGggPiAwID8gYCBjbGFzcz1cIiR7dGhpcy5jbGFzc05hbWVzLmpvaW4oJyAnKX1cImAgOiAnJztcblxuICAgIGxldCBhdHRycyA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hdHRycy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgbGV0IGF0dHJOYW1lID0gdGhpcy5hdHRyc1tpXTtcbiAgICAgIGxldCBhdHRyVmFsdWUgPSB0aGlzLmF0dHJzW2kgKyAxXSAhPT0gJycgPyBgPVwiJHt0aGlzLmF0dHJzW2kgKyAxXX1cImAgOiAnJztcbiAgICAgIGF0dHJzICs9IGAgJHthdHRyTmFtZX0ke2F0dHJWYWx1ZX1gO1xuICAgIH1cblxuICAgIHJldHVybiBgPCR7dGFnTmFtZX0ke2NsYXNzQXR0cn0ke2F0dHJzfT48LyR7dGFnTmFtZX0+YDtcbiAgfVxuXG4gIGFkZEF0dHJpYnV0ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgPSBfRU1QVFlfQVRUUl9WQUxVRSkge1xuICAgIHRoaXMuYXR0cnMucHVzaChuYW1lKTtcbiAgICBpZiAoaXNQcmVzZW50KHZhbHVlKSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IF9FTVBUWV9BVFRSX1ZBTFVFO1xuICAgIH1cbiAgICB0aGlzLmF0dHJzLnB1c2godmFsdWUpO1xuICB9XG5cbiAgYWRkQ2xhc3NOYW1lKG5hbWU6IHN0cmluZykgeyB0aGlzLmNsYXNzTmFtZXMucHVzaChuYW1lLnRvTG93ZXJDYXNlKCkpOyB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICB2YXIgcmVzID0gJyc7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLmVsZW1lbnQpKSB7XG4gICAgICByZXMgKz0gdGhpcy5lbGVtZW50O1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuY2xhc3NOYW1lcykpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jbGFzc05hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlcyArPSAnLicgKyB0aGlzLmNsYXNzTmFtZXNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQodGhpcy5hdHRycykpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdHRycy5sZW5ndGg7KSB7XG4gICAgICAgIHZhciBhdHRyTmFtZSA9IHRoaXMuYXR0cnNbaSsrXTtcbiAgICAgICAgdmFyIGF0dHJWYWx1ZSA9IHRoaXMuYXR0cnNbaSsrXTtcbiAgICAgICAgcmVzICs9ICdbJyArIGF0dHJOYW1lO1xuICAgICAgICBpZiAoYXR0clZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXMgKz0gJz0nICsgYXR0clZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJlcyArPSAnXSc7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubm90U2VsZWN0b3JzLmZvckVhY2gobm90U2VsZWN0b3IgPT4gcmVzICs9IGA6bm90KCR7bm90U2VsZWN0b3J9KWApO1xuICAgIHJldHVybiByZXM7XG4gIH1cbn1cblxuLyoqXG4gKiBSZWFkcyBhIGxpc3Qgb2YgQ3NzU2VsZWN0b3JzIGFuZCBhbGxvd3MgdG8gY2FsY3VsYXRlIHdoaWNoIG9uZXNcbiAqIGFyZSBjb250YWluZWQgaW4gYSBnaXZlbiBDc3NTZWxlY3Rvci5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlbGVjdG9yTWF0Y2hlciB7XG4gIHN0YXRpYyBjcmVhdGVOb3RNYXRjaGVyKG5vdFNlbGVjdG9yczogQ3NzU2VsZWN0b3JbXSk6IFNlbGVjdG9yTWF0Y2hlciB7XG4gICAgdmFyIG5vdE1hdGNoZXIgPSBuZXcgU2VsZWN0b3JNYXRjaGVyKCk7XG4gICAgbm90TWF0Y2hlci5hZGRTZWxlY3RhYmxlcyhub3RTZWxlY3RvcnMsIG51bGwpO1xuICAgIHJldHVybiBub3RNYXRjaGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBfZWxlbWVudE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBTZWxlY3RvckNvbnRleHRbXT4oKTtcbiAgcHJpdmF0ZSBfZWxlbWVudFBhcnRpYWxNYXAgPSBuZXcgTWFwPHN0cmluZywgU2VsZWN0b3JNYXRjaGVyPigpO1xuICBwcml2YXRlIF9jbGFzc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBTZWxlY3RvckNvbnRleHRbXT4oKTtcbiAgcHJpdmF0ZSBfY2xhc3NQYXJ0aWFsTWFwID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWF0Y2hlcj4oKTtcbiAgcHJpdmF0ZSBfYXR0clZhbHVlTWFwID0gbmV3IE1hcDxzdHJpbmcsIE1hcDxzdHJpbmcsIFNlbGVjdG9yQ29udGV4dFtdPj4oKTtcbiAgcHJpdmF0ZSBfYXR0clZhbHVlUGFydGlhbE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBTZWxlY3Rvck1hdGNoZXI+PigpO1xuICBwcml2YXRlIF9saXN0Q29udGV4dHM6IFNlbGVjdG9yTGlzdENvbnRleHRbXSA9IFtdO1xuXG4gIGFkZFNlbGVjdGFibGVzKGNzc1NlbGVjdG9yczogQ3NzU2VsZWN0b3JbXSwgY2FsbGJhY2tDdHh0PzogYW55KSB7XG4gICAgdmFyIGxpc3RDb250ZXh0ID0gbnVsbDtcbiAgICBpZiAoY3NzU2VsZWN0b3JzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGxpc3RDb250ZXh0ID0gbmV3IFNlbGVjdG9yTGlzdENvbnRleHQoY3NzU2VsZWN0b3JzKTtcbiAgICAgIHRoaXMuX2xpc3RDb250ZXh0cy5wdXNoKGxpc3RDb250ZXh0KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjc3NTZWxlY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuX2FkZFNlbGVjdGFibGUoY3NzU2VsZWN0b3JzW2ldLCBjYWxsYmFja0N0eHQsIGxpc3RDb250ZXh0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIG9iamVjdCB0aGF0IGNhbiBiZSBmb3VuZCBsYXRlciBvbiBieSBjYWxsaW5nIGBtYXRjaGAuXG4gICAqIEBwYXJhbSBjc3NTZWxlY3RvciBBIGNzcyBzZWxlY3RvclxuICAgKiBAcGFyYW0gY2FsbGJhY2tDdHh0IEFuIG9wYXF1ZSBvYmplY3QgdGhhdCB3aWxsIGJlIGdpdmVuIHRvIHRoZSBjYWxsYmFjayBvZiB0aGUgYG1hdGNoYCBmdW5jdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBfYWRkU2VsZWN0YWJsZShjc3NTZWxlY3RvcjogQ3NzU2VsZWN0b3IsIGNhbGxiYWNrQ3R4dDogYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RDb250ZXh0OiBTZWxlY3Rvckxpc3RDb250ZXh0KSB7XG4gICAgdmFyIG1hdGNoZXI6IFNlbGVjdG9yTWF0Y2hlciA9IHRoaXM7XG4gICAgdmFyIGVsZW1lbnQgPSBjc3NTZWxlY3Rvci5lbGVtZW50O1xuICAgIHZhciBjbGFzc05hbWVzID0gY3NzU2VsZWN0b3IuY2xhc3NOYW1lcztcbiAgICB2YXIgYXR0cnMgPSBjc3NTZWxlY3Rvci5hdHRycztcbiAgICB2YXIgc2VsZWN0YWJsZSA9IG5ldyBTZWxlY3RvckNvbnRleHQoY3NzU2VsZWN0b3IsIGNhbGxiYWNrQ3R4dCwgbGlzdENvbnRleHQpO1xuXG4gICAgaWYgKGlzUHJlc2VudChlbGVtZW50KSkge1xuICAgICAgdmFyIGlzVGVybWluYWwgPSBhdHRycy5sZW5ndGggPT09IDAgJiYgY2xhc3NOYW1lcy5sZW5ndGggPT09IDA7XG4gICAgICBpZiAoaXNUZXJtaW5hbCkge1xuICAgICAgICB0aGlzLl9hZGRUZXJtaW5hbChtYXRjaGVyLl9lbGVtZW50TWFwLCBlbGVtZW50LCBzZWxlY3RhYmxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hdGNoZXIgPSB0aGlzLl9hZGRQYXJ0aWFsKG1hdGNoZXIuX2VsZW1lbnRQYXJ0aWFsTWFwLCBlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNQcmVzZW50KGNsYXNzTmFtZXMpKSB7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgY2xhc3NOYW1lcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIGlzVGVybWluYWwgPSBhdHRycy5sZW5ndGggPT09IDAgJiYgaW5kZXggPT09IGNsYXNzTmFtZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXNbaW5kZXhdO1xuICAgICAgICBpZiAoaXNUZXJtaW5hbCkge1xuICAgICAgICAgIHRoaXMuX2FkZFRlcm1pbmFsKG1hdGNoZXIuX2NsYXNzTWFwLCBjbGFzc05hbWUsIHNlbGVjdGFibGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hdGNoZXIgPSB0aGlzLl9hZGRQYXJ0aWFsKG1hdGNoZXIuX2NsYXNzUGFydGlhbE1hcCwgY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc1ByZXNlbnQoYXR0cnMpKSB7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXR0cnMubGVuZ3RoOykge1xuICAgICAgICB2YXIgaXNUZXJtaW5hbCA9IGluZGV4ID09PSBhdHRycy5sZW5ndGggLSAyO1xuICAgICAgICB2YXIgYXR0ck5hbWUgPSBhdHRyc1tpbmRleCsrXTtcbiAgICAgICAgdmFyIGF0dHJWYWx1ZSA9IGF0dHJzW2luZGV4KytdO1xuICAgICAgICBpZiAoaXNUZXJtaW5hbCkge1xuICAgICAgICAgIHZhciB0ZXJtaW5hbE1hcCA9IG1hdGNoZXIuX2F0dHJWYWx1ZU1hcDtcbiAgICAgICAgICB2YXIgdGVybWluYWxWYWx1ZXNNYXAgPSB0ZXJtaW5hbE1hcC5nZXQoYXR0ck5hbWUpO1xuICAgICAgICAgIGlmIChpc0JsYW5rKHRlcm1pbmFsVmFsdWVzTWFwKSkge1xuICAgICAgICAgICAgdGVybWluYWxWYWx1ZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgU2VsZWN0b3JDb250ZXh0W10+KCk7XG4gICAgICAgICAgICB0ZXJtaW5hbE1hcC5zZXQoYXR0ck5hbWUsIHRlcm1pbmFsVmFsdWVzTWFwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fYWRkVGVybWluYWwodGVybWluYWxWYWx1ZXNNYXAsIGF0dHJWYWx1ZSwgc2VsZWN0YWJsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHBhcnR0aWFsTWFwID0gbWF0Y2hlci5fYXR0clZhbHVlUGFydGlhbE1hcDtcbiAgICAgICAgICB2YXIgcGFydGlhbFZhbHVlc01hcCA9IHBhcnR0aWFsTWFwLmdldChhdHRyTmFtZSk7XG4gICAgICAgICAgaWYgKGlzQmxhbmsocGFydGlhbFZhbHVlc01hcCkpIHtcbiAgICAgICAgICAgIHBhcnRpYWxWYWx1ZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgU2VsZWN0b3JNYXRjaGVyPigpO1xuICAgICAgICAgICAgcGFydHRpYWxNYXAuc2V0KGF0dHJOYW1lLCBwYXJ0aWFsVmFsdWVzTWFwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWF0Y2hlciA9IHRoaXMuX2FkZFBhcnRpYWwocGFydGlhbFZhbHVlc01hcCwgYXR0clZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2FkZFRlcm1pbmFsKG1hcDogTWFwPHN0cmluZywgU2VsZWN0b3JDb250ZXh0W10+LCBuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGFibGU6IFNlbGVjdG9yQ29udGV4dCkge1xuICAgIHZhciB0ZXJtaW5hbExpc3QgPSBtYXAuZ2V0KG5hbWUpO1xuICAgIGlmIChpc0JsYW5rKHRlcm1pbmFsTGlzdCkpIHtcbiAgICAgIHRlcm1pbmFsTGlzdCA9IFtdO1xuICAgICAgbWFwLnNldChuYW1lLCB0ZXJtaW5hbExpc3QpO1xuICAgIH1cbiAgICB0ZXJtaW5hbExpc3QucHVzaChzZWxlY3RhYmxlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2FkZFBhcnRpYWwobWFwOiBNYXA8c3RyaW5nLCBTZWxlY3Rvck1hdGNoZXI+LCBuYW1lOiBzdHJpbmcpOiBTZWxlY3Rvck1hdGNoZXIge1xuICAgIHZhciBtYXRjaGVyID0gbWFwLmdldChuYW1lKTtcbiAgICBpZiAoaXNCbGFuayhtYXRjaGVyKSkge1xuICAgICAgbWF0Y2hlciA9IG5ldyBTZWxlY3Rvck1hdGNoZXIoKTtcbiAgICAgIG1hcC5zZXQobmFtZSwgbWF0Y2hlcik7XG4gICAgfVxuICAgIHJldHVybiBtYXRjaGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIG9iamVjdHMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdmlhIGBhZGRTZWxlY3RhYmxlYFxuICAgKiB3aG9zZSBjc3Mgc2VsZWN0b3IgaXMgY29udGFpbmVkIGluIHRoZSBnaXZlbiBjc3Mgc2VsZWN0b3IuXG4gICAqIEBwYXJhbSBjc3NTZWxlY3RvciBBIGNzcyBzZWxlY3RvclxuICAgKiBAcGFyYW0gbWF0Y2hlZENhbGxiYWNrIFRoaXMgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgb2JqZWN0IGhhbmRlZCBpbnRvIGBhZGRTZWxlY3RhYmxlYFxuICAgKiBAcmV0dXJuIGJvb2xlYW4gdHJ1ZSBpZiBhIG1hdGNoIHdhcyBmb3VuZFxuICAqL1xuICBtYXRjaChjc3NTZWxlY3RvcjogQ3NzU2VsZWN0b3IsIG1hdGNoZWRDYWxsYmFjazogKGM6IENzc1NlbGVjdG9yLCBhOiBhbnkpID0+IHZvaWQpOiBib29sZWFuIHtcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgdmFyIGVsZW1lbnQgPSBjc3NTZWxlY3Rvci5lbGVtZW50O1xuICAgIHZhciBjbGFzc05hbWVzID0gY3NzU2VsZWN0b3IuY2xhc3NOYW1lcztcbiAgICB2YXIgYXR0cnMgPSBjc3NTZWxlY3Rvci5hdHRycztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fbGlzdENvbnRleHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLl9saXN0Q29udGV4dHNbaV0uYWxyZWFkeU1hdGNoZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXN1bHQgPSB0aGlzLl9tYXRjaFRlcm1pbmFsKHRoaXMuX2VsZW1lbnRNYXAsIGVsZW1lbnQsIGNzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2spIHx8IHJlc3VsdDtcbiAgICByZXN1bHQgPSB0aGlzLl9tYXRjaFBhcnRpYWwodGhpcy5fZWxlbWVudFBhcnRpYWxNYXAsIGVsZW1lbnQsIGNzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2spIHx8XG4gICAgICAgICAgICAgcmVzdWx0O1xuXG4gICAgaWYgKGlzUHJlc2VudChjbGFzc05hbWVzKSkge1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVzW2luZGV4XTtcbiAgICAgICAgcmVzdWx0ID1cbiAgICAgICAgICAgIHRoaXMuX21hdGNoVGVybWluYWwodGhpcy5fY2xhc3NNYXAsIGNsYXNzTmFtZSwgY3NzU2VsZWN0b3IsIG1hdGNoZWRDYWxsYmFjaykgfHwgcmVzdWx0O1xuICAgICAgICByZXN1bHQgPVxuICAgICAgICAgICAgdGhpcy5fbWF0Y2hQYXJ0aWFsKHRoaXMuX2NsYXNzUGFydGlhbE1hcCwgY2xhc3NOYW1lLCBjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fFxuICAgICAgICAgICAgcmVzdWx0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc1ByZXNlbnQoYXR0cnMpKSB7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXR0cnMubGVuZ3RoOykge1xuICAgICAgICB2YXIgYXR0ck5hbWUgPSBhdHRyc1tpbmRleCsrXTtcbiAgICAgICAgdmFyIGF0dHJWYWx1ZSA9IGF0dHJzW2luZGV4KytdO1xuXG4gICAgICAgIHZhciB0ZXJtaW5hbFZhbHVlc01hcCA9IHRoaXMuX2F0dHJWYWx1ZU1hcC5nZXQoYXR0ck5hbWUpO1xuICAgICAgICBpZiAoIVN0cmluZ1dyYXBwZXIuZXF1YWxzKGF0dHJWYWx1ZSwgX0VNUFRZX0FUVFJfVkFMVUUpKSB7XG4gICAgICAgICAgcmVzdWx0ID0gdGhpcy5fbWF0Y2hUZXJtaW5hbCh0ZXJtaW5hbFZhbHVlc01hcCwgX0VNUFRZX0FUVFJfVkFMVUUsIGNzc1NlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZENhbGxiYWNrKSB8fFxuICAgICAgICAgICAgICAgICAgIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSB0aGlzLl9tYXRjaFRlcm1pbmFsKHRlcm1pbmFsVmFsdWVzTWFwLCBhdHRyVmFsdWUsIGNzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2spIHx8XG4gICAgICAgICAgICAgICAgIHJlc3VsdDtcblxuICAgICAgICB2YXIgcGFydGlhbFZhbHVlc01hcCA9IHRoaXMuX2F0dHJWYWx1ZVBhcnRpYWxNYXAuZ2V0KGF0dHJOYW1lKTtcbiAgICAgICAgaWYgKCFTdHJpbmdXcmFwcGVyLmVxdWFscyhhdHRyVmFsdWUsIF9FTVBUWV9BVFRSX1ZBTFVFKSkge1xuICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21hdGNoUGFydGlhbChwYXJ0aWFsVmFsdWVzTWFwLCBfRU1QVFlfQVRUUl9WQUxVRSwgY3NzU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWRDYWxsYmFjaykgfHxcbiAgICAgICAgICAgICAgICAgICByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID1cbiAgICAgICAgICAgIHRoaXMuX21hdGNoUGFydGlhbChwYXJ0aWFsVmFsdWVzTWFwLCBhdHRyVmFsdWUsIGNzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2spIHx8IHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX21hdGNoVGVybWluYWwobWFwOiBNYXA8c3RyaW5nLCBTZWxlY3RvckNvbnRleHRbXT4sIG5hbWUsIGNzc1NlbGVjdG9yOiBDc3NTZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgbWF0Y2hlZENhbGxiYWNrOiAoYzogQ3NzU2VsZWN0b3IsIGE6IGFueSkgPT4gdm9pZCk6IGJvb2xlYW4ge1xuICAgIGlmIChpc0JsYW5rKG1hcCkgfHwgaXNCbGFuayhuYW1lKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBzZWxlY3RhYmxlcyA9IG1hcC5nZXQobmFtZSk7XG4gICAgdmFyIHN0YXJTZWxlY3RhYmxlcyA9IG1hcC5nZXQoXCIqXCIpO1xuICAgIGlmIChpc1ByZXNlbnQoc3RhclNlbGVjdGFibGVzKSkge1xuICAgICAgc2VsZWN0YWJsZXMgPSBzZWxlY3RhYmxlcy5jb25jYXQoc3RhclNlbGVjdGFibGVzKTtcbiAgICB9XG4gICAgaWYgKGlzQmxhbmsoc2VsZWN0YWJsZXMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBzZWxlY3RhYmxlO1xuICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgc2VsZWN0YWJsZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBzZWxlY3RhYmxlID0gc2VsZWN0YWJsZXNbaW5kZXhdO1xuICAgICAgcmVzdWx0ID0gc2VsZWN0YWJsZS5maW5hbGl6ZShjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fCByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9tYXRjaFBhcnRpYWwobWFwOiBNYXA8c3RyaW5nLCBTZWxlY3Rvck1hdGNoZXI+LCBuYW1lLCBjc3NTZWxlY3RvcjogQ3NzU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgbWF0Y2hlZENhbGxiYWNrIC8qOiAoYzogQ3NzU2VsZWN0b3IsIGE6IGFueSkgPT4gdm9pZCovKTogYm9vbGVhbiB7XG4gICAgaWYgKGlzQmxhbmsobWFwKSB8fCBpc0JsYW5rKG5hbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBuZXN0ZWRTZWxlY3RvciA9IG1hcC5nZXQobmFtZSk7XG4gICAgaWYgKGlzQmxhbmsobmVzdGVkU2VsZWN0b3IpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIFRPRE8ocGVyZik6IGdldCByaWQgb2YgcmVjdXJzaW9uIGFuZCBtZWFzdXJlIGFnYWluXG4gICAgLy8gVE9ETyhwZXJmKTogZG9uJ3QgcGFzcyB0aGUgd2hvbGUgc2VsZWN0b3IgaW50byB0aGUgcmVjdXJzaW9uLFxuICAgIC8vIGJ1dCBvbmx5IHRoZSBub3QgcHJvY2Vzc2VkIHBhcnRzXG4gICAgcmV0dXJuIG5lc3RlZFNlbGVjdG9yLm1hdGNoKGNzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2spO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFNlbGVjdG9yTGlzdENvbnRleHQge1xuICBhbHJlYWR5TWF0Y2hlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzZWxlY3RvcnM6IENzc1NlbGVjdG9yW10pIHt9XG59XG5cbi8vIFN0b3JlIGNvbnRleHQgdG8gcGFzcyBiYWNrIHNlbGVjdG9yIGFuZCBjb250ZXh0IHdoZW4gYSBzZWxlY3RvciBpcyBtYXRjaGVkXG5leHBvcnQgY2xhc3MgU2VsZWN0b3JDb250ZXh0IHtcbiAgbm90U2VsZWN0b3JzOiBDc3NTZWxlY3RvcltdO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzZWxlY3RvcjogQ3NzU2VsZWN0b3IsIHB1YmxpYyBjYkNvbnRleHQ6IGFueSxcbiAgICAgICAgICAgICAgcHVibGljIGxpc3RDb250ZXh0OiBTZWxlY3Rvckxpc3RDb250ZXh0KSB7XG4gICAgdGhpcy5ub3RTZWxlY3RvcnMgPSBzZWxlY3Rvci5ub3RTZWxlY3RvcnM7XG4gIH1cblxuICBmaW5hbGl6ZShjc3NTZWxlY3RvcjogQ3NzU2VsZWN0b3IsIGNhbGxiYWNrOiAoYzogQ3NzU2VsZWN0b3IsIGE6IGFueSkgPT4gdm9pZCk6IGJvb2xlYW4ge1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIGlmICh0aGlzLm5vdFNlbGVjdG9ycy5sZW5ndGggPiAwICYmXG4gICAgICAgIChpc0JsYW5rKHRoaXMubGlzdENvbnRleHQpIHx8ICF0aGlzLmxpc3RDb250ZXh0LmFscmVhZHlNYXRjaGVkKSkge1xuICAgICAgdmFyIG5vdE1hdGNoZXIgPSBTZWxlY3Rvck1hdGNoZXIuY3JlYXRlTm90TWF0Y2hlcih0aGlzLm5vdFNlbGVjdG9ycyk7XG4gICAgICByZXN1bHQgPSAhbm90TWF0Y2hlci5tYXRjaChjc3NTZWxlY3RvciwgbnVsbCk7XG4gICAgfVxuICAgIGlmIChyZXN1bHQgJiYgaXNQcmVzZW50KGNhbGxiYWNrKSAmJlxuICAgICAgICAoaXNCbGFuayh0aGlzLmxpc3RDb250ZXh0KSB8fCAhdGhpcy5saXN0Q29udGV4dC5hbHJlYWR5TWF0Y2hlZCkpIHtcbiAgICAgIGlmIChpc1ByZXNlbnQodGhpcy5saXN0Q29udGV4dCkpIHtcbiAgICAgICAgdGhpcy5saXN0Q29udGV4dC5hbHJlYWR5TWF0Y2hlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBjYWxsYmFjayh0aGlzLnNlbGVjdG9yLCB0aGlzLmNiQ29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==