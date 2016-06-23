import { Injectable, Pipe } from '@angular/core';
import { isBlank, isString, isNumber, isFunction, RegExpWrapper, StringWrapper } from '../../src/facade/lang';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
export class ReplacePipe {
    transform(value, pattern, replacement) {
        if (isBlank(value)) {
            return value;
        }
        if (!this._supportedInput(value)) {
            throw new InvalidPipeArgumentException(ReplacePipe, value);
        }
        var input = value.toString();
        if (!this._supportedPattern(pattern)) {
            throw new InvalidPipeArgumentException(ReplacePipe, pattern);
        }
        if (!this._supportedReplacement(replacement)) {
            throw new InvalidPipeArgumentException(ReplacePipe, replacement);
        }
        // template fails with literal RegExp e.g /pattern/igm
        // var rgx = pattern instanceof RegExp ? pattern : RegExpWrapper.create(pattern);
        if (isFunction(replacement)) {
            var rgxPattern = isString(pattern) ? RegExpWrapper.create(pattern) : pattern;
            return StringWrapper.replaceAllMapped(input, rgxPattern, replacement);
        }
        if (pattern instanceof RegExp) {
            // use the replaceAll variant
            return StringWrapper.replaceAll(input, pattern, replacement);
        }
        return StringWrapper.replace(input, pattern, replacement);
    }
    _supportedInput(input) { return isString(input) || isNumber(input); }
    _supportedPattern(pattern) {
        return isString(pattern) || pattern instanceof RegExp;
    }
    _supportedReplacement(replacement) {
        return isString(replacement) || isFunction(replacement);
    }
}
ReplacePipe.decorators = [
    { type: Pipe, args: [{ name: 'replace' },] },
    { type: Injectable },
];
//# sourceMappingURL=replace_pipe.js.map