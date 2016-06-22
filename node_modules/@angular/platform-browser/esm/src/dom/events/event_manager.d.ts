import { OpaqueToken, NgZone } from '@angular/core';
export declare const EVENT_MANAGER_PLUGINS: OpaqueToken;
export declare class EventManager {
    private _zone;
    private _plugins;
    constructor(plugins: EventManagerPlugin[], _zone: NgZone);
    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function;
    addGlobalEventListener(target: string, eventName: string, handler: Function): Function;
    getZone(): NgZone;
    /** @internal */
    _findPluginFor(eventName: string): EventManagerPlugin;
}
export declare class EventManagerPlugin {
    manager: EventManager;
    supports(eventName: string): boolean;
    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function;
    addGlobalEventListener(element: string, eventName: string, handler: Function): Function;
}
