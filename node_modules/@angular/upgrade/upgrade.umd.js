/**
 * @license AngularJS v2.0.0-rc.1
 * (c) 2010-2016 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/platform-browser-dynamic'), require('@angular/platform-browser'), require('@angular/compiler')) :
        typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/platform-browser-dynamic', '@angular/platform-browser', '@angular/compiler'], factory) :
            (factory((global.ng = global.ng || {}, global.ng.upgrade = global.ng.upgrade || {}), global.ng.core, global.ng.platformBrowserDynamic, global.ng.platformBrowser, global.ng.compiler));
}(this, function (exports, _angular_core, _angular_platformBrowserDynamic, _angular_platformBrowser, _angular_compiler) {
    'use strict';
    var COMPONENT_SELECTOR = /^[\w|-]*$/;
    var SKEWER_CASE = /-(\w)/g;
    var directiveResolver = new _angular_compiler.DirectiveResolver();
    function getComponentInfo(type) {
        var resolvedMetadata = directiveResolver.resolve(type);
        var selector = resolvedMetadata.selector;
        if (!selector.match(COMPONENT_SELECTOR)) {
            throw new Error('Only selectors matching element names are supported, got: ' + selector);
        }
        var selector = selector.replace(SKEWER_CASE, function (all, letter) { return letter.toUpperCase(); });
        return {
            type: type,
            selector: selector,
            inputs: parseFields(resolvedMetadata.inputs),
            outputs: parseFields(resolvedMetadata.outputs)
        };
    }
    function parseFields(names) {
        var attrProps = [];
        if (names) {
            for (var i = 0; i < names.length; i++) {
                var parts = names[i].split(':');
                var prop = parts[0].trim();
                var attr = (parts[1] || parts[0]).trim();
                var capitalAttr = attr.charAt(0).toUpperCase() + attr.substr(1);
                attrProps.push({
                    prop: prop,
                    attr: attr,
                    bracketAttr: "[" + attr + "]",
                    parenAttr: "(" + attr + ")",
                    bracketParenAttr: "[(" + attr + ")]",
                    onAttr: "on" + capitalAttr,
                    bindAttr: "bind" + capitalAttr,
                    bindonAttr: "bindon" + capitalAttr
                });
            }
        }
        return attrProps;
    }
    function onError(e) {
        // TODO: (misko): We seem to not have a stack trace here!
        console.log(e, e.stack);
        throw e;
    }
    function controllerKey(name) {
        return '$' + name + 'Controller';
    }
    var NG2_COMPILER = 'ng2.Compiler';
    var NG2_INJECTOR = 'ng2.Injector';
    var NG2_COMPONENT_FACTORY_REF_MAP = 'ng2.ComponentFactoryRefMap';
    var NG2_ZONE = 'ng2.NgZone';
    var NG1_CONTROLLER = '$controller';
    var NG1_SCOPE = '$scope';
    var NG1_ROOT_SCOPE = '$rootScope';
    var NG1_COMPILE = '$compile';
    var NG1_HTTP_BACKEND = '$httpBackend';
    var NG1_INJECTOR = '$injector';
    var NG1_PARSE = '$parse';
    var NG1_TEMPLATE_CACHE = '$templateCache';
    var NG1_TESTABILITY = '$$testability';
    var REQUIRE_INJECTOR = '^' + NG2_INJECTOR;
    var INITIAL_VALUE = {
        __UNINITIALIZED__: true
    };
    var DowngradeNg2ComponentAdapter = (function () {
        function DowngradeNg2ComponentAdapter(id, info, element, attrs, scope, parentInjector, parse, componentFactory) {
            this.id = id;
            this.info = info;
            this.element = element;
            this.attrs = attrs;
            this.scope = scope;
            this.parentInjector = parentInjector;
            this.parse = parse;
            this.componentFactory = componentFactory;
            this.component = null;
            this.inputChangeCount = 0;
            this.inputChanges = null;
            this.componentRef = null;
            this.changeDetector = null;
            this.contentInsertionPoint = null;
            this.element[0].id = id;
            this.componentScope = scope.$new();
            this.childNodes = element.contents();
        }
        DowngradeNg2ComponentAdapter.prototype.bootstrapNg2 = function () {
            var childInjector = _angular_core.ReflectiveInjector.resolveAndCreate([_angular_core.provide(NG1_SCOPE, { useValue: this.componentScope })], this.parentInjector);
            this.contentInsertionPoint = document.createComment('ng1 insertion point');
            this.componentRef =
                this.componentFactory.create(childInjector, [[this.contentInsertionPoint]], '#' + this.id);
            this.changeDetector = this.componentRef.changeDetectorRef;
            this.component = this.componentRef.instance;
        };
        DowngradeNg2ComponentAdapter.prototype.setupInputs = function () {
            var _this = this;
            var attrs = this.attrs;
            var inputs = this.info.inputs;
            for (var i = 0; i < inputs.length; i++) {
                var input = inputs[i];
                var expr = null;
                if (attrs.hasOwnProperty(input.attr)) {
                    var observeFn = (function (prop) {
                        var prevValue = INITIAL_VALUE;
                        return function (value) {
                            if (_this.inputChanges !== null) {
                                _this.inputChangeCount++;
                                _this.inputChanges[prop] =
                                    new Ng1Change(value, prevValue === INITIAL_VALUE ? value : prevValue);
                                prevValue = value;
                            }
                            _this.component[prop] = value;
                        };
                    })(input.prop);
                    attrs.$observe(input.attr, observeFn);
                }
                else if (attrs.hasOwnProperty(input.bindAttr)) {
                    expr = attrs[input.bindAttr];
                }
                else if (attrs.hasOwnProperty(input.bracketAttr)) {
                    expr = attrs[input.bracketAttr];
                }
                else if (attrs.hasOwnProperty(input.bindonAttr)) {
                    expr = attrs[input.bindonAttr];
                }
                else if (attrs.hasOwnProperty(input.bracketParenAttr)) {
                    expr = attrs[input.bracketParenAttr];
                }
                if (expr != null) {
                    var watchFn = (function (prop) { return function (value, prevValue) {
                        if (_this.inputChanges != null) {
                            _this.inputChangeCount++;
                            _this.inputChanges[prop] = new Ng1Change(prevValue, value);
                        }
                        _this.component[prop] = value;
                    }; })(input.prop);
                    this.componentScope.$watch(expr, watchFn);
                }
            }
            var prototype = this.info.type.prototype;
            if (prototype && prototype.ngOnChanges) {
                // Detect: OnChanges interface
                this.inputChanges = {};
                this.componentScope.$watch(function () { return _this.inputChangeCount; }, function () {
                    var inputChanges = _this.inputChanges;
                    _this.inputChanges = {};
                    _this.component.ngOnChanges(inputChanges);
                });
            }
            this.componentScope.$watch(function () { return _this.changeDetector && _this.changeDetector.detectChanges(); });
        };
        DowngradeNg2ComponentAdapter.prototype.projectContent = function () {
            var childNodes = this.childNodes;
            var parent = this.contentInsertionPoint.parentNode;
            if (parent) {
                for (var i = 0, ii = childNodes.length; i < ii; i++) {
                    parent.insertBefore(childNodes[i], this.contentInsertionPoint);
                }
            }
        };
        DowngradeNg2ComponentAdapter.prototype.setupOutputs = function () {
            var _this = this;
            var attrs = this.attrs;
            var outputs = this.info.outputs;
            for (var j = 0; j < outputs.length; j++) {
                var output = outputs[j];
                var expr = null;
                var assignExpr = false;
                var bindonAttr = output.bindonAttr ? output.bindonAttr.substring(0, output.bindonAttr.length - 6) : null;
                var bracketParenAttr = output.bracketParenAttr ?
                    "[(" + output.bracketParenAttr.substring(2, output.bracketParenAttr.length - 8) + ")]" :
                    null;
                if (attrs.hasOwnProperty(output.onAttr)) {
                    expr = attrs[output.onAttr];
                }
                else if (attrs.hasOwnProperty(output.parenAttr)) {
                    expr = attrs[output.parenAttr];
                }
                else if (attrs.hasOwnProperty(bindonAttr)) {
                    expr = attrs[bindonAttr];
                    assignExpr = true;
                }
                else if (attrs.hasOwnProperty(bracketParenAttr)) {
                    expr = attrs[bracketParenAttr];
                    assignExpr = true;
                }
                if (expr != null && assignExpr != null) {
                    var getter = this.parse(expr);
                    var setter = getter.assign;
                    if (assignExpr && !setter) {
                        throw new Error("Expression '" + expr + "' is not assignable!");
                    }
                    var emitter = this.component[output.prop];
                    if (emitter) {
                        emitter.subscribe({
                            next: assignExpr ? (function (setter) { return function (value) { return setter(_this.scope, value); }; })(setter) :
                                (function (getter) { return function (value) { return getter(_this.scope, { $event: value }); }; })(getter)
                        });
                    }
                    else {
                        throw new Error("Missing emitter '" + output.prop + "' on component '" + this.info.selector + "'!");
                    }
                }
            }
        };
        DowngradeNg2ComponentAdapter.prototype.registerCleanup = function () {
            var _this = this;
            this.element.bind('$destroy', function () {
                _this.componentScope.$destroy();
                _this.componentRef.destroy();
            });
        };
        return DowngradeNg2ComponentAdapter;
    }());
    var Ng1Change = (function () {
        function Ng1Change(previousValue, currentValue) {
            this.previousValue = previousValue;
            this.currentValue = currentValue;
        }
        Ng1Change.prototype.isFirstChange = function () { return this.previousValue === this.currentValue; };
        return Ng1Change;
    }());
    function noNg() {
        throw new Error('AngularJS v1.x is not loaded!');
    }
    var angular = {
        bootstrap: noNg,
        module: noNg,
        element: noNg,
        version: noNg,
        resumeBootstrap: noNg,
        getTestability: noNg
    };
    try {
        if (window.hasOwnProperty('angular')) {
            angular = window.angular;
        }
    }
    catch (e) {
    }
    var bootstrap = angular.bootstrap;
    var module$1 = angular.module;
    var element = angular.element;
    var CAMEL_CASE = /([A-Z])/g;
    var INITIAL_VALUE$1 = {
        __UNINITIALIZED__: true
    };
    var NOT_SUPPORTED = 'NOT_SUPPORTED';
    var UpgradeNg1ComponentAdapterBuilder = (function () {
        function UpgradeNg1ComponentAdapterBuilder(name) {
            this.name = name;
            this.inputs = [];
            this.inputsRename = [];
            this.outputs = [];
            this.outputsRename = [];
            this.propertyOutputs = [];
            this.checkProperties = [];
            this.propertyMap = {};
            this.linkFn = null;
            this.directive = null;
            this.$controller = null;
            var selector = name.replace(CAMEL_CASE, function (all, next) { return '-' + next.toLowerCase(); });
            var self = this;
            this.type =
                _angular_core.Directive({ selector: selector, inputs: this.inputsRename, outputs: this.outputsRename })
                    .Class({
                    constructor: [
                        new _angular_core.Inject(NG1_SCOPE),
                        _angular_core.ElementRef,
                        function (scope, elementRef) {
                            return new UpgradeNg1ComponentAdapter(self.linkFn, scope, self.directive, elementRef, self.$controller, self.inputs, self.outputs, self.propertyOutputs, self.checkProperties, self.propertyMap);
                        }
                    ],
                    ngOnInit: function () { },
                    ngOnChanges: function () { },
                    ngDoCheck: function () { }
                });
        }
        UpgradeNg1ComponentAdapterBuilder.prototype.extractDirective = function (injector) {
            var directives = injector.get(this.name + 'Directive');
            if (directives.length > 1) {
                throw new Error('Only support single directive definition for: ' + this.name);
            }
            var directive = directives[0];
            if (directive.replace)
                this.notSupported('replace');
            if (directive.terminal)
                this.notSupported('terminal');
            var link = directive.link;
            if (typeof link == 'object') {
                if (link.post)
                    this.notSupported('link.post');
            }
            return directive;
        };
        UpgradeNg1ComponentAdapterBuilder.prototype.notSupported = function (feature) {
            throw new Error("Upgraded directive '" + this.name + "' does not support '" + feature + "'.");
        };
        UpgradeNg1ComponentAdapterBuilder.prototype.extractBindings = function () {
            var btcIsObject = typeof this.directive.bindToController === 'object';
            if (btcIsObject && Object.keys(this.directive.scope).length) {
                throw new Error("Binding definitions on scope and controller at the same time are not supported.");
            }
            var context = (btcIsObject) ? this.directive.bindToController : this.directive.scope;
            if (typeof context == 'object') {
                for (var name in context) {
                    if (context.hasOwnProperty(name)) {
                        var localName = context[name];
                        var type = localName.charAt(0);
                        localName = localName.substr(1) || name;
                        var outputName = 'output_' + name;
                        var outputNameRename = outputName + ': ' + name;
                        var outputNameRenameChange = outputName + ': ' + name + 'Change';
                        var inputName = 'input_' + name;
                        var inputNameRename = inputName + ': ' + name;
                        switch (type) {
                            case '=':
                                this.propertyOutputs.push(outputName);
                                this.checkProperties.push(localName);
                                this.outputs.push(outputName);
                                this.outputsRename.push(outputNameRenameChange);
                                this.propertyMap[outputName] = localName;
                            // don't break; let it fall through to '@'
                            case '@':
                            // handle the '<' binding of angular 1.5 components
                            case '<':
                                this.inputs.push(inputName);
                                this.inputsRename.push(inputNameRename);
                                this.propertyMap[inputName] = localName;
                                break;
                            case '&':
                                this.outputs.push(outputName);
                                this.outputsRename.push(outputNameRename);
                                this.propertyMap[outputName] = localName;
                                break;
                            default:
                                var json = JSON.stringify(context);
                                throw new Error("Unexpected mapping '" + type + "' in '" + json + "' in '" + this.name + "' directive.");
                        }
                    }
                }
            }
        };
        UpgradeNg1ComponentAdapterBuilder.prototype.compileTemplate = function (compile, templateCache, httpBackend) {
            var _this = this;
            if (this.directive.template !== undefined) {
                this.linkFn = compileHtml(this.directive.template);
            }
            else if (this.directive.templateUrl) {
                var url = this.directive.templateUrl;
                var html = templateCache.get(url);
                if (html !== undefined) {
                    this.linkFn = compileHtml(html);
                }
                else {
                    return new Promise(function (resolve, err) {
                        httpBackend('GET', url, null, function (status, response) {
                            if (status == 200) {
                                resolve(_this.linkFn = compileHtml(templateCache.put(url, response)));
                            }
                            else {
                                err("GET " + url + " returned " + status + ": " + response);
                            }
                        });
                    });
                }
            }
            else {
                throw new Error("Directive '" + this.name + "' is not a component, it is missing template.");
            }
            return null;
            function compileHtml(html) {
                var div = document.createElement('div');
                div.innerHTML = html;
                return compile(div.childNodes);
            }
        };
        UpgradeNg1ComponentAdapterBuilder.resolve = function (exportedComponents, injector) {
            var promises = [];
            var compile = injector.get(NG1_COMPILE);
            var templateCache = injector.get(NG1_TEMPLATE_CACHE);
            var httpBackend = injector.get(NG1_HTTP_BACKEND);
            var $controller = injector.get(NG1_CONTROLLER);
            for (var name in exportedComponents) {
                if (exportedComponents.hasOwnProperty(name)) {
                    var exportedComponent = exportedComponents[name];
                    exportedComponent.directive = exportedComponent.extractDirective(injector);
                    exportedComponent.$controller = $controller;
                    exportedComponent.extractBindings();
                    var promise = exportedComponent.compileTemplate(compile, templateCache, httpBackend);
                    if (promise)
                        promises.push(promise);
                }
            }
            return Promise.all(promises);
        };
        return UpgradeNg1ComponentAdapterBuilder;
    }());
    var UpgradeNg1ComponentAdapter = (function () {
        function UpgradeNg1ComponentAdapter(linkFn, scope, directive, elementRef, $controller, inputs, outputs, propOuts, checkProperties, propertyMap) {
            this.linkFn = linkFn;
            this.directive = directive;
            this.inputs = inputs;
            this.outputs = outputs;
            this.propOuts = propOuts;
            this.checkProperties = checkProperties;
            this.propertyMap = propertyMap;
            this.destinationObj = null;
            this.checkLastValues = [];
            this.element = elementRef.nativeElement;
            this.componentScope = scope.$new(!!directive.scope);
            var $element = element(this.element);
            var controllerType = directive.controller;
            var controller = null;
            if (controllerType) {
                var locals = { $scope: this.componentScope, $element: $element };
                controller = $controller(controllerType, locals, null, directive.controllerAs);
                $element.data(controllerKey(directive.name), controller);
            }
            var link = directive.link;
            if (typeof link == 'object')
                link = link.pre;
            if (link) {
                var attrs = NOT_SUPPORTED;
                var transcludeFn = NOT_SUPPORTED;
                var linkController = this.resolveRequired($element, directive.require);
                directive.link(this.componentScope, $element, attrs, linkController, transcludeFn);
            }
            this.destinationObj =
                directive.bindToController && controller ? controller : this.componentScope;
            for (var i = 0; i < inputs.length; i++) {
                this[inputs[i]] = null;
            }
            for (var j = 0; j < outputs.length; j++) {
                var emitter = this[outputs[j]] = new _angular_core.EventEmitter();
                this.setComponentProperty(outputs[j], (function (emitter) { return function (value) { return emitter.emit(value); }; })(emitter));
            }
            for (var k = 0; k < propOuts.length; k++) {
                this[propOuts[k]] = new _angular_core.EventEmitter();
                this.checkLastValues.push(INITIAL_VALUE$1);
            }
        }
        UpgradeNg1ComponentAdapter.prototype.ngOnInit = function () {
            var _this = this;
            var childNodes = [];
            var childNode;
            while (childNode = this.element.firstChild) {
                this.element.removeChild(childNode);
                childNodes.push(childNode);
            }
            this.linkFn(this.componentScope, function (clonedElement, scope) {
                for (var i = 0, ii = clonedElement.length; i < ii; i++) {
                    _this.element.appendChild(clonedElement[i]);
                }
            }, { parentBoundTranscludeFn: function (scope, cloneAttach) { cloneAttach(childNodes); } });
            if (this.destinationObj.$onInit) {
                this.destinationObj.$onInit();
            }
        };
        UpgradeNg1ComponentAdapter.prototype.ngOnChanges = function (changes) {
            for (var name in changes) {
                if (changes.hasOwnProperty(name)) {
                    var change = changes[name];
                    this.setComponentProperty(name, change.currentValue);
                }
            }
        };
        UpgradeNg1ComponentAdapter.prototype.ngDoCheck = function () {
            var count = 0;
            var destinationObj = this.destinationObj;
            var lastValues = this.checkLastValues;
            var checkProperties = this.checkProperties;
            for (var i = 0; i < checkProperties.length; i++) {
                var value = destinationObj[checkProperties[i]];
                var last = lastValues[i];
                if (value !== last) {
                    if (typeof value == 'number' && isNaN(value) && typeof last == 'number' && isNaN(last)) {
                    }
                    else {
                        var eventEmitter = this[this.propOuts[i]];
                        eventEmitter.emit(lastValues[i] = value);
                    }
                }
            }
            return count;
        };
        UpgradeNg1ComponentAdapter.prototype.setComponentProperty = function (name, value) {
            this.destinationObj[this.propertyMap[name]] = value;
        };
        UpgradeNg1ComponentAdapter.prototype.resolveRequired = function ($element, require) {
            if (!require) {
                return undefined;
            }
            else if (typeof require == 'string') {
                var name = require;
                var isOptional = false;
                var startParent = false;
                var searchParents = false;
                var ch;
                if (name.charAt(0) == '?') {
                    isOptional = true;
                    name = name.substr(1);
                }
                if (name.charAt(0) == '^') {
                    searchParents = true;
                    name = name.substr(1);
                }
                if (name.charAt(0) == '^') {
                    startParent = true;
                    name = name.substr(1);
                }
                var key = controllerKey(name);
                if (startParent)
                    $element = $element.parent();
                var dep = searchParents ? $element.inheritedData(key) : $element.data(key);
                if (!dep && !isOptional) {
                    throw new Error("Can not locate '" + require + "' in '" + this.directive.name + "'.");
                }
                return dep;
            }
            else if (require instanceof Array) {
                var deps = [];
                for (var i = 0; i < require.length; i++) {
                    deps.push(this.resolveRequired($element, require[i]));
                }
                return deps;
            }
            throw new Error("Directive '" + this.directive.name + "' require syntax unrecognized: " + this.directive.require);
        };
        return UpgradeNg1ComponentAdapter;
    }());
    var upgradeCount = 0;
    /**
     * Use `UpgradeAdapter` to allow AngularJS v1 and Angular v2 to coexist in a single application.
     *
     * The `UpgradeAdapter` allows:
     * 1. creation of Angular v2 component from AngularJS v1 component directive
     *    (See [UpgradeAdapter#upgradeNg1Component()])
     * 2. creation of AngularJS v1 directive from Angular v2 component.
     *    (See [UpgradeAdapter#downgradeNg2Component()])
     * 3. Bootstrapping of a hybrid Angular application which contains both of the frameworks
     *    coexisting in a single application.
     *
     * ## Mental Model
     *
     * When reasoning about how a hybrid application works it is useful to have a mental model which
     * describes what is happening and explains what is happening at the lowest level.
     *
     * 1. There are two independent frameworks running in a single application, each framework treats
     *    the other as a black box.
     * 2. Each DOM element on the page is owned exactly by one framework. Whichever framework
     *    instantiated the element is the owner. Each framework only updates/interacts with its own
     *    DOM elements and ignores others.
     * 3. AngularJS v1 directives always execute inside AngularJS v1 framework codebase regardless of
     *    where they are instantiated.
     * 4. Angular v2 components always execute inside Angular v2 framework codebase regardless of
     *    where they are instantiated.
     * 5. An AngularJS v1 component can be upgraded to an Angular v2 component. This creates an
     *    Angular v2 directive, which bootstraps the AngularJS v1 component directive in that location.
     * 6. An Angular v2 component can be downgraded to an AngularJS v1 component directive. This creates
     *    an AngularJS v1 directive, which bootstraps the Angular v2 component in that location.
     * 7. Whenever an adapter component is instantiated the host element is owned by the framework
     *    doing the instantiation. The other framework then instantiates and owns the view for that
     *    component. This implies that component bindings will always follow the semantics of the
     *    instantiation framework. The syntax is always that of Angular v2 syntax.
     * 8. AngularJS v1 is always bootstrapped first and owns the bottom most view.
     * 9. The new application is running in Angular v2 zone, and therefore it no longer needs calls to
     *    `$apply()`.
     *
     * ### Example
     *
     * ```
     * var adapter = new UpgradeAdapter();
     * var module = angular.module('myExample', []);
     * module.directive('ng2', adapter.downgradeNg2Component(Ng2));
     *
     * module.directive('ng1', function() {
     *   return {
     *      scope: { title: '=' },
     *      template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
     *   };
     * });
     *
     *
     * @Component({
     *   selector: 'ng2',
     *   inputs: ['name'],
     *   template: 'ng2[<ng1 [title]="name">transclude</ng1>](<ng-content></ng-content>)',
     *   directives: [adapter.upgradeNg1Component('ng1')]
     * })
     * class Ng2 {
     * }
     *
     * document.body.innerHTML = '<ng2 name="World">project</ng2>';
     *
     * adapter.bootstrap(document.body, ['myExample']).ready(function() {
     *   expect(document.body.textContent).toEqual(
     *       "ng2[ng1[Hello World!](transclude)](project)");
     * });
     * ```
     */
    var UpgradeAdapter = (function () {
        function UpgradeAdapter() {
            /* @internal */
            this.idPrefix = "NG2_UPGRADE_" + upgradeCount++ + "_";
            /* @internal */
            this.upgradedComponents = [];
            /* @internal */
            this.downgradedComponents = {};
            /* @internal */
            this.providers = [];
        }
        /**
         * Allows Angular v2 Component to be used from AngularJS v1.
         *
         * Use `downgradeNg2Component` to create an AngularJS v1 Directive Definition Factory from
         * Angular v2 Component. The adapter will bootstrap Angular v2 component from within the
         * AngularJS v1 template.
         *
         * ## Mental Model
         *
         * 1. The component is instantiated by being listed in AngularJS v1 template. This means that the
         *    host element is controlled by AngularJS v1, but the component's view will be controlled by
         *    Angular v2.
         * 2. Even thought the component is instantiated in AngularJS v1, it will be using Angular v2
         *    syntax. This has to be done, this way because we must follow Angular v2 components do not
         *    declare how the attributes should be interpreted.
         *
         * ## Supported Features
         *
         * - Bindings:
         *   - Attribute: `<comp name="World">`
         *   - Interpolation:  `<comp greeting="Hello {{name}}!">`
         *   - Expression:  `<comp [name]="username">`
         *   - Event:  `<comp (close)="doSomething()">`
         * - Content projection: yes
         *
         * ### Example
         *
         * ```
         * var adapter = new UpgradeAdapter();
         * var module = angular.module('myExample', []);
         * module.directive('greet', adapter.downgradeNg2Component(Greeter));
         *
         * @Component({
         *   selector: 'greet',
         *   template: '{{salutation}} {{name}}! - <ng-content></ng-content>'
         * })
         * class Greeter {
         *   @Input() salutation: string;
         *   @Input() name: string;
         * }
         *
         * document.body.innerHTML =
         *   'ng1 template: <greet salutation="Hello" [name]="world">text</greet>';
         *
         * adapter.bootstrap(document.body, ['myExample']).ready(function() {
         *   expect(document.body.textContent).toEqual("ng1 template: Hello world! - text");
         * });
         * ```
         */
        UpgradeAdapter.prototype.downgradeNg2Component = function (type) {
            this.upgradedComponents.push(type);
            var info = getComponentInfo(type);
            return ng1ComponentDirective(info, "" + this.idPrefix + info.selector + "_c");
        };
        /**
         * Allows AngularJS v1 Component to be used from Angular v2.
         *
         * Use `upgradeNg1Component` to create an Angular v2 component from AngularJS v1 Component
         * directive. The adapter will bootstrap AngularJS v1 component from within the Angular v2
         * template.
         *
         * ## Mental Model
         *
         * 1. The component is instantiated by being listed in Angular v2 template. This means that the
         *    host element is controlled by Angular v2, but the component's view will be controlled by
         *    AngularJS v1.
         *
         * ## Supported Features
         *
         * - Bindings:
         *   - Attribute: `<comp name="World">`
         *   - Interpolation:  `<comp greeting="Hello {{name}}!">`
         *   - Expression:  `<comp [name]="username">`
         *   - Event:  `<comp (close)="doSomething()">`
         * - Transclusion: yes
         * - Only some of the features of
         *   [Directive Definition Object](https://docs.angularjs.org/api/ng/service/$compile) are
         *   supported:
         *   - `compile`: not supported because the host element is owned by Angular v2, which does
         *     not allow modifying DOM structure during compilation.
         *   - `controller`: supported. (NOTE: injection of `$attrs` and `$transclude` is not supported.)
         *   - `controllerAs': supported.
         *   - `bindToController': supported.
         *   - `link': supported. (NOTE: only pre-link function is supported.)
         *   - `name': supported.
         *   - `priority': ignored.
         *   - `replace': not supported.
         *   - `require`: supported.
         *   - `restrict`: must be set to 'E'.
         *   - `scope`: supported.
         *   - `template`: supported.
         *   - `templateUrl`: supported.
         *   - `terminal`: ignored.
         *   - `transclude`: supported.
         *
         *
         * ### Example
         *
         * ```
         * var adapter = new UpgradeAdapter();
         * var module = angular.module('myExample', []);
         *
         * module.directive('greet', function() {
         *   return {
         *     scope: {salutation: '=', name: '=' },
         *     template: '{{salutation}} {{name}}! - <span ng-transclude></span>'
         *   };
         * });
         *
         * module.directive('ng2', adapter.downgradeNg2Component(Ng2));
         *
         * @Component({
         *   selector: 'ng2',
         *   template: 'ng2 template: <greet salutation="Hello" [name]="world">text</greet>'
         *   directives: [adapter.upgradeNg1Component('greet')]
         * })
         * class Ng2 {
         * }
         *
         * document.body.innerHTML = '<ng2></ng2>';
         *
         * adapter.bootstrap(document.body, ['myExample']).ready(function() {
         *   expect(document.body.textContent).toEqual("ng2 template: Hello world! - text");
         * });
         * ```
         */
        UpgradeAdapter.prototype.upgradeNg1Component = function (name) {
            if (this.downgradedComponents.hasOwnProperty(name)) {
                return this.downgradedComponents[name].type;
            }
            else {
                return (this.downgradedComponents[name] = new UpgradeNg1ComponentAdapterBuilder(name)).type;
            }
        };
        /**
         * Bootstrap a hybrid AngularJS v1 / Angular v2 application.
         *
         * This `bootstrap` method is a direct replacement (takes same arguments) for AngularJS v1
         * [`bootstrap`](https://docs.angularjs.org/api/ng/function/angular.bootstrap) method. Unlike
         * AngularJS v1, this bootstrap is asynchronous.
         *
         * ### Example
         *
         * ```
         * var adapter = new UpgradeAdapter();
         * var module = angular.module('myExample', []);
         * module.directive('ng2', adapter.downgradeNg2Component(Ng2));
         *
         * module.directive('ng1', function() {
         *   return {
         *      scope: { title: '=' },
         *      template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
         *   };
         * });
         *
         *
         * @Component({
         *   selector: 'ng2',
         *   inputs: ['name'],
         *   template: 'ng2[<ng1 [title]="name">transclude</ng1>](<ng-content></ng-content>)',
         *   directives: [adapter.upgradeNg1Component('ng1')]
         * })
         * class Ng2 {
         * }
         *
         * document.body.innerHTML = '<ng2 name="World">project</ng2>';
         *
         * adapter.bootstrap(document.body, ['myExample']).ready(function() {
         *   expect(document.body.textContent).toEqual(
         *       "ng2[ng1[Hello World!](transclude)](project)");
         * });
         * ```
         */
        UpgradeAdapter.prototype.bootstrap = function (element$$, modules, config) {
            var _this = this;
            var upgrade = new UpgradeAdapterRef();
            var ng1Injector = null;
            var platformRef = _angular_platformBrowser.browserPlatform();
            var applicationRef = _angular_core.ReflectiveInjector.resolveAndCreate([
                _angular_platformBrowserDynamic.BROWSER_APP_DYNAMIC_PROVIDERS,
                _angular_core.provide(NG1_INJECTOR, { useFactory: function () { return ng1Injector; } }),
                _angular_core.provide(NG1_COMPILE, { useFactory: function () { return ng1Injector.get(NG1_COMPILE); } }),
                this.providers
            ], platformRef.injector)
                .get(_angular_core.ApplicationRef);
            var injector = applicationRef.injector;
            var ngZone = injector.get(_angular_core.NgZone);
            var compiler = injector.get(_angular_core.ComponentResolver);
            var delayApplyExps = [];
            var original$applyFn;
            var rootScopePrototype;
            var rootScope;
            var componentFactoryRefMap = {};
            var ng1Module = module$1(this.idPrefix, modules);
            var ng1BootstrapPromise = null;
            var ng1compilePromise = null;
            ng1Module.value(NG2_INJECTOR, injector)
                .value(NG2_ZONE, ngZone)
                .value(NG2_COMPILER, compiler)
                .value(NG2_COMPONENT_FACTORY_REF_MAP, componentFactoryRefMap)
                .config([
                '$provide',
                function (provide) {
                    provide.decorator(NG1_ROOT_SCOPE, [
                        '$delegate',
                        function (rootScopeDelegate) {
                            rootScopePrototype = rootScopeDelegate.constructor.prototype;
                            if (rootScopePrototype.hasOwnProperty('$apply')) {
                                original$applyFn = rootScopePrototype.$apply;
                                rootScopePrototype.$apply = function (exp) { return delayApplyExps.push(exp); };
                            }
                            else {
                                throw new Error("Failed to find '$apply' on '$rootScope'!");
                            }
                            return rootScope = rootScopeDelegate;
                        }
                    ]);
                    provide.decorator(NG1_TESTABILITY, [
                        '$delegate',
                        function (testabilityDelegate) {
                            var _this = this;
                            var ng2Testability = injector.get(_angular_core.Testability);
                            var origonalWhenStable = testabilityDelegate.whenStable;
                            var newWhenStable = function (callback) {
                                var whenStableContext = _this;
                                origonalWhenStable.call(_this, function () {
                                    if (ng2Testability.isStable()) {
                                        callback.apply(this, arguments);
                                    }
                                    else {
                                        ng2Testability.whenStable(newWhenStable.bind(whenStableContext, callback));
                                    }
                                });
                            };
                            testabilityDelegate.whenStable = newWhenStable;
                            return testabilityDelegate;
                        }
                    ]);
                }
            ]);
            ng1compilePromise = new Promise(function (resolve, reject) {
                ng1Module.run([
                    '$injector',
                    '$rootScope',
                    function (injector, rootScope) {
                        ng1Injector = injector;
                        ngZone.onMicrotaskEmpty.subscribe({ next: function (_) { return ngZone.runOutsideAngular(function () { return rootScope.$apply(); }); } });
                        UpgradeNg1ComponentAdapterBuilder.resolve(_this.downgradedComponents, injector)
                            .then(resolve, reject);
                    }
                ]);
            });
            // Make sure resumeBootstrap() only exists if the current bootstrap is deferred
            var windowAngular = window['angular'];
            windowAngular.resumeBootstrap = undefined;
            element(element$$).data(controllerKey(NG2_INJECTOR), injector);
            ngZone.run(function () { bootstrap(element$$, [_this.idPrefix], config); });
            ng1BootstrapPromise = new Promise(function (resolve, reject) {
                if (windowAngular.resumeBootstrap) {
                    var originalResumeBootstrap = windowAngular.resumeBootstrap;
                    windowAngular.resumeBootstrap = function () {
                        windowAngular.resumeBootstrap = originalResumeBootstrap;
                        windowAngular.resumeBootstrap.apply(this, arguments);
                        resolve();
                    };
                }
                else {
                    resolve();
                }
            });
            Promise.all([
                this.compileNg2Components(compiler, componentFactoryRefMap),
                ng1BootstrapPromise,
                ng1compilePromise
            ])
                .then(function () {
                ngZone.run(function () {
                    if (rootScopePrototype) {
                        rootScopePrototype.$apply = original$applyFn; // restore original $apply
                        while (delayApplyExps.length) {
                            rootScope.$apply(delayApplyExps.shift());
                        }
                        upgrade._bootstrapDone(applicationRef, ng1Injector);
                        rootScopePrototype = null;
                    }
                });
            }, onError);
            return upgrade;
        };
        /**
         * Adds a provider to the top level environment of a hybrid AngularJS v1 / Angular v2 application.
         *
         * In hybrid AngularJS v1 / Angular v2 application, there is no one root Angular v2 component,
         * for this reason we provide an application global way of registering providers which is
         * consistent with single global injection in AngularJS v1.
         *
         * ### Example
         *
         * ```
         * class Greeter {
         *   greet(name) {
         *     alert('Hello ' + name + '!');
         *   }
         * }
         *
         * @Component({
         *   selector: 'app',
         *   template: ''
         * })
         * class App {
         *   constructor(greeter: Greeter) {
         *     this.greeter('World');
         *   }
         * }
         *
         * var adapter = new UpgradeAdapter();
         * adapter.addProvider(Greeter);
         *
         * var module = angular.module('myExample', []);
         * module.directive('app', adapter.downgradeNg2Component(App));
         *
         * document.body.innerHTML = '<app></app>'
         * adapter.bootstrap(document.body, ['myExample']);
         *```
         */
        UpgradeAdapter.prototype.addProvider = function (provider) { this.providers.push(provider); };
        /**
         * Allows AngularJS v1 service to be accessible from Angular v2.
         *
         *
         * ### Example
         *
         * ```
         * class Login { ... }
         * class Server { ... }
         *
         * @Injectable()
         * class Example {
         *   constructor(@Inject('server') server, login: Login) {
         *     ...
         *   }
         * }
         *
         * var module = angular.module('myExample', []);
         * module.service('server', Server);
         * module.service('login', Login);
         *
         * var adapter = new UpgradeAdapter();
         * adapter.upgradeNg1Provider('server');
         * adapter.upgradeNg1Provider('login', {asToken: Login});
         * adapter.addProvider(Example);
         *
         * adapter.bootstrap(document.body, ['myExample']).ready((ref) => {
         *   var example: Example = ref.ng2Injector.get(Example);
         * });
         *
         * ```
         */
        UpgradeAdapter.prototype.upgradeNg1Provider = function (name, options) {
            var token = options && options.asToken || name;
            this.providers.push(_angular_core.provide(token, {
                useFactory: function (ng1Injector) { return ng1Injector.get(name); },
                deps: [NG1_INJECTOR]
            }));
        };
        /**
         * Allows Angular v2 service to be accessible from AngularJS v1.
         *
         *
         * ### Example
         *
         * ```
         * class Example {
         * }
         *
         * var adapter = new UpgradeAdapter();
         * adapter.addProvider(Example);
         *
         * var module = angular.module('myExample', []);
         * module.factory('example', adapter.downgradeNg2Provider(Example));
         *
         * adapter.bootstrap(document.body, ['myExample']).ready((ref) => {
         *   var example: Example = ref.ng1Injector.get('example');
         * });
         *
         * ```
         */
        UpgradeAdapter.prototype.downgradeNg2Provider = function (token) {
            var factory = function (injector) { return injector.get(token); };
            factory.$inject = [NG2_INJECTOR];
            return factory;
        };
        /* @internal */
        UpgradeAdapter.prototype.compileNg2Components = function (compiler, componentFactoryRefMap) {
            var _this = this;
            var promises = [];
            var types = this.upgradedComponents;
            for (var i = 0; i < types.length; i++) {
                promises.push(compiler.resolveComponent(types[i]));
            }
            return Promise.all(promises).then(function (componentFactories) {
                var types = _this.upgradedComponents;
                for (var i = 0; i < componentFactories.length; i++) {
                    componentFactoryRefMap[getComponentInfo(types[i]).selector] = componentFactories[i];
                }
                return componentFactoryRefMap;
            }, onError);
        };
        return UpgradeAdapter;
    }());
    function ng1ComponentDirective(info, idPrefix) {
        directiveFactory.$inject = [NG2_COMPONENT_FACTORY_REF_MAP, NG1_PARSE];
        function directiveFactory(componentFactoryRefMap, parse) {
            var componentFactory = componentFactoryRefMap[info.selector];
            if (!componentFactory)
                throw new Error('Expecting ComponentFactory for: ' + info.selector);
            var idCount = 0;
            return {
                restrict: 'E',
                require: REQUIRE_INJECTOR,
                link: {
                    post: function (scope, element, attrs, parentInjector, transclude) {
                        var domElement = element[0];
                        var facade = new DowngradeNg2ComponentAdapter(idPrefix + (idCount++), info, element, attrs, scope, parentInjector, parse, componentFactory);
                        facade.setupInputs();
                        facade.bootstrapNg2();
                        facade.projectContent();
                        facade.setupOutputs();
                        facade.registerCleanup();
                    }
                }
            };
        }
        return directiveFactory;
    }
    /**
     * Use `UgradeAdapterRef` to control a hybrid AngularJS v1 / Angular v2 application.
     */
    var UpgradeAdapterRef = (function () {
        function UpgradeAdapterRef() {
            /* @internal */
            this._readyFn = null;
            this.ng1RootScope = null;
            this.ng1Injector = null;
            this.ng2ApplicationRef = null;
            this.ng2Injector = null;
        }
        /* @internal */
        UpgradeAdapterRef.prototype._bootstrapDone = function (applicationRef, ng1Injector) {
            this.ng2ApplicationRef = applicationRef;
            this.ng2Injector = applicationRef.injector;
            this.ng1Injector = ng1Injector;
            this.ng1RootScope = ng1Injector.get(NG1_ROOT_SCOPE);
            this._readyFn && this._readyFn(this);
        };
        /**
         * Register a callback function which is notified upon successful hybrid AngularJS v1 / Angular v2
         * application has been bootstrapped.
         *
         * The `ready` callback function is invoked inside the Angular v2 zone, therefore it does not
         * require a call to `$apply()`.
         */
        UpgradeAdapterRef.prototype.ready = function (fn) { this._readyFn = fn; };
        /**
         * Dispose of running hybrid AngularJS v1 / Angular v2 application.
         */
        UpgradeAdapterRef.prototype.dispose = function () {
            this.ng1Injector.get(NG1_ROOT_SCOPE).$destroy();
            this.ng2ApplicationRef.dispose();
        };
        return UpgradeAdapterRef;
    }());
    exports.UpgradeAdapter = UpgradeAdapter;
    exports.UpgradeAdapterRef = UpgradeAdapterRef;
}));
