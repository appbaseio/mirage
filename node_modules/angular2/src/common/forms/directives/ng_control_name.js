'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('angular2/src/facade/async');
var core_1 = require('angular2/core');
var control_container_1 = require('./control_container');
var ng_control_1 = require('./ng_control');
var control_value_accessor_1 = require('./control_value_accessor');
var shared_1 = require('./shared');
var validators_1 = require('../validators');
var controlNameBinding = lang_1.CONST_EXPR(new core_1.Provider(ng_control_1.NgControl, { useExisting: core_1.forwardRef(function () { return NgControlName; }) }));
/**
 * Creates and binds a control with a specified name to a DOM element.
 *
 * This directive can only be used as a child of {@link NgForm} or {@link NgFormModel}.

 * ### Example
 *
 * In this example, we create the login and password controls.
 * We can work with each control separately: check its validity, get its value, listen to its
 * changes.
 *
 *  ```
 * @Component({
 *      selector: "login-comp",
 *      directives: [FORM_DIRECTIVES],
 *      template: `
 *        <form #f="ngForm" (submit)='onLogIn(f.value)'>
 *          Login <input type='text' ngControl='login' #l="form">
 *          <div *ngIf="!l.valid">Login is invalid</div>
 *
 *          Password <input type='password' ngControl='password'>
 *          <button type='submit'>Log in!</button>
 *        </form>
 *      `})
 * class LoginComp {
 *  onLogIn(value): void {
 *    // value === {login: 'some login', password: 'some password'}
 *  }
 * }
 *  ```
 *
 * We can also use ngModel to bind a domain model to the form.
 *
 *  ```
 * @Component({
 *      selector: "login-comp",
 *      directives: [FORM_DIRECTIVES],
 *      template: `
 *        <form (submit)='onLogIn()'>
 *          Login <input type='text' ngControl='login' [(ngModel)]="credentials.login">
 *          Password <input type='password' ngControl='password'
 *                          [(ngModel)]="credentials.password">
 *          <button type='submit'>Log in!</button>
 *        </form>
 *      `})
 * class LoginComp {
 *  credentials: {login:string, password:string};
 *
 *  onLogIn(): void {
 *    // this.credentials.login === "some login"
 *    // this.credentials.password === "some password"
 *  }
 * }
 *  ```
 */
var NgControlName = (function (_super) {
    __extends(NgControlName, _super);
    function NgControlName(_parent, _validators, _asyncValidators, valueAccessors) {
        _super.call(this);
        this._parent = _parent;
        this._validators = _validators;
        this._asyncValidators = _asyncValidators;
        /** @internal */
        this.update = new async_1.EventEmitter();
        this._added = false;
        this.valueAccessor = shared_1.selectValueAccessor(this, valueAccessors);
    }
    NgControlName.prototype.ngOnChanges = function (changes) {
        if (!this._added) {
            this.formDirective.addControl(this);
            this._added = true;
        }
        if (shared_1.isPropertyUpdated(changes, this.viewModel)) {
            this.viewModel = this.model;
            this.formDirective.updateModel(this, this.model);
        }
    };
    NgControlName.prototype.ngOnDestroy = function () { this.formDirective.removeControl(this); };
    NgControlName.prototype.viewToModelUpdate = function (newValue) {
        this.viewModel = newValue;
        async_1.ObservableWrapper.callEmit(this.update, newValue);
    };
    Object.defineProperty(NgControlName.prototype, "path", {
        get: function () { return shared_1.controlPath(this.name, this._parent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlName.prototype, "formDirective", {
        get: function () { return this._parent.formDirective; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlName.prototype, "validator", {
        get: function () { return shared_1.composeValidators(this._validators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlName.prototype, "asyncValidator", {
        get: function () { return shared_1.composeAsyncValidators(this._asyncValidators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlName.prototype, "control", {
        get: function () { return this.formDirective.getControl(this); },
        enumerable: true,
        configurable: true
    });
    NgControlName = __decorate([
        core_1.Directive({
            selector: '[ngControl]',
            bindings: [controlNameBinding],
            inputs: ['name: ngControl', 'model: ngModel'],
            outputs: ['update: ngModelChange'],
            exportAs: 'ngForm'
        }),
        __param(0, core_1.Host()),
        __param(0, core_1.SkipSelf()),
        __param(1, core_1.Optional()),
        __param(1, core_1.Self()),
        __param(1, core_1.Inject(validators_1.NG_VALIDATORS)),
        __param(2, core_1.Optional()),
        __param(2, core_1.Self()),
        __param(2, core_1.Inject(validators_1.NG_ASYNC_VALIDATORS)),
        __param(3, core_1.Optional()),
        __param(3, core_1.Self()),
        __param(3, core_1.Inject(control_value_accessor_1.NG_VALUE_ACCESSOR)), 
        __metadata('design:paramtypes', [control_container_1.ControlContainer, Array, Array, Array])
    ], NgControlName);
    return NgControlName;
}(ng_control_1.NgControl));
exports.NgControlName = NgControlName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9uYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2NvbW1vbi9mb3Jtcy9kaXJlY3RpdmVzL25nX2NvbnRyb2xfbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQkFBeUIsMEJBQTBCLENBQUMsQ0FBQTtBQUNwRCxzQkFBOEMsMkJBQTJCLENBQUMsQ0FBQTtBQUUxRSxxQkFhTyxlQUFlLENBQUMsQ0FBQTtBQUV2QixrQ0FBK0IscUJBQXFCLENBQUMsQ0FBQTtBQUNyRCwyQkFBd0IsY0FBYyxDQUFDLENBQUE7QUFDdkMsdUNBQXNELDBCQUEwQixDQUFDLENBQUE7QUFDakYsdUJBTU8sVUFBVSxDQUFDLENBQUE7QUFFbEIsMkJBQWlELGVBQWUsQ0FBQyxDQUFBO0FBSWpFLElBQU0sa0JBQWtCLEdBQ3BCLGlCQUFVLENBQUMsSUFBSSxlQUFRLENBQUMsc0JBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxpQkFBVSxDQUFDLGNBQU0sT0FBQSxhQUFhLEVBQWIsQ0FBYSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFFeEY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNERztBQVFIO0lBQW1DLGlDQUFTO0lBUTFDLHVCQUF3QyxPQUF5QixFQUNGLFdBQ1YsRUFDZ0IsZ0JBQ2hCLEVBRXpDLGNBQXNDO1FBQ2hELGlCQUFPLENBQUM7UUFQOEIsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFDRixnQkFBVyxHQUFYLFdBQVcsQ0FDckI7UUFDZ0IscUJBQWdCLEdBQWhCLGdCQUFnQixDQUNoQztRQVZyRCxnQkFBZ0I7UUFDaEIsV0FBTSxHQUFHLElBQUksb0JBQVksRUFBRSxDQUFDO1FBR3BCLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFVckIsSUFBSSxDQUFDLGFBQWEsR0FBRyw0QkFBbUIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELG1DQUFXLEdBQVgsVUFBWSxPQUFzQztRQUNoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQywwQkFBaUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuRCxDQUFDO0lBQ0gsQ0FBQztJQUVELG1DQUFXLEdBQVgsY0FBc0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9ELHlDQUFpQixHQUFqQixVQUFrQixRQUFhO1FBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxzQkFBSSwrQkFBSTthQUFSLGNBQXVCLE1BQU0sQ0FBQyxvQkFBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFckUsc0JBQUksd0NBQWE7YUFBakIsY0FBMkIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFL0Qsc0JBQUksb0NBQVM7YUFBYixjQUErQixNQUFNLENBQUMsMEJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFNUUsc0JBQUkseUNBQWM7YUFBbEIsY0FBeUMsTUFBTSxDQUFDLCtCQUFzQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFaEcsc0JBQUksa0NBQU87YUFBWCxjQUF5QixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQXBEeEU7UUFBQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsUUFBUSxFQUFFLENBQUMsa0JBQWtCLENBQUM7WUFDOUIsTUFBTSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsZ0JBQWdCLENBQUM7WUFDN0MsT0FBTyxFQUFFLENBQUMsdUJBQXVCLENBQUM7WUFDbEMsUUFBUSxFQUFFLFFBQVE7U0FDbkIsQ0FBQzttQkFTYSxXQUFJLEVBQUU7bUJBQUUsZUFBUSxFQUFFO21CQUNsQixlQUFRLEVBQUU7bUJBQUUsV0FBSSxFQUFFO21CQUFFLGFBQU0sQ0FBQywwQkFBYSxDQUFDO21CQUV6QyxlQUFRLEVBQUU7bUJBQUUsV0FBSSxFQUFFO21CQUFFLGFBQU0sQ0FBQyxnQ0FBbUIsQ0FBQzttQkFFL0MsZUFBUSxFQUFFO21CQUFFLFdBQUksRUFBRTttQkFBRSxhQUFNLENBQUMsMENBQWlCLENBQUM7O3FCQWQxRDtJQStDRixvQkFBQztBQUFELENBQUMsQUE5Q0QsQ0FBbUMsc0JBQVMsR0E4QzNDO0FBOUNZLHFCQUFhLGdCQThDekIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q09OU1RfRVhQUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7RXZlbnRFbWl0dGVyLCBPYnNlcnZhYmxlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5cbmltcG9ydCB7XG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2UsXG4gIFF1ZXJ5LFxuICBEaXJlY3RpdmUsXG4gIGZvcndhcmRSZWYsXG4gIEhvc3QsXG4gIFNraXBTZWxmLFxuICBQcm92aWRlcixcbiAgSW5qZWN0LFxuICBPcHRpb25hbCxcbiAgU2VsZlxufSBmcm9tICdhbmd1bGFyMi9jb3JlJztcblxuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge1xuICBjb250cm9sUGF0aCxcbiAgY29tcG9zZVZhbGlkYXRvcnMsXG4gIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMsXG4gIGlzUHJvcGVydHlVcGRhdGVkLFxuICBzZWxlY3RWYWx1ZUFjY2Vzc29yXG59IGZyb20gJy4vc2hhcmVkJztcbmltcG9ydCB7Q29udHJvbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtOR19WQUxJREFUT1JTLCBOR19BU1lOQ19WQUxJREFUT1JTfSBmcm9tICcuLi92YWxpZGF0b3JzJztcbmltcG9ydCB7VmFsaWRhdG9yRm4sIEFzeW5jVmFsaWRhdG9yRm59IGZyb20gJy4vdmFsaWRhdG9ycyc7XG5cblxuY29uc3QgY29udHJvbE5hbWVCaW5kaW5nID1cbiAgICBDT05TVF9FWFBSKG5ldyBQcm92aWRlcihOZ0NvbnRyb2wsIHt1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ0NvbnRyb2xOYW1lKX0pKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuZCBiaW5kcyBhIGNvbnRyb2wgd2l0aCBhIHNwZWNpZmllZCBuYW1lIHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgY2FuIG9ubHkgYmUgdXNlZCBhcyBhIGNoaWxkIG9mIHtAbGluayBOZ0Zvcm19IG9yIHtAbGluayBOZ0Zvcm1Nb2RlbH0uXG5cbiAqICMjIyBFeGFtcGxlXG4gKlxuICogSW4gdGhpcyBleGFtcGxlLCB3ZSBjcmVhdGUgdGhlIGxvZ2luIGFuZCBwYXNzd29yZCBjb250cm9scy5cbiAqIFdlIGNhbiB3b3JrIHdpdGggZWFjaCBjb250cm9sIHNlcGFyYXRlbHk6IGNoZWNrIGl0cyB2YWxpZGl0eSwgZ2V0IGl0cyB2YWx1ZSwgbGlzdGVuIHRvIGl0c1xuICogY2hhbmdlcy5cbiAqXG4gKiAgYGBgXG4gKiBAQ29tcG9uZW50KHtcbiAqICAgICAgc2VsZWN0b3I6IFwibG9naW4tY29tcFwiLFxuICogICAgICBkaXJlY3RpdmVzOiBbRk9STV9ESVJFQ1RJVkVTXSxcbiAqICAgICAgdGVtcGxhdGU6IGBcbiAqICAgICAgICA8Zm9ybSAjZj1cIm5nRm9ybVwiIChzdWJtaXQpPSdvbkxvZ0luKGYudmFsdWUpJz5cbiAqICAgICAgICAgIExvZ2luIDxpbnB1dCB0eXBlPSd0ZXh0JyBuZ0NvbnRyb2w9J2xvZ2luJyAjbD1cImZvcm1cIj5cbiAqICAgICAgICAgIDxkaXYgKm5nSWY9XCIhbC52YWxpZFwiPkxvZ2luIGlzIGludmFsaWQ8L2Rpdj5cbiAqXG4gKiAgICAgICAgICBQYXNzd29yZCA8aW5wdXQgdHlwZT0ncGFzc3dvcmQnIG5nQ29udHJvbD0ncGFzc3dvcmQnPlxuICogICAgICAgICAgPGJ1dHRvbiB0eXBlPSdzdWJtaXQnPkxvZyBpbiE8L2J1dHRvbj5cbiAqICAgICAgICA8L2Zvcm0+XG4gKiAgICAgIGB9KVxuICogY2xhc3MgTG9naW5Db21wIHtcbiAqICBvbkxvZ0luKHZhbHVlKTogdm9pZCB7XG4gKiAgICAvLyB2YWx1ZSA9PT0ge2xvZ2luOiAnc29tZSBsb2dpbicsIHBhc3N3b3JkOiAnc29tZSBwYXNzd29yZCd9XG4gKiAgfVxuICogfVxuICogIGBgYFxuICpcbiAqIFdlIGNhbiBhbHNvIHVzZSBuZ01vZGVsIHRvIGJpbmQgYSBkb21haW4gbW9kZWwgdG8gdGhlIGZvcm0uXG4gKlxuICogIGBgYFxuICogQENvbXBvbmVudCh7XG4gKiAgICAgIHNlbGVjdG9yOiBcImxvZ2luLWNvbXBcIixcbiAqICAgICAgZGlyZWN0aXZlczogW0ZPUk1fRElSRUNUSVZFU10sXG4gKiAgICAgIHRlbXBsYXRlOiBgXG4gKiAgICAgICAgPGZvcm0gKHN1Ym1pdCk9J29uTG9nSW4oKSc+XG4gKiAgICAgICAgICBMb2dpbiA8aW5wdXQgdHlwZT0ndGV4dCcgbmdDb250cm9sPSdsb2dpbicgWyhuZ01vZGVsKV09XCJjcmVkZW50aWFscy5sb2dpblwiPlxuICogICAgICAgICAgUGFzc3dvcmQgPGlucHV0IHR5cGU9J3Bhc3N3b3JkJyBuZ0NvbnRyb2w9J3Bhc3N3b3JkJ1xuICogICAgICAgICAgICAgICAgICAgICAgICAgIFsobmdNb2RlbCldPVwiY3JlZGVudGlhbHMucGFzc3dvcmRcIj5cbiAqICAgICAgICAgIDxidXR0b24gdHlwZT0nc3VibWl0Jz5Mb2cgaW4hPC9idXR0b24+XG4gKiAgICAgICAgPC9mb3JtPlxuICogICAgICBgfSlcbiAqIGNsYXNzIExvZ2luQ29tcCB7XG4gKiAgY3JlZGVudGlhbHM6IHtsb2dpbjpzdHJpbmcsIHBhc3N3b3JkOnN0cmluZ307XG4gKlxuICogIG9uTG9nSW4oKTogdm9pZCB7XG4gKiAgICAvLyB0aGlzLmNyZWRlbnRpYWxzLmxvZ2luID09PSBcInNvbWUgbG9naW5cIlxuICogICAgLy8gdGhpcy5jcmVkZW50aWFscy5wYXNzd29yZCA9PT0gXCJzb21lIHBhc3N3b3JkXCJcbiAqICB9XG4gKiB9XG4gKiAgYGBgXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ0NvbnRyb2xdJyxcbiAgYmluZGluZ3M6IFtjb250cm9sTmFtZUJpbmRpbmddLFxuICBpbnB1dHM6IFsnbmFtZTogbmdDb250cm9sJywgJ21vZGVsOiBuZ01vZGVsJ10sXG4gIG91dHB1dHM6IFsndXBkYXRlOiBuZ01vZGVsQ2hhbmdlJ10sXG4gIGV4cG9ydEFzOiAnbmdGb3JtJ1xufSlcbmV4cG9ydCBjbGFzcyBOZ0NvbnRyb2xOYW1lIGV4dGVuZHMgTmdDb250cm9sIGltcGxlbWVudHMgT25DaGFuZ2VzLFxuICAgIE9uRGVzdHJveSB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgdXBkYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBtb2RlbDogYW55O1xuICB2aWV3TW9kZWw6IGFueTtcbiAgcHJpdmF0ZSBfYWRkZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihASG9zdCgpIEBTa2lwU2VsZigpIHByaXZhdGUgX3BhcmVudDogQ29udHJvbENvbnRhaW5lcixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHByaXZhdGUgX3ZhbGlkYXRvcnM6XG4gICAgICAgICAgICAgICAgICAvKiBBcnJheTxWYWxpZGF0b3J8RnVuY3Rpb24+ICovIGFueVtdLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUykgcHJpdmF0ZSBfYXN5bmNWYWxpZGF0b3JzOlxuICAgICAgICAgICAgICAgICAgLyogQXJyYXk8VmFsaWRhdG9yfEZ1bmN0aW9uPiAqLyBhbnlbXSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTFVFX0FDQ0VTU09SKVxuICAgICAgICAgICAgICB2YWx1ZUFjY2Vzc29yczogQ29udHJvbFZhbHVlQWNjZXNzb3JbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy52YWx1ZUFjY2Vzc29yID0gc2VsZWN0VmFsdWVBY2Nlc3Nvcih0aGlzLCB2YWx1ZUFjY2Vzc29ycyk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiB7W2tleTogc3RyaW5nXTogU2ltcGxlQ2hhbmdlfSkge1xuICAgIGlmICghdGhpcy5fYWRkZWQpIHtcbiAgICAgIHRoaXMuZm9ybURpcmVjdGl2ZS5hZGRDb250cm9sKHRoaXMpO1xuICAgICAgdGhpcy5fYWRkZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoaXNQcm9wZXJ0eVVwZGF0ZWQoY2hhbmdlcywgdGhpcy52aWV3TW9kZWwpKSB7XG4gICAgICB0aGlzLnZpZXdNb2RlbCA9IHRoaXMubW9kZWw7XG4gICAgICB0aGlzLmZvcm1EaXJlY3RpdmUudXBkYXRlTW9kZWwodGhpcywgdGhpcy5tb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7IHRoaXMuZm9ybURpcmVjdGl2ZS5yZW1vdmVDb250cm9sKHRoaXMpOyB9XG5cbiAgdmlld1RvTW9kZWxVcGRhdGUobmV3VmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudmlld01vZGVsID0gbmV3VmFsdWU7XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy51cGRhdGUsIG5ld1ZhbHVlKTtcbiAgfVxuXG4gIGdldCBwYXRoKCk6IHN0cmluZ1tdIHsgcmV0dXJuIGNvbnRyb2xQYXRoKHRoaXMubmFtZSwgdGhpcy5fcGFyZW50KTsgfVxuXG4gIGdldCBmb3JtRGlyZWN0aXZlKCk6IGFueSB7IHJldHVybiB0aGlzLl9wYXJlbnQuZm9ybURpcmVjdGl2ZTsgfVxuXG4gIGdldCB2YWxpZGF0b3IoKTogVmFsaWRhdG9yRm4geyByZXR1cm4gY29tcG9zZVZhbGlkYXRvcnModGhpcy5fdmFsaWRhdG9ycyk7IH1cblxuICBnZXQgYXN5bmNWYWxpZGF0b3IoKTogQXN5bmNWYWxpZGF0b3JGbiB7IHJldHVybiBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKHRoaXMuX2FzeW5jVmFsaWRhdG9ycyk7IH1cblxuICBnZXQgY29udHJvbCgpOiBDb250cm9sIHsgcmV0dXJuIHRoaXMuZm9ybURpcmVjdGl2ZS5nZXRDb250cm9sKHRoaXMpOyB9XG59XG4iXX0=