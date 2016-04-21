'use strict';"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var collection_1 = require('angular2/src/facade/collection');
var async_1 = require('angular2/src/facade/async');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var reflection_1 = require('angular2/src/core/reflection/reflection');
var core_1 = require('angular2/core');
var route_config_impl_1 = require('./route_config/route_config_impl');
var rules_1 = require('./rules/rules');
var rule_set_1 = require('./rules/rule_set');
var instruction_1 = require('./instruction');
var route_config_normalizer_1 = require('./route_config/route_config_normalizer');
var url_parser_1 = require('./url_parser');
var _resolveToNull = async_1.PromiseWrapper.resolve(null);
// A LinkItemArray is an array, which describes a set of routes
// The items in the array are found in groups:
// - the first item is the name of the route
// - the next items are:
//   - an object containing parameters
//   - or an array describing an aux route
// export type LinkRouteItem = string | Object;
// export type LinkItem = LinkRouteItem | Array<LinkRouteItem>;
// export type LinkItemArray = Array<LinkItem>;
/**
 * Token used to bind the component with the top-level {@link RouteConfig}s for the
 * application.
 *
 * ### Example ([live demo](http://plnkr.co/edit/iRUP8B5OUbxCWQ3AcIDm))
 *
 * ```
 * import {Component} from 'angular2/core';
 * import {
 *   ROUTER_DIRECTIVES,
 *   ROUTER_PROVIDERS,
 *   RouteConfig
 * } from 'angular2/router';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {...},
 * ])
 * class AppCmp {
 *   // ...
 * }
 *
 * bootstrap(AppCmp, [ROUTER_PROVIDERS]);
 * ```
 */
exports.ROUTER_PRIMARY_COMPONENT = lang_1.CONST_EXPR(new core_1.OpaqueToken('RouterPrimaryComponent'));
/**
 * The RouteRegistry holds route configurations for each component in an Angular app.
 * It is responsible for creating Instructions from URLs, and generating URLs based on route and
 * parameters.
 */
var RouteRegistry = (function () {
    function RouteRegistry(_rootComponent) {
        this._rootComponent = _rootComponent;
        this._rules = new collection_1.Map();
    }
    /**
     * Given a component and a configuration object, add the route to this registry
     */
    RouteRegistry.prototype.config = function (parentComponent, config) {
        config = route_config_normalizer_1.normalizeRouteConfig(config, this);
        // this is here because Dart type guard reasons
        if (config instanceof route_config_impl_1.Route) {
            route_config_normalizer_1.assertComponentExists(config.component, config.path);
        }
        else if (config instanceof route_config_impl_1.AuxRoute) {
            route_config_normalizer_1.assertComponentExists(config.component, config.path);
        }
        var rules = this._rules.get(parentComponent);
        if (lang_1.isBlank(rules)) {
            rules = new rule_set_1.RuleSet();
            this._rules.set(parentComponent, rules);
        }
        var terminal = rules.config(config);
        if (config instanceof route_config_impl_1.Route) {
            if (terminal) {
                assertTerminalComponent(config.component, config.path);
            }
            else {
                this.configFromComponent(config.component);
            }
        }
    };
    /**
     * Reads the annotations of a component and configures the registry based on them
     */
    RouteRegistry.prototype.configFromComponent = function (component) {
        var _this = this;
        if (!lang_1.isType(component)) {
            return;
        }
        // Don't read the annotations from a type more than once –
        // this prevents an infinite loop if a component routes recursively.
        if (this._rules.has(component)) {
            return;
        }
        var annotations = reflection_1.reflector.annotations(component);
        if (lang_1.isPresent(annotations)) {
            for (var i = 0; i < annotations.length; i++) {
                var annotation = annotations[i];
                if (annotation instanceof route_config_impl_1.RouteConfig) {
                    var routeCfgs = annotation.configs;
                    routeCfgs.forEach(function (config) { return _this.config(component, config); });
                }
            }
        }
    };
    /**
     * Given a URL and a parent component, return the most specific instruction for navigating
     * the application into the state specified by the url
     */
    RouteRegistry.prototype.recognize = function (url, ancestorInstructions) {
        var parsedUrl = url_parser_1.parser.parse(url);
        return this._recognize(parsedUrl, []);
    };
    /**
     * Recognizes all parent-child routes, but creates unresolved auxiliary routes
     */
    RouteRegistry.prototype._recognize = function (parsedUrl, ancestorInstructions, _aux) {
        var _this = this;
        if (_aux === void 0) { _aux = false; }
        var parentInstruction = collection_1.ListWrapper.last(ancestorInstructions);
        var parentComponent = lang_1.isPresent(parentInstruction) ? parentInstruction.component.componentType :
            this._rootComponent;
        var rules = this._rules.get(parentComponent);
        if (lang_1.isBlank(rules)) {
            return _resolveToNull;
        }
        // Matches some beginning part of the given URL
        var possibleMatches = _aux ? rules.recognizeAuxiliary(parsedUrl) : rules.recognize(parsedUrl);
        var matchPromises = possibleMatches.map(function (candidate) { return candidate.then(function (candidate) {
            if (candidate instanceof rules_1.PathMatch) {
                var auxParentInstructions = ancestorInstructions.length > 0 ? [collection_1.ListWrapper.last(ancestorInstructions)] : [];
                var auxInstructions = _this._auxRoutesToUnresolved(candidate.remainingAux, auxParentInstructions);
                var instruction = new instruction_1.ResolvedInstruction(candidate.instruction, null, auxInstructions);
                if (lang_1.isBlank(candidate.instruction) || candidate.instruction.terminal) {
                    return instruction;
                }
                var newAncestorInstructions = ancestorInstructions.concat([instruction]);
                return _this._recognize(candidate.remaining, newAncestorInstructions)
                    .then(function (childInstruction) {
                    if (lang_1.isBlank(childInstruction)) {
                        return null;
                    }
                    // redirect instructions are already absolute
                    if (childInstruction instanceof instruction_1.RedirectInstruction) {
                        return childInstruction;
                    }
                    instruction.child = childInstruction;
                    return instruction;
                });
            }
            if (candidate instanceof rules_1.RedirectMatch) {
                var instruction = _this.generate(candidate.redirectTo, ancestorInstructions.concat([null]));
                return new instruction_1.RedirectInstruction(instruction.component, instruction.child, instruction.auxInstruction, candidate.specificity);
            }
        }); });
        if ((lang_1.isBlank(parsedUrl) || parsedUrl.path == '') && possibleMatches.length == 0) {
            return async_1.PromiseWrapper.resolve(this.generateDefault(parentComponent));
        }
        return async_1.PromiseWrapper.all(matchPromises).then(mostSpecific);
    };
    RouteRegistry.prototype._auxRoutesToUnresolved = function (auxRoutes, parentInstructions) {
        var _this = this;
        var unresolvedAuxInstructions = {};
        auxRoutes.forEach(function (auxUrl) {
            unresolvedAuxInstructions[auxUrl.path] = new instruction_1.UnresolvedInstruction(function () { return _this._recognize(auxUrl, parentInstructions, true); });
        });
        return unresolvedAuxInstructions;
    };
    /**
     * Given a normalized list with component names and params like: `['user', {id: 3 }]`
     * generates a url with a leading slash relative to the provided `parentComponent`.
     *
     * If the optional param `_aux` is `true`, then we generate starting at an auxiliary
     * route boundary.
     */
    RouteRegistry.prototype.generate = function (linkParams, ancestorInstructions, _aux) {
        if (_aux === void 0) { _aux = false; }
        var params = splitAndFlattenLinkParams(linkParams);
        var prevInstruction;
        // The first segment should be either '.' (generate from parent) or '' (generate from root).
        // When we normalize above, we strip all the slashes, './' becomes '.' and '/' becomes ''.
        if (collection_1.ListWrapper.first(params) == '') {
            params.shift();
            prevInstruction = collection_1.ListWrapper.first(ancestorInstructions);
            ancestorInstructions = [];
        }
        else {
            prevInstruction = ancestorInstructions.length > 0 ? ancestorInstructions.pop() : null;
            if (collection_1.ListWrapper.first(params) == '.') {
                params.shift();
            }
            else if (collection_1.ListWrapper.first(params) == '..') {
                while (collection_1.ListWrapper.first(params) == '..') {
                    if (ancestorInstructions.length <= 0) {
                        throw new exceptions_1.BaseException("Link \"" + collection_1.ListWrapper.toJSON(linkParams) + "\" has too many \"../\" segments.");
                    }
                    prevInstruction = ancestorInstructions.pop();
                    params = collection_1.ListWrapper.slice(params, 1);
                }
            }
            else {
                // we must only peak at the link param, and not consume it
                var routeName = collection_1.ListWrapper.first(params);
                var parentComponentType = this._rootComponent;
                var grandparentComponentType = null;
                if (ancestorInstructions.length > 1) {
                    var parentComponentInstruction = ancestorInstructions[ancestorInstructions.length - 1];
                    var grandComponentInstruction = ancestorInstructions[ancestorInstructions.length - 2];
                    parentComponentType = parentComponentInstruction.component.componentType;
                    grandparentComponentType = grandComponentInstruction.component.componentType;
                }
                else if (ancestorInstructions.length == 1) {
                    parentComponentType = ancestorInstructions[0].component.componentType;
                    grandparentComponentType = this._rootComponent;
                }
                // For a link with no leading `./`, `/`, or `../`, we look for a sibling and child.
                // If both exist, we throw. Otherwise, we prefer whichever exists.
                var childRouteExists = this.hasRoute(routeName, parentComponentType);
                var parentRouteExists = lang_1.isPresent(grandparentComponentType) &&
                    this.hasRoute(routeName, grandparentComponentType);
                if (parentRouteExists && childRouteExists) {
                    var msg = "Link \"" + collection_1.ListWrapper.toJSON(linkParams) + "\" is ambiguous, use \"./\" or \"../\" to disambiguate.";
                    throw new exceptions_1.BaseException(msg);
                }
                if (parentRouteExists) {
                    prevInstruction = ancestorInstructions.pop();
                }
            }
        }
        if (params[params.length - 1] == '') {
            params.pop();
        }
        if (params.length > 0 && params[0] == '') {
            params.shift();
        }
        if (params.length < 1) {
            var msg = "Link \"" + collection_1.ListWrapper.toJSON(linkParams) + "\" must include a route name.";
            throw new exceptions_1.BaseException(msg);
        }
        var generatedInstruction = this._generate(params, ancestorInstructions, prevInstruction, _aux, linkParams);
        // we don't clone the first (root) element
        for (var i = ancestorInstructions.length - 1; i >= 0; i--) {
            var ancestorInstruction = ancestorInstructions[i];
            if (lang_1.isBlank(ancestorInstruction)) {
                break;
            }
            generatedInstruction = ancestorInstruction.replaceChild(generatedInstruction);
        }
        return generatedInstruction;
    };
    /*
     * Internal helper that does not make any assertions about the beginning of the link DSL.
     * `ancestorInstructions` are parents that will be cloned.
     * `prevInstruction` is the existing instruction that would be replaced, but which might have
     * aux routes that need to be cloned.
     */
    RouteRegistry.prototype._generate = function (linkParams, ancestorInstructions, prevInstruction, _aux, _originalLink) {
        var _this = this;
        if (_aux === void 0) { _aux = false; }
        var parentComponentType = this._rootComponent;
        var componentInstruction = null;
        var auxInstructions = {};
        var parentInstruction = collection_1.ListWrapper.last(ancestorInstructions);
        if (lang_1.isPresent(parentInstruction) && lang_1.isPresent(parentInstruction.component)) {
            parentComponentType = parentInstruction.component.componentType;
        }
        if (linkParams.length == 0) {
            var defaultInstruction = this.generateDefault(parentComponentType);
            if (lang_1.isBlank(defaultInstruction)) {
                throw new exceptions_1.BaseException("Link \"" + collection_1.ListWrapper.toJSON(_originalLink) + "\" does not resolve to a terminal instruction.");
            }
            return defaultInstruction;
        }
        // for non-aux routes, we want to reuse the predecessor's existing primary and aux routes
        // and only override routes for which the given link DSL provides
        if (lang_1.isPresent(prevInstruction) && !_aux) {
            auxInstructions = collection_1.StringMapWrapper.merge(prevInstruction.auxInstruction, auxInstructions);
            componentInstruction = prevInstruction.component;
        }
        var rules = this._rules.get(parentComponentType);
        if (lang_1.isBlank(rules)) {
            throw new exceptions_1.BaseException("Component \"" + lang_1.getTypeNameForDebugging(parentComponentType) + "\" has no route config.");
        }
        var linkParamIndex = 0;
        var routeParams = {};
        // first, recognize the primary route if one is provided
        if (linkParamIndex < linkParams.length && lang_1.isString(linkParams[linkParamIndex])) {
            var routeName = linkParams[linkParamIndex];
            if (routeName == '' || routeName == '.' || routeName == '..') {
                throw new exceptions_1.BaseException("\"" + routeName + "/\" is only allowed at the beginning of a link DSL.");
            }
            linkParamIndex += 1;
            if (linkParamIndex < linkParams.length) {
                var linkParam = linkParams[linkParamIndex];
                if (lang_1.isStringMap(linkParam) && !lang_1.isArray(linkParam)) {
                    routeParams = linkParam;
                    linkParamIndex += 1;
                }
            }
            var routeRecognizer = (_aux ? rules.auxRulesByName : rules.rulesByName).get(routeName);
            if (lang_1.isBlank(routeRecognizer)) {
                throw new exceptions_1.BaseException("Component \"" + lang_1.getTypeNameForDebugging(parentComponentType) + "\" has no route named \"" + routeName + "\".");
            }
            // Create an "unresolved instruction" for async routes
            // we'll figure out the rest of the route when we resolve the instruction and
            // perform a navigation
            if (lang_1.isBlank(routeRecognizer.handler.componentType)) {
                var generatedUrl = routeRecognizer.generateComponentPathValues(routeParams);
                return new instruction_1.UnresolvedInstruction(function () {
                    return routeRecognizer.handler.resolveComponentType().then(function (_) {
                        return _this._generate(linkParams, ancestorInstructions, prevInstruction, _aux, _originalLink);
                    });
                }, generatedUrl.urlPath, url_parser_1.convertUrlParamsToArray(generatedUrl.urlParams));
            }
            componentInstruction = _aux ? rules.generateAuxiliary(routeName, routeParams) :
                rules.generate(routeName, routeParams);
        }
        // Next, recognize auxiliary instructions.
        // If we have an ancestor instruction, we preserve whatever aux routes are active from it.
        while (linkParamIndex < linkParams.length && lang_1.isArray(linkParams[linkParamIndex])) {
            var auxParentInstruction = [parentInstruction];
            var auxInstruction = this._generate(linkParams[linkParamIndex], auxParentInstruction, null, true, _originalLink);
            // TODO: this will not work for aux routes with parameters or multiple segments
            auxInstructions[auxInstruction.component.urlPath] = auxInstruction;
            linkParamIndex += 1;
        }
        var instruction = new instruction_1.ResolvedInstruction(componentInstruction, null, auxInstructions);
        // If the component is sync, we can generate resolved child route instructions
        // If not, we'll resolve the instructions at navigation time
        if (lang_1.isPresent(componentInstruction) && lang_1.isPresent(componentInstruction.componentType)) {
            var childInstruction = null;
            if (componentInstruction.terminal) {
                if (linkParamIndex >= linkParams.length) {
                }
            }
            else {
                var childAncestorComponents = ancestorInstructions.concat([instruction]);
                var remainingLinkParams = linkParams.slice(linkParamIndex);
                childInstruction = this._generate(remainingLinkParams, childAncestorComponents, null, false, _originalLink);
            }
            instruction.child = childInstruction;
        }
        return instruction;
    };
    RouteRegistry.prototype.hasRoute = function (name, parentComponent) {
        var rules = this._rules.get(parentComponent);
        if (lang_1.isBlank(rules)) {
            return false;
        }
        return rules.hasRoute(name);
    };
    RouteRegistry.prototype.generateDefault = function (componentCursor) {
        var _this = this;
        if (lang_1.isBlank(componentCursor)) {
            return null;
        }
        var rules = this._rules.get(componentCursor);
        if (lang_1.isBlank(rules) || lang_1.isBlank(rules.defaultRule)) {
            return null;
        }
        var defaultChild = null;
        if (lang_1.isPresent(rules.defaultRule.handler.componentType)) {
            var componentInstruction = rules.defaultRule.generate({});
            if (!rules.defaultRule.terminal) {
                defaultChild = this.generateDefault(rules.defaultRule.handler.componentType);
            }
            return new instruction_1.DefaultInstruction(componentInstruction, defaultChild);
        }
        return new instruction_1.UnresolvedInstruction(function () {
            return rules.defaultRule.handler.resolveComponentType().then(function (_) { return _this.generateDefault(componentCursor); });
        });
    };
    RouteRegistry = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(exports.ROUTER_PRIMARY_COMPONENT)), 
        __metadata('design:paramtypes', [lang_1.Type])
    ], RouteRegistry);
    return RouteRegistry;
}());
exports.RouteRegistry = RouteRegistry;
/*
 * Given: ['/a/b', {c: 2}]
 * Returns: ['', 'a', 'b', {c: 2}]
 */
function splitAndFlattenLinkParams(linkParams) {
    var accumulation = [];
    linkParams.forEach(function (item) {
        if (lang_1.isString(item)) {
            var strItem = item;
            accumulation = accumulation.concat(strItem.split('/'));
        }
        else {
            accumulation.push(item);
        }
    });
    return accumulation;
}
/*
 * Given a list of instructions, returns the most specific instruction
 */
function mostSpecific(instructions) {
    instructions = instructions.filter(function (instruction) { return lang_1.isPresent(instruction); });
    if (instructions.length == 0) {
        return null;
    }
    if (instructions.length == 1) {
        return instructions[0];
    }
    var first = instructions[0];
    var rest = instructions.slice(1);
    return rest.reduce(function (instruction, contender) {
        if (compareSpecificityStrings(contender.specificity, instruction.specificity) == -1) {
            return contender;
        }
        return instruction;
    }, first);
}
/*
 * Expects strings to be in the form of "[0-2]+"
 * Returns -1 if string A should be sorted above string B, 1 if it should be sorted after,
 * or 0 if they are the same.
 */
function compareSpecificityStrings(a, b) {
    var l = lang_1.Math.min(a.length, b.length);
    for (var i = 0; i < l; i += 1) {
        var ai = lang_1.StringWrapper.charCodeAt(a, i);
        var bi = lang_1.StringWrapper.charCodeAt(b, i);
        var difference = bi - ai;
        if (difference != 0) {
            return difference;
        }
    }
    return a.length - b.length;
}
function assertTerminalComponent(component, path) {
    if (!lang_1.isType(component)) {
        return;
    }
    var annotations = reflection_1.reflector.annotations(component);
    if (lang_1.isPresent(annotations)) {
        for (var i = 0; i < annotations.length; i++) {
            var annotation = annotations[i];
            if (annotation instanceof route_config_impl_1.RouteConfig) {
                throw new exceptions_1.BaseException("Child routes are not allowed for \"" + path + "\". Use \"...\" on the parent's route path.");
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVfcmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvcm91dGVyL3JvdXRlX3JlZ2lzdHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQkFBNkQsZ0NBQWdDLENBQUMsQ0FBQTtBQUM5RixzQkFBNkIsMkJBQTJCLENBQUMsQ0FBQTtBQUN6RCxxQkFZTywwQkFBMEIsQ0FBQyxDQUFBO0FBQ2xDLDJCQUE4QyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQy9FLDJCQUF3Qix5Q0FBeUMsQ0FBQyxDQUFBO0FBQ2xFLHFCQUE4QyxlQUFlLENBQUMsQ0FBQTtBQUU5RCxrQ0FPTyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQzFDLHNCQUFtRCxlQUFlLENBQUMsQ0FBQTtBQUNuRSx5QkFBc0Isa0JBQWtCLENBQUMsQ0FBQTtBQUN6Qyw0QkFNTyxlQUFlLENBQUMsQ0FBQTtBQUV2Qix3Q0FBMEQsd0NBQXdDLENBQUMsQ0FBQTtBQUNuRywyQkFBc0UsY0FBYyxDQUFDLENBQUE7QUFHckYsSUFBSSxjQUFjLEdBQUcsc0JBQWMsQ0FBQyxPQUFPLENBQWMsSUFBSSxDQUFDLENBQUM7QUFFL0QsK0RBQStEO0FBQy9ELDhDQUE4QztBQUM5Qyw0Q0FBNEM7QUFDNUMsd0JBQXdCO0FBQ3hCLHNDQUFzQztBQUN0QywwQ0FBMEM7QUFDMUMsK0NBQStDO0FBQy9DLCtEQUErRDtBQUMvRCwrQ0FBK0M7QUFFL0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUNVLGdDQUF3QixHQUNqQyxpQkFBVSxDQUFDLElBQUksa0JBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7QUFHMUQ7Ozs7R0FJRztBQUVIO0lBR0UsdUJBQXNELGNBQW9CO1FBQXBCLG1CQUFjLEdBQWQsY0FBYyxDQUFNO1FBRmxFLFdBQU0sR0FBRyxJQUFJ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RCxpQ0FBaUMsU0FBUyxFQUFFLElBQUk7SUFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQztJQUNULENBQUM7SUFFRCxJQUFJLFdBQVcsR0FBRyxzQkFBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuRCxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM1QyxJQUFJLFVBQVUsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFaEMsRUFBRSxDQUFDLENBQUMsVUFBVSxZQUFZLCtCQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLElBQUksMEJBQWEsQ0FDbkIsd0NBQXFDLElBQUksZ0RBQTBDLENBQUMsQ0FBQztZQUMzRixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMaXN0V3JhcHBlciwgTWFwLCBNYXBXcmFwcGVyLCBTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtQcm9taXNlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge1xuICBpc1ByZXNlbnQsXG4gIGlzQXJyYXksXG4gIGlzQmxhbmssXG4gIGlzVHlwZSxcbiAgaXNTdHJpbmcsXG4gIGlzU3RyaW5nTWFwLFxuICBUeXBlLFxuICBTdHJpbmdXcmFwcGVyLFxuICBNYXRoLFxuICBnZXRUeXBlTmFtZUZvckRlYnVnZ2luZyxcbiAgQ09OU1RfRVhQUlxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBXcmFwcGVkRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtyZWZsZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdGlvbic7XG5pbXBvcnQge0luamVjdGFibGUsIEluamVjdCwgT3BhcXVlVG9rZW59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBSb3V0ZUNvbmZpZyxcbiAgQXN5bmNSb3V0ZSxcbiAgUm91dGUsXG4gIEF1eFJvdXRlLFxuICBSZWRpcmVjdCxcbiAgUm91dGVEZWZpbml0aW9uXG59IGZyb20gJy4vcm91dGVfY29uZmlnL3JvdXRlX2NvbmZpZ19pbXBsJztcbmltcG9ydCB7UGF0aE1hdGNoLCBSZWRpcmVjdE1hdGNoLCBSb3V0ZU1hdGNofSBmcm9tICcuL3J1bGVzL3J1bGVzJztcbmltcG9ydCB7UnVsZVNldH0gZnJvbSAnLi9ydWxlcy9ydWxlX3NldCc7XG5pbXBvcnQge1xuICBJbnN0cnVjdGlvbixcbiAgUmVzb2x2ZWRJbnN0cnVjdGlvbixcbiAgUmVkaXJlY3RJbnN0cnVjdGlvbixcbiAgVW5yZXNvbHZlZEluc3RydWN0aW9uLFxuICBEZWZhdWx0SW5zdHJ1Y3Rpb25cbn0gZnJvbSAnLi9pbnN0cnVjdGlvbic7XG5cbmltcG9ydCB7bm9ybWFsaXplUm91dGVDb25maWcsIGFzc2VydENvbXBvbmVudEV4aXN0c30gZnJvbSAnLi9yb3V0ZV9jb25maWcvcm91dGVfY29uZmlnX25vcm1hbGl6ZXInO1xuaW1wb3J0IHtwYXJzZXIsIFVybCwgY29udmVydFVybFBhcmFtc1RvQXJyYXksIHBhdGhTZWdtZW50c1RvVXJsfSBmcm9tICcuL3VybF9wYXJzZXInO1xuaW1wb3J0IHtHZW5lcmF0ZWRVcmx9IGZyb20gJy4vcnVsZXMvcm91dGVfcGF0aHMvcm91dGVfcGF0aCc7XG5cbnZhciBfcmVzb2x2ZVRvTnVsbCA9IFByb21pc2VXcmFwcGVyLnJlc29sdmU8SW5zdHJ1Y3Rpb24+KG51bGwpO1xuXG4vLyBBIExpbmtJdGVtQXJyYXkgaXMgYW4gYXJyYXksIHdoaWNoIGRlc2NyaWJlcyBhIHNldCBvZiByb3V0ZXNcbi8vIFRoZSBpdGVtcyBpbiB0aGUgYXJyYXkgYXJlIGZvdW5kIGluIGdyb3Vwczpcbi8vIC0gdGhlIGZpcnN0IGl0ZW0gaXMgdGhlIG5hbWUgb2YgdGhlIHJvdXRlXG4vLyAtIHRoZSBuZXh0IGl0ZW1zIGFyZTpcbi8vICAgLSBhbiBvYmplY3QgY29udGFpbmluZyBwYXJhbWV0ZXJzXG4vLyAgIC0gb3IgYW4gYXJyYXkgZGVzY3JpYmluZyBhbiBhdXggcm91dGVcbi8vIGV4cG9ydCB0eXBlIExpbmtSb3V0ZUl0ZW0gPSBzdHJpbmcgfCBPYmplY3Q7XG4vLyBleHBvcnQgdHlwZSBMaW5rSXRlbSA9IExpbmtSb3V0ZUl0ZW0gfCBBcnJheTxMaW5rUm91dGVJdGVtPjtcbi8vIGV4cG9ydCB0eXBlIExpbmtJdGVtQXJyYXkgPSBBcnJheTxMaW5rSXRlbT47XG5cbi8qKlxuICogVG9rZW4gdXNlZCB0byBiaW5kIHRoZSBjb21wb25lbnQgd2l0aCB0aGUgdG9wLWxldmVsIHtAbGluayBSb3V0ZUNvbmZpZ31zIGZvciB0aGVcbiAqIGFwcGxpY2F0aW9uLlxuICpcbiAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9pUlVQOEI1T1VieENXUTNBY0lEbSkpXG4gKlxuICogYGBgXG4gKiBpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG4gKiBpbXBvcnQge1xuICogICBST1VURVJfRElSRUNUSVZFUyxcbiAqICAgUk9VVEVSX1BST1ZJREVSUyxcbiAqICAgUm91dGVDb25maWdcbiAqIH0gZnJvbSAnYW5ndWxhcjIvcm91dGVyJztcbiAqXG4gKiBAQ29tcG9uZW50KHtkaXJlY3RpdmVzOiBbUk9VVEVSX0RJUkVDVElWRVNdfSlcbiAqIEBSb3V0ZUNvbmZpZyhbXG4gKiAgey4uLn0sXG4gKiBdKVxuICogY2xhc3MgQXBwQ21wIHtcbiAqICAgLy8gLi4uXG4gKiB9XG4gKlxuICogYm9vdHN0cmFwKEFwcENtcCwgW1JPVVRFUl9QUk9WSURFUlNdKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgUk9VVEVSX1BSSU1BUllfQ09NUE9ORU5UOiBPcGFxdWVUb2tlbiA9XG4gICAgQ09OU1RfRVhQUihuZXcgT3BhcXVlVG9rZW4oJ1JvdXRlclByaW1hcnlDb21wb25lbnQnKSk7XG5cblxuLyoqXG4gKiBUaGUgUm91dGVSZWdpc3RyeSBob2xkcyByb3V0ZSBjb25maWd1cmF0aW9ucyBmb3IgZWFjaCBjb21wb25lbnQgaW4gYW4gQW5ndWxhciBhcHAuXG4gKiBJdCBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgSW5zdHJ1Y3Rpb25zIGZyb20gVVJMcywgYW5kIGdlbmVyYXRpbmcgVVJMcyBiYXNlZCBvbiByb3V0ZSBhbmRcbiAqIHBhcmFtZXRlcnMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSb3V0ZVJlZ2lzdHJ5IHtcbiAgcHJpdmF0ZSBfcnVsZXMgPSBuZXcgTWFwPGFueSwgUnVsZVNldD4oKTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KFJPVVRFUl9QUklNQVJZX0NPTVBPTkVOVCkgcHJpdmF0ZSBfcm9vdENvbXBvbmVudDogVHlwZSkge31cblxuICAvKipcbiAgICogR2l2ZW4gYSBjb21wb25lbnQgYW5kIGEgY29uZmlndXJhdGlvbiBvYmplY3QsIGFkZCB0aGUgcm91dGUgdG8gdGhpcyByZWdpc3RyeVxuICAgKi9cbiAgY29uZmlnKHBhcmVudENvbXBvbmVudDogYW55LCBjb25maWc6IFJvdXRlRGVmaW5pdGlvbik6IHZvaWQge1xuICAgIGNvbmZpZyA9IG5vcm1hbGl6ZVJvdXRlQ29uZmlnKGNvbmZpZywgdGhpcyk7XG5cbiAgICAvLyB0aGlzIGlzIGhlcmUgYmVjYXVzZSBEYXJ0IHR5cGUgZ3VhcmQgcmVhc29uc1xuICAgIGlmIChjb25maWcgaW5zdGFuY2VvZiBSb3V0ZSkge1xuICAgICAgYXNzZXJ0Q29tcG9uZW50RXhpc3RzKGNvbmZpZy5jb21wb25lbnQsIGNvbmZpZy5wYXRoKTtcbiAgICB9IGVsc2UgaWYgKGNvbmZpZyBpbnN0YW5jZW9mIEF1eFJvdXRlKSB7XG4gICAgICBhc3NlcnRDb21wb25lbnRFeGlzdHMoY29uZmlnLmNvbXBvbmVudCwgY29uZmlnLnBhdGgpO1xuICAgIH1cblxuICAgIHZhciBydWxlcyA9IHRoaXMuX3J1bGVzLmdldChwYXJlbnRDb21wb25lbnQpO1xuXG4gICAgaWYgKGlzQmxhbmsocnVsZXMpKSB7XG4gICAgICBydWxlcyA9IG5ldyBSdWxlU2V0KCk7XG4gICAgICB0aGlzLl9ydWxlcy5zZXQocGFyZW50Q29tcG9uZW50LCBydWxlcyk7XG4gICAgfVxuXG4gICAgdmFyIHRlcm1pbmFsID0gcnVsZXMuY29uZmlnKGNvbmZpZyk7XG5cbiAgICBpZiAoY29uZmlnIGluc3RhbmNlb2YgUm91dGUpIHtcbiAgICAgIGlmICh0ZXJtaW5hbCkge1xuICAgICAgICBhc3NlcnRUZXJtaW5hbENvbXBvbmVudChjb25maWcuY29tcG9uZW50LCBjb25maWcucGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbmZpZ0Zyb21Db21wb25lbnQoY29uZmlnLmNvbXBvbmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlYWRzIHRoZSBhbm5vdGF0aW9ucyBvZiBhIGNvbXBvbmVudCBhbmQgY29uZmlndXJlcyB0aGUgcmVnaXN0cnkgYmFzZWQgb24gdGhlbVxuICAgKi9cbiAgY29uZmlnRnJvbUNvbXBvbmVudChjb21wb25lbnQ6IGFueSk6IHZvaWQge1xuICAgIGlmICghaXNUeXBlKGNvbXBvbmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEb24ndCByZWFkIHRoZSBhbm5vdGF0aW9ucyBmcm9tIGEgdHlwZSBtb3JlIHRoYW4gb25jZSDigJNcbiAgICAvLyB0aGlzIHByZXZlbnRzIGFuIGluZmluaXRlIGxvb3AgaWYgYSBjb21wb25lbnQgcm91dGVzIHJlY3Vyc2l2ZWx5LlxuICAgIGlmICh0aGlzLl9ydWxlcy5oYXMoY29tcG9uZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgYW5ub3RhdGlvbnMgPSByZWZsZWN0b3IuYW5ub3RhdGlvbnMoY29tcG9uZW50KTtcbiAgICBpZiAoaXNQcmVzZW50KGFubm90YXRpb25zKSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbm5vdGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYW5ub3RhdGlvbiA9IGFubm90YXRpb25zW2ldO1xuXG4gICAgICAgIGlmIChhbm5vdGF0aW9uIGluc3RhbmNlb2YgUm91dGVDb25maWcpIHtcbiAgICAgICAgICBsZXQgcm91dGVDZmdzOiBSb3V0ZURlZmluaXRpb25bXSA9IGFubm90YXRpb24uY29uZmlncztcbiAgICAgICAgICByb3V0ZUNmZ3MuZm9yRWFjaChjb25maWcgPT4gdGhpcy5jb25maWcoY29tcG9uZW50LCBjb25maWcpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIEdpdmVuIGEgVVJMIGFuZCBhIHBhcmVudCBjb21wb25lbnQsIHJldHVybiB0aGUgbW9zdCBzcGVjaWZpYyBpbnN0cnVjdGlvbiBmb3IgbmF2aWdhdGluZ1xuICAgKiB0aGUgYXBwbGljYXRpb24gaW50byB0aGUgc3RhdGUgc3BlY2lmaWVkIGJ5IHRoZSB1cmxcbiAgICovXG4gIHJlY29nbml6ZSh1cmw6IHN0cmluZywgYW5jZXN0b3JJbnN0cnVjdGlvbnM6IEluc3RydWN0aW9uW10pOiBQcm9taXNlPEluc3RydWN0aW9uPiB7XG4gICAgdmFyIHBhcnNlZFVybCA9IHBhcnNlci5wYXJzZSh1cmwpO1xuICAgIHJldHVybiB0aGlzLl9yZWNvZ25pemUocGFyc2VkVXJsLCBbXSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZWNvZ25pemVzIGFsbCBwYXJlbnQtY2hpbGQgcm91dGVzLCBidXQgY3JlYXRlcyB1bnJlc29sdmVkIGF1eGlsaWFyeSByb3V0ZXNcbiAgICovXG4gIHByaXZhdGUgX3JlY29nbml6ZShwYXJzZWRVcmw6IFVybCwgYW5jZXN0b3JJbnN0cnVjdGlvbnM6IEluc3RydWN0aW9uW10sXG4gICAgICAgICAgICAgICAgICAgICBfYXV4ID0gZmFsc2UpOiBQcm9taXNlPEluc3RydWN0aW9uPiB7XG4gICAgdmFyIHBhcmVudEluc3RydWN0aW9uID0gTGlzdFdyYXBwZXIubGFzdChhbmNlc3Rvckluc3RydWN0aW9ucyk7XG4gICAgdmFyIHBhcmVudENvbXBvbmVudCA9IGlzUHJlc2VudChwYXJlbnRJbnN0cnVjdGlvbikgPyBwYXJlbnRJbnN0cnVjdGlvbi5jb21wb25lbnQuY29tcG9uZW50VHlwZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yb290Q29tcG9uZW50O1xuXG4gICAgdmFyIHJ1bGVzID0gdGhpcy5fcnVsZXMuZ2V0KHBhcmVudENvbXBvbmVudCk7XG4gICAgaWYgKGlzQmxhbmsocnVsZXMpKSB7XG4gICAgICByZXR1cm4gX3Jlc29sdmVUb051bGw7XG4gICAgfVxuXG4gICAgLy8gTWF0Y2hlcyBzb21lIGJlZ2lubmluZyBwYXJ0IG9mIHRoZSBnaXZlbiBVUkxcbiAgICB2YXIgcG9zc2libGVNYXRjaGVzOiBQcm9taXNlPFJvdXRlTWF0Y2g+W10gPVxuICAgICAgICBfYXV4ID8gcnVsZXMucmVjb2duaXplQXV4aWxpYXJ5KHBhcnNlZFVybCkgOiBydWxlcy5yZWNvZ25pemUocGFyc2VkVXJsKTtcblxuICAgIHZhciBtYXRjaFByb21pc2VzOiBQcm9taXNlPEluc3RydWN0aW9uPltdID0gcG9zc2libGVNYXRjaGVzLm1hcChcbiAgICAgICAgKGNhbmRpZGF0ZTogUHJvbWlzZTxSb3V0ZU1hdGNoPikgPT4gY2FuZGlkYXRlLnRoZW4oKGNhbmRpZGF0ZTogUm91dGVNYXRjaCkgPT4ge1xuXG4gICAgICAgICAgaWYgKGNhbmRpZGF0ZSBpbnN0YW5jZW9mIFBhdGhNYXRjaCkge1xuICAgICAgICAgICAgdmFyIGF1eFBhcmVudEluc3RydWN0aW9uczogSW5zdHJ1Y3Rpb25bXSA9XG4gICAgICAgICAgICAgICAgYW5jZXN0b3JJbnN0cnVjdGlvbnMubGVuZ3RoID4gMCA/IFtMaXN0V3JhcHBlci5sYXN0KGFuY2VzdG9ySW5zdHJ1Y3Rpb25zKV0gOiBbXTtcbiAgICAgICAgICAgIHZhciBhdXhJbnN0cnVjdGlvbnMgPVxuICAgICAgICAgICAgICAgIHRoaXMuX2F1eFJvdXRlc1RvVW5yZXNvbHZlZChjYW5kaWRhdGUucmVtYWluaW5nQXV4LCBhdXhQYXJlbnRJbnN0cnVjdGlvbnMpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb24gPSBuZXcgUmVzb2x2ZWRJbnN0cnVjdGlvbihjYW5kaWRhdGUuaW5zdHJ1Y3Rpb24sIG51bGwsIGF1eEluc3RydWN0aW9ucyk7XG5cbiAgICAgICAgICAgIGlmIChpc0JsYW5rKGNhbmRpZGF0ZS5pbnN0cnVjdGlvbikgfHwgY2FuZGlkYXRlLmluc3RydWN0aW9uLnRlcm1pbmFsKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpbnN0cnVjdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5ld0FuY2VzdG9ySW5zdHJ1Y3Rpb25zOiBJbnN0cnVjdGlvbltdID0gYW5jZXN0b3JJbnN0cnVjdGlvbnMuY29uY2F0KFtpbnN0cnVjdGlvbl0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVjb2duaXplKGNhbmRpZGF0ZS5yZW1haW5pbmcsIG5ld0FuY2VzdG9ySW5zdHJ1Y3Rpb25zKVxuICAgICAgICAgICAgICAgIC50aGVuKChjaGlsZEluc3RydWN0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoaXNCbGFuayhjaGlsZEluc3RydWN0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgLy8gcmVkaXJlY3QgaW5zdHJ1Y3Rpb25zIGFyZSBhbHJlYWR5IGFic29sdXRlXG4gICAgICAgICAgICAgICAgICBpZiAoY2hpbGRJbnN0cnVjdGlvbiBpbnN0YW5jZW9mIFJlZGlyZWN0SW5zdHJ1Y3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkSW5zdHJ1Y3Rpb247XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbi5jaGlsZCA9IGNoaWxkSW5zdHJ1Y3Rpb247XG4gICAgICAgICAgICAgICAgICByZXR1cm4gaW5zdHJ1Y3Rpb247XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNhbmRpZGF0ZSBpbnN0YW5jZW9mIFJlZGlyZWN0TWF0Y2gpIHtcbiAgICAgICAgICAgIHZhciBpbnN0cnVjdGlvbiA9XG4gICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZShjYW5kaWRhdGUucmVkaXJlY3RUbywgYW5jZXN0b3JJbnN0cnVjdGlvbnMuY29uY2F0KFtudWxsXSkpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWRpcmVjdEluc3RydWN0aW9uKGluc3RydWN0aW9uLmNvbXBvbmVudCwgaW5zdHJ1Y3Rpb24uY2hpbGQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24uYXV4SW5zdHJ1Y3Rpb24sIGNhbmRpZGF0ZS5zcGVjaWZpY2l0eSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG5cbiAgICBpZiAoKGlzQmxhbmsocGFyc2VkVXJsKSB8fCBwYXJzZWRVcmwucGF0aCA9PSAnJykgJiYgcG9zc2libGVNYXRjaGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIucmVzb2x2ZSh0aGlzLmdlbmVyYXRlRGVmYXVsdChwYXJlbnRDb21wb25lbnQpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIuYWxsPEluc3RydWN0aW9uPihtYXRjaFByb21pc2VzKS50aGVuKG1vc3RTcGVjaWZpYyk7XG4gIH1cblxuICBwcml2YXRlIF9hdXhSb3V0ZXNUb1VucmVzb2x2ZWQoYXV4Um91dGVzOiBVcmxbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudEluc3RydWN0aW9uczogSW5zdHJ1Y3Rpb25bXSk6IHtba2V5OiBzdHJpbmddOiBJbnN0cnVjdGlvbn0ge1xuICAgIHZhciB1bnJlc29sdmVkQXV4SW5zdHJ1Y3Rpb25zOiB7W2tleTogc3RyaW5nXTogSW5zdHJ1Y3Rpb259ID0ge307XG5cbiAgICBhdXhSb3V0ZXMuZm9yRWFjaCgoYXV4VXJsOiBVcmwpID0+IHtcbiAgICAgIHVucmVzb2x2ZWRBdXhJbnN0cnVjdGlvbnNbYXV4VXJsLnBhdGhdID0gbmV3IFVucmVzb2x2ZWRJbnN0cnVjdGlvbihcbiAgICAgICAgICAoKSA9PiB7IHJldHVybiB0aGlzLl9yZWNvZ25pemUoYXV4VXJsLCBwYXJlbnRJbnN0cnVjdGlvbnMsIHRydWUpOyB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB1bnJlc29sdmVkQXV4SW5zdHJ1Y3Rpb25zO1xuICB9XG5cblxuICAvKipcbiAgICogR2l2ZW4gYSBub3JtYWxpemVkIGxpc3Qgd2l0aCBjb21wb25lbnQgbmFtZXMgYW5kIHBhcmFtcyBsaWtlOiBgWyd1c2VyJywge2lkOiAzIH1dYFxuICAgKiBnZW5lcmF0ZXMgYSB1cmwgd2l0aCBhIGxlYWRpbmcgc2xhc2ggcmVsYXRpdmUgdG8gdGhlIHByb3ZpZGVkIGBwYXJlbnRDb21wb25lbnRgLlxuICAgKlxuICAgKiBJZiB0aGUgb3B0aW9uYWwgcGFyYW0gYF9hdXhgIGlzIGB0cnVlYCwgdGhlbiB3ZSBnZW5lcmF0ZSBzdGFydGluZyBhdCBhbiBhdXhpbGlhcnlcbiAgICogcm91dGUgYm91bmRhcnkuXG4gICAqL1xuICBnZW5lcmF0ZShsaW5rUGFyYW1zOiBhbnlbXSwgYW5jZXN0b3JJbnN0cnVjdGlvbnM6IEluc3RydWN0aW9uW10sIF9hdXggPSBmYWxzZSk6IEluc3RydWN0aW9uIHtcbiAgICB2YXIgcGFyYW1zID0gc3BsaXRBbmRGbGF0dGVuTGlua1BhcmFtcyhsaW5rUGFyYW1zKTtcbiAgICB2YXIgcHJldkluc3RydWN0aW9uO1xuXG4gICAgLy8gVGhlIGZpcnN0IHNlZ21lbnQgc2hvdWxkIGJlIGVpdGhlciAnLicgKGdlbmVyYXRlIGZyb20gcGFyZW50KSBvciAnJyAoZ2VuZXJhdGUgZnJvbSByb290KS5cbiAgICAvLyBXaGVuIHdlIG5vcm1hbGl6ZSBhYm92ZSwgd2Ugc3RyaXAgYWxsIHRoZSBzbGFzaGVzLCAnLi8nIGJlY29tZXMgJy4nIGFuZCAnLycgYmVjb21lcyAnJy5cbiAgICBpZiAoTGlzdFdyYXBwZXIuZmlyc3QocGFyYW1zKSA9PSAnJykge1xuICAgICAgcGFyYW1zLnNoaWZ0KCk7XG4gICAgICBwcmV2SW5zdHJ1Y3Rpb24gPSBMaXN0V3JhcHBlci5maXJzdChhbmNlc3Rvckluc3RydWN0aW9ucyk7XG4gICAgICBhbmNlc3Rvckluc3RydWN0aW9ucyA9IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmV2SW5zdHJ1Y3Rpb24gPSBhbmNlc3Rvckluc3RydWN0aW9ucy5sZW5ndGggPiAwID8gYW5jZXN0b3JJbnN0cnVjdGlvbnMucG9wKCkgOiBudWxsO1xuXG4gICAgICBpZiAoTGlzdFdyYXBwZXIuZmlyc3QocGFyYW1zKSA9PSAnLicpIHtcbiAgICAgICAgcGFyYW1zLnNoaWZ0KCk7XG4gICAgICB9IGVsc2UgaWYgKExpc3RXcmFwcGVyLmZpcnN0KHBhcmFtcykgPT0gJy4uJykge1xuICAgICAgICB3aGlsZSAoTGlzdFdyYXBwZXIuZmlyc3QocGFyYW1zKSA9PSAnLi4nKSB7XG4gICAgICAgICAgaWYgKGFuY2VzdG9ySW5zdHJ1Y3Rpb25zLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcbiAgICAgICAgICAgICAgICBgTGluayBcIiR7TGlzdFdyYXBwZXIudG9KU09OKGxpbmtQYXJhbXMpfVwiIGhhcyB0b28gbWFueSBcIi4uL1wiIHNlZ21lbnRzLmApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwcmV2SW5zdHJ1Y3Rpb24gPSBhbmNlc3Rvckluc3RydWN0aW9ucy5wb3AoKTtcbiAgICAgICAgICBwYXJhbXMgPSBMaXN0V3JhcHBlci5zbGljZShwYXJhbXMsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2UncmUgb24gdG8gaW1wbGljaXQgY2hpbGQvc2libGluZyByb3V0ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gd2UgbXVzdCBvbmx5IHBlYWsgYXQgdGhlIGxpbmsgcGFyYW0sIGFuZCBub3QgY29uc3VtZSBpdFxuICAgICAgICBsZXQgcm91dGVOYW1lID0gTGlzdFdyYXBwZXIuZmlyc3QocGFyYW1zKTtcbiAgICAgICAgbGV0IHBhcmVudENvbXBvbmVudFR5cGUgPSB0aGlzLl9yb290Q29tcG9uZW50O1xuICAgICAgICBsZXQgZ3JhbmRwYXJlbnRDb21wb25lbnRUeXBlID0gbnVsbDtcblxuICAgICAgICBpZiAoYW5jZXN0b3JJbnN0cnVjdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGxldCBwYXJlbnRDb21wb25lbnRJbnN0cnVjdGlvbiA9IGFuY2VzdG9ySW5zdHJ1Y3Rpb25zW2FuY2VzdG9ySW5zdHJ1Y3Rpb25zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIGxldCBncmFuZENvbXBvbmVudEluc3RydWN0aW9uID0gYW5jZXN0b3JJbnN0cnVjdGlvbnNbYW5jZXN0b3JJbnN0cnVjdGlvbnMubGVuZ3RoIC0gMl07XG5cbiAgICAgICAgICBwYXJlbnRDb21wb25lbnRUeXBlID0gcGFyZW50Q29tcG9uZW50SW5zdHJ1Y3Rpb24uY29tcG9uZW50LmNvbXBvbmVudFR5cGU7XG4gICAgICAgICAgZ3JhbmRwYXJlbnRDb21wb25lbnRUeXBlID0gZ3JhbmRDb21wb25lbnRJbnN0cnVjdGlvbi5jb21wb25lbnQuY29tcG9uZW50VHlwZTtcbiAgICAgICAgfSBlbHNlIGlmIChhbmNlc3Rvckluc3RydWN0aW9ucy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgIHBhcmVudENvbXBvbmVudFR5cGUgPSBhbmNlc3Rvckluc3RydWN0aW9uc1swXS5jb21wb25lbnQuY29tcG9uZW50VHlwZTtcbiAgICAgICAgICBncmFuZHBhcmVudENvbXBvbmVudFR5cGUgPSB0aGlzLl9yb290Q29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRm9yIGEgbGluayB3aXRoIG5vIGxlYWRpbmcgYC4vYCwgYC9gLCBvciBgLi4vYCwgd2UgbG9vayBmb3IgYSBzaWJsaW5nIGFuZCBjaGlsZC5cbiAgICAgICAgLy8gSWYgYm90aCBleGlzdCwgd2UgdGhyb3cuIE90aGVyd2lzZSwgd2UgcHJlZmVyIHdoaWNoZXZlciBleGlzdHMuXG4gICAgICAgIHZhciBjaGlsZFJvdXRlRXhpc3RzID0gdGhpcy5oYXNSb3V0ZShyb3V0ZU5hbWUsIHBhcmVudENvbXBvbmVudFR5cGUpO1xuICAgICAgICB2YXIgcGFyZW50Um91dGVFeGlzdHMgPSBpc1ByZXNlbnQoZ3JhbmRwYXJlbnRDb21wb25lbnRUeXBlKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1JvdXRlKHJvdXRlTmFtZSwgZ3JhbmRwYXJlbnRDb21wb25lbnRUeXBlKTtcblxuICAgICAgICBpZiAocGFyZW50Um91dGVFeGlzdHMgJiYgY2hpbGRSb3V0ZUV4aXN0cykge1xuICAgICAgICAgIGxldCBtc2cgPVxuICAgICAgICAgICAgICBgTGluayBcIiR7TGlzdFdyYXBwZXIudG9KU09OKGxpbmtQYXJhbXMpfVwiIGlzIGFtYmlndW91cywgdXNlIFwiLi9cIiBvciBcIi4uL1wiIHRvIGRpc2FtYmlndWF0ZS5gO1xuICAgICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKG1zZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyZW50Um91dGVFeGlzdHMpIHtcbiAgICAgICAgICBwcmV2SW5zdHJ1Y3Rpb24gPSBhbmNlc3Rvckluc3RydWN0aW9ucy5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwYXJhbXNbcGFyYW1zLmxlbmd0aCAtIDFdID09ICcnKSB7XG4gICAgICBwYXJhbXMucG9wKCk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5sZW5ndGggPiAwICYmIHBhcmFtc1swXSA9PSAnJykge1xuICAgICAgcGFyYW1zLnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5sZW5ndGggPCAxKSB7XG4gICAgICBsZXQgbXNnID0gYExpbmsgXCIke0xpc3RXcmFwcGVyLnRvSlNPTihsaW5rUGFyYW1zKX1cIiBtdXN0IGluY2x1ZGUgYSByb3V0ZSBuYW1lLmA7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihtc2cpO1xuICAgIH1cblxuICAgIHZhciBnZW5lcmF0ZWRJbnN0cnVjdGlvbiA9XG4gICAgICAgIHRoaXMuX2dlbmVyYXRlKHBhcmFtcywgYW5jZXN0b3JJbnN0cnVjdGlvbnMsIHByZXZJbnN0cnVjdGlvbiwgX2F1eCwgbGlua1BhcmFtcyk7XG5cbiAgICAvLyB3ZSBkb24ndCBjbG9uZSB0aGUgZmlyc3QgKHJvb3QpIGVsZW1lbnRcbiAgICBmb3IgKHZhciBpID0gYW5jZXN0b3JJbnN0cnVjdGlvbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGxldCBhbmNlc3Rvckluc3RydWN0aW9uID0gYW5jZXN0b3JJbnN0cnVjdGlvbnNbaV07XG4gICAgICBpZiAoaXNCbGFuayhhbmNlc3Rvckluc3RydWN0aW9uKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGdlbmVyYXRlZEluc3RydWN0aW9uID0gYW5jZXN0b3JJbnN0cnVjdGlvbi5yZXBsYWNlQ2hpbGQoZ2VuZXJhdGVkSW5zdHJ1Y3Rpb24pO1xuICAgIH1cblxuICAgIHJldHVybiBnZW5lcmF0ZWRJbnN0cnVjdGlvbjtcbiAgfVxuXG5cbiAgLypcbiAgICogSW50ZXJuYWwgaGVscGVyIHRoYXQgZG9lcyBub3QgbWFrZSBhbnkgYXNzZXJ0aW9ucyBhYm91dCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsaW5rIERTTC5cbiAgICogYGFuY2VzdG9ySW5zdHJ1Y3Rpb25zYCBhcmUgcGFyZW50cyB0aGF0IHdpbGwgYmUgY2xvbmVkLlxuICAgKiBgcHJldkluc3RydWN0aW9uYCBpcyB0aGUgZXhpc3RpbmcgaW5zdHJ1Y3Rpb24gdGhhdCB3b3VsZCBiZSByZXBsYWNlZCwgYnV0IHdoaWNoIG1pZ2h0IGhhdmVcbiAgICogYXV4IHJvdXRlcyB0aGF0IG5lZWQgdG8gYmUgY2xvbmVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2VuZXJhdGUobGlua1BhcmFtczogYW55W10sIGFuY2VzdG9ySW5zdHJ1Y3Rpb25zOiBJbnN0cnVjdGlvbltdLFxuICAgICAgICAgICAgICAgICAgICBwcmV2SW5zdHJ1Y3Rpb246IEluc3RydWN0aW9uLCBfYXV4ID0gZmFsc2UsIF9vcmlnaW5hbExpbms6IGFueVtdKTogSW5zdHJ1Y3Rpb24ge1xuICAgIGxldCBwYXJlbnRDb21wb25lbnRUeXBlID0gdGhpcy5fcm9vdENvbXBvbmVudDtcbiAgICBsZXQgY29tcG9uZW50SW5zdHJ1Y3Rpb24gPSBudWxsO1xuICAgIGxldCBhdXhJbnN0cnVjdGlvbnM6IHtba2V5OiBzdHJpbmddOiBJbnN0cnVjdGlvbn0gPSB7fTtcblxuICAgIGxldCBwYXJlbnRJbnN0cnVjdGlvbjogSW5zdHJ1Y3Rpb24gPSBMaXN0V3JhcHBlci5sYXN0KGFuY2VzdG9ySW5zdHJ1Y3Rpb25zKTtcbiAgICBpZiAoaXNQcmVzZW50KHBhcmVudEluc3RydWN0aW9uKSAmJiBpc1ByZXNlbnQocGFyZW50SW5zdHJ1Y3Rpb24uY29tcG9uZW50KSkge1xuICAgICAgcGFyZW50Q29tcG9uZW50VHlwZSA9IHBhcmVudEluc3RydWN0aW9uLmNvbXBvbmVudC5jb21wb25lbnRUeXBlO1xuICAgIH1cblxuICAgIGlmIChsaW5rUGFyYW1zLmxlbmd0aCA9PSAwKSB7XG4gICAgICBsZXQgZGVmYXVsdEluc3RydWN0aW9uID0gdGhpcy5nZW5lcmF0ZURlZmF1bHQocGFyZW50Q29tcG9uZW50VHlwZSk7XG4gICAgICBpZiAoaXNCbGFuayhkZWZhdWx0SW5zdHJ1Y3Rpb24pKSB7XG4gICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgICAgYExpbmsgXCIke0xpc3RXcmFwcGVyLnRvSlNPTihfb3JpZ2luYWxMaW5rKX1cIiBkb2VzIG5vdCByZXNvbHZlIHRvIGEgdGVybWluYWwgaW5zdHJ1Y3Rpb24uYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmYXVsdEluc3RydWN0aW9uO1xuICAgIH1cblxuICAgIC8vIGZvciBub24tYXV4IHJvdXRlcywgd2Ugd2FudCB0byByZXVzZSB0aGUgcHJlZGVjZXNzb3IncyBleGlzdGluZyBwcmltYXJ5IGFuZCBhdXggcm91dGVzXG4gICAgLy8gYW5kIG9ubHkgb3ZlcnJpZGUgcm91dGVzIGZvciB3aGljaCB0aGUgZ2l2ZW4gbGluayBEU0wgcHJvdmlkZXNcbiAgICBpZiAoaXNQcmVzZW50KHByZXZJbnN0cnVjdGlvbikgJiYgIV9hdXgpIHtcbiAgICAgIGF1eEluc3RydWN0aW9ucyA9IFN0cmluZ01hcFdyYXBwZXIubWVyZ2UocHJldkluc3RydWN0aW9uLmF1eEluc3RydWN0aW9uLCBhdXhJbnN0cnVjdGlvbnMpO1xuICAgICAgY29tcG9uZW50SW5zdHJ1Y3Rpb24gPSBwcmV2SW5zdHJ1Y3Rpb24uY29tcG9uZW50O1xuICAgIH1cblxuICAgIHZhciBydWxlcyA9IHRoaXMuX3J1bGVzLmdldChwYXJlbnRDb21wb25lbnRUeXBlKTtcbiAgICBpZiAoaXNCbGFuayhydWxlcykpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgIGBDb21wb25lbnQgXCIke2dldFR5cGVOYW1lRm9yRGVidWdnaW5nKHBhcmVudENvbXBvbmVudFR5cGUpfVwiIGhhcyBubyByb3V0ZSBjb25maWcuYCk7XG4gICAgfVxuXG4gICAgbGV0IGxpbmtQYXJhbUluZGV4ID0gMDtcbiAgICBsZXQgcm91dGVQYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge307XG5cbiAgICAvLyBmaXJzdCwgcmVjb2duaXplIHRoZSBwcmltYXJ5IHJvdXRlIGlmIG9uZSBpcyBwcm92aWRlZFxuICAgIGlmIChsaW5rUGFyYW1JbmRleCA8IGxpbmtQYXJhbXMubGVuZ3RoICYmIGlzU3RyaW5nKGxpbmtQYXJhbXNbbGlua1BhcmFtSW5kZXhdKSkge1xuICAgICAgbGV0IHJvdXRlTmFtZSA9IGxpbmtQYXJhbXNbbGlua1BhcmFtSW5kZXhdO1xuICAgICAgaWYgKHJvdXRlTmFtZSA9PSAnJyB8fCByb3V0ZU5hbWUgPT0gJy4nIHx8IHJvdXRlTmFtZSA9PSAnLi4nKSB7XG4gICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBcIiR7cm91dGVOYW1lfS9cIiBpcyBvbmx5IGFsbG93ZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBhIGxpbmsgRFNMLmApO1xuICAgICAgfVxuICAgICAgbGlua1BhcmFtSW5kZXggKz0gMTtcbiAgICAgIGlmIChsaW5rUGFyYW1JbmRleCA8IGxpbmtQYXJhbXMubGVuZ3RoKSB7XG4gICAgICAgIGxldCBsaW5rUGFyYW0gPSBsaW5rUGFyYW1zW2xpbmtQYXJhbUluZGV4XTtcbiAgICAgICAgaWYgKGlzU3RyaW5nTWFwKGxpbmtQYXJhbSkgJiYgIWlzQXJyYXkobGlua1BhcmFtKSkge1xuICAgICAgICAgIHJvdXRlUGFyYW1zID0gbGlua1BhcmFtO1xuICAgICAgICAgIGxpbmtQYXJhbUluZGV4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciByb3V0ZVJlY29nbml6ZXIgPSAoX2F1eCA/IHJ1bGVzLmF1eFJ1bGVzQnlOYW1lIDogcnVsZXMucnVsZXNCeU5hbWUpLmdldChyb3V0ZU5hbWUpO1xuXG4gICAgICBpZiAoaXNCbGFuayhyb3V0ZVJlY29nbml6ZXIpKSB7XG4gICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgICAgYENvbXBvbmVudCBcIiR7Z2V0VHlwZU5hbWVGb3JEZWJ1Z2dpbmcocGFyZW50Q29tcG9uZW50VHlwZSl9XCIgaGFzIG5vIHJvdXRlIG5hbWVkIFwiJHtyb3V0ZU5hbWV9XCIuYCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSBhbiBcInVucmVzb2x2ZWQgaW5zdHJ1Y3Rpb25cIiBmb3IgYXN5bmMgcm91dGVzXG4gICAgICAvLyB3ZSdsbCBmaWd1cmUgb3V0IHRoZSByZXN0IG9mIHRoZSByb3V0ZSB3aGVuIHdlIHJlc29sdmUgdGhlIGluc3RydWN0aW9uIGFuZFxuICAgICAgLy8gcGVyZm9ybSBhIG5hdmlnYXRpb25cbiAgICAgIGlmIChpc0JsYW5rKHJvdXRlUmVjb2duaXplci5oYW5kbGVyLmNvbXBvbmVudFR5cGUpKSB7XG4gICAgICAgIHZhciBnZW5lcmF0ZWRVcmw6IEdlbmVyYXRlZFVybCA9IHJvdXRlUmVjb2duaXplci5nZW5lcmF0ZUNvbXBvbmVudFBhdGhWYWx1ZXMocm91dGVQYXJhbXMpO1xuICAgICAgICByZXR1cm4gbmV3IFVucmVzb2x2ZWRJbnN0cnVjdGlvbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHJvdXRlUmVjb2duaXplci5oYW5kbGVyLnJlc29sdmVDb21wb25lbnRUeXBlKCkudGhlbigoXykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dlbmVyYXRlKGxpbmtQYXJhbXMsIGFuY2VzdG9ySW5zdHJ1Y3Rpb25zLCBwcmV2SW5zdHJ1Y3Rpb24sIF9hdXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX29yaWdpbmFsTGluayk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGdlbmVyYXRlZFVybC51cmxQYXRoLCBjb252ZXJ0VXJsUGFyYW1zVG9BcnJheShnZW5lcmF0ZWRVcmwudXJsUGFyYW1zKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbXBvbmVudEluc3RydWN0aW9uID0gX2F1eCA/IHJ1bGVzLmdlbmVyYXRlQXV4aWxpYXJ5KHJvdXRlTmFtZSwgcm91dGVQYXJhbXMpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGVzLmdlbmVyYXRlKHJvdXRlTmFtZSwgcm91dGVQYXJhbXMpO1xuICAgIH1cblxuICAgIC8vIE5leHQsIHJlY29nbml6ZSBhdXhpbGlhcnkgaW5zdHJ1Y3Rpb25zLlxuICAgIC8vIElmIHdlIGhhdmUgYW4gYW5jZXN0b3IgaW5zdHJ1Y3Rpb24sIHdlIHByZXNlcnZlIHdoYXRldmVyIGF1eCByb3V0ZXMgYXJlIGFjdGl2ZSBmcm9tIGl0LlxuICAgIHdoaWxlIChsaW5rUGFyYW1JbmRleCA8IGxpbmtQYXJhbXMubGVuZ3RoICYmIGlzQXJyYXkobGlua1BhcmFtc1tsaW5rUGFyYW1JbmRleF0pKSB7XG4gICAgICBsZXQgYXV4UGFyZW50SW5zdHJ1Y3Rpb246IEluc3RydWN0aW9uW10gPSBbcGFyZW50SW5zdHJ1Y3Rpb25dO1xuICAgICAgbGV0IGF1eEluc3RydWN0aW9uID0gdGhpcy5fZ2VuZXJhdGUobGlua1BhcmFtc1tsaW5rUGFyYW1JbmRleF0sIGF1eFBhcmVudEluc3RydWN0aW9uLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSwgX29yaWdpbmFsTGluayk7XG5cbiAgICAgIC8vIFRPRE86IHRoaXMgd2lsbCBub3Qgd29yayBmb3IgYXV4IHJvdXRlcyB3aXRoIHBhcmFtZXRlcnMgb3IgbXVsdGlwbGUgc2VnbWVudHNcbiAgICAgIGF1eEluc3RydWN0aW9uc1thdXhJbnN0cnVjdGlvbi5jb21wb25lbnQudXJsUGF0aF0gPSBhdXhJbnN0cnVjdGlvbjtcbiAgICAgIGxpbmtQYXJhbUluZGV4ICs9IDE7XG4gICAgfVxuXG4gICAgdmFyIGluc3RydWN0aW9uID0gbmV3IFJlc29sdmVkSW5zdHJ1Y3Rpb24oY29tcG9uZW50SW5zdHJ1Y3Rpb24sIG51bGwsIGF1eEluc3RydWN0aW9ucyk7XG5cbiAgICAvLyBJZiB0aGUgY29tcG9uZW50IGlzIHN5bmMsIHdlIGNhbiBnZW5lcmF0ZSByZXNvbHZlZCBjaGlsZCByb3V0ZSBpbnN0cnVjdGlvbnNcbiAgICAvLyBJZiBub3QsIHdlJ2xsIHJlc29sdmUgdGhlIGluc3RydWN0aW9ucyBhdCBuYXZpZ2F0aW9uIHRpbWVcbiAgICBpZiAoaXNQcmVzZW50KGNvbXBvbmVudEluc3RydWN0aW9uKSAmJiBpc1ByZXNlbnQoY29tcG9uZW50SW5zdHJ1Y3Rpb24uY29tcG9uZW50VHlwZSkpIHtcbiAgICAgIGxldCBjaGlsZEluc3RydWN0aW9uOiBJbnN0cnVjdGlvbiA9IG51bGw7XG4gICAgICBpZiAoY29tcG9uZW50SW5zdHJ1Y3Rpb24udGVybWluYWwpIHtcbiAgICAgICAgaWYgKGxpbmtQYXJhbUluZGV4ID49IGxpbmtQYXJhbXMubGVuZ3RoKSB7XG4gICAgICAgICAgLy8gVE9ETzogdGhyb3cgdGhhdCB0aGVyZSBhcmUgZXh0cmEgbGluayBwYXJhbXMgYmV5b25kIHRoZSB0ZXJtaW5hbCBjb21wb25lbnRcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNoaWxkQW5jZXN0b3JDb21wb25lbnRzOiBJbnN0cnVjdGlvbltdID0gYW5jZXN0b3JJbnN0cnVjdGlvbnMuY29uY2F0KFtpbnN0cnVjdGlvbl0pO1xuICAgICAgICBsZXQgcmVtYWluaW5nTGlua1BhcmFtcyA9IGxpbmtQYXJhbXMuc2xpY2UobGlua1BhcmFtSW5kZXgpO1xuICAgICAgICBjaGlsZEluc3RydWN0aW9uID0gdGhpcy5fZ2VuZXJhdGUocmVtYWluaW5nTGlua1BhcmFtcywgY2hpbGRBbmNlc3RvckNvbXBvbmVudHMsIG51bGwsIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX29yaWdpbmFsTGluayk7XG4gICAgICB9XG4gICAgICBpbnN0cnVjdGlvbi5jaGlsZCA9IGNoaWxkSW5zdHJ1Y3Rpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIGluc3RydWN0aW9uO1xuICB9XG5cbiAgcHVibGljIGhhc1JvdXRlKG5hbWU6IHN0cmluZywgcGFyZW50Q29tcG9uZW50OiBhbnkpOiBib29sZWFuIHtcbiAgICB2YXIgcnVsZXMgPSB0aGlzLl9ydWxlcy5nZXQocGFyZW50Q29tcG9uZW50KTtcbiAgICBpZiAoaXNCbGFuayhydWxlcykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHJ1bGVzLmhhc1JvdXRlKG5hbWUpO1xuICB9XG5cbiAgcHVibGljIGdlbmVyYXRlRGVmYXVsdChjb21wb25lbnRDdXJzb3I6IFR5cGUpOiBJbnN0cnVjdGlvbiB7XG4gICAgaWYgKGlzQmxhbmsoY29tcG9uZW50Q3Vyc29yKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHJ1bGVzID0gdGhpcy5fcnVsZXMuZ2V0KGNvbXBvbmVudEN1cnNvcik7XG4gICAgaWYgKGlzQmxhbmsocnVsZXMpIHx8IGlzQmxhbmsocnVsZXMuZGVmYXVsdFJ1bGUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdENoaWxkID0gbnVsbDtcbiAgICBpZiAoaXNQcmVzZW50KHJ1bGVzLmRlZmF1bHRSdWxlLmhhbmRsZXIuY29tcG9uZW50VHlwZSkpIHtcbiAgICAgIHZhciBjb21wb25lbnRJbnN0cnVjdGlvbiA9IHJ1bGVzLmRlZmF1bHRSdWxlLmdlbmVyYXRlKHt9KTtcbiAgICAgIGlmICghcnVsZXMuZGVmYXVsdFJ1bGUudGVybWluYWwpIHtcbiAgICAgICAgZGVmYXVsdENoaWxkID0gdGhpcy5nZW5lcmF0ZURlZmF1bHQocnVsZXMuZGVmYXVsdFJ1bGUuaGFuZGxlci5jb21wb25lbnRUeXBlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgRGVmYXVsdEluc3RydWN0aW9uKGNvbXBvbmVudEluc3RydWN0aW9uLCBkZWZhdWx0Q2hpbGQpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVW5yZXNvbHZlZEluc3RydWN0aW9uKCgpID0+IHtcbiAgICAgIHJldHVybiBydWxlcy5kZWZhdWx0UnVsZS5oYW5kbGVyLnJlc29sdmVDb21wb25lbnRUeXBlKCkudGhlbihcbiAgICAgICAgICAoXykgPT4gdGhpcy5nZW5lcmF0ZURlZmF1bHQoY29tcG9uZW50Q3Vyc29yKSk7XG4gICAgfSk7XG4gIH1cbn1cblxuLypcbiAqIEdpdmVuOiBbJy9hL2InLCB7YzogMn1dXG4gKiBSZXR1cm5zOiBbJycsICdhJywgJ2InLCB7YzogMn1dXG4gKi9cbmZ1bmN0aW9uIHNwbGl0QW5kRmxhdHRlbkxpbmtQYXJhbXMobGlua1BhcmFtczogYW55W10pOiBhbnlbXSB7XG4gIHZhciBhY2N1bXVsYXRpb24gPSBbXTtcbiAgbGlua1BhcmFtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW06IGFueSkge1xuICAgIGlmIChpc1N0cmluZyhpdGVtKSkge1xuICAgICAgdmFyIHN0ckl0ZW06IHN0cmluZyA9IDxzdHJpbmc+aXRlbTtcbiAgICAgIGFjY3VtdWxhdGlvbiA9IGFjY3VtdWxhdGlvbi5jb25jYXQoc3RySXRlbS5zcGxpdCgnLycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWNjdW11bGF0aW9uLnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFjY3VtdWxhdGlvbjtcbn1cblxuXG4vKlxuICogR2l2ZW4gYSBsaXN0IG9mIGluc3RydWN0aW9ucywgcmV0dXJucyB0aGUgbW9zdCBzcGVjaWZpYyBpbnN0cnVjdGlvblxuICovXG5mdW5jdGlvbiBtb3N0U3BlY2lmaWMoaW5zdHJ1Y3Rpb25zOiBJbnN0cnVjdGlvbltdKTogSW5zdHJ1Y3Rpb24ge1xuICBpbnN0cnVjdGlvbnMgPSBpbnN0cnVjdGlvbnMuZmlsdGVyKChpbnN0cnVjdGlvbikgPT4gaXNQcmVzZW50KGluc3RydWN0aW9uKSk7XG4gIGlmIChpbnN0cnVjdGlvbnMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoaW5zdHJ1Y3Rpb25zLmxlbmd0aCA9PSAxKSB7XG4gICAgcmV0dXJuIGluc3RydWN0aW9uc1swXTtcbiAgfVxuICB2YXIgZmlyc3QgPSBpbnN0cnVjdGlvbnNbMF07XG4gIHZhciByZXN0ID0gaW5zdHJ1Y3Rpb25zLnNsaWNlKDEpO1xuICByZXR1cm4gcmVzdC5yZWR1Y2UoKGluc3RydWN0aW9uOiBJbnN0cnVjdGlvbiwgY29udGVuZGVyOiBJbnN0cnVjdGlvbikgPT4ge1xuICAgIGlmIChjb21wYXJlU3BlY2lmaWNpdHlTdHJpbmdzKGNvbnRlbmRlci5zcGVjaWZpY2l0eSwgaW5zdHJ1Y3Rpb24uc3BlY2lmaWNpdHkpID09IC0xKSB7XG4gICAgICByZXR1cm4gY29udGVuZGVyO1xuICAgIH1cbiAgICByZXR1cm4gaW5zdHJ1Y3Rpb247XG4gIH0sIGZpcnN0KTtcbn1cblxuLypcbiAqIEV4cGVjdHMgc3RyaW5ncyB0byBiZSBpbiB0aGUgZm9ybSBvZiBcIlswLTJdK1wiXG4gKiBSZXR1cm5zIC0xIGlmIHN0cmluZyBBIHNob3VsZCBiZSBzb3J0ZWQgYWJvdmUgc3RyaW5nIEIsIDEgaWYgaXQgc2hvdWxkIGJlIHNvcnRlZCBhZnRlcixcbiAqIG9yIDAgaWYgdGhleSBhcmUgdGhlIHNhbWUuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVTcGVjaWZpY2l0eVN0cmluZ3MoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBudW1iZXIge1xuICB2YXIgbCA9IE1hdGgubWluKGEubGVuZ3RoLCBiLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgdmFyIGFpID0gU3RyaW5nV3JhcHBlci5jaGFyQ29kZUF0KGEsIGkpO1xuICAgIHZhciBiaSA9IFN0cmluZ1dyYXBwZXIuY2hhckNvZGVBdChiLCBpKTtcbiAgICB2YXIgZGlmZmVyZW5jZSA9IGJpIC0gYWk7XG4gICAgaWYgKGRpZmZlcmVuY2UgIT0gMCkge1xuICAgICAgcmV0dXJuIGRpZmZlcmVuY2U7XG4gICAgfVxuICB9XG4gIHJldHVybiBhLmxlbmd0aCAtIGIubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBhc3NlcnRUZXJtaW5hbENvbXBvbmVudChjb21wb25lbnQsIHBhdGgpIHtcbiAgaWYgKCFpc1R5cGUoY29tcG9uZW50KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBhbm5vdGF0aW9ucyA9IHJlZmxlY3Rvci5hbm5vdGF0aW9ucyhjb21wb25lbnQpO1xuICBpZiAoaXNQcmVzZW50KGFubm90YXRpb25zKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5ub3RhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBhbm5vdGF0aW9uID0gYW5ub3RhdGlvbnNbaV07XG5cbiAgICAgIGlmIChhbm5vdGF0aW9uIGluc3RhbmNlb2YgUm91dGVDb25maWcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICAgICAgICBgQ2hpbGQgcm91dGVzIGFyZSBub3QgYWxsb3dlZCBmb3IgXCIke3BhdGh9XCIuIFVzZSBcIi4uLlwiIG9uIHRoZSBwYXJlbnQncyByb3V0ZSBwYXRoLmApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19