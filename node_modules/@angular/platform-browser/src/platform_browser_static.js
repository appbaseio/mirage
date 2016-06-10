"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('./facade/lang');
var browser_common_1 = require('./browser_common');
var ng_probe_1 = require('./dom/debug/ng_probe');
exports.ELEMENT_PROBE_PROVIDERS = ng_probe_1.ELEMENT_PROBE_PROVIDERS;
var browser_platform_location_1 = require('./browser/location/browser_platform_location');
exports.BrowserPlatformLocation = browser_platform_location_1.BrowserPlatformLocation;
var browser_common_2 = require('./browser_common');
exports.BROWSER_PROVIDERS = browser_common_2.BROWSER_PROVIDERS;
exports.By = browser_common_2.By;
exports.Title = browser_common_2.Title;
exports.enableDebugTools = browser_common_2.enableDebugTools;
exports.disableDebugTools = browser_common_2.disableDebugTools;
/**
 * An array of providers that should be passed into `application()` when bootstrapping a component
 * when all templates
 * have been precompiled offline.
 */
exports.BROWSER_APP_STATIC_PROVIDERS = 
/*@ts2dart_const*/ browser_common_1.BROWSER_APP_COMMON_PROVIDERS;
function browserStaticPlatform() {
    if (lang_1.isBlank(core_1.getPlatform())) {
        core_1.createPlatform(core_1.ReflectiveInjector.resolveAndCreate(browser_common_1.BROWSER_PROVIDERS));
    }
    return core_1.assertPlatform(browser_common_1.BROWSER_PLATFORM_MARKER);
}
exports.browserStaticPlatform = browserStaticPlatform;
/**
 * See {@link bootstrap} for more information.
 */
function bootstrapStatic(appComponentType, customProviders, initReflector) {
    if (lang_1.isPresent(initReflector)) {
        initReflector();
    }
    var appProviders = lang_1.isPresent(customProviders) ? [exports.BROWSER_APP_STATIC_PROVIDERS, customProviders] :
        exports.BROWSER_APP_STATIC_PROVIDERS;
    var appInjector = core_1.ReflectiveInjector.resolveAndCreate(appProviders, browserStaticPlatform().injector);
    return core_1.coreLoadAndBootstrap(appInjector, appComponentType);
}
exports.bootstrapStatic = bootstrapStatic;
//# sourceMappingURL=platform_browser_static.js.map