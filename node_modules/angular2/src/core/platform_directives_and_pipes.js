'use strict';"use strict";
var di_1 = require("angular2/src/core/di");
var lang_1 = require("angular2/src/facade/lang");
/**
 * A token that can be provided when bootstraping an application to make an array of directives
 * available in every component of the application.
 *
 * ### Example
 *
 * ```typescript
 * import {PLATFORM_DIRECTIVES} from 'angular2/core';
 * import {OtherDirective} from './myDirectives';
 *
 * @Component({
 *   selector: 'my-component',
 *   template: `
 *     <!-- can use other directive even though the component does not list it in `directives` -->
 *     <other-directive></other-directive>
 *   `
 * })
 * export class MyComponent {
 *   ...
 * }
 *
 * bootstrap(MyComponent, [provide(PLATFORM_DIRECTIVES, {useValue: [OtherDirective], multi:true})]);
 * ```
 */
exports.PLATFORM_DIRECTIVES = lang_1.CONST_EXPR(new di_1.OpaqueToken("Platform Directives"));
/**
 * A token that can be provided when bootstraping an application to make an array of pipes
 * available in every component of the application.
 *
 * ### Example
 *
 * ```typescript
 * import {PLATFORM_PIPES} from 'angular2/core';
 * import {OtherPipe} from './myPipe';
 *
 * @Component({
 *   selector: 'my-component',
 *   template: `
 *     {{123 | other-pipe}}
 *   `
 * })
 * export class MyComponent {
 *   ...
 * }
 *
 * bootstrap(MyComponent, [provide(PLATFORM_PIPES, {useValue: [OtherPipe], multi:true})]);
 * ```
 */
exports.PLATFORM_PIPES = lang_1.CONST_EXPR(new di_1.OpaqueToken("Platform Pipes"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fZGlyZWN0aXZlc19hbmRfcGlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9wbGF0Zm9ybV9kaXJlY3RpdmVzX2FuZF9waXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUJBQTBCLHNCQUFzQixDQUFDLENBQUE7QUFDakQscUJBQXlCLDBCQUEwQixDQUFDLENBQUE7QUFFcEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJHO0FBQ1UsMkJBQW1CLEdBQWdCLGlCQUFVLENBQUMsSUFBSSxnQkFBVyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztBQUVuRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUNVLHNCQUFjLEdBQWdCLGlCQUFVLENBQUMsSUFBSSxnQkFBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7T3BhcXVlVG9rZW59IGZyb20gXCJhbmd1bGFyMi9zcmMvY29yZS9kaVwiO1xuaW1wb3J0IHtDT05TVF9FWFBSfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nXCI7XG5cbi8qKlxuICogQSB0b2tlbiB0aGF0IGNhbiBiZSBwcm92aWRlZCB3aGVuIGJvb3RzdHJhcGluZyBhbiBhcHBsaWNhdGlvbiB0byBtYWtlIGFuIGFycmF5IG9mIGRpcmVjdGl2ZXNcbiAqIGF2YWlsYWJsZSBpbiBldmVyeSBjb21wb25lbnQgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHtQTEFURk9STV9ESVJFQ1RJVkVTfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbiAqIGltcG9ydCB7T3RoZXJEaXJlY3RpdmV9IGZyb20gJy4vbXlEaXJlY3RpdmVzJztcbiAqXG4gKiBAQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICdteS1jb21wb25lbnQnLFxuICogICB0ZW1wbGF0ZTogYFxuICogICAgIDwhLS0gY2FuIHVzZSBvdGhlciBkaXJlY3RpdmUgZXZlbiB0aG91Z2ggdGhlIGNvbXBvbmVudCBkb2VzIG5vdCBsaXN0IGl0IGluIGBkaXJlY3RpdmVzYCAtLT5cbiAqICAgICA8b3RoZXItZGlyZWN0aXZlPjwvb3RoZXItZGlyZWN0aXZlPlxuICogICBgXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IHtcbiAqICAgLi4uXG4gKiB9XG4gKlxuICogYm9vdHN0cmFwKE15Q29tcG9uZW50LCBbcHJvdmlkZShQTEFURk9STV9ESVJFQ1RJVkVTLCB7dXNlVmFsdWU6IFtPdGhlckRpcmVjdGl2ZV0sIG11bHRpOnRydWV9KV0pO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBQTEFURk9STV9ESVJFQ1RJVkVTOiBPcGFxdWVUb2tlbiA9IENPTlNUX0VYUFIobmV3IE9wYXF1ZVRva2VuKFwiUGxhdGZvcm0gRGlyZWN0aXZlc1wiKSk7XG5cbi8qKlxuICogQSB0b2tlbiB0aGF0IGNhbiBiZSBwcm92aWRlZCB3aGVuIGJvb3RzdHJhcGluZyBhbiBhcHBsaWNhdGlvbiB0byBtYWtlIGFuIGFycmF5IG9mIHBpcGVzXG4gKiBhdmFpbGFibGUgaW4gZXZlcnkgY29tcG9uZW50IG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7UExBVEZPUk1fUElQRVN9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuICogaW1wb3J0IHtPdGhlclBpcGV9IGZyb20gJy4vbXlQaXBlJztcbiAqXG4gKiBAQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICdteS1jb21wb25lbnQnLFxuICogICB0ZW1wbGF0ZTogYFxuICogICAgIHt7MTIzIHwgb3RoZXItcGlwZX19XG4gKiAgIGBcbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQge1xuICogICAuLi5cbiAqIH1cbiAqXG4gKiBib290c3RyYXAoTXlDb21wb25lbnQsIFtwcm92aWRlKFBMQVRGT1JNX1BJUEVTLCB7dXNlVmFsdWU6IFtPdGhlclBpcGVdLCBtdWx0aTp0cnVlfSldKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgUExBVEZPUk1fUElQRVM6IE9wYXF1ZVRva2VuID0gQ09OU1RfRVhQUihuZXcgT3BhcXVlVG9rZW4oXCJQbGF0Zm9ybSBQaXBlc1wiKSk7XG4iXX0=