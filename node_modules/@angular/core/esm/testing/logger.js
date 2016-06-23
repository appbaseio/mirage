import { Injectable } from '../index';
export class Log {
    constructor() {
        this.logItems = [];
    }
    add(value) { this.logItems.push(value); }
    fn(value) {
        return (a1 = null, a2 = null, a3 = null, a4 = null, a5 = null) => {
            this.logItems.push(value);
        };
    }
    clear() { this.logItems = []; }
    result() { return this.logItems.join("; "); }
}
Log.decorators = [
    { type: Injectable },
];
Log.ctorParameters = [];
//# sourceMappingURL=logger.js.map