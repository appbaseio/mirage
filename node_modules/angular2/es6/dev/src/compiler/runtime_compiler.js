var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Compiler, Compiler_ } from 'angular2/src/core/linker/compiler';
import { HostViewFactoryRef_ } from 'angular2/src/core/linker/view_ref';
import { TemplateCompiler } from './template_compiler';
import { Injectable } from 'angular2/src/core/di';
export class RuntimeCompiler extends Compiler {
}
export let RuntimeCompiler_ = class RuntimeCompiler_ extends Compiler_ {
    constructor(_templateCompiler) {
        super();
        this._templateCompiler = _templateCompiler;
    }
    compileInHost(componentType) {
        return this._templateCompiler.compileHostComponentRuntime(componentType)
            .then(hostViewFactory => new HostViewFactoryRef_(hostViewFactory));
    }
    clearCache() {
        super.clearCache();
        this._templateCompiler.clearCache();
    }
};
RuntimeCompiler_ = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [TemplateCompiler])
], RuntimeCompiler_);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZV9jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9ydW50aW1lX2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBQyxNQUFNLG1DQUFtQztPQUM5RCxFQUFxQixtQkFBbUIsRUFBQyxNQUFNLG1DQUFtQztPQUNsRixFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCO09BRTdDLEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCO0FBRy9DLHFDQUE4QyxRQUFRO0FBR3RELENBQUM7QUFHRCw2REFBc0MsU0FBUztJQUM3QyxZQUFvQixpQkFBbUM7UUFBSSxPQUFPLENBQUM7UUFBL0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtJQUFhLENBQUM7SUFFckUsYUFBYSxDQUFDLGFBQW1CO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsMkJBQTJCLENBQUMsYUFBYSxDQUFDO2FBQ25FLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxVQUFVO1FBQ1IsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0FBQ0gsQ0FBQztBQWJEO0lBQUMsVUFBVSxFQUFFOztvQkFBQTtBQWFaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21waWxlciwgQ29tcGlsZXJffSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvY29tcGlsZXInO1xuaW1wb3J0IHtIb3N0Vmlld0ZhY3RvcnlSZWYsIEhvc3RWaWV3RmFjdG9yeVJlZl99IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3X3JlZic7XG5pbXBvcnQge1RlbXBsYXRlQ29tcGlsZXJ9IGZyb20gJy4vdGVtcGxhdGVfY29tcGlsZXInO1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJ1bnRpbWVDb21waWxlciBleHRlbmRzIENvbXBpbGVyIHtcbiAgYWJzdHJhY3QgY29tcGlsZUluSG9zdChjb21wb25lbnRUeXBlOiBUeXBlKTogUHJvbWlzZTxIb3N0Vmlld0ZhY3RvcnlSZWY+O1xuICBhYnN0cmFjdCBjbGVhckNhY2hlKCk7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSdW50aW1lQ29tcGlsZXJfIGV4dGVuZHMgQ29tcGlsZXJfIGltcGxlbWVudHMgUnVudGltZUNvbXBpbGVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdGVtcGxhdGVDb21waWxlcjogVGVtcGxhdGVDb21waWxlcikgeyBzdXBlcigpOyB9XG5cbiAgY29tcGlsZUluSG9zdChjb21wb25lbnRUeXBlOiBUeXBlKTogUHJvbWlzZTxIb3N0Vmlld0ZhY3RvcnlSZWZfPiB7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlQ29tcGlsZXIuY29tcGlsZUhvc3RDb21wb25lbnRSdW50aW1lKGNvbXBvbmVudFR5cGUpXG4gICAgICAgIC50aGVuKGhvc3RWaWV3RmFjdG9yeSA9PiBuZXcgSG9zdFZpZXdGYWN0b3J5UmVmXyhob3N0Vmlld0ZhY3RvcnkpKTtcbiAgfVxuXG4gIGNsZWFyQ2FjaGUoKSB7XG4gICAgc3VwZXIuY2xlYXJDYWNoZSgpO1xuICAgIHRoaXMuX3RlbXBsYXRlQ29tcGlsZXIuY2xlYXJDYWNoZSgpO1xuICB9XG59XG4iXX0=