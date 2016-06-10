"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var index_1 = require('../index');
var async_1 = require('../src/facade/async');
var MockNgZone = (function (_super) {
    __extends(MockNgZone, _super);
    function MockNgZone() {
        _super.call(this, { enableLongStackTrace: false });
        /** @internal */
        this._mockOnStable = new async_1.EventEmitter(false);
    }
    Object.defineProperty(MockNgZone.prototype, "onStable", {
        get: function () { return this._mockOnStable; },
        enumerable: true,
        configurable: true
    });
    MockNgZone.prototype.run = function (fn) { return fn(); };
    MockNgZone.prototype.runOutsideAngular = function (fn) { return fn(); };
    MockNgZone.prototype.simulateZoneExit = function () { async_1.ObservableWrapper.callNext(this.onStable, null); };
    MockNgZone.decorators = [
        { type: index_1.Injectable },
    ];
    MockNgZone.ctorParameters = [];
    return MockNgZone;
}(index_1.NgZone));
exports.MockNgZone = MockNgZone;
//# sourceMappingURL=ng_zone_mock.js.map