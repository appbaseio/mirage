import { Type } from '../../src/facade/lang';
import { BaseException } from '../../src/facade/exceptions';
export declare class InvalidPipeArgumentException extends BaseException {
    constructor(type: Type, value: Object);
}
