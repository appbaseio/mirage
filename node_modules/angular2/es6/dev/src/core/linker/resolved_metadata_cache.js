var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '../di';
import { isBlank } from 'angular2/src/facade/lang';
import { DirectiveProvider } from './element';
import { DirectiveResolver, CODEGEN_DIRECTIVE_RESOLVER } from './directive_resolver';
import { PipeProvider } from '../pipes/pipe_provider';
import { PipeResolver, CODEGEN_PIPE_RESOLVER } from './pipe_resolver';
export let ResolvedMetadataCache = class ResolvedMetadataCache {
    constructor(_directiveResolver, _pipeResolver) {
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._directiveCache = new Map();
        this._pipeCache = new Map();
    }
    getResolvedDirectiveMetadata(type) {
        var result = this._directiveCache.get(type);
        if (isBlank(result)) {
            result = DirectiveProvider.createFromType(type, this._directiveResolver.resolve(type));
            this._directiveCache.set(type, result);
        }
        return result;
    }
    getResolvedPipeMetadata(type) {
        var result = this._pipeCache.get(type);
        if (isBlank(result)) {
            result = PipeProvider.createFromType(type, this._pipeResolver.resolve(type));
            this._pipeCache.set(type, result);
        }
        return result;
    }
};
ResolvedMetadataCache = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [DirectiveResolver, PipeResolver])
], ResolvedMetadataCache);
export var CODEGEN_RESOLVED_METADATA_CACHE = new ResolvedMetadataCache(CODEGEN_DIRECTIVE_RESOLVER, CODEGEN_PIPE_RESOLVER);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZWRfbWV0YWRhdGFfY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvcmVzb2x2ZWRfbWV0YWRhdGFfY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxPQUFPO09BQ3pCLEVBQU8sT0FBTyxFQUFDLE1BQU0sMEJBQTBCO09BQy9DLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxXQUFXO09BQ3BDLEVBQUMsaUJBQWlCLEVBQUUsMEJBQTBCLEVBQUMsTUFBTSxzQkFBc0I7T0FDM0UsRUFBQyxZQUFZLEVBQUMsTUFBTSx3QkFBd0I7T0FDNUMsRUFBQyxZQUFZLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxpQkFBaUI7QUFHbkU7SUFJRSxZQUFvQixrQkFBcUMsRUFBVSxhQUEyQjtRQUExRSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWM7UUFIdEYsb0JBQWUsR0FBaUMsSUFBSSxHQUFHLEVBQTJCLENBQUM7UUFDbkYsZUFBVSxHQUE0QixJQUFJLEdBQUcsRUFBc0IsQ0FBQztJQUVxQixDQUFDO0lBRWxHLDRCQUE0QixDQUFDLElBQVU7UUFDckMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixNQUFNLEdBQUcsaUJBQWlCLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdkYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxJQUFVO1FBQ2hDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxHQUFHLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDN0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7QUFDSCxDQUFDO0FBeEJEO0lBQUMsVUFBVSxFQUFFOzt5QkFBQTtBQTBCYixPQUFPLElBQUksK0JBQStCLEdBQ3RDLElBQUkscUJBQXFCLENBQUMsMEJBQTBCLEVBQUUscUJBQXFCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnLi4vZGknO1xuaW1wb3J0IHtUeXBlLCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtEaXJlY3RpdmVQcm92aWRlcn0gZnJvbSAnLi9lbGVtZW50JztcbmltcG9ydCB7RGlyZWN0aXZlUmVzb2x2ZXIsIENPREVHRU5fRElSRUNUSVZFX1JFU09MVkVSfSBmcm9tICcuL2RpcmVjdGl2ZV9yZXNvbHZlcic7XG5pbXBvcnQge1BpcGVQcm92aWRlcn0gZnJvbSAnLi4vcGlwZXMvcGlwZV9wcm92aWRlcic7XG5pbXBvcnQge1BpcGVSZXNvbHZlciwgQ09ERUdFTl9QSVBFX1JFU09MVkVSfSBmcm9tICcuL3BpcGVfcmVzb2x2ZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVzb2x2ZWRNZXRhZGF0YUNhY2hlIHtcbiAgcHJpdmF0ZSBfZGlyZWN0aXZlQ2FjaGU6IE1hcDxUeXBlLCBEaXJlY3RpdmVQcm92aWRlcj4gPSBuZXcgTWFwPFR5cGUsIERpcmVjdGl2ZVByb3ZpZGVyPigpO1xuICBwcml2YXRlIF9waXBlQ2FjaGU6IE1hcDxUeXBlLCBQaXBlUHJvdmlkZXI+ID0gbmV3IE1hcDxUeXBlLCBQaXBlUHJvdmlkZXI+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGlyZWN0aXZlUmVzb2x2ZXI6IERpcmVjdGl2ZVJlc29sdmVyLCBwcml2YXRlIF9waXBlUmVzb2x2ZXI6IFBpcGVSZXNvbHZlcikge31cblxuICBnZXRSZXNvbHZlZERpcmVjdGl2ZU1ldGFkYXRhKHR5cGU6IFR5cGUpOiBEaXJlY3RpdmVQcm92aWRlciB7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMuX2RpcmVjdGl2ZUNhY2hlLmdldCh0eXBlKTtcbiAgICBpZiAoaXNCbGFuayhyZXN1bHQpKSB7XG4gICAgICByZXN1bHQgPSBEaXJlY3RpdmVQcm92aWRlci5jcmVhdGVGcm9tVHlwZSh0eXBlLCB0aGlzLl9kaXJlY3RpdmVSZXNvbHZlci5yZXNvbHZlKHR5cGUpKTtcbiAgICAgIHRoaXMuX2RpcmVjdGl2ZUNhY2hlLnNldCh0eXBlLCByZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0UmVzb2x2ZWRQaXBlTWV0YWRhdGEodHlwZTogVHlwZSk6IFBpcGVQcm92aWRlciB7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMuX3BpcGVDYWNoZS5nZXQodHlwZSk7XG4gICAgaWYgKGlzQmxhbmsocmVzdWx0KSkge1xuICAgICAgcmVzdWx0ID0gUGlwZVByb3ZpZGVyLmNyZWF0ZUZyb21UeXBlKHR5cGUsIHRoaXMuX3BpcGVSZXNvbHZlci5yZXNvbHZlKHR5cGUpKTtcbiAgICAgIHRoaXMuX3BpcGVDYWNoZS5zZXQodHlwZSwgcmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgdmFyIENPREVHRU5fUkVTT0xWRURfTUVUQURBVEFfQ0FDSEUgPVxuICAgIG5ldyBSZXNvbHZlZE1ldGFkYXRhQ2FjaGUoQ09ERUdFTl9ESVJFQ1RJVkVfUkVTT0xWRVIsIENPREVHRU5fUElQRV9SRVNPTFZFUik7XG4iXX0=