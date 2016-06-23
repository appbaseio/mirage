"use strict";
var router_providers_common_1 = require('./router_providers_common');
var platform_browser_1 = require('@angular/platform-browser');
var common_1 = require('@angular/common');
/**
 * A list of {@link Provider}s. To use the router, you must add this to your application.
 *
 * ### Example ([live demo](http://plnkr.co/edit/iRUP8B5OUbxCWQ3AcIDm))
 *
 * ```
 * import {Component} from '@angular/core';
 * import {
 *   ROUTER_DIRECTIVES,
 *   ROUTER_PROVIDERS,
 *   RouteConfig
 * } from '@angular/router-deprecated';
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
exports.ROUTER_PROVIDERS = [
    router_providers_common_1.ROUTER_PROVIDERS_COMMON,
    /*@ts2dart_const*/ (
    /* @ts2dart_Provider */ { provide: common_1.PlatformLocation, useClass: platform_browser_1.BrowserPlatformLocation }),
];
/**
 * Use {@link ROUTER_PROVIDERS} instead.
 *
 * @deprecated
 */
exports.ROUTER_BINDINGS = exports.ROUTER_PROVIDERS;
//# sourceMappingURL=router_providers.js.map