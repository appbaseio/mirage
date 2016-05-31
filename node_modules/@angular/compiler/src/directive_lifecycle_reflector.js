"use strict";
var core_private_1 = require('../core_private');
var lang_1 = require('../src/facade/lang');
function hasLifecycleHook(lcInterface, token) {
    if (!(token instanceof lang_1.Type))
        return false;
    var proto = token.prototype;
    switch (lcInterface) {
        case core_private_1.LifecycleHooks.AfterContentInit:
            return !!proto.ngAfterContentInit;
        case core_private_1.LifecycleHooks.AfterContentChecked:
            return !!proto.ngAfterContentChecked;
        case core_private_1.LifecycleHooks.AfterViewInit:
            return !!proto.ngAfterViewInit;
        case core_private_1.LifecycleHooks.AfterViewChecked:
            return !!proto.ngAfterViewChecked;
        case core_private_1.LifecycleHooks.OnChanges:
            return !!proto.ngOnChanges;
        case core_private_1.LifecycleHooks.DoCheck:
            return !!proto.ngDoCheck;
        case core_private_1.LifecycleHooks.OnDestroy:
            return !!proto.ngOnDestroy;
        case core_private_1.LifecycleHooks.OnInit:
            return !!proto.ngOnInit;
        default:
            return false;
    }
}
exports.hasLifecycleHook = hasLifecycleHook;
//# sourceMappingURL=directive_lifecycle_reflector.js.map