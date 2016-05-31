'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var core_1 = require('angular2/core');
/**
 * `LocationStrategy` is responsible for representing and reading route state
 * from the browser's URL. Angular provides two strategies:
 * {@link HashLocationStrategy} and {@link PathLocationStrategy} (default).
 *
 * This is used under the hood of the {@link Location} service.
 *
 * Applications should use the {@link Router} or {@link Location} services to
 * interact with application route state.
 *
 * For instance, {@link HashLocationStrategy} produces URLs like
 * `http://example.com#/foo`, and {@link PathLocationStrategy} produces
 * `http://example.com/foo` as an equivalent URL.
 *
 * See these two classes for more.
 */
var LocationStrategy = (function () {
    function LocationStrategy() {
    }
    return LocationStrategy;
}());
exports.LocationStrategy = LocationStrategy;
/**
 * The `APP_BASE_HREF` token represents the base href to be used with the
 * {@link PathLocationStrategy}.
 *
 * If you're using {@link PathLocationStrategy}, you must provide a provider to a string
 * representing the URL prefix that should be preserved when generating and recognizing
 * URLs.
 *
 * ### Example
 *
 * ```
 * import {Component} from 'angular2/core';
 * import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig} from 'angular2/router';
 *
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * @RouteConfig([
 *  {...},
 * ])
 * class AppCmp {
 *   // ...
 * }
 *
 * bootstrap(AppCmp, [
 *   ROUTER_PROVIDERS,
 *   provide(APP_BASE_HREF, {useValue: '/my/app'})
 * ]);
 * ```
 */
exports.APP_BASE_HREF = lang_1.CONST_EXPR(new core_1.OpaqueToken('appBaseHref'));
function normalizeQueryParams(params) {
    return (params.length > 0 && params.substring(0, 1) != '?') ? ('?' + params) : params;
}
exports.normalizeQueryParams = normalizeQueryParams;
function joinWithSlash(start, end) {
    if (start.length == 0) {
        return end;
    }
    if (end.length == 0) {
        return start;
    }
    var slashes = 0;
    if (start.endsWith('/')) {
        slashes++;
    }
    if (end.startsWith('/')) {
        slashes++;
    }
    if (slashes == 2) {
        return start + end.substring(1);
    }
    if (slashes == 1) {
        return start + end;
    }
    return start + '/' + end;
}
exports.joinWithSlash = joinWithSlash;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb25fc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvcm91dGVyL2xvY2F0aW9uL2xvY2F0aW9uX3N0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBeUIsMEJBQTBCLENBQUMsQ0FBQTtBQUNwRCxxQkFBMEIsZUFBZSxDQUFDLENBQUE7QUFHMUM7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0g7SUFBQTtJQVNBLENBQUM7SUFBRCx1QkFBQztBQUFELENBQUMsQUFURCxJQVNDO0FBVHFCLHdCQUFnQixtQkFTckMsQ0FBQTtBQUdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQkc7QUFDVSxxQkFBYSxHQUFnQixpQkFBVSxDQUFDLElBQUksa0JBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBRXJGLDhCQUFxQyxNQUFjO0lBQ2pELE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUN4RixDQUFDO0FBRmUsNEJBQW9CLHVCQUVuQyxDQUFBO0FBRUQsdUJBQThCLEtBQWEsRUFBRSxHQUFXO0lBQ3RELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNoQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQixNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDM0IsQ0FBQztBQXJCZSxxQkFBYSxnQkFxQjVCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NPTlNUX0VYUFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge09wYXF1ZVRva2VufSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7VXJsQ2hhbmdlTGlzdGVuZXJ9IGZyb20gJy4vcGxhdGZvcm1fbG9jYXRpb24nO1xuXG4vKipcbiAqIGBMb2NhdGlvblN0cmF0ZWd5YCBpcyByZXNwb25zaWJsZSBmb3IgcmVwcmVzZW50aW5nIGFuZCByZWFkaW5nIHJvdXRlIHN0YXRlXG4gKiBmcm9tIHRoZSBicm93c2VyJ3MgVVJMLiBBbmd1bGFyIHByb3ZpZGVzIHR3byBzdHJhdGVnaWVzOlxuICoge0BsaW5rIEhhc2hMb2NhdGlvblN0cmF0ZWd5fSBhbmQge0BsaW5rIFBhdGhMb2NhdGlvblN0cmF0ZWd5fSAoZGVmYXVsdCkuXG4gKlxuICogVGhpcyBpcyB1c2VkIHVuZGVyIHRoZSBob29kIG9mIHRoZSB7QGxpbmsgTG9jYXRpb259IHNlcnZpY2UuXG4gKlxuICogQXBwbGljYXRpb25zIHNob3VsZCB1c2UgdGhlIHtAbGluayBSb3V0ZXJ9IG9yIHtAbGluayBMb2NhdGlvbn0gc2VydmljZXMgdG9cbiAqIGludGVyYWN0IHdpdGggYXBwbGljYXRpb24gcm91dGUgc3RhdGUuXG4gKlxuICogRm9yIGluc3RhbmNlLCB7QGxpbmsgSGFzaExvY2F0aW9uU3RyYXRlZ3l9IHByb2R1Y2VzIFVSTHMgbGlrZVxuICogYGh0dHA6Ly9leGFtcGxlLmNvbSMvZm9vYCwgYW5kIHtAbGluayBQYXRoTG9jYXRpb25TdHJhdGVneX0gcHJvZHVjZXNcbiAqIGBodHRwOi8vZXhhbXBsZS5jb20vZm9vYCBhcyBhbiBlcXVpdmFsZW50IFVSTC5cbiAqXG4gKiBTZWUgdGhlc2UgdHdvIGNsYXNzZXMgZm9yIG1vcmUuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMb2NhdGlvblN0cmF0ZWd5IHtcbiAgYWJzdHJhY3QgcGF0aCgpOiBzdHJpbmc7XG4gIGFic3RyYWN0IHByZXBhcmVFeHRlcm5hbFVybChpbnRlcm5hbDogc3RyaW5nKTogc3RyaW5nO1xuICBhYnN0cmFjdCBwdXNoU3RhdGUoc3RhdGU6IGFueSwgdGl0bGU6IHN0cmluZywgdXJsOiBzdHJpbmcsIHF1ZXJ5UGFyYW1zOiBzdHJpbmcpOiB2b2lkO1xuICBhYnN0cmFjdCByZXBsYWNlU3RhdGUoc3RhdGU6IGFueSwgdGl0bGU6IHN0cmluZywgdXJsOiBzdHJpbmcsIHF1ZXJ5UGFyYW1zOiBzdHJpbmcpOiB2b2lkO1xuICBhYnN0cmFjdCBmb3J3YXJkKCk6IHZvaWQ7XG4gIGFic3RyYWN0IGJhY2soKTogdm9pZDtcbiAgYWJzdHJhY3Qgb25Qb3BTdGF0ZShmbjogVXJsQ2hhbmdlTGlzdGVuZXIpOiB2b2lkO1xuICBhYnN0cmFjdCBnZXRCYXNlSHJlZigpOiBzdHJpbmc7XG59XG5cblxuLyoqXG4gKiBUaGUgYEFQUF9CQVNFX0hSRUZgIHRva2VuIHJlcHJlc2VudHMgdGhlIGJhc2UgaHJlZiB0byBiZSB1c2VkIHdpdGggdGhlXG4gKiB7QGxpbmsgUGF0aExvY2F0aW9uU3RyYXRlZ3l9LlxuICpcbiAqIElmIHlvdSdyZSB1c2luZyB7QGxpbmsgUGF0aExvY2F0aW9uU3RyYXRlZ3l9LCB5b3UgbXVzdCBwcm92aWRlIGEgcHJvdmlkZXIgdG8gYSBzdHJpbmdcbiAqIHJlcHJlc2VudGluZyB0aGUgVVJMIHByZWZpeCB0aGF0IHNob3VsZCBiZSBwcmVzZXJ2ZWQgd2hlbiBnZW5lcmF0aW5nIGFuZCByZWNvZ25pemluZ1xuICogVVJMcy5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuICogaW1wb3J0IHtST1VURVJfRElSRUNUSVZFUywgUk9VVEVSX1BST1ZJREVSUywgUm91dGVDb25maWd9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlcic7XG4gKlxuICogQENvbXBvbmVudCh7ZGlyZWN0aXZlczogW1JPVVRFUl9ESVJFQ1RJVkVTXX0pXG4gKiBAUm91dGVDb25maWcoW1xuICogIHsuLi59LFxuICogXSlcbiAqIGNsYXNzIEFwcENtcCB7XG4gKiAgIC8vIC4uLlxuICogfVxuICpcbiAqIGJvb3RzdHJhcChBcHBDbXAsIFtcbiAqICAgUk9VVEVSX1BST1ZJREVSUyxcbiAqICAgcHJvdmlkZShBUFBfQkFTRV9IUkVGLCB7dXNlVmFsdWU6ICcvbXkvYXBwJ30pXG4gKiBdKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgQVBQX0JBU0VfSFJFRjogT3BhcXVlVG9rZW4gPSBDT05TVF9FWFBSKG5ldyBPcGFxdWVUb2tlbignYXBwQmFzZUhyZWYnKSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVRdWVyeVBhcmFtcyhwYXJhbXM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiAocGFyYW1zLmxlbmd0aCA+IDAgJiYgcGFyYW1zLnN1YnN0cmluZygwLCAxKSAhPSAnPycpID8gKCc/JyArIHBhcmFtcykgOiBwYXJhbXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBqb2luV2l0aFNsYXNoKHN0YXJ0OiBzdHJpbmcsIGVuZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKHN0YXJ0Lmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIGVuZDtcbiAgfVxuICBpZiAoZW5kLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIHN0YXJ0O1xuICB9XG4gIHZhciBzbGFzaGVzID0gMDtcbiAgaWYgKHN0YXJ0LmVuZHNXaXRoKCcvJykpIHtcbiAgICBzbGFzaGVzKys7XG4gIH1cbiAgaWYgKGVuZC5zdGFydHNXaXRoKCcvJykpIHtcbiAgICBzbGFzaGVzKys7XG4gIH1cbiAgaWYgKHNsYXNoZXMgPT0gMikge1xuICAgIHJldHVybiBzdGFydCArIGVuZC5zdWJzdHJpbmcoMSk7XG4gIH1cbiAgaWYgKHNsYXNoZXMgPT0gMSkge1xuICAgIHJldHVybiBzdGFydCArIGVuZDtcbiAgfVxuICByZXR1cm4gc3RhcnQgKyAnLycgKyBlbmQ7XG59XG4iXX0=