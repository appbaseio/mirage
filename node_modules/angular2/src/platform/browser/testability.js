'use strict';"use strict";
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var core_1 = require('angular2/core');
var PublicTestability = (function () {
    function PublicTestability(testability) {
        this._testability = testability;
    }
    PublicTestability.prototype.isStable = function () { return this._testability.isStable(); };
    PublicTestability.prototype.whenStable = function (callback) { this._testability.whenStable(callback); };
    PublicTestability.prototype.findBindings = function (using, provider, exactMatch) {
        return this.findProviders(using, provider, exactMatch);
    };
    PublicTestability.prototype.findProviders = function (using, provider, exactMatch) {
        return this._testability.findBindings(using, provider, exactMatch);
    };
    return PublicTestability;
}());
var BrowserGetTestability = (function () {
    function BrowserGetTestability() {
    }
    BrowserGetTestability.init = function () { core_1.setTestabilityGetter(new BrowserGetTestability()); };
    BrowserGetTestability.prototype.addToWindow = function (registry) {
        lang_1.global.getAngularTestability = function (elem, findInAncestors) {
            if (findInAncestors === void 0) { findInAncestors = true; }
            var testability = registry.findTestabilityInTree(elem, findInAncestors);
            if (testability == null) {
                throw new Error('Could not find testability for element.');
            }
            return new PublicTestability(testability);
        };
        lang_1.global.getAllAngularTestabilities = function () {
            var testabilities = registry.getAllTestabilities();
            return testabilities.map(function (testability) { return new PublicTestability(testability); });
        };
        lang_1.global.getAllAngularRootElements = function () { return registry.getAllRootElements(); };
        var whenAllStable = function (callback) {
            var testabilities = lang_1.global.getAllAngularTestabilities();
            var count = testabilities.length;
            var didWork = false;
            var decrement = function (didWork_) {
                didWork = didWork || didWork_;
                count--;
                if (count == 0) {
                    callback(didWork);
                }
            };
            testabilities.forEach(function (testability) { testability.whenStable(decrement); });
        };
        if (!lang_1.global.frameworkStabilizers) {
            lang_1.global.frameworkStabilizers = collection_1.ListWrapper.createGrowableSize(0);
        }
        lang_1.global.frameworkStabilizers.push(whenAllStable);
    };
    BrowserGetTestability.prototype.findTestabilityInTree = function (registry, elem, findInAncestors) {
        if (elem == null) {
            return null;
        }
        var t = registry.getTestability(elem);
        if (lang_1.isPresent(t)) {
            return t;
        }
        else if (!findInAncestors) {
            return null;
        }
        if (dom_adapter_1.DOM.isShadowRoot(elem)) {
            return this.findTestabilityInTree(registry, dom_adapter_1.DOM.getHost(elem), true);
        }
        return this.findTestabilityInTree(registry, dom_adapter_1.DOM.parentElement(elem), true);
    };
    return BrowserGetTestability;
}());
exports.BrowserGetTestability = BrowserGetTestability;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGFiaWxpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci90ZXN0YWJpbGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkJBQTJDLGdDQUFnQyxDQUFDLENBQUE7QUFDNUUscUJBQW1ELDBCQUEwQixDQUFDLENBQUE7QUFJOUUsNEJBQWtCLHVDQUF1QyxDQUFDLENBQUE7QUFFMUQscUJBTU8sZUFBZSxDQUFDLENBQUE7QUFFdkI7SUFJRSwyQkFBWSxXQUF3QjtRQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO0lBQUMsQ0FBQztJQUUxRSxvQ0FBUSxHQUFSLGNBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUU1RCxzQ0FBVSxHQUFWLFVBQVcsUUFBa0IsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFMUUsd0NBQVksR0FBWixVQUFhLEtBQVUsRUFBRSxRQUFnQixFQUFFLFVBQW1CO1FBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELHlDQUFhLEdBQWIsVUFBYyxLQUFVLEVBQUUsUUFBZ0IsRUFBRSxVQUFtQjtRQUM3RCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBakJELElBaUJDO0FBRUQ7SUFBQTtJQXVEQSxDQUFDO0lBdERRLDBCQUFJLEdBQVgsY0FBZ0IsMkJBQW9CLENBQUMsSUFBSSxx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LGlCQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxpQkFBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBdkRELElBdURDO0FBdkRZLDZCQUFxQix3QkF1RGpDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01hcCwgTWFwV3JhcHBlciwgTGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0NPTlNULCBDT05TVF9FWFBSLCBnbG9iYWwsIGlzUHJlc2VudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgV3JhcHBlZEV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7UHJvbWlzZVdyYXBwZXIsIE9ic2VydmFibGVXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcblxuaW1wb3J0IHtET019IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZG9tX2FkYXB0ZXInO1xuXG5pbXBvcnQge1xuICBJbmplY3RhYmxlLFxuICBUZXN0YWJpbGl0eVJlZ2lzdHJ5LFxuICBUZXN0YWJpbGl0eSxcbiAgR2V0VGVzdGFiaWxpdHksXG4gIHNldFRlc3RhYmlsaXR5R2V0dGVyXG59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5jbGFzcyBQdWJsaWNUZXN0YWJpbGl0eSB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3Rlc3RhYmlsaXR5OiBUZXN0YWJpbGl0eTtcblxuICBjb25zdHJ1Y3Rvcih0ZXN0YWJpbGl0eTogVGVzdGFiaWxpdHkpIHsgdGhpcy5fdGVzdGFiaWxpdHkgPSB0ZXN0YWJpbGl0eTsgfVxuXG4gIGlzU3RhYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fdGVzdGFiaWxpdHkuaXNTdGFibGUoKTsgfVxuXG4gIHdoZW5TdGFibGUoY2FsbGJhY2s6IEZ1bmN0aW9uKSB7IHRoaXMuX3Rlc3RhYmlsaXR5LndoZW5TdGFibGUoY2FsbGJhY2spOyB9XG5cbiAgZmluZEJpbmRpbmdzKHVzaW5nOiBhbnksIHByb3ZpZGVyOiBzdHJpbmcsIGV4YWN0TWF0Y2g6IGJvb2xlYW4pOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZFByb3ZpZGVycyh1c2luZywgcHJvdmlkZXIsIGV4YWN0TWF0Y2gpO1xuICB9XG5cbiAgZmluZFByb3ZpZGVycyh1c2luZzogYW55LCBwcm92aWRlcjogc3RyaW5nLCBleGFjdE1hdGNoOiBib29sZWFuKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLl90ZXN0YWJpbGl0eS5maW5kQmluZGluZ3ModXNpbmcsIHByb3ZpZGVyLCBleGFjdE1hdGNoKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQnJvd3NlckdldFRlc3RhYmlsaXR5IGltcGxlbWVudHMgR2V0VGVzdGFiaWxpdHkge1xuICBzdGF0aWMgaW5pdCgpIHsgc2V0VGVzdGFiaWxpdHlHZXR0ZXIobmV3IEJyb3dzZXJHZXRUZXN0YWJpbGl0eSgpKTsgfVxuXG4gIGFkZFRvV2luZG93KHJlZ2lzdHJ5OiBUZXN0YWJpbGl0eVJlZ2lzdHJ5KTogdm9pZCB7XG4gICAgZ2xvYmFsLmdldEFuZ3VsYXJUZXN0YWJpbGl0eSA9IChlbGVtOiBhbnksIGZpbmRJbkFuY2VzdG9yczogYm9vbGVhbiA9IHRydWUpID0+IHtcbiAgICAgIHZhciB0ZXN0YWJpbGl0eSA9IHJlZ2lzdHJ5LmZpbmRUZXN0YWJpbGl0eUluVHJlZShlbGVtLCBmaW5kSW5BbmNlc3RvcnMpO1xuICAgICAgaWYgKHRlc3RhYmlsaXR5ID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCB0ZXN0YWJpbGl0eSBmb3IgZWxlbWVudC4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUHVibGljVGVzdGFiaWxpdHkodGVzdGFiaWxpdHkpO1xuICAgIH07XG5cbiAgICBnbG9iYWwuZ2V0QWxsQW5ndWxhclRlc3RhYmlsaXRpZXMgPSAoKSA9PiB7XG4gICAgICB2YXIgdGVzdGFiaWxpdGllcyA9IHJlZ2lzdHJ5LmdldEFsbFRlc3RhYmlsaXRpZXMoKTtcbiAgICAgIHJldHVybiB0ZXN0YWJpbGl0aWVzLm1hcCgodGVzdGFiaWxpdHkpID0+IHsgcmV0dXJuIG5ldyBQdWJsaWNUZXN0YWJpbGl0eSh0ZXN0YWJpbGl0eSk7IH0pO1xuICAgIH07XG5cbiAgICBnbG9iYWwuZ2V0QWxsQW5ndWxhclJvb3RFbGVtZW50cyA9ICgpID0+IHJlZ2lzdHJ5LmdldEFsbFJvb3RFbGVtZW50cygpO1xuXG4gICAgdmFyIHdoZW5BbGxTdGFibGUgPSAoY2FsbGJhY2spID0+IHtcbiAgICAgIHZhciB0ZXN0YWJpbGl0aWVzID0gZ2xvYmFsLmdldEFsbEFuZ3VsYXJUZXN0YWJpbGl0aWVzKCk7XG4gICAgICB2YXIgY291bnQgPSB0ZXN0YWJpbGl0aWVzLmxlbmd0aDtcbiAgICAgIHZhciBkaWRXb3JrID0gZmFsc2U7XG4gICAgICB2YXIgZGVjcmVtZW50ID0gZnVuY3Rpb24oZGlkV29ya18pIHtcbiAgICAgICAgZGlkV29yayA9IGRpZFdvcmsgfHwgZGlkV29ya187XG4gICAgICAgIGNvdW50LS07XG4gICAgICAgIGlmIChjb3VudCA9PSAwKSB7XG4gICAgICAgICAgY2FsbGJhY2soZGlkV29yayk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB0ZXN0YWJpbGl0aWVzLmZvckVhY2goZnVuY3Rpb24odGVzdGFiaWxpdHkpIHsgdGVzdGFiaWxpdHkud2hlblN0YWJsZShkZWNyZW1lbnQpOyB9KTtcbiAgICB9O1xuXG4gICAgaWYgKCFnbG9iYWwuZnJhbWV3b3JrU3RhYmlsaXplcnMpIHtcbiAgICAgIGdsb2JhbC5mcmFtZXdvcmtTdGFiaWxpemVycyA9IExpc3RXcmFwcGVyLmNyZWF0ZUdyb3dhYmxlU2l6ZSgwKTtcbiAgICB9XG4gICAgZ2xvYmFsLmZyYW1ld29ya1N0YWJpbGl6ZXJzLnB1c2god2hlbkFsbFN0YWJsZSk7XG4gIH1cblxuICBmaW5kVGVzdGFiaWxpdHlJblRyZWUocmVnaXN0cnk6IFRlc3RhYmlsaXR5UmVnaXN0cnksIGVsZW06IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmRJbkFuY2VzdG9yczogYm9vbGVhbik6IFRlc3RhYmlsaXR5IHtcbiAgICBpZiAoZWxlbSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIHQgPSByZWdpc3RyeS5nZXRUZXN0YWJpbGl0eShlbGVtKTtcbiAgICBpZiAoaXNQcmVzZW50KHQpKSB7XG4gICAgICByZXR1cm4gdDtcbiAgICB9IGVsc2UgaWYgKCFmaW5kSW5BbmNlc3RvcnMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoRE9NLmlzU2hhZG93Um9vdChlbGVtKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZFRlc3RhYmlsaXR5SW5UcmVlKHJlZ2lzdHJ5LCBET00uZ2V0SG9zdChlbGVtKSwgdHJ1ZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZpbmRUZXN0YWJpbGl0eUluVHJlZShyZWdpc3RyeSwgRE9NLnBhcmVudEVsZW1lbnQoZWxlbSksIHRydWUpO1xuICB9XG59XG4iXX0=