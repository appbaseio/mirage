import { Injectable, Inject, OpaqueToken } from '@angular/core';
import { isPresent } from '../../../src/facade/lang';
import { BaseException } from '../../../src/facade/exceptions';
import { HammerGesturesPluginCommon } from './hammer_common';
export const HAMMER_GESTURE_CONFIG = 
/*@ts2dart_const*/ new OpaqueToken("HammerGestureConfig");
export class HammerGestureConfig {
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
}
HammerGestureConfig.decorators = [
    { type: Injectable },
];
export class HammerGesturesPlugin extends HammerGesturesPluginCommon {
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
            var callback = function (eventObj) { zone.runGuarded(function () { handler(eventObj); }); };
            mc.on(eventName, callback);
            return () => { mc.off(eventName, callback); };
        });
    }
    isCustomEvent(eventName) { return this._config.events.indexOf(eventName) > -1; }
}
HammerGesturesPlugin.decorators = [
    { type: Injectable },
];
HammerGesturesPlugin.ctorParameters = [
    { type: HammerGestureConfig, decorators: [{ type: Inject, args: [HAMMER_GESTURE_CONFIG,] },] },
];
//# sourceMappingURL=hammer_gestures.js.map