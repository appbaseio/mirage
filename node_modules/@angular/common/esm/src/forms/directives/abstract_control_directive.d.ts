import { AbstractControl } from '../model';
/**
 * Base class for control directives.
 *
 * Only used internally in the forms module.
 */
export declare abstract class AbstractControlDirective {
    readonly control: AbstractControl;
    readonly value: any;
    readonly valid: boolean;
    readonly errors: {
        [key: string]: any;
    };
    readonly pristine: boolean;
    readonly dirty: boolean;
    readonly touched: boolean;
    readonly untouched: boolean;
    readonly path: string[];
}
