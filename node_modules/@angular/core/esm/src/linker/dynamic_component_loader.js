import { ComponentResolver } from './component_resolver';
import { isPresent } from '../../src/facade/lang';
import { ReflectiveInjector } from '../di/reflective_injector';
import { Injectable } from '../di/decorators';
/**
 * Use ComponentResolver and ViewContainerRef directly.
 *
 * @deprecated
 */
export class DynamicComponentLoader {
}
export class DynamicComponentLoader_ extends DynamicComponentLoader {
    constructor(_compiler) {
        super();
        this._compiler = _compiler;
    }
    loadAsRoot(type, overrideSelectorOrNode, injector, onDispose, projectableNodes) {
        return this._compiler.resolveComponent(type).then(componentFactory => {
            var componentRef = componentFactory.create(injector, projectableNodes, isPresent(overrideSelectorOrNode) ? overrideSelectorOrNode : componentFactory.selector);
            if (isPresent(onDispose)) {
                componentRef.onDestroy(onDispose);
            }
            return componentRef;
        });
    }
    loadNextToLocation(type, location, providers = null, projectableNodes = null) {
        return this._compiler.resolveComponent(type).then(componentFactory => {
            var contextInjector = location.parentInjector;
            var childInjector = isPresent(providers) && providers.length > 0 ?
                ReflectiveInjector.fromResolvedProviders(providers, contextInjector) :
                contextInjector;
            return location.createComponent(componentFactory, location.length, childInjector, projectableNodes);
        });
    }
}
DynamicComponentLoader_.decorators = [
    { type: Injectable },
];
DynamicComponentLoader_.ctorParameters = [
    { type: ComponentResolver, },
];
//# sourceMappingURL=dynamic_component_loader.js.map