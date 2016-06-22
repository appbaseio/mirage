import { PromiseWrapper } from '../../../src/facade/async';
import { isPresent } from '../../../src/facade/lang';
import { RouteData, BLANK_ROUTE_DATA } from '../../instruction';
export class SyncRouteHandler {
    constructor(componentType, data) {
        this.componentType = componentType;
        /** @internal */
        this._resolvedComponent = null;
        this._resolvedComponent = PromiseWrapper.resolve(componentType);
        this.data = isPresent(data) ? new RouteData(data) : BLANK_ROUTE_DATA;
    }
    resolveComponentType() { return this._resolvedComponent; }
}
//# sourceMappingURL=sync_route_handler.js.map