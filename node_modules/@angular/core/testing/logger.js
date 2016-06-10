"use strict";
var index_1 = require('../index');
var Log = (function () {
    function Log() {
        this.logItems = [];
    }
    Log.prototype.add = function (value) { this.logItems.push(value); };
    Log.prototype.fn = function (value) {
        var _this = this;
        return function (a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = null; }
            if (a2 === void 0) { a2 = null; }
            if (a3 === void 0) { a3 = null; }
            if (a4 === void 0) { a4 = null; }
            if (a5 === void 0) { a5 = null; }
            _this.logItems.push(value);
        };
    };
    Log.prototype.clear = function () { this.logItems = []; };
    Log.prototype.result = function () { return this.logItems.join("; "); };
    Log.decorators = [
        { type: index_1.Injectable },
    ];
    Log.ctorParameters = [];
    return Log;
}());
exports.Log = Log;
//# sourceMappingURL=logger.js.map