import { Injectable, Pipe } from '@angular/core';
import { isStringMap } from '../../src/facade/lang';
import { StringMapWrapper } from '../../src/facade/collection';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
export class I18nSelectPipe {
    transform(value, mapping) {
        if (!isStringMap(mapping)) {
            throw new InvalidPipeArgumentException(I18nSelectPipe, mapping);
        }
        return StringMapWrapper.contains(mapping, value) ? mapping[value] : mapping['other'];
    }
}
I18nSelectPipe.decorators = [
    { type: Pipe, args: [{ name: 'i18nSelect', pure: true },] },
    { type: Injectable },
];
//# sourceMappingURL=i18n_select_pipe.js.map