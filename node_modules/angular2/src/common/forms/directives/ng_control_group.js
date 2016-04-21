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
var core_1 = require('angular2/core');
var lang_1 = require('angular2/src/facade/lang');
var control_container_1 = require('./control_container');
var shared_1 = require('./shared');
var validators_1 = require('../validators');
var controlGroupProvider = lang_1.CONST_EXPR(new core_1.Provider(control_container_1.ControlContainer, { useExisting: core_1.forwardRef(function () { return NgControlGroup; }) }));
/**
 * Creates and binds a control group to a DOM element.
 *
 * This directive can only be used as a child of {@link NgForm} or {@link NgFormModel}.
 *
 * ### Example ([live demo](http://plnkr.co/edit/7EJ11uGeaggViYM6T5nq?p=preview))
 *
 * ```typescript
 * @Component({
 *   selector: 'my-app',
 *   directives: [FORM_DIRECTIVES],
 *   template: `
 *     <div>
 *       <h2>Angular2 Control &amp; ControlGroup Example</h2>
 *       <form #f="ngForm">
 *         <div ngControlGroup="name" #cg-name="form">
 *           <h3>Enter your name:</h3>
 *           <p>First: <input ngControl="first" required></p>
 *           <p>Middle: <input ngControl="middle"></p>
 *           <p>Last: <input ngControl="last" required></p>
 *         </div>
 *         <h3>Name value:</h3>
 *         <pre>{{valueOf(cgName)}}</pre>
 *         <p>Name is {{cgName?.control?.valid ? "valid" : "invalid"}}</p>
 *         <h3>What's your favorite food?</h3>
 *         <p><input ngControl="food"></p>
 *         <h3>Form value</h3>
 *         <pre>{{valueOf(f)}}</pre>
 *       </form>
 *     </div>
 *   `
 * })
 * export class App {
 *   valueOf(cg: NgControlGroup): string {
 *     if (cg.control == null) {
 *       return null;
 *     }
 *     return JSON.stringify(cg.control.value, null, 2);
 *   }
 * }
 * ```
 *
 * This example declares a control group for a user's name. The value and validation state of
 * this group can be accessed separately from the overall form.
 */
var NgControlGroup = (function (_super) {
    __extends(NgControlGroup, _super);
    function NgControlGroup(parent, _validators, _asyncValidators) {
        _super.call(this);
        this._validators = _validators;
        this._asyncValidators = _asyncValidators;
        this._parent = parent;
    }
    NgControlGroup.prototype.ngOnInit = function () { this.formDirective.addControlGroup(this); };
    NgControlGroup.prototype.ngOnDestroy = function () { this.formDirective.removeControlGroup(this); };
    Object.defineProperty(NgControlGroup.prototype, "control", {
        /**
         * Get the {@link ControlGroup} backing this binding.
         */
        get: function () { return this.formDirective.getControlGroup(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlGroup.prototype, "path", {
        /**
         * Get the path to this control group.
         */
        get: function () { return shared_1.controlPath(this.name, this._parent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlGroup.prototype, "formDirective", {
        /**
         * Get the {@link Form} to which this group belongs.
         */
        get: function () { return this._parent.formDirective; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlGroup.prototype, "validator", {
        get: function () { return shared_1.composeValidators(this._validators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControlGroup.prototype, "asyncValidator", {
        get: function () { return shared_1.composeAsyncValidators(this._asyncValidators); },
        enumerable: true,
        configurable: true
    });
    NgControlGroup = __decorate([
        core_1.Directive({
            selector: '[ngControlGroup]',
            providers: [controlGroupProvider],
            inputs: ['name: ngControlGroup'],
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
        __metadata('design:paramtypes', [control_container_1.ControlContainer, Array, Array])
    ], NgControlGroup);
    return NgControlGroup;
}(control_container_1.ControlContainer));
exports.NgControlGroup = NgControlGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9ncm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vZm9ybXMvZGlyZWN0aXZlcy9uZ19jb250cm9sX2dyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFCQVdPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLHFCQUF5QiwwQkFBMEIsQ0FBQyxDQUFBO0FBRXBELGtDQUErQixxQkFBcUIsQ0FBQyxDQUFBO0FBQ3JELHVCQUFxRSxVQUFVLENBQUMsQ0FBQTtBQUdoRiwyQkFBaUQsZUFBZSxDQUFDLENBQUE7QUFHakUsSUFBTSxvQkFBb0IsR0FDdEIsaUJBQVUsQ0FBQyxJQUFJLGVBQVEsQ0FBQyxvQ0FBZ0IsRUFBRSxFQUFDLFdBQVcsRUFBRSxpQkFBVSxDQUFDLGNBQU0sT0FBQSxjQUFjLEVBQWQsQ0FBYyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFFaEc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNENHO0FBT0g7SUFBb0Msa0NBQWdCO0lBS2xELHdCQUFnQyxNQUF3QixFQUNPLFdBQWtCLEVBQ1osZ0JBQXVCO1FBQzFGLGlCQUFPLENBQUM7UUFGcUQsZ0JBQVcsR0FBWCxXQUFXLENBQU87UUFDWixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQU87UUFFMUYsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDeEIsQ0FBQztJQUVELGlDQUFRLEdBQVIsY0FBbUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTlELG9DQUFXLEdBQVgsY0FBc0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFLcEUsc0JBQUksbUNBQU87UUFIWDs7V0FFRzthQUNILGNBQThCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBS2hGLHNCQUFJLGdDQUFJO1FBSFI7O1dBRUc7YUFDSCxjQUF1QixNQUFNLENBQUMsb0JBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBS3JFLHNCQUFJLHlDQUFhO1FBSGpCOztXQUVHO2FBQ0gsY0FBNEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFaEUsc0JBQUkscUNBQVM7YUFBYixjQUErQixNQUFNLENBQUMsMEJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFNUUsc0JBQUksMENBQWM7YUFBbEIsY0FBeUMsTUFBTSxDQUFDLCtCQUFzQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUF2Q2xHO1FBQUMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUM7WUFDakMsTUFBTSxFQUFFLENBQUMsc0JBQXNCLENBQUM7WUFDaEMsUUFBUSxFQUFFLFFBQVE7U0FDbkIsQ0FBQzttQkFNYSxXQUFJLEVBQUU7bUJBQUUsZUFBUSxFQUFFO21CQUNsQixlQUFRLEVBQUU7bUJBQUUsV0FBSSxFQUFFO21CQUFFLGFBQU0sQ0FBQywwQkFBYSxDQUFDO21CQUN6QyxlQUFRLEVBQUU7bUJBQUUsV0FBSSxFQUFFO21CQUFFLGFBQU0sQ0FBQyxnQ0FBbUIsQ0FBQzs7c0JBUjVEO0lBbUNGLHFCQUFDO0FBQUQsQ0FBQyxBQWxDRCxDQUFvQyxvQ0FBZ0IsR0FrQ25EO0FBbENZLHNCQUFjLGlCQWtDMUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIE9uSW5pdCxcbiAgT25EZXN0cm95LFxuICBEaXJlY3RpdmUsXG4gIE9wdGlvbmFsLFxuICBJbmplY3QsXG4gIEhvc3QsXG4gIFNraXBTZWxmLFxuICBmb3J3YXJkUmVmLFxuICBQcm92aWRlcixcbiAgU2VsZlxufSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7Q09OU1RfRVhQUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcblxuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7Y29udHJvbFBhdGgsIGNvbXBvc2VWYWxpZGF0b3JzLCBjb21wb3NlQXN5bmNWYWxpZGF0b3JzfSBmcm9tICcuL3NoYXJlZCc7XG5pbXBvcnQge0NvbnRyb2xHcm91cH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtGb3JtfSBmcm9tICcuL2Zvcm1faW50ZXJmYWNlJztcbmltcG9ydCB7TkdfVkFMSURBVE9SUywgTkdfQVNZTkNfVkFMSURBVE9SU30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvckZufSBmcm9tICcuL3ZhbGlkYXRvcnMnO1xuXG5jb25zdCBjb250cm9sR3JvdXBQcm92aWRlciA9XG4gICAgQ09OU1RfRVhQUihuZXcgUHJvdmlkZXIoQ29udHJvbENvbnRhaW5lciwge3VzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nQ29udHJvbEdyb3VwKX0pKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuZCBiaW5kcyBhIGNvbnRyb2wgZ3JvdXAgdG8gYSBET00gZWxlbWVudC5cbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBjYW4gb25seSBiZSB1c2VkIGFzIGEgY2hpbGQgb2Yge0BsaW5rIE5nRm9ybX0gb3Ige0BsaW5rIE5nRm9ybU1vZGVsfS5cbiAqXG4gKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvN0VKMTF1R2VhZ2dWaVlNNlQ1bnE/cD1wcmV2aWV3KSlcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBAQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICdteS1hcHAnLFxuICogICBkaXJlY3RpdmVzOiBbRk9STV9ESVJFQ1RJVkVTXSxcbiAqICAgdGVtcGxhdGU6IGBcbiAqICAgICA8ZGl2PlxuICogICAgICAgPGgyPkFuZ3VsYXIyIENvbnRyb2wgJmFtcDsgQ29udHJvbEdyb3VwIEV4YW1wbGU8L2gyPlxuICogICAgICAgPGZvcm0gI2Y9XCJuZ0Zvcm1cIj5cbiAqICAgICAgICAgPGRpdiBuZ0NvbnRyb2xHcm91cD1cIm5hbWVcIiAjY2ctbmFtZT1cImZvcm1cIj5cbiAqICAgICAgICAgICA8aDM+RW50ZXIgeW91ciBuYW1lOjwvaDM+XG4gKiAgICAgICAgICAgPHA+Rmlyc3Q6IDxpbnB1dCBuZ0NvbnRyb2w9XCJmaXJzdFwiIHJlcXVpcmVkPjwvcD5cbiAqICAgICAgICAgICA8cD5NaWRkbGU6IDxpbnB1dCBuZ0NvbnRyb2w9XCJtaWRkbGVcIj48L3A+XG4gKiAgICAgICAgICAgPHA+TGFzdDogPGlucHV0IG5nQ29udHJvbD1cImxhc3RcIiByZXF1aXJlZD48L3A+XG4gKiAgICAgICAgIDwvZGl2PlxuICogICAgICAgICA8aDM+TmFtZSB2YWx1ZTo8L2gzPlxuICogICAgICAgICA8cHJlPnt7dmFsdWVPZihjZ05hbWUpfX08L3ByZT5cbiAqICAgICAgICAgPHA+TmFtZSBpcyB7e2NnTmFtZT8uY29udHJvbD8udmFsaWQgPyBcInZhbGlkXCIgOiBcImludmFsaWRcIn19PC9wPlxuICogICAgICAgICA8aDM+V2hhdCdzIHlvdXIgZmF2b3JpdGUgZm9vZD88L2gzPlxuICogICAgICAgICA8cD48aW5wdXQgbmdDb250cm9sPVwiZm9vZFwiPjwvcD5cbiAqICAgICAgICAgPGgzPkZvcm0gdmFsdWU8L2gzPlxuICogICAgICAgICA8cHJlPnt7dmFsdWVPZihmKX19PC9wcmU+XG4gKiAgICAgICA8L2Zvcm0+XG4gKiAgICAgPC9kaXY+XG4gKiAgIGBcbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgQXBwIHtcbiAqICAgdmFsdWVPZihjZzogTmdDb250cm9sR3JvdXApOiBzdHJpbmcge1xuICogICAgIGlmIChjZy5jb250cm9sID09IG51bGwpIHtcbiAqICAgICAgIHJldHVybiBudWxsO1xuICogICAgIH1cbiAqICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY2cuY29udHJvbC52YWx1ZSwgbnVsbCwgMik7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIFRoaXMgZXhhbXBsZSBkZWNsYXJlcyBhIGNvbnRyb2wgZ3JvdXAgZm9yIGEgdXNlcidzIG5hbWUuIFRoZSB2YWx1ZSBhbmQgdmFsaWRhdGlvbiBzdGF0ZSBvZlxuICogdGhpcyBncm91cCBjYW4gYmUgYWNjZXNzZWQgc2VwYXJhdGVseSBmcm9tIHRoZSBvdmVyYWxsIGZvcm0uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ0NvbnRyb2xHcm91cF0nLFxuICBwcm92aWRlcnM6IFtjb250cm9sR3JvdXBQcm92aWRlcl0sXG4gIGlucHV0czogWyduYW1lOiBuZ0NvbnRyb2xHcm91cCddLFxuICBleHBvcnRBczogJ25nRm9ybSdcbn0pXG5leHBvcnQgY2xhc3MgTmdDb250cm9sR3JvdXAgZXh0ZW5kcyBDb250cm9sQ29udGFpbmVyIGltcGxlbWVudHMgT25Jbml0LFxuICAgIE9uRGVzdHJveSB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BhcmVudDogQ29udHJvbENvbnRhaW5lcjtcblxuICBjb25zdHJ1Y3RvcihASG9zdCgpIEBTa2lwU2VsZigpIHBhcmVudDogQ29udHJvbENvbnRhaW5lcixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHByaXZhdGUgX3ZhbGlkYXRvcnM6IGFueVtdLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUykgcHJpdmF0ZSBfYXN5bmNWYWxpZGF0b3JzOiBhbnlbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7IHRoaXMuZm9ybURpcmVjdGl2ZS5hZGRDb250cm9sR3JvdXAodGhpcyk7IH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHsgdGhpcy5mb3JtRGlyZWN0aXZlLnJlbW92ZUNvbnRyb2xHcm91cCh0aGlzKTsgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHtAbGluayBDb250cm9sR3JvdXB9IGJhY2tpbmcgdGhpcyBiaW5kaW5nLlxuICAgKi9cbiAgZ2V0IGNvbnRyb2woKTogQ29udHJvbEdyb3VwIHsgcmV0dXJuIHRoaXMuZm9ybURpcmVjdGl2ZS5nZXRDb250cm9sR3JvdXAodGhpcyk7IH1cblxuICAvKipcbiAgICogR2V0IHRoZSBwYXRoIHRvIHRoaXMgY29udHJvbCBncm91cC5cbiAgICovXG4gIGdldCBwYXRoKCk6IHN0cmluZ1tdIHsgcmV0dXJuIGNvbnRyb2xQYXRoKHRoaXMubmFtZSwgdGhpcy5fcGFyZW50KTsgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHtAbGluayBGb3JtfSB0byB3aGljaCB0aGlzIGdyb3VwIGJlbG9uZ3MuXG4gICAqL1xuICBnZXQgZm9ybURpcmVjdGl2ZSgpOiBGb3JtIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5mb3JtRGlyZWN0aXZlOyB9XG5cbiAgZ2V0IHZhbGlkYXRvcigpOiBWYWxpZGF0b3JGbiB7IHJldHVybiBjb21wb3NlVmFsaWRhdG9ycyh0aGlzLl92YWxpZGF0b3JzKTsgfVxuXG4gIGdldCBhc3luY1ZhbGlkYXRvcigpOiBBc3luY1ZhbGlkYXRvckZuIHsgcmV0dXJuIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnModGhpcy5fYXN5bmNWYWxpZGF0b3JzKTsgfVxufVxuIl19