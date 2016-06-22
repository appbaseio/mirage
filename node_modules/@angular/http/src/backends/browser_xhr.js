"use strict";
var core_1 = require('@angular/core');
var BrowserXhr = (function () {
    function BrowserXhr() {
    }
    BrowserXhr.prototype.build = function () { return (new XMLHttpRequest()); };
    BrowserXhr.decorators = [
        { type: core_1.Injectable },
    ];
    BrowserXhr.ctorParameters = [];
    return BrowserXhr;
}());
exports.BrowserXhr = BrowserXhr;
//# sourceMappingURL=browser_xhr.js.map