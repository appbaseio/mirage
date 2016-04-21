import { provide, platform, AppViewManager, Compiler, NgZone, Testability } from 'angular2/core';
import { global } from 'angular2/src/facade/lang';
import { ObservableWrapper } from 'angular2/src/facade/async';
import { BROWSER_PROVIDERS, BROWSER_APP_PROVIDERS } from 'angular2/platform/browser';
import { getComponentInfo } from './metadata';
import { onError, controllerKey } from './util';
import { NG1_COMPILE, NG1_INJECTOR, NG1_PARSE, NG1_ROOT_SCOPE, NG1_TESTABILITY, NG2_APP_VIEW_MANAGER, NG2_COMPILER, NG2_INJECTOR, NG2_HOST_VIEW_FACTORY_REF_MAP, NG2_ZONE, REQUIRE_INJECTOR } from './constants';
import { DowngradeNg2ComponentAdapter } from './downgrade_ng2_adapter';
import { UpgradeNg1ComponentAdapterBuilder } from './upgrade_ng1_adapter';
import * as angular from './angular_js';
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
export class UpgradeAdapter {
    constructor() {
        /* @internal */
        this.idPrefix = `NG2_UPGRADE_${upgradeCount++}_`;
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
    downgradeNg2Component(type) {
        this.upgradedComponents.push(type);
        var info = getComponentInfo(type);
        return ng1ComponentDirective(info, `${this.idPrefix}${info.selector}_c`);
    }
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
    upgradeNg1Component(name) {
        if (this.downgradedComponents.hasOwnProperty(name)) {
            return this.downgradedComponents[name].type;
        }
        else {
            return (this.downgradedComponents[name] = new UpgradeNg1ComponentAdapterBuilder(name)).type;
        }
    }
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
    bootstrap(element, modules, config) {
        var upgrade = new UpgradeAdapterRef();
        var ng1Injector = null;
        var platformRef = platform(BROWSER_PROVIDERS);
        var applicationRef = platformRef.application([
            BROWSER_APP_PROVIDERS,
            provide(NG1_INJECTOR, { useFactory: () => ng1Injector }),
            provide(NG1_COMPILE, { useFactory: () => ng1Injector.get(NG1_COMPILE) }),
            this.providers
        ]);
        var injector = applicationRef.injector;
        var ngZone = injector.get(NgZone);
        var compiler = injector.get(Compiler);
        var delayApplyExps = [];
        var original$applyFn;
        var rootScopePrototype;
        var rootScope;
        var hostViewFactoryRefMap = {};
        var ng1Module = angular.module(this.idPrefix, modules);
        var ng1BootstrapPromise = null;
        var ng1compilePromise = null;
        ng1Module.value(NG2_INJECTOR, injector)
            .value(NG2_ZONE, ngZone)
            .value(NG2_COMPILER, compiler)
            .value(NG2_HOST_VIEW_FACTORY_REF_MAP, hostViewFactoryRefMap)
            .value(NG2_APP_VIEW_MANAGER, injector.get(AppViewManager))
            .config([
            '$provide',
                (provide) => {
                provide.decorator(NG1_ROOT_SCOPE, [
                    '$delegate',
                    function (rootScopeDelegate) {
                        rootScopePrototype = rootScopeDelegate.constructor.prototype;
                        if (rootScopePrototype.hasOwnProperty('$apply')) {
                            original$applyFn = rootScopePrototype.$apply;
                            rootScopePrototype.$apply = (exp) => delayApplyExps.push(exp);
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
                        var ng2Testability = injector.get(Testability);
                        var origonalWhenStable = testabilityDelegate.whenStable;
                        var newWhenStable = (callback) => {
                            var whenStableContext = this;
                            origonalWhenStable.call(this, function () {
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
        ng1compilePromise = new Promise((resolve, reject) => {
            ng1Module.run([
                '$injector',
                '$rootScope',
                    (injector, rootScope) => {
                    ng1Injector = injector;
                    ObservableWrapper.subscribe(ngZone.onMicrotaskEmpty, (_) => ngZone.runOutsideAngular(() => rootScope.$apply()));
                    UpgradeNg1ComponentAdapterBuilder.resolve(this.downgradedComponents, injector)
                        .then(resolve, reject);
                }
            ]);
        });
        // Make sure resumeBootstrap() only exists if the current bootstrap is deferred
        var windowAngular = global.angular;
        windowAngular.resumeBootstrap = undefined;
        angular.element(element).data(controllerKey(NG2_INJECTOR), injector);
        ngZone.run(() => { angular.bootstrap(element, [this.idPrefix], config); });
        ng1BootstrapPromise = new Promise((resolve, reject) => {
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
            this.compileNg2Components(compiler, hostViewFactoryRefMap),
            ng1BootstrapPromise,
            ng1compilePromise
        ])
            .then(() => {
            ngZone.run(() => {
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
    }
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
    addProvider(provider) { this.providers.push(provider); }
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
    upgradeNg1Provider(name, options) {
        var token = options && options.asToken || name;
        this.providers.push(provide(token, {
            useFactory: (ng1Injector) => ng1Injector.get(name),
            deps: [NG1_INJECTOR]
        }));
    }
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
    downgradeNg2Provider(token) {
        var factory = function (injector) { return injector.get(token); };
        factory.$inject = [NG2_INJECTOR];
        return factory;
    }
    /* @internal */
    compileNg2Components(compiler, hostViewFactoryRefMap) {
        var promises = [];
        var types = this.upgradedComponents;
        for (var i = 0; i < types.length; i++) {
            promises.push(compiler.compileInHost(types[i]));
        }
        return Promise.all(promises).then((hostViewFactories) => {
            var types = this.upgradedComponents;
            for (var i = 0; i < hostViewFactories.length; i++) {
                hostViewFactoryRefMap[getComponentInfo(types[i]).selector] = hostViewFactories[i];
            }
            return hostViewFactoryRefMap;
        }, onError);
    }
}
function ng1ComponentDirective(info, idPrefix) {
    directiveFactory.$inject =
        [NG2_HOST_VIEW_FACTORY_REF_MAP, NG2_APP_VIEW_MANAGER, NG1_PARSE];
    function directiveFactory(hostViewFactoryRefMap, viewManager, parse) {
        var hostViewFactory = hostViewFactoryRefMap[info.selector];
        if (!hostViewFactory)
            throw new Error('Expecting HostViewFactoryRef for: ' + info.selector);
        var idCount = 0;
        return {
            restrict: 'E',
            require: REQUIRE_INJECTOR,
            link: {
                post: (scope, element, attrs, parentInjector, transclude) => {
                    var domElement = element[0];
                    var facade = new DowngradeNg2ComponentAdapter(idPrefix + (idCount++), info, element, attrs, scope, parentInjector, parse, viewManager, hostViewFactory);
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
export class UpgradeAdapterRef {
    constructor() {
        /* @internal */
        this._readyFn = null;
        this.ng1RootScope = null;
        this.ng1Injector = null;
        this.ng2ApplicationRef = null;
        this.ng2Injector = null;
    }
    /* @internal */
    _bootstrapDone(applicationRef, ng1Injector) {
        this.ng2ApplicationRef = applicationRef;
        this.ng2Injector = applicationRef.injector;
        this.ng1Injector = ng1Injector;
        this.ng1RootScope = ng1Injector.get(NG1_ROOT_SCOPE);
        this._readyFn && this._readyFn(this);
    }
    /**
     * Register a callback function which is notified upon successful hybrid AngularJS v1 / Angular v2
     * application has been bootstrapped.
     *
     * The `ready` callback function is invoked inside the Angular v2 zone, therefore it does not
     * require a call to `$apply()`.
     */
    ready(fn) { this._readyFn = fn; }
    /**
     * Dispose of running hybrid AngularJS v1 / Angular v2 application.
     */
    dispose() {
        this.ng1Injector.get(NG1_ROOT_SCOPE).$destroy();
        this.ng2ApplicationRef.dispose();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL3VwZ3JhZGUvdXBncmFkZV9hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQ0wsT0FBTyxFQUNQLFFBQVEsRUFFUixjQUFjLEVBQ2QsUUFBUSxFQUVSLE1BQU0sRUFLTixXQUFXLEVBRVosTUFBTSxlQUFlO09BQ2YsRUFBQyxNQUFNLEVBQUMsTUFBTSwwQkFBMEI7T0FDeEMsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDJCQUEyQjtPQUNwRCxFQUFDLGlCQUFpQixFQUFFLHFCQUFxQixFQUFDLE1BQU0sMkJBQTJCO09BRTNFLEVBQUMsZ0JBQWdCLEVBQWdCLE1BQU0sWUFBWTtPQUNuRCxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUMsTUFBTSxRQUFRO09BQ3RDLEVBQ0wsV0FBVyxFQUNYLFlBQVksRUFDWixTQUFTLEVBQ1QsY0FBYyxFQUVkLGVBQWUsRUFDZixvQkFBb0IsRUFDcEIsWUFBWSxFQUNaLFlBQVksRUFDWiw2QkFBNkIsRUFDN0IsUUFBUSxFQUNSLGdCQUFnQixFQUNqQixNQUFNLGFBQWE7T0FDYixFQUFDLDRCQUE0QixFQUFDLE1BQU0seUJBQXlCO09BQzdELEVBQUMsaUNBQWlDLEVBQUMsTUFBTSx1QkFBdUI7T0FDaEUsS0FBSyxPQUFPLE1BQU0sY0FBYztBQUV2QyxJQUFJLFlBQVksR0FBVyxDQUFDLENBQUM7QUFFN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0VHO0FBQ0g7SUFBQTtRQUNFLGVBQWU7UUFDUCxhQUFRLEdBQVcsZUFBZSxZQUFZLEVBQUUsR0FBRyxDQUFDO1FBQzVELGVBQWU7UUFDUCx1QkFBa0IsR0FBVyxFQUFFLENBQUM7UUFDeEMs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QkMsZUFBZTtJQUNQLGNBQWMsQ0FBQyxjQUE4QixFQUFFLFdBQXFDO1FBQzFGLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxjQUFjLENBQUM7UUFDeEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDO1FBQzNDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxFQUFtRCxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV6Rjs7T0FFRztJQUNJLE9BQU87UUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkMsQ0FBQztBQUNILENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIHByb3ZpZGUsXG4gIHBsYXRmb3JtLFxuICBBcHBsaWNhdGlvblJlZixcbiAgQXBwVmlld01hbmFnZXIsXG4gIENvbXBpbGVyLFxuICBJbmplY3RvcixcbiAgTmdab25lLFxuICBQbGF0Zm9ybVJlZixcbiAgSG9zdFZpZXdGYWN0b3J5UmVmLFxuICBQcm92aWRlcixcbiAgVHlwZSxcbiAgVGVzdGFiaWxpdHksXG4gIEFQUExJQ0FUSU9OX0NPTU1PTl9QUk9WSURFUlNcbn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge2dsb2JhbH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7T2JzZXJ2YWJsZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHtCUk9XU0VSX1BST1ZJREVSUywgQlJPV1NFUl9BUFBfUFJPVklERVJTfSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9icm93c2VyJztcblxuaW1wb3J0IHtnZXRDb21wb25lbnRJbmZvLCBDb21wb25lbnRJbmZvfSBmcm9tICcuL21ldGFkYXRhJztcbmltcG9ydCB7b25FcnJvciwgY29udHJvbGxlcktleX0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7XG4gIE5HMV9DT01QSUxFLFxuICBORzFfSU5KRUNUT1IsXG4gIE5HMV9QQVJTRSxcbiAgTkcxX1JPT1RfU0NPUEUsXG4gIE5HMV9TQ09QRSxcbiAgTkcxX1RFU1RBQklMSVRZLFxuICBORzJfQVBQX1ZJRVdfTUFOQUdFUixcbiAgTkcyX0NPTVBJTEVSLFxuICBORzJfSU5KRUNUT1IsXG4gIE5HMl9IT1NUX1ZJRVdfRkFDVE9SWV9SRUZfTUFQLFxuICBORzJfWk9ORSxcbiAgUkVRVUlSRV9JTkpFQ1RPUlxufSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge0Rvd25ncmFkZU5nMkNvbXBvbmVudEFkYXB0ZXJ9IGZyb20gJy4vZG93bmdyYWRlX25nMl9hZGFwdGVyJztcbmltcG9ydCB7VXBncmFkZU5nMUNvbXBvbmVudEFkYXB0ZXJCdWlsZGVyfSBmcm9tICcuL3VwZ3JhZGVfbmcxX2FkYXB0ZXInO1xuaW1wb3J0ICogYXMgYW5ndWxhciBmcm9tICcuL2FuZ3VsYXJfanMnO1xuXG52YXIgdXBncmFkZUNvdW50OiBudW1iZXIgPSAwO1xuXG4vKipcbiAqIFVzZSBgVXBncmFkZUFkYXB0ZXJgIHRvIGFsbG93IEFuZ3VsYXJKUyB2MSBhbmQgQW5ndWxhciB2MiB0byBjb2V4aXN0IGluIGEgc2luZ2xlIGFwcGxpY2F0aW9uLlxuICpcbiAqIFRoZSBgVXBncmFkZUFkYXB0ZXJgIGFsbG93czpcbiAqIDEuIGNyZWF0aW9uIG9mIEFuZ3VsYXIgdjIgY29tcG9uZW50IGZyb20gQW5ndWxhckpTIHYxIGNvbXBvbmVudCBkaXJlY3RpdmVcbiAqICAgIChTZWUgW1VwZ3JhZGVBZGFwdGVyI3VwZ3JhZGVOZzFDb21wb25lbnQoKV0pXG4gKiAyLiBjcmVhdGlvbiBvZiBBbmd1bGFySlMgdjEgZGlyZWN0aXZlIGZyb20gQW5ndWxhciB2MiBjb21wb25lbnQuXG4gKiAgICAoU2VlIFtVcGdyYWRlQWRhcHRlciNkb3duZ3JhZGVOZzJDb21wb25lbnQoKV0pXG4gKiAzLiBCb290c3RyYXBwaW5nIG9mIGEgaHlicmlkIEFuZ3VsYXIgYXBwbGljYXRpb24gd2hpY2ggY29udGFpbnMgYm90aCBvZiB0aGUgZnJhbWV3b3Jrc1xuICogICAgY29leGlzdGluZyBpbiBhIHNpbmdsZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiAjIyBNZW50YWwgTW9kZWxcbiAqXG4gKiBXaGVuIHJlYXNvbmluZyBhYm91dCBob3cgYSBoeWJyaWQgYXBwbGljYXRpb24gd29ya3MgaXQgaXMgdXNlZnVsIHRvIGhhdmUgYSBtZW50YWwgbW9kZWwgd2hpY2hcbiAqIGRlc2NyaWJlcyB3aGF0IGlzIGhhcHBlbmluZyBhbmQgZXhwbGFpbnMgd2hhdCBpcyBoYXBwZW5pbmcgYXQgdGhlIGxvd2VzdCBsZXZlbC5cbiAqXG4gKiAxLiBUaGVyZSBhcmUgdHdvIGluZGVwZW5kZW50IGZyYW1ld29ya3MgcnVubmluZyBpbiBhIHNpbmdsZSBhcHBsaWNhdGlvbiwgZWFjaCBmcmFtZXdvcmsgdHJlYXRzXG4gKiAgICB0aGUgb3RoZXIgYXMgYSBibGFjayBib3guXG4gKiAyLiBFYWNoIERPTSBlbGVtZW50IG9uIHRoZSBwYWdlIGlzIG93bmVkIGV4YWN0bHkgYnkgb25lIGZyYW1ld29yay4gV2hpY2hldmVyIGZyYW1ld29ya1xuICogICAgaW5zdGFudGlhdGVkIHRoZSBlbGVtZW50IGlzIHRoZSBvd25lci4gRWFjaCBmcmFtZXdvcmsgb25seSB1cGRhdGVzL2ludGVyYWN0cyB3aXRoIGl0cyBvd25cbiAqICAgIERPTSBlbGVtZW50cyBhbmQgaWdub3JlcyBvdGhlcnMuXG4gKiAzLiBBbmd1bGFySlMgdjEgZGlyZWN0aXZlcyBhbHdheXMgZXhlY3V0ZSBpbnNpZGUgQW5ndWxhckpTIHYxIGZyYW1ld29yayBjb2RlYmFzZSByZWdhcmRsZXNzIG9mXG4gKiAgICB3aGVyZSB0aGV5IGFyZSBpbnN0YW50aWF0ZWQuXG4gKiA0LiBBbmd1bGFyIHYyIGNvbXBvbmVudHMgYWx3YXlzIGV4ZWN1dGUgaW5zaWRlIEFuZ3VsYXIgdjIgZnJhbWV3b3JrIGNvZGViYXNlIHJlZ2FyZGxlc3Mgb2ZcbiAqICAgIHdoZXJlIHRoZXkgYXJlIGluc3RhbnRpYXRlZC5cbiAqIDUuIEFuIEFuZ3VsYXJKUyB2MSBjb21wb25lbnQgY2FuIGJlIHVwZ3JhZGVkIHRvIGFuIEFuZ3VsYXIgdjIgY29tcG9uZW50LiBUaGlzIGNyZWF0ZXMgYW5cbiAqICAgIEFuZ3VsYXIgdjIgZGlyZWN0aXZlLCB3aGljaCBib290c3RyYXBzIHRoZSBBbmd1bGFySlMgdjEgY29tcG9uZW50IGRpcmVjdGl2ZSBpbiB0aGF0IGxvY2F0aW9uLlxuICogNi4gQW4gQW5ndWxhciB2MiBjb21wb25lbnQgY2FuIGJlIGRvd25ncmFkZWQgdG8gYW4gQW5ndWxhckpTIHYxIGNvbXBvbmVudCBkaXJlY3RpdmUuIFRoaXMgY3JlYXRlc1xuICogICAgYW4gQW5ndWxhckpTIHYxIGRpcmVjdGl2ZSwgd2hpY2ggYm9vdHN0cmFwcyB0aGUgQW5ndWxhciB2MiBjb21wb25lbnQgaW4gdGhhdCBsb2NhdGlvbi5cbiAqIDcuIFdoZW5ldmVyIGFuIGFkYXB0ZXIgY29tcG9uZW50IGlzIGluc3RhbnRpYXRlZCB0aGUgaG9zdCBlbGVtZW50IGlzIG93bmVkIGJ5IHRoZSBmcmFtZXdvcmtcbiAqICAgIGRvaW5nIHRoZSBpbnN0YW50aWF0aW9uLiBUaGUgb3RoZXIgZnJhbWV3b3JrIHRoZW4gaW5zdGFudGlhdGVzIGFuZCBvd25zIHRoZSB2aWV3IGZvciB0aGF0XG4gKiAgICBjb21wb25lbnQuIFRoaXMgaW1wbGllcyB0aGF0IGNvbXBvbmVudCBiaW5kaW5ncyB3aWxsIGFsd2F5cyBmb2xsb3cgdGhlIHNlbWFudGljcyBvZiB0aGVcbiAqICAgIGluc3RhbnRpYXRpb24gZnJhbWV3b3JrLiBUaGUgc3ludGF4IGlzIGFsd2F5cyB0aGF0IG9mIEFuZ3VsYXIgdjIgc3ludGF4LlxuICogOC4gQW5ndWxhckpTIHYxIGlzIGFsd2F5cyBib290c3RyYXBwZWQgZmlyc3QgYW5kIG93bnMgdGhlIGJvdHRvbSBtb3N0IHZpZXcuXG4gKiA5LiBUaGUgbmV3IGFwcGxpY2F0aW9uIGlzIHJ1bm5pbmcgaW4gQW5ndWxhciB2MiB6b25lLCBhbmQgdGhlcmVmb3JlIGl0IG5vIGxvbmdlciBuZWVkcyBjYWxscyB0b1xuICogICAgYCRhcHBseSgpYC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogdmFyIGFkYXB0ZXIgPSBuZXcgVXBncmFkZUFkYXB0ZXIoKTtcbiAqIHZhciBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbXlFeGFtcGxlJywgW10pO1xuICogbW9kdWxlLmRpcmVjdGl2ZSgnbmcyJywgYWRhcHRlci5kb3duZ3JhZGVOZzJDb21wb25lbnQoTmcyKSk7XG4gKlxuICogbW9kdWxlLmRpcmVjdGl2ZSgnbmcxJywgZnVuY3Rpb24oKSB7XG4gKiAgIHJldHVybiB7XG4gKiAgICAgIHNjb3BlOiB7IHRpdGxlOiAnPScgfSxcbiAqICAgICAgdGVtcGxhdGU6ICduZzFbSGVsbG8ge3t0aXRsZX19IV0oPHNwYW4gbmctdHJhbnNjbHVkZT48L3NwYW4+KSdcbiAqICAgfTtcbiAqIH0pO1xuICpcbiAqXG4gKiBAQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICduZzInLFxuICogICBpbnB1dHM6IFsnbmFtZSddLFxuICogICB0ZW1wbGF0ZTogJ25nMls8bmcxIFt0aXRsZV09XCJuYW1lXCI+dHJhbnNjbHVkZTwvbmcxPl0oPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PiknLFxuICogICBkaXJlY3RpdmVzOiBbYWRhcHRlci51cGdyYWRlTmcxQ29tcG9uZW50KCduZzEnKV1cbiAqIH0pXG4gKiBjbGFzcyBOZzIge1xuICogfVxuICpcbiAqIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gJzxuZzIgbmFtZT1cIldvcmxkXCI+cHJvamVjdDwvbmcyPic7XG4gKlxuICogYWRhcHRlci5ib290c3RyYXAoZG9jdW1lbnQuYm9keSwgWydteUV4YW1wbGUnXSkucmVhZHkoZnVuY3Rpb24oKSB7XG4gKiAgIGV4cGVjdChkb2N1bWVudC5ib2R5LnRleHRDb250ZW50KS50b0VxdWFsKFxuICogICAgICAgXCJuZzJbbmcxW0hlbGxvIFdvcmxkIV0odHJhbnNjbHVkZSldKHByb2plY3QpXCIpO1xuICogfSk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIFVwZ3JhZGVBZGFwdGVyIHtcbiAgLyogQGludGVybmFsICovXG4gIHByaXZhdGUgaWRQcmVmaXg6IHN0cmluZyA9IGBORzJfVVBHUkFERV8ke3VwZ3JhZGVDb3VudCsrfV9gO1xuICAvKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSB1cGdyYWRlZENvbXBvbmVudHM6IFR5cGVbXSA9IFtdO1xuICAvKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBkb3duZ3JhZGVkQ29tcG9uZW50czoge1tuYW1lOiBzdHJpbmddOiBVcGdyYWRlTmcxQ29tcG9uZW50QWRhcHRlckJ1aWxkZXJ9ID0ge307XG4gIC8qIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIHByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+ID0gW107XG5cbiAgLyoqXG4gICAqIEFsbG93cyBBbmd1bGFyIHYyIENvbXBvbmVudCB0byBiZSB1c2VkIGZyb20gQW5ndWxhckpTIHYxLlxuICAgKlxuICAgKiBVc2UgYGRvd25ncmFkZU5nMkNvbXBvbmVudGAgdG8gY3JlYXRlIGFuIEFuZ3VsYXJKUyB2MSBEaXJlY3RpdmUgRGVmaW5pdGlvbiBGYWN0b3J5IGZyb21cbiAgICogQW5ndWxhciB2MiBDb21wb25lbnQuIFRoZSBhZGFwdGVyIHdpbGwgYm9vdHN0cmFwIEFuZ3VsYXIgdjIgY29tcG9uZW50IGZyb20gd2l0aGluIHRoZVxuICAgKiBBbmd1bGFySlMgdjEgdGVtcGxhdGUuXG4gICAqXG4gICAqICMjIE1lbnRhbCBNb2RlbFxuICAgKlxuICAgKiAxLiBUaGUgY29tcG9uZW50IGlzIGluc3RhbnRpYXRlZCBieSBiZWluZyBsaXN0ZWQgaW4gQW5ndWxhckpTIHYxIHRlbXBsYXRlLiBUaGlzIG1lYW5zIHRoYXQgdGhlXG4gICAqICAgIGhvc3QgZWxlbWVudCBpcyBjb250cm9sbGVkIGJ5IEFuZ3VsYXJKUyB2MSwgYnV0IHRoZSBjb21wb25lbnQncyB2aWV3IHdpbGwgYmUgY29udHJvbGxlZCBieVxuICAgKiAgICBBbmd1bGFyIHYyLlxuICAgKiAyLiBFdmVuIHRob3VnaHQgdGhlIGNvbXBvbmVudCBpcyBpbnN0YW50aWF0ZWQgaW4gQW5ndWxhckpTIHYxLCBpdCB3aWxsIGJlIHVzaW5nIEFuZ3VsYXIgdjJcbiAgICogICAgc3ludGF4LiBUaGlzIGhhcyB0byBiZSBkb25lLCB0aGlzIHdheSBiZWNhdXNlIHdlIG11c3QgZm9sbG93IEFuZ3VsYXIgdjIgY29tcG9uZW50cyBkbyBub3RcbiAgICogICAgZGVjbGFyZSBob3cgdGhlIGF0dHJpYnV0ZXMgc2hvdWxkIGJlIGludGVycHJldGVkLlxuICAgKlxuICAgKiAjIyBTdXBwb3J0ZWQgRmVhdHVyZXNcbiAgICpcbiAgICogLSBCaW5kaW5nczpcbiAgICogICAtIEF0dHJpYnV0ZTogYDxjb21wIG5hbWU9XCJXb3JsZFwiPmBcbiAgICogICAtIEludGVycG9sYXRpb246ICBgPGNvbXAgZ3JlZXRpbmc9XCJIZWxsbyB7e25hbWV9fSFcIj5gXG4gICAqICAgLSBFeHByZXNzaW9uOiAgYDxjb21wIFtuYW1lXT1cInVzZXJuYW1lXCI+YFxuICAgKiAgIC0gRXZlbnQ6ICBgPGNvbXAgKGNsb3NlKT1cImRvU29tZXRoaW5nKClcIj5gXG4gICAqIC0gQ29udGVudCBwcm9qZWN0aW9uOiB5ZXNcbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgXG4gICAqIHZhciBhZGFwdGVyID0gbmV3IFVwZ3JhZGVBZGFwdGVyKCk7XG4gICAqIHZhciBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbXlFeGFtcGxlJywgW10pO1xuICAgKiBtb2R1bGUuZGlyZWN0aXZlKCdncmVldCcsIGFkYXB0ZXIuZG93bmdyYWRlTmcyQ29tcG9uZW50KEdyZWV0ZXIpKTtcbiAgICpcbiAgICogQENvbXBvbmVudCh7XG4gICAqICAgc2VsZWN0b3I6ICdncmVldCcsXG4gICAqICAgdGVtcGxhdGU6ICd7e3NhbHV0YXRpb259fSB7e25hbWV9fSEgLSA8bmctY29udGVudD48L25nLWNvbnRlbnQ+J1xuICAgKiB9KVxuICAgKiBjbGFzcyBHcmVldGVyIHtcbiAgICogICBASW5wdXQoKSBzYWx1dGF0aW9uOiBzdHJpbmc7XG4gICAqICAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuICAgKiB9XG4gICAqXG4gICAqIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID1cbiAgICogICAnbmcxIHRlbXBsYXRlOiA8Z3JlZXQgc2FsdXRhdGlvbj1cIkhlbGxvXCIgW25hbWVdPVwid29ybGRcIj50ZXh0PC9ncmVldD4nO1xuICAgKlxuICAgKiBhZGFwdGVyLmJvb3RzdHJhcChkb2N1bWVudC5ib2R5LCBbJ215RXhhbXBsZSddKS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICogICBleHBlY3QoZG9jdW1lbnQuYm9keS50ZXh0Q29udGVudCkudG9FcXVhbChcIm5nMSB0ZW1wbGF0ZTogSGVsbG8gd29ybGQhIC0gdGV4dFwiKTtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKi9cbiAgZG93bmdyYWRlTmcyQ29tcG9uZW50KHR5cGU6IFR5cGUpOiBGdW5jdGlvbiB7XG4gICAgdGhpcy51cGdyYWRlZENvbXBvbmVudHMucHVzaCh0eXBlKTtcbiAgICB2YXIgaW5mbzogQ29tcG9uZW50SW5mbyA9IGdldENvbXBvbmVudEluZm8odHlwZSk7XG4gICAgcmV0dXJuIG5nMUNvbXBvbmVudERpcmVjdGl2ZShpbmZvLCBgJHt0aGlzLmlkUHJlZml4fSR7aW5mby5zZWxlY3Rvcn1fY2ApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBBbmd1bGFySlMgdjEgQ29tcG9uZW50IHRvIGJlIHVzZWQgZnJvbSBBbmd1bGFyIHYyLlxuICAgKlxuICAgKiBVc2UgYHVwZ3JhZGVOZzFDb21wb25lbnRgIHRvIGNyZWF0ZSBhbiBBbmd1bGFyIHYyIGNvbXBvbmVudCBmcm9tIEFuZ3VsYXJKUyB2MSBDb21wb25lbnRcbiAgICogZGlyZWN0aXZlLiBUaGUgYWRhcHRlciB3aWxsIGJvb3RzdHJhcCBBbmd1bGFySlMgdjEgY29tcG9uZW50IGZyb20gd2l0aGluIHRoZSBBbmd1bGFyIHYyXG4gICAqIHRlbXBsYXRlLlxuICAgKlxuICAgKiAjIyBNZW50YWwgTW9kZWxcbiAgICpcbiAgICogMS4gVGhlIGNvbXBvbmVudCBpcyBpbnN0YW50aWF0ZWQgYnkgYmVpbmcgbGlzdGVkIGluIEFuZ3VsYXIgdjIgdGVtcGxhdGUuIFRoaXMgbWVhbnMgdGhhdCB0aGVcbiAgICogICAgaG9zdCBlbGVtZW50IGlzIGNvbnRyb2xsZWQgYnkgQW5ndWxhciB2MiwgYnV0IHRoZSBjb21wb25lbnQncyB2aWV3IHdpbGwgYmUgY29udHJvbGxlZCBieVxuICAgKiAgICBBbmd1bGFySlMgdjEuXG4gICAqXG4gICAqICMjIFN1cHBvcnRlZCBGZWF0dXJlc1xuICAgKlxuICAgKiAtIEJpbmRpbmdzOlxuICAgKiAgIC0gQXR0cmlidXRlOiBgPGNvbXAgbmFtZT1cIldvcmxkXCI+YFxuICAgKiAgIC0gSW50ZXJwb2xhdGlvbjogIGA8Y29tcCBncmVldGluZz1cIkhlbGxvIHt7bmFtZX19IVwiPmBcbiAgICogICAtIEV4cHJlc3Npb246ICBgPGNvbXAgW25hbWVdPVwidXNlcm5hbWVcIj5gXG4gICAqICAgLSBFdmVudDogIGA8Y29tcCAoY2xvc2UpPVwiZG9Tb21ldGhpbmcoKVwiPmBcbiAgICogLSBUcmFuc2NsdXNpb246IHllc1xuICAgKiAtIE9ubHkgc29tZSBvZiB0aGUgZmVhdHVyZXMgb2ZcbiAgICogICBbRGlyZWN0aXZlIERlZmluaXRpb24gT2JqZWN0XShodHRwczovL2RvY3MuYW5ndWxhcmpzLm9yZy9hcGkvbmcvc2VydmljZS8kY29tcGlsZSkgYXJlXG4gICAqICAgc3VwcG9ydGVkOlxuICAgKiAgIC0gYGNvbXBpbGVgOiBub3Qgc3VwcG9ydGVkIGJlY2F1c2UgdGhlIGhvc3QgZWxlbWVudCBpcyBvd25lZCBieSBBbmd1bGFyIHYyLCB3aGljaCBkb2VzXG4gICAqICAgICBub3QgYWxsb3cgbW9kaWZ5aW5nIERPTSBzdHJ1Y3R1cmUgZHVyaW5nIGNvbXBpbGF0aW9uLlxuICAgKiAgIC0gYGNvbnRyb2xsZXJgOiBzdXBwb3J0ZWQuIChOT1RFOiBpbmplY3Rpb24gb2YgYCRhdHRyc2AgYW5kIGAkdHJhbnNjbHVkZWAgaXMgbm90IHN1cHBvcnRlZC4pXG4gICAqICAgLSBgY29udHJvbGxlckFzJzogc3VwcG9ydGVkLlxuICAgKiAgIC0gYGJpbmRUb0NvbnRyb2xsZXInOiBzdXBwb3J0ZWQuXG4gICAqICAgLSBgbGluayc6IHN1cHBvcnRlZC4gKE5PVEU6IG9ubHkgcHJlLWxpbmsgZnVuY3Rpb24gaXMgc3VwcG9ydGVkLilcbiAgICogICAtIGBuYW1lJzogc3VwcG9ydGVkLlxuICAgKiAgIC0gYHByaW9yaXR5JzogaWdub3JlZC5cbiAgICogICAtIGByZXBsYWNlJzogbm90IHN1cHBvcnRlZC5cbiAgICogICAtIGByZXF1aXJlYDogc3VwcG9ydGVkLlxuICAgKiAgIC0gYHJlc3RyaWN0YDogbXVzdCBiZSBzZXQgdG8gJ0UnLlxuICAgKiAgIC0gYHNjb3BlYDogc3VwcG9ydGVkLlxuICAgKiAgIC0gYHRlbXBsYXRlYDogc3VwcG9ydGVkLlxuICAgKiAgIC0gYHRlbXBsYXRlVXJsYDogc3VwcG9ydGVkLlxuICAgKiAgIC0gYHRlcm1pbmFsYDogaWdub3JlZC5cbiAgICogICAtIGB0cmFuc2NsdWRlYDogc3VwcG9ydGVkLlxuICAgKlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiBgYGBcbiAgICogdmFyIGFkYXB0ZXIgPSBuZXcgVXBncmFkZUFkYXB0ZXIoKTtcbiAgICogdmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdteUV4YW1wbGUnLCBbXSk7XG4gICAqXG4gICAqIG1vZHVsZS5kaXJlY3RpdmUoJ2dyZWV0JywgZnVuY3Rpb24oKSB7XG4gICAqICAgcmV0dXJuIHtcbiAgICogICAgIHNjb3BlOiB7c2FsdXRhdGlvbjogJz0nLCBuYW1lOiAnPScgfSxcbiAgICogICAgIHRlbXBsYXRlOiAne3tzYWx1dGF0aW9ufX0ge3tuYW1lfX0hIC0gPHNwYW4gbmctdHJhbnNjbHVkZT48L3NwYW4+J1xuICAgKiAgIH07XG4gICAqIH0pO1xuICAgKlxuICAgKiBtb2R1bGUuZGlyZWN0aXZlKCduZzInLCBhZGFwdGVyLmRvd25ncmFkZU5nMkNvbXBvbmVudChOZzIpKTtcbiAgICpcbiAgICogQENvbXBvbmVudCh7XG4gICAqICAgc2VsZWN0b3I6ICduZzInLFxuICAgKiAgIHRlbXBsYXRlOiAnbmcyIHRlbXBsYXRlOiA8Z3JlZXQgc2FsdXRhdGlvbj1cIkhlbGxvXCIgW25hbWVdPVwid29ybGRcIj50ZXh0PC9ncmVldD4nXG4gICAqICAgZGlyZWN0aXZlczogW2FkYXB0ZXIudXBncmFkZU5nMUNvbXBvbmVudCgnZ3JlZXQnKV1cbiAgICogfSlcbiAgICogY2xhc3MgTmcyIHtcbiAgICogfVxuICAgKlxuICAgKiBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9ICc8bmcyPjwvbmcyPic7XG4gICAqXG4gICAqIGFkYXB0ZXIuYm9vdHN0cmFwKGRvY3VtZW50LmJvZHksIFsnbXlFeGFtcGxlJ10pLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgKiAgIGV4cGVjdChkb2N1bWVudC5ib2R5LnRleHRDb250ZW50KS50b0VxdWFsKFwibmcyIHRlbXBsYXRlOiBIZWxsbyB3b3JsZCEgLSB0ZXh0XCIpO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqL1xuICB1cGdyYWRlTmcxQ29tcG9uZW50KG5hbWU6IHN0cmluZyk6IFR5cGUge1xuICAgIGlmICgoPGFueT50aGlzLmRvd25ncmFkZWRDb21wb25lbnRzKS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZG93bmdyYWRlZENvbXBvbmVudHNbbmFtZV0udHlwZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICh0aGlzLmRvd25ncmFkZWRDb21wb25lbnRzW25hbWVdID0gbmV3IFVwZ3JhZGVOZzFDb21wb25lbnRBZGFwdGVyQnVpbGRlcihuYW1lKSkudHlwZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQm9vdHN0cmFwIGEgaHlicmlkIEFuZ3VsYXJKUyB2MSAvIEFuZ3VsYXIgdjIgYXBwbGljYXRpb24uXG4gICAqXG4gICAqIFRoaXMgYGJvb3RzdHJhcGAgbWV0aG9kIGlzIGEgZGlyZWN0IHJlcGxhY2VtZW50ICh0YWtlcyBzYW1lIGFyZ3VtZW50cykgZm9yIEFuZ3VsYXJKUyB2MVxuICAgKiBbYGJvb3RzdHJhcGBdKGh0dHBzOi8vZG9jcy5hbmd1bGFyanMub3JnL2FwaS9uZy9mdW5jdGlvbi9hbmd1bGFyLmJvb3RzdHJhcCkgbWV0aG9kLiBVbmxpa2VcbiAgICogQW5ndWxhckpTIHYxLCB0aGlzIGJvb3RzdHJhcCBpcyBhc3luY2hyb25vdXMuXG4gICAqXG4gICAqICMjIyBFeGFtcGxlXG4gICAqXG4gICAqIGBgYFxuICAgKiB2YXIgYWRhcHRlciA9IG5ldyBVcGdyYWRlQWRhcHRlcigpO1xuICAgKiB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ215RXhhbXBsZScsIFtdKTtcbiAgICogbW9kdWxlLmRpcmVjdGl2ZSgnbmcyJywgYWRhcHRlci5kb3duZ3JhZGVOZzJDb21wb25lbnQoTmcyKSk7XG4gICAqXG4gICAqIG1vZHVsZS5kaXJlY3RpdmUoJ25nMScsIGZ1bmN0aW9uKCkge1xuICAgKiAgIHJldHVybiB7XG4gICAqICAgICAgc2NvcGU6IHsgdGl0bGU6ICc9JyB9LFxuICAgKiAgICAgIHRlbXBsYXRlOiAnbmcxW0hlbGxvIHt7dGl0bGV9fSFdKDxzcGFuIG5nLXRyYW5zY2x1ZGU+PC9zcGFuPiknXG4gICAqICAgfTtcbiAgICogfSk7XG4gICAqXG4gICAqXG4gICAqIEBDb21wb25lbnQoe1xuICAgKiAgIHNlbGVjdG9yOiAnbmcyJyxcbiAgICogICBpbnB1dHM6IFsnbmFtZSddLFxuICAgKiAgIHRlbXBsYXRlOiAnbmcyWzxuZzEgW3RpdGxlXT1cIm5hbWVcIj50cmFuc2NsdWRlPC9uZzE+XSg8bmctY29udGVudD48L25nLWNvbnRlbnQ+KScsXG4gICAqICAgZGlyZWN0aXZlczogW2FkYXB0ZXIudXBncmFkZU5nMUNvbXBvbmVudCgnbmcxJyldXG4gICAqIH0pXG4gICAqIGNsYXNzIE5nMiB7XG4gICAqIH1cbiAgICpcbiAgICogZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnPG5nMiBuYW1lPVwiV29ybGRcIj5wcm9qZWN0PC9uZzI+JztcbiAgICpcbiAgICogYWRhcHRlci5ib290c3RyYXAoZG9jdW1lbnQuYm9keSwgWydteUV4YW1wbGUnXSkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAqICAgZXhwZWN0KGRvY3VtZW50LmJvZHkudGV4dENvbnRlbnQpLnRvRXF1YWwoXG4gICAqICAgICAgIFwibmcyW25nMVtIZWxsbyBXb3JsZCFdKHRyYW5zY2x1ZGUpXShwcm9qZWN0KVwiKTtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKi9cbiAgYm9vdHN0cmFwKGVsZW1lbnQ6IEVsZW1lbnQsIG1vZHVsZXM/OiBhbnlbXSxcbiAgICAgICAgICAgIGNvbmZpZz86IGFuZ3VsYXIuSUFuZ3VsYXJCb290c3RyYXBDb25maWcpOiBVcGdyYWRlQWRhcHRlclJlZiB7XG4gICAgdmFyIHVwZ3JhZGUgPSBuZXcgVXBncmFkZUFkYXB0ZXJSZWYoKTtcbiAgICB2YXIgbmcxSW5qZWN0b3I6IGFuZ3VsYXIuSUluamVjdG9yU2VydmljZSA9IG51bGw7XG4gICAgdmFyIHBsYXRmb3JtUmVmOiBQbGF0Zm9ybVJlZiA9IHBsYXRmb3JtKEJST1dTRVJfUFJPVklERVJTKTtcbiAgICB2YXIgYXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmID0gcGxhdGZvcm1SZWYuYXBwbGljYXRpb24oW1xuICAgICAgQlJPV1NFUl9BUFBfUFJPVklERVJTLFxuICAgICAgcHJvdmlkZShORzFfSU5KRUNUT1IsIHt1c2VGYWN0b3J5OiAoKSA9PiBuZzFJbmplY3Rvcn0pLFxuICAgICAgcHJvdmlkZShORzFfQ09NUElMRSwge3VzZUZhY3Rvcnk6ICgpID0+IG5nMUluamVjdG9yLmdldChORzFfQ09NUElMRSl9KSxcbiAgICAgIHRoaXMucHJvdmlkZXJzXG4gICAgXSk7XG4gICAgdmFyIGluamVjdG9yOiBJbmplY3RvciA9IGFwcGxpY2F0aW9uUmVmLmluamVjdG9yO1xuICAgIHZhciBuZ1pvbmU6IE5nWm9uZSA9IGluamVjdG9yLmdldChOZ1pvbmUpO1xuICAgIHZhciBjb21waWxlcjogQ29tcGlsZXIgPSBpbmplY3Rvci5nZXQoQ29tcGlsZXIpO1xuICAgIHZhciBkZWxheUFwcGx5RXhwczogRnVuY3Rpb25bXSA9IFtdO1xuICAgIHZhciBvcmlnaW5hbCRhcHBseUZuOiBGdW5jdGlvbjtcbiAgICB2YXIgcm9vdFNjb3BlUHJvdG90eXBlOiBhbnk7XG4gICAgdmFyIHJvb3RTY29wZTogYW5ndWxhci5JUm9vdFNjb3BlU2VydmljZTtcbiAgICB2YXIgaG9zdFZpZXdGYWN0b3J5UmVmTWFwOiBIb3N0Vmlld0ZhY3RvcnlSZWZNYXAgPSB7fTtcbiAgICB2YXIgbmcxTW9kdWxlID0gYW5ndWxhci5tb2R1bGUodGhpcy5pZFByZWZpeCwgbW9kdWxlcyk7XG4gICAgdmFyIG5nMUJvb3RzdHJhcFByb21pc2U6IFByb21pc2U8YW55PiA9IG51bGw7XG4gICAgdmFyIG5nMWNvbXBpbGVQcm9taXNlOiBQcm9taXNlPGFueT4gPSBudWxsO1xuICAgIG5nMU1vZHVsZS52YWx1ZShORzJfSU5KRUNUT1IsIGluamVjdG9yKVxuICAgICAgICAudmFsdWUoTkcyX1pPTkUsIG5nWm9uZSlcbiAgICAgICAgLnZhbHVlKE5HMl9DT01QSUxFUiwgY29tcGlsZXIpXG4gICAgICAgIC52YWx1ZShORzJfSE9TVF9WSUVXX0ZBQ1RPUllfUkVGX01BUCwgaG9zdFZpZXdGYWN0b3J5UmVmTWFwKVxuICAgICAgICAudmFsdWUoTkcyX0FQUF9WSUVXX01BTkFHRVIsIGluamVjdG9yLmdldChBcHBWaWV3TWFuYWdlcikpXG4gICAgICAgIC5jb25maWcoW1xuICAgICAgICAgICckcHJvdmlkZScsXG4gICAgICAgICAgKHByb3ZpZGUpID0+IHtcbiAgICAgICAgICAgIHByb3ZpZGUuZGVjb3JhdG9yKE5HMV9ST09UX1NDT1BFLCBbXG4gICAgICAgICAgICAgICckZGVsZWdhdGUnLFxuICAgICAgICAgICAgICBmdW5jdGlvbihyb290U2NvcGVEZWxlZ2F0ZTogYW5ndWxhci5JUm9vdFNjb3BlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHJvb3RTY29wZVByb3RvdHlwZSA9IHJvb3RTY29wZURlbGVnYXRlLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgICAgICAgICAgICAgICBpZiAocm9vdFNjb3BlUHJvdG90eXBlLmhhc093blByb3BlcnR5KCckYXBwbHknKSkge1xuICAgICAgICAgICAgICAgICAgb3JpZ2luYWwkYXBwbHlGbiA9IHJvb3RTY29wZVByb3RvdHlwZS4kYXBwbHk7XG4gICAgICAgICAgICAgICAgICByb290U2NvcGVQcm90b3R5cGUuJGFwcGx5ID0gKGV4cCkgPT4gZGVsYXlBcHBseUV4cHMucHVzaChleHApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZmluZCAnJGFwcGx5JyBvbiAnJHJvb3RTY29wZSchXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcm9vdFNjb3BlID0gcm9vdFNjb3BlRGVsZWdhdGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgcHJvdmlkZS5kZWNvcmF0b3IoTkcxX1RFU1RBQklMSVRZLCBbXG4gICAgICAgICAgICAgICckZGVsZWdhdGUnLFxuICAgICAgICAgICAgICBmdW5jdGlvbih0ZXN0YWJpbGl0eURlbGVnYXRlOiBhbmd1bGFyLklUZXN0YWJpbGl0eVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmcyVGVzdGFiaWxpdHk6IFRlc3RhYmlsaXR5ID0gaW5qZWN0b3IuZ2V0KFRlc3RhYmlsaXR5KTtcblxuICAgICAgICAgICAgICAgIHZhciBvcmlnb25hbFdoZW5TdGFibGU6IEZ1bmN0aW9uID0gdGVzdGFiaWxpdHlEZWxlZ2F0ZS53aGVuU3RhYmxlO1xuICAgICAgICAgICAgICAgIHZhciBuZXdXaGVuU3RhYmxlID0gKGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgdmFyIHdoZW5TdGFibGVDb250ZXh0OiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgb3JpZ29uYWxXaGVuU3RhYmxlLmNhbGwodGhpcywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZzJUZXN0YWJpbGl0eS5pc1N0YWJsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBuZzJUZXN0YWJpbGl0eS53aGVuU3RhYmxlKG5ld1doZW5TdGFibGUuYmluZCh3aGVuU3RhYmxlQ29udGV4dCwgY2FsbGJhY2spKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRlc3RhYmlsaXR5RGVsZWdhdGUud2hlblN0YWJsZSA9IG5ld1doZW5TdGFibGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlc3RhYmlsaXR5RGVsZWdhdGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG5cbiAgICBuZzFjb21waWxlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIG5nMU1vZHVsZS5ydW4oW1xuICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgJyRyb290U2NvcGUnLFxuICAgICAgICAoaW5qZWN0b3I6IGFuZ3VsYXIuSUluamVjdG9yU2VydmljZSwgcm9vdFNjb3BlOiBhbmd1bGFyLklSb290U2NvcGVTZXJ2aWNlKSA9PiB7XG4gICAgICAgICAgbmcxSW5qZWN0b3IgPSBpbmplY3RvcjtcbiAgICAgICAgICBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUobmdab25lLm9uTWljcm90YXNrRW1wdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChfKSA9PiBuZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gcm9vdFNjb3BlLiRhcHBseSgpKSk7XG4gICAgICAgICAgVXBncmFkZU5nMUNvbXBvbmVudEFkYXB0ZXJCdWlsZGVyLnJlc29sdmUodGhpcy5kb3duZ3JhZGVkQ29tcG9uZW50cywgaW5qZWN0b3IpXG4gICAgICAgICAgICAgIC50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgLy8gTWFrZSBzdXJlIHJlc3VtZUJvb3RzdHJhcCgpIG9ubHkgZXhpc3RzIGlmIHRoZSBjdXJyZW50IGJvb3RzdHJhcCBpcyBkZWZlcnJlZFxuICAgIHZhciB3aW5kb3dBbmd1bGFyID0gKDxhbnk+Z2xvYmFsKS5hbmd1bGFyO1xuICAgIHdpbmRvd0FuZ3VsYXIucmVzdW1lQm9vdHN0cmFwID0gdW5kZWZpbmVkO1xuXG4gICAgYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLmRhdGEoY29udHJvbGxlcktleShORzJfSU5KRUNUT1IpLCBpbmplY3Rvcik7XG4gICAgbmdab25lLnJ1bigoKSA9PiB7IGFuZ3VsYXIuYm9vdHN0cmFwKGVsZW1lbnQsIFt0aGlzLmlkUHJlZml4XSwgY29uZmlnKTsgfSk7XG4gICAgbmcxQm9vdHN0cmFwUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh3aW5kb3dBbmd1bGFyLnJlc3VtZUJvb3RzdHJhcCkge1xuICAgICAgICB2YXIgb3JpZ2luYWxSZXN1bWVCb290c3RyYXA6ICgpID0+IHZvaWQgPSB3aW5kb3dBbmd1bGFyLnJlc3VtZUJvb3RzdHJhcDtcbiAgICAgICAgd2luZG93QW5ndWxhci5yZXN1bWVCb290c3RyYXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB3aW5kb3dBbmd1bGFyLnJlc3VtZUJvb3RzdHJhcCA9IG9yaWdpbmFsUmVzdW1lQm9vdHN0cmFwO1xuICAgICAgICAgIHdpbmRvd0FuZ3VsYXIucmVzdW1lQm9vdHN0cmFwLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgIHRoaXMuY29tcGlsZU5nMkNvbXBvbmVudHMoY29tcGlsZXIsIGhvc3RWaWV3RmFjdG9yeVJlZk1hcCksXG4gICAgICAgICAgICAgbmcxQm9vdHN0cmFwUHJvbWlzZSxcbiAgICAgICAgICAgICBuZzFjb21waWxlUHJvbWlzZVxuICAgICAgICAgICBdKVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICBpZiAocm9vdFNjb3BlUHJvdG90eXBlKSB7XG4gICAgICAgICAgICAgIHJvb3RTY29wZVByb3RvdHlwZS4kYXBwbHkgPSBvcmlnaW5hbCRhcHBseUZuOyAgLy8gcmVzdG9yZSBvcmlnaW5hbCAkYXBwbHlcbiAgICAgICAgICAgICAgd2hpbGUgKGRlbGF5QXBwbHlFeHBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJvb3RTY29wZS4kYXBwbHkoZGVsYXlBcHBseUV4cHMuc2hpZnQoKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKDxhbnk+dXBncmFkZSkuX2Jvb3RzdHJhcERvbmUoYXBwbGljYXRpb25SZWYsIG5nMUluamVjdG9yKTtcbiAgICAgICAgICAgICAgcm9vdFNjb3BlUHJvdG90eXBlID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgb25FcnJvcik7XG4gICAgcmV0dXJuIHVwZ3JhZGU7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHByb3ZpZGVyIHRvIHRoZSB0b3AgbGV2ZWwgZW52aXJvbm1lbnQgb2YgYSBoeWJyaWQgQW5ndWxhckpTIHYxIC8gQW5ndWxhciB2MiBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogSW4gaHlicmlkIEFuZ3VsYXJKUyB2MSAvIEFuZ3VsYXIgdjIgYXBwbGljYXRpb24sIHRoZXJlIGlzIG5vIG9uZSByb290IEFuZ3VsYXIgdjIgY29tcG9uZW50LFxuICAgKiBmb3IgdGhpcyByZWFzb24gd2UgcHJvdmlkZSBhbiBhcHBsaWNhdGlvbiBnbG9iYWwgd2F5IG9mIHJlZ2lzdGVyaW5nIHByb3ZpZGVycyB3aGljaCBpc1xuICAgKiBjb25zaXN0ZW50IHdpdGggc2luZ2xlIGdsb2JhbCBpbmplY3Rpb24gaW4gQW5ndWxhckpTIHYxLlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiBgYGBcbiAgICogY2xhc3MgR3JlZXRlciB7XG4gICAqICAgZ3JlZXQobmFtZSkge1xuICAgKiAgICAgYWxlcnQoJ0hlbGxvICcgKyBuYW1lICsgJyEnKTtcbiAgICogICB9XG4gICAqIH1cbiAgICpcbiAgICogQENvbXBvbmVudCh7XG4gICAqICAgc2VsZWN0b3I6ICdhcHAnLFxuICAgKiAgIHRlbXBsYXRlOiAnJ1xuICAgKiB9KVxuICAgKiBjbGFzcyBBcHAge1xuICAgKiAgIGNvbnN0cnVjdG9yKGdyZWV0ZXI6IEdyZWV0ZXIpIHtcbiAgICogICAgIHRoaXMuZ3JlZXRlcignV29ybGQnKTtcbiAgICogICB9XG4gICAqIH1cbiAgICpcbiAgICogdmFyIGFkYXB0ZXIgPSBuZXcgVXBncmFkZUFkYXB0ZXIoKTtcbiAgICogYWRhcHRlci5hZGRQcm92aWRlcihHcmVldGVyKTtcbiAgICpcbiAgICogdmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdteUV4YW1wbGUnLCBbXSk7XG4gICAqIG1vZHVsZS5kaXJlY3RpdmUoJ2FwcCcsIGFkYXB0ZXIuZG93bmdyYWRlTmcyQ29tcG9uZW50KEFwcCkpO1xuICAgKlxuICAgKiBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9ICc8YXBwPjwvYXBwPidcbiAgICogYWRhcHRlci5ib290c3RyYXAoZG9jdW1lbnQuYm9keSwgWydteUV4YW1wbGUnXSk7XG4gICAqYGBgXG4gICAqL1xuICBwdWJsaWMgYWRkUHJvdmlkZXIocHJvdmlkZXI6IFR5cGUgfCBQcm92aWRlciB8IGFueVtdKTogdm9pZCB7IHRoaXMucHJvdmlkZXJzLnB1c2gocHJvdmlkZXIpOyB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBBbmd1bGFySlMgdjEgc2VydmljZSB0byBiZSBhY2Nlc3NpYmxlIGZyb20gQW5ndWxhciB2Mi5cbiAgICpcbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgXG4gICAqIGNsYXNzIExvZ2luIHsgLi4uIH1cbiAgICogY2xhc3MgU2VydmVyIHsgLi4uIH1cbiAgICpcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBFeGFtcGxlIHtcbiAgICogICBjb25zdHJ1Y3RvcihASW5qZWN0KCdzZXJ2ZXInKSBzZXJ2ZXIsIGxvZ2luOiBMb2dpbikge1xuICAgKiAgICAgLi4uXG4gICAqICAgfVxuICAgKiB9XG4gICAqXG4gICAqIHZhciBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbXlFeGFtcGxlJywgW10pO1xuICAgKiBtb2R1bGUuc2VydmljZSgnc2VydmVyJywgU2VydmVyKTtcbiAgICogbW9kdWxlLnNlcnZpY2UoJ2xvZ2luJywgTG9naW4pO1xuICAgKlxuICAgKiB2YXIgYWRhcHRlciA9IG5ldyBVcGdyYWRlQWRhcHRlcigpO1xuICAgKiBhZGFwdGVyLnVwZ3JhZGVOZzFQcm92aWRlcignc2VydmVyJyk7XG4gICAqIGFkYXB0ZXIudXBncmFkZU5nMVByb3ZpZGVyKCdsb2dpbicsIHthc1Rva2VuOiBMb2dpbn0pO1xuICAgKiBhZGFwdGVyLmFkZFByb3ZpZGVyKEV4YW1wbGUpO1xuICAgKlxuICAgKiBhZGFwdGVyLmJvb3RzdHJhcChkb2N1bWVudC5ib2R5LCBbJ215RXhhbXBsZSddKS5yZWFkeSgocmVmKSA9PiB7XG4gICAqICAgdmFyIGV4YW1wbGU6IEV4YW1wbGUgPSByZWYubmcySW5qZWN0b3IuZ2V0KEV4YW1wbGUpO1xuICAgKiB9KTtcbiAgICpcbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgdXBncmFkZU5nMVByb3ZpZGVyKG5hbWU6IHN0cmluZywgb3B0aW9ucz86IHthc1Rva2VuOiBhbnl9KSB7XG4gICAgdmFyIHRva2VuID0gb3B0aW9ucyAmJiBvcHRpb25zLmFzVG9rZW4gfHwgbmFtZTtcbiAgICB0aGlzLnByb3ZpZGVycy5wdXNoKHByb3ZpZGUodG9rZW4sIHtcbiAgICAgIHVzZUZhY3Rvcnk6IChuZzFJbmplY3RvcjogYW5ndWxhci5JSW5qZWN0b3JTZXJ2aWNlKSA9PiBuZzFJbmplY3Rvci5nZXQobmFtZSksXG4gICAgICBkZXBzOiBbTkcxX0lOSkVDVE9SXVxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgQW5ndWxhciB2MiBzZXJ2aWNlIHRvIGJlIGFjY2Vzc2libGUgZnJvbSBBbmd1bGFySlMgdjEuXG4gICAqXG4gICAqXG4gICAqICMjIyBFeGFtcGxlXG4gICAqXG4gICAqIGBgYFxuICAgKiBjbGFzcyBFeGFtcGxlIHtcbiAgICogfVxuICAgKlxuICAgKiB2YXIgYWRhcHRlciA9IG5ldyBVcGdyYWRlQWRhcHRlcigpO1xuICAgKiBhZGFwdGVyLmFkZFByb3ZpZGVyKEV4YW1wbGUpO1xuICAgKlxuICAgKiB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ215RXhhbXBsZScsIFtdKTtcbiAgICogbW9kdWxlLmZhY3RvcnkoJ2V4YW1wbGUnLCBhZGFwdGVyLmRvd25ncmFkZU5nMlByb3ZpZGVyKEV4YW1wbGUpKTtcbiAgICpcbiAgICogYWRhcHRlci5ib290c3RyYXAoZG9jdW1lbnQuYm9keSwgWydteUV4YW1wbGUnXSkucmVhZHkoKHJlZikgPT4ge1xuICAgKiAgIHZhciBleGFtcGxlOiBFeGFtcGxlID0gcmVmLm5nMUluamVjdG9yLmdldCgnZXhhbXBsZScpO1xuICAgKiB9KTtcbiAgICpcbiAgICogYGBgXG4gICAqL1xuICBwdWJsaWMgZG93bmdyYWRlTmcyUHJvdmlkZXIodG9rZW46IGFueSk6IEZ1bmN0aW9uIHtcbiAgICB2YXIgZmFjdG9yeSA9IGZ1bmN0aW9uKGluamVjdG9yOiBJbmplY3RvcikgeyByZXR1cm4gaW5qZWN0b3IuZ2V0KHRva2VuKTsgfTtcbiAgICAoPGFueT5mYWN0b3J5KS4kaW5qZWN0ID0gW05HMl9JTkpFQ1RPUl07XG4gICAgcmV0dXJuIGZhY3Rvcnk7XG4gIH1cblxuICAvKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBjb21waWxlTmcyQ29tcG9uZW50cyhjb21waWxlcjogQ29tcGlsZXIsIGhvc3RWaWV3RmFjdG9yeVJlZk1hcDogSG9zdFZpZXdGYWN0b3J5UmVmTWFwKTpcbiAgICAgIFByb21pc2U8SG9zdFZpZXdGYWN0b3J5UmVmTWFwPiB7XG4gICAgdmFyIHByb21pc2VzOiBBcnJheTxQcm9taXNlPEhvc3RWaWV3RmFjdG9yeVJlZj4+ID0gW107XG4gICAgdmFyIHR5cGVzID0gdGhpcy51cGdyYWRlZENvbXBvbmVudHM7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgcHJvbWlzZXMucHVzaChjb21waWxlci5jb21waWxlSW5Ib3N0KHR5cGVzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoaG9zdFZpZXdGYWN0b3JpZXM6IEFycmF5PEhvc3RWaWV3RmFjdG9yeVJlZj4pID0+IHtcbiAgICAgIHZhciB0eXBlcyA9IHRoaXMudXBncmFkZWRDb21wb25lbnRzO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBob3N0Vmlld0ZhY3Rvcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBob3N0Vmlld0ZhY3RvcnlSZWZNYXBbZ2V0Q29tcG9uZW50SW5mbyh0eXBlc1tpXSkuc2VsZWN0b3JdID0gaG9zdFZpZXdGYWN0b3JpZXNbaV07XG4gICAgICB9XG4gICAgICByZXR1cm4gaG9zdFZpZXdGYWN0b3J5UmVmTWFwO1xuICAgIH0sIG9uRXJyb3IpO1xuICB9XG59XG5cbmludGVyZmFjZSBIb3N0Vmlld0ZhY3RvcnlSZWZNYXAge1xuICBbc2VsZWN0b3I6IHN0cmluZ106IEhvc3RWaWV3RmFjdG9yeVJlZjtcbn1cblxuZnVuY3Rpb24gbmcxQ29tcG9uZW50RGlyZWN0aXZlKGluZm86IENvbXBvbmVudEluZm8sIGlkUHJlZml4OiBzdHJpbmcpOiBGdW5jdGlvbiB7XG4gICg8YW55PmRpcmVjdGl2ZUZhY3RvcnkpLiRpbmplY3QgPVxuICAgICAgW05HMl9IT1NUX1ZJRVdfRkFDVE9SWV9SRUZfTUFQLCBORzJfQVBQX1ZJRVdfTUFOQUdFUiwgTkcxX1BBUlNFXTtcbiAgZnVuY3Rpb24gZGlyZWN0aXZlRmFjdG9yeShob3N0Vmlld0ZhY3RvcnlSZWZNYXA6IEhvc3RWaWV3RmFjdG9yeVJlZk1hcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3TWFuYWdlcjogQXBwVmlld01hbmFnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2U6IGFuZ3VsYXIuSVBhcnNlU2VydmljZSk6IGFuZ3VsYXIuSURpcmVjdGl2ZSB7XG4gICAgdmFyIGhvc3RWaWV3RmFjdG9yeTogSG9zdFZpZXdGYWN0b3J5UmVmID0gaG9zdFZpZXdGYWN0b3J5UmVmTWFwW2luZm8uc2VsZWN0b3JdO1xuICAgIGlmICghaG9zdFZpZXdGYWN0b3J5KSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGluZyBIb3N0Vmlld0ZhY3RvcnlSZWYgZm9yOiAnICsgaW5mby5zZWxlY3Rvcik7XG4gICAgdmFyIGlkQ291bnQgPSAwO1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgcmVxdWlyZTogUkVRVUlSRV9JTkpFQ1RPUixcbiAgICAgIGxpbms6IHtcbiAgICAgICAgcG9zdDogKHNjb3BlOiBhbmd1bGFyLklTY29wZSwgZWxlbWVudDogYW5ndWxhci5JQXVnbWVudGVkSlF1ZXJ5LCBhdHRyczogYW5ndWxhci5JQXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgIHBhcmVudEluamVjdG9yOiBhbnksIHRyYW5zY2x1ZGU6IGFuZ3VsYXIuSVRyYW5zY2x1ZGVGdW5jdGlvbik6IHZvaWQgPT4ge1xuICAgICAgICAgIHZhciBkb21FbGVtZW50ID0gPGFueT5lbGVtZW50WzBdO1xuICAgICAgICAgIHZhciBmYWNhZGUgPSBuZXcgRG93bmdyYWRlTmcyQ29tcG9uZW50QWRhcHRlcihpZFByZWZpeCArIChpZENvdW50KyspLCBpbmZvLCBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycywgc2NvcGUsIDxJbmplY3Rvcj5wYXJlbnRJbmplY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2UsIHZpZXdNYW5hZ2VyLCBob3N0Vmlld0ZhY3RvcnkpO1xuICAgICAgICAgIGZhY2FkZS5zZXR1cElucHV0cygpO1xuICAgICAgICAgIGZhY2FkZS5ib290c3RyYXBOZzIoKTtcbiAgICAgICAgICBmYWNhZGUucHJvamVjdENvbnRlbnQoKTtcbiAgICAgICAgICBmYWNhZGUuc2V0dXBPdXRwdXRzKCk7XG4gICAgICAgICAgZmFjYWRlLnJlZ2lzdGVyQ2xlYW51cCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZGlyZWN0aXZlRmFjdG9yeTtcbn1cblxuLyoqXG4gKiBVc2UgYFVncmFkZUFkYXB0ZXJSZWZgIHRvIGNvbnRyb2wgYSBoeWJyaWQgQW5ndWxhckpTIHYxIC8gQW5ndWxhciB2MiBhcHBsaWNhdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIFVwZ3JhZGVBZGFwdGVyUmVmIHtcbiAgLyogQGludGVybmFsICovXG4gIHByaXZhdGUgX3JlYWR5Rm46ICh1cGdyYWRlQWRhcHRlclJlZj86IFVwZ3JhZGVBZGFwdGVyUmVmKSA9PiB2b2lkID0gbnVsbDtcblxuICBwdWJsaWMgbmcxUm9vdFNjb3BlOiBhbmd1bGFyLklSb290U2NvcGVTZXJ2aWNlID0gbnVsbDtcbiAgcHVibGljIG5nMUluamVjdG9yOiBhbmd1bGFyLklJbmplY3RvclNlcnZpY2UgPSBudWxsO1xuICBwdWJsaWMgbmcyQXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmID0gbnVsbDtcbiAgcHVibGljIG5nMkluamVjdG9yOiBJbmplY3RvciA9IG51bGw7XG5cbiAgLyogQGludGVybmFsICovXG4gIHByaXZhdGUgX2Jvb3RzdHJhcERvbmUoYXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmLCBuZzFJbmplY3RvcjogYW5ndWxhci5JSW5qZWN0b3JTZXJ2aWNlKSB7XG4gICAgdGhpcy5uZzJBcHBsaWNhdGlvblJlZiA9IGFwcGxpY2F0aW9uUmVmO1xuICAgIHRoaXMubmcySW5qZWN0b3IgPSBhcHBsaWNhdGlvblJlZi5pbmplY3RvcjtcbiAgICB0aGlzLm5nMUluamVjdG9yID0gbmcxSW5qZWN0b3I7XG4gICAgdGhpcy5uZzFSb290U2NvcGUgPSBuZzFJbmplY3Rvci5nZXQoTkcxX1JPT1RfU0NPUEUpO1xuICAgIHRoaXMuX3JlYWR5Rm4gJiYgdGhpcy5fcmVhZHlGbih0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGNhbGxiYWNrIGZ1bmN0aW9uIHdoaWNoIGlzIG5vdGlmaWVkIHVwb24gc3VjY2Vzc2Z1bCBoeWJyaWQgQW5ndWxhckpTIHYxIC8gQW5ndWxhciB2MlxuICAgKiBhcHBsaWNhdGlvbiBoYXMgYmVlbiBib290c3RyYXBwZWQuXG4gICAqXG4gICAqIFRoZSBgcmVhZHlgIGNhbGxiYWNrIGZ1bmN0aW9uIGlzIGludm9rZWQgaW5zaWRlIHRoZSBBbmd1bGFyIHYyIHpvbmUsIHRoZXJlZm9yZSBpdCBkb2VzIG5vdFxuICAgKiByZXF1aXJlIGEgY2FsbCB0byBgJGFwcGx5KClgLlxuICAgKi9cbiAgcHVibGljIHJlYWR5KGZuOiAodXBncmFkZUFkYXB0ZXJSZWY/OiBVcGdyYWRlQWRhcHRlclJlZikgPT4gdm9pZCkgeyB0aGlzLl9yZWFkeUZuID0gZm47IH1cblxuICAvKipcbiAgICogRGlzcG9zZSBvZiBydW5uaW5nIGh5YnJpZCBBbmd1bGFySlMgdjEgLyBBbmd1bGFyIHYyIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgcHVibGljIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5uZzFJbmplY3Rvci5nZXQoTkcxX1JPT1RfU0NPUEUpLiRkZXN0cm95KCk7XG4gICAgdGhpcy5uZzJBcHBsaWNhdGlvblJlZi5kaXNwb3NlKCk7XG4gIH1cbn1cbiJdfQ==