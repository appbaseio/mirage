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
import { HammerGesturesPluginCommon } from './hammer_common';
import { isPresent, CONST_EXPR } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { Injectable, Inject, OpaqueToken } from 'angular2/core';
export const HAMMER_GESTURE_CONFIG = CONST_EXPR(new OpaqueToken("HammerGestureConfig"));
export let HammerGestureConfig = class HammerGestureConfig {
    constructor() {
        this.events = [];
        this.overrides = {};
    }
    buildHammer(element) {
        var mc = new Hammer(element);
        mc.get('pinch').set({ enable: true });
        mc.get('rotate').set({ enable: true });
        for (let eventName in this.overrides) {
            mc.get(eventName).set(this.overrides[eventName]);
        }
        return mc;
    }
};
HammerGestureConfig = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], HammerGestureConfig);
export let HammerGesturesPlugin = class HammerGesturesPlugin extends HammerGesturesPluginCommon {
    constructor(_config) {
        super();
        this._config = _config;
    }
    supports(eventName) {
        if (!super.supports(eventName) && !this.isCustomEvent(eventName))
            return false;
        if (!isPresent(window['Hammer'])) {
            throw new BaseException(`Hammer.js is not loaded, can not bind ${eventName} event`);
        }
        return true;
    }
    addEventListener(element, eventName, handler) {
        var zone = this.manager.getZone();
        eventName = eventName.toLowerCase();
        return zone.runOutsideAngular(() => {
            // Creating the manager bind events, must be done outside of angular
            var mc = this._config.buildHammer(element);
            var callback = function (eventObj) { zone.run(function () { handler(eventObj); }); };
            mc.on(eventName, callback);
            return () => { mc.off(eventName, callback); };
        });
    }
    isCustomEvent(eventName) { return this._config.events.indexOf(eventName) > -1; }
};
HammerGesturesPlugin = __decorate([
    Injectable(),
    __param(0, Inject(HAMMER_GESTURE_CONFIG)), 
    __metadata('design:paramtypes', [HammerGestureConfig])
], HammerGesturesPlugin);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyX2dlc3R1cmVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9ldmVudHMvaGFtbWVyX2dlc3R1cmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxpQkFBaUI7T0FDbkQsRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFDLE1BQU0sMEJBQTBCO09BQ3ZELEVBQUMsYUFBYSxFQUFtQixNQUFNLGdDQUFnQztPQUN2RSxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZTtBQUU3RCxPQUFPLE1BQU0scUJBQXFCLEdBQzlCLFVBQVUsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7QUFRdkQ7SUFBQTtRQUNFLFdBQU0sR0FBYSxFQUFFLENBQUM7UUFFdEIsY0FBUyxHQUE0QixFQUFFLENBQUM7SUFjMUMsQ0FBQztJQVpDLFdBQVcsQ0FBQyxPQUFvQjtRQUM5QixJQUFJLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU3QixFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFFckMsR0FBRyxDQUFDLENBQUMsSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDckMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFFRCxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztBQUNILENBQUM7QUFsQkQ7SUFBQyxVQUFVLEVBQUU7O3VCQUFBO0FBcUJiLHFFQUEwQywwQkFBMEI7SUFDbEUsWUFBbUQsT0FBNEI7UUFBSSxPQUFPLENBQUM7UUFBeEMsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7SUFBYSxDQUFDO0lBRTdGLFFBQVEsQ0FBQyxTQUFpQjtRQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUUvRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxJQUFJLGFBQWEsQ0FBQyx5Q0FBeUMsU0FBUyxRQUFRLENBQUMsQ0FBQztRQUN0RixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxPQUFvQixFQUFFLFNBQWlCLEVBQUUsT0FBaUI7UUFDekUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQyxTQUFTLEdBQUcsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRXBDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7WUFDNUIsb0VBQW9FO1lBQ3BFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNDLElBQUksUUFBUSxHQUFHLFVBQVMsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRixFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMzQixNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxhQUFhLENBQUMsU0FBaUIsSUFBYSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRyxDQUFDO0FBNUJEO0lBQUMsVUFBVSxFQUFFO2VBRUUsTUFBTSxDQUFDLHFCQUFxQixDQUFDOzt3QkFGL0I7QUE0QloiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0hhbW1lckdlc3R1cmVzUGx1Z2luQ29tbW9ufSBmcm9tICcuL2hhbW1lcl9jb21tb24nO1xuaW1wb3J0IHtpc1ByZXNlbnQsIENPTlNUX0VYUFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0luamVjdGFibGUsIEluamVjdCwgT3BhcXVlVG9rZW59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5leHBvcnQgY29uc3QgSEFNTUVSX0dFU1RVUkVfQ09ORklHOiBPcGFxdWVUb2tlbiA9XG4gICAgQ09OU1RfRVhQUihuZXcgT3BhcXVlVG9rZW4oXCJIYW1tZXJHZXN0dXJlQ29uZmlnXCIpKTtcblxuZXhwb3J0IGludGVyZmFjZSBIYW1tZXJJbnN0YW5jZSB7XG4gIG9uKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkO1xuICBvZmYoZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQ7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBIYW1tZXJHZXN0dXJlQ29uZmlnIHtcbiAgZXZlbnRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIG92ZXJyaWRlczoge1trZXk6IHN0cmluZ106IE9iamVjdH0gPSB7fTtcblxuICBidWlsZEhhbW1lcihlbGVtZW50OiBIVE1MRWxlbWVudCk6IEhhbW1lckluc3RhbmNlIHtcbiAgICB2YXIgbWMgPSBuZXcgSGFtbWVyKGVsZW1lbnQpO1xuXG4gICAgbWMuZ2V0KCdwaW5jaCcpLnNldCh7ZW5hYmxlOiB0cnVlfSk7XG4gICAgbWMuZ2V0KCdyb3RhdGUnKS5zZXQoe2VuYWJsZTogdHJ1ZX0pO1xuXG4gICAgZm9yIChsZXQgZXZlbnROYW1lIGluIHRoaXMub3ZlcnJpZGVzKSB7XG4gICAgICBtYy5nZXQoZXZlbnROYW1lKS5zZXQodGhpcy5vdmVycmlkZXNbZXZlbnROYW1lXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1jO1xuICB9XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBIYW1tZXJHZXN0dXJlc1BsdWdpbiBleHRlbmRzIEhhbW1lckdlc3R1cmVzUGx1Z2luQ29tbW9uIHtcbiAgY29uc3RydWN0b3IoQEluamVjdChIQU1NRVJfR0VTVFVSRV9DT05GSUcpIHByaXZhdGUgX2NvbmZpZzogSGFtbWVyR2VzdHVyZUNvbmZpZykgeyBzdXBlcigpOyB9XG5cbiAgc3VwcG9ydHMoZXZlbnROYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoIXN1cGVyLnN1cHBvcnRzKGV2ZW50TmFtZSkgJiYgIXRoaXMuaXNDdXN0b21FdmVudChldmVudE5hbWUpKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiAoIWlzUHJlc2VudCh3aW5kb3dbJ0hhbW1lciddKSkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYEhhbW1lci5qcyBpcyBub3QgbG9hZGVkLCBjYW4gbm90IGJpbmQgJHtldmVudE5hbWV9IGV2ZW50YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBldmVudE5hbWU6IHN0cmluZywgaGFuZGxlcjogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gICAgdmFyIHpvbmUgPSB0aGlzLm1hbmFnZXIuZ2V0Wm9uZSgpO1xuICAgIGV2ZW50TmFtZSA9IGV2ZW50TmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgcmV0dXJuIHpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgLy8gQ3JlYXRpbmcgdGhlIG1hbmFnZXIgYmluZCBldmVudHMsIG11c3QgYmUgZG9uZSBvdXRzaWRlIG9mIGFuZ3VsYXJcbiAgICAgIHZhciBtYyA9IHRoaXMuX2NvbmZpZy5idWlsZEhhbW1lcihlbGVtZW50KTtcbiAgICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKGV2ZW50T2JqKSB7IHpvbmUucnVuKGZ1bmN0aW9uKCkgeyBoYW5kbGVyKGV2ZW50T2JqKTsgfSk7IH07XG4gICAgICBtYy5vbihldmVudE5hbWUsIGNhbGxiYWNrKTtcbiAgICAgIHJldHVybiAoKSA9PiB7IG1jLm9mZihldmVudE5hbWUsIGNhbGxiYWNrKTsgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGlzQ3VzdG9tRXZlbnQoZXZlbnROYW1lOiBzdHJpbmcpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NvbmZpZy5ldmVudHMuaW5kZXhPZihldmVudE5hbWUpID4gLTE7IH1cbn1cbiJdfQ==