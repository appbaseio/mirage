import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { getDOM } from '../../dom/dom_adapter';
export class BrowserPlatformLocation extends PlatformLocation {
    constructor() {
        super();
        this._init();
    }
    // This is moved to its own method so that `MockPlatformLocationStrategy` can overwrite it
    /** @internal */
    _init() {
        this._location = getDOM().getLocation();
        this._history = getDOM().getHistory();
    }
    /** @internal */
    get location() { return this._location; }
    getBaseHrefFromDOM() { return getDOM().getBaseHref(); }
    onPopState(fn) {
        getDOM().getGlobalEventTarget('window').addEventListener('popstate', fn, false);
    }
    onHashChange(fn) {
        getDOM().getGlobalEventTarget('window').addEventListener('hashchange', fn, false);
    }
    get pathname() { return this._location.pathname; }
    get search() { return this._location.search; }
    get hash() { return this._location.hash; }
    set pathname(newPath) { this._location.pathname = newPath; }
    pushState(state, title, url) {
        this._history.pushState(state, title, url);
    }
    replaceState(state, title, url) {
        this._history.replaceState(state, title, url);
    }
    forward() { this._history.forward(); }
    back() { this._history.back(); }
}
BrowserPlatformLocation.decorators = [
    { type: Injectable },
];
BrowserPlatformLocation.ctorParameters = [];
//# sourceMappingURL=browser_platform_location.js.map