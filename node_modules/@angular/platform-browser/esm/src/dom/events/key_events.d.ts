import { NgZone } from '@angular/core';
import { EventManagerPlugin } from './event_manager';
export declare class KeyEventsPlugin extends EventManagerPlugin {
    constructor();
    supports(eventName: string): boolean;
    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function;
    static parseEventName(eventName: string): {
        [key: string]: string;
    };
    static getEventFullKey(event: KeyboardEvent): string;
    static eventCallback(element: HTMLElement, fullKey: any, handler: Function, zone: NgZone): Function;
    /** @internal */
    static _normalizeKey(keyName: string): string;
}
