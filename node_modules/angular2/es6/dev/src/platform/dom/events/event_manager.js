var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { CONST_EXPR } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { Injectable, Inject, OpaqueToken } from 'angular2/src/core/di';
import { NgZone } from 'angular2/src/core/zone/ng_zone';
import { ListWrapper } from 'angular2/src/facade/collection';
export const EVENT_MANAGER_PLUGINS = CONST_EXPR(new OpaqueToken("EventManagerPlugins"));
export let EventManager = class EventManager {
    constructor(plugins, _zone) {
        this._zone = _zone;
        plugins.forEach(p => p.manager = this);
        this._plugins = ListWrapper.reversed(plugins);
    }
    addEventListener(element, eventName, handler) {
        var plugin = this._findPluginFor(eventName);
        return plugin.addEventListener(element, eventName, handler);
    }
    addGlobalEventListener(target, eventName, handler) {
        var plugin = this._findPluginFor(eventName);
        return plugin.addGlobalEventListener(target, eventName, handler);
    }
    getZone() { return this._zone; }
    /** @internal */
    _findPluginFor(eventName) {
        var plugins = this._plugins;
        for (var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i];
            if (plugin.supports(eventName)) {
                return plugin;
            }
        }
        throw new BaseException(`No event manager plugin found for event ${eventName}`);
    }
};
EventManager = __decorate([
    Injectable(),
    __param(0, Inject(EVENT_MANAGER_PLUGINS)), 
    __metadata('design:paramtypes', [Array, NgZone])
], EventManager);
export class EventManagerPlugin {
    // That is equivalent to having supporting $event.target
    supports(eventName) { return false; }
    addEventListener(element, eventName, handler) {
        throw "not implemented";
    }
    addGlobalEventListener(element, eventName, handler) {
        throw "not implemented";
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZXZlbnRzL2V2ZW50X21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O09BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSwwQkFBMEI7T0FDNUMsRUFBQyxhQUFhLEVBQW1CLE1BQU0sZ0NBQWdDO09BQ3ZFLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUMsTUFBTSxzQkFBc0I7T0FDN0QsRUFBQyxNQUFNLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDOUMsRUFBQyxXQUFXLEVBQUMsTUFBTSxnQ0FBZ0M7QUFFMUQsT0FBTyxNQUFNLHFCQUFxQixHQUM5QixVQUFVLENBQUMsSUFBSSxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0FBR3ZEO0lBR0UsWUFBMkMsT0FBNkIsRUFBVSxLQUFhO1FBQWIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUM3RixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsT0FBb0IsRUFBRSxTQUFpQixFQUFFLE9BQWlCO1FBQ3pFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxNQUFjLEVBQUUsU0FBaUIsRUFBRSxPQUFpQjtRQUN6RSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsT0FBTyxLQUFhLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUV4QyxnQkFBZ0I7SUFDaEIsY0FBYyxDQUFDLFNBQWlCO1FBQzlCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDNUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hCLENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxJQUFJLGFBQWEsQ0FBQywyQ0FBMkMsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUNsRixDQUFDO0FBQ0gsQ0FBQztBQWhDRDtJQUFDLFVBQVUsRUFBRTtlQUlFLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQzs7Z0JBSi9CO0FBa0NiO0lBR0Usd0RBQXdEO0lBQ3hELFFBQVEsQ0FBQyxTQUFpQixJQUFhLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRXRELGdCQUFnQixDQUFDLE9BQW9CLEVBQUUsU0FBaUIsRUFBRSxPQUFpQjtRQUN6RSxNQUFNLGlCQUFpQixDQUFDO0lBQzFCLENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxPQUFlLEVBQUUsU0FBaUIsRUFBRSxPQUFpQjtRQUMxRSxNQUFNLGlCQUFpQixDQUFDO0lBQzFCLENBQUM7QUFDSCxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NPTlNUX0VYUFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0luamVjdGFibGUsIEluamVjdCwgT3BhcXVlVG9rZW59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7Tmdab25lfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS96b25lL25nX3pvbmUnO1xuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuZXhwb3J0IGNvbnN0IEVWRU5UX01BTkFHRVJfUExVR0lOUzogT3BhcXVlVG9rZW4gPVxuICAgIENPTlNUX0VYUFIobmV3IE9wYXF1ZVRva2VuKFwiRXZlbnRNYW5hZ2VyUGx1Z2luc1wiKSk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFdmVudE1hbmFnZXIge1xuICBwcml2YXRlIF9wbHVnaW5zOiBFdmVudE1hbmFnZXJQbHVnaW5bXTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KEVWRU5UX01BTkFHRVJfUExVR0lOUykgcGx1Z2luczogRXZlbnRNYW5hZ2VyUGx1Z2luW10sIHByaXZhdGUgX3pvbmU6IE5nWm9uZSkge1xuICAgIHBsdWdpbnMuZm9yRWFjaChwID0+IHAubWFuYWdlciA9IHRoaXMpO1xuICAgIHRoaXMuX3BsdWdpbnMgPSBMaXN0V3JhcHBlci5yZXZlcnNlZChwbHVnaW5zKTtcbiAgfVxuXG4gIGFkZEV2ZW50TGlzdGVuZXIoZWxlbWVudDogSFRNTEVsZW1lbnQsIGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICB2YXIgcGx1Z2luID0gdGhpcy5fZmluZFBsdWdpbkZvcihldmVudE5hbWUpO1xuICAgIHJldHVybiBwbHVnaW4uYWRkRXZlbnRMaXN0ZW5lcihlbGVtZW50LCBldmVudE5hbWUsIGhhbmRsZXIpO1xuICB9XG5cbiAgYWRkR2xvYmFsRXZlbnRMaXN0ZW5lcih0YXJnZXQ6IHN0cmluZywgZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIHZhciBwbHVnaW4gPSB0aGlzLl9maW5kUGx1Z2luRm9yKGV2ZW50TmFtZSk7XG4gICAgcmV0dXJuIHBsdWdpbi5hZGRHbG9iYWxFdmVudExpc3RlbmVyKHRhcmdldCwgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgfVxuXG4gIGdldFpvbmUoKTogTmdab25lIHsgcmV0dXJuIHRoaXMuX3pvbmU7IH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9maW5kUGx1Z2luRm9yKGV2ZW50TmFtZTogc3RyaW5nKTogRXZlbnRNYW5hZ2VyUGx1Z2luIHtcbiAgICB2YXIgcGx1Z2lucyA9IHRoaXMuX3BsdWdpbnM7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcGx1Z2luID0gcGx1Z2luc1tpXTtcbiAgICAgIGlmIChwbHVnaW4uc3VwcG9ydHMoZXZlbnROYW1lKSkge1xuICAgICAgICByZXR1cm4gcGx1Z2luO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgTm8gZXZlbnQgbWFuYWdlciBwbHVnaW4gZm91bmQgZm9yIGV2ZW50ICR7ZXZlbnROYW1lfWApO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFdmVudE1hbmFnZXJQbHVnaW4ge1xuICBtYW5hZ2VyOiBFdmVudE1hbmFnZXI7XG5cbiAgLy8gVGhhdCBpcyBlcXVpdmFsZW50IHRvIGhhdmluZyBzdXBwb3J0aW5nICRldmVudC50YXJnZXRcbiAgc3VwcG9ydHMoZXZlbnROYW1lOiBzdHJpbmcpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgYWRkRXZlbnRMaXN0ZW5lcihlbGVtZW50OiBIVE1MRWxlbWVudCwgZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIHRocm93IFwibm90IGltcGxlbWVudGVkXCI7XG4gIH1cblxuICBhZGRHbG9iYWxFdmVudExpc3RlbmVyKGVsZW1lbnQ6IHN0cmluZywgZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIHRocm93IFwibm90IGltcGxlbWVudGVkXCI7XG4gIH1cbn0iXX0=