import { UrlChangeListener, PlatformLocation } from '@angular/common';
/**
 * `PlatformLocation` encapsulates all of the direct calls to platform APIs.
 * This class should not be used directly by an application developer. Instead, use
 * {@link Location}.
 */
export declare class BrowserPlatformLocation extends PlatformLocation {
    private _location;
    private _history;
    constructor();
    /** @internal */
    _init(): void;
    /** @internal */
    readonly location: Location;
    getBaseHrefFromDOM(): string;
    onPopState(fn: UrlChangeListener): void;
    onHashChange(fn: UrlChangeListener): void;
    pathname: string;
    readonly search: string;
    readonly hash: string;
    pushState(state: any, title: string, url: string): void;
    replaceState(state: any, title: string, url: string): void;
    forward(): void;
    back(): void;
}
