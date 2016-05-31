"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('../../src/facade/lang');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var interpolationExp = lang_1.RegExpWrapper.create('#');
var I18nPluralPipe = (function () {
    function I18nPluralPipe() {
    }
    I18nPluralPipe.prototype.transform = function (value, pluralMap) {
        var key;
        var valueStr;
        if (!lang_1.isStringMap(pluralMap)) {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(I18nPluralPipe, pluralMap);
        }
        key = value === 0 || value === 1 ? "=" + value : 'other';
        valueStr = lang_1.isPresent(value) ? value.toString() : '';
        return lang_1.StringWrapper.replaceAll(pluralMap[key], interpolationExp, valueStr);
    };
    I18nPluralPipe.decorators = [
        { type: core_1.Pipe, args: [{ name: 'i18nPlural', pure: true },] },
        { type: core_1.Injectable },
    ];
    return I18nPluralPipe;
}());
exports.I18nPluralPipe = I18nPluralPipe;
//# sourceMappingURL=i18n_plural_pipe.js.map