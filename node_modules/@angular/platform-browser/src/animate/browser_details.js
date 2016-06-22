"use strict";
var core_1 = require('@angular/core');
var math_1 = require('../../src/facade/math');
var dom_adapter_1 = require('../dom/dom_adapter');
var BrowserDetails = (function () {
    function BrowserDetails() {
        this.elapsedTimeIncludesDelay = false;
        this.doesElapsedTimeIncludesDelay();
    }
    /**
     * Determines if `event.elapsedTime` includes transition delay in the current browser.  At this
     * time, Chrome and Opera seem to be the only browsers that include this.
     */
    BrowserDetails.prototype.doesElapsedTimeIncludesDelay = function () {
        var _this = this;
        var div = dom_adapter_1.getDOM().createElement('div');
        dom_adapter_1.getDOM().setAttribute(div, 'style', "position: absolute; top: -9999px; left: -9999px; width: 1px;\n      height: 1px; transition: all 1ms linear 1ms;");
        // Firefox requires that we wait for 2 frames for some reason
        this.raf(function (timestamp) {
            dom_adapter_1.getDOM().on(div, 'transitionend', function (event) {
                var elapsed = math_1.Math.round(event.elapsedTime * 1000);
                _this.elapsedTimeIncludesDelay = elapsed == 2;
                dom_adapter_1.getDOM().remove(div);
            });
            dom_adapter_1.getDOM().setStyle(div, 'width', '2px');
        }, 2);
    };
    BrowserDetails.prototype.raf = function (callback, frames) {
        if (frames === void 0) { frames = 1; }
        var queue = new RafQueue(callback, frames);
        return function () { return queue.cancel(); };
    };
    BrowserDetails.decorators = [
        { type: core_1.Injectable },
    ];
    BrowserDetails.ctorParameters = [];
    return BrowserDetails;
}());
exports.BrowserDetails = BrowserDetails;
var RafQueue = (function () {
    function RafQueue(callback, frames) {
        this.callback = callback;
        this.frames = frames;
        this._raf();
    }
    RafQueue.prototype._raf = function () {
        var _this = this;
        this.currentFrameId =
            dom_adapter_1.getDOM().requestAnimationFrame(function (timestamp) { return _this._nextFrame(timestamp); });
    };
    RafQueue.prototype._nextFrame = function (timestamp) {
        this.frames--;
        if (this.frames > 0) {
            this._raf();
        }
        else {
            this.callback(timestamp);
        }
    };
    RafQueue.prototype.cancel = function () {
        dom_adapter_1.getDOM().cancelAnimationFrame(this.currentFrameId);
        this.currentFrameId = null;
    };
    return RafQueue;
}());
//# sourceMappingURL=browser_details.js.map