import { Type } from '../../../src/facade/lang';
import { RouteHandler } from './route_handler';
import { RouteData } from '../../instruction';
export declare class AsyncRouteHandler implements RouteHandler {
    private _loader;
    /** @internal */
    _resolvedComponent: Promise<Type>;
    componentType: Type;
    data: RouteData;
    constructor(_loader: () => Promise<Type>, data?: {
        [key: string]: any;
    });
    resolveComponentType(): Promise<Type>;
}
