"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var component_resolver_1 = require('./component_resolver');
var lang_1 = require('../../src/facade/lang');
var reflective_injector_1 = require('../di/reflective_injector');
var decorators_1 = require('../di/decorators');
/**
 * Use ComponentResolver and ViewContainerRef directly.
 *
 * @deprecated
 */
var DynamicComponentLoader = (function () {
    function DynamicComponentLoader() {
    }
    return DynamicComponentLoader;
}());
exports.DynamicComponentLoader = DynamicComponentLoader;
var DynamicComponentLoader_ = (function (_super) {
    __extends(DynamicComponentLoader_, _super);
    function DynamicComponentLoader_(_compiler) {
        _super.call(this);
        this._compiler = _compiler;
    }
    DynamicComponentLoader_.prototype.loadAsRoot = function (type, overrideSelectorOrNode, injector, onDispose, projectableNodes) {
        return this._compiler.resolveComponent(type).then(function (componentFactory) {
            var componentRef = componentFactory.create(injector, projectableNodes, lang_1.isPresent(overrideSelectorOrNode) ? overrideSelectorOrNode : componentFactory.selector);
            if (lang_1.isPresent(onDispose)) {
                componentRef.onDestroy(onDispose);
            }
            return componentRef;
        });
    };
    DynamicComponentLoader_.prototype.loadNextToLocation = function (type, location, providers, projectableNodes) {
        if (providers === void 0) { providers = null; }
        if (projectableNodes === void 0) { projectableNodes = null; }
        return this._compiler.resolveComponent(type).then(function (componentFactory) {
            var contextInjector = location.parentInjector;
            var childInjector = lang_1.isPresent(providers) && providers.length > 0 ?
                reflective_injector_1.ReflectiveInjector.fromResolvedProviders(providers, contextInjector) :
                contextInjector;
            return location.createComponent(componentFactory, location.length, childInjector, projectableNodes);
        });
    };
    DynamicComponentLoader_.decorators = [
        { type: decorators_1.Injectable },
    ];
    DynamicComponentLoader_.ctorParameters = [
        { type: component_resolver_1.ComponentResolver, },
    ];
    return DynamicComponentLoader_;
}(DynamicComponentLoader));
exports.DynamicComponentLoader_ = DynamicComponentLoader_;
//# sourceMappingURL=dynamic_component_loader.js.map