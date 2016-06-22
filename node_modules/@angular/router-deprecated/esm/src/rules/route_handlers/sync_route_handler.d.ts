import { Type } from '../../../src/facade/lang';
import { RouteHandler } from './route_handler';
import { RouteData } from '../../instruction';
export declare class SyncRouteHandler implements RouteHandler {
    componentType: Type;
    data: RouteData;
    /** @internal */
    _resolvedComponent: Promise<any>;
    constructor(componentType: Type, data?: {
        [key: string]: any;
    });
    resolveComponentType(): Promise<any>;
}
