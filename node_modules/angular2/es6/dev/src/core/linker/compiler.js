var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/src/core/di';
import { isBlank, stringify } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { reflector } from 'angular2/src/core/reflection/reflection';
import { HostViewFactory } from 'angular2/src/core/linker/view';
import { HostViewFactoryRef_ } from 'angular2/src/core/linker/view_ref';
/**
 * Low-level service for compiling {@link Component}s into {@link ProtoViewRef ProtoViews}s, which
 * can later be used to create and render a Component instance.
 *
 * Most applications should instead use higher-level {@link DynamicComponentLoader} service, which
 * both compiles and instantiates a Component.
 */
export class Compiler {
}
function isHostViewFactory(type) {
    return type instanceof HostViewFactory;
}
export let Compiler_ = class Compiler_ extends Compiler {
    compileInHost(componentType) {
        var metadatas = reflector.annotations(componentType);
        var hostViewFactory = metadatas.find(isHostViewFactory);
        if (isBlank(hostViewFactory)) {
            throw new BaseException(`No precompiled component ${stringify(componentType)} found`);
        }
        return PromiseWrapper.resolve(new HostViewFactoryRef_(hostViewFactory));
    }
    clearCache() { }
};
Compiler_ = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], Compiler_);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BRU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxzQkFBc0I7T0FDeEMsRUFBTyxPQUFPLEVBQUUsU0FBUyxFQUFDLE1BQU0sMEJBQTBCO09BQzFELEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO09BQ3JELEVBQUMsY0FBYyxFQUFDLE1BQU0sMkJBQTJCO09BQ2pELEVBQUMsU0FBUyxFQUFDLE1BQU0seUNBQXlDO09BQzFELEVBQUMsZUFBZSxFQUFDLE1BQU0sK0JBQStCO09BQ3RELEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxtQ0FBbUM7QUFFckU7Ozs7OztHQU1HO0FBQ0g7QUFHQSxDQUFDO0FBRUQsMkJBQTJCLElBQVM7SUFDbEMsTUFBTSxDQUFDLElBQUksWUFBWSxlQUFlLENBQUM7QUFDekMsQ0FBQztBQUdELCtDQUErQixRQUFRO0lBQ3JDLGFBQWEsQ0FBQyxhQUFtQjtRQUMvQixJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3JELElBQUksZUFBZSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUV4RCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sSUFBSSxhQUFhLENBQUMsNEJBQTRCLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEYsQ0FBQztRQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksbUJBQW1CLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsVUFBVSxLQUFJLENBQUM7QUFDakIsQ0FBQztBQWJEO0lBQUMsVUFBVSxFQUFFOzthQUFBO0FBYVoiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0hvc3RWaWV3RmFjdG9yeVJlZn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3ZpZXdfcmVmJztcblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge1R5cGUsIGlzQmxhbmssIHN0cmluZ2lmeX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7UHJvbWlzZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHtyZWZsZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdGlvbic7XG5pbXBvcnQge0hvc3RWaWV3RmFjdG9yeX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3ZpZXcnO1xuaW1wb3J0IHtIb3N0Vmlld0ZhY3RvcnlSZWZffSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlld19yZWYnO1xuXG4vKipcbiAqIExvdy1sZXZlbCBzZXJ2aWNlIGZvciBjb21waWxpbmcge0BsaW5rIENvbXBvbmVudH1zIGludG8ge0BsaW5rIFByb3RvVmlld1JlZiBQcm90b1ZpZXdzfXMsIHdoaWNoXG4gKiBjYW4gbGF0ZXIgYmUgdXNlZCB0byBjcmVhdGUgYW5kIHJlbmRlciBhIENvbXBvbmVudCBpbnN0YW5jZS5cbiAqXG4gKiBNb3N0IGFwcGxpY2F0aW9ucyBzaG91bGQgaW5zdGVhZCB1c2UgaGlnaGVyLWxldmVsIHtAbGluayBEeW5hbWljQ29tcG9uZW50TG9hZGVyfSBzZXJ2aWNlLCB3aGljaFxuICogYm90aCBjb21waWxlcyBhbmQgaW5zdGFudGlhdGVzIGEgQ29tcG9uZW50LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29tcGlsZXIge1xuICBhYnN0cmFjdCBjb21waWxlSW5Ib3N0KGNvbXBvbmVudFR5cGU6IFR5cGUpOiBQcm9taXNlPEhvc3RWaWV3RmFjdG9yeVJlZj47XG4gIGFic3RyYWN0IGNsZWFyQ2FjaGUoKTtcbn1cblxuZnVuY3Rpb24gaXNIb3N0Vmlld0ZhY3RvcnkodHlwZTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0eXBlIGluc3RhbmNlb2YgSG9zdFZpZXdGYWN0b3J5O1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29tcGlsZXJfIGV4dGVuZHMgQ29tcGlsZXIge1xuICBjb21waWxlSW5Ib3N0KGNvbXBvbmVudFR5cGU6IFR5cGUpOiBQcm9taXNlPEhvc3RWaWV3RmFjdG9yeVJlZl8+IHtcbiAgICB2YXIgbWV0YWRhdGFzID0gcmVmbGVjdG9yLmFubm90YXRpb25zKGNvbXBvbmVudFR5cGUpO1xuICAgIHZhciBob3N0Vmlld0ZhY3RvcnkgPSBtZXRhZGF0YXMuZmluZChpc0hvc3RWaWV3RmFjdG9yeSk7XG5cbiAgICBpZiAoaXNCbGFuayhob3N0Vmlld0ZhY3RvcnkpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgTm8gcHJlY29tcGlsZWQgY29tcG9uZW50ICR7c3RyaW5naWZ5KGNvbXBvbmVudFR5cGUpfSBmb3VuZGApO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIucmVzb2x2ZShuZXcgSG9zdFZpZXdGYWN0b3J5UmVmXyhob3N0Vmlld0ZhY3RvcnkpKTtcbiAgfVxuXG4gIGNsZWFyQ2FjaGUoKSB7fVxufVxuIl19