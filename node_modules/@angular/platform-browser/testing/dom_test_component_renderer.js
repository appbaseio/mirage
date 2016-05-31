"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require('@angular/core');
var dom_tokens_1 = require('../src/dom/dom_tokens');
var dom_adapter_1 = require('../src/dom/dom_adapter');
var testing_1 = require('@angular/compiler/testing');
var browser_util_1 = require('./browser_util');
var DOMTestComponentRenderer = (function (_super) {
    __extends(DOMTestComponentRenderer, _super);
    function DOMTestComponentRenderer(_doc) {
        _super.call(this);
        this._doc = _doc;
    }
    DOMTestComponentRenderer.prototype.insertRootElement = function (rootElId) {
        var rootEl = browser_util_1.el("<div id=\"" + rootElId + "\"></div>");
        // TODO(juliemr): can/should this be optional?
        var oldRoots = dom_adapter_1.getDOM().querySelectorAll(this._doc, '[id^=root]');
        for (var i = 0; i < oldRoots.length; i++) {
            dom_adapter_1.getDOM().remove(oldRoots[i]);
        }
        dom_adapter_1.getDOM().appendChild(this._doc.body, rootEl);
    };
    DOMTestComponentRenderer.decorators = [
        { type: core_1.Injectable },
    ];
    DOMTestComponentRenderer.ctorParameters = [
        { type: undefined, decorators: [{ type: core_1.Inject, args: [dom_tokens_1.DOCUMENT,] },] },
    ];
    return DOMTestComponentRenderer;
}(testing_1.TestComponentRenderer));
exports.DOMTestComponentRenderer = DOMTestComponentRenderer;
//# sourceMappingURL=dom_test_component_renderer.js.map