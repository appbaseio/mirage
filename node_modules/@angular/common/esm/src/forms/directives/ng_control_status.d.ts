import { NgControl } from './ng_control';
/**
 * Directive automatically applied to Angular forms that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 */
export declare class NgControlStatus {
    private _cd;
    constructor(cd: NgControl);
    readonly ngClassUntouched: boolean;
    readonly ngClassTouched: boolean;
    readonly ngClassPristine: boolean;
    readonly ngClassDirty: boolean;
    readonly ngClassValid: boolean;
    readonly ngClassInvalid: boolean;
}
