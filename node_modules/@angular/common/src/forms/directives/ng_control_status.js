"use strict";
var core_1 = require('@angular/core');
var ng_control_1 = require('./ng_control');
var lang_1 = require('../../../src/facade/lang');
var NgControlStatus = (function () {
    function NgControlStatus(cd) {
        this._cd = cd;
    }
    Object.defineProperty(NgControlStatus.prototype, "ngClassUntouched", {
        get: function () {
            return lang_1.isPresent(this._cd.control) ? this._cd.control.untouched : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlStatus.prototype, "ngClassTouched", {
        get: function () {
            return lang_1.isPresent(this._cd.control) ? this._cd.control.touched : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlStatus.prototype, "ngClassPristine", {
        get: function () {
            return lang_1.isPresent(this._cd.control) ? this._cd.control.pristine : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlStatus.prototype, "ngClassDirty", {
        get: function () {
            return lang_1.isPresent(this._cd.control) ? this._cd.control.dirty : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlStatus.prototype, "ngClassValid", {
        get: function () {
            return lang_1.isPresent(this._cd.control) ? this._cd.control.valid : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlStatus.prototype, "ngClassInvalid", {
        get: function () {
            return lang_1.isPresent(this._cd.control) ? !this._cd.control.valid : false;
        },
        enumerable: true,
        configurable: true
    });
    NgControlStatus.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[ngControl],[ngModel],[ngFormControl]',
                    host: {
                        '[class.ng-untouched]': 'ngClassUntouched',
                        '[class.ng-touched]': 'ngClassTouched',
                        '[class.ng-pristine]': 'ngClassPristine',
                        '[class.ng-dirty]': 'ngClassDirty',
                        '[class.ng-valid]': 'ngClassValid',
                        '[class.ng-invalid]': 'ngClassInvalid'
                    }
                },] },
    ];
    NgControlStatus.ctorParameters = [
        { type: ng_control_1.NgControl, decorators: [{ type: core_1.Self },] },
    ];
    return NgControlStatus;
}());
exports.NgControlStatus = NgControlStatus;
//# sourceMappingURL=ng_control_status.js.map