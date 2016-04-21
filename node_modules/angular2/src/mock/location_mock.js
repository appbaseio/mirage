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
var di_1 = require('angular2/src/core/di');
var async_1 = require('angular2/src/facade/async');
/**
 * A spy for {@link Location} that allows tests to fire simulated location events.
 */
var SpyLocation = (function () {
    function SpyLocation() {
        this.urlChanges = [];
        /** @internal */
        this._path = '';
        /** @internal */
        this._query = '';
        /** @internal */
        this._subject = new async_1.EventEmitter();
        /** @internal */
        this._baseHref = '';
        // TODO: remove these once Location is an interface, and can be implemented cleanly
        this.platformStrategy = null;
    }
    SpyLocation.prototype.setInitialPath = function (url) { this._path = url; };
    SpyLocation.prototype.setBaseHref = function (url) { this._baseHref = url; };
    SpyLocation.prototype.path = function () { return this._path; };
    SpyLocation.prototype.simulateUrlPop = function (pathname) {
        async_1.ObservableWrapper.callEmit(this._subject, { 'url': pathname, 'pop': true });
    };
    SpyLocation.prototype.simulateHashChange = function (pathname) {
        // Because we don't prevent the native event, the browser will independently update the path
        this.setInitialPath(pathname);
        this.urlChanges.push('hash: ' + pathname);
        async_1.ObservableWrapper.callEmit(this._subject, { 'url': pathname, 'pop': true, 'type': 'hashchange' });
    };
    SpyLocation.prototype.prepareExternalUrl = function (url) {
        if (url.length > 0 && !url.startsWith('/')) {
            url = '/' + url;
        }
        return this._baseHref + url;
    };
    SpyLocation.prototype.go = function (path, query) {
        if (query === void 0) { query = ''; }
        path = this.prepareExternalUrl(path);
        if (this._path == path && this._query == query) {
            return;
        }
        this._path = path;
        this._query = query;
        var url = path + (query.length > 0 ? ('?' + query) : '');
        this.urlChanges.push(url);
    };
    SpyLocation.prototype.replaceState = function (path, query) {
        if (query === void 0) { query = ''; }
        path = this.prepareExternalUrl(path);
        this._path = path;
        this._query = query;
        var url = path + (query.length > 0 ? ('?' + query) : '');
        this.urlChanges.push('replace: ' + url);
    };
    SpyLocation.prototype.forward = function () {
        // TODO
    };
    SpyLocation.prototype.back = function () {
        // TODO
    };
    SpyLocation.prototype.subscribe = function (onNext, onThrow, onReturn) {
        if (onThrow === void 0) { onThrow = null; }
        if (onReturn === void 0) { onReturn = null; }
        return async_1.ObservableWrapper.subscribe(this._subject, onNext, onThrow, onReturn);
    };
    SpyLocation.prototype.normalize = function (url) { return null; };
    SpyLocation = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SpyLocation);
    return SpyLocation;
}());
exports.SpyLocation = SpyLocation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb25fbW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9tb2NrL2xvY2F0aW9uX21vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1CQUF5QixzQkFBc0IsQ0FBQyxDQUFBO0FBQ2hELHNCQUE4QywyQkFBMkIsQ0FBQyxDQUFBO0FBSTFFOztHQUVHO0FBRUg7SUFBQTtRQUNFLGVBQVUsR0FBYSxFQUFFLENBQUM7UUFDMUIsZ0JBQWdCO1FBQ2hCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsZ0JBQWdCO1FBQ2hCLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFDcEIsZ0JBQWdCO1FBQ2hCLGFBQVEsR0FBc0IsSUFBSSxvQkFBWSxFQUFFLENBQUM7UUFDakQsZ0JBQWdCO1FBQ2hCLGNBQVMsR0FBVyxFQUFFLENBQUM7UUE0RHZCLG1GQUFtRjtRQUNuRixxQkFBZ0IsR0FBUSxJQUFJLENBQUM7SUFFL0IsQ0FBQztJQTdEQyxvQ0FBYyxHQUFkLFVBQWUsR0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUVqRCxpQ0FBVyxHQUFYLFVBQVksR0FBVyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUVsRCwwQkFBSSxHQUFKLGNBQWlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUVyQyxvQ0FBYyxHQUFkLFVBQWUsUUFBZ0I7UUFDN0IseUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCx3Q0FBa0IsR0FBbEIsVUFBbUIsUUFBZ0I7UUFDakMsNEZBQTRGO1FBQzVGLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRCx3Q0FBa0IsR0FBbEIsVUFBbUIsR0FBVztRQUM1QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2xCLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7SUFDOUIsQ0FBQztJQUVELHdCQUFFLEdBQUYsVUFBRyxJQUFZLEVBQUUsS0FBa0I7UUFBbEIscUJBQWtCLEdBQWxCLFVBQWtCO1FBQ2pDLElBQUksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBQztRQUNULENBQUM7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUVwQixJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsa0NBQVksR0FBWixVQUFhLElBQVksRUFBRSxLQUFrQjtRQUFsQixxQkFBa0IsR0FBbEIsVUFBa0I7UUFDM0MsSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUVwQixJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELDZCQUFPLEdBQVA7UUFDRSxPQUFPO0lBQ1QsQ0FBQztJQUVELDBCQUFJLEdBQUo7UUFDRSxPQUFPO0lBQ1QsQ0FBQztJQUVELCtCQUFTLEdBQVQsVUFBVSxNQUE0QixFQUFFLE9BQW9DLEVBQ2xFLFFBQTJCO1FBREcsdUJBQW9DLEdBQXBDLGNBQW9DO1FBQ2xFLHdCQUEyQixHQUEzQixlQUEyQjtRQUNuQyxNQUFNLENBQUMseUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBSUQsK0JBQVMsR0FBVCxVQUFVLEdBQVcsSUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQXhFakQ7UUFBQyxlQUFVLEVBQUU7O21CQUFBO0lBeUViLGtCQUFDO0FBQUQsQ0FBQyxBQXhFRCxJQXdFQztBQXhFWSxtQkFBVyxjQXdFdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtFdmVudEVtaXR0ZXIsIE9ic2VydmFibGVXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcbmltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0xvY2F0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvcm91dGVyL2xvY2F0aW9uL2xvY2F0aW9uJztcblxuLyoqXG4gKiBBIHNweSBmb3Ige0BsaW5rIExvY2F0aW9ufSB0aGF0IGFsbG93cyB0ZXN0cyB0byBmaXJlIHNpbXVsYXRlZCBsb2NhdGlvbiBldmVudHMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTcHlMb2NhdGlvbiBpbXBsZW1lbnRzIExvY2F0aW9uIHtcbiAgdXJsQ2hhbmdlczogc3RyaW5nW10gPSBbXTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGF0aDogc3RyaW5nID0gJyc7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3F1ZXJ5OiBzdHJpbmcgPSAnJztcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3ViamVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Jhc2VIcmVmOiBzdHJpbmcgPSAnJztcblxuICBzZXRJbml0aWFsUGF0aCh1cmw6IHN0cmluZykgeyB0aGlzLl9wYXRoID0gdXJsOyB9XG5cbiAgc2V0QmFzZUhyZWYodXJsOiBzdHJpbmcpIHsgdGhpcy5fYmFzZUhyZWYgPSB1cmw7IH1cblxuICBwYXRoKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9wYXRoOyB9XG5cbiAgc2ltdWxhdGVVcmxQb3AocGF0aG5hbWU6IHN0cmluZykge1xuICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMuX3N1YmplY3QsIHsndXJsJzogcGF0aG5hbWUsICdwb3AnOiB0cnVlfSk7XG4gIH1cblxuICBzaW11bGF0ZUhhc2hDaGFuZ2UocGF0aG5hbWU6IHN0cmluZykge1xuICAgIC8vIEJlY2F1c2Ugd2UgZG9uJ3QgcHJldmVudCB0aGUgbmF0aXZlIGV2ZW50LCB0aGUgYnJvd3NlciB3aWxsIGluZGVwZW5kZW50bHkgdXBkYXRlIHRoZSBwYXRoXG4gICAgdGhpcy5zZXRJbml0aWFsUGF0aChwYXRobmFtZSk7XG4gICAgdGhpcy51cmxDaGFuZ2VzLnB1c2goJ2hhc2g6ICcgKyBwYXRobmFtZSk7XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5fc3ViamVjdCwgeyd1cmwnOiBwYXRobmFtZSwgJ3BvcCc6IHRydWUsICd0eXBlJzogJ2hhc2hjaGFuZ2UnfSk7XG4gIH1cblxuICBwcmVwYXJlRXh0ZXJuYWxVcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh1cmwubGVuZ3RoID4gMCAmJiAhdXJsLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgICAgdXJsID0gJy8nICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYmFzZUhyZWYgKyB1cmw7XG4gIH1cblxuICBnbyhwYXRoOiBzdHJpbmcsIHF1ZXJ5OiBzdHJpbmcgPSAnJykge1xuICAgIHBhdGggPSB0aGlzLnByZXBhcmVFeHRlcm5hbFVybChwYXRoKTtcbiAgICBpZiAodGhpcy5fcGF0aCA9PSBwYXRoICYmIHRoaXMuX3F1ZXJ5ID09IHF1ZXJ5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICAgIHRoaXMuX3F1ZXJ5ID0gcXVlcnk7XG5cbiAgICB2YXIgdXJsID0gcGF0aCArIChxdWVyeS5sZW5ndGggPiAwID8gKCc/JyArIHF1ZXJ5KSA6ICcnKTtcbiAgICB0aGlzLnVybENoYW5nZXMucHVzaCh1cmwpO1xuICB9XG5cbiAgcmVwbGFjZVN0YXRlKHBhdGg6IHN0cmluZywgcXVlcnk6IHN0cmluZyA9ICcnKSB7XG4gICAgcGF0aCA9IHRoaXMucHJlcGFyZUV4dGVybmFsVXJsKHBhdGgpO1xuICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICAgIHRoaXMuX3F1ZXJ5ID0gcXVlcnk7XG5cbiAgICB2YXIgdXJsID0gcGF0aCArIChxdWVyeS5sZW5ndGggPiAwID8gKCc/JyArIHF1ZXJ5KSA6ICcnKTtcbiAgICB0aGlzLnVybENoYW5nZXMucHVzaCgncmVwbGFjZTogJyArIHVybCk7XG4gIH1cblxuICBmb3J3YXJkKCkge1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIGJhY2soKSB7XG4gICAgLy8gVE9ET1xuICB9XG5cbiAgc3Vic2NyaWJlKG9uTmV4dDogKHZhbHVlOiBhbnkpID0+IHZvaWQsIG9uVGhyb3c6IChlcnJvcjogYW55KSA9PiB2b2lkID0gbnVsbCxcbiAgICAgICAgICAgIG9uUmV0dXJuOiAoKSA9PiB2b2lkID0gbnVsbCk6IE9iamVjdCB7XG4gICAgcmV0dXJuIE9ic2VydmFibGVXcmFwcGVyLnN1YnNjcmliZSh0aGlzLl9zdWJqZWN0LCBvbk5leHQsIG9uVGhyb3csIG9uUmV0dXJuKTtcbiAgfVxuXG4gIC8vIFRPRE86IHJlbW92ZSB0aGVzZSBvbmNlIExvY2F0aW9uIGlzIGFuIGludGVyZmFjZSwgYW5kIGNhbiBiZSBpbXBsZW1lbnRlZCBjbGVhbmx5XG4gIHBsYXRmb3JtU3RyYXRlZ3k6IGFueSA9IG51bGw7XG4gIG5vcm1hbGl6ZSh1cmw6IHN0cmluZyk6IHN0cmluZyB7IHJldHVybiBudWxsOyB9XG59XG4iXX0=