import { ChangeDetectorRef } from '../change_detector_ref';
import { IterableDiffer, IterableDifferFactory, TrackByFn } from './iterable_differs';
export declare class DefaultIterableDifferFactory implements IterableDifferFactory {
    constructor();
    supports(obj: Object): boolean;
    create(cdRef: ChangeDetectorRef, trackByFn?: TrackByFn): DefaultIterableDiffer;
}
export declare class DefaultIterableDiffer implements IterableDiffer {
    private _trackByFn;
    private _length;
    private _collection;
    private _linkedRecords;
    private _unlinkedRecords;
    private _previousItHead;
    private _itHead;
    private _itTail;
    private _additionsHead;
    private _additionsTail;
    private _movesHead;
    private _movesTail;
    private _removalsHead;
    private _removalsTail;
    private _identityChangesHead;
    private _identityChangesTail;
    constructor(_trackByFn?: TrackByFn);
    readonly collection: any;
    readonly length: number;
    forEachItem(fn: Function): void;
    forEachPreviousItem(fn: Function): void;
    forEachAddedItem(fn: Function): void;
    forEachMovedItem(fn: Function): void;
    forEachRemovedItem(fn: Function): void;
    forEachIdentityChange(fn: Function): void;
    diff(collection: any): DefaultIterableDiffer;
    onDestroy(): void;
    check(collection: any): boolean;
    readonly isDirty: boolean;
    /**
     * Reset the state of the change objects to show no changes. This means set previousKey to
     * currentKey, and clear all of the queues (additions, moves, removals).
     * Set the previousIndexes of moved and added items to their currentIndexes
     * Reset the list of additions, moves and removals
     *
     * @internal
     */
    _reset(): void;
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
    _mismatch(record: CollectionChangeRecord, item: any, itemTrackBy: any, index: number): CollectionChangeRecord;
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
    _verifyReinsertion(record: CollectionChangeRecord, item: any, itemTrackBy: any, index: number): CollectionChangeRecord;
    /**
     * Get rid of any excess {@link CollectionChangeRecord}s from the previous collection
     *
     * - `record` The first excess {@link CollectionChangeRecord}.
     *
     * @internal
     */
    _truncate(record: CollectionChangeRecord): void;
    /** @internal */
    _reinsertAfter(record: CollectionChangeRecord, prevRecord: CollectionChangeRecord, index: number): CollectionChangeRecord;
    /** @internal */
    _moveAfter(record: CollectionChangeRecord, prevRecord: CollectionChangeRecord, index: number): CollectionChangeRecord;
    /** @internal */
    _addAfter(record: CollectionChangeRecord, prevRecord: CollectionChangeRecord, index: number): CollectionChangeRecord;
    /** @internal */
    _insertAfter(record: CollectionChangeRecord, prevRecord: CollectionChangeRecord, index: number): CollectionChangeRecord;
    /** @internal */
    _remove(record: CollectionChangeRecord): CollectionChangeRecord;
    /** @internal */
    _unlink(record: CollectionChangeRecord): CollectionChangeRecord;
    /** @internal */
    _addToMoves(record: CollectionChangeRecord, toIndex: number): CollectionChangeRecord;
    /** @internal */
    _addToRemovals(record: CollectionChangeRecord): CollectionChangeRecord;
    /** @internal */
    _addIdentityChange(record: CollectionChangeRecord, item: any): CollectionChangeRecord;
    toString(): string;
}
export declare class CollectionChangeRecord {
    item: any;
    trackById: any;
    currentIndex: number;
    previousIndex: number;
    /** @internal */
    _nextPrevious: CollectionChangeRecord;
    /** @internal */
    _prev: CollectionChangeRecord;
    /** @internal */
    _next: CollectionChangeRecord;
    /** @internal */
    _prevDup: CollectionChangeRecord;
    /** @internal */
    _nextDup: CollectionChangeRecord;
    /** @internal */
    _prevRemoved: CollectionChangeRecord;
    /** @internal */
    _nextRemoved: CollectionChangeRecord;
    /** @internal */
    _nextAdded: CollectionChangeRecord;
    /** @internal */
    _nextMoved: CollectionChangeRecord;
    /** @internal */
    _nextIdentityChange: CollectionChangeRecord;
    constructor(item: any, trackById: any);
    toString(): string;
}
