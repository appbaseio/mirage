import { Injectable } from '@angular/core';
import { EventEmitter, ObservableWrapper } from '../../src/facade/async';
import { LocationStrategy } from './location_strategy';
export class Location {
    constructor(platformStrategy) {
        this.platformStrategy = platformStrategy;
        /** @internal */
        this._subject = new EventEmitter();
        var browserBaseHref = this.platformStrategy.getBaseHref();
        this._baseHref = Location.stripTrailingSlash(_stripIndexHtml(browserBaseHref));
        this.platformStrategy.onPopState((ev) => {
            ObservableWrapper.callEmit(this._subject, { 'url': this.path(), 'pop': true, 'type': ev.type });
        });
    }
    /**
     * Returns the normalized URL path.
     */
    path() { return this.normalize(this.platformStrategy.path()); }
    /**
     * Given a string representing a URL, returns the normalized URL path without leading or
     * trailing slashes
     */
    normalize(url) {
        return Location.stripTrailingSlash(_stripBaseHref(this._baseHref, _stripIndexHtml(url)));
    }
    /**
     * Given a string representing a URL, returns the platform-specific external URL path.
     * If the given URL doesn't begin with a leading slash (`'/'`), this method adds one
     * before normalizing. This method will also add a hash if `HashLocationStrategy` is
     * used, or the `APP_BASE_HREF` if the `PathLocationStrategy` is in use.
     */
    prepareExternalUrl(url) {
        if (url.length > 0 && !url.startsWith('/')) {
            url = '/' + url;
        }
        return this.platformStrategy.prepareExternalUrl(url);
    }
    // TODO: rename this method to pushState
    /**
     * Changes the browsers URL to the normalized version of the given URL, and pushes a
     * new item onto the platform's history.
     */
    go(path, query = '') {
        this.platformStrategy.pushState(null, '', path, query);
    }
    /**
     * Changes the browsers URL to the normalized version of the given URL, and replaces
     * the top item on the platform's history stack.
     */
    replaceState(path, query = '') {
        this.platformStrategy.replaceState(null, '', path, query);
    }
    /**
     * Navigates forward in the platform's history.
     */
    forward() { this.platformStrategy.forward(); }
    /**
     * Navigates back in the platform's history.
     */
    back() { this.platformStrategy.back(); }
    /**
     * Subscribe to the platform's `popState` events.
     */
    subscribe(onNext, onThrow = null, onReturn = null) {
        return ObservableWrapper.subscribe(this._subject, onNext, onThrow, onReturn);
    }
    /**
     * Given a string of url parameters, prepend with '?' if needed, otherwise return parameters as
     * is.
     */
    static normalizeQueryParams(params) {
        return (params.length > 0 && params.substring(0, 1) != '?') ? ('?' + params) : params;
    }
    /**
     * Given 2 parts of a url, join them with a slash if needed.
     */
    static joinWithSlash(start, end) {
        if (start.length == 0) {
            return end;
        }
        if (end.length == 0) {
            return start;
        }
        var slashes = 0;
        if (start.endsWith('/')) {
            slashes++;
        }
        if (end.startsWith('/')) {
            slashes++;
        }
        if (slashes == 2) {
            return start + end.substring(1);
        }
        if (slashes == 1) {
            return start + end;
        }
        return start + '/' + end;
    }
    /**
     * If url has a trailing slash, remove it, otherwise return url as is.
     */
    static stripTrailingSlash(url) {
        if (/\/$/g.test(url)) {
            url = url.substring(0, url.length - 1);
        }
        return url;
    }
}
Location.decorators = [
    { type: Injectable },
];
Location.ctorParameters = [
    { type: LocationStrategy, },
];
function _stripBaseHref(baseHref, url) {
    if (baseHref.length > 0 && url.startsWith(baseHref)) {
        return url.substring(baseHref.length);
    }
    return url;
}
function _stripIndexHtml(url) {
    if (/\/index.html$/g.test(url)) {
        // '/index.html'.length == 11
        return url.substring(0, url.length - 11);
    }
    return url;
}
//# sourceMappingURL=location.js.map