/**
 * A base class for the WrappedException that can be used to identify
 * a WrappedException from ExceptionHandler without adding circular
 * dependency.
 */
export declare class BaseWrappedException extends Error {
    constructor(message: string);
    readonly wrapperMessage: string;
    readonly wrapperStack: any;
    readonly originalException: any;
    readonly originalStack: any;
    readonly context: any;
    readonly message: string;
}
