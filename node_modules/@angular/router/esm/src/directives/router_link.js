import { Directive, HostListener, HostBinding, Input, Optional } from '@angular/core';
import { Router } from '../router';
import { RouteSegment } from '../segments';
import { isString, isArray, isPresent } from '../facade/lang';
import { ObservableWrapper } from '../facade/async';
export class RouterLink {
    constructor(_routeSegment, _router) {
        this._routeSegment = _routeSegment;
        this._router = _router;
        this._commands = [];
        this.isActive = false;
        // because auxiliary links take existing primary and auxiliary routes into account,
        // we need to update the link whenever params or other routes change.
        this._subscription =
            ObservableWrapper.subscribe(_router.changes, (_) => { this._updateTargetUrlAndHref(); });
    }
    ngOnDestroy() { ObservableWrapper.dispose(this._subscription); }
    set routerLink(data) {
        if (isArray(data)) {
            this._commands = data;
        }
        else {
            this._commands = [data];
        }
        this._updateTargetUrlAndHref();
    }
    onClick() {
        // If no target, or if target is _self, prevent default browser behavior
        if (!isString(this.target) || this.target == '_self') {
            this._router.navigate(this._commands, this._routeSegment);
            return false;
        }
        return true;
    }
    _updateTargetUrlAndHref() {
        let tree = this._router.createUrlTree(this._commands, this._routeSegment);
        if (isPresent(tree)) {
            this.href = this._router.serializeUrl(tree);
            this.isActive = this._router.urlTree.contains(tree);
        }
        else {
            this.isActive = false;
        }
    }
}
RouterLink.decorators = [
    { type: Directive, args: [{ selector: '[routerLink]' },] },
];
RouterLink.ctorParameters = [
    { type: RouteSegment, decorators: [{ type: Optional },] },
    { type: Router, },
];
RouterLink.propDecorators = {
    'target': [{ type: Input },],
    'href': [{ type: HostBinding },],
    'isActive': [{ type: HostBinding, args: ['class.router-link-active',] },],
    'routerLink': [{ type: Input },],
    'onClick': [{ type: HostListener, args: ["click",] },],
};
//# sourceMappingURL=router_link.js.map