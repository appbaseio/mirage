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
var di_1 = require('angular2/src/core/di');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var metadata_1 = require('../core/metadata');
var directive_resolver_1 = require('angular2/src/core/linker/directive_resolver');
/**
 * An implementation of {@link DirectiveResolver} that allows overriding
 * various properties of directives.
 */
var MockDirectiveResolver = (function (_super) {
    __extends(MockDirectiveResolver, _super);
    function MockDirectiveResolver() {
        _super.apply(this, arguments);
        this._providerOverrides = new collection_1.Map();
        this.viewProviderOverrides = new collection_1.Map();
    }
    MockDirectiveResolver.prototype.resolve = function (type) {
        var dm = _super.prototype.resolve.call(this, type);
        var providerOverrides = this._providerOverrides.get(type);
        var viewProviderOverrides = this.viewProviderOverrides.get(type);
        var providers = dm.providers;
        if (lang_1.isPresent(providerOverrides)) {
            providers = dm.providers.concat(providerOverrides);
        }
        if (dm instanceof metadata_1.ComponentMetadata) {
            var viewProviders = dm.viewProviders;
            if (lang_1.isPresent(viewProviderOverrides)) {
                viewProviders = dm.viewProviders.concat(viewProviderOverrides);
            }
            return new metadata_1.ComponentMetadata({
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
        return new metadata_1.DirectiveMetadata({
            selector: dm.selector,
            inputs: dm.inputs,
            outputs: dm.outputs,
            host: dm.host,
            providers: providers,
            exportAs: dm.exportAs,
            queries: dm.queries
        });
    };
    /**
     * @deprecated
     */
    MockDirectiveResolver.prototype.setBindingsOverride = function (type, bindings) {
        this._providerOverrides.set(type, bindings);
    };
    /**
     * @deprecated
     */
    MockDirectiveResolver.prototype.setViewBindingsOverride = function (type, viewBindings) {
        this.viewProviderOverrides.set(type, viewBindings);
    };
    MockDirectiveResolver.prototype.setProvidersOverride = function (type, providers) {
        this._providerOverrides.set(type, providers);
    };
    MockDirectiveResolver.prototype.setViewProvidersOverride = function (type, viewProviders) {
        this.viewProviderOverrides.set(type, viewProviders);
    };
    MockDirectiveResolver = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MockDirectiveResolver);
    return MockDirectiveResolver;
}(directive_resolver_1.DirectiveResolver));
exports.MockDirectiveResolver = MockDirectiveResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3Jlc29sdmVyX21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvbW9jay9kaXJlY3RpdmVfcmVzb2x2ZXJfbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQkFBeUIsc0JBQXNCLENBQUMsQ0FBQTtBQUNoRCwyQkFBMkMsZ0NBQWdDLENBQUMsQ0FBQTtBQUM1RSxxQkFBeUQsMEJBQTBCLENBQUMsQ0FBQTtBQUNwRix5QkFBbUQsa0JBQWtCLENBQUMsQ0FBQTtBQUN0RSxtQ0FBZ0MsNkNBQTZDLENBQUMsQ0FBQTtBQUU5RTs7O0dBR0c7QUFFSDtJQUEyQyx5Q0FBaUI7SUFBNUQ7UUFBMkMsOEJBQWlCO1FBQ2xELHVCQUFrQixHQUFHLElBQUksZ0JBQUcsRUFBZSxDQUFDO1FBQzVDLDBCQUFxQixHQUFHLElBQUksZ0JBQUcsRUFBZSxDQUFDO0lBaUV6RCxDQUFDO0lBL0RDLHVDQUFPLEdBQVAsVUFBUSxJQUFVO1FBQ2hCLElBQUksRUFBRSxHQUFHLGdCQUFLLENBQUMsT0FBTyxZQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdCLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRCxJQUFJLHFCQUFxQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakUsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLFNBQVMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxFQUFFLFlBQVksNEJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUM7WUFDckMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckMsYUFBYSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDakUsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLDRCQUFpQixDQUFDO2dCQUMzQixRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVE7Z0JBQ3JCLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTTtnQkFDakIsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUk7Z0JBQ2IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRO2dCQUNyQixRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVE7Z0JBQ3JCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTztnQkFDbkIsZUFBZSxFQUFFLEVBQUUsQ0FBQyxlQUFlO2dCQUNuQyxTQUFTLEVBQUUsU0FBUztnQkFDcEIsYUFBYSxFQUFFLGFBQWE7YUFDN0IsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLDRCQUFpQixDQUFDO1lBQzNCLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUTtZQUNyQixNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU07WUFDakIsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPO1lBQ25CLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSTtZQUNiLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUTtZQUNyQixPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU87U0FDcEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsbURBQW1CLEdBQW5CLFVBQW9CLElBQVUsRUFBRSxRQUFlO1FBQzdDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRDs7T0FFRztJQUNILHVEQUF1QixHQUF2QixVQUF3QixJQUFVLEVBQUUsWUFBbUI7UUFDckQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELG9EQUFvQixHQUFwQixVQUFxQixJQUFVLEVBQUUsU0FBZ0I7UUFDL0MsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELHdEQUF3QixHQUF4QixVQUF5QixJQUFVLEVBQUUsYUFBb0I7UUFDdkQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQW5FSDtRQUFDLGVBQVUsRUFBRTs7NkJBQUE7SUFvRWIsNEJBQUM7QUFBRCxDQUFDLEFBbkVELENBQTJDLHNDQUFpQixHQW1FM0Q7QUFuRVksNkJBQXFCLHdCQW1FakMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtNYXAsIE1hcFdyYXBwZXIsIExpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtUeXBlLCBpc1ByZXNlbnQsIHN0cmluZ2lmeSwgaXNCbGFuaywgcHJpbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0RpcmVjdGl2ZU1ldGFkYXRhLCBDb21wb25lbnRNZXRhZGF0YX0gZnJvbSAnLi4vY29yZS9tZXRhZGF0YSc7XG5pbXBvcnQge0RpcmVjdGl2ZVJlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvZGlyZWN0aXZlX3Jlc29sdmVyJztcblxuLyoqXG4gKiBBbiBpbXBsZW1lbnRhdGlvbiBvZiB7QGxpbmsgRGlyZWN0aXZlUmVzb2x2ZXJ9IHRoYXQgYWxsb3dzIG92ZXJyaWRpbmdcbiAqIHZhcmlvdXMgcHJvcGVydGllcyBvZiBkaXJlY3RpdmVzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTW9ja0RpcmVjdGl2ZVJlc29sdmVyIGV4dGVuZHMgRGlyZWN0aXZlUmVzb2x2ZXIge1xuICBwcml2YXRlIF9wcm92aWRlck92ZXJyaWRlcyA9IG5ldyBNYXA8VHlwZSwgYW55W10+KCk7XG4gIHByaXZhdGUgdmlld1Byb3ZpZGVyT3ZlcnJpZGVzID0gbmV3IE1hcDxUeXBlLCBhbnlbXT4oKTtcblxuICByZXNvbHZlKHR5cGU6IFR5cGUpOiBEaXJlY3RpdmVNZXRhZGF0YSB7XG4gICAgdmFyIGRtID0gc3VwZXIucmVzb2x2ZSh0eXBlKTtcblxuICAgIHZhciBwcm92aWRlck92ZXJyaWRlcyA9IHRoaXMuX3Byb3ZpZGVyT3ZlcnJpZGVzLmdldCh0eXBlKTtcbiAgICB2YXIgdmlld1Byb3ZpZGVyT3ZlcnJpZGVzID0gdGhpcy52aWV3UHJvdmlkZXJPdmVycmlkZXMuZ2V0KHR5cGUpO1xuXG4gICAgdmFyIHByb3ZpZGVycyA9IGRtLnByb3ZpZGVycztcbiAgICBpZiAoaXNQcmVzZW50KHByb3ZpZGVyT3ZlcnJpZGVzKSkge1xuICAgICAgcHJvdmlkZXJzID0gZG0ucHJvdmlkZXJzLmNvbmNhdChwcm92aWRlck92ZXJyaWRlcyk7XG4gICAgfVxuXG4gICAgaWYgKGRtIGluc3RhbmNlb2YgQ29tcG9uZW50TWV0YWRhdGEpIHtcbiAgICAgIHZhciB2aWV3UHJvdmlkZXJzID0gZG0udmlld1Byb3ZpZGVycztcbiAgICAgIGlmIChpc1ByZXNlbnQodmlld1Byb3ZpZGVyT3ZlcnJpZGVzKSkge1xuICAgICAgICB2aWV3UHJvdmlkZXJzID0gZG0udmlld1Byb3ZpZGVycy5jb25jYXQodmlld1Byb3ZpZGVyT3ZlcnJpZGVzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBDb21wb25lbnRNZXRhZGF0YSh7XG4gICAgICAgIHNlbGVjdG9yOiBkbS5zZWxlY3RvcixcbiAgICAgICAgaW5wdXRzOiBkbS5pbnB1dHMsXG4gICAgICAgIG91dHB1dHM6IGRtLm91dHB1dHMsXG4gICAgICAgIGhvc3Q6IGRtLmhvc3QsXG4gICAgICAgIGV4cG9ydEFzOiBkbS5leHBvcnRBcyxcbiAgICAgICAgbW9kdWxlSWQ6IGRtLm1vZHVsZUlkLFxuICAgICAgICBxdWVyaWVzOiBkbS5xdWVyaWVzLFxuICAgICAgICBjaGFuZ2VEZXRlY3Rpb246IGRtLmNoYW5nZURldGVjdGlvbixcbiAgICAgICAgcHJvdmlkZXJzOiBwcm92aWRlcnMsXG4gICAgICAgIHZpZXdQcm92aWRlcnM6IHZpZXdQcm92aWRlcnNcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRGlyZWN0aXZlTWV0YWRhdGEoe1xuICAgICAgc2VsZWN0b3I6IGRtLnNlbGVjdG9yLFxuICAgICAgaW5wdXRzOiBkbS5pbnB1dHMsXG4gICAgICBvdXRwdXRzOiBkbS5vdXRwdXRzLFxuICAgICAgaG9zdDogZG0uaG9zdCxcbiAgICAgIHByb3ZpZGVyczogcHJvdmlkZXJzLFxuICAgICAgZXhwb3J0QXM6IGRtLmV4cG9ydEFzLFxuICAgICAgcXVlcmllczogZG0ucXVlcmllc1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBzZXRCaW5kaW5nc092ZXJyaWRlKHR5cGU6IFR5cGUsIGJpbmRpbmdzOiBhbnlbXSk6IHZvaWQge1xuICAgIHRoaXMuX3Byb3ZpZGVyT3ZlcnJpZGVzLnNldCh0eXBlLCBiaW5kaW5ncyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIHNldFZpZXdCaW5kaW5nc092ZXJyaWRlKHR5cGU6IFR5cGUsIHZpZXdCaW5kaW5nczogYW55W10pOiB2b2lkIHtcbiAgICB0aGlzLnZpZXdQcm92aWRlck92ZXJyaWRlcy5zZXQodHlwZSwgdmlld0JpbmRpbmdzKTtcbiAgfVxuXG4gIHNldFByb3ZpZGVyc092ZXJyaWRlKHR5cGU6IFR5cGUsIHByb3ZpZGVyczogYW55W10pOiB2b2lkIHtcbiAgICB0aGlzLl9wcm92aWRlck92ZXJyaWRlcy5zZXQodHlwZSwgcHJvdmlkZXJzKTtcbiAgfVxuXG4gIHNldFZpZXdQcm92aWRlcnNPdmVycmlkZSh0eXBlOiBUeXBlLCB2aWV3UHJvdmlkZXJzOiBhbnlbXSk6IHZvaWQge1xuICAgIHRoaXMudmlld1Byb3ZpZGVyT3ZlcnJpZGVzLnNldCh0eXBlLCB2aWV3UHJvdmlkZXJzKTtcbiAgfVxufVxuIl19