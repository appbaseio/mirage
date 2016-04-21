'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var Locals = (function () {
    function Locals(parent, current) {
        this.parent = parent;
        this.current = current;
    }
    Locals.prototype.contains = function (name) {
        if (this.current.has(name)) {
            return true;
        }
        if (lang_1.isPresent(this.parent)) {
            return this.parent.contains(name);
        }
        return false;
    };
    Locals.prototype.get = function (name) {
        if (this.current.has(name)) {
            return this.current.get(name);
        }
        if (lang_1.isPresent(this.parent)) {
            return this.parent.get(name);
        }
        throw new exceptions_1.BaseException("Cannot find '" + name + "'");
    };
    Locals.prototype.set = function (name, value) {
        // TODO(rado): consider removing this check if we can guarantee this is not
        // exposed to the public API.
        // TODO: vsavkin maybe it should check only the local map
        if (this.current.has(name)) {
            this.current.set(name, value);
        }
        else {
            throw new exceptions_1.BaseException("Setting of new keys post-construction is not supported. Key: " + name + ".");
        }
    };
    Locals.prototype.clearLocalValues = function () { collection_1.MapWrapper.clearValues(this.current); };
    return Locals;
}());
exports.Locals = Locals;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9wYXJzZXIvbG9jYWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBd0IsMEJBQTBCLENBQUMsQ0FBQTtBQUNuRCwyQkFBNEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUM3RCwyQkFBc0MsZ0NBQWdDLENBQUMsQ0FBQTtBQUV2RTtJQUNFLGdCQUFtQixNQUFjLEVBQVMsT0FBc0I7UUFBN0MsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWU7SUFBRyxDQUFDO0lBRXBFLHlCQUFRLEdBQVIsVUFBUyxJQUFZO1FBQ25CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsb0JBQUcsR0FBSCxVQUFJLElBQVk7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCxNQUFNLElBQUksMEJBQWEsQ0FBQyxrQkFBZ0IsSUFBSSxNQUFHLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsb0JBQUcsR0FBSCxVQUFJLElBQVksRUFBRSxLQUFVO1FBQzFCLDJFQUEyRTtRQUMzRSw2QkFBNkI7UUFDN0IseURBQXlEO1FBQ3pELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxJQUFJLDBCQUFhLENBQ25CLGtFQUFnRSxJQUFJLE1BQUcsQ0FBQyxDQUFDO1FBQy9FLENBQUM7SUFDSCxDQUFDO0lBRUQsaUNBQWdCLEdBQWhCLGNBQTJCLHVCQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEUsYUFBQztBQUFELENBQUMsQUF4Q0QsSUF3Q0M7QUF4Q1ksY0FBTSxTQXdDbEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuZXhwb3J0IGNsYXNzIExvY2FscyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXJlbnQ6IExvY2FscywgcHVibGljIGN1cnJlbnQ6IE1hcDxhbnksIGFueT4pIHt9XG5cbiAgY29udGFpbnMobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuY3VycmVudC5oYXMobmFtZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChpc1ByZXNlbnQodGhpcy5wYXJlbnQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuY29udGFpbnMobmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0KG5hbWU6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKHRoaXMuY3VycmVudC5oYXMobmFtZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnQuZ2V0KG5hbWUpO1xuICAgIH1cblxuICAgIGlmIChpc1ByZXNlbnQodGhpcy5wYXJlbnQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0KG5hbWUpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBDYW5ub3QgZmluZCAnJHtuYW1lfSdgKTtcbiAgfVxuXG4gIHNldChuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAvLyBUT0RPKHJhZG8pOiBjb25zaWRlciByZW1vdmluZyB0aGlzIGNoZWNrIGlmIHdlIGNhbiBndWFyYW50ZWUgdGhpcyBpcyBub3RcbiAgICAvLyBleHBvc2VkIHRvIHRoZSBwdWJsaWMgQVBJLlxuICAgIC8vIFRPRE86IHZzYXZraW4gbWF5YmUgaXQgc2hvdWxkIGNoZWNrIG9ubHkgdGhlIGxvY2FsIG1hcFxuICAgIGlmICh0aGlzLmN1cnJlbnQuaGFzKG5hbWUpKSB7XG4gICAgICB0aGlzLmN1cnJlbnQuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICAgICAgYFNldHRpbmcgb2YgbmV3IGtleXMgcG9zdC1jb25zdHJ1Y3Rpb24gaXMgbm90IHN1cHBvcnRlZC4gS2V5OiAke25hbWV9LmApO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyTG9jYWxWYWx1ZXMoKTogdm9pZCB7IE1hcFdyYXBwZXIuY2xlYXJWYWx1ZXModGhpcy5jdXJyZW50KTsgfVxufVxuIl19