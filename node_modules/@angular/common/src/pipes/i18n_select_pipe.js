"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('../../src/facade/lang');
var collection_1 = require('../../src/facade/collection');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var I18nSelectPipe = (function () {
    function I18nSelectPipe() {
    }
    I18nSelectPipe.prototype.transform = function (value, mapping) {
        if (!lang_1.isStringMap(mapping)) {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(I18nSelectPipe, mapping);
        }
        return collection_1.StringMapWrapper.contains(mapping, value) ? mapping[value] : mapping['other'];
    };
    I18nSelectPipe.decorators = [
        { type: core_1.Pipe, args: [{ name: 'i18nSelect', pure: true },] },
        { type: core_1.Injectable },
    ];
    return I18nSelectPipe;
}());
exports.I18nSelectPipe = I18nSelectPipe;
//# sourceMappingURL=i18n_select_pipe.js.map