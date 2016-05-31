import { SpyLocation } from '@angular/common/testing';
import { Location } from '@angular/common';
import { Router, RouterOutletMap } from '../src/router';
import { RouterUrlSerializer, DefaultRouterUrlSerializer } from '../src/router_url_serializer';
import { Component, ComponentResolver } from '@angular/core';
class FakeAppRootCmp {
}
FakeAppRootCmp.decorators = [
    { type: Component, args: [{ selector: 'fake-app-root-comp', template: `<span></span>` },] },
];
function routerFactory(componentResolver, urlSerializer, routerOutletMap, location) {
    return new Router(null, FakeAppRootCmp, componentResolver, urlSerializer, routerOutletMap, location);
}
export const ROUTER_FAKE_PROVIDERS = [
    RouterOutletMap,
    /* @ts2dart_Provider */ { provide: Location, useClass: SpyLocation },
    /* @ts2dart_Provider */ { provide: RouterUrlSerializer, useClass: DefaultRouterUrlSerializer },
    /* @ts2dart_Provider */ {
        provide: Router,
        useFactory: routerFactory,
        deps: /*@ts2dart_const*/ [ComponentResolver, RouterUrlSerializer, RouterOutletMap, Location]
    },
];
//# sourceMappingURL=router_testing_providers.js.map