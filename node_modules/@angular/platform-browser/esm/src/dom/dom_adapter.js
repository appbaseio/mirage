import { isBlank } from '../../src/facade/lang';
var _DOM = null;
export function getDOM() {
    return _DOM;
}
export function setDOM(adapter) {
    _DOM = adapter;
}
export function setRootDomAdapter(adapter) {
    if (isBlank(_DOM)) {
        _DOM = adapter;
    }
}
/* tslint:disable:requireParameterType */
/**
 * Provides DOM operations in an environment-agnostic way.
 */
export class DomAdapter {
    constructor() {
        this.xhrType = null;
    }
    /** @deprecated */
    getXHR() { return this.xhrType; }
    /**
     * Maps attribute names to their corresponding property names for cases
     * where attribute name doesn't match property name.
     */
    get attrToPropMap() { return this._attrToPropMap; }
    ;
    set attrToPropMap(value) { this._attrToPropMap = value; }
    ;
}
//# sourceMappingURL=dom_adapter.js.map