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
import { Map } from 'angular2/src/facade/collection';
import { isPresent } from 'angular2/src/facade/lang';
import { DirectiveMetadata, ComponentMetadata } from '../core/metadata';
import { DirectiveResolver } from 'angular2/src/core/linker/directive_resolver';
/**
 * An implementation of {@link DirectiveResolver} that allows overriding
 * various properties of directives.
 */
export let MockDirectiveResolver = class MockDirectiveResolver extends DirectiveResolver {
    constructor(...args) {
        super(...args);
        this._providerOverrides = new Map();
        this.viewProviderOverrides = new Map();
    }
    resolve(type) {
        var dm = super.resolve(type);
        var providerOverrides = this._providerOverrides.get(type);
        var viewProviderOverrides = this.viewProviderOverrides.get(type);
        var providers = dm.providers;
        if (isPresent(providerOverrides)) {
            providers = dm.providers.concat(providerOverrides);
        }
        if (dm instanceof ComponentMetadata) {
            var viewProviders = dm.viewProviders;
            if (isPresent(viewProviderOverrides)) {
                viewProviders = dm.viewProviders.concat(viewProviderOverrides);
            }
            return new ComponentMetadata({
                selector: dm.selector,
                inputs: dm.inputs,
                outputs: dm.outputs,
                host: dm.host,
                exportAs: dm.exportAs,
                moduleId: dm.moduleId,
                queries: dm.queries,
                changeDetection: dm.changeDetection,
                providers: providers,
                viewProviders: viewProviders
            });
        }
        return new DirectiveMetadata({
            selector: dm.selector,
            inputs: dm.inputs,
            outputs: dm.outputs,
            host: dm.host,
            providers: providers,
            exportAs: dm.exportAs,
            queries: dm.queries
        });
    }
    /**
     * @deprecated
     */
    setBindingsOverride(type, bindings) {
        this._providerOverrides.set(type, bindings);
    }
    /**
     * @deprecated
     */
    setViewBindingsOverride(type, viewBindings) {
        this.viewProviderOverrides.set(type, viewBindings);
    }
    setProvidersOverride(type, providers) {
        this._providerOverrides.set(type, providers);
    }
    setViewProvidersOverride(type, viewProviders) {
        this.viewProviderOverrides.set(type, viewProviders);
    }
};
MockDirectiveResolver = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], MockDirectiveResolver);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3Jlc29sdmVyX21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvbW9jay9kaXJlY3RpdmVfcmVzb2x2ZXJfbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHNCQUFzQjtPQUN4QyxFQUFDLEdBQUcsRUFBMEIsTUFBTSxnQ0FBZ0M7T0FDcEUsRUFBTyxTQUFTLEVBQTRCLE1BQU0sMEJBQTBCO09BQzVFLEVBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxrQkFBa0I7T0FDOUQsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDZDQUE2QztBQUU3RTs7O0dBR0c7QUFFSCx1RUFBMkMsaUJBQWlCO0lBQTVEO1FBQTJDLGVBQWlCO1FBQ2xELHVCQUFrQixHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7UUFDNUMsMEJBQXFCLEdBQUcsSUFBSSxHQUFHLEVBQWUsQ0FBQztJQWlFekQsQ0FBQztJQS9EQyxPQUFPLENBQUMsSUFBVTtRQUNoQixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdCLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRCxJQUFJLHFCQUFxQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakUsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDckQsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEVBQUUsWUFBWSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQztZQUNyQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLGFBQWEsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ2pFLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxpQkFBaUIsQ0FBQztnQkFDM0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRO2dCQUNyQixNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU07Z0JBQ2pCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTztnQkFDbkIsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJO2dCQUNiLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUTtnQkFDckIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRO2dCQUNyQixPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU87Z0JBQ25CLGVBQWUsRUFBRSxFQUFFLENBQUMsZUFBZTtnQkFDbkMsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLGFBQWEsRUFBRSxhQUFhO2FBQzdCLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxpQkFBaUIsQ0FBQztZQUMzQixRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVE7WUFDckIsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNO1lBQ2pCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTztZQUNuQixJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUk7WUFDYixTQUFTLEVBQUUsU0FBUztZQUNwQixRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVE7WUFDckIsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPO1NBQ3BCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILG1CQUFtQixDQUFDLElBQVUsRUFBRSxRQUFlO1FBQzdDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRDs7T0FFRztJQUNILHVCQUF1QixDQUFDLElBQVUsRUFBRSxZQUFtQjtRQUNyRCxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsb0JBQW9CLENBQUMsSUFBVSxFQUFFLFNBQWdCO1FBQy9DLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCx3QkFBd0IsQ0FBQyxJQUFVLEVBQUUsYUFBb0I7UUFDdkQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDdEQsQ0FBQztBQUNILENBQUM7QUFwRUQ7SUFBQyxVQUFVLEVBQUU7O3lCQUFBO0FBb0VaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge01hcCwgTWFwV3JhcHBlciwgTGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1R5cGUsIGlzUHJlc2VudCwgc3RyaW5naWZ5LCBpc0JsYW5rLCBwcmludH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7RGlyZWN0aXZlTWV0YWRhdGEsIENvbXBvbmVudE1ldGFkYXRhfSBmcm9tICcuLi9jb3JlL21ldGFkYXRhJztcbmltcG9ydCB7RGlyZWN0aXZlUmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9kaXJlY3RpdmVfcmVzb2x2ZXInO1xuXG4vKipcbiAqIEFuIGltcGxlbWVudGF0aW9uIG9mIHtAbGluayBEaXJlY3RpdmVSZXNvbHZlcn0gdGhhdCBhbGxvd3Mgb3ZlcnJpZGluZ1xuICogdmFyaW91cyBwcm9wZXJ0aWVzIG9mIGRpcmVjdGl2ZXMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNb2NrRGlyZWN0aXZlUmVzb2x2ZXIgZXh0ZW5kcyBEaXJlY3RpdmVSZXNvbHZlciB7XG4gIHByaXZhdGUgX3Byb3ZpZGVyT3ZlcnJpZGVzID0gbmV3IE1hcDxUeXBlLCBhbnlbXT4oKTtcbiAgcHJpdmF0ZSB2aWV3UHJvdmlkZXJPdmVycmlkZXMgPSBuZXcgTWFwPFR5cGUsIGFueVtdPigpO1xuXG4gIHJlc29sdmUodHlwZTogVHlwZSk6IERpcmVjdGl2ZU1ldGFkYXRhIHtcbiAgICB2YXIgZG0gPSBzdXBlci5yZXNvbHZlKHR5cGUpO1xuXG4gICAgdmFyIHByb3ZpZGVyT3ZlcnJpZGVzID0gdGhpcy5fcHJvdmlkZXJPdmVycmlkZXMuZ2V0KHR5cGUpO1xuICAgIHZhciB2aWV3UHJvdmlkZXJPdmVycmlkZXMgPSB0aGlzLnZpZXdQcm92aWRlck92ZXJyaWRlcy5nZXQodHlwZSk7XG5cbiAgICB2YXIgcHJvdmlkZXJzID0gZG0ucHJvdmlkZXJzO1xuICAgIGlmIChpc1ByZXNlbnQocHJvdmlkZXJPdmVycmlkZXMpKSB7XG4gICAgICBwcm92aWRlcnMgPSBkbS5wcm92aWRlcnMuY29uY2F0KHByb3ZpZGVyT3ZlcnJpZGVzKTtcbiAgICB9XG5cbiAgICBpZiAoZG0gaW5zdGFuY2VvZiBDb21wb25lbnRNZXRhZGF0YSkge1xuICAgICAgdmFyIHZpZXdQcm92aWRlcnMgPSBkbS52aWV3UHJvdmlkZXJzO1xuICAgICAgaWYgKGlzUHJlc2VudCh2aWV3UHJvdmlkZXJPdmVycmlkZXMpKSB7XG4gICAgICAgIHZpZXdQcm92aWRlcnMgPSBkbS52aWV3UHJvdmlkZXJzLmNvbmNhdCh2aWV3UHJvdmlkZXJPdmVycmlkZXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IENvbXBvbmVudE1ldGFkYXRhKHtcbiAgICAgICAgc2VsZWN0b3I6IGRtLnNlbGVjdG9yLFxuICAgICAgICBpbnB1dHM6IGRtLmlucHV0cyxcbiAgICAgICAgb3V0cHV0czogZG0ub3V0cHV0cyxcbiAgICAgICAgaG9zdDogZG0uaG9zdCxcbiAgICAgICAgZXhwb3J0QXM6IGRtLmV4cG9ydEFzLFxuICAgICAgICBtb2R1bGVJZDogZG0ubW9kdWxlSWQsXG4gICAgICAgIHF1ZXJpZXM6IGRtLnF1ZXJpZXMsXG4gICAgICAgIGNoYW5nZURldGVjdGlvbjogZG0uY2hhbmdlRGV0ZWN0aW9uLFxuICAgICAgICBwcm92aWRlcnM6IHByb3ZpZGVycyxcbiAgICAgICAgdmlld1Byb3ZpZGVyczogdmlld1Byb3ZpZGVyc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBEaXJlY3RpdmVNZXRhZGF0YSh7XG4gICAgICBzZWxlY3RvcjogZG0uc2VsZWN0b3IsXG4gICAgICBpbnB1dHM6IGRtLmlucHV0cyxcbiAgICAgIG91dHB1dHM6IGRtLm91dHB1dHMsXG4gICAgICBob3N0OiBkbS5ob3N0LFxuICAgICAgcHJvdmlkZXJzOiBwcm92aWRlcnMsXG4gICAgICBleHBvcnRBczogZG0uZXhwb3J0QXMsXG4gICAgICBxdWVyaWVzOiBkbS5xdWVyaWVzXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIHNldEJpbmRpbmdzT3ZlcnJpZGUodHlwZTogVHlwZSwgYmluZGluZ3M6IGFueVtdKTogdm9pZCB7XG4gICAgdGhpcy5fcHJvdmlkZXJPdmVycmlkZXMuc2V0KHR5cGUsIGJpbmRpbmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgc2V0Vmlld0JpbmRpbmdzT3ZlcnJpZGUodHlwZTogVHlwZSwgdmlld0JpbmRpbmdzOiBhbnlbXSk6IHZvaWQge1xuICAgIHRoaXMudmlld1Byb3ZpZGVyT3ZlcnJpZGVzLnNldCh0eXBlLCB2aWV3QmluZGluZ3MpO1xuICB9XG5cbiAgc2V0UHJvdmlkZXJzT3ZlcnJpZGUodHlwZTogVHlwZSwgcHJvdmlkZXJzOiBhbnlbXSk6IHZvaWQge1xuICAgIHRoaXMuX3Byb3ZpZGVyT3ZlcnJpZGVzLnNldCh0eXBlLCBwcm92aWRlcnMpO1xuICB9XG5cbiAgc2V0Vmlld1Byb3ZpZGVyc092ZXJyaWRlKHR5cGU6IFR5cGUsIHZpZXdQcm92aWRlcnM6IGFueVtdKTogdm9pZCB7XG4gICAgdGhpcy52aWV3UHJvdmlkZXJPdmVycmlkZXMuc2V0KHR5cGUsIHZpZXdQcm92aWRlcnMpO1xuICB9XG59XG4iXX0=