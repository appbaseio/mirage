import { Injectable, Pipe } from '@angular/core';
import { isString, isBlank } from '../../src/facade/lang';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
export class UpperCasePipe {
    transform(value) {
        if (isBlank(value))
            return value;
        if (!isString(value)) {
            throw new InvalidPipeArgumentException(UpperCasePipe, value);
        }
        return value.toUpperCase();
    }
}
UpperCasePipe.decorators = [
    { type: Pipe, args: [{ name: 'uppercase' },] },
    { type: Injectable },
];
//# sourceMappingURL=uppercase_pipe.js.map