var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApplicationRef } from 'angular2/src/core/application_ref';
import { Injectable } from 'angular2/src/core/di';
/**
 * A no-op implementation of {@link ApplicationRef}, useful for testing.
 */
export let MockApplicationRef = class MockApplicationRef extends ApplicationRef {
    registerBootstrapListener(listener) { }
    registerDisposeListener(dispose) { }
    bootstrap(componentType, bindings) {
        return null;
    }
    get injector() { return null; }
    ;
    get zone() { return null; }
    ;
    dispose() { }
    tick() { }
    get componentTypes() { return null; }
    ;
};
MockApplicationRef = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], MockApplicationRef);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja19hcHBsaWNhdGlvbl9yZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvbW9jay9tb2NrX2FwcGxpY2F0aW9uX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1DQUFtQztPQUN6RCxFQUFDLFVBQVUsRUFBQyxNQUFNLHNCQUFzQjtBQU0vQzs7R0FFRztBQUVILGlFQUF3QyxjQUFjO0lBQ3BELHlCQUF5QixDQUFDLFFBQXFDLElBQVMsQ0FBQztJQUV6RSx1QkFBdUIsQ0FBQyxPQUFtQixJQUFTLENBQUM7SUFFckQsU0FBUyxDQUFDLGFBQW1CLEVBQUUsUUFBeUM7UUFDdEUsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxJQUFJLFFBQVEsS0FBZSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7SUFFekMsSUFBSSxJQUFJLEtBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0lBRW5DLE9BQU8sS0FBVSxDQUFDO0lBRWxCLElBQUksS0FBVSxDQUFDO0lBRWYsSUFBSSxjQUFjLEtBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBQy9DLENBQUM7QUFuQkQ7SUFBQyxVQUFVLEVBQUU7O3NCQUFBO0FBbUJaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBcHBsaWNhdGlvblJlZn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvYXBwbGljYXRpb25fcmVmJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtUeXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtDb21wb25lbnRSZWZ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9keW5hbWljX2NvbXBvbmVudF9sb2FkZXInO1xuaW1wb3J0IHtQcm92aWRlciwgSW5qZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7Tmdab25lfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS96b25lL25nX3pvbmUnO1xuXG4vKipcbiAqIEEgbm8tb3AgaW1wbGVtZW50YXRpb24gb2Yge0BsaW5rIEFwcGxpY2F0aW9uUmVmfSwgdXNlZnVsIGZvciB0ZXN0aW5nLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTW9ja0FwcGxpY2F0aW9uUmVmIGV4dGVuZHMgQXBwbGljYXRpb25SZWYge1xuICByZWdpc3RlckJvb3RzdHJhcExpc3RlbmVyKGxpc3RlbmVyOiAocmVmOiBDb21wb25lbnRSZWYpID0+IHZvaWQpOiB2b2lkIHt9XG5cbiAgcmVnaXN0ZXJEaXNwb3NlTGlzdGVuZXIoZGlzcG9zZTogKCkgPT4gdm9pZCk6IHZvaWQge31cblxuICBib290c3RyYXAoY29tcG9uZW50VHlwZTogVHlwZSwgYmluZGluZ3M/OiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pOiBQcm9taXNlPENvbXBvbmVudFJlZj4ge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0IGluamVjdG9yKCk6IEluamVjdG9yIHsgcmV0dXJuIG51bGw7IH07XG5cbiAgZ2V0IHpvbmUoKTogTmdab25lIHsgcmV0dXJuIG51bGw7IH07XG5cbiAgZGlzcG9zZSgpOiB2b2lkIHt9XG5cbiAgdGljaygpOiB2b2lkIHt9XG5cbiAgZ2V0IGNvbXBvbmVudFR5cGVzKCk6IFR5cGVbXSB7IHJldHVybiBudWxsOyB9O1xufVxuIl19