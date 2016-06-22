"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('../../src/facade/lang');
var JsonPipe = (function () {
    function JsonPipe() {
    }
    JsonPipe.prototype.transform = function (value) { return lang_1.Json.stringify(value); };
    JsonPipe.decorators = [
        { type: core_1.Pipe, args: [{ name: 'json', pure: false },] },
        { type: core_1.Injectable },
    ];
    return JsonPipe;
}());
exports.JsonPipe = JsonPipe;
//# sourceMappingURL=json_pipe.js.map