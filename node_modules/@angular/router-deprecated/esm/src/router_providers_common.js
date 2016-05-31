import { ApplicationRef } from '@angular/core';
import { LocationStrategy, PathLocationStrategy, Location } from '@angular/common';
import { Router, RootRouter } from './router';
import { RouteRegistry, ROUTER_PRIMARY_COMPONENT } from './route_registry';
import { BaseException } from '../src/facade/exceptions';
/**
 * The Platform agnostic ROUTER PROVIDERS
 */
export const ROUTER_PROVIDERS_COMMON = [
    RouteRegistry,
    /* @ts2dart_Provider */ { provide: LocationStrategy, useClass: PathLocationStrategy },
    Location,
    {
        provide: Router,
        useFactory: routerFactory,
        deps: [RouteRegistry, Location, ROUTER_PRIMARY_COMPONENT, ApplicationRef]
    },
    {
        provide: ROUTER_PRIMARY_COMPONENT,
        useFactory: routerPrimaryComponentFactory,
        deps: /*@ts2dart_const*/ ([ApplicationRef])
    }
];
function routerFactory(registry, location, primaryComponent, appRef) {
    var rootRouter = new RootRouter(registry, location, primaryComponent);
    appRef.registerDisposeListener(() => rootRouter.dispose());
    return rootRouter;
}
function routerPrimaryComponentFactory(app) {
    if (app.componentTypes.length == 0) {
        throw new BaseException("Bootstrap at least one component before injecting Router.");
    }
    return app.componentTypes[0];
}
//# sourceMappingURL=router_providers_common.js.map