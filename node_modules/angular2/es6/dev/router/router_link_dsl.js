import { TEMPLATE_TRANSFORMS } from 'angular2/compiler';
import { Provider } from 'angular2/core';
import { RouterLinkTransform } from 'angular2/src/router/directives/router_link_transform';
import { CONST_EXPR } from 'angular2/src/facade/lang';
export { RouterLinkTransform } from 'angular2/src/router/directives/router_link_transform';
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
export const ROUTER_LINK_DSL_PROVIDER = CONST_EXPR(new Provider(TEMPLATE_TRANSFORMS, { useClass: RouterLinkTransform, multi: true }));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2xpbmtfZHNsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvcm91dGVyL3JvdXRlcl9saW5rX2RzbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sbUJBQW1CO09BQzlDLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZTtPQUMvQixFQUFDLG1CQUFtQixFQUFDLE1BQU0sc0RBQXNEO09BQ2pGLEVBQUMsVUFBVSxFQUFDLE1BQU0sMEJBQTBCO0FBRW5ELFNBQVEsbUJBQW1CLFFBQU8sc0RBQXNELENBQUM7QUFFekY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Qkc7QUFDSCxPQUFPLE1BQU0sd0JBQXdCLEdBQ2pDLFVBQVUsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxFQUFDLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtURU1QTEFURV9UUkFOU0ZPUk1TfSBmcm9tICdhbmd1bGFyMi9jb21waWxlcic7XG5pbXBvcnQge1Byb3ZpZGVyfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7Um91dGVyTGlua1RyYW5zZm9ybX0gZnJvbSAnYW5ndWxhcjIvc3JjL3JvdXRlci9kaXJlY3RpdmVzL3JvdXRlcl9saW5rX3RyYW5zZm9ybSc7XG5pbXBvcnQge0NPTlNUX0VYUFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmV4cG9ydCB7Um91dGVyTGlua1RyYW5zZm9ybX0gZnJvbSAnYW5ndWxhcjIvc3JjL3JvdXRlci9kaXJlY3RpdmVzL3JvdXRlcl9saW5rX3RyYW5zZm9ybSc7XG5cbi8qKlxuICogRW5hYmxlcyB0aGUgcm91dGVyIGxpbmsgRFNMLlxuICpcbiAqIFdhcm5pbmcuIFRoaXMgZmVhdHVyZSBpcyBleHBlcmltZW50YWwgYW5kIGNhbiBjaGFuZ2UuXG4gKlxuICogVG8gZW5hYmxlIHRoZSB0cmFuc2Zvcm1lciBwYXNzIHRoZSByb3V0ZXIgbGluayBEU0wgcHJvdmlkZXIgdG8gYGJvb3RzdHJhcGAuXG4gKlxuICogIyMgRXhhbXBsZTpcbiAqIGBgYFxuICogaW1wb3J0IHtib290c3RyYXB9IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2Jyb3dzZXInO1xuICogaW1wb3J0IHtST1VURVJfTElOS19EU0xfUFJPVklERVJ9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlci9yb3V0ZXJfbGlua19kc2wnO1xuICpcbiAqIGJvb3RzdHJhcChDdXN0b21BcHAsIFtST1VURVJfTElOS19EU0xfUFJPVklERVJdKTtcbiAqIGBgYFxuICpcbiAqIFRoZSBEU0wgYWxsb3dzIHlvdSB0byBleHByZXNzIHJvdXRlciBsaW5rcyBhcyBmb2xsb3dzOlxuICogYGBgXG4gKiA8YSBbcm91dGVyTGlua109XCJyb3V0ZTpVc2VyXCI+IDwhLS0gU2FtZSBhcyA8YSBbcm91dGVyTGlua109XCJbJ1VzZXInXVwiPiAtLT5cbiAqIDxhIFtyb3V0ZXJMaW5rXT1cInJvdXRlOi9Vc2VyXCI+IDwhLS0gU2FtZSBhcyA8YSBbcm91dGVyTGlua109XCJbJ1VzZXInXVwiPiAtLT5cbiAqIDxhIFtyb3V0ZXJMaW5rXT1cInJvdXRlOi4vVXNlclwiPiA8IS0tIFNhbWUgYXMgPGEgW3JvdXRlckxpbmtdPVwiWycuL1VzZXInXVwiPiAtLT5cbiAqIDxhIFtyb3V0ZXJMaW5rXT1cIi4vVXNlcihpZDogdmFsdWUsIG5hbWU6ICdCb2InKVwiPiA8IS0tIFNhbWUgYXMgPGEgW3JvdXRlckxpbmtdPVwiWycuL1VzZXInLCB7aWQ6XG4gKiB2YWx1ZSwgbmFtZTogJ0JvYid9XVwiPiAtLT5cbiAqIDxhIFtyb3V0ZXJMaW5rXT1cIi9Vc2VyL01vZGFsXCI+IDwhLS0gU2FtZSBhcyA8YSBbcm91dGVyTGlua109XCJbJy9Vc2VyJywgJ01vZGFsJ11cIj4gLS0+XG4gKiA8YSBbcm91dGVyTGlua109XCJVc2VyW01vZGFsXVwiPiA8IS0tIFNhbWUgYXMgPGEgW3JvdXRlckxpbmtdPVwiWydVc2VyJywgWydNb2RhbCddXVwiPiAtLT5cbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgUk9VVEVSX0xJTktfRFNMX1BST1ZJREVSID1cbiAgICBDT05TVF9FWFBSKG5ldyBQcm92aWRlcihURU1QTEFURV9UUkFOU0ZPUk1TLCB7dXNlQ2xhc3M6IFJvdXRlckxpbmtUcmFuc2Zvcm0sIG11bHRpOiB0cnVlfSkpO1xuIl19