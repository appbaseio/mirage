import { Type } from '@angular/core';
/**
 * Information about a route.
 *
 * It has the following properties:
 * - `path` is a string that uses the route matcher DSL.
 * - `component` a component type.
 *
 * ### Example
 * ```
 * import {Routes} from '@angular/router';
 *
 * @Routes([
 *   {path: '/home', component: HomeCmp}
 * ])
 * class MyApp {}
 * ```
 *
 * @ts2dart_const
 */
export declare abstract class RouteMetadata {
    readonly abstract path: string;
    readonly abstract component: Type;
}
/**
 * See {@link RouteMetadata} for more information.
 * @ts2dart_const
 */
export declare class Route implements RouteMetadata {
    path: string;
    component: Type;
    constructor({path, component}?: {
        path?: string;
        component?: Type;
    });
    toString(): string;
}
/**
 * Defines routes for a given component.
 *
 * It takes an array of {@link RouteMetadata}s.
 * @ts2dart_const
 */
export declare class RoutesMetadata {
    routes: RouteMetadata[];
    constructor(routes: RouteMetadata[]);
    toString(): string;
}
