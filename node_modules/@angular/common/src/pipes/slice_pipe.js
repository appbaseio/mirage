"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('../../src/facade/lang');
var collection_1 = require('../../src/facade/collection');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var SlicePipe = (function () {
    function SlicePipe() {
    }
    SlicePipe.prototype.transform = function (value, start, end) {
        if (end === void 0) { end = null; }
        if (!this.supports(value)) {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(SlicePipe, value);
        }
        if (lang_1.isBlank(value))
            return value;
        if (lang_1.isString(value)) {
            return lang_1.StringWrapper.slice(value, start, end);
        }
        return collection_1.ListWrapper.slice(value, start, end);
    };
    SlicePipe.prototype.supports = function (obj) { return lang_1.isString(obj) || lang_1.isArray(obj); };
    SlicePipe.decorators = [
        { type: core_1.Pipe, args: [{ name: 'slice', pure: false },] },
        { type: core_1.Injectable },
    ];
    return SlicePipe;
}());
exports.SlicePipe = SlicePipe;
//# sourceMappingURL=slice_pipe.js.map