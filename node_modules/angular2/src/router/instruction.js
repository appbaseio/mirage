'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('angular2/src/facade/async');
/**
 * `RouteParams` is an immutable map of parameters for the given route
 * based on the url matcher and optional parameters for that route.
 *
 * You can inject `RouteParams` into the constructor of a component to use it.
 *
 * ### Example
 *
 * ```
 * import {Component} from 'angular2/core';
 * import {bootstrap} from 'angular2/platform/browser';
 * import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams} from
 * 'angular2/router';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {path: '/user/:id', component: UserCmp, name: 'UserCmp'},
 * ])
 * class AppCmp {}
 *
 * @Component({ template: 'user: {{id}}' })
 * class UserCmp {
 *   id: string;
 *   constructor(params: RouteParams) {
 *     this.id = params.get('id');
 *   }
 * }
 *
 * bootstrap(AppCmp, ROUTER_PROVIDERS);
 * ```
 */
var RouteParams = (function () {
    function RouteParams(params) {
        this.params = params;
    }
    RouteParams.prototype.get = function (param) { return lang_1.normalizeBlank(collection_1.StringMapWrapper.get(this.params, param)); };
    return RouteParams;
}());
exports.RouteParams = RouteParams;
/**
 * `RouteData` is an immutable map of additional data you can configure in your {@link Route}.
 *
 * You can inject `RouteData` into the constructor of a component to use it.
 *
 * ### Example
 *
 * ```
 * import {Component} from 'angular2/core';
 * import {bootstrap} from 'angular2/platform/browser';
 * import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteData} from
 * 'angular2/router';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {path: '/user/:id', component: UserCmp, name: 'UserCmp', data: {isAdmin: true}},
 * ])
 * class AppCmp {}
 *
 * @Component({
 *   ...,
 *   template: 'user: {{isAdmin}}'
 * })
 * class UserCmp {
 *   string: isAdmin;
 *   constructor(data: RouteData) {
 *     this.isAdmin = data.get('isAdmin');
 *   }
 * }
 *
 * bootstrap(AppCmp, ROUTER_PROVIDERS);
 * ```
 */
var RouteData = (function () {
    function RouteData(data) {
        if (data === void 0) { data = lang_1.CONST_EXPR({}); }
        this.data = data;
    }
    RouteData.prototype.get = function (key) { return lang_1.normalizeBlank(collection_1.StringMapWrapper.get(this.data, key)); };
    return RouteData;
}());
exports.RouteData = RouteData;
exports.BLANK_ROUTE_DATA = new RouteData();
/**
 * `Instruction` is a tree of {@link ComponentInstruction}s with all the information needed
 * to transition each component in the app to a given route, including all auxiliary routes.
 *
 * `Instruction`s can be created using {@link Router#generate}, and can be used to
 * perform route changes with {@link Router#navigateByInstruction}.
 *
 * ### Example
 *
 * ```
 * import {Component} from 'angular2/core';
 * import {bootstrap} from 'angular2/platform/browser';
 * import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig} from 'angular2/router';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {...},
 * ])
 * class AppCmp {
 *   constructor(router: Router) {
 *     var instruction = router.generate(['/MyRoute']);
 *     router.navigateByInstruction(instruction);
 *   }
 * }
 *
 * bootstrap(AppCmp, ROUTER_PROVIDERS);
 * ```
 */
var Instruction = (function () {
    function Instruction(component, child, auxInstruction) {
        this.component = component;
        this.child = child;
        this.auxInstruction = auxInstruction;
    }
    Object.defineProperty(Instruction.prototype, "urlPath", {
        get: function () { return lang_1.isPresent(this.component) ? this.component.urlPath : ''; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Instruction.prototype, "urlParams", {
        get: function () { return lang_1.isPresent(this.component) ? this.component.urlParams : []; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Instruction.prototype, "specificity", {
        get: function () {
            var total = '';
            if (lang_1.isPresent(this.component)) {
                total += this.component.specificity;
            }
            if (lang_1.isPresent(this.child)) {
                total += this.child.specificity;
            }
            return total;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * converts the instruction into a URL string
     */
    Instruction.prototype.toRootUrl = function () { return this.toUrlPath() + this.toUrlQuery(); };
    /** @internal */
    Instruction.prototype._toNonRootUrl = function () {
        return this._stringifyPathMatrixAuxPrefixed() +
            (lang_1.isPresent(this.child) ? this.child._toNonRootUrl() : '');
    };
    Instruction.prototype.toUrlQuery = function () { return this.urlParams.length > 0 ? ('?' + this.urlParams.join('&')) : ''; };
    /**
     * Returns a new instruction that shares the state of the existing instruction, but with
     * the given child {@link Instruction} replacing the existing child.
     */
    Instruction.prototype.replaceChild = function (child) {
        return new ResolvedInstruction(this.component, child, this.auxInstruction);
    };
    /**
     * If the final URL for the instruction is ``
     */
    Instruction.prototype.toUrlPath = function () {
        return this.urlPath + this._stringifyAux() +
            (lang_1.isPresent(this.child) ? this.child._toNonRootUrl() : '');
    };
    // default instructions override these
    Instruction.prototype.toLinkUrl = function () {
        return this.urlPath + this._stringifyAux() +
            (lang_1.isPresent(this.child) ? this.child._toLinkUrl() : '') + this.toUrlQuery();
    };
    // this is the non-root version (called recursively)
    /** @internal */
    Instruction.prototype._toLinkUrl = function () {
        return this._stringifyPathMatrixAuxPrefixed() +
            (lang_1.isPresent(this.child) ? this.child._toLinkUrl() : '');
    };
    /** @internal */
    Instruction.prototype._stringifyPathMatrixAuxPrefixed = function () {
        var primary = this._stringifyPathMatrixAux();
        if (primary.length > 0) {
            primary = '/' + primary;
        }
        return primary;
    };
    /** @internal */
    Instruction.prototype._stringifyMatrixParams = function () {
        return this.urlParams.length > 0 ? (';' + this.urlParams.join(';')) : '';
    };
    /** @internal */
    Instruction.prototype._stringifyPathMatrixAux = function () {
        if (lang_1.isBlank(this.component)) {
            return '';
        }
        return this.urlPath + this._stringifyMatrixParams() + this._stringifyAux();
    };
    /** @internal */
    Instruction.prototype._stringifyAux = function () {
        var routes = [];
        collection_1.StringMapWrapper.forEach(this.auxInstruction, function (auxInstruction, _) {
            routes.push(auxInstruction._stringifyPathMatrixAux());
        });
        if (routes.length > 0) {
            return '(' + routes.join('//') + ')';
        }
        return '';
    };
    return Instruction;
}());
exports.Instruction = Instruction;
/**
 * a resolved instruction has an outlet instruction for itself, but maybe not for...
 */
var ResolvedInstruction = (function (_super) {
    __extends(ResolvedInstruction, _super);
    function ResolvedInstruction(component, child, auxInstruction) {
        _super.call(this, component, child, auxInstruction);
    }
    ResolvedInstruction.prototype.resolveComponent = function () {
        return async_1.PromiseWrapper.resolve(this.component);
    };
    return ResolvedInstruction;
}(Instruction));
exports.ResolvedInstruction = ResolvedInstruction;
/**
 * Represents a resolved default route
 */
var DefaultInstruction = (function (_super) {
    __extends(DefaultInstruction, _super);
    function DefaultInstruction(component, child) {
        _super.call(this, component, child, {});
    }
    DefaultInstruction.prototype.toLinkUrl = function () { return ''; };
    /** @internal */
    DefaultInstruction.prototype._toLinkUrl = function () { return ''; };
    return DefaultInstruction;
}(ResolvedInstruction));
exports.DefaultInstruction = DefaultInstruction;
/**
 * Represents a component that may need to do some redirection or lazy loading at a later time.
 */
var UnresolvedInstruction = (function (_super) {
    __extends(UnresolvedInstruction, _super);
    function UnresolvedInstruction(_resolver, _urlPath, _urlParams) {
        if (_urlPath === void 0) { _urlPath = ''; }
        if (_urlParams === void 0) { _urlParams = lang_1.CONST_EXPR([]); }
        _super.call(this, null, null, {});
        this._resolver = _resolver;
        this._urlPath = _urlPath;
        this._urlParams = _urlParams;
    }
    Object.defineProperty(UnresolvedInstruction.prototype, "urlPath", {
        get: function () {
            if (lang_1.isPresent(this.component)) {
                return this.component.urlPath;
            }
            if (lang_1.isPresent(this._urlPath)) {
                return this._urlPath;
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnresolvedInstruction.prototype, "urlParams", {
        get: function () {
            if (lang_1.isPresent(this.component)) {
                return this.component.urlParams;
            }
            if (lang_1.isPresent(this._urlParams)) {
                return this._urlParams;
            }
            return [];
        },
        enumerable: true,
        configurable: true
    });
    UnresolvedInstruction.prototype.resolveComponent = function () {
        var _this = this;
        if (lang_1.isPresent(this.component)) {
            return async_1.PromiseWrapper.resolve(this.component);
        }
        return this._resolver().then(function (instruction) {
            _this.child = lang_1.isPresent(instruction) ? instruction.child : null;
            return _this.component = lang_1.isPresent(instruction) ? instruction.component : null;
        });
    };
    return UnresolvedInstruction;
}(Instruction));
exports.UnresolvedInstruction = UnresolvedInstruction;
var RedirectInstruction = (function (_super) {
    __extends(RedirectInstruction, _super);
    function RedirectInstruction(component, child, auxInstruction, _specificity) {
        _super.call(this, component, child, auxInstruction);
        this._specificity = _specificity;
    }
    Object.defineProperty(RedirectInstruction.prototype, "specificity", {
        get: function () { return this._specificity; },
        enumerable: true,
        configurable: true
    });
    return RedirectInstruction;
}(ResolvedInstruction));
exports.RedirectInstruction = RedirectInstruction;
/**
 * A `ComponentInstruction` represents the route state for a single component.
 *
 * `ComponentInstructions` is a public API. Instances of `ComponentInstruction` are passed
 * to route lifecycle hooks, like {@link CanActivate}.
 *
 * `ComponentInstruction`s are [hash consed](https://en.wikipedia.org/wiki/Hash_consing). You should
 * never construct one yourself with "new." Instead, rely on {@link Router/RouteRecognizer} to
 * construct `ComponentInstruction`s.
 *
 * You should not modify this object. It should be treated as immutable.
 */
var ComponentInstruction = (function () {
    /**
     * @internal
     */
    function ComponentInstruction(urlPath, urlParams, data, componentType, terminal, specificity, params, routeName) {
        if (params === void 0) { params = null; }
        this.urlPath = urlPath;
        this.urlParams = urlParams;
        this.componentType = componentType;
        this.terminal = terminal;
        this.specificity = specificity;
        this.params = params;
        this.routeName = routeName;
        this.reuse = false;
        this.routeData = lang_1.isPresent(data) ? data : exports.BLANK_ROUTE_DATA;
    }
    return ComponentInstruction;
}());
exports.ComponentInstruction = ComponentInstruction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1Y3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvcm91dGVyL2luc3RydWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJCQUE2RCxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzlGLHFCQUFtRSwwQkFBMEIsQ0FBQyxDQUFBO0FBQzlGLHNCQUE2QiwyQkFBMkIsQ0FBQyxDQUFBO0FBR3pEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Qkc7QUFDSDtJQUNFLHFCQUFtQixNQUErQjtRQUEvQixXQUFNLEdBQU4sTUFBTSxDQUF5QjtJQUFHLENBQUM7SUFFdEQseUJBQUcsR0FBSCxVQUFJLEtBQWEsSUFBWSxNQUFNLENBQUMscUJBQWMsQ0FBQyw2QkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRyxrQkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksbUJBQVcsY0FJdkIsQ0FBQTtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdDRztBQUNIO0lBQ0UsbUJBQW1CLElBQTJDO1FBQWxELG9CQUFrRCxHQUFsRCxPQUFvQyxpQkFBVSxDQUFDLEVBQUUsQ0FBQztRQUEzQyxTQUFJLEdBQUosSUFBSSxDQUF1QztJQUFHLENBQUM7SUFFbEUsdUJBQUcsR0FBSCxVQUFJLEdBQVcsSUFBUyxNQUFNLENBQUMscUJBQWMsQ0FBQyw2QkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RixnQkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksaUJBQVMsWUFJckIsQ0FBQTtBQUVVLHdCQUFnQixHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7QUFFOUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJCRztBQUNIO0lBQ0UscUJBQW1CLFNBQStCLEVBQVMsS0FBa0IsRUFDMUQsY0FBNEM7UUFENUMsY0FBUyxHQUFULFNBQVMsQ0FBc0I7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFhO1FBQzFELG1CQUFjLEdBQWQsY0FBYyxDQUE4QjtJQUFHLENBQUM7SUFFbkUsc0JBQUksZ0NBQU87YUFBWCxjQUF3QixNQUFNLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFekYsc0JBQUksa0NBQVM7YUFBYixjQUE0QixNQUFNLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFL0Ysc0JBQUksb0NBQVc7YUFBZjtZQUNFLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNmLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1lBQ3RDLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztZQUNsQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7OztPQUFBO0lBSUQ7O09BRUc7SUFDSCwrQkFBUyxHQUFULGNBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVwRSxnQkFBZ0I7SUFDaEIsbUNBQWEsR0FBYjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsK0JBQStCLEVBQUU7WUFDdEMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCxnQ0FBVSxHQUFWLGNBQXVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRWxHOzs7T0FHRztJQUNILGtDQUFZLEdBQVosVUFBYSxLQUFrQjtRQUM3QixNQUFNLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVEOztPQUVHO0lBQ0gsK0JBQVMsR0FBVDtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbkMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCxzQ0FBc0M7SUFDdEMsK0JBQVMsR0FBVDtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbkMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwRixDQUFDO0lBRUQsb0RBQW9EO0lBQ3BELGdCQUFnQjtJQUNoQixnQ0FBVSxHQUFWO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsRUFBRTtZQUN0QyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELGdCQUFnQjtJQUNoQixxREFBK0IsR0FBL0I7UUFDRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsT0FBTyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUM7UUFDMUIsQ0FBQztRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVELGdCQUFnQjtJQUNoQiw0Q0FBc0IsR0FBdEI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNFLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsNkNBQXVCLEdBQXZCO1FBQ0UsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNaLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDN0UsQ0FBQztJQUVELGdCQUFnQjtJQUNoQixtQ0FBYSxHQUFiO1FBQ0UsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLDZCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFVBQUMsY0FBMkIsRUFBRSxDQUFTO1lBQ25GLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3ZDLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQWhHRCxJQWdHQztBQWhHcUIsbUJBQVcsY0FnR2hDLENBQUE7QUFHRDs7R0FFRztBQUNIO0lBQXlDLHVDQUFXO0lBQ2xELDZCQUFZLFNBQStCLEVBQUUsS0FBa0IsRUFDbkQsY0FBNEM7UUFDdEQsa0JBQU0sU0FBUyxFQUFFLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsOENBQWdCLEdBQWhCO1FBQ0UsTUFBTSxDQUFDLHNCQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBVEQsQ0FBeUMsV0FBVyxHQVNuRDtBQVRZLDJCQUFtQixzQkFTL0IsQ0FBQTtBQUdEOztHQUVHO0FBQ0g7SUFBd0Msc0NBQW1CO0lBQ3pELDRCQUFZLFNBQStCLEVBQUUsS0FBeUI7UUFDcEUsa0JBQU0sU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsc0NBQVMsR0FBVCxjQUFzQixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVsQyxnQkFBZ0I7SUFDaEIsdUNBQVUsR0FBVixjQUF1QixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyQyx5QkFBQztBQUFELENBQUMsQUFURCxDQUF3QyxtQkFBbUIsR0FTMUQ7QUFUWSwwQkFBa0IscUJBUzlCLENBQUE7QUFHRDs7R0FFRztBQUNIO0lBQTJDLHlDQUFXO0lBQ3BELCtCQUFvQixTQUFxQyxFQUFVLFFBQXFCLEVBQ3BFLFVBQXFDO1FBREUsd0JBQTZCLEdBQTdCLGFBQTZCO1FBQzVFLDBCQUE2QyxHQUE3QyxhQUErQixpQkFBVSxDQUFDLEVBQUUsQ0FBQztRQUN2RCxrQkFBTSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRkosY0FBUyxHQUFULFNBQVMsQ0FBNEI7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFhO1FBQ3BFLGVBQVUsR0FBVixVQUFVLENBQTJCO0lBRXpELENBQUM7SUFFRCxzQkFBSSwwQ0FBTzthQUFYO1lBQ0UsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7WUFDaEMsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDdkIsQ0FBQztZQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDWixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDRDQUFTO2FBQWI7WUFDRSxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztZQUNsQyxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUN6QixDQUFDO1lBQ0QsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNaLENBQUM7OztPQUFBO0lBRUQsZ0RBQWdCLEdBQWhCO1FBQUEsaUJBUUM7UUFQQyxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLHNCQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUF3QjtZQUNwRCxLQUFJLENBQUMsS0FBSyxHQUFHLGdCQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDL0QsTUFBTSxDQUFDLEtBQUksQ0FBQyxTQUFTLEdBQUcsZ0JBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUNoRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUFuQ0QsQ0FBMkMsV0FBVyxHQW1DckQ7QUFuQ1ksNkJBQXFCLHdCQW1DakMsQ0FBQTtBQUdEO0lBQXlDLHVDQUFtQjtJQUMxRCw2QkFBWSxTQUErQixFQUFFLEtBQWtCLEVBQ25ELGNBQTRDLEVBQVUsWUFBb0I7UUFDcEYsa0JBQU0sU0FBUyxFQUFFLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQztRQUR3QixpQkFBWSxHQUFaLFlBQVksQ0FBUTtJQUV0RixDQUFDO0lBRUQsc0JBQUksNENBQVc7YUFBZixjQUE0QixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3pELDBCQUFDO0FBQUQsQ0FBQyxBQVBELENBQXlDLG1CQUFtQixHQU8zRDtBQVBZLDJCQUFtQixzQkFPL0IsQ0FBQTtBQUdEOzs7Ozs7Ozs7OztHQVdHO0FBQ0g7SUFJRTs7T0FFRztJQUNILDhCQUFtQixPQUFlLEVBQVMsU0FBbUIsRUFBRSxJQUFlLEVBQzVELGFBQWEsRUFBUyxRQUFpQixFQUFTLFdBQW1CLEVBQ25FLE1BQXNDLEVBQVMsU0FBaUI7UUFBdkUsc0JBQTZDLEdBQTdDLGFBQTZDO1FBRnRDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQzNDLGtCQUFhLEdBQWIsYUFBYSxDQUFBO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUFTLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ25FLFdBQU0sR0FBTixNQUFNLENBQWdDO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQVJuRixVQUFLLEdBQVksS0FBSyxDQUFDO1FBU3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsd0JBQWdCLENBQUM7SUFDN0QsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFaWSw0QkFBb0IsdUJBWWhDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01hcCwgTWFwV3JhcHBlciwgU3RyaW5nTWFwV3JhcHBlciwgTGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge2lzUHJlc2VudCwgaXNCbGFuaywgbm9ybWFsaXplQmxhbmssIFR5cGUsIENPTlNUX0VYUFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1Byb21pc2VXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcblxuXG4vKipcbiAqIGBSb3V0ZVBhcmFtc2AgaXMgYW4gaW1tdXRhYmxlIG1hcCBvZiBwYXJhbWV0ZXJzIGZvciB0aGUgZ2l2ZW4gcm91dGVcbiAqIGJhc2VkIG9uIHRoZSB1cmwgbWF0Y2hlciBhbmQgb3B0aW9uYWwgcGFyYW1ldGVycyBmb3IgdGhhdCByb3V0ZS5cbiAqXG4gKiBZb3UgY2FuIGluamVjdCBgUm91dGVQYXJhbXNgIGludG8gdGhlIGNvbnN0cnVjdG9yIG9mIGEgY29tcG9uZW50IHRvIHVzZSBpdC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuICogaW1wb3J0IHtib290c3RyYXB9IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2Jyb3dzZXInO1xuICogaW1wb3J0IHtSb3V0ZXIsIFJPVVRFUl9ESVJFQ1RJVkVTLCBST1VURVJfUFJPVklERVJTLCBSb3V0ZUNvbmZpZywgUm91dGVQYXJhbXN9IGZyb21cbiAqICdhbmd1bGFyMi9yb3V0ZXInO1xuICpcbiAqIEBDb21wb25lbnQoe2RpcmVjdGl2ZXM6IFtST1VURVJfRElSRUNUSVZFU119KVxuICogQFJvdXRlQ29uZmlnKFtcbiAqICB7cGF0aDogJy91c2VyLzppZCcsIGNvbXBvbmVudDogVXNlckNtcCwgbmFtZTogJ1VzZXJDbXAnfSxcbiAqIF0pXG4gKiBjbGFzcyBBcHBDbXAge31cbiAqXG4gKiBAQ29tcG9uZW50KHsgdGVtcGxhdGU6ICd1c2VyOiB7e2lkfX0nIH0pXG4gKiBjbGFzcyBVc2VyQ21wIHtcbiAqICAgaWQ6IHN0cmluZztcbiAqICAgY29uc3RydWN0b3IocGFyYW1zOiBSb3V0ZVBhcmFtcykge1xuICogICAgIHRoaXMuaWQgPSBwYXJhbXMuZ2V0KCdpZCcpO1xuICogICB9XG4gKiB9XG4gKlxuICogYm9vdHN0cmFwKEFwcENtcCwgUk9VVEVSX1BST1ZJREVSUyk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIFJvdXRlUGFyYW1zIHtcbiAgY29uc3RydWN0b3IocHVibGljIHBhcmFtczoge1trZXk6IHN0cmluZ106IHN0cmluZ30pIHt9XG5cbiAgZ2V0KHBhcmFtOiBzdHJpbmcpOiBzdHJpbmcgeyByZXR1cm4gbm9ybWFsaXplQmxhbmsoU3RyaW5nTWFwV3JhcHBlci5nZXQodGhpcy5wYXJhbXMsIHBhcmFtKSk7IH1cbn1cblxuLyoqXG4gKiBgUm91dGVEYXRhYCBpcyBhbiBpbW11dGFibGUgbWFwIG9mIGFkZGl0aW9uYWwgZGF0YSB5b3UgY2FuIGNvbmZpZ3VyZSBpbiB5b3VyIHtAbGluayBSb3V0ZX0uXG4gKlxuICogWW91IGNhbiBpbmplY3QgYFJvdXRlRGF0YWAgaW50byB0aGUgY29uc3RydWN0b3Igb2YgYSBjb21wb25lbnQgdG8gdXNlIGl0LlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgXG4gKiBpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG4gKiBpbXBvcnQge2Jvb3RzdHJhcH0gZnJvbSAnYW5ndWxhcjIvcGxhdGZvcm0vYnJvd3Nlcic7XG4gKiBpbXBvcnQge1JvdXRlciwgUk9VVEVSX0RJUkVDVElWRVMsIFJPVVRFUl9QUk9WSURFUlMsIFJvdXRlQ29uZmlnLCBSb3V0ZURhdGF9IGZyb21cbiAqICdhbmd1bGFyMi9yb3V0ZXInO1xuICpcbiAqIEBDb21wb25lbnQoe2RpcmVjdGl2ZXM6IFtST1VURVJfRElSRUNUSVZFU119KVxuICogQFJvdXRlQ29uZmlnKFtcbiAqICB7cGF0aDogJy91c2VyLzppZCcsIGNvbXBvbmVudDogVXNlckNtcCwgbmFtZTogJ1VzZXJDbXAnLCBkYXRhOiB7aXNBZG1pbjogdHJ1ZX19LFxuICogXSlcbiAqIGNsYXNzIEFwcENtcCB7fVxuICpcbiAqIEBDb21wb25lbnQoe1xuICogICAuLi4sXG4gKiAgIHRlbXBsYXRlOiAndXNlcjoge3tpc0FkbWlufX0nXG4gKiB9KVxuICogY2xhc3MgVXNlckNtcCB7XG4gKiAgIHN0cmluZzogaXNBZG1pbjtcbiAqICAgY29uc3RydWN0b3IoZGF0YTogUm91dGVEYXRhKSB7XG4gKiAgICAgdGhpcy5pc0FkbWluID0gZGF0YS5nZXQoJ2lzQWRtaW4nKTtcbiAqICAgfVxuICogfVxuICpcbiAqIGJvb3RzdHJhcChBcHBDbXAsIFJPVVRFUl9QUk9WSURFUlMpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBSb3V0ZURhdGEge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0YToge1trZXk6IHN0cmluZ106IGFueX0gPSBDT05TVF9FWFBSKHt9KSkge31cblxuICBnZXQoa2V5OiBzdHJpbmcpOiBhbnkgeyByZXR1cm4gbm9ybWFsaXplQmxhbmsoU3RyaW5nTWFwV3JhcHBlci5nZXQodGhpcy5kYXRhLCBrZXkpKTsgfVxufVxuXG5leHBvcnQgdmFyIEJMQU5LX1JPVVRFX0RBVEEgPSBuZXcgUm91dGVEYXRhKCk7XG5cbi8qKlxuICogYEluc3RydWN0aW9uYCBpcyBhIHRyZWUgb2Yge0BsaW5rIENvbXBvbmVudEluc3RydWN0aW9ufXMgd2l0aCBhbGwgdGhlIGluZm9ybWF0aW9uIG5lZWRlZFxuICogdG8gdHJhbnNpdGlvbiBlYWNoIGNvbXBvbmVudCBpbiB0aGUgYXBwIHRvIGEgZ2l2ZW4gcm91dGUsIGluY2x1ZGluZyBhbGwgYXV4aWxpYXJ5IHJvdXRlcy5cbiAqXG4gKiBgSW5zdHJ1Y3Rpb25gcyBjYW4gYmUgY3JlYXRlZCB1c2luZyB7QGxpbmsgUm91dGVyI2dlbmVyYXRlfSwgYW5kIGNhbiBiZSB1c2VkIHRvXG4gKiBwZXJmb3JtIHJvdXRlIGNoYW5nZXMgd2l0aCB7QGxpbmsgUm91dGVyI25hdmlnYXRlQnlJbnN0cnVjdGlvbn0uXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIGltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbiAqIGltcG9ydCB7Ym9vdHN0cmFwfSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9icm93c2VyJztcbiAqIGltcG9ydCB7Um91dGVyLCBST1VURVJfRElSRUNUSVZFUywgUk9VVEVSX1BST1ZJREVSUywgUm91dGVDb25maWd9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlcic7XG4gKlxuICogQENvbXBvbmVudCh7ZGlyZWN0aXZlczogW1JPVVRFUl9ESVJFQ1RJVkVTXX0pXG4gKiBAUm91dGVDb25maWcoW1xuICogIHsuLi59LFxuICogXSlcbiAqIGNsYXNzIEFwcENtcCB7XG4gKiAgIGNvbnN0cnVjdG9yKHJvdXRlcjogUm91dGVyKSB7XG4gKiAgICAgdmFyIGluc3RydWN0aW9uID0gcm91dGVyLmdlbmVyYXRlKFsnL015Um91dGUnXSk7XG4gKiAgICAgcm91dGVyLm5hdmlnYXRlQnlJbnN0cnVjdGlvbihpbnN0cnVjdGlvbik7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBib290c3RyYXAoQXBwQ21wLCBST1VURVJfUFJPVklERVJTKTtcbiAqIGBgYFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW5zdHJ1Y3Rpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29tcG9uZW50OiBDb21wb25lbnRJbnN0cnVjdGlvbiwgcHVibGljIGNoaWxkOiBJbnN0cnVjdGlvbixcbiAgICAgICAgICAgICAgcHVibGljIGF1eEluc3RydWN0aW9uOiB7W2tleTogc3RyaW5nXTogSW5zdHJ1Y3Rpb259KSB7fVxuXG4gIGdldCB1cmxQYXRoKCk6IHN0cmluZyB7IHJldHVybiBpc1ByZXNlbnQodGhpcy5jb21wb25lbnQpID8gdGhpcy5jb21wb25lbnQudXJsUGF0aCA6ICcnOyB9XG5cbiAgZ2V0IHVybFBhcmFtcygpOiBzdHJpbmdbXSB7IHJldHVybiBpc1ByZXNlbnQodGhpcy5jb21wb25lbnQpID8gdGhpcy5jb21wb25lbnQudXJsUGFyYW1zIDogW107IH1cblxuICBnZXQgc3BlY2lmaWNpdHkoKTogc3RyaW5nIHtcbiAgICB2YXIgdG90YWwgPSAnJztcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuY29tcG9uZW50KSkge1xuICAgICAgdG90YWwgKz0gdGhpcy5jb21wb25lbnQuc3BlY2lmaWNpdHk7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQodGhpcy5jaGlsZCkpIHtcbiAgICAgIHRvdGFsICs9IHRoaXMuY2hpbGQuc3BlY2lmaWNpdHk7XG4gICAgfVxuICAgIHJldHVybiB0b3RhbDtcbiAgfVxuXG4gIGFic3RyYWN0IHJlc29sdmVDb21wb25lbnQoKTogUHJvbWlzZTxDb21wb25lbnRJbnN0cnVjdGlvbj47XG5cbiAgLyoqXG4gICAqIGNvbnZlcnRzIHRoZSBpbnN0cnVjdGlvbiBpbnRvIGEgVVJMIHN0cmluZ1xuICAgKi9cbiAgdG9Sb290VXJsKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnRvVXJsUGF0aCgpICsgdGhpcy50b1VybFF1ZXJ5KCk7IH1cblxuICAvKiogQGludGVybmFsICovXG4gIF90b05vblJvb3RVcmwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyaW5naWZ5UGF0aE1hdHJpeEF1eFByZWZpeGVkKCkgK1xuICAgICAgICAgICAoaXNQcmVzZW50KHRoaXMuY2hpbGQpID8gdGhpcy5jaGlsZC5fdG9Ob25Sb290VXJsKCkgOiAnJyk7XG4gIH1cblxuICB0b1VybFF1ZXJ5KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnVybFBhcmFtcy5sZW5ndGggPiAwID8gKCc/JyArIHRoaXMudXJsUGFyYW1zLmpvaW4oJyYnKSkgOiAnJzsgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IGluc3RydWN0aW9uIHRoYXQgc2hhcmVzIHRoZSBzdGF0ZSBvZiB0aGUgZXhpc3RpbmcgaW5zdHJ1Y3Rpb24sIGJ1dCB3aXRoXG4gICAqIHRoZSBnaXZlbiBjaGlsZCB7QGxpbmsgSW5zdHJ1Y3Rpb259IHJlcGxhY2luZyB0aGUgZXhpc3RpbmcgY2hpbGQuXG4gICAqL1xuICByZXBsYWNlQ2hpbGQoY2hpbGQ6IEluc3RydWN0aW9uKTogSW5zdHJ1Y3Rpb24ge1xuICAgIHJldHVybiBuZXcgUmVzb2x2ZWRJbnN0cnVjdGlvbih0aGlzLmNvbXBvbmVudCwgY2hpbGQsIHRoaXMuYXV4SW5zdHJ1Y3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBmaW5hbCBVUkwgZm9yIHRoZSBpbnN0cnVjdGlvbiBpcyBgYFxuICAgKi9cbiAgdG9VcmxQYXRoKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudXJsUGF0aCArIHRoaXMuX3N0cmluZ2lmeUF1eCgpICtcbiAgICAgICAgICAgKGlzUHJlc2VudCh0aGlzLmNoaWxkKSA/IHRoaXMuY2hpbGQuX3RvTm9uUm9vdFVybCgpIDogJycpO1xuICB9XG5cbiAgLy8gZGVmYXVsdCBpbnN0cnVjdGlvbnMgb3ZlcnJpZGUgdGhlc2VcbiAgdG9MaW5rVXJsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudXJsUGF0aCArIHRoaXMuX3N0cmluZ2lmeUF1eCgpICtcbiAgICAgICAgICAgKGlzUHJlc2VudCh0aGlzLmNoaWxkKSA/IHRoaXMuY2hpbGQuX3RvTGlua1VybCgpIDogJycpICsgdGhpcy50b1VybFF1ZXJ5KCk7XG4gIH1cblxuICAvLyB0aGlzIGlzIHRoZSBub24tcm9vdCB2ZXJzaW9uIChjYWxsZWQgcmVjdXJzaXZlbHkpXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3RvTGlua1VybCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9zdHJpbmdpZnlQYXRoTWF0cml4QXV4UHJlZml4ZWQoKSArXG4gICAgICAgICAgIChpc1ByZXNlbnQodGhpcy5jaGlsZCkgPyB0aGlzLmNoaWxkLl90b0xpbmtVcmwoKSA6ICcnKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0cmluZ2lmeVBhdGhNYXRyaXhBdXhQcmVmaXhlZCgpOiBzdHJpbmcge1xuICAgIHZhciBwcmltYXJ5ID0gdGhpcy5fc3RyaW5naWZ5UGF0aE1hdHJpeEF1eCgpO1xuICAgIGlmIChwcmltYXJ5Lmxlbmd0aCA+IDApIHtcbiAgICAgIHByaW1hcnkgPSAnLycgKyBwcmltYXJ5O1xuICAgIH1cbiAgICByZXR1cm4gcHJpbWFyeTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0cmluZ2lmeU1hdHJpeFBhcmFtcygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnVybFBhcmFtcy5sZW5ndGggPiAwID8gKCc7JyArIHRoaXMudXJsUGFyYW1zLmpvaW4oJzsnKSkgOiAnJztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0cmluZ2lmeVBhdGhNYXRyaXhBdXgoKTogc3RyaW5nIHtcbiAgICBpZiAoaXNCbGFuayh0aGlzLmNvbXBvbmVudCkpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudXJsUGF0aCArIHRoaXMuX3N0cmluZ2lmeU1hdHJpeFBhcmFtcygpICsgdGhpcy5fc3RyaW5naWZ5QXV4KCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zdHJpbmdpZnlBdXgoKTogc3RyaW5nIHtcbiAgICB2YXIgcm91dGVzID0gW107XG4gICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKHRoaXMuYXV4SW5zdHJ1Y3Rpb24sIChhdXhJbnN0cnVjdGlvbjogSW5zdHJ1Y3Rpb24sIF86IHN0cmluZykgPT4ge1xuICAgICAgcm91dGVzLnB1c2goYXV4SW5zdHJ1Y3Rpb24uX3N0cmluZ2lmeVBhdGhNYXRyaXhBdXgoKSk7XG4gICAgfSk7XG4gICAgaWYgKHJvdXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gJygnICsgcm91dGVzLmpvaW4oJy8vJykgKyAnKSc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxufVxuXG5cbi8qKlxuICogYSByZXNvbHZlZCBpbnN0cnVjdGlvbiBoYXMgYW4gb3V0bGV0IGluc3RydWN0aW9uIGZvciBpdHNlbGYsIGJ1dCBtYXliZSBub3QgZm9yLi4uXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXNvbHZlZEluc3RydWN0aW9uIGV4dGVuZHMgSW5zdHJ1Y3Rpb24ge1xuICBjb25zdHJ1Y3Rvcihjb21wb25lbnQ6IENvbXBvbmVudEluc3RydWN0aW9uLCBjaGlsZDogSW5zdHJ1Y3Rpb24sXG4gICAgICAgICAgICAgIGF1eEluc3RydWN0aW9uOiB7W2tleTogc3RyaW5nXTogSW5zdHJ1Y3Rpb259KSB7XG4gICAgc3VwZXIoY29tcG9uZW50LCBjaGlsZCwgYXV4SW5zdHJ1Y3Rpb24pO1xuICB9XG5cbiAgcmVzb2x2ZUNvbXBvbmVudCgpOiBQcm9taXNlPENvbXBvbmVudEluc3RydWN0aW9uPiB7XG4gICAgcmV0dXJuIFByb21pc2VXcmFwcGVyLnJlc29sdmUodGhpcy5jb21wb25lbnQpO1xuICB9XG59XG5cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcmVzb2x2ZWQgZGVmYXVsdCByb3V0ZVxuICovXG5leHBvcnQgY2xhc3MgRGVmYXVsdEluc3RydWN0aW9uIGV4dGVuZHMgUmVzb2x2ZWRJbnN0cnVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGNvbXBvbmVudDogQ29tcG9uZW50SW5zdHJ1Y3Rpb24sIGNoaWxkOiBEZWZhdWx0SW5zdHJ1Y3Rpb24pIHtcbiAgICBzdXBlcihjb21wb25lbnQsIGNoaWxkLCB7fSk7XG4gIH1cblxuICB0b0xpbmtVcmwoKTogc3RyaW5nIHsgcmV0dXJuICcnOyB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdG9MaW5rVXJsKCk6IHN0cmluZyB7IHJldHVybiAnJzsgfVxufVxuXG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGNvbXBvbmVudCB0aGF0IG1heSBuZWVkIHRvIGRvIHNvbWUgcmVkaXJlY3Rpb24gb3IgbGF6eSBsb2FkaW5nIGF0IGEgbGF0ZXIgdGltZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFVucmVzb2x2ZWRJbnN0cnVjdGlvbiBleHRlbmRzIEluc3RydWN0aW9uIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcmVzb2x2ZXI6ICgpID0+IFByb21pc2U8SW5zdHJ1Y3Rpb24+LCBwcml2YXRlIF91cmxQYXRoOiBzdHJpbmcgPSAnJyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdXJsUGFyYW1zOiBzdHJpbmdbXSA9IENPTlNUX0VYUFIoW10pKSB7XG4gICAgc3VwZXIobnVsbCwgbnVsbCwge30pO1xuICB9XG5cbiAgZ2V0IHVybFBhdGgoKTogc3RyaW5nIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuY29tcG9uZW50KSkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50LnVybFBhdGg7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQodGhpcy5fdXJsUGF0aCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl91cmxQYXRoO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBnZXQgdXJsUGFyYW1zKCk6IHN0cmluZ1tdIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuY29tcG9uZW50KSkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50LnVybFBhcmFtcztcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl91cmxQYXJhbXMpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsUGFyYW1zO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICByZXNvbHZlQ29tcG9uZW50KCk6IFByb21pc2U8Q29tcG9uZW50SW5zdHJ1Y3Rpb24+IHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuY29tcG9uZW50KSkge1xuICAgICAgcmV0dXJuIFByb21pc2VXcmFwcGVyLnJlc29sdmUodGhpcy5jb21wb25lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZXIoKS50aGVuKChpbnN0cnVjdGlvbjogSW5zdHJ1Y3Rpb24pID0+IHtcbiAgICAgIHRoaXMuY2hpbGQgPSBpc1ByZXNlbnQoaW5zdHJ1Y3Rpb24pID8gaW5zdHJ1Y3Rpb24uY2hpbGQgOiBudWxsO1xuICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50ID0gaXNQcmVzZW50KGluc3RydWN0aW9uKSA/IGluc3RydWN0aW9uLmNvbXBvbmVudCA6IG51bGw7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgUmVkaXJlY3RJbnN0cnVjdGlvbiBleHRlbmRzIFJlc29sdmVkSW5zdHJ1Y3Rpb24ge1xuICBjb25zdHJ1Y3Rvcihjb21wb25lbnQ6IENvbXBvbmVudEluc3RydWN0aW9uLCBjaGlsZDogSW5zdHJ1Y3Rpb24sXG4gICAgICAgICAgICAgIGF1eEluc3RydWN0aW9uOiB7W2tleTogc3RyaW5nXTogSW5zdHJ1Y3Rpb259LCBwcml2YXRlIF9zcGVjaWZpY2l0eTogc3RyaW5nKSB7XG4gICAgc3VwZXIoY29tcG9uZW50LCBjaGlsZCwgYXV4SW5zdHJ1Y3Rpb24pO1xuICB9XG5cbiAgZ2V0IHNwZWNpZmljaXR5KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9zcGVjaWZpY2l0eTsgfVxufVxuXG5cbi8qKlxuICogQSBgQ29tcG9uZW50SW5zdHJ1Y3Rpb25gIHJlcHJlc2VudHMgdGhlIHJvdXRlIHN0YXRlIGZvciBhIHNpbmdsZSBjb21wb25lbnQuXG4gKlxuICogYENvbXBvbmVudEluc3RydWN0aW9uc2AgaXMgYSBwdWJsaWMgQVBJLiBJbnN0YW5jZXMgb2YgYENvbXBvbmVudEluc3RydWN0aW9uYCBhcmUgcGFzc2VkXG4gKiB0byByb3V0ZSBsaWZlY3ljbGUgaG9va3MsIGxpa2Uge0BsaW5rIENhbkFjdGl2YXRlfS5cbiAqXG4gKiBgQ29tcG9uZW50SW5zdHJ1Y3Rpb25gcyBhcmUgW2hhc2ggY29uc2VkXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9IYXNoX2NvbnNpbmcpLiBZb3Ugc2hvdWxkXG4gKiBuZXZlciBjb25zdHJ1Y3Qgb25lIHlvdXJzZWxmIHdpdGggXCJuZXcuXCIgSW5zdGVhZCwgcmVseSBvbiB7QGxpbmsgUm91dGVyL1JvdXRlUmVjb2duaXplcn0gdG9cbiAqIGNvbnN0cnVjdCBgQ29tcG9uZW50SW5zdHJ1Y3Rpb25gcy5cbiAqXG4gKiBZb3Ugc2hvdWxkIG5vdCBtb2RpZnkgdGhpcyBvYmplY3QuIEl0IHNob3VsZCBiZSB0cmVhdGVkIGFzIGltbXV0YWJsZS5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbXBvbmVudEluc3RydWN0aW9uIHtcbiAgcmV1c2U6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIHJvdXRlRGF0YTogUm91dGVEYXRhO1xuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB1cmxQYXRoOiBzdHJpbmcsIHB1YmxpYyB1cmxQYXJhbXM6IHN0cmluZ1tdLCBkYXRhOiBSb3V0ZURhdGEsXG4gICAgICAgICAgICAgIHB1YmxpYyBjb21wb25lbnRUeXBlLCBwdWJsaWMgdGVybWluYWw6IGJvb2xlYW4sIHB1YmxpYyBzcGVjaWZpY2l0eTogc3RyaW5nLFxuICAgICAgICAgICAgICBwdWJsaWMgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IG51bGwsIHB1YmxpYyByb3V0ZU5hbWU6IHN0cmluZykge1xuICAgIHRoaXMucm91dGVEYXRhID0gaXNQcmVzZW50KGRhdGEpID8gZGF0YSA6IEJMQU5LX1JPVVRFX0RBVEE7XG4gIH1cbn1cbiJdfQ==