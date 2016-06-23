import { resolveForwardRef, Injectable, PipeMetadata, reflector } from '@angular/core';
import { ReflectorReader } from '../core_private';
import { isPresent, stringify } from '../src/facade/lang';
import { BaseException } from '../src/facade/exceptions';
function _isPipeMetadata(type) {
    return type instanceof PipeMetadata;
}
export class PipeResolver {
    constructor(_reflector) {
        if (isPresent(_reflector)) {
            this._reflector = _reflector;
        }
        else {
            this._reflector = reflector;
        }
    }
    /**
     * Return {@link PipeMetadata} for a given `Type`.
     */
    resolve(type) {
        var metas = this._reflector.annotations(resolveForwardRef(type));
        if (isPresent(metas)) {
            var annotation = metas.find(_isPipeMetadata);
            if (isPresent(annotation)) {
                return annotation;
            }
        }
        throw new BaseException(`No Pipe decorator found on ${stringify(type)}`);
    }
}
PipeResolver.decorators = [
    { type: Injectable },
];
PipeResolver.ctorParameters = [
    { type: ReflectorReader, },
];
export var CODEGEN_PIPE_RESOLVER = new PipeResolver(reflector);
//# sourceMappingURL=pipe_resolver.js.map