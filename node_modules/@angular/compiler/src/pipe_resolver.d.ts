import { PipeMetadata } from '@angular/core';
import { ReflectorReader } from '../core_private';
import { Type } from '../src/facade/lang';
/**
 * Resolve a `Type` for {@link PipeMetadata}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {@link Compiler}
 */
export declare class PipeResolver {
    private _reflector;
    constructor(_reflector?: ReflectorReader);
    /**
     * Return {@link PipeMetadata} for a given `Type`.
     */
    resolve(type: Type): PipeMetadata;
}
export declare var CODEGEN_PIPE_RESOLVER: PipeResolver;
