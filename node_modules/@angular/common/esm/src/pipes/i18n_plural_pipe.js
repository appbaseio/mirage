import { Injectable, Pipe } from '@angular/core';
import { isStringMap, StringWrapper, isPresent, RegExpWrapper } from '../../src/facade/lang';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
var interpolationExp = RegExpWrapper.create('#');
export class I18nPluralPipe {
    transform(value, pluralMap) {
        var key;
        var valueStr;
        if (!isStringMap(pluralMap)) {
            throw new InvalidPipeArgumentException(I18nPluralPipe, pluralMap);
        }
        key = value === 0 || value === 1 ? `=${value}` : 'other';
        valueStr = isPresent(value) ? value.toString() : '';
        return StringWrapper.replaceAll(pluralMap[key], interpolationExp, valueStr);
    }
}
I18nPluralPipe.decorators = [
    { type: Pipe, args: [{ name: 'i18nPlural', pure: true },] },
    { type: Injectable },
];
//# sourceMappingURL=i18n_plural_pipe.js.map