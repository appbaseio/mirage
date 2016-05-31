import { OpaqueToken } from '@angular/core';
export { Title } from './browser/title';
export { BrowserDomAdapter } from './browser/browser_adapter';
export { enableDebugTools, disableDebugTools } from './browser/tools/tools';
export { By } from './dom/debug/by';
export declare const BROWSER_PLATFORM_MARKER: OpaqueToken;
/**
 * A set of providers to initialize the Angular platform in a web browser.
 *
 * Used automatically by `bootstrap`, or can be passed to {@link platform}.
 */
export declare const BROWSER_PROVIDERS: Array<any>;
export declare const BROWSER_SANITIZATION_PROVIDERS: Array<any>;
/**
 * A set of providers to initialize an Angular application in a web browser.
 *
 * Used automatically by `bootstrap`, or can be passed to {@link PlatformRef.application}.
 */
export declare const BROWSER_APP_COMMON_PROVIDERS: Array<any>;
export { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '../src/dom/events/hammer_gestures';
export declare function initDomAdapter(): void;
