'use strict';"use strict";
var compiler_1 = require('angular2/compiler');
var core_1 = require('angular2/core');
var router_link_transform_1 = require('angular2/src/router/directives/router_link_transform');
var lang_1 = require('angular2/src/facade/lang');
var router_link_transform_2 = require('angular2/src/router/directives/router_link_transform');
exports.RouterLinkTransform = router_link_transform_2.RouterLinkTransform;
/**
 * Enables the router link DSL.
 *
 * Warning. This feature is experimental and can change.
 *
 * To enable the transformer pass the router link DSL provider to `bootstrap`.
 *
 * ## Example:
 * ```
 * import {bootstrap} from 'angular2/platform/browser';
 * import {ROUTER_LINK_DSL_PROVIDER} from 'angular2/router/router_link_dsl';
 *
 * bootstrap(CustomApp, [ROUTER_LINK_DSL_PROVIDER]);
 * ```
 *
 * The DSL allows you to express router links as follows:
 * ```
 * <a [routerLink]="route:User"> <!-- Same as <a [routerLink]="['User']"> -->
 * <a [routerLink]="route:/User"> <!-- Same as <a [routerLink]="['User']"> -->
 * <a [routerLink]="route:./User"> <!-- Same as <a [routerLink]="['./User']"> -->
 * <a [routerLink]="./User(id: value, name: 'Bob')"> <!-- Same as <a [routerLink]="['./User', {id:
 * value, name: 'Bob'}]"> -->
 * <a [routerLink]="/User/Modal"> <!-- Same as <a [routerLink]="['/User', 'Modal']"> -->
 * <a [routerLink]="User[Modal]"> <!-- Same as <a [routerLink]="['User', ['Modal']]"> -->
 * ```
 */
exports.ROUTER_LINK_DSL_PROVIDER = lang_1.CONST_EXPR(new core_1.Provider(compiler_1.TEMPLATE_TRANSFORMS, { useClass: router_link_transform_1.RouterLinkTransform, multi: true }));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2xpbmtfZHNsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvcm91dGVyL3JvdXRlcl9saW5rX2RzbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseUJBQWtDLG1CQUFtQixDQUFDLENBQUE7QUFDdEQscUJBQXVCLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZDLHNDQUFrQyxzREFBc0QsQ0FBQyxDQUFBO0FBQ3pGLHFCQUF5QiwwQkFBMEIsQ0FBQyxDQUFBO0FBRXBELHNDQUFrQyxzREFBc0QsQ0FBQztBQUFqRiwwRUFBaUY7QUFFekY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Qkc7QUFDVSxnQ0FBd0IsR0FDakMsaUJBQVUsQ0FBQyxJQUFJLGVBQVEsQ0FBQyw4QkFBbUIsRUFBRSxFQUFDLFFBQVEsRUFBRSwyQ0FBbUIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtURU1QTEFURV9UUkFOU0ZPUk1TfSBmcm9tICdhbmd1bGFyMi9jb21waWxlcic7XG5pbXBvcnQge1Byb3ZpZGVyfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7Um91dGVyTGlua1RyYW5zZm9ybX0gZnJvbSAnYW5ndWxhcjIvc3JjL3JvdXRlci9kaXJlY3RpdmVzL3JvdXRlcl9saW5rX3RyYW5zZm9ybSc7XG5pbXBvcnQge0NPTlNUX0VYUFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmV4cG9ydCB7Um91dGVyTGlua1RyYW5zZm9ybX0gZnJvbSAnYW5ndWxhcjIvc3JjL3JvdXRlci9kaXJlY3RpdmVzL3JvdXRlcl9saW5rX3RyYW5zZm9ybSc7XG5cbi8qKlxuICogRW5hYmxlcyB0aGUgcm91dGVyIGxpbmsgRFNMLlxuICpcbiAqIFdhcm5pbmcuIFRoaXMgZmVhdHVyZSBpcyBleHBlcmltZW50YWwgYW5kIGNhbiBjaGFuZ2UuXG4gKlxuICogVG8gZW5hYmxlIHRoZSB0cmFuc2Zvcm1lciBwYXNzIHRoZSByb3V0ZXIgbGluayBEU0wgcHJvdmlkZXIgdG8gYGJvb3RzdHJhcGAuXG4gKlxuICogIyMgRXhhbXBsZTpcbiAqIGBgYFxuICogaW1wb3J0IHtib290c3RyYXB9IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2Jyb3dzZXInO1xuICogaW1wb3J0IHtST1VURVJfTElOS19EU0xfUFJPVklERVJ9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlci9yb3V0ZXJfbGlua19kc2wnO1xuICpcbiAqIGJvb3RzdHJhcChDdXN0b21BcHAsIFtST1VURVJfTElOS19EU0xfUFJPVklERVJdKTtcbiAqIGBgYFxuICpcbiAqIFRoZSBEU0wgYWxsb3dzIHlvdSB0byBleHByZXNzIHJvdXRlciBsaW5rcyBhcyBmb2xsb3dzOlxuICogYGBgXG4gKiA8YSBbcm91dGVyTGlua109XCJyb3V0ZTpVc2VyXCI+IDwhLS0gU2FtZSBhcyA8YSBbcm91dGVyTGlua109XCJbJ1VzZXInXVwiPiAtLT5cbiAqIDxhIFtyb3V0ZXJMaW5rXT1cInJvdXRlOi9Vc2VyXCI+IDwhLS0gU2FtZSBhcyA8YSBbcm91dGVyTGlua109XCJbJ1VzZXInXVwiPiAtLT5cbiAqIDxhIFtyb3V0ZXJMaW5rXT1cInJvdXRlOi4vVXNlclwiPiA8IS0tIFNhbWUgYXMgPGEgW3JvdXRlckxpbmtdPVwiWycuL1VzZXInXVwiPiAtLT5cbiAqIDxhIFtyb3V0ZXJMaW5rXT1cIi4vVXNlcihpZDogdmFsdWUsIG5hbWU6ICdCb2InKVwiPiA8IS0tIFNhbWUgYXMgPGEgW3JvdXRlckxpbmtdPVwiWycuL1VzZXInLCB7aWQ6XG4gKiB2YWx1ZSwgbmFtZTogJ0JvYid9XVwiPiAtLT5cbiAqIDxhIFtyb3V0ZXJMaW5rXT1cIi9Vc2VyL01vZGFsXCI+IDwhLS0gU2FtZSBhcyA8YSBbcm91dGVyTGlua109XCJbJy9Vc2VyJywgJ01vZGFsJ11cIj4gLS0+XG4gKiA8YSBbcm91dGVyTGlua109XCJVc2VyW01vZGFsXVwiPiA8IS0tIFNhbWUgYXMgPGEgW3JvdXRlckxpbmtdPVwiWydVc2VyJywgWydNb2RhbCddXVwiPiAtLT5cbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgUk9VVEVSX0xJTktfRFNMX1BST1ZJREVSID1cbiAgICBDT05TVF9FWFBSKG5ldyBQcm92aWRlcihURU1QTEFURV9UUkFOU0ZPUk1TLCB7dXNlQ2xhc3M6IFJvdXRlckxpbmtUcmFuc2Zvcm0sIG11bHRpOiB0cnVlfSkpO1xuIl19