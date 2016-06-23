import { ComponentResolver } from '@angular/core';
import { RouterOutlet } from './directives/router_outlet';
import { Type } from './facade/lang';
import { Observable } from './facade/async';
import { RouterUrlSerializer } from './router_url_serializer';
import { Location } from '@angular/common';
import { RouteSegment, UrlTree, RouteTree } from './segments';
/**
 * @internal
 */
export declare class RouterOutletMap {
    /** @internal */
    _outlets: {
        [name: string]: RouterOutlet;
    };
    registerOutlet(name: string, outlet: RouterOutlet): void;
}
/**
 * The `Router` is responsible for mapping URLs to components.
 *
 * You can see the state of the router by inspecting the read-only fields `router.urlTree`
 * and `router.routeTree`.
 */
export declare class Router {
    private _rootComponent;
    private _rootComponentType;
    private _componentResolver;
    private _urlSerializer;
    private _routerOutletMap;
    private _location;
    private _prevTree;
    private _urlTree;
    private _locationSubscription;
    private _changes;
    /**
     * @internal
     */
    constructor(_rootComponent: Object, _rootComponentType: Type, _componentResolver: ComponentResolver, _urlSerializer: RouterUrlSerializer, _routerOutletMap: RouterOutletMap, _location: Location);
    /**
     * Returns the current url tree.
     */
    urlTree: UrlTree;
    /**
     * Returns the current route tree.
     */
    routeTree: RouteTree;
    /**
     * An observable or url changes from the router.
     */
    changes: Observable<void>;
    /**
     * Navigate based on the provided url. This navigation is always absolute.
     *
     * ### Usage
     *
     * ```
     * router.navigateByUrl("/team/33/user/11");
     * ```
     */
    navigateByUrl(url: string): Promise<void>;
    /**
     * Navigate based on the provided array of commands and a starting point.
     * If no segment is provided, the navigation is absolute.
     *
     * ### Usage
     *
     * ```
     * router.navigate(['team', 33, 'team', '11], segment);
     * ```
     */
    navigate(commands: any[], segment?: RouteSegment): Promise<void>;
    /**
     * @internal
     */
    dispose(): void;
    /**
     * Applies an array of commands to the current url tree and creates
     * a new url tree.
     *
     * When given a segment, applies the given commands starting from the segment.
     * When not given a segment, applies the given command starting from the root.
     *
     * ### Usage
     *
     * ```
     * // create /team/33/user/11
     * router.createUrlTree(['/team', 33, 'user', 11]);
     *
     * // create /team/33;expand=true/user/11
     * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
     *
     * // you can collapse static fragments like this
     * router.createUrlTree(['/team/33/user', userId]);
     *
     * // assuming the current url is `/team/33/user/11` and the segment points to `user/11`
     *
     * // navigate to /team/33/user/11/details
     * router.createUrlTree(['details'], segment);
     *
     * // navigate to /team/33/user/22
     * router.createUrlTree(['../22'], segment);
     *
     * // navigate to /team/44/user/22
     * router.createUrlTree(['../../team/44/user/22'], segment);
     * ```
     */
    createUrlTree(commands: any[], segment?: RouteSegment): UrlTree;
    /**
     * Serializes a {@link UrlTree} into a string.
     */
    serializeUrl(url: UrlTree): string;
    private _createInitialTree();
    private _setUpLocationChangeListener();
    private _navigate(url);
}
