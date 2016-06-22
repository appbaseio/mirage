import { ComponentRef, PlatformRef } from '@angular/core';
import { Type } from './facade/lang';
export { ELEMENT_PROBE_PROVIDERS } from './dom/debug/ng_probe';
export { BrowserPlatformLocation } from './browser/location/browser_platform_location';
export { BROWSER_PROVIDERS, By, Title, enableDebugTools, disableDebugTools } from './browser_common';
/**
 * An array of providers that should be passed into `application()` when bootstrapping a component
 * when all templates
 * have been precompiled offline.
 */
export declare const BROWSER_APP_STATIC_PROVIDERS: Array<any>;
export declare function browserStaticPlatform(): PlatformRef;
/**
 * See {@link bootstrap} for more information.
 */
export declare function bootstrapStatic(appComponentType: Type, customProviders?: Array<any>, initReflector?: Function): Promise<ComponentRef<any>>;
