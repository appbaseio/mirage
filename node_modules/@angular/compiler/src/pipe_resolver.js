"use strict";
var core_1 = require('@angular/core');
var core_private_1 = require('../core_private');
var lang_1 = require('../src/facade/lang');
var exceptions_1 = require('../src/facade/exceptions');
function _isPipeMetadata(type) {
    return type instanceof core_1.PipeMetadata;
}
var PipeResolver = (function () {
    function PipeResolver(_reflector) {
        if (lang_1.isPresent(_reflector)) {
            this._reflector = _reflector;
        }
        else {
            this._reflector = core_1.reflector;
        }
    }
    /**
     * Return {@link PipeMetadata} for a given `Type`.
     */
    PipeResolver.prototype.resolve = function (type) {
        var metas = this._reflector.annotations(core_1.resolveForwardRef(type));
        if (lang_1.isPresent(metas)) {
            var annotation = metas.find(_isPipeMetadata);
            if (lang_1.isPresent(annotation)) {
                return annotation;
            }
        }
        throw new exceptions_1.BaseException("No Pipe decorator found on " + lang_1.stringify(type));
    };
    PipeResolver.decorators = [
        { type: core_1.Injectable },
    ];
    PipeResolver.ctorParameters = [
        { type: core_private_1.ReflectorReader, },
    ];
    return PipeResolver;
}());
exports.PipeResolver = PipeResolver;
exports.CODEGEN_PIPE_RESOLVER = new PipeResolver(core_1.reflector);
//# sourceMappingURL=pipe_resolver.js.map