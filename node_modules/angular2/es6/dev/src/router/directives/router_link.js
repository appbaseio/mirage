var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive } from 'angular2/core';
import { isString } from 'angular2/src/facade/lang';
import { Router } from '../router';
import { Location } from '../location/location';
/**
 * The RouterLink directive lets you link to specific parts of your app.
 *
 * Consider the following route configuration:

 * ```
 * @RouteConfig([
 *   { path: '/user', component: UserCmp, as: 'User' }
 * ]);
 * class MyComp {}
 * ```
 *
 * When linking to this `User` route, you can write:
 *
 * ```
 * <a [routerLink]="['./User']">link to user component</a>
 * ```
 *
 * RouterLink expects the value to be an array of route names, followed by the params
 * for that level of routing. For instance `['/Team', {teamId: 1}, 'User', {userId: 2}]`
 * means that we want to generate a link for the `Team` route with params `{teamId: 1}`,
 * and with a child route `User` with params `{userId: 2}`.
 *
 * The first route name should be prepended with `/`, `./`, or `../`.
 * If the route begins with `/`, the router will look up the route from the root of the app.
 * If the route begins with `./`, the router will instead look in the current component's
 * children for the route. And if the route begins with `../`, the router will look at the
 * current component's parent.
 */
export let RouterLink = class RouterLink {
    constructor(_router, _location) {
        this._router = _router;
        this._location = _location;
        // we need to update the link whenever a route changes to account for aux routes
        this._router.subscribe((_) => this._updateLink());
    }
    // because auxiliary links take existing primary and auxiliary routes into account,
    // we need to update the link whenever params or other routes change.
    _updateLink() {
        this._navigationInstruction = this._router.generate(this._routeParams);
        var navigationHref = this._navigationInstruction.toLinkUrl();
        this.visibleHref = this._location.prepareExternalUrl(navigationHref);
    }
    get isRouteActive() { return this._router.isRouteActive(this._navigationInstruction); }
    set routeParams(changes) {
        this._routeParams = changes;
        this._updateLink();
    }
    onClick() {
        // If no target, or if target is _self, prevent default browser behavior
        if (!isString(this.target) || this.target == '_self') {
            this._router.navigateByInstruction(this._navigationInstruction);
            return false;
        }
        return true;
    }
};
RouterLink = __decorate([
    Directive({
        selector: '[routerLink]',
        inputs: ['routeParams: routerLink', 'target: target'],
        host: {
            '(click)': 'onClick()',
            '[attr.href]': 'visibleHref',
            '[class.router-link-active]': 'isRouteActive'
        }
    }), 
    __metadata('design:paramtypes', [Router, Location])
], RouterLink);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2xpbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvcm91dGVyL2RpcmVjdGl2ZXMvcm91dGVyX2xpbmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlO09BQ2hDLEVBQUMsUUFBUSxFQUFDLE1BQU0sMEJBQTBCO09BRTFDLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVztPQUN6QixFQUFDLFFBQVEsRUFBQyxNQUFNLHNCQUFzQjtBQUc3Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQVVIO0lBVUUsWUFBb0IsT0FBZSxFQUFVLFNBQW1CO1FBQTVDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQzlELGdGQUFnRjtRQUNoRixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsbUZBQW1GO0lBQ25GLHFFQUFxRTtJQUM3RCxXQUFXO1FBQ2pCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdkUsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzdELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsSUFBSSxhQUFhLEtBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoRyxJQUFJLFdBQVcsQ0FBQyxPQUFjO1FBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsT0FBTztRQUNMLHdFQUF3RTtRQUN4RSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDaEUsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUM7QUEvQ0Q7SUFBQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsY0FBYztRQUN4QixNQUFNLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxnQkFBZ0IsQ0FBQztRQUNyRCxJQUFJLEVBQUU7WUFDSixTQUFTLEVBQUUsV0FBVztZQUN0QixhQUFhLEVBQUUsYUFBYTtZQUM1Qiw0QkFBNEIsRUFBRSxlQUFlO1NBQzlDO0tBQ0YsQ0FBQzs7Y0FBQTtBQXVDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7aXNTdHJpbmd9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmltcG9ydCB7Um91dGVyfSBmcm9tICcuLi9yb3V0ZXInO1xuaW1wb3J0IHtMb2NhdGlvbn0gZnJvbSAnLi4vbG9jYXRpb24vbG9jYXRpb24nO1xuaW1wb3J0IHtJbnN0cnVjdGlvbn0gZnJvbSAnLi4vaW5zdHJ1Y3Rpb24nO1xuXG4vKipcbiAqIFRoZSBSb3V0ZXJMaW5rIGRpcmVjdGl2ZSBsZXRzIHlvdSBsaW5rIHRvIHNwZWNpZmljIHBhcnRzIG9mIHlvdXIgYXBwLlxuICpcbiAqIENvbnNpZGVyIHRoZSBmb2xsb3dpbmcgcm91dGUgY29uZmlndXJhdGlvbjpcblxuICogYGBgXG4gKiBAUm91dGVDb25maWcoW1xuICogICB7IHBhdGg6ICcvdXNlcicsIGNvbXBvbmVudDogVXNlckNtcCwgYXM6ICdVc2VyJyB9XG4gKiBdKTtcbiAqIGNsYXNzIE15Q29tcCB7fVxuICogYGBgXG4gKlxuICogV2hlbiBsaW5raW5nIHRvIHRoaXMgYFVzZXJgIHJvdXRlLCB5b3UgY2FuIHdyaXRlOlxuICpcbiAqIGBgYFxuICogPGEgW3JvdXRlckxpbmtdPVwiWycuL1VzZXInXVwiPmxpbmsgdG8gdXNlciBjb21wb25lbnQ8L2E+XG4gKiBgYGBcbiAqXG4gKiBSb3V0ZXJMaW5rIGV4cGVjdHMgdGhlIHZhbHVlIHRvIGJlIGFuIGFycmF5IG9mIHJvdXRlIG5hbWVzLCBmb2xsb3dlZCBieSB0aGUgcGFyYW1zXG4gKiBmb3IgdGhhdCBsZXZlbCBvZiByb3V0aW5nLiBGb3IgaW5zdGFuY2UgYFsnL1RlYW0nLCB7dGVhbUlkOiAxfSwgJ1VzZXInLCB7dXNlcklkOiAyfV1gXG4gKiBtZWFucyB0aGF0IHdlIHdhbnQgdG8gZ2VuZXJhdGUgYSBsaW5rIGZvciB0aGUgYFRlYW1gIHJvdXRlIHdpdGggcGFyYW1zIGB7dGVhbUlkOiAxfWAsXG4gKiBhbmQgd2l0aCBhIGNoaWxkIHJvdXRlIGBVc2VyYCB3aXRoIHBhcmFtcyBge3VzZXJJZDogMn1gLlxuICpcbiAqIFRoZSBmaXJzdCByb3V0ZSBuYW1lIHNob3VsZCBiZSBwcmVwZW5kZWQgd2l0aCBgL2AsIGAuL2AsIG9yIGAuLi9gLlxuICogSWYgdGhlIHJvdXRlIGJlZ2lucyB3aXRoIGAvYCwgdGhlIHJvdXRlciB3aWxsIGxvb2sgdXAgdGhlIHJvdXRlIGZyb20gdGhlIHJvb3Qgb2YgdGhlIGFwcC5cbiAqIElmIHRoZSByb3V0ZSBiZWdpbnMgd2l0aCBgLi9gLCB0aGUgcm91dGVyIHdpbGwgaW5zdGVhZCBsb29rIGluIHRoZSBjdXJyZW50IGNvbXBvbmVudCdzXG4gKiBjaGlsZHJlbiBmb3IgdGhlIHJvdXRlLiBBbmQgaWYgdGhlIHJvdXRlIGJlZ2lucyB3aXRoIGAuLi9gLCB0aGUgcm91dGVyIHdpbGwgbG9vayBhdCB0aGVcbiAqIGN1cnJlbnQgY29tcG9uZW50J3MgcGFyZW50LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcm91dGVyTGlua10nLFxuICBpbnB1dHM6IFsncm91dGVQYXJhbXM6IHJvdXRlckxpbmsnLCAndGFyZ2V0OiB0YXJnZXQnXSxcbiAgaG9zdDoge1xuICAgICcoY2xpY2spJzogJ29uQ2xpY2soKScsXG4gICAgJ1thdHRyLmhyZWZdJzogJ3Zpc2libGVIcmVmJyxcbiAgICAnW2NsYXNzLnJvdXRlci1saW5rLWFjdGl2ZV0nOiAnaXNSb3V0ZUFjdGl2ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBSb3V0ZXJMaW5rIHtcbiAgcHJpdmF0ZSBfcm91dGVQYXJhbXM6IGFueVtdO1xuXG4gIC8vIHRoZSB1cmwgZGlzcGxheWVkIG9uIHRoZSBhbmNob3IgZWxlbWVudC5cbiAgdmlzaWJsZUhyZWY6IHN0cmluZztcbiAgdGFyZ2V0OiBzdHJpbmc7XG5cbiAgLy8gdGhlIGluc3RydWN0aW9uIHBhc3NlZCB0byB0aGUgcm91dGVyIHRvIG5hdmlnYXRlXG4gIHByaXZhdGUgX25hdmlnYXRpb25JbnN0cnVjdGlvbjogSW5zdHJ1Y3Rpb247XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgX2xvY2F0aW9uOiBMb2NhdGlvbikge1xuICAgIC8vIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSBsaW5rIHdoZW5ldmVyIGEgcm91dGUgY2hhbmdlcyB0byBhY2NvdW50IGZvciBhdXggcm91dGVzXG4gICAgdGhpcy5fcm91dGVyLnN1YnNjcmliZSgoXykgPT4gdGhpcy5fdXBkYXRlTGluaygpKTtcbiAgfVxuXG4gIC8vIGJlY2F1c2UgYXV4aWxpYXJ5IGxpbmtzIHRha2UgZXhpc3RpbmcgcHJpbWFyeSBhbmQgYXV4aWxpYXJ5IHJvdXRlcyBpbnRvIGFjY291bnQsXG4gIC8vIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSBsaW5rIHdoZW5ldmVyIHBhcmFtcyBvciBvdGhlciByb3V0ZXMgY2hhbmdlLlxuICBwcml2YXRlIF91cGRhdGVMaW5rKCk6IHZvaWQge1xuICAgIHRoaXMuX25hdmlnYXRpb25JbnN0cnVjdGlvbiA9IHRoaXMuX3JvdXRlci5nZW5lcmF0ZSh0aGlzLl9yb3V0ZVBhcmFtcyk7XG4gICAgdmFyIG5hdmlnYXRpb25IcmVmID0gdGhpcy5fbmF2aWdhdGlvbkluc3RydWN0aW9uLnRvTGlua1VybCgpO1xuICAgIHRoaXMudmlzaWJsZUhyZWYgPSB0aGlzLl9sb2NhdGlvbi5wcmVwYXJlRXh0ZXJuYWxVcmwobmF2aWdhdGlvbkhyZWYpO1xuICB9XG5cbiAgZ2V0IGlzUm91dGVBY3RpdmUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yb3V0ZXIuaXNSb3V0ZUFjdGl2ZSh0aGlzLl9uYXZpZ2F0aW9uSW5zdHJ1Y3Rpb24pOyB9XG5cbiAgc2V0IHJvdXRlUGFyYW1zKGNoYW5nZXM6IGFueVtdKSB7XG4gICAgdGhpcy5fcm91dGVQYXJhbXMgPSBjaGFuZ2VzO1xuICAgIHRoaXMuX3VwZGF0ZUxpbmsoKTtcbiAgfVxuXG4gIG9uQ2xpY2soKTogYm9vbGVhbiB7XG4gICAgLy8gSWYgbm8gdGFyZ2V0LCBvciBpZiB0YXJnZXQgaXMgX3NlbGYsIHByZXZlbnQgZGVmYXVsdCBicm93c2VyIGJlaGF2aW9yXG4gICAgaWYgKCFpc1N0cmluZyh0aGlzLnRhcmdldCkgfHwgdGhpcy50YXJnZXQgPT0gJ19zZWxmJykge1xuICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlQnlJbnN0cnVjdGlvbih0aGlzLl9uYXZpZ2F0aW9uSW5zdHJ1Y3Rpb24pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIl19