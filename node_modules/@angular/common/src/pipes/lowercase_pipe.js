"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('../../src/facade/lang');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var LowerCasePipe = (function () {
    function LowerCasePipe() {
    }
    LowerCasePipe.prototype.transform = function (value) {
        if (lang_1.isBlank(value))
            return value;
        if (!lang_1.isString(value)) {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(LowerCasePipe, value);
        }
        return value.toLowerCase();
    };
    LowerCasePipe.decorators = [
        { type: core_1.Pipe, args: [{ name: 'lowercase' },] },
        { type: core_1.Injectable },
    ];
    return LowerCasePipe;
}());
exports.LowerCasePipe = LowerCasePipe;
//# sourceMappingURL=lowercase_pipe.js.map