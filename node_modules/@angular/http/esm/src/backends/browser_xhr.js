import { Injectable } from '@angular/core';
export class BrowserXhr {
    constructor() {
    }
    build() { return (new XMLHttpRequest()); }
}
BrowserXhr.decorators = [
    { type: Injectable },
];
BrowserXhr.ctorParameters = [];
//# sourceMappingURL=browser_xhr.js.map