'use strict';"use strict";
var router_providers_common_1 = require('./router_providers_common');
var core_1 = require('angular2/core');
var lang_1 = require('angular2/src/facade/lang');
var browser_platform_location_1 = require('./location/browser_platform_location');
var platform_location_1 = require('./location/platform_location');
/**
 * A list of {@link Provider}s. To use the router, you must add this to your application.
 *
 * ### Example ([live demo](http://plnkr.co/edit/iRUP8B5OUbxCWQ3AcIDm))
 *
 * ```
 * import {Component} from 'angular2/core';
 * import {
 *   ROUTER_DIRECTIVES,
 *   ROUTER_PROVIDERS,
 *   RouteConfig
 * } from 'angular2/router';
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
exports.ROUTER_PROVIDERS = lang_1.CONST_EXPR([
    router_providers_common_1.ROUTER_PROVIDERS_COMMON,
    lang_1.CONST_EXPR(new core_1.Provider(platform_location_1.PlatformLocation, { useClass: browser_platform_location_1.BrowserPlatformLocation })),
]);
/**
 * Use {@link ROUTER_PROVIDERS} instead.
 *
 * @deprecated
 */
exports.ROUTER_BINDINGS = exports.ROUTER_PROVIDERS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3Byb3ZpZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9yb3V0ZXIvcm91dGVyX3Byb3ZpZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0NBQXNDLDJCQUEyQixDQUFDLENBQUE7QUFDbEUscUJBQXVCLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZDLHFCQUF5QiwwQkFBMEIsQ0FBQyxDQUFBO0FBQ3BELDBDQUFzQyxzQ0FBc0MsQ0FBQyxDQUFBO0FBQzdFLGtDQUErQiw4QkFBOEIsQ0FBQyxDQUFBO0FBRTlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUNVLHdCQUFnQixHQUFVLGlCQUFVLENBQUM7SUFDaEQsaURBQXVCO0lBQ3ZCLGlCQUFVLENBQUMsSUFBSSxlQUFRLENBQUMsb0NBQWdCLEVBQUUsRUFBQyxRQUFRLEVBQUUsbURBQXVCLEVBQUMsQ0FBQyxDQUFDO0NBQ2hGLENBQUMsQ0FBQztBQUVIOzs7O0dBSUc7QUFDVSx1QkFBZSxHQUFHLHdCQUFnQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtST1VURVJfUFJPVklERVJTX0NPTU1PTn0gZnJvbSAnLi9yb3V0ZXJfcHJvdmlkZXJzX2NvbW1vbic7XG5pbXBvcnQge1Byb3ZpZGVyfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7Q09OU1RfRVhQUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QnJvd3NlclBsYXRmb3JtTG9jYXRpb259IGZyb20gJy4vbG9jYXRpb24vYnJvd3Nlcl9wbGF0Zm9ybV9sb2NhdGlvbic7XG5pbXBvcnQge1BsYXRmb3JtTG9jYXRpb259IGZyb20gJy4vbG9jYXRpb24vcGxhdGZvcm1fbG9jYXRpb24nO1xuXG4vKipcbiAqIEEgbGlzdCBvZiB7QGxpbmsgUHJvdmlkZXJ9cy4gVG8gdXNlIHRoZSByb3V0ZXIsIHlvdSBtdXN0IGFkZCB0aGlzIHRvIHlvdXIgYXBwbGljYXRpb24uXG4gKlxuICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L2lSVVA4QjVPVWJ4Q1dRM0FjSURtKSlcbiAqXG4gKiBgYGBcbiAqIGltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbiAqIGltcG9ydCB7XG4gKiAgIFJPVVRFUl9ESVJFQ1RJVkVTLFxuICogICBST1VURVJfUFJPVklERVJTLFxuICogICBSb3V0ZUNvbmZpZ1xuICogfSBmcm9tICdhbmd1bGFyMi9yb3V0ZXInO1xuICpcbiAqIEBDb21wb25lbnQoe2RpcmVjdGl2ZXM6IFtST1VURVJfRElSRUNUSVZFU119KVxuICogQFJvdXRlQ29uZmlnKFtcbiAqICB7Li4ufSxcbiAqIF0pXG4gKiBjbGFzcyBBcHBDbXAge1xuICogICAvLyAuLi5cbiAqIH1cbiAqXG4gKiBib290c3RyYXAoQXBwQ21wLCBbUk9VVEVSX1BST1ZJREVSU10pO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBST1VURVJfUFJPVklERVJTOiBhbnlbXSA9IENPTlNUX0VYUFIoW1xuICBST1VURVJfUFJPVklERVJTX0NPTU1PTixcbiAgQ09OU1RfRVhQUihuZXcgUHJvdmlkZXIoUGxhdGZvcm1Mb2NhdGlvbiwge3VzZUNsYXNzOiBCcm93c2VyUGxhdGZvcm1Mb2NhdGlvbn0pKSxcbl0pO1xuXG4vKipcbiAqIFVzZSB7QGxpbmsgUk9VVEVSX1BST1ZJREVSU30gaW5zdGVhZC5cbiAqXG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnQgY29uc3QgUk9VVEVSX0JJTkRJTkdTID0gUk9VVEVSX1BST1ZJREVSUztcbiJdfQ==