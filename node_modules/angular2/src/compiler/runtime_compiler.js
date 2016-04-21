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
var compiler_1 = require('angular2/src/core/linker/compiler');
var view_ref_1 = require('angular2/src/core/linker/view_ref');
var template_compiler_1 = require('./template_compiler');
var di_1 = require('angular2/src/core/di');
var RuntimeCompiler = (function (_super) {
    __extends(RuntimeCompiler, _super);
    function RuntimeCompiler() {
        _super.apply(this, arguments);
    }
    return RuntimeCompiler;
}(compiler_1.Compiler));
exports.RuntimeCompiler = RuntimeCompiler;
var RuntimeCompiler_ = (function (_super) {
    __extends(RuntimeCompiler_, _super);
    function RuntimeCompiler_(_templateCompiler) {
        _super.call(this);
        this._templateCompiler = _templateCompiler;
    }
    RuntimeCompiler_.prototype.compileInHost = function (componentType) {
        return this._templateCompiler.compileHostComponentRuntime(componentType)
            .then(function (hostViewFactory) { return new view_ref_1.HostViewFactoryRef_(hostViewFactory); });
    };
    RuntimeCompiler_.prototype.clearCache = function () {
        _super.prototype.clearCache.call(this);
        this._templateCompiler.clearCache();
    };
    RuntimeCompiler_ = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [template_compiler_1.TemplateCompiler])
    ], RuntimeCompiler_);
    return RuntimeCompiler_;
}(compiler_1.Compiler_));
exports.RuntimeCompiler_ = RuntimeCompiler_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZV9jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9ydW50aW1lX2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlCQUFrQyxtQ0FBbUMsQ0FBQyxDQUFBO0FBQ3RFLHlCQUFzRCxtQ0FBbUMsQ0FBQyxDQUFBO0FBQzFGLGtDQUErQixxQkFBcUIsQ0FBQyxDQUFBO0FBRXJELG1CQUF5QixzQkFBc0IsQ0FBQyxDQUFBO0FBR2hEO0lBQThDLG1DQUFRO0lBQXREO1FBQThDLDhCQUFRO0lBR3RELENBQUM7SUFBRCxzQkFBQztBQUFELENBQUMsQUFIRCxDQUE4QyxtQkFBUSxHQUdyRDtBQUhxQix1QkFBZSxrQkFHcEMsQ0FBQTtBQUdEO0lBQXNDLG9DQUFTO0lBQzdDLDBCQUFvQixpQkFBbUM7UUFBSSxpQkFBTyxDQUFDO1FBQS9DLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7SUFBYSxDQUFDO0lBRXJFLHdDQUFhLEdBQWIsVUFBYyxhQUFtQjtRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLDJCQUEyQixDQUFDLGFBQWEsQ0FBQzthQUNuRSxJQUFJLENBQUMsVUFBQSxlQUFlLElBQUksT0FBQSxJQUFJLDhCQUFtQixDQUFDLGVBQWUsQ0FBQyxFQUF4QyxDQUF3QyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELHFDQUFVLEdBQVY7UUFDRSxnQkFBSyxDQUFDLFVBQVUsV0FBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBWkg7UUFBQyxlQUFVLEVBQUU7O3dCQUFBO0lBYWIsdUJBQUM7QUFBRCxDQUFDLEFBWkQsQ0FBc0Msb0JBQVMsR0FZOUM7QUFaWSx3QkFBZ0IsbUJBWTVCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBpbGVyLCBDb21waWxlcl99IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9jb21waWxlcic7XG5pbXBvcnQge0hvc3RWaWV3RmFjdG9yeVJlZiwgSG9zdFZpZXdGYWN0b3J5UmVmX30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3ZpZXdfcmVmJztcbmltcG9ydCB7VGVtcGxhdGVDb21waWxlcn0gZnJvbSAnLi90ZW1wbGF0ZV9jb21waWxlcic7XG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtUeXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUnVudGltZUNvbXBpbGVyIGV4dGVuZHMgQ29tcGlsZXIge1xuICBhYnN0cmFjdCBjb21waWxlSW5Ib3N0KGNvbXBvbmVudFR5cGU6IFR5cGUpOiBQcm9taXNlPEhvc3RWaWV3RmFjdG9yeVJlZj47XG4gIGFic3RyYWN0IGNsZWFyQ2FjaGUoKTtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVDb21waWxlcl8gZXh0ZW5kcyBDb21waWxlcl8gaW1wbGVtZW50cyBSdW50aW1lQ29tcGlsZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF90ZW1wbGF0ZUNvbXBpbGVyOiBUZW1wbGF0ZUNvbXBpbGVyKSB7IHN1cGVyKCk7IH1cblxuICBjb21waWxlSW5Ib3N0KGNvbXBvbmVudFR5cGU6IFR5cGUpOiBQcm9taXNlPEhvc3RWaWV3RmFjdG9yeVJlZl8+IHtcbiAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVDb21waWxlci5jb21waWxlSG9zdENvbXBvbmVudFJ1bnRpbWUoY29tcG9uZW50VHlwZSlcbiAgICAgICAgLnRoZW4oaG9zdFZpZXdGYWN0b3J5ID0+IG5ldyBIb3N0Vmlld0ZhY3RvcnlSZWZfKGhvc3RWaWV3RmFjdG9yeSkpO1xuICB9XG5cbiAgY2xlYXJDYWNoZSgpIHtcbiAgICBzdXBlci5jbGVhckNhY2hlKCk7XG4gICAgdGhpcy5fdGVtcGxhdGVDb21waWxlci5jbGVhckNhY2hlKCk7XG4gIH1cbn1cbiJdfQ==