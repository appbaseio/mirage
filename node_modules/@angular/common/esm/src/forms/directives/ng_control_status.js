import { Directive, Self } from '@angular/core';
import { NgControl } from './ng_control';
import { isPresent } from '../../../src/facade/lang';
export class NgControlStatus {
    constructor(cd) {
        this._cd = cd;
    }
    get ngClassUntouched() {
        return isPresent(this._cd.control) ? this._cd.control.untouched : false;
    }
    get ngClassTouched() {
        return isPresent(this._cd.control) ? this._cd.control.touched : false;
    }
    get ngClassPristine() {
        return isPresent(this._cd.control) ? this._cd.control.pristine : false;
    }
    get ngClassDirty() {
        return isPresent(this._cd.control) ? this._cd.control.dirty : false;
    }
    get ngClassValid() {
        return isPresent(this._cd.control) ? this._cd.control.valid : false;
    }
    get ngClassInvalid() {
        return isPresent(this._cd.control) ? !this._cd.control.valid : false;
    }
}
NgControlStatus.decorators = [
    { type: Directive, args: [{
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
    { type: NgControl, decorators: [{ type: Self },] },
];
//# sourceMappingURL=ng_control_status.js.map