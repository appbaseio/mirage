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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var hammer_common_1 = require('./hammer_common');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var core_1 = require('angular2/core');
exports.HAMMER_GESTURE_CONFIG = lang_1.CONST_EXPR(new core_1.OpaqueToken("HammerGestureConfig"));
var HammerGestureConfig = (function () {
    function HammerGestureConfig() {
        this.events = [];
        this.overrides = {};
    }
    HammerGestureConfig.prototype.buildHammer = function (element) {
        var mc = new Hammer(element);
        mc.get('pinch').set({ enable: true });
        mc.get('rotate').set({ enable: true });
        for (var eventName in this.overrides) {
            mc.get(eventName).set(this.overrides[eventName]);
        }
        return mc;
    };
    HammerGestureConfig = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], HammerGestureConfig);
    return HammerGestureConfig;
}());
exports.HammerGestureConfig = HammerGestureConfig;
var HammerGesturesPlugin = (function (_super) {
    __extends(HammerGesturesPlugin, _super);
    function HammerGesturesPlugin(_config) {
        _super.call(this);
        this._config = _config;
    }
    HammerGesturesPlugin.prototype.supports = function (eventName) {
        if (!_super.prototype.supports.call(this, eventName) && !this.isCustomEvent(eventName))
            return false;
        if (!lang_1.isPresent(window['Hammer'])) {
            throw new exceptions_1.BaseException("Hammer.js is not loaded, can not bind " + eventName + " event");
        }
        return true;
    };
    HammerGesturesPlugin.prototype.addEventListener = function (element, eventName, handler) {
        var _this = this;
        var zone = this.manager.getZone();
        eventName = eventName.toLowerCase();
        return zone.runOutsideAngular(function () {
            // Creating the manager bind events, must be done outside of angular
            var mc = _this._config.buildHammer(element);
            var callback = function (eventObj) { zone.run(function () { handler(eventObj); }); };
            mc.on(eventName, callback);
            return function () { mc.off(eventName, callback); };
        });
    };
    HammerGesturesPlugin.prototype.isCustomEvent = function (eventName) { return this._config.events.indexOf(eventName) > -1; };
    HammerGesturesPlugin = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(exports.HAMMER_GESTURE_CONFIG)), 
        __metadata('design:paramtypes', [HammerGestureConfig])
    ], HammerGesturesPlugin);
    return HammerGesturesPlugin;
}(hammer_common_1.HammerGesturesPluginCommon));
exports.HammerGesturesPlugin = HammerGesturesPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyX2dlc3R1cmVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9ldmVudHMvaGFtbWVyX2dlc3R1cmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhCQUF5QyxpQkFBaUIsQ0FBQyxDQUFBO0FBQzNELHFCQUFvQywwQkFBMEIsQ0FBQyxDQUFBO0FBQy9ELDJCQUE4QyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQy9FLHFCQUE4QyxlQUFlLENBQUMsQ0FBQTtBQUVqRCw2QkFBcUIsR0FDOUIsaUJBQVUsQ0FBQyxJQUFJLGtCQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0FBUXZEO0lBQUE7UUFDRSxXQUFNLEdBQWEsRUFBRSxDQUFDO1FBRXRCLGNBQVMsR0FBNEIsRUFBRSxDQUFDO0lBYzFDLENBQUM7SUFaQyx5Q0FBVyxHQUFYLFVBQVksT0FBb0I7UUFDOUIsSUFBSSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFN0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNwQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBRXJDLEdBQUcsQ0FBQyxDQUFDLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBRUQsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFqQkg7UUFBQyxpQkFBVSxFQUFFOzsyQkFBQTtJQWtCYiwwQkFBQztBQUFELENBQUMsQUFqQkQsSUFpQkM7QUFqQlksMkJBQW1CLHNCQWlCL0IsQ0FBQTtBQUdEO0lBQTBDLHdDQUEwQjtJQUNsRSw4QkFBbUQsT0FBNEI7UUFBSSxpQkFBTyxDQUFDO1FBQXhDLFlBQU8sR0FBUCxPQUFPLENBQXFCO0lBQWEsQ0FBQztJQUU3Rix1Q0FBUSxHQUFSLFVBQVMsU0FBaUI7UUFDeEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBSyxDQUFDLFFBQVEsWUFBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRS9FLEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxJQUFJLDBCQUFhLENBQUMsMkNBQXlDLFNBQVMsV0FBUSxDQUFDLENBQUM7UUFDdEYsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsK0NBQWdCLEdBQWhCLFVBQWlCLE9BQW9CLEVBQUUsU0FBaUIsRUFBRSxPQUFpQjtRQUEzRSxpQkFXQztRQVZDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbEMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVwQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBQzVCLG9FQUFvRTtZQUNwRSxJQUFJLEVBQUUsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQyxJQUFJLFFBQVEsR0FBRyxVQUFTLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkYsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLGNBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsNENBQWEsR0FBYixVQUFjLFNBQWlCLElBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUEzQm5HO1FBQUMsaUJBQVUsRUFBRTttQkFFRSxhQUFNLENBQUMsNkJBQXFCLENBQUM7OzRCQUYvQjtJQTRCYiwyQkFBQztBQUFELENBQUMsQUEzQkQsQ0FBMEMsMENBQTBCLEdBMkJuRTtBQTNCWSw0QkFBb0IsdUJBMkJoQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtIYW1tZXJHZXN0dXJlc1BsdWdpbkNvbW1vbn0gZnJvbSAnLi9oYW1tZXJfY29tbW9uJztcbmltcG9ydCB7aXNQcmVzZW50LCBDT05TVF9FWFBSfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBXcmFwcGVkRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtJbmplY3RhYmxlLCBJbmplY3QsIE9wYXF1ZVRva2VufSBmcm9tICdhbmd1bGFyMi9jb3JlJztcblxuZXhwb3J0IGNvbnN0IEhBTU1FUl9HRVNUVVJFX0NPTkZJRzogT3BhcXVlVG9rZW4gPVxuICAgIENPTlNUX0VYUFIobmV3IE9wYXF1ZVRva2VuKFwiSGFtbWVyR2VzdHVyZUNvbmZpZ1wiKSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGFtbWVySW5zdGFuY2Uge1xuICBvbihldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZDtcbiAgb2ZmKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSGFtbWVyR2VzdHVyZUNvbmZpZyB7XG4gIGV2ZW50czogc3RyaW5nW10gPSBbXTtcblxuICBvdmVycmlkZXM6IHtba2V5OiBzdHJpbmddOiBPYmplY3R9ID0ge307XG5cbiAgYnVpbGRIYW1tZXIoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBIYW1tZXJJbnN0YW5jZSB7XG4gICAgdmFyIG1jID0gbmV3IEhhbW1lcihlbGVtZW50KTtcblxuICAgIG1jLmdldCgncGluY2gnKS5zZXQoe2VuYWJsZTogdHJ1ZX0pO1xuICAgIG1jLmdldCgncm90YXRlJykuc2V0KHtlbmFibGU6IHRydWV9KTtcblxuICAgIGZvciAobGV0IGV2ZW50TmFtZSBpbiB0aGlzLm92ZXJyaWRlcykge1xuICAgICAgbWMuZ2V0KGV2ZW50TmFtZSkuc2V0KHRoaXMub3ZlcnJpZGVzW2V2ZW50TmFtZV0pO1xuICAgIH1cblxuICAgIHJldHVybiBtYztcbiAgfVxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSGFtbWVyR2VzdHVyZXNQbHVnaW4gZXh0ZW5kcyBIYW1tZXJHZXN0dXJlc1BsdWdpbkNvbW1vbiB7XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoSEFNTUVSX0dFU1RVUkVfQ09ORklHKSBwcml2YXRlIF9jb25maWc6IEhhbW1lckdlc3R1cmVDb25maWcpIHsgc3VwZXIoKTsgfVxuXG4gIHN1cHBvcnRzKGV2ZW50TmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKCFzdXBlci5zdXBwb3J0cyhldmVudE5hbWUpICYmICF0aGlzLmlzQ3VzdG9tRXZlbnQoZXZlbnROYW1lKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgaWYgKCFpc1ByZXNlbnQod2luZG93WydIYW1tZXInXSkpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBIYW1tZXIuanMgaXMgbm90IGxvYWRlZCwgY2FuIG5vdCBiaW5kICR7ZXZlbnROYW1lfSBldmVudGApO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYWRkRXZlbnRMaXN0ZW5lcihlbGVtZW50OiBIVE1MRWxlbWVudCwgZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIHZhciB6b25lID0gdGhpcy5tYW5hZ2VyLmdldFpvbmUoKTtcbiAgICBldmVudE5hbWUgPSBldmVudE5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgIHJldHVybiB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIC8vIENyZWF0aW5nIHRoZSBtYW5hZ2VyIGJpbmQgZXZlbnRzLCBtdXN0IGJlIGRvbmUgb3V0c2lkZSBvZiBhbmd1bGFyXG4gICAgICB2YXIgbWMgPSB0aGlzLl9jb25maWcuYnVpbGRIYW1tZXIoZWxlbWVudCk7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbihldmVudE9iaikgeyB6b25lLnJ1bihmdW5jdGlvbigpIHsgaGFuZGxlcihldmVudE9iaik7IH0pOyB9O1xuICAgICAgbWMub24oZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gICAgICByZXR1cm4gKCkgPT4geyBtYy5vZmYoZXZlbnROYW1lLCBjYWxsYmFjayk7IH07XG4gICAgfSk7XG4gIH1cblxuICBpc0N1c3RvbUV2ZW50KGV2ZW50TmFtZTogc3RyaW5nKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jb25maWcuZXZlbnRzLmluZGV4T2YoZXZlbnROYW1lKSA+IC0xOyB9XG59XG4iXX0=