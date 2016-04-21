'use strict';"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var di_1 = require('../di');
var lang_1 = require('angular2/src/facade/lang');
var element_1 = require('./element');
var directive_resolver_1 = require('./directive_resolver');
var pipe_provider_1 = require('../pipes/pipe_provider');
var pipe_resolver_1 = require('./pipe_resolver');
var ResolvedMetadataCache = (function () {
    function ResolvedMetadataCache(_directiveResolver, _pipeResolver) {
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._directiveCache = new Map();
        this._pipeCache = new Map();
    }
    ResolvedMetadataCache.prototype.getResolvedDirectiveMetadata = function (type) {
        var result = this._directiveCache.get(type);
        if (lang_1.isBlank(result)) {
            result = element_1.DirectiveProvider.createFromType(type, this._directiveResolver.resolve(type));
            this._directiveCache.set(type, result);
        }
        return result;
    };
    ResolvedMetadataCache.prototype.getResolvedPipeMetadata = function (type) {
        var result = this._pipeCache.get(type);
        if (lang_1.isBlank(result)) {
            result = pipe_provider_1.PipeProvider.createFromType(type, this._pipeResolver.resolve(type));
            this._pipeCache.set(type, result);
        }
        return result;
    };
    ResolvedMetadataCache = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [directive_resolver_1.DirectiveResolver, pipe_resolver_1.PipeResolver])
    ], ResolvedMetadataCache);
    return ResolvedMetadataCache;
}());
exports.ResolvedMetadataCache = ResolvedMetadataCache;
exports.CODEGEN_RESOLVED_METADATA_CACHE = new ResolvedMetadataCache(directive_resolver_1.CODEGEN_DIRECTIVE_RESOLVER, pipe_resolver_1.CODEGEN_PIPE_RESOLVER);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZWRfbWV0YWRhdGFfY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvcmVzb2x2ZWRfbWV0YWRhdGFfY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1CQUF5QixPQUFPLENBQUMsQ0FBQTtBQUNqQyxxQkFBNEIsMEJBQTBCLENBQUMsQ0FBQTtBQUN2RCx3QkFBZ0MsV0FBVyxDQUFDLENBQUE7QUFDNUMsbUNBQTRELHNCQUFzQixDQUFDLENBQUE7QUFDbkYsOEJBQTJCLHdCQUF3QixDQUFDLENBQUE7QUFDcEQsOEJBQWtELGlCQUFpQixDQUFDLENBQUE7QUFHcEU7SUFJRSwrQkFBb0Isa0JBQXFDLEVBQVUsYUFBMkI7UUFBMUUsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1FBSHRGLG9CQUFlLEdBQWlDLElBQUksR0FBRyxFQUEyQixDQUFDO1FBQ25GLGVBQVUsR0FBNEIsSUFBSSxHQUFHLEVBQXNCLENBQUM7SUFFcUIsQ0FBQztJQUVsRyw0REFBNEIsR0FBNUIsVUFBNkIsSUFBVTtRQUNyQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sR0FBRywyQkFBaUIsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN2RixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELHVEQUF1QixHQUF2QixVQUF3QixJQUFVO1FBQ2hDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxHQUFHLDRCQUFZLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzdFLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBdkJIO1FBQUMsZUFBVSxFQUFFOzs2QkFBQTtJQXdCYiw0QkFBQztBQUFELENBQUMsQUF2QkQsSUF1QkM7QUF2QlksNkJBQXFCLHdCQXVCakMsQ0FBQTtBQUVVLHVDQUErQixHQUN0QyxJQUFJLHFCQUFxQixDQUFDLCtDQUEwQixFQUFFLHFDQUFxQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJy4uL2RpJztcbmltcG9ydCB7VHlwZSwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7RGlyZWN0aXZlUHJvdmlkZXJ9IGZyb20gJy4vZWxlbWVudCc7XG5pbXBvcnQge0RpcmVjdGl2ZVJlc29sdmVyLCBDT0RFR0VOX0RJUkVDVElWRV9SRVNPTFZFUn0gZnJvbSAnLi9kaXJlY3RpdmVfcmVzb2x2ZXInO1xuaW1wb3J0IHtQaXBlUHJvdmlkZXJ9IGZyb20gJy4uL3BpcGVzL3BpcGVfcHJvdmlkZXInO1xuaW1wb3J0IHtQaXBlUmVzb2x2ZXIsIENPREVHRU5fUElQRV9SRVNPTFZFUn0gZnJvbSAnLi9waXBlX3Jlc29sdmVyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJlc29sdmVkTWV0YWRhdGFDYWNoZSB7XG4gIHByaXZhdGUgX2RpcmVjdGl2ZUNhY2hlOiBNYXA8VHlwZSwgRGlyZWN0aXZlUHJvdmlkZXI+ID0gbmV3IE1hcDxUeXBlLCBEaXJlY3RpdmVQcm92aWRlcj4oKTtcbiAgcHJpdmF0ZSBfcGlwZUNhY2hlOiBNYXA8VHlwZSwgUGlwZVByb3ZpZGVyPiA9IG5ldyBNYXA8VHlwZSwgUGlwZVByb3ZpZGVyPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RpcmVjdGl2ZVJlc29sdmVyOiBEaXJlY3RpdmVSZXNvbHZlciwgcHJpdmF0ZSBfcGlwZVJlc29sdmVyOiBQaXBlUmVzb2x2ZXIpIHt9XG5cbiAgZ2V0UmVzb2x2ZWREaXJlY3RpdmVNZXRhZGF0YSh0eXBlOiBUeXBlKTogRGlyZWN0aXZlUHJvdmlkZXIge1xuICAgIHZhciByZXN1bHQgPSB0aGlzLl9kaXJlY3RpdmVDYWNoZS5nZXQodHlwZSk7XG4gICAgaWYgKGlzQmxhbmsocmVzdWx0KSkge1xuICAgICAgcmVzdWx0ID0gRGlyZWN0aXZlUHJvdmlkZXIuY3JlYXRlRnJvbVR5cGUodHlwZSwgdGhpcy5fZGlyZWN0aXZlUmVzb2x2ZXIucmVzb2x2ZSh0eXBlKSk7XG4gICAgICB0aGlzLl9kaXJlY3RpdmVDYWNoZS5zZXQodHlwZSwgcmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldFJlc29sdmVkUGlwZU1ldGFkYXRhKHR5cGU6IFR5cGUpOiBQaXBlUHJvdmlkZXIge1xuICAgIHZhciByZXN1bHQgPSB0aGlzLl9waXBlQ2FjaGUuZ2V0KHR5cGUpO1xuICAgIGlmIChpc0JsYW5rKHJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdCA9IFBpcGVQcm92aWRlci5jcmVhdGVGcm9tVHlwZSh0eXBlLCB0aGlzLl9waXBlUmVzb2x2ZXIucmVzb2x2ZSh0eXBlKSk7XG4gICAgICB0aGlzLl9waXBlQ2FjaGUuc2V0KHR5cGUsIHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IHZhciBDT0RFR0VOX1JFU09MVkVEX01FVEFEQVRBX0NBQ0hFID1cbiAgICBuZXcgUmVzb2x2ZWRNZXRhZGF0YUNhY2hlKENPREVHRU5fRElSRUNUSVZFX1JFU09MVkVSLCBDT0RFR0VOX1BJUEVfUkVTT0xWRVIpO1xuIl19