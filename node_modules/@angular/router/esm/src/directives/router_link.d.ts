import { OnDestroy } from '@angular/core';
import { Router } from '../router';
import { RouteSegment } from '../segments';
/**
 * The RouterLink directive lets you link to specific parts of your app.
 *
 * Consider the following route configuration:

 * ```
 * @Routes([
 *   { path: '/user', component: UserCmp }
 * ]);
 * class MyComp {}
 * ```
 *
 * When linking to this `User` route, you can write:
 *
 * ```
 * <a [routerLink]="['/user']">link to user component</a>
 * ```
 *
 * RouterLink expects the value to be an array of path segments, followed by the params
 * for that level of routing. For instance `['/team', {teamId: 1}, 'user', {userId: 2}]`
 * means that we want to generate a link to `/team;teamId=1/user;userId=2`.
 *
 * The first segment name can be prepended with `/`, `./`, or `../`.
 * If the segment begins with `/`, the router will look up the route from the root of the app.
 * If the segment begins with `./`, or doesn't begin with a slash, the router will
 * instead look in the current component's children for the route.
 * And if the segment begins with `../`, the router will go up one segment in the url.
 *
 * See {@link Router.createUrlTree} for more information.
 */
export declare class RouterLink implements OnDestroy {
    private _routeSegment;
    private _router;
    target: string;
    private _commands;
    private _subscription;
    href: string;
    isActive: boolean;
    constructor(_routeSegment: RouteSegment, _router: Router);
    ngOnDestroy(): void;
    routerLink: any[] | any;
    onClick(): boolean;
    private _updateTargetUrlAndHref();
}
