import { stringify } from "../facade/lang";
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
export class RouteMetadata {
    get path() { }
    get component() { }
}
/**
 * See {@link RouteMetadata} for more information.
 * @ts2dart_const
 */
export class Route {
    constructor({ path, component } = {}) {
        this.path = path;
        this.component = component;
    }
    toString() { return `@Route(${this.path}, ${stringify(this.component)})`; }
}
/**
 * Defines routes for a given component.
 *
 * It takes an array of {@link RouteMetadata}s.
 * @ts2dart_const
 */
export class RoutesMetadata {
    constructor(routes) {
        this.routes = routes;
    }
    toString() { return `@Routes(${this.routes})`; }
}
//# sourceMappingURL=metadata.js.map