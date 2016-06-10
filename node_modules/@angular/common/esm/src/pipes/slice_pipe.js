import { Injectable, Pipe } from '@angular/core';
import { isBlank, isString, isArray, StringWrapper } from '../../src/facade/lang';
import { ListWrapper } from '../../src/facade/collection';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
export class SlicePipe {
    transform(value, start, end = null) {
        if (!this.supports(value)) {
            throw new InvalidPipeArgumentException(SlicePipe, value);
        }
        if (isBlank(value))
            return value;
        if (isString(value)) {
            return StringWrapper.slice(value, start, end);
        }
        return ListWrapper.slice(value, start, end);
    }
    supports(obj) { return isString(obj) || isArray(obj); }
}
SlicePipe.decorators = [
    { type: Pipe, args: [{ name: 'slice', pure: false },] },
    { type: Injectable },
];
//# sourceMappingURL=slice_pipe.js.map