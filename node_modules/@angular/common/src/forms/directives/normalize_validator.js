"use strict";
function normalizeValidator(validator) {
    if (validator.validate !== undefined) {
        return function (c) { return validator.validate(c); };
    }
    else {
        return validator;
    }
}
exports.normalizeValidator = normalizeValidator;
function normalizeAsyncValidator(validator) {
    if (validator.validate !== undefined) {
        return function (c) { return Promise.resolve(validator.validate(c)); };
    }
    else {
        return validator;
    }
}
exports.normalizeAsyncValidator = normalizeAsyncValidator;
//# sourceMappingURL=normalize_validator.js.map