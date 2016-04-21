var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MapWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { stringify, looseIdentical, isJsObject, CONST, isBlank } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
export let DefaultKeyValueDifferFactory = class DefaultKeyValueDifferFactory {
    supports(obj) { return obj instanceof Map || isJsObject(obj); }
    create(cdRef) { return new DefaultKeyValueDiffer(); }
};
DefaultKeyValueDifferFactory = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [])
], DefaultKeyValueDifferFactory);
export class DefaultKeyValueDiffer {
    constructor() {
        this._records = new Map();
        this._mapHead = null;
        this._previousMapHead = null;
        this._changesHead = null;
        this._changesTail = null;
        this._additionsHead = null;
        this._additionsTail = null;
        this._removalsHead = null;
        this._removalsTail = null;
    }
    get isDirty() {
        return this._additionsHead !== null || this._changesHead !== null ||
            this._removalsHead !== null;
    }
    forEachItem(fn) {
        var record;
        for (record = this._mapHead; record !== null; record = record._next) {
            fn(record);
        }
    }
    forEachPreviousItem(fn) {
        var record;
        for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
            fn(record);
        }
    }
    forEachChangedItem(fn) {
        var record;
        for (record = this._changesHead; record !== null; record = record._nextChanged) {
            fn(record);
        }
    }
    forEachAddedItem(fn) {
        var record;
        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
            fn(record);
        }
    }
    forEachRemovedItem(fn) {
        var record;
        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
            fn(record);
        }
    }
    diff(map) {
        if (isBlank(map))
            map = MapWrapper.createFromPairs([]);
        if (!(map instanceof Map || isJsObject(map))) {
            throw new BaseException(`Error trying to diff '${map}'`);
        }
        if (this.check(map)) {
            return this;
        }
        else {
            return null;
        }
    }
    onDestroy() { }
    check(map) {
        this._reset();
        var records = this._records;
        var oldSeqRecord = this._mapHead;
        var lastOldSeqRecord = null;
        var lastNewSeqRecord = null;
        var seqChanged = false;
        this._forEach(map, (value, key) => {
            var newSeqRecord;
            if (oldSeqRecord !== null && key === oldSeqRecord.key) {
                newSeqRecord = oldSeqRecord;
                if (!looseIdentical(value, oldSeqRecord.currentValue)) {
                    oldSeqRecord.previousValue = oldSeqRecord.currentValue;
                    oldSeqRecord.currentValue = value;
                    this._addToChanges(oldSeqRecord);
                }
            }
            else {
                seqChanged = true;
                if (oldSeqRecord !== null) {
                    oldSeqRecord._next = null;
                    this._removeFromSeq(lastOldSeqRecord, oldSeqRecord);
                    this._addToRemovals(oldSeqRecord);
                }
                if (records.has(key)) {
                    newSeqRecord = records.get(key);
                }
                else {
                    newSeqRecord = new KeyValueChangeRecord(key);
                    records.set(key, newSeqRecord);
                    newSeqRecord.currentValue = value;
                    this._addToAdditions(newSeqRecord);
                }
            }
            if (seqChanged) {
                if (this._isInRemovals(newSeqRecord)) {
                    this._removeFromRemovals(newSeqRecord);
                }
                if (lastNewSeqRecord == null) {
                    this._mapHead = newSeqRecord;
                }
                else {
                    lastNewSeqRecord._next = newSeqRecord;
                }
            }
            lastOldSeqRecord = oldSeqRecord;
            lastNewSeqRecord = newSeqRecord;
            oldSeqRecord = oldSeqRecord === null ? null : oldSeqRecord._next;
        });
        this._truncate(lastOldSeqRecord, oldSeqRecord);
        return this.isDirty;
    }
    /** @internal */
    _reset() {
        if (this.isDirty) {
            var record;
            // Record the state of the mapping
            for (record = this._previousMapHead = this._mapHead; record !== null; record = record._next) {
                record._nextPrevious = record._next;
            }
            for (record = this._changesHead; record !== null; record = record._nextChanged) {
                record.previousValue = record.currentValue;
            }
            for (record = this._additionsHead; record != null; record = record._nextAdded) {
                record.previousValue = record.currentValue;
            }
            // todo(vicb) once assert is supported
            // assert(() {
            //  var r = _changesHead;
            //  while (r != null) {
            //    var nextRecord = r._nextChanged;
            //    r._nextChanged = null;
            //    r = nextRecord;
            //  }
            //
            //  r = _additionsHead;
            //  while (r != null) {
            //    var nextRecord = r._nextAdded;
            //    r._nextAdded = null;
            //    r = nextRecord;
            //  }
            //
            //  r = _removalsHead;
            //  while (r != null) {
            //    var nextRecord = r._nextRemoved;
            //    r._nextRemoved = null;
            //    r = nextRecord;
            //  }
            //
            //  return true;
            //});
            this._changesHead = this._changesTail = null;
            this._additionsHead = this._additionsTail = null;
            this._removalsHead = this._removalsTail = null;
        }
    }
    /** @internal */
    _truncate(lastRecord, record) {
        while (record !== null) {
            if (lastRecord === null) {
                this._mapHead = null;
            }
            else {
                lastRecord._next = null;
            }
            var nextRecord = record._next;
            // todo(vicb) assert
            // assert((() {
            //  record._next = null;
            //  return true;
            //}));
            this._addToRemovals(record);
            lastRecord = record;
            record = nextRecord;
        }
        for (var rec = this._removalsHead; rec !== null; rec = rec._nextRemoved) {
            rec.previousValue = rec.currentValue;
            rec.currentValue = null;
            this._records.delete(rec.key);
        }
    }
    /** @internal */
    _isInRemovals(record) {
        return record === this._removalsHead || record._nextRemoved !== null ||
            record._prevRemoved !== null;
    }
    /** @internal */
    _addToRemovals(record) {
        // todo(vicb) assert
        // assert(record._next == null);
        // assert(record._nextAdded == null);
        // assert(record._nextChanged == null);
        // assert(record._nextRemoved == null);
        // assert(record._prevRemoved == null);
        if (this._removalsHead === null) {
            this._removalsHead = this._removalsTail = record;
        }
        else {
            this._removalsTail._nextRemoved = record;
            record._prevRemoved = this._removalsTail;
            this._removalsTail = record;
        }
    }
    /** @internal */
    _removeFromSeq(prev, record) {
        var next = record._next;
        if (prev === null) {
            this._mapHead = next;
        }
        else {
            prev._next = next;
        }
        // todo(vicb) assert
        // assert((() {
        //  record._next = null;
        //  return true;
        //})());
    }
    /** @internal */
    _removeFromRemovals(record) {
        // todo(vicb) assert
        // assert(record._next == null);
        // assert(record._nextAdded == null);
        // assert(record._nextChanged == null);
        var prev = record._prevRemoved;
        var next = record._nextRemoved;
        if (prev === null) {
            this._removalsHead = next;
        }
        else {
            prev._nextRemoved = next;
        }
        if (next === null) {
            this._removalsTail = prev;
        }
        else {
            next._prevRemoved = prev;
        }
        record._prevRemoved = record._nextRemoved = null;
    }
    /** @internal */
    _addToAdditions(record) {
        // todo(vicb): assert
        // assert(record._next == null);
        // assert(record._nextAdded == null);
        // assert(record._nextChanged == null);
        // assert(record._nextRemoved == null);
        // assert(record._prevRemoved == null);
        if (this._additionsHead === null) {
            this._additionsHead = this._additionsTail = record;
        }
        else {
            this._additionsTail._nextAdded = record;
            this._additionsTail = record;
        }
    }
    /** @internal */
    _addToChanges(record) {
        // todo(vicb) assert
        // assert(record._nextAdded == null);
        // assert(record._nextChanged == null);
        // assert(record._nextRemoved == null);
        // assert(record._prevRemoved == null);
        if (this._changesHead === null) {
            this._changesHead = this._changesTail = record;
        }
        else {
            this._changesTail._nextChanged = record;
            this._changesTail = record;
        }
    }
    toString() {
        var items = [];
        var previous = [];
        var changes = [];
        var additions = [];
        var removals = [];
        var record;
        for (record = this._mapHead; record !== null; record = record._next) {
            items.push(stringify(record));
        }
        for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
            previous.push(stringify(record));
        }
        for (record = this._changesHead; record !== null; record = record._nextChanged) {
            changes.push(stringify(record));
        }
        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
            additions.push(stringify(record));
        }
        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
            removals.push(stringify(record));
        }
        return "map: " + items.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" +
            "additions: " + additions.join(', ') + "\n" + "changes: " + changes.join(', ') + "\n" +
            "removals: " + removals.join(', ') + "\n";
    }
    /** @internal */
    _forEach(obj, fn) {
        if (obj instanceof Map) {
            obj.forEach(fn);
        }
        else {
            StringMapWrapper.forEach(obj, fn);
        }
    }
}
export class KeyValueChangeRecord {
    constructor(key) {
        this.key = key;
        this.previousValue = null;
        this.currentValue = null;
        /** @internal */
        this._nextPrevious = null;
        /** @internal */
        this._next = null;
        /** @internal */
        this._nextAdded = null;
        /** @internal */
        this._nextRemoved = null;
        /** @internal */
        this._prevRemoved = null;
        /** @internal */
        this._nextChanged = null;
    }
    toString() {
        return looseIdentical(this.previousValue, this.currentValue) ?
            stringify(this.key) :
            (stringify(this.key) + '[' + stringify(this.previousValue) + '->' +
                stringify(this.currentValue) + ']');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF9rZXl2YWx1ZV9kaWZmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2RpZmZlcnMvZGVmYXVsdF9rZXl2YWx1ZV9kaWZmZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDcEUsRUFBQyxTQUFTLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLE1BQU0sMEJBQTBCO09BQ3ZGLEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO0FBSzVEO0lBQ0UsUUFBUSxDQUFDLEdBQVEsSUFBYSxNQUFNLENBQUMsR0FBRyxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdFLE1BQU0sQ0FBQyxLQUF3QixJQUFvQixNQUFNLENBQUMsSUFBSSxxQkFBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxRixDQUFDO0FBTEQ7SUFBQyxLQUFLLEVBQUU7O2dDQUFBO0FBT1I7SUFBQTtRQUNVLGFBQVEsR0FBa0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNwQyxhQUFRLEdBQXlCLElBQUksQ0FBQztRQUN0QyxxQkFBZ0IsR0FBeUIsSUFBSSxDQUFDO1FBQzlDLGlCQUFZLEdBQXlCLElBQUksQ0FBQztRQUMxQyxpQkFBWSxHQUF5QixJQUFJLENBQUM7UUFDMUMsbUJBQWMsR0FBeUIsSUFBSSxDQUFDO1FBQzVDLG1CQUFjLEdBQXlCLElBQUksQ0FBQztRQUM1QyxrQkFBYSxHQUF5QixJQUFJLENBQUM7UUFDM0Msa0JBQWEsR0FBeUIsSUFBSSxDQUFDO0lBdVRyRCxDQUFDO0lBclRDLElBQUksT0FBTztRQUNULE1BQU0sQ0FBQyxJQUFJ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QVIsUUFBRyxHQUFILEdBQUcsQ0FBSztRQWhCM0Isa0JBQWEsR0FBUSxJQUFJLENBQUM7UUFDMUIsaUJBQVksR0FBUSxJQUFJLENBQUM7UUFFekIsZ0JBQWdCO1FBQ2hCLGtCQUFhLEdBQXlCLElBQUksQ0FBQztRQUMzQyxnQkFBZ0I7UUFDaEIsVUFBSyxHQUF5QixJQUFJLENBQUM7UUFDbkMsZ0JBQWdCO1FBQ2hCLGVBQVUsR0FBeUIsSUFBSSxDQUFDO1FBQ3hDLGdCQUFnQjtRQUNoQixpQkFBWSxHQUF5QixJQUFJLENBQUM7UUFDMUMsZ0JBQWdCO1FBQ2hCLGlCQUFZLEdBQXlCLElBQUksQ0FBQztRQUMxQyxnQkFBZ0I7UUFDaEIsaUJBQVksR0FBeUIsSUFBSSxDQUFDO0lBRVosQ0FBQztJQUUvQixRQUFRO1FBQ04sTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDakQsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDbkIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUk7Z0JBQ2hFLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDbEQsQ0FBQztBQUNILENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TWFwV3JhcHBlciwgU3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7c3RyaW5naWZ5LCBsb29zZUlkZW50aWNhbCwgaXNKc09iamVjdCwgQ09OU1QsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0NoYW5nZURldGVjdG9yUmVmfSBmcm9tICcuLi9jaGFuZ2VfZGV0ZWN0b3JfcmVmJztcbmltcG9ydCB7S2V5VmFsdWVEaWZmZXIsIEtleVZhbHVlRGlmZmVyRmFjdG9yeX0gZnJvbSAnLi4vZGlmZmVycy9rZXl2YWx1ZV9kaWZmZXJzJztcblxuQENPTlNUKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0S2V5VmFsdWVEaWZmZXJGYWN0b3J5IGltcGxlbWVudHMgS2V5VmFsdWVEaWZmZXJGYWN0b3J5IHtcbiAgc3VwcG9ydHMob2JqOiBhbnkpOiBib29sZWFuIHsgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIE1hcCB8fCBpc0pzT2JqZWN0KG9iaik7IH1cblxuICBjcmVhdGUoY2RSZWY6IENoYW5nZURldGVjdG9yUmVmKTogS2V5VmFsdWVEaWZmZXIgeyByZXR1cm4gbmV3IERlZmF1bHRLZXlWYWx1ZURpZmZlcigpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0S2V5VmFsdWVEaWZmZXIgaW1wbGVtZW50cyBLZXlWYWx1ZURpZmZlciB7XG4gIHByaXZhdGUgX3JlY29yZHM6IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwKCk7XG4gIHByaXZhdGUgX21hcEhlYWQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgcHJpdmF0ZSBfcHJldmlvdXNNYXBIZWFkOiBLZXlWYWx1ZUNoYW5nZVJlY29yZCA9IG51bGw7XG4gIHByaXZhdGUgX2NoYW5nZXNIZWFkOiBLZXlWYWx1ZUNoYW5nZVJlY29yZCA9IG51bGw7XG4gIHByaXZhdGUgX2NoYW5nZXNUYWlsOiBLZXlWYWx1ZUNoYW5nZVJlY29yZCA9IG51bGw7XG4gIHByaXZhdGUgX2FkZGl0aW9uc0hlYWQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgcHJpdmF0ZSBfYWRkaXRpb25zVGFpbDogS2V5VmFsdWVDaGFuZ2VSZWNvcmQgPSBudWxsO1xuICBwcml2YXRlIF9yZW1vdmFsc0hlYWQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgcHJpdmF0ZSBfcmVtb3ZhbHNUYWlsOiBLZXlWYWx1ZUNoYW5nZVJlY29yZCA9IG51bGw7XG5cbiAgZ2V0IGlzRGlydHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FkZGl0aW9uc0hlYWQgIT09IG51bGwgfHwgdGhpcy5fY2hhbmdlc0hlYWQgIT09IG51bGwgfHxcbiAgICAgICAgICAgdGhpcy5fcmVtb3ZhbHNIZWFkICE9PSBudWxsO1xuICB9XG5cbiAgZm9yRWFjaEl0ZW0oZm46IEZ1bmN0aW9uKSB7XG4gICAgdmFyIHJlY29yZDogS2V5VmFsdWVDaGFuZ2VSZWNvcmQ7XG4gICAgZm9yIChyZWNvcmQgPSB0aGlzLl9tYXBIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dCkge1xuICAgICAgZm4ocmVjb3JkKTtcbiAgICB9XG4gIH1cblxuICBmb3JFYWNoUHJldmlvdXNJdGVtKGZuOiBGdW5jdGlvbikge1xuICAgIHZhciByZWNvcmQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkO1xuICAgIGZvciAocmVjb3JkID0gdGhpcy5fcHJldmlvdXNNYXBIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dFByZXZpb3VzKSB7XG4gICAgICBmbihyZWNvcmQpO1xuICAgIH1cbiAgfVxuXG4gIGZvckVhY2hDaGFuZ2VkSXRlbShmbjogRnVuY3Rpb24pIHtcbiAgICB2YXIgcmVjb3JkOiBLZXlWYWx1ZUNoYW5nZVJlY29yZDtcbiAgICBmb3IgKHJlY29yZCA9IHRoaXMuX2NoYW5nZXNIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dENoYW5nZWQpIHtcbiAgICAgIGZuKHJlY29yZCk7XG4gICAgfVxuICB9XG5cbiAgZm9yRWFjaEFkZGVkSXRlbShmbjogRnVuY3Rpb24pIHtcbiAgICB2YXIgcmVjb3JkOiBLZXlWYWx1ZUNoYW5nZVJlY29yZDtcbiAgICBmb3IgKHJlY29yZCA9IHRoaXMuX2FkZGl0aW9uc0hlYWQ7IHJlY29yZCAhPT0gbnVsbDsgcmVjb3JkID0gcmVjb3JkLl9uZXh0QWRkZWQpIHtcbiAgICAgIGZuKHJlY29yZCk7XG4gICAgfVxuICB9XG5cbiAgZm9yRWFjaFJlbW92ZWRJdGVtKGZuOiBGdW5jdGlvbikge1xuICAgIHZhciByZWNvcmQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkO1xuICAgIGZvciAocmVjb3JkID0gdGhpcy5fcmVtb3ZhbHNIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dFJlbW92ZWQpIHtcbiAgICAgIGZuKHJlY29yZCk7XG4gICAgfVxuICB9XG5cbiAgZGlmZihtYXA6IE1hcDxhbnksIGFueT4pOiBhbnkge1xuICAgIGlmIChpc0JsYW5rKG1hcCkpIG1hcCA9IE1hcFdyYXBwZXIuY3JlYXRlRnJvbVBhaXJzKFtdKTtcbiAgICBpZiAoIShtYXAgaW5zdGFuY2VvZiBNYXAgfHwgaXNKc09iamVjdChtYXApKSkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYEVycm9yIHRyeWluZyB0byBkaWZmICcke21hcH0nYCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2hlY2sobWFwKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIG9uRGVzdHJveSgpIHt9XG5cbiAgY2hlY2sobWFwOiBNYXA8YW55LCBhbnk+KTogYm9vbGVhbiB7XG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgICB2YXIgcmVjb3JkcyA9IHRoaXMuX3JlY29yZHM7XG4gICAgdmFyIG9sZFNlcVJlY29yZDogS2V5VmFsdWVDaGFuZ2VSZWNvcmQgPSB0aGlzLl9tYXBIZWFkO1xuICAgIHZhciBsYXN0T2xkU2VxUmVjb3JkOiBLZXlWYWx1ZUNoYW5nZVJlY29yZCA9IG51bGw7XG4gICAgdmFyIGxhc3ROZXdTZXFSZWNvcmQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgICB2YXIgc2VxQ2hhbmdlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgdGhpcy5fZm9yRWFjaChtYXAsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICB2YXIgbmV3U2VxUmVjb3JkO1xuICAgICAgaWYgKG9sZFNlcVJlY29yZCAhPT0gbnVsbCAmJiBrZXkgPT09IG9sZFNlcVJlY29yZC5rZXkpIHtcbiAgICAgICAgbmV3U2VxUmVjb3JkID0gb2xkU2VxUmVjb3JkO1xuICAgICAgICBpZiAoIWxvb3NlSWRlbnRpY2FsKHZhbHVlLCBvbGRTZXFSZWNvcmQuY3VycmVudFZhbHVlKSkge1xuICAgICAgICAgIG9sZFNlcVJlY29yZC5wcmV2aW91c1ZhbHVlID0gb2xkU2VxUmVjb3JkLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgICBvbGRTZXFSZWNvcmQuY3VycmVudFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgdGhpcy5fYWRkVG9DaGFuZ2VzKG9sZFNlcVJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlcUNoYW5nZWQgPSB0cnVlO1xuICAgICAgICBpZiAob2xkU2VxUmVjb3JkICE9PSBudWxsKSB7XG4gICAgICAgICAgb2xkU2VxUmVjb3JkLl9uZXh0ID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9yZW1vdmVGcm9tU2VxKGxhc3RPbGRTZXFSZWNvcmQsIG9sZFNlcVJlY29yZCk7XG4gICAgICAgICAgdGhpcy5fYWRkVG9SZW1vdmFscyhvbGRTZXFSZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWNvcmRzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgbmV3U2VxUmVjb3JkID0gcmVjb3Jkcy5nZXQoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdTZXFSZWNvcmQgPSBuZXcgS2V5VmFsdWVDaGFuZ2VSZWNvcmQoa2V5KTtcbiAgICAgICAgICByZWNvcmRzLnNldChrZXksIG5ld1NlcVJlY29yZCk7XG4gICAgICAgICAgbmV3U2VxUmVjb3JkLmN1cnJlbnRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIHRoaXMuX2FkZFRvQWRkaXRpb25zKG5ld1NlcVJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNlcUNoYW5nZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzSW5SZW1vdmFscyhuZXdTZXFSZWNvcmQpKSB7XG4gICAgICAgICAgdGhpcy5fcmVtb3ZlRnJvbVJlbW92YWxzKG5ld1NlcVJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxhc3ROZXdTZXFSZWNvcmQgPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuX21hcEhlYWQgPSBuZXdTZXFSZWNvcmQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGFzdE5ld1NlcVJlY29yZC5fbmV4dCA9IG5ld1NlcVJlY29yZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGFzdE9sZFNlcVJlY29yZCA9IG9sZFNlcVJlY29yZDtcbiAgICAgIGxhc3ROZXdTZXFSZWNvcmQgPSBuZXdTZXFSZWNvcmQ7XG4gICAgICBvbGRTZXFSZWNvcmQgPSBvbGRTZXFSZWNvcmQgPT09IG51bGwgPyBudWxsIDogb2xkU2VxUmVjb3JkLl9uZXh0O1xuICAgIH0pO1xuICAgIHRoaXMuX3RydW5jYXRlKGxhc3RPbGRTZXFSZWNvcmQsIG9sZFNlcVJlY29yZCk7XG4gICAgcmV0dXJuIHRoaXMuaXNEaXJ0eTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3Jlc2V0KCkge1xuICAgIGlmICh0aGlzLmlzRGlydHkpIHtcbiAgICAgIHZhciByZWNvcmQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkO1xuICAgICAgLy8gUmVjb3JkIHRoZSBzdGF0ZSBvZiB0aGUgbWFwcGluZ1xuICAgICAgZm9yIChyZWNvcmQgPSB0aGlzLl9wcmV2aW91c01hcEhlYWQgPSB0aGlzLl9tYXBIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dCkge1xuICAgICAgICByZWNvcmQuX25leHRQcmV2aW91cyA9IHJlY29yZC5fbmV4dDtcbiAgICAgIH1cblxuICAgICAgZm9yIChyZWNvcmQgPSB0aGlzLl9jaGFuZ2VzSGVhZDsgcmVjb3JkICE9PSBudWxsOyByZWNvcmQgPSByZWNvcmQuX25leHRDaGFuZ2VkKSB7XG4gICAgICAgIHJlY29yZC5wcmV2aW91c1ZhbHVlID0gcmVjb3JkLmN1cnJlbnRWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgZm9yIChyZWNvcmQgPSB0aGlzLl9hZGRpdGlvbnNIZWFkOyByZWNvcmQgIT0gbnVsbDsgcmVjb3JkID0gcmVjb3JkLl9uZXh0QWRkZWQpIHtcbiAgICAgICAgcmVjb3JkLnByZXZpb3VzVmFsdWUgPSByZWNvcmQuY3VycmVudFZhbHVlO1xuICAgICAgfVxuXG4gICAgICAvLyB0b2RvKHZpY2IpIG9uY2UgYXNzZXJ0IGlzIHN1cHBvcnRlZFxuICAgICAgLy8gYXNzZXJ0KCgpIHtcbiAgICAgIC8vICB2YXIgciA9IF9jaGFuZ2VzSGVhZDtcbiAgICAgIC8vICB3aGlsZSAociAhPSBudWxsKSB7XG4gICAgICAvLyAgICB2YXIgbmV4dFJlY29yZCA9IHIuX25leHRDaGFuZ2VkO1xuICAgICAgLy8gICAgci5fbmV4dENoYW5nZWQgPSBudWxsO1xuICAgICAgLy8gICAgciA9IG5leHRSZWNvcmQ7XG4gICAgICAvLyAgfVxuICAgICAgLy9cbiAgICAgIC8vICByID0gX2FkZGl0aW9uc0hlYWQ7XG4gICAgICAvLyAgd2hpbGUgKHIgIT0gbnVsbCkge1xuICAgICAgLy8gICAgdmFyIG5leHRSZWNvcmQgPSByLl9uZXh0QWRkZWQ7XG4gICAgICAvLyAgICByLl9uZXh0QWRkZWQgPSBudWxsO1xuICAgICAgLy8gICAgciA9IG5leHRSZWNvcmQ7XG4gICAgICAvLyAgfVxuICAgICAgLy9cbiAgICAgIC8vICByID0gX3JlbW92YWxzSGVhZDtcbiAgICAgIC8vICB3aGlsZSAociAhPSBudWxsKSB7XG4gICAgICAvLyAgICB2YXIgbmV4dFJlY29yZCA9IHIuX25leHRSZW1vdmVkO1xuICAgICAgLy8gICAgci5fbmV4dFJlbW92ZWQgPSBudWxsO1xuICAgICAgLy8gICAgciA9IG5leHRSZWNvcmQ7XG4gICAgICAvLyAgfVxuICAgICAgLy9cbiAgICAgIC8vICByZXR1cm4gdHJ1ZTtcbiAgICAgIC8vfSk7XG4gICAgICB0aGlzLl9jaGFuZ2VzSGVhZCA9IHRoaXMuX2NoYW5nZXNUYWlsID0gbnVsbDtcbiAgICAgIHRoaXMuX2FkZGl0aW9uc0hlYWQgPSB0aGlzLl9hZGRpdGlvbnNUYWlsID0gbnVsbDtcbiAgICAgIHRoaXMuX3JlbW92YWxzSGVhZCA9IHRoaXMuX3JlbW92YWxzVGFpbCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdHJ1bmNhdGUobGFzdFJlY29yZDogS2V5VmFsdWVDaGFuZ2VSZWNvcmQsIHJlY29yZDogS2V5VmFsdWVDaGFuZ2VSZWNvcmQpIHtcbiAgICB3aGlsZSAocmVjb3JkICE9PSBudWxsKSB7XG4gICAgICBpZiAobGFzdFJlY29yZCA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9tYXBIZWFkID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxhc3RSZWNvcmQuX25leHQgPSBudWxsO1xuICAgICAgfVxuICAgICAgdmFyIG5leHRSZWNvcmQgPSByZWNvcmQuX25leHQ7XG4gICAgICAvLyB0b2RvKHZpY2IpIGFzc2VydFxuICAgICAgLy8gYXNzZXJ0KCgoKSB7XG4gICAgICAvLyAgcmVjb3JkLl9uZXh0ID0gbnVsbDtcbiAgICAgIC8vICByZXR1cm4gdHJ1ZTtcbiAgICAgIC8vfSkpO1xuICAgICAgdGhpcy5fYWRkVG9SZW1vdmFscyhyZWNvcmQpO1xuICAgICAgbGFzdFJlY29yZCA9IHJlY29yZDtcbiAgICAgIHJlY29yZCA9IG5leHRSZWNvcmQ7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgcmVjOiBLZXlWYWx1ZUNoYW5nZVJlY29yZCA9IHRoaXMuX3JlbW92YWxzSGVhZDsgcmVjICE9PSBudWxsOyByZWMgPSByZWMuX25leHRSZW1vdmVkKSB7XG4gICAgICByZWMucHJldmlvdXNWYWx1ZSA9IHJlYy5jdXJyZW50VmFsdWU7XG4gICAgICByZWMuY3VycmVudFZhbHVlID0gbnVsbDtcbiAgICAgIHRoaXMuX3JlY29yZHMuZGVsZXRlKHJlYy5rZXkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2lzSW5SZW1vdmFscyhyZWNvcmQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkKSB7XG4gICAgcmV0dXJuIHJlY29yZCA9PT0gdGhpcy5fcmVtb3ZhbHNIZWFkIHx8IHJlY29yZC5fbmV4dFJlbW92ZWQgIT09IG51bGwgfHxcbiAgICAgICAgICAgcmVjb3JkLl9wcmV2UmVtb3ZlZCAhPT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FkZFRvUmVtb3ZhbHMocmVjb3JkOiBLZXlWYWx1ZUNoYW5nZVJlY29yZCkge1xuICAgIC8vIHRvZG8odmljYikgYXNzZXJ0XG4gICAgLy8gYXNzZXJ0KHJlY29yZC5fbmV4dCA9PSBudWxsKTtcbiAgICAvLyBhc3NlcnQocmVjb3JkLl9uZXh0QWRkZWQgPT0gbnVsbCk7XG4gICAgLy8gYXNzZXJ0KHJlY29yZC5fbmV4dENoYW5nZWQgPT0gbnVsbCk7XG4gICAgLy8gYXNzZXJ0KHJlY29yZC5fbmV4dFJlbW92ZWQgPT0gbnVsbCk7XG4gICAgLy8gYXNzZXJ0KHJlY29yZC5fcHJldlJlbW92ZWQgPT0gbnVsbCk7XG4gICAgaWYgKHRoaXMuX3JlbW92YWxzSGVhZCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fcmVtb3ZhbHNIZWFkID0gdGhpcy5fcmVtb3ZhbHNUYWlsID0gcmVjb3JkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZW1vdmFsc1RhaWwuX25leHRSZW1vdmVkID0gcmVjb3JkO1xuICAgICAgcmVjb3JkLl9wcmV2UmVtb3ZlZCA9IHRoaXMuX3JlbW92YWxzVGFpbDtcbiAgICAgIHRoaXMuX3JlbW92YWxzVGFpbCA9IHJlY29yZDtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZW1vdmVGcm9tU2VxKHByZXY6IEtleVZhbHVlQ2hhbmdlUmVjb3JkLCByZWNvcmQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkKSB7XG4gICAgdmFyIG5leHQgPSByZWNvcmQuX25leHQ7XG4gICAgaWYgKHByZXYgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuX21hcEhlYWQgPSBuZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmV2Ll9uZXh0ID0gbmV4dDtcbiAgICB9XG4gICAgLy8gdG9kbyh2aWNiKSBhc3NlcnRcbiAgICAvLyBhc3NlcnQoKCgpIHtcbiAgICAvLyAgcmVjb3JkLl9uZXh0ID0gbnVsbDtcbiAgICAvLyAgcmV0dXJuIHRydWU7XG4gICAgLy99KSgpKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlbW92ZUZyb21SZW1vdmFscyhyZWNvcmQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkKSB7XG4gICAgLy8gdG9kbyh2aWNiKSBhc3NlcnRcbiAgICAvLyBhc3NlcnQocmVjb3JkLl9uZXh0ID09IG51bGwpO1xuICAgIC8vIGFzc2VydChyZWNvcmQuX25leHRBZGRlZCA9PSBudWxsKTtcbiAgICAvLyBhc3NlcnQocmVjb3JkLl9uZXh0Q2hhbmdlZCA9PSBudWxsKTtcblxuICAgIHZhciBwcmV2ID0gcmVjb3JkLl9wcmV2UmVtb3ZlZDtcbiAgICB2YXIgbmV4dCA9IHJlY29yZC5fbmV4dFJlbW92ZWQ7XG4gICAgaWYgKHByZXYgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3JlbW92YWxzSGVhZCA9IG5leHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZXYuX25leHRSZW1vdmVkID0gbmV4dDtcbiAgICB9XG4gICAgaWYgKG5leHQgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3JlbW92YWxzVGFpbCA9IHByZXY7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHQuX3ByZXZSZW1vdmVkID0gcHJldjtcbiAgICB9XG4gICAgcmVjb3JkLl9wcmV2UmVtb3ZlZCA9IHJlY29yZC5fbmV4dFJlbW92ZWQgPSBudWxsO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYWRkVG9BZGRpdGlvbnMocmVjb3JkOiBLZXlWYWx1ZUNoYW5nZVJlY29yZCkge1xuICAgIC8vIHRvZG8odmljYik6IGFzc2VydFxuICAgIC8vIGFzc2VydChyZWNvcmQuX25leHQgPT0gbnVsbCk7XG4gICAgLy8gYXNzZXJ0KHJlY29yZC5fbmV4dEFkZGVkID09IG51bGwpO1xuICAgIC8vIGFzc2VydChyZWNvcmQuX25leHRDaGFuZ2VkID09IG51bGwpO1xuICAgIC8vIGFzc2VydChyZWNvcmQuX25leHRSZW1vdmVkID09IG51bGwpO1xuICAgIC8vIGFzc2VydChyZWNvcmQuX3ByZXZSZW1vdmVkID09IG51bGwpO1xuICAgIGlmICh0aGlzLl9hZGRpdGlvbnNIZWFkID09PSBudWxsKSB7XG4gICAgICB0aGlzLl9hZGRpdGlvbnNIZWFkID0gdGhpcy5fYWRkaXRpb25zVGFpbCA9IHJlY29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYWRkaXRpb25zVGFpbC5fbmV4dEFkZGVkID0gcmVjb3JkO1xuICAgICAgdGhpcy5fYWRkaXRpb25zVGFpbCA9IHJlY29yZDtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hZGRUb0NoYW5nZXMocmVjb3JkOiBLZXlWYWx1ZUNoYW5nZVJlY29yZCkge1xuICAgIC8vIHRvZG8odmljYikgYXNzZXJ0XG4gICAgLy8gYXNzZXJ0KHJlY29yZC5fbmV4dEFkZGVkID09IG51bGwpO1xuICAgIC8vIGFzc2VydChyZWNvcmQuX25leHRDaGFuZ2VkID09IG51bGwpO1xuICAgIC8vIGFzc2VydChyZWNvcmQuX25leHRSZW1vdmVkID09IG51bGwpO1xuICAgIC8vIGFzc2VydChyZWNvcmQuX3ByZXZSZW1vdmVkID09IG51bGwpO1xuICAgIGlmICh0aGlzLl9jaGFuZ2VzSGVhZCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fY2hhbmdlc0hlYWQgPSB0aGlzLl9jaGFuZ2VzVGFpbCA9IHJlY29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2hhbmdlc1RhaWwuX25leHRDaGFuZ2VkID0gcmVjb3JkO1xuICAgICAgdGhpcy5fY2hhbmdlc1RhaWwgPSByZWNvcmQ7XG4gICAgfVxuICB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB2YXIgcHJldmlvdXMgPSBbXTtcbiAgICB2YXIgY2hhbmdlcyA9IFtdO1xuICAgIHZhciBhZGRpdGlvbnMgPSBbXTtcbiAgICB2YXIgcmVtb3ZhbHMgPSBbXTtcbiAgICB2YXIgcmVjb3JkOiBLZXlWYWx1ZUNoYW5nZVJlY29yZDtcblxuICAgIGZvciAocmVjb3JkID0gdGhpcy5fbWFwSGVhZDsgcmVjb3JkICE9PSBudWxsOyByZWNvcmQgPSByZWNvcmQuX25leHQpIHtcbiAgICAgIGl0ZW1zLnB1c2goc3RyaW5naWZ5KHJlY29yZCkpO1xuICAgIH1cbiAgICBmb3IgKHJlY29yZCA9IHRoaXMuX3ByZXZpb3VzTWFwSGVhZDsgcmVjb3JkICE9PSBudWxsOyByZWNvcmQgPSByZWNvcmQuX25leHRQcmV2aW91cykge1xuICAgICAgcHJldmlvdXMucHVzaChzdHJpbmdpZnkocmVjb3JkKSk7XG4gICAgfVxuICAgIGZvciAocmVjb3JkID0gdGhpcy5fY2hhbmdlc0hlYWQ7IHJlY29yZCAhPT0gbnVsbDsgcmVjb3JkID0gcmVjb3JkLl9uZXh0Q2hhbmdlZCkge1xuICAgICAgY2hhbmdlcy5wdXNoKHN0cmluZ2lmeShyZWNvcmQpKTtcbiAgICB9XG4gICAgZm9yIChyZWNvcmQgPSB0aGlzLl9hZGRpdGlvbnNIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dEFkZGVkKSB7XG4gICAgICBhZGRpdGlvbnMucHVzaChzdHJpbmdpZnkocmVjb3JkKSk7XG4gICAgfVxuICAgIGZvciAocmVjb3JkID0gdGhpcy5fcmVtb3ZhbHNIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dFJlbW92ZWQpIHtcbiAgICAgIHJlbW92YWxzLnB1c2goc3RyaW5naWZ5KHJlY29yZCkpO1xuICAgIH1cblxuICAgIHJldHVybiBcIm1hcDogXCIgKyBpdGVtcy5qb2luKCcsICcpICsgXCJcXG5cIiArIFwicHJldmlvdXM6IFwiICsgcHJldmlvdXMuam9pbignLCAnKSArIFwiXFxuXCIgK1xuICAgICAgICAgICBcImFkZGl0aW9uczogXCIgKyBhZGRpdGlvbnMuam9pbignLCAnKSArIFwiXFxuXCIgKyBcImNoYW5nZXM6IFwiICsgY2hhbmdlcy5qb2luKCcsICcpICsgXCJcXG5cIiArXG4gICAgICAgICAgIFwicmVtb3ZhbHM6IFwiICsgcmVtb3ZhbHMuam9pbignLCAnKSArIFwiXFxuXCI7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9mb3JFYWNoKG9iaiwgZm46IEZ1bmN0aW9uKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgKDxNYXA8YW55LCBhbnk+Pm9iaikuZm9yRWFjaCg8YW55PmZuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKG9iaiwgZm4pO1xuICAgIH1cbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBLZXlWYWx1ZUNoYW5nZVJlY29yZCB7XG4gIHByZXZpb3VzVmFsdWU6IGFueSA9IG51bGw7XG4gIGN1cnJlbnRWYWx1ZTogYW55ID0gbnVsbDtcblxuICAvKiogQGludGVybmFsICovXG4gIF9uZXh0UHJldmlvdXM6IEtleVZhbHVlQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbmV4dDogS2V5VmFsdWVDaGFuZ2VSZWNvcmQgPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIF9uZXh0QWRkZWQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbmV4dFJlbW92ZWQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcHJldlJlbW92ZWQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbmV4dENoYW5nZWQ6IEtleVZhbHVlQ2hhbmdlUmVjb3JkID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMga2V5OiBhbnkpIHt9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbG9vc2VJZGVudGljYWwodGhpcy5wcmV2aW91c1ZhbHVlLCB0aGlzLmN1cnJlbnRWYWx1ZSkgP1xuICAgICAgICAgICAgICAgc3RyaW5naWZ5KHRoaXMua2V5KSA6XG4gICAgICAgICAgICAgICAoc3RyaW5naWZ5KHRoaXMua2V5KSArICdbJyArIHN0cmluZ2lmeSh0aGlzLnByZXZpb3VzVmFsdWUpICsgJy0+JyArXG4gICAgICAgICAgICAgICAgc3RyaW5naWZ5KHRoaXMuY3VycmVudFZhbHVlKSArICddJyk7XG4gIH1cbn1cbiJdfQ==