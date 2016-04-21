'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var cd = require('angular2/src/core/change_detection/pipes');
var ProtoPipes = (function () {
    function ProtoPipes(
        /**
        * Map of {@link PipeMetadata} names to {@link PipeMetadata} implementations.
        */
        config) {
        this.config = config;
        this.config = config;
    }
    ProtoPipes.fromProviders = function (providers) {
        var config = {};
        providers.forEach(function (b) { return config[b.name] = b; });
        return new ProtoPipes(config);
    };
    ProtoPipes.prototype.get = function (name) {
        var provider = this.config[name];
        if (lang_1.isBlank(provider))
            throw new exceptions_1.BaseException("Cannot find pipe '" + name + "'.");
        return provider;
    };
    return ProtoPipes;
}());
exports.ProtoPipes = ProtoPipes;
var Pipes = (function () {
    function Pipes(proto, injector) {
        this.proto = proto;
        this.injector = injector;
        /** @internal */
        this._config = {};
    }
    Pipes.prototype.get = function (name) {
        var cached = collection_1.StringMapWrapper.get(this._config, name);
        if (lang_1.isPresent(cached))
            return cached;
        var p = this.proto.get(name);
        var transform = this.injector.instantiateResolved(p);
        var res = new cd.SelectedPipe(transform, p.pure);
        if (p.pure) {
            collection_1.StringMapWrapper.set(this._config, name, res);
        }
        return res;
    };
    return Pipes;
}());
exports.Pipes = Pipes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9waXBlcy9waXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQThDLDBCQUEwQixDQUFDLENBQUE7QUFDekUsMkJBQThDLGdDQUFnQyxDQUFDLENBQUE7QUFDL0UsMkJBQStCLGdDQUFnQyxDQUFDLENBQUE7QUFVaEUsSUFBWSxFQUFFLFdBQU0sMENBQTBDLENBQUMsQ0FBQTtBQUUvRDtJQU9FO1FBQ0k7O1VBRUU7UUFDSyxNQUFxQztRQUFyQyxXQUFNLEdBQU4sTUFBTSxDQUErQjtRQUM5QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBWk0sd0JBQWEsR0FBcEIsVUFBcUIsU0FBeUI7UUFDNUMsSUFBSSxNQUFNLEdBQWtDLEVBQUUsQ0FBQztRQUMvQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQWxCLENBQWtCLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQVVELHdCQUFHLEdBQUgsVUFBSSxJQUFZO1FBQ2QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFBQyxNQUFNLElBQUksMEJBQWEsQ0FBQyx1QkFBcUIsSUFBSSxPQUFJLENBQUMsQ0FBQztRQUM5RSxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUFwQkQsSUFvQkM7QUFwQlksa0JBQVUsYUFvQnRCLENBQUE7QUFJRDtJQUlFLGVBQW1CLEtBQWlCLEVBQVMsUUFBa0I7UUFBNUMsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVU7UUFIL0QsZ0JBQWdCO1FBQ2hCLFlBQU8sR0FBcUMsRUFBRSxDQUFDO0lBRW1CLENBQUM7SUFFbkUsbUJBQUcsR0FBSCxVQUFJLElBQVk7UUFDZCxJQUFJLE1BQU0sR0FBRyw2QkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RCxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNyQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1gsNkJBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUNILFlBQUM7QUFBRCxDQUFDLEFBbkJELElBbUJDO0FBbkJZLGFBQUssUUFtQmpCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQmxhbmssIGlzUHJlc2VudCwgQ09OU1QsIFR5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge1N0cmluZ01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1xuICBJbmplY3RhYmxlLFxuICBPcHRpb25hbE1ldGFkYXRhLFxuICBTa2lwU2VsZk1ldGFkYXRhLFxuICBQcm92aWRlcixcbiAgSW5qZWN0b3IsXG4gIGJpbmRcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtQaXBlUHJvdmlkZXJ9IGZyb20gJy4vcGlwZV9wcm92aWRlcic7XG5pbXBvcnQgKiBhcyBjZCBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL3BpcGVzJztcblxuZXhwb3J0IGNsYXNzIFByb3RvUGlwZXMge1xuICBzdGF0aWMgZnJvbVByb3ZpZGVycyhwcm92aWRlcnM6IFBpcGVQcm92aWRlcltdKTogUHJvdG9QaXBlcyB7XG4gICAgdmFyIGNvbmZpZzoge1trZXk6IHN0cmluZ106IFBpcGVQcm92aWRlcn0gPSB7fTtcbiAgICBwcm92aWRlcnMuZm9yRWFjaChiID0+IGNvbmZpZ1tiLm5hbWVdID0gYik7XG4gICAgcmV0dXJuIG5ldyBQcm90b1BpcGVzKGNvbmZpZyk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIC8qKlxuICAgICAgKiBNYXAgb2Yge0BsaW5rIFBpcGVNZXRhZGF0YX0gbmFtZXMgdG8ge0BsaW5rIFBpcGVNZXRhZGF0YX0gaW1wbGVtZW50YXRpb25zLlxuICAgICAgKi9cbiAgICAgIHB1YmxpYyBjb25maWc6IHtba2V5OiBzdHJpbmddOiBQaXBlUHJvdmlkZXJ9KSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gIH1cblxuICBnZXQobmFtZTogc3RyaW5nKTogUGlwZVByb3ZpZGVyIHtcbiAgICB2YXIgcHJvdmlkZXIgPSB0aGlzLmNvbmZpZ1tuYW1lXTtcbiAgICBpZiAoaXNCbGFuayhwcm92aWRlcikpIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBDYW5ub3QgZmluZCBwaXBlICcke25hbWV9Jy5gKTtcbiAgICByZXR1cm4gcHJvdmlkZXI7XG4gIH1cbn1cblxuXG5cbmV4cG9ydCBjbGFzcyBQaXBlcyBpbXBsZW1lbnRzIGNkLlBpcGVzIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29uZmlnOiB7W2tleTogc3RyaW5nXTogY2QuU2VsZWN0ZWRQaXBlfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm90bzogUHJvdG9QaXBlcywgcHVibGljIGluamVjdG9yOiBJbmplY3Rvcikge31cblxuICBnZXQobmFtZTogc3RyaW5nKTogY2QuU2VsZWN0ZWRQaXBlIHtcbiAgICB2YXIgY2FjaGVkID0gU3RyaW5nTWFwV3JhcHBlci5nZXQodGhpcy5fY29uZmlnLCBuYW1lKTtcbiAgICBpZiAoaXNQcmVzZW50KGNhY2hlZCkpIHJldHVybiBjYWNoZWQ7XG4gICAgdmFyIHAgPSB0aGlzLnByb3RvLmdldChuYW1lKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gdGhpcy5pbmplY3Rvci5pbnN0YW50aWF0ZVJlc29sdmVkKHApO1xuICAgIHZhciByZXMgPSBuZXcgY2QuU2VsZWN0ZWRQaXBlKHRyYW5zZm9ybSwgcC5wdXJlKTtcblxuICAgIGlmIChwLnB1cmUpIHtcbiAgICAgIFN0cmluZ01hcFdyYXBwZXIuc2V0KHRoaXMuX2NvbmZpZywgbmFtZSwgcmVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG4iXX0=