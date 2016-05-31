import { ViewMetadata } from '@angular/core';
import { ReflectorReader } from '../core_private';
import { Type } from '../src/facade/lang';
/**
 * Resolves types to {@link ViewMetadata}.
 */
export declare class ViewResolver {
    private _reflector;
    /** @internal */
    _cache: Map<Type, ViewMetadata>;
    constructor(_reflector?: ReflectorReader);
    resolve(component: Type): ViewMetadata;
    /** @internal */
    _resolve(component: Type): ViewMetadata;
    /** @internal */
    _throwMixingViewAndComponent(propertyName: string, component: Type): void;
}
