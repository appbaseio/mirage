import { Injectable, Pipe } from '@angular/core';
import { isString, isBlank } from '../../src/facade/lang';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
export class LowerCasePipe {
    transform(value) {
        if (isBlank(value))
            return value;
        if (!isString(value)) {
            throw new InvalidPipeArgumentException(LowerCasePipe, value);
        }
        return value.toLowerCase();
    }
}
LowerCasePipe.decorators = [
    { type: Pipe, args: [{ name: 'lowercase' },] },
    { type: Injectable },
];
//# sourceMappingURL=lowercase_pipe.js.map