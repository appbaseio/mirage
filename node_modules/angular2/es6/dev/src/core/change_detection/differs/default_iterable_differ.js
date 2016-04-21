var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CONST } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { isListLikeIterable, iterateListLike } from 'angular2/src/facade/collection';
import { isBlank, isPresent, stringify, getMapKey, looseIdentical, isArray } from 'angular2/src/facade/lang';
export let DefaultIterableDifferFactory = class DefaultIterableDifferFactory {
    supports(obj) { return isListLikeIterable(obj); }
    create(cdRef, trackByFn) {
        return new DefaultIterableDiffer(trackByFn);
    }
};
DefaultIterableDifferFactory = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [])
], DefaultIterableDifferFactory);
var trackByIdentity = (index, item) => item;
export class DefaultIterableDiffer {
    constructor(_trackByFn) {
        this._trackByFn = _trackByFn;
        this._length = null;
        this._collection = null;
        // Keeps track of the used records at any point in time (during & across `_check()` calls)
        this._linkedRecords = null;
        // Keeps track of the removed records at any point in time during `_check()` calls.
        this._unlinkedRecords = null;
        this._previousItHead = null;
        this._itHead = null;
        this._itTail = null;
        this._additionsHead = null;
        this._additionsTail = null;
        this._movesHead = null;
        this._movesTail = null;
        this._removalsHead = null;
        this._removalsTail = null;
        // Keeps track of records where custom track by is the same, but item identity has changed
        this._identityChangesHead = null;
        this._identityChangesTail = null;
        this._trackByFn = isPresent(this._trackByFn) ? this._trackByFn : trackByIdentity;
    }
    get collection() { return this._collection; }
    get length() { return this._length; }
    forEachItem(fn) {
        var record;
        for (record = this._itHead; record !== null; record = record._next) {
            fn(record);
        }
    }
    forEachPreviousItem(fn) {
        var record;
        for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
            fn(record);
        }
    }
    forEachAddedItem(fn) {
        var record;
        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
            fn(record);
        }
    }
    forEachMovedItem(fn) {
        var record;
        for (record = this._movesHead; record !== null; record = record._nextMoved) {
            fn(record);
        }
    }
    forEachRemovedItem(fn) {
        var record;
        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
            fn(record);
        }
    }
    forEachIdentityChange(fn) {
        var record;
        for (record = this._identityChangesHead; record !== null; record = record._nextIdentityChange) {
            fn(record);
        }
    }
    diff(collection) {
        if (isBlank(collection))
            collection = [];
        if (!isListLikeIterable(collection)) {
            throw new BaseException(`Error trying to diff '${collection}'`);
        }
        if (this.check(collection)) {
            return this;
        }
        else {
            return null;
        }
    }
    onDestroy() { }
    // todo(vicb): optim for UnmodifiableListView (frozen arrays)
    check(collection) {
        this._reset();
        var record = this._itHead;
        var mayBeDirty = false;
        var index;
        var item;
        var itemTrackBy;
        if (isArray(collection)) {
            var list = collection;
            this._length = collection.length;
            for (index = 0; index < this._length; index++) {
                item = list[index];
                itemTrackBy = this._trackByFn(index, item);
                if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
                    record = this._mismatch(record, item, itemTrackBy, index);
                    mayBeDirty = true;
                }
                else {
                    if (mayBeDirty) {
                        // TODO(misko): can we limit this to duplicates only?
                        record = this._verifyReinsertion(record, item, itemTrackBy, index);
                    }
                    if (!looseIdentical(record.item, item))
                        this._addIdentityChange(record, item);
                }
                record = record._next;
            }
        }
        else {
            index = 0;
            iterateListLike(collection, (item) => {
                itemTrackBy = this._trackByFn(index, item);
                if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
                    record = this._mismatch(record, item, itemTrackBy, index);
                    mayBeDirty = true;
                }
                else {
                    if (mayBeDirty) {
                        // TODO(misko): can we limit this to duplicates only?
                        record = this._verifyReinsertion(record, item, itemTrackBy, index);
                    }
                    if (!looseIdentical(record.item, item))
                        this._addIdentityChange(record, item);
                }
                record = record._next;
                index++;
            });
            this._length = index;
        }
        this._truncate(record);
        this._collection = collection;
        return this.isDirty;
    }
    /* CollectionChanges is considered dirty if it has any additions, moves, removals, or identity
     * changes.
     */
    get isDirty() {
        return this._additionsHead !== null || this._movesHead !== null ||
            this._removalsHead !== null || this._identityChangesHead !== null;
    }
    /**
     * Reset the state of the change objects to show no changes. This means set previousKey to
     * currentKey, and clear all of the queues (additions, moves, removals).
     * Set the previousIndexes of moved and added items to their currentIndexes
     * Reset the list of additions, moves and removals
     *
     * @internal
     */
    _reset() {
        if (this.isDirty) {
            var record;
            var nextRecord;
            for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
                record._nextPrevious = record._next;
            }
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                record.previousIndex = record.currentIndex;
            }
            this._additionsHead = this._additionsTail = null;
            for (record = this._movesHead; record !== null; record = nextRecord) {
                record.previousIndex = record.currentIndex;
                nextRecord = record._nextMoved;
            }
            this._movesHead = this._movesTail = null;
            this._removalsHead = this._removalsTail = null;
            this._identityChangesHead = this._identityChangesTail = null;
        }
    }
    /**
     * This is the core function which handles differences between collections.
     *
     * - `record` is the record which we saw at this position last time. If null then it is a new
     *   item.
     * - `item` is the current item in the collection
     * - `index` is the position of the item in the collection
     *
     * @internal
     */
    _mismatch(record, item, itemTrackBy, index) {
        // The previous record after which we will append the current one.
        var previousRecord;
        if (record === null) {
            previousRecord = this._itTail;
        }
        else {
            previousRecord = record._prev;
            // Remove the record from the collection since we know it does not match the item.
            this._remove(record);
        }
        // Attempt to see if we have seen the item before.
        record = this._linkedRecords === null ? null : this._linkedRecords.get(itemTrackBy, index);
        if (record !== null) {
            // We have seen this before, we need to move it forward in the collection.
            // But first we need to check if identity changed, so we can update in view if necessary
            if (!looseIdentical(record.item, item))
                this._addIdentityChange(record, item);
            this._moveAfter(record, previousRecord, index);
        }
        else {
            // Never seen it, check evicted list.
            record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy);
            if (record !== null) {
                // It is an item which we have evicted earlier: reinsert it back into the list.
                // But first we need to check if identity changed, so we can update in view if necessary
                if (!looseIdentical(record.item, item))
                    this._addIdentityChange(record, item);
                this._reinsertAfter(record, previousRecord, index);
            }
            else {
                // It is a new item: add it.
                record =
                    this._addAfter(new CollectionChangeRecord(item, itemTrackBy), previousRecord, index);
            }
        }
        return record;
    }
    /**
     * This check is only needed if an array contains duplicates. (Short circuit of nothing dirty)
     *
     * Use case: `[a, a]` => `[b, a, a]`
     *
     * If we did not have this check then the insertion of `b` would:
     *   1) evict first `a`
     *   2) insert `b` at `0` index.
     *   3) leave `a` at index `1` as is. <-- this is wrong!
     *   3) reinsert `a` at index 2. <-- this is wrong!
     *
     * The correct behavior is:
     *   1) evict first `a`
     *   2) insert `b` at `0` index.
     *   3) reinsert `a` at index 1.
     *   3) move `a` at from `1` to `2`.
     *
     *
     * Double check that we have not evicted a duplicate item. We need to check if the item type may
     * have already been removed:
     * The insertion of b will evict the first 'a'. If we don't reinsert it now it will be reinserted
     * at the end. Which will show up as the two 'a's switching position. This is incorrect, since a
     * better way to think of it is as insert of 'b' rather then switch 'a' with 'b' and then add 'a'
     * at the end.
     *
     * @internal
     */
    _verifyReinsertion(record, item, itemTrackBy, index) {
        var reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy);
        if (reinsertRecord !== null) {
            record = this._reinsertAfter(reinsertRecord, record._prev, index);
        }
        else if (record.currentIndex != index) {
            record.currentIndex = index;
            this._addToMoves(record, index);
        }
        return record;
    }
    /**
     * Get rid of any excess {@link CollectionChangeRecord}s from the previous collection
     *
     * - `record` The first excess {@link CollectionChangeRecord}.
     *
     * @internal
     */
    _truncate(record) {
        // Anything after that needs to be removed;
        while (record !== null) {
            var nextRecord = record._next;
            this._addToRemovals(this._unlink(record));
            record = nextRecord;
        }
        if (this._unlinkedRecords !== null) {
            this._unlinkedRecords.clear();
        }
        if (this._additionsTail !== null) {
            this._additionsTail._nextAdded = null;
        }
        if (this._movesTail !== null) {
            this._movesTail._nextMoved = null;
        }
        if (this._itTail !== null) {
            this._itTail._next = null;
        }
        if (this._removalsTail !== null) {
            this._removalsTail._nextRemoved = null;
        }
        if (this._identityChangesTail !== null) {
            this._identityChangesTail._nextIdentityChange = null;
        }
    }
    /** @internal */
    _reinsertAfter(record, prevRecord, index) {
        if (this._unlinkedRecords !== null) {
            this._unlinkedRecords.remove(record);
        }
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
        this._insertAfter(record, prevRecord, index);
        this._addToMoves(record, index);
        return record;
    }
    /** @internal */
    _moveAfter(record, prevRecord, index) {
        this._unlink(record);
        this._insertAfter(record, prevRecord, index);
        this._addToMoves(record, index);
        return record;
    }
    /** @internal */
    _addAfter(record, prevRecord, index) {
        this._insertAfter(record, prevRecord, index);
        if (this._additionsTail === null) {
            // todo(vicb)
            // assert(this._additionsHead === null);
            this._additionsTail = this._additionsHead = record;
        }
        else {
            // todo(vicb)
            // assert(_additionsTail._nextAdded === null);
            // assert(record._nextAdded === null);
            this._additionsTail = this._additionsTail._nextAdded = record;
        }
        return record;
    }
    /** @internal */
    _insertAfter(record, prevRecord, index) {
        // todo(vicb)
        // assert(record != prevRecord);
        // assert(record._next === null);
        // assert(record._prev === null);
        var next = prevRecord === null ? this._itHead : prevRecord._next;
        // todo(vicb)
        // assert(next != record);
        // assert(prevRecord != record);
        record._next = next;
        record._prev = prevRecord;
        if (next === null) {
            this._itTail = record;
        }
        else {
            next._prev = record;
        }
        if (prevRecord === null) {
            this._itHead = record;
        }
        else {
            prevRecord._next = record;
        }
        if (this._linkedRecords === null) {
            this._linkedRecords = new _DuplicateMap();
        }
        this._linkedRecords.put(record);
        record.currentIndex = index;
        return record;
    }
    /** @internal */
    _remove(record) {
        return this._addToRemovals(this._unlink(record));
    }
    /** @internal */
    _unlink(record) {
        if (this._linkedRecords !== null) {
            this._linkedRecords.remove(record);
        }
        var prev = record._prev;
        var next = record._next;
        // todo(vicb)
        // assert((record._prev = null) === null);
        // assert((record._next = null) === null);
        if (prev === null) {
            this._itHead = next;
        }
        else {
            prev._next = next;
        }
        if (next === null) {
            this._itTail = prev;
        }
        else {
            next._prev = prev;
        }
        return record;
    }
    /** @internal */
    _addToMoves(record, toIndex) {
        // todo(vicb)
        // assert(record._nextMoved === null);
        if (record.previousIndex === toIndex) {
            return record;
        }
        if (this._movesTail === null) {
            // todo(vicb)
            // assert(_movesHead === null);
            this._movesTail = this._movesHead = record;
        }
        else {
            // todo(vicb)
            // assert(_movesTail._nextMoved === null);
            this._movesTail = this._movesTail._nextMoved = record;
        }
        return record;
    }
    /** @internal */
    _addToRemovals(record) {
        if (this._unlinkedRecords === null) {
            this._unlinkedRecords = new _DuplicateMap();
        }
        this._unlinkedRecords.put(record);
        record.currentIndex = null;
        record._nextRemoved = null;
        if (this._removalsTail === null) {
            // todo(vicb)
            // assert(_removalsHead === null);
            this._removalsTail = this._removalsHead = record;
            record._prevRemoved = null;
        }
        else {
            // todo(vicb)
            // assert(_removalsTail._nextRemoved === null);
            // assert(record._nextRemoved === null);
            record._prevRemoved = this._removalsTail;
            this._removalsTail = this._removalsTail._nextRemoved = record;
        }
        return record;
    }
    /** @internal */
    _addIdentityChange(record, item) {
        record.item = item;
        if (this._identityChangesTail === null) {
            this._identityChangesTail = this._identityChangesHead = record;
        }
        else {
            this._identityChangesTail = this._identityChangesTail._nextIdentityChange = record;
        }
        return record;
    }
    toString() {
        var list = [];
        this.forEachItem((record) => list.push(record));
        var previous = [];
        this.forEachPreviousItem((record) => previous.push(record));
        var additions = [];
        this.forEachAddedItem((record) => additions.push(record));
        var moves = [];
        this.forEachMovedItem((record) => moves.push(record));
        var removals = [];
        this.forEachRemovedItem((record) => removals.push(record));
        var identityChanges = [];
        this.forEachIdentityChange((record) => identityChanges.push(record));
        return "collection: " + list.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" +
            "additions: " + additions.join(', ') + "\n" + "moves: " + moves.join(', ') + "\n" +
            "removals: " + removals.join(', ') + "\n" + "identityChanges: " +
            identityChanges.join(', ') + "\n";
    }
}
export class CollectionChangeRecord {
    constructor(item, trackById) {
        this.item = item;
        this.trackById = trackById;
        this.currentIndex = null;
        this.previousIndex = null;
        /** @internal */
        this._nextPrevious = null;
        /** @internal */
        this._prev = null;
        /** @internal */
        this._next = null;
        /** @internal */
        this._prevDup = null;
        /** @internal */
        this._nextDup = null;
        /** @internal */
        this._prevRemoved = null;
        /** @internal */
        this._nextRemoved = null;
        /** @internal */
        this._nextAdded = null;
        /** @internal */
        this._nextMoved = null;
        /** @internal */
        this._nextIdentityChange = null;
    }
    toString() {
        return this.previousIndex === this.currentIndex ?
            stringify(this.item) :
            stringify(this.item) + '[' + stringify(this.previousIndex) + '->' +
                stringify(this.currentIndex) + ']';
    }
}
// A linked list of CollectionChangeRecords with the same CollectionChangeRecord.item
class _DuplicateItemRecordList {
    constructor() {
        /** @internal */
        this._head = null;
        /** @internal */
        this._tail = null;
    }
    /**
     * Append the record to the list of duplicates.
     *
     * Note: by design all records in the list of duplicates hold the same value in record.item.
     */
    add(record) {
        if (this._head === null) {
            this._head = this._tail = record;
            record._nextDup = null;
            record._prevDup = null;
        }
        else {
            // todo(vicb)
            // assert(record.item ==  _head.item ||
            //       record.item is num && record.item.isNaN && _head.item is num && _head.item.isNaN);
            this._tail._nextDup = record;
            record._prevDup = this._tail;
            record._nextDup = null;
            this._tail = record;
        }
    }
    // Returns a CollectionChangeRecord having CollectionChangeRecord.trackById == trackById and
    // CollectionChangeRecord.currentIndex >= afterIndex
    get(trackById, afterIndex) {
        var record;
        for (record = this._head; record !== null; record = record._nextDup) {
            if ((afterIndex === null || afterIndex < record.currentIndex) &&
                looseIdentical(record.trackById, trackById)) {
                return record;
            }
        }
        return null;
    }
    /**
     * Remove one {@link CollectionChangeRecord} from the list of duplicates.
     *
     * Returns whether the list of duplicates is empty.
     */
    remove(record) {
        // todo(vicb)
        // assert(() {
        //  // verify that the record being removed is in the list.
        //  for (CollectionChangeRecord cursor = _head; cursor != null; cursor = cursor._nextDup) {
        //    if (identical(cursor, record)) return true;
        //  }
        //  return false;
        //});
        var prev = record._prevDup;
        var next = record._nextDup;
        if (prev === null) {
            this._head = next;
        }
        else {
            prev._nextDup = next;
        }
        if (next === null) {
            this._tail = prev;
        }
        else {
            next._prevDup = prev;
        }
        return this._head === null;
    }
}
class _DuplicateMap {
    constructor() {
        this.map = new Map();
    }
    put(record) {
        // todo(vicb) handle corner cases
        var key = getMapKey(record.trackById);
        var duplicates = this.map.get(key);
        if (!isPresent(duplicates)) {
            duplicates = new _DuplicateItemRecordList();
            this.map.set(key, duplicates);
        }
        duplicates.add(record);
    }
    /**
     * Retrieve the `value` using key. Because the CollectionChangeRecord value may be one which we
     * have already iterated over, we use the afterIndex to pretend it is not there.
     *
     * Use case: `[a, b, c, a, a]` if we are at index `3` which is the second `a` then asking if we
     * have any more `a`s needs to return the last `a` not the first or second.
     */
    get(trackById, afterIndex = null) {
        var key = getMapKey(trackById);
        var recordList = this.map.get(key);
        return isBlank(recordList) ? null : recordList.get(trackById, afterIndex);
    }
    /**
     * Removes a {@link CollectionChangeRecord} from the list of duplicates.
     *
     * The list of duplicates also is removed from the map if it gets empty.
     */
    remove(record) {
        var key = getMapKey(record.trackById);
        // todo(vicb)
        // assert(this.map.containsKey(key));
        var recordList = this.map.get(key);
        // Remove the list of duplicates when it gets empty
        if (recordList.remove(record)) {
            this.map.delete(key);
        }
        return record;
    }
    get isEmpty() { return this.map.size === 0; }
    clear() { this.map.clear(); }
    toString() { return '_DuplicateMap(' + stringify(this.map) + ')'; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF9pdGVyYWJsZV9kaWZmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2RpZmZlcnMvZGVmYXVsdF9pdGVyYWJsZV9kaWZmZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSwwQkFBMEI7T0FDdkMsRUFBQyxhQUFhLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDckQsRUFBQyxrQkFBa0IsRUFBRSxlQUFlLEVBQWMsTUFBTSxnQ0FBZ0M7T0FFeEYsRUFDTCxPQUFPLEVBQ1AsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsY0FBYyxFQUNkLE9BQU8sRUFDUixNQUFNLDBCQUEwQjtBQU1qQztJQUNFLFFBQVEsQ0FBQyxHQUFXLElBQWEsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRSxNQUFNLENBQUMsS0FBd0IsRUFBRSxTQUFxQjtRQUNwRCxNQUFNLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxDQUFDO0FBQ0gsQ0FBQztBQU5EO0lBQUMsS0FBSyxFQUFFOztnQ0FBQTtBQVFSLElBQUksZUFBZSxHQUFHLENBQUMsS0FBYSxFQUFFLElBQVMsS0FBSyxJQUFJLENBQUM7QUFFekQ7SUFvQkUsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQW5CbEMsWUFBTyxHQUFXLElBQUksQ0FBQztRQUN2QixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUMzQiwwRkFBMEY7UUFDbEYsbUJBQWMsR0FBa0IsSUFBSSxDQUFDO1FBQzdDLG1GQUFtRjtRQUMzRSxxQkFBZ0IsR0FBa0IsSUFBSSxDQUFDO1FBQ3ZDLG9CQUFlLEdBQTJCLElBQUksQ0FBQztR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QztRQUN2QixDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxPQUFPLEtBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEQsS0FBSyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTdCLFFBQVEsS0FBYSxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzdFLENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q09OU1R9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge2lzTGlzdExpa2VJdGVyYWJsZSwgaXRlcmF0ZUxpc3RMaWtlLCBMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuaW1wb3J0IHtcbiAgaXNCbGFuayxcbiAgaXNQcmVzZW50LFxuICBzdHJpbmdpZnksXG4gIGdldE1hcEtleSxcbiAgbG9vc2VJZGVudGljYWwsXG4gIGlzQXJyYXlcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcblxuaW1wb3J0IHtDaGFuZ2VEZXRlY3RvclJlZn0gZnJvbSAnLi4vY2hhbmdlX2RldGVjdG9yX3JlZic7XG5pbXBvcnQge0l0ZXJhYmxlRGlmZmVyLCBJdGVyYWJsZURpZmZlckZhY3RvcnksIFRyYWNrQnlGbn0gZnJvbSAnLi4vZGlmZmVycy9pdGVyYWJsZV9kaWZmZXJzJztcblxuQENPTlNUKClcbmV4cG9ydCBjbGFzcyBEZWZhdWx0SXRlcmFibGVEaWZmZXJGYWN0b3J5IGltcGxlbWVudHMgSXRlcmFibGVEaWZmZXJGYWN0b3J5IHtcbiAgc3VwcG9ydHMob2JqOiBPYmplY3QpOiBib29sZWFuIHsgcmV0dXJuIGlzTGlzdExpa2VJdGVyYWJsZShvYmopOyB9XG4gIGNyZWF0ZShjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHRyYWNrQnlGbj86IFRyYWNrQnlGbik6IERlZmF1bHRJdGVyYWJsZURpZmZlciB7XG4gICAgcmV0dXJuIG5ldyBEZWZhdWx0SXRlcmFibGVEaWZmZXIodHJhY2tCeUZuKTtcbiAgfVxufVxuXG52YXIgdHJhY2tCeUlkZW50aXR5ID0gKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkgPT4gaXRlbTtcblxuZXhwb3J0IGNsYXNzIERlZmF1bHRJdGVyYWJsZURpZmZlciBpbXBsZW1lbnRzIEl0ZXJhYmxlRGlmZmVyIHtcbiAgcHJpdmF0ZSBfbGVuZ3RoOiBudW1iZXIgPSBudWxsO1xuICBwcml2YXRlIF9jb2xsZWN0aW9uID0gbnVsbDtcbiAgLy8gS2VlcHMgdHJhY2sgb2YgdGhlIHVzZWQgcmVjb3JkcyBhdCBhbnkgcG9pbnQgaW4gdGltZSAoZHVyaW5nICYgYWNyb3NzIGBfY2hlY2soKWAgY2FsbHMpXG4gIHByaXZhdGUgX2xpbmtlZFJlY29yZHM6IF9EdXBsaWNhdGVNYXAgPSBudWxsO1xuICAvLyBLZWVwcyB0cmFjayBvZiB0aGUgcmVtb3ZlZCByZWNvcmRzIGF0IGFueSBwb2ludCBpbiB0aW1lIGR1cmluZyBgX2NoZWNrKClgIGNhbGxzLlxuICBwcml2YXRlIF91bmxpbmtlZFJlY29yZHM6IF9EdXBsaWNhdGVNYXAgPSBudWxsO1xuICBwcml2YXRlIF9wcmV2aW91c0l0SGVhZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCA9IG51bGw7XG4gIHByaXZhdGUgX2l0SGVhZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCA9IG51bGw7XG4gIHByaXZhdGUgX2l0VGFpbDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCA9IG51bGw7XG4gIHByaXZhdGUgX2FkZGl0aW9uc0hlYWQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgPSBudWxsO1xuICBwcml2YXRlIF9hZGRpdGlvbnNUYWlsOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgcHJpdmF0ZSBfbW92ZXNIZWFkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgcHJpdmF0ZSBfbW92ZXNUYWlsOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgcHJpdmF0ZSBfcmVtb3ZhbHNIZWFkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgcHJpdmF0ZSBfcmVtb3ZhbHNUYWlsOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgLy8gS2VlcHMgdHJhY2sgb2YgcmVjb3JkcyB3aGVyZSBjdXN0b20gdHJhY2sgYnkgaXMgdGhlIHNhbWUsIGJ1dCBpdGVtIGlkZW50aXR5IGhhcyBjaGFuZ2VkXG4gIHByaXZhdGUgX2lkZW50aXR5Q2hhbmdlc0hlYWQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgPSBudWxsO1xuICBwcml2YXRlIF9pZGVudGl0eUNoYW5nZXNUYWlsOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF90cmFja0J5Rm4/OiBUcmFja0J5Rm4pIHtcbiAgICB0aGlzLl90cmFja0J5Rm4gPSBpc1ByZXNlbnQodGhpcy5fdHJhY2tCeUZuKSA/IHRoaXMuX3RyYWNrQnlGbiA6IHRyYWNrQnlJZGVudGl0eTtcbiAgfVxuXG4gIGdldCBjb2xsZWN0aW9uKCkgeyByZXR1cm4gdGhpcy5fY29sbGVjdGlvbjsgfVxuXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2xlbmd0aDsgfVxuXG4gIGZvckVhY2hJdGVtKGZuOiBGdW5jdGlvbikge1xuICAgIHZhciByZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQ7XG4gICAgZm9yIChyZWNvcmQgPSB0aGlzLl9pdEhlYWQ7IHJlY29yZCAhPT0gbnVsbDsgcmVjb3JkID0gcmVjb3JkLl9uZXh0KSB7XG4gICAgICBmbihyZWNvcmQpO1xuICAgIH1cbiAgfVxuXG4gIGZvckVhY2hQcmV2aW91c0l0ZW0oZm46IEZ1bmN0aW9uKSB7XG4gICAgdmFyIHJlY29yZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZDtcbiAgICBmb3IgKHJlY29yZCA9IHRoaXMuX3ByZXZpb3VzSXRIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dFByZXZpb3VzKSB7XG4gICAgICBmbihyZWNvcmQpO1xuICAgIH1cbiAgfVxuXG4gIGZvckVhY2hBZGRlZEl0ZW0oZm46IEZ1bmN0aW9uKSB7XG4gICAgdmFyIHJlY29yZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZDtcbiAgICBmb3IgKHJlY29yZCA9IHRoaXMuX2FkZGl0aW9uc0hlYWQ7IHJlY29yZCAhPT0gbnVsbDsgcmVjb3JkID0gcmVjb3JkLl9uZXh0QWRkZWQpIHtcbiAgICAgIGZuKHJlY29yZCk7XG4gICAgfVxuICB9XG5cbiAgZm9yRWFjaE1vdmVkSXRlbShmbjogRnVuY3Rpb24pIHtcbiAgICB2YXIgcmVjb3JkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkO1xuICAgIGZvciAocmVjb3JkID0gdGhpcy5fbW92ZXNIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dE1vdmVkKSB7XG4gICAgICBmbihyZWNvcmQpO1xuICAgIH1cbiAgfVxuXG4gIGZvckVhY2hSZW1vdmVkSXRlbShmbjogRnVuY3Rpb24pIHtcbiAgICB2YXIgcmVjb3JkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkO1xuICAgIGZvciAocmVjb3JkID0gdGhpcy5fcmVtb3ZhbHNIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dFJlbW92ZWQpIHtcbiAgICAgIGZuKHJlY29yZCk7XG4gICAgfVxuICB9XG5cbiAgZm9yRWFjaElkZW50aXR5Q2hhbmdlKGZuOiBGdW5jdGlvbikge1xuICAgIHZhciByZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQ7XG4gICAgZm9yIChyZWNvcmQgPSB0aGlzLl9pZGVudGl0eUNoYW5nZXNIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dElkZW50aXR5Q2hhbmdlKSB7XG4gICAgICBmbihyZWNvcmQpO1xuICAgIH1cbiAgfVxuXG4gIGRpZmYoY29sbGVjdGlvbjogYW55KTogRGVmYXVsdEl0ZXJhYmxlRGlmZmVyIHtcbiAgICBpZiAoaXNCbGFuayhjb2xsZWN0aW9uKSkgY29sbGVjdGlvbiA9IFtdO1xuICAgIGlmICghaXNMaXN0TGlrZUl0ZXJhYmxlKGNvbGxlY3Rpb24pKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgRXJyb3IgdHJ5aW5nIHRvIGRpZmYgJyR7Y29sbGVjdGlvbn0nYCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2hlY2soY29sbGVjdGlvbikpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBvbkRlc3Ryb3koKSB7fVxuXG4gIC8vIHRvZG8odmljYik6IG9wdGltIGZvciBVbm1vZGlmaWFibGVMaXN0VmlldyAoZnJvemVuIGFycmF5cylcbiAgY2hlY2soY29sbGVjdGlvbjogYW55KTogYm9vbGVhbiB7XG4gICAgdGhpcy5fcmVzZXQoKTtcblxuICAgIHZhciByZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgPSB0aGlzLl9pdEhlYWQ7XG4gICAgdmFyIG1heUJlRGlydHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICB2YXIgaW5kZXg6IG51bWJlcjtcbiAgICB2YXIgaXRlbTtcbiAgICB2YXIgaXRlbVRyYWNrQnk7XG4gICAgaWYgKGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgIHZhciBsaXN0ID0gY29sbGVjdGlvbjtcbiAgICAgIHRoaXMuX2xlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuXG4gICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLl9sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgaXRlbSA9IGxpc3RbaW5kZXhdO1xuICAgICAgICBpdGVtVHJhY2tCeSA9IHRoaXMuX3RyYWNrQnlGbihpbmRleCwgaXRlbSk7XG4gICAgICAgIGlmIChyZWNvcmQgPT09IG51bGwgfHwgIWxvb3NlSWRlbnRpY2FsKHJlY29yZC50cmFja0J5SWQsIGl0ZW1UcmFja0J5KSkge1xuICAgICAgICAgIHJlY29yZCA9IHRoaXMuX21pc21hdGNoKHJlY29yZCwgaXRlbSwgaXRlbVRyYWNrQnksIGluZGV4KTtcbiAgICAgICAgICBtYXlCZURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobWF5QmVEaXJ0eSkge1xuICAgICAgICAgICAgLy8gVE9ETyhtaXNrbyk6IGNhbiB3ZSBsaW1pdCB0aGlzIHRvIGR1cGxpY2F0ZXMgb25seT9cbiAgICAgICAgICAgIHJlY29yZCA9IHRoaXMuX3ZlcmlmeVJlaW5zZXJ0aW9uKHJlY29yZCwgaXRlbSwgaXRlbVRyYWNrQnksIGluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFsb29zZUlkZW50aWNhbChyZWNvcmQuaXRlbSwgaXRlbSkpIHRoaXMuX2FkZElkZW50aXR5Q2hhbmdlKHJlY29yZCwgaXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICByZWNvcmQgPSByZWNvcmQuX25leHQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZGV4ID0gMDtcbiAgICAgIGl0ZXJhdGVMaXN0TGlrZShjb2xsZWN0aW9uLCAoaXRlbSkgPT4ge1xuICAgICAgICBpdGVtVHJhY2tCeSA9IHRoaXMuX3RyYWNrQnlGbihpbmRleCwgaXRlbSk7XG4gICAgICAgIGlmIChyZWNvcmQgPT09IG51bGwgfHwgIWxvb3NlSWRlbnRpY2FsKHJlY29yZC50cmFja0J5SWQsIGl0ZW1UcmFja0J5KSkge1xuICAgICAgICAgIHJlY29yZCA9IHRoaXMuX21pc21hdGNoKHJlY29yZCwgaXRlbSwgaXRlbVRyYWNrQnksIGluZGV4KTtcbiAgICAgICAgICBtYXlCZURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobWF5QmVEaXJ0eSkge1xuICAgICAgICAgICAgLy8gVE9ETyhtaXNrbyk6IGNhbiB3ZSBsaW1pdCB0aGlzIHRvIGR1cGxpY2F0ZXMgb25seT9cbiAgICAgICAgICAgIHJlY29yZCA9IHRoaXMuX3ZlcmlmeVJlaW5zZXJ0aW9uKHJlY29yZCwgaXRlbSwgaXRlbVRyYWNrQnksIGluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFsb29zZUlkZW50aWNhbChyZWNvcmQuaXRlbSwgaXRlbSkpIHRoaXMuX2FkZElkZW50aXR5Q2hhbmdlKHJlY29yZCwgaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVjb3JkID0gcmVjb3JkLl9uZXh0O1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9sZW5ndGggPSBpbmRleDtcbiAgICB9XG5cbiAgICB0aGlzLl90cnVuY2F0ZShyZWNvcmQpO1xuICAgIHRoaXMuX2NvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuICAgIHJldHVybiB0aGlzLmlzRGlydHk7XG4gIH1cblxuICAvKiBDb2xsZWN0aW9uQ2hhbmdlcyBpcyBjb25zaWRlcmVkIGRpcnR5IGlmIGl0IGhhcyBhbnkgYWRkaXRpb25zLCBtb3ZlcywgcmVtb3ZhbHMsIG9yIGlkZW50aXR5XG4gICAqIGNoYW5nZXMuXG4gICAqL1xuICBnZXQgaXNEaXJ0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYWRkaXRpb25zSGVhZCAhPT0gbnVsbCB8fCB0aGlzLl9tb3Zlc0hlYWQgIT09IG51bGwgfHxcbiAgICAgICAgICAgdGhpcy5fcmVtb3ZhbHNIZWFkICE9PSBudWxsIHx8IHRoaXMuX2lkZW50aXR5Q2hhbmdlc0hlYWQgIT09IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIHN0YXRlIG9mIHRoZSBjaGFuZ2Ugb2JqZWN0cyB0byBzaG93IG5vIGNoYW5nZXMuIFRoaXMgbWVhbnMgc2V0IHByZXZpb3VzS2V5IHRvXG4gICAqIGN1cnJlbnRLZXksIGFuZCBjbGVhciBhbGwgb2YgdGhlIHF1ZXVlcyAoYWRkaXRpb25zLCBtb3ZlcywgcmVtb3ZhbHMpLlxuICAgKiBTZXQgdGhlIHByZXZpb3VzSW5kZXhlcyBvZiBtb3ZlZCBhbmQgYWRkZWQgaXRlbXMgdG8gdGhlaXIgY3VycmVudEluZGV4ZXNcbiAgICogUmVzZXQgdGhlIGxpc3Qgb2YgYWRkaXRpb25zLCBtb3ZlcyBhbmQgcmVtb3ZhbHNcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfcmVzZXQoKSB7XG4gICAgaWYgKHRoaXMuaXNEaXJ0eSkge1xuICAgICAgdmFyIHJlY29yZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZDtcbiAgICAgIHZhciBuZXh0UmVjb3JkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkO1xuXG4gICAgICBmb3IgKHJlY29yZCA9IHRoaXMuX3ByZXZpb3VzSXRIZWFkID0gdGhpcy5faXRIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dCkge1xuICAgICAgICByZWNvcmQuX25leHRQcmV2aW91cyA9IHJlY29yZC5fbmV4dDtcbiAgICAgIH1cblxuICAgICAgZm9yIChyZWNvcmQgPSB0aGlzLl9hZGRpdGlvbnNIZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dEFkZGVkKSB7XG4gICAgICAgIHJlY29yZC5wcmV2aW91c0luZGV4ID0gcmVjb3JkLmN1cnJlbnRJbmRleDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2FkZGl0aW9uc0hlYWQgPSB0aGlzLl9hZGRpdGlvbnNUYWlsID0gbnVsbDtcblxuICAgICAgZm9yIChyZWNvcmQgPSB0aGlzLl9tb3Zlc0hlYWQ7IHJlY29yZCAhPT0gbnVsbDsgcmVjb3JkID0gbmV4dFJlY29yZCkge1xuICAgICAgICByZWNvcmQucHJldmlvdXNJbmRleCA9IHJlY29yZC5jdXJyZW50SW5kZXg7XG4gICAgICAgIG5leHRSZWNvcmQgPSByZWNvcmQuX25leHRNb3ZlZDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX21vdmVzSGVhZCA9IHRoaXMuX21vdmVzVGFpbCA9IG51bGw7XG4gICAgICB0aGlzLl9yZW1vdmFsc0hlYWQgPSB0aGlzLl9yZW1vdmFsc1RhaWwgPSBudWxsO1xuICAgICAgdGhpcy5faWRlbnRpdHlDaGFuZ2VzSGVhZCA9IHRoaXMuX2lkZW50aXR5Q2hhbmdlc1RhaWwgPSBudWxsO1xuXG4gICAgICAvLyB0b2RvKHZpY2IpIHdoZW4gYXNzZXJ0IGdldHMgc3VwcG9ydGVkXG4gICAgICAvLyBhc3NlcnQoIXRoaXMuaXNEaXJ0eSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgdGhlIGNvcmUgZnVuY3Rpb24gd2hpY2ggaGFuZGxlcyBkaWZmZXJlbmNlcyBiZXR3ZWVuIGNvbGxlY3Rpb25zLlxuICAgKlxuICAgKiAtIGByZWNvcmRgIGlzIHRoZSByZWNvcmQgd2hpY2ggd2Ugc2F3IGF0IHRoaXMgcG9zaXRpb24gbGFzdCB0aW1lLiBJZiBudWxsIHRoZW4gaXQgaXMgYSBuZXdcbiAgICogICBpdGVtLlxuICAgKiAtIGBpdGVtYCBpcyB0aGUgY3VycmVudCBpdGVtIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIC0gYGluZGV4YCBpcyB0aGUgcG9zaXRpb24gb2YgdGhlIGl0ZW0gaW4gdGhlIGNvbGxlY3Rpb25cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfbWlzbWF0Y2gocmVjb3JkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkLCBpdGVtOiBhbnksIGl0ZW1UcmFja0J5OiBhbnksXG4gICAgICAgICAgICBpbmRleDogbnVtYmVyKTogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCB7XG4gICAgLy8gVGhlIHByZXZpb3VzIHJlY29yZCBhZnRlciB3aGljaCB3ZSB3aWxsIGFwcGVuZCB0aGUgY3VycmVudCBvbmUuXG4gICAgdmFyIHByZXZpb3VzUmVjb3JkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkO1xuXG4gICAgaWYgKHJlY29yZCA9PT0gbnVsbCkge1xuICAgICAgcHJldmlvdXNSZWNvcmQgPSB0aGlzLl9pdFRhaWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZXZpb3VzUmVjb3JkID0gcmVjb3JkLl9wcmV2O1xuICAgICAgLy8gUmVtb3ZlIHRoZSByZWNvcmQgZnJvbSB0aGUgY29sbGVjdGlvbiBzaW5jZSB3ZSBrbm93IGl0IGRvZXMgbm90IG1hdGNoIHRoZSBpdGVtLlxuICAgICAgdGhpcy5fcmVtb3ZlKHJlY29yZCk7XG4gICAgfVxuXG4gICAgLy8gQXR0ZW1wdCB0byBzZWUgaWYgd2UgaGF2ZSBzZWVuIHRoZSBpdGVtIGJlZm9yZS5cbiAgICByZWNvcmQgPSB0aGlzLl9saW5rZWRSZWNvcmRzID09PSBudWxsID8gbnVsbCA6IHRoaXMuX2xpbmtlZFJlY29yZHMuZ2V0KGl0ZW1UcmFja0J5LCBpbmRleCk7XG4gICAgaWYgKHJlY29yZCAhPT0gbnVsbCkge1xuICAgICAgLy8gV2UgaGF2ZSBzZWVuIHRoaXMgYmVmb3JlLCB3ZSBuZWVkIHRvIG1vdmUgaXQgZm9yd2FyZCBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICAgIC8vIEJ1dCBmaXJzdCB3ZSBuZWVkIHRvIGNoZWNrIGlmIGlkZW50aXR5IGNoYW5nZWQsIHNvIHdlIGNhbiB1cGRhdGUgaW4gdmlldyBpZiBuZWNlc3NhcnlcbiAgICAgIGlmICghbG9vc2VJZGVudGljYWwocmVjb3JkLml0ZW0sIGl0ZW0pKSB0aGlzLl9hZGRJZGVudGl0eUNoYW5nZShyZWNvcmQsIGl0ZW0pO1xuXG4gICAgICB0aGlzLl9tb3ZlQWZ0ZXIocmVjb3JkLCBwcmV2aW91c1JlY29yZCwgaW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBOZXZlciBzZWVuIGl0LCBjaGVjayBldmljdGVkIGxpc3QuXG4gICAgICByZWNvcmQgPSB0aGlzLl91bmxpbmtlZFJlY29yZHMgPT09IG51bGwgPyBudWxsIDogdGhpcy5fdW5saW5rZWRSZWNvcmRzLmdldChpdGVtVHJhY2tCeSk7XG4gICAgICBpZiAocmVjb3JkICE9PSBudWxsKSB7XG4gICAgICAgIC8vIEl0IGlzIGFuIGl0ZW0gd2hpY2ggd2UgaGF2ZSBldmljdGVkIGVhcmxpZXI6IHJlaW5zZXJ0IGl0IGJhY2sgaW50byB0aGUgbGlzdC5cbiAgICAgICAgLy8gQnV0IGZpcnN0IHdlIG5lZWQgdG8gY2hlY2sgaWYgaWRlbnRpdHkgY2hhbmdlZCwgc28gd2UgY2FuIHVwZGF0ZSBpbiB2aWV3IGlmIG5lY2Vzc2FyeVxuICAgICAgICBpZiAoIWxvb3NlSWRlbnRpY2FsKHJlY29yZC5pdGVtLCBpdGVtKSkgdGhpcy5fYWRkSWRlbnRpdHlDaGFuZ2UocmVjb3JkLCBpdGVtKTtcblxuICAgICAgICB0aGlzLl9yZWluc2VydEFmdGVyKHJlY29yZCwgcHJldmlvdXNSZWNvcmQsIGluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEl0IGlzIGEgbmV3IGl0ZW06IGFkZCBpdC5cbiAgICAgICAgcmVjb3JkID1cbiAgICAgICAgICAgIHRoaXMuX2FkZEFmdGVyKG5ldyBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkKGl0ZW0sIGl0ZW1UcmFja0J5KSwgcHJldmlvdXNSZWNvcmQsIGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlY29yZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGNoZWNrIGlzIG9ubHkgbmVlZGVkIGlmIGFuIGFycmF5IGNvbnRhaW5zIGR1cGxpY2F0ZXMuIChTaG9ydCBjaXJjdWl0IG9mIG5vdGhpbmcgZGlydHkpXG4gICAqXG4gICAqIFVzZSBjYXNlOiBgW2EsIGFdYCA9PiBgW2IsIGEsIGFdYFxuICAgKlxuICAgKiBJZiB3ZSBkaWQgbm90IGhhdmUgdGhpcyBjaGVjayB0aGVuIHRoZSBpbnNlcnRpb24gb2YgYGJgIHdvdWxkOlxuICAgKiAgIDEpIGV2aWN0IGZpcnN0IGBhYFxuICAgKiAgIDIpIGluc2VydCBgYmAgYXQgYDBgIGluZGV4LlxuICAgKiAgIDMpIGxlYXZlIGBhYCBhdCBpbmRleCBgMWAgYXMgaXMuIDwtLSB0aGlzIGlzIHdyb25nIVxuICAgKiAgIDMpIHJlaW5zZXJ0IGBhYCBhdCBpbmRleCAyLiA8LS0gdGhpcyBpcyB3cm9uZyFcbiAgICpcbiAgICogVGhlIGNvcnJlY3QgYmVoYXZpb3IgaXM6XG4gICAqICAgMSkgZXZpY3QgZmlyc3QgYGFgXG4gICAqICAgMikgaW5zZXJ0IGBiYCBhdCBgMGAgaW5kZXguXG4gICAqICAgMykgcmVpbnNlcnQgYGFgIGF0IGluZGV4IDEuXG4gICAqICAgMykgbW92ZSBgYWAgYXQgZnJvbSBgMWAgdG8gYDJgLlxuICAgKlxuICAgKlxuICAgKiBEb3VibGUgY2hlY2sgdGhhdCB3ZSBoYXZlIG5vdCBldmljdGVkIGEgZHVwbGljYXRlIGl0ZW0uIFdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlIGl0ZW0gdHlwZSBtYXlcbiAgICogaGF2ZSBhbHJlYWR5IGJlZW4gcmVtb3ZlZDpcbiAgICogVGhlIGluc2VydGlvbiBvZiBiIHdpbGwgZXZpY3QgdGhlIGZpcnN0ICdhJy4gSWYgd2UgZG9uJ3QgcmVpbnNlcnQgaXQgbm93IGl0IHdpbGwgYmUgcmVpbnNlcnRlZFxuICAgKiBhdCB0aGUgZW5kLiBXaGljaCB3aWxsIHNob3cgdXAgYXMgdGhlIHR3byAnYSdzIHN3aXRjaGluZyBwb3NpdGlvbi4gVGhpcyBpcyBpbmNvcnJlY3QsIHNpbmNlIGFcbiAgICogYmV0dGVyIHdheSB0byB0aGluayBvZiBpdCBpcyBhcyBpbnNlcnQgb2YgJ2InIHJhdGhlciB0aGVuIHN3aXRjaCAnYScgd2l0aCAnYicgYW5kIHRoZW4gYWRkICdhJ1xuICAgKiBhdCB0aGUgZW5kLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF92ZXJpZnlSZWluc2VydGlvbihyZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQsIGl0ZW06IGFueSwgaXRlbVRyYWNrQnk6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBudW1iZXIpOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkIHtcbiAgICB2YXIgcmVpbnNlcnRSZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgPVxuICAgICAgICB0aGlzLl91bmxpbmtlZFJlY29yZHMgPT09IG51bGwgPyBudWxsIDogdGhpcy5fdW5saW5rZWRSZWNvcmRzLmdldChpdGVtVHJhY2tCeSk7XG4gICAgaWYgKHJlaW5zZXJ0UmVjb3JkICE9PSBudWxsKSB7XG4gICAgICByZWNvcmQgPSB0aGlzLl9yZWluc2VydEFmdGVyKHJlaW5zZXJ0UmVjb3JkLCByZWNvcmQuX3ByZXYsIGluZGV4KTtcbiAgICB9IGVsc2UgaWYgKHJlY29yZC5jdXJyZW50SW5kZXggIT0gaW5kZXgpIHtcbiAgICAgIHJlY29yZC5jdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMuX2FkZFRvTW92ZXMocmVjb3JkLCBpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiByZWNvcmQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHJpZCBvZiBhbnkgZXhjZXNzIHtAbGluayBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkfXMgZnJvbSB0aGUgcHJldmlvdXMgY29sbGVjdGlvblxuICAgKlxuICAgKiAtIGByZWNvcmRgIFRoZSBmaXJzdCBleGNlc3Mge0BsaW5rIENvbGxlY3Rpb25DaGFuZ2VSZWNvcmR9LlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF90cnVuY2F0ZShyZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQpIHtcbiAgICAvLyBBbnl0aGluZyBhZnRlciB0aGF0IG5lZWRzIHRvIGJlIHJlbW92ZWQ7XG4gICAgd2hpbGUgKHJlY29yZCAhPT0gbnVsbCkge1xuICAgICAgdmFyIG5leHRSZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgPSByZWNvcmQuX25leHQ7XG4gICAgICB0aGlzLl9hZGRUb1JlbW92YWxzKHRoaXMuX3VubGluayhyZWNvcmQpKTtcbiAgICAgIHJlY29yZCA9IG5leHRSZWNvcmQ7XG4gICAgfVxuICAgIGlmICh0aGlzLl91bmxpbmtlZFJlY29yZHMgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3VubGlua2VkUmVjb3Jkcy5jbGVhcigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9hZGRpdGlvbnNUYWlsICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9hZGRpdGlvbnNUYWlsLl9uZXh0QWRkZWQgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5fbW92ZXNUYWlsICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9tb3Zlc1RhaWwuX25leHRNb3ZlZCA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLl9pdFRhaWwgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2l0VGFpbC5fbmV4dCA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLl9yZW1vdmFsc1RhaWwgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3JlbW92YWxzVGFpbC5fbmV4dFJlbW92ZWQgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5faWRlbnRpdHlDaGFuZ2VzVGFpbCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5faWRlbnRpdHlDaGFuZ2VzVGFpbC5fbmV4dElkZW50aXR5Q2hhbmdlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWluc2VydEFmdGVyKHJlY29yZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCwgcHJldlJlY29yZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCxcbiAgICAgICAgICAgICAgICAgaW5kZXg6IG51bWJlcik6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQge1xuICAgIGlmICh0aGlzLl91bmxpbmtlZFJlY29yZHMgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3VubGlua2VkUmVjb3Jkcy5yZW1vdmUocmVjb3JkKTtcbiAgICB9XG4gICAgdmFyIHByZXYgPSByZWNvcmQuX3ByZXZSZW1vdmVkO1xuICAgIHZhciBuZXh0ID0gcmVjb3JkLl9uZXh0UmVtb3ZlZDtcblxuICAgIGlmIChwcmV2ID09PSBudWxsKSB7XG4gICAgICB0aGlzLl9yZW1vdmFsc0hlYWQgPSBuZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmV2Ll9uZXh0UmVtb3ZlZCA9IG5leHQ7XG4gICAgfVxuICAgIGlmIChuZXh0ID09PSBudWxsKSB7XG4gICAgICB0aGlzLl9yZW1vdmFsc1RhaWwgPSBwcmV2O1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0Ll9wcmV2UmVtb3ZlZCA9IHByZXY7XG4gICAgfVxuXG4gICAgdGhpcy5faW5zZXJ0QWZ0ZXIocmVjb3JkLCBwcmV2UmVjb3JkLCBpbmRleCk7XG4gICAgdGhpcy5fYWRkVG9Nb3ZlcyhyZWNvcmQsIGluZGV4KTtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbW92ZUFmdGVyKHJlY29yZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCwgcHJldlJlY29yZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCxcbiAgICAgICAgICAgICBpbmRleDogbnVtYmVyKTogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCB7XG4gICAgdGhpcy5fdW5saW5rKHJlY29yZCk7XG4gICAgdGhpcy5faW5zZXJ0QWZ0ZXIocmVjb3JkLCBwcmV2UmVjb3JkLCBpbmRleCk7XG4gICAgdGhpcy5fYWRkVG9Nb3ZlcyhyZWNvcmQsIGluZGV4KTtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYWRkQWZ0ZXIocmVjb3JkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkLCBwcmV2UmVjb3JkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkLFxuICAgICAgICAgICAgaW5kZXg6IG51bWJlcik6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQge1xuICAgIHRoaXMuX2luc2VydEFmdGVyKHJlY29yZCwgcHJldlJlY29yZCwgaW5kZXgpO1xuXG4gICAgaWYgKHRoaXMuX2FkZGl0aW9uc1RhaWwgPT09IG51bGwpIHtcbiAgICAgIC8vIHRvZG8odmljYilcbiAgICAgIC8vIGFzc2VydCh0aGlzLl9hZGRpdGlvbnNIZWFkID09PSBudWxsKTtcbiAgICAgIHRoaXMuX2FkZGl0aW9uc1RhaWwgPSB0aGlzLl9hZGRpdGlvbnNIZWFkID0gcmVjb3JkO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0b2RvKHZpY2IpXG4gICAgICAvLyBhc3NlcnQoX2FkZGl0aW9uc1RhaWwuX25leHRBZGRlZCA9PT0gbnVsbCk7XG4gICAgICAvLyBhc3NlcnQocmVjb3JkLl9uZXh0QWRkZWQgPT09IG51bGwpO1xuICAgICAgdGhpcy5fYWRkaXRpb25zVGFpbCA9IHRoaXMuX2FkZGl0aW9uc1RhaWwuX25leHRBZGRlZCA9IHJlY29yZDtcbiAgICB9XG4gICAgcmV0dXJuIHJlY29yZDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2luc2VydEFmdGVyKHJlY29yZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCwgcHJldlJlY29yZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCxcbiAgICAgICAgICAgICAgIGluZGV4OiBudW1iZXIpOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkIHtcbiAgICAvLyB0b2RvKHZpY2IpXG4gICAgLy8gYXNzZXJ0KHJlY29yZCAhPSBwcmV2UmVjb3JkKTtcbiAgICAvLyBhc3NlcnQocmVjb3JkLl9uZXh0ID09PSBudWxsKTtcbiAgICAvLyBhc3NlcnQocmVjb3JkLl9wcmV2ID09PSBudWxsKTtcblxuICAgIHZhciBuZXh0OiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkID0gcHJldlJlY29yZCA9PT0gbnVsbCA/IHRoaXMuX2l0SGVhZCA6IHByZXZSZWNvcmQuX25leHQ7XG4gICAgLy8gdG9kbyh2aWNiKVxuICAgIC8vIGFzc2VydChuZXh0ICE9IHJlY29yZCk7XG4gICAgLy8gYXNzZXJ0KHByZXZSZWNvcmQgIT0gcmVjb3JkKTtcbiAgICByZWNvcmQuX25leHQgPSBuZXh0O1xuICAgIHJlY29yZC5fcHJldiA9IHByZXZSZWNvcmQ7XG4gICAgaWYgKG5leHQgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2l0VGFpbCA9IHJlY29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dC5fcHJldiA9IHJlY29yZDtcbiAgICB9XG4gICAgaWYgKHByZXZSZWNvcmQgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2l0SGVhZCA9IHJlY29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJldlJlY29yZC5fbmV4dCA9IHJlY29yZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbGlua2VkUmVjb3JkcyA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fbGlua2VkUmVjb3JkcyA9IG5ldyBfRHVwbGljYXRlTWFwKCk7XG4gICAgfVxuICAgIHRoaXMuX2xpbmtlZFJlY29yZHMucHV0KHJlY29yZCk7XG5cbiAgICByZWNvcmQuY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlY29yZDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlbW92ZShyZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQpOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkIHtcbiAgICByZXR1cm4gdGhpcy5fYWRkVG9SZW1vdmFscyh0aGlzLl91bmxpbmsocmVjb3JkKSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91bmxpbmsocmVjb3JkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkKTogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCB7XG4gICAgaWYgKHRoaXMuX2xpbmtlZFJlY29yZHMgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2xpbmtlZFJlY29yZHMucmVtb3ZlKHJlY29yZCk7XG4gICAgfVxuXG4gICAgdmFyIHByZXYgPSByZWNvcmQuX3ByZXY7XG4gICAgdmFyIG5leHQgPSByZWNvcmQuX25leHQ7XG5cbiAgICAvLyB0b2RvKHZpY2IpXG4gICAgLy8gYXNzZXJ0KChyZWNvcmQuX3ByZXYgPSBudWxsKSA9PT0gbnVsbCk7XG4gICAgLy8gYXNzZXJ0KChyZWNvcmQuX25leHQgPSBudWxsKSA9PT0gbnVsbCk7XG5cbiAgICBpZiAocHJldiA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5faXRIZWFkID0gbmV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJldi5fbmV4dCA9IG5leHQ7XG4gICAgfVxuICAgIGlmIChuZXh0ID09PSBudWxsKSB7XG4gICAgICB0aGlzLl9pdFRhaWwgPSBwcmV2O1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0Ll9wcmV2ID0gcHJldjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYWRkVG9Nb3ZlcyhyZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQsIHRvSW5kZXg6IG51bWJlcik6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQge1xuICAgIC8vIHRvZG8odmljYilcbiAgICAvLyBhc3NlcnQocmVjb3JkLl9uZXh0TW92ZWQgPT09IG51bGwpO1xuXG4gICAgaWYgKHJlY29yZC5wcmV2aW91c0luZGV4ID09PSB0b0luZGV4KSB7XG4gICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tb3Zlc1RhaWwgPT09IG51bGwpIHtcbiAgICAgIC8vIHRvZG8odmljYilcbiAgICAgIC8vIGFzc2VydChfbW92ZXNIZWFkID09PSBudWxsKTtcbiAgICAgIHRoaXMuX21vdmVzVGFpbCA9IHRoaXMuX21vdmVzSGVhZCA9IHJlY29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdG9kbyh2aWNiKVxuICAgICAgLy8gYXNzZXJ0KF9tb3Zlc1RhaWwuX25leHRNb3ZlZCA9PT0gbnVsbCk7XG4gICAgICB0aGlzLl9tb3Zlc1RhaWwgPSB0aGlzLl9tb3Zlc1RhaWwuX25leHRNb3ZlZCA9IHJlY29yZDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYWRkVG9SZW1vdmFscyhyZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQpOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkIHtcbiAgICBpZiAodGhpcy5fdW5saW5rZWRSZWNvcmRzID09PSBudWxsKSB7XG4gICAgICB0aGlzLl91bmxpbmtlZFJlY29yZHMgPSBuZXcgX0R1cGxpY2F0ZU1hcCgpO1xuICAgIH1cbiAgICB0aGlzLl91bmxpbmtlZFJlY29yZHMucHV0KHJlY29yZCk7XG4gICAgcmVjb3JkLmN1cnJlbnRJbmRleCA9IG51bGw7XG4gICAgcmVjb3JkLl9uZXh0UmVtb3ZlZCA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5fcmVtb3ZhbHNUYWlsID09PSBudWxsKSB7XG4gICAgICAvLyB0b2RvKHZpY2IpXG4gICAgICAvLyBhc3NlcnQoX3JlbW92YWxzSGVhZCA9PT0gbnVsbCk7XG4gICAgICB0aGlzLl9yZW1vdmFsc1RhaWwgPSB0aGlzLl9yZW1vdmFsc0hlYWQgPSByZWNvcmQ7XG4gICAgICByZWNvcmQuX3ByZXZSZW1vdmVkID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdG9kbyh2aWNiKVxuICAgICAgLy8gYXNzZXJ0KF9yZW1vdmFsc1RhaWwuX25leHRSZW1vdmVkID09PSBudWxsKTtcbiAgICAgIC8vIGFzc2VydChyZWNvcmQuX25leHRSZW1vdmVkID09PSBudWxsKTtcbiAgICAgIHJlY29yZC5fcHJldlJlbW92ZWQgPSB0aGlzLl9yZW1vdmFsc1RhaWw7XG4gICAgICB0aGlzLl9yZW1vdmFsc1RhaWwgPSB0aGlzLl9yZW1vdmFsc1RhaWwuX25leHRSZW1vdmVkID0gcmVjb3JkO1xuICAgIH1cbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYWRkSWRlbnRpdHlDaGFuZ2UocmVjb3JkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkLCBpdGVtOiBhbnkpIHtcbiAgICByZWNvcmQuaXRlbSA9IGl0ZW07XG4gICAgaWYgKHRoaXMuX2lkZW50aXR5Q2hhbmdlc1RhaWwgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2lkZW50aXR5Q2hhbmdlc1RhaWwgPSB0aGlzLl9pZGVudGl0eUNoYW5nZXNIZWFkID0gcmVjb3JkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pZGVudGl0eUNoYW5nZXNUYWlsID0gdGhpcy5faWRlbnRpdHlDaGFuZ2VzVGFpbC5fbmV4dElkZW50aXR5Q2hhbmdlID0gcmVjb3JkO1xuICAgIH1cbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG5cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHZhciBsaXN0ID0gW107XG4gICAgdGhpcy5mb3JFYWNoSXRlbSgocmVjb3JkKSA9PiBsaXN0LnB1c2gocmVjb3JkKSk7XG5cbiAgICB2YXIgcHJldmlvdXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2hQcmV2aW91c0l0ZW0oKHJlY29yZCkgPT4gcHJldmlvdXMucHVzaChyZWNvcmQpKTtcblxuICAgIHZhciBhZGRpdGlvbnMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2hBZGRlZEl0ZW0oKHJlY29yZCkgPT4gYWRkaXRpb25zLnB1c2gocmVjb3JkKSk7XG5cbiAgICB2YXIgbW92ZXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2hNb3ZlZEl0ZW0oKHJlY29yZCkgPT4gbW92ZXMucHVzaChyZWNvcmQpKTtcblxuICAgIHZhciByZW1vdmFscyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaFJlbW92ZWRJdGVtKChyZWNvcmQpID0+IHJlbW92YWxzLnB1c2gocmVjb3JkKSk7XG5cbiAgICB2YXIgaWRlbnRpdHlDaGFuZ2VzID0gW107XG4gICAgdGhpcy5mb3JFYWNoSWRlbnRpdHlDaGFuZ2UoKHJlY29yZCkgPT4gaWRlbnRpdHlDaGFuZ2VzLnB1c2gocmVjb3JkKSk7XG5cbiAgICByZXR1cm4gXCJjb2xsZWN0aW9uOiBcIiArIGxpc3Quam9pbignLCAnKSArIFwiXFxuXCIgKyBcInByZXZpb3VzOiBcIiArIHByZXZpb3VzLmpvaW4oJywgJykgKyBcIlxcblwiICtcbiAgICAgICAgICAgXCJhZGRpdGlvbnM6IFwiICsgYWRkaXRpb25zLmpvaW4oJywgJykgKyBcIlxcblwiICsgXCJtb3ZlczogXCIgKyBtb3Zlcy5qb2luKCcsICcpICsgXCJcXG5cIiArXG4gICAgICAgICAgIFwicmVtb3ZhbHM6IFwiICsgcmVtb3ZhbHMuam9pbignLCAnKSArIFwiXFxuXCIgKyBcImlkZW50aXR5Q2hhbmdlczogXCIgK1xuICAgICAgICAgICBpZGVudGl0eUNoYW5nZXMuam9pbignLCAnKSArIFwiXFxuXCI7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQge1xuICBjdXJyZW50SW5kZXg6IG51bWJlciA9IG51bGw7XG4gIHByZXZpb3VzSW5kZXg6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbmV4dFByZXZpb3VzOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcHJldjogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCA9IG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX25leHQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIF9wcmV2RHVwOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbmV4dER1cDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCA9IG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3ByZXZSZW1vdmVkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbmV4dFJlbW92ZWQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIF9uZXh0QWRkZWQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIF9uZXh0TW92ZWQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIF9uZXh0SWRlbnRpdHlDaGFuZ2U6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgPSBudWxsO1xuXG5cbiAgY29uc3RydWN0b3IocHVibGljIGl0ZW06IGFueSwgcHVibGljIHRyYWNrQnlJZDogYW55KSB7fVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXNJbmRleCA9PT0gdGhpcy5jdXJyZW50SW5kZXggP1xuICAgICAgICAgICAgICAgc3RyaW5naWZ5KHRoaXMuaXRlbSkgOlxuICAgICAgICAgICAgICAgc3RyaW5naWZ5KHRoaXMuaXRlbSkgKyAnWycgKyBzdHJpbmdpZnkodGhpcy5wcmV2aW91c0luZGV4KSArICctPicgK1xuICAgICAgICAgICAgICAgICAgIHN0cmluZ2lmeSh0aGlzLmN1cnJlbnRJbmRleCkgKyAnXSc7XG4gIH1cbn1cblxuLy8gQSBsaW5rZWQgbGlzdCBvZiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkcyB3aXRoIHRoZSBzYW1lIENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQuaXRlbVxuY2xhc3MgX0R1cGxpY2F0ZUl0ZW1SZWNvcmRMaXN0IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaGVhZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCA9IG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3RhaWw6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBBcHBlbmQgdGhlIHJlY29yZCB0byB0aGUgbGlzdCBvZiBkdXBsaWNhdGVzLlxuICAgKlxuICAgKiBOb3RlOiBieSBkZXNpZ24gYWxsIHJlY29yZHMgaW4gdGhlIGxpc3Qgb2YgZHVwbGljYXRlcyBob2xkIHRoZSBzYW1lIHZhbHVlIGluIHJlY29yZC5pdGVtLlxuICAgKi9cbiAgYWRkKHJlY29yZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9oZWFkID09PSBudWxsKSB7XG4gICAgICB0aGlzLl9oZWFkID0gdGhpcy5fdGFpbCA9IHJlY29yZDtcbiAgICAgIHJlY29yZC5fbmV4dER1cCA9IG51bGw7XG4gICAgICByZWNvcmQuX3ByZXZEdXAgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0b2RvKHZpY2IpXG4gICAgICAvLyBhc3NlcnQocmVjb3JkLml0ZW0gPT0gIF9oZWFkLml0ZW0gfHxcbiAgICAgIC8vICAgICAgIHJlY29yZC5pdGVtIGlzIG51bSAmJiByZWNvcmQuaXRlbS5pc05hTiAmJiBfaGVhZC5pdGVtIGlzIG51bSAmJiBfaGVhZC5pdGVtLmlzTmFOKTtcbiAgICAgIHRoaXMuX3RhaWwuX25leHREdXAgPSByZWNvcmQ7XG4gICAgICByZWNvcmQuX3ByZXZEdXAgPSB0aGlzLl90YWlsO1xuICAgICAgcmVjb3JkLl9uZXh0RHVwID0gbnVsbDtcbiAgICAgIHRoaXMuX3RhaWwgPSByZWNvcmQ7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJucyBhIENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgaGF2aW5nIENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQudHJhY2tCeUlkID09IHRyYWNrQnlJZCBhbmRcbiAgLy8gQ29sbGVjdGlvbkNoYW5nZVJlY29yZC5jdXJyZW50SW5kZXggPj0gYWZ0ZXJJbmRleFxuICBnZXQodHJhY2tCeUlkOiBhbnksIGFmdGVySW5kZXg6IG51bWJlcik6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQge1xuICAgIHZhciByZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQ7XG4gICAgZm9yIChyZWNvcmQgPSB0aGlzLl9oZWFkOyByZWNvcmQgIT09IG51bGw7IHJlY29yZCA9IHJlY29yZC5fbmV4dER1cCkge1xuICAgICAgaWYgKChhZnRlckluZGV4ID09PSBudWxsIHx8IGFmdGVySW5kZXggPCByZWNvcmQuY3VycmVudEluZGV4KSAmJlxuICAgICAgICAgIGxvb3NlSWRlbnRpY2FsKHJlY29yZC50cmFja0J5SWQsIHRyYWNrQnlJZCkpIHtcbiAgICAgICAgcmV0dXJuIHJlY29yZDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIG9uZSB7QGxpbmsgQ29sbGVjdGlvbkNoYW5nZVJlY29yZH0gZnJvbSB0aGUgbGlzdCBvZiBkdXBsaWNhdGVzLlxuICAgKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIGxpc3Qgb2YgZHVwbGljYXRlcyBpcyBlbXB0eS5cbiAgICovXG4gIHJlbW92ZShyZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQpOiBib29sZWFuIHtcbiAgICAvLyB0b2RvKHZpY2IpXG4gICAgLy8gYXNzZXJ0KCgpIHtcbiAgICAvLyAgLy8gdmVyaWZ5IHRoYXQgdGhlIHJlY29yZCBiZWluZyByZW1vdmVkIGlzIGluIHRoZSBsaXN0LlxuICAgIC8vICBmb3IgKENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgY3Vyc29yID0gX2hlYWQ7IGN1cnNvciAhPSBudWxsOyBjdXJzb3IgPSBjdXJzb3IuX25leHREdXApIHtcbiAgICAvLyAgICBpZiAoaWRlbnRpY2FsKGN1cnNvciwgcmVjb3JkKSkgcmV0dXJuIHRydWU7XG4gICAgLy8gIH1cbiAgICAvLyAgcmV0dXJuIGZhbHNlO1xuICAgIC8vfSk7XG5cbiAgICB2YXIgcHJldjogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCA9IHJlY29yZC5fcHJldkR1cDtcbiAgICB2YXIgbmV4dDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCA9IHJlY29yZC5fbmV4dER1cDtcbiAgICBpZiAocHJldiA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5faGVhZCA9IG5leHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZXYuX25leHREdXAgPSBuZXh0O1xuICAgIH1cbiAgICBpZiAobmV4dCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGFpbCA9IHByZXY7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHQuX3ByZXZEdXAgPSBwcmV2O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5faGVhZCA9PT0gbnVsbDtcbiAgfVxufVxuXG5jbGFzcyBfRHVwbGljYXRlTWFwIHtcbiAgbWFwID0gbmV3IE1hcDxhbnksIF9EdXBsaWNhdGVJdGVtUmVjb3JkTGlzdD4oKTtcblxuICBwdXQocmVjb3JkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkKSB7XG4gICAgLy8gdG9kbyh2aWNiKSBoYW5kbGUgY29ybmVyIGNhc2VzXG4gICAgdmFyIGtleSA9IGdldE1hcEtleShyZWNvcmQudHJhY2tCeUlkKTtcblxuICAgIHZhciBkdXBsaWNhdGVzID0gdGhpcy5tYXAuZ2V0KGtleSk7XG4gICAgaWYgKCFpc1ByZXNlbnQoZHVwbGljYXRlcykpIHtcbiAgICAgIGR1cGxpY2F0ZXMgPSBuZXcgX0R1cGxpY2F0ZUl0ZW1SZWNvcmRMaXN0KCk7XG4gICAgICB0aGlzLm1hcC5zZXQoa2V5LCBkdXBsaWNhdGVzKTtcbiAgICB9XG4gICAgZHVwbGljYXRlcy5hZGQocmVjb3JkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgYHZhbHVlYCB1c2luZyBrZXkuIEJlY2F1c2UgdGhlIENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQgdmFsdWUgbWF5IGJlIG9uZSB3aGljaCB3ZVxuICAgKiBoYXZlIGFscmVhZHkgaXRlcmF0ZWQgb3Zlciwgd2UgdXNlIHRoZSBhZnRlckluZGV4IHRvIHByZXRlbmQgaXQgaXMgbm90IHRoZXJlLlxuICAgKlxuICAgKiBVc2UgY2FzZTogYFthLCBiLCBjLCBhLCBhXWAgaWYgd2UgYXJlIGF0IGluZGV4IGAzYCB3aGljaCBpcyB0aGUgc2Vjb25kIGBhYCB0aGVuIGFza2luZyBpZiB3ZVxuICAgKiBoYXZlIGFueSBtb3JlIGBhYHMgbmVlZHMgdG8gcmV0dXJuIHRoZSBsYXN0IGBhYCBub3QgdGhlIGZpcnN0IG9yIHNlY29uZC5cbiAgICovXG4gIGdldCh0cmFja0J5SWQ6IGFueSwgYWZ0ZXJJbmRleDogbnVtYmVyID0gbnVsbCk6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQge1xuICAgIHZhciBrZXkgPSBnZXRNYXBLZXkodHJhY2tCeUlkKTtcblxuICAgIHZhciByZWNvcmRMaXN0ID0gdGhpcy5tYXAuZ2V0KGtleSk7XG4gICAgcmV0dXJuIGlzQmxhbmsocmVjb3JkTGlzdCkgPyBudWxsIDogcmVjb3JkTGlzdC5nZXQodHJhY2tCeUlkLCBhZnRlckluZGV4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEge0BsaW5rIENvbGxlY3Rpb25DaGFuZ2VSZWNvcmR9IGZyb20gdGhlIGxpc3Qgb2YgZHVwbGljYXRlcy5cbiAgICpcbiAgICogVGhlIGxpc3Qgb2YgZHVwbGljYXRlcyBhbHNvIGlzIHJlbW92ZWQgZnJvbSB0aGUgbWFwIGlmIGl0IGdldHMgZW1wdHkuXG4gICAqL1xuICByZW1vdmUocmVjb3JkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkKTogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCB7XG4gICAgdmFyIGtleSA9IGdldE1hcEtleShyZWNvcmQudHJhY2tCeUlkKTtcbiAgICAvLyB0b2RvKHZpY2IpXG4gICAgLy8gYXNzZXJ0KHRoaXMubWFwLmNvbnRhaW5zS2V5KGtleSkpO1xuICAgIHZhciByZWNvcmRMaXN0OiBfRHVwbGljYXRlSXRlbVJlY29yZExpc3QgPSB0aGlzLm1hcC5nZXQoa2V5KTtcbiAgICAvLyBSZW1vdmUgdGhlIGxpc3Qgb2YgZHVwbGljYXRlcyB3aGVuIGl0IGdldHMgZW1wdHlcbiAgICBpZiAocmVjb3JkTGlzdC5yZW1vdmUocmVjb3JkKSkge1xuICAgICAgdGhpcy5tYXAuZGVsZXRlKGtleSk7XG4gICAgfVxuICAgIHJldHVybiByZWNvcmQ7XG4gIH1cblxuICBnZXQgaXNFbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubWFwLnNpemUgPT09IDA7IH1cblxuICBjbGVhcigpIHsgdGhpcy5tYXAuY2xlYXIoKTsgfVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiAnX0R1cGxpY2F0ZU1hcCgnICsgc3RyaW5naWZ5KHRoaXMubWFwKSArICcpJzsgfVxufVxuIl19