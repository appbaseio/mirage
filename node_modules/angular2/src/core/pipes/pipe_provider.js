'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var provider_1 = require('angular2/src/core/di/provider');
var di_1 = require('angular2/src/core/di');
var PipeProvider = (function (_super) {
    __extends(PipeProvider, _super);
    function PipeProvider(name, pure, key, resolvedFactories, multiBinding) {
        _super.call(this, key, resolvedFactories, multiBinding);
        this.name = name;
        this.pure = pure;
    }
    PipeProvider.createFromType = function (type, metadata) {
        var provider = new di_1.Provider(type, { useClass: type });
        var rb = provider_1.resolveProvider(provider);
        return new PipeProvider(metadata.name, metadata.pure, rb.key, rb.resolvedFactories, rb.multiProvider);
    };
    return PipeProvider;
}(provider_1.ResolvedProvider_));
exports.PipeProvider = PipeProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZV9wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL3BpcGVzL3BpcGVfcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EseUJBQWtFLCtCQUErQixDQUFDLENBQUE7QUFDbEcsbUJBQThDLHNCQUFzQixDQUFDLENBQUE7QUFHckU7SUFBa0MsZ0NBQWlCO0lBQ2pELHNCQUFtQixJQUFZLEVBQVMsSUFBYSxFQUFFLEdBQVEsRUFDbkQsaUJBQW9DLEVBQUUsWUFBcUI7UUFDckUsa0JBQU0sR0FBRyxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRjNCLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFTO0lBR3JELENBQUM7SUFFTSwyQkFBYyxHQUFyQixVQUFzQixJQUFVLEVBQUUsUUFBc0I7UUFDdEQsSUFBSSxRQUFRLEdBQUcsSUFBSSxhQUFRLENBQUMsSUFBSSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxFQUFFLEdBQUcsMEJBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixFQUMxRCxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQVpELENBQWtDLDRCQUFpQixHQVlsRDtBQVpZLG9CQUFZLGVBWXhCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1Jlc29sdmVkRmFjdG9yeSwgcmVzb2x2ZVByb3ZpZGVyLCBSZXNvbHZlZFByb3ZpZGVyX30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGkvcHJvdmlkZXInO1xuaW1wb3J0IHtLZXksIFJlc29sdmVkUHJvdmlkZXIsIFByb3ZpZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge1BpcGVNZXRhZGF0YX0gZnJvbSAnLi4vbWV0YWRhdGEvZGlyZWN0aXZlcyc7XG5cbmV4cG9ydCBjbGFzcyBQaXBlUHJvdmlkZXIgZXh0ZW5kcyBSZXNvbHZlZFByb3ZpZGVyXyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBwdXJlOiBib29sZWFuLCBrZXk6IEtleSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRGYWN0b3JpZXM6IFJlc29sdmVkRmFjdG9yeVtdLCBtdWx0aUJpbmRpbmc6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihrZXksIHJlc29sdmVkRmFjdG9yaWVzLCBtdWx0aUJpbmRpbmcpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUZyb21UeXBlKHR5cGU6IFR5cGUsIG1ldGFkYXRhOiBQaXBlTWV0YWRhdGEpOiBQaXBlUHJvdmlkZXIge1xuICAgIHZhciBwcm92aWRlciA9IG5ldyBQcm92aWRlcih0eXBlLCB7dXNlQ2xhc3M6IHR5cGV9KTtcbiAgICB2YXIgcmIgPSByZXNvbHZlUHJvdmlkZXIocHJvdmlkZXIpO1xuICAgIHJldHVybiBuZXcgUGlwZVByb3ZpZGVyKG1ldGFkYXRhLm5hbWUsIG1ldGFkYXRhLnB1cmUsIHJiLmtleSwgcmIucmVzb2x2ZWRGYWN0b3JpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmIubXVsdGlQcm92aWRlcik7XG4gIH1cbn1cbiJdfQ==