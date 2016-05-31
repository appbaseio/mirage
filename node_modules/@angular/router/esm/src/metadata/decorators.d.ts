import { RoutesMetadata, RouteMetadata } from "./metadata";
/**
 * Defines routes for a given component.
 *
 * It takes an array of {@link RouteMetadata}s.
 */
export interface RoutesFactory {
    (routes: RouteMetadata[]): any;
    new (routes: RouteMetadata[]): RoutesMetadata;
}
/**
 * Defines routes for a given component.
 *
 * It takes an array of {@link RouteMetadata}s.
 */
export declare var Routes: RoutesFactory;
