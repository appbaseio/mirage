import { ListWrapper } from 'angular2/src/facade/collection';
import { getSymbolIterator } from 'angular2/src/facade/lang';
import { EventEmitter } from 'angular2/src/facade/async';
/**
 * An unmodifiable list of items that Angular keeps up to date when the state
 * of the application changes.
 *
 * The type of object that {@link QueryMetadata} and {@link ViewQueryMetadata} provide.
 *
 * Implements an iterable interface, therefore it can be used in both ES6
 * javascript `for (var i of items)` loops as well as in Angular templates with
 * `*ngFor="#i of myList"`.
 *
 * Changes can be observed by subscribing to the changes `Observable`.
 *
 * NOTE: In the future this class will implement an `Observable` interface.
 *
 * ### Example ([live demo](http://plnkr.co/edit/RX8sJnQYl9FWuSCWme5z?p=preview))
 * ```typescript
 * @Component({...})
 * class Container {
 *   constructor(@Query(Item) items: QueryList<Item>) {
 *     items.changes.subscribe(_ => console.log(items.length));
 *   }
 * }
 * ```
 */
export class QueryList {
    constructor() {
        this._results = [];
        this._emitter = new EventEmitter();
    }
    get changes() { return this._emitter; }
    get length() { return this._results.length; }
    get first() { return ListWrapper.first(this._results); }
    get last() { return ListWrapper.last(this._results); }
    /**
     * returns a new array with the passed in function applied to each element.
     */
    map(fn) { return this._results.map(fn); }
    /**
     * returns a filtered array.
     */
    filter(fn) { return this._results.filter(fn); }
    /**
     * returns a reduced value.
     */
    reduce(fn, init) { return this._results.reduce(fn, init); }
    /**
     * executes function for each element in a query.
     */
    forEach(fn) { this._results.forEach(fn); }
    /**
     * converts QueryList into an array
     */
    toArray() { return ListWrapper.clone(this._results); }
    [getSymbolIterator()]() { return this._results[getSymbolIterator()](); }
    toString() { return this._results.toString(); }
    /**
     * @internal
     */
    reset(res) { this._results = res; }
    /** @internal */
    notifyOnChanges() { this._emitter.emit(this); }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlfbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9xdWVyeV9saXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsV0FBVyxFQUFhLE1BQU0sZ0NBQWdDO09BQy9ELEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwwQkFBMEI7T0FDbkQsRUFBYSxZQUFZLEVBQUMsTUFBTSwyQkFBMkI7QUFHbEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJHO0FBQ0g7SUFBQTtRQUNVLGFBQVEsR0FBYSxFQUFFLENBQUM7UUFDeEIsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUEyQ3hDLENBQUM7SUF6Q0MsSUFBSSxPQUFPLEtBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN4RCxJQUFJLE1BQU0sS0FBYSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3JELElBQUksS0FBSyxLQUFRLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0QsSUFBSSxJQUFJLEtBQVEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6RDs7T0FFRztJQUNILEdBQUcsQ0FBSSxFQUFrQixJQUFTLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFakU7O09BRUc7SUFDSCxNQUFNLENBQUMsRUFBd0IsSUFBUyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTFFOztPQUVHO0lBQ0gsTUFBTSxDQUFJLEVBQTBCLEVBQUUsSUFBTyxJQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVGOztPQUVHO0lBQ0gsT0FBTyxDQUFDLEVBQXFCLElBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRW5FOztPQUVHO0lBQ0gsT0FBTyxLQUFVLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0QsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEtBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTdFLFFBQVEsS0FBYSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdkQ7O09BRUc7SUFDSCxLQUFLLENBQUMsR0FBUSxJQUFVLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUU5QyxnQkFBZ0I7SUFDaEIsZUFBZSxLQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0xpc3RXcmFwcGVyLCBNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtnZXRTeW1ib2xJdGVyYXRvcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgRXZlbnRFbWl0dGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcblxuXG4vKipcbiAqIEFuIHVubW9kaWZpYWJsZSBsaXN0IG9mIGl0ZW1zIHRoYXQgQW5ndWxhciBrZWVwcyB1cCB0byBkYXRlIHdoZW4gdGhlIHN0YXRlXG4gKiBvZiB0aGUgYXBwbGljYXRpb24gY2hhbmdlcy5cbiAqXG4gKiBUaGUgdHlwZSBvZiBvYmplY3QgdGhhdCB7QGxpbmsgUXVlcnlNZXRhZGF0YX0gYW5kIHtAbGluayBWaWV3UXVlcnlNZXRhZGF0YX0gcHJvdmlkZS5cbiAqXG4gKiBJbXBsZW1lbnRzIGFuIGl0ZXJhYmxlIGludGVyZmFjZSwgdGhlcmVmb3JlIGl0IGNhbiBiZSB1c2VkIGluIGJvdGggRVM2XG4gKiBqYXZhc2NyaXB0IGBmb3IgKHZhciBpIG9mIGl0ZW1zKWAgbG9vcHMgYXMgd2VsbCBhcyBpbiBBbmd1bGFyIHRlbXBsYXRlcyB3aXRoXG4gKiBgKm5nRm9yPVwiI2kgb2YgbXlMaXN0XCJgLlxuICpcbiAqIENoYW5nZXMgY2FuIGJlIG9ic2VydmVkIGJ5IHN1YnNjcmliaW5nIHRvIHRoZSBjaGFuZ2VzIGBPYnNlcnZhYmxlYC5cbiAqXG4gKiBOT1RFOiBJbiB0aGUgZnV0dXJlIHRoaXMgY2xhc3Mgd2lsbCBpbXBsZW1lbnQgYW4gYE9ic2VydmFibGVgIGludGVyZmFjZS5cbiAqXG4gKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvUlg4c0puUVlsOUZXdVNDV21lNXo/cD1wcmV2aWV3KSlcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBDb21wb25lbnQoey4uLn0pXG4gKiBjbGFzcyBDb250YWluZXIge1xuICogICBjb25zdHJ1Y3RvcihAUXVlcnkoSXRlbSkgaXRlbXM6IFF1ZXJ5TGlzdDxJdGVtPikge1xuICogICAgIGl0ZW1zLmNoYW5nZXMuc3Vic2NyaWJlKF8gPT4gY29uc29sZS5sb2coaXRlbXMubGVuZ3RoKSk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgUXVlcnlMaXN0PFQ+IHtcbiAgcHJpdmF0ZSBfcmVzdWx0czogQXJyYXk8VD4gPSBbXTtcbiAgcHJpdmF0ZSBfZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBnZXQgY2hhbmdlcygpOiBPYnNlcnZhYmxlPGFueT4geyByZXR1cm4gdGhpcy5fZW1pdHRlcjsgfVxuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9yZXN1bHRzLmxlbmd0aDsgfVxuICBnZXQgZmlyc3QoKTogVCB7IHJldHVybiBMaXN0V3JhcHBlci5maXJzdCh0aGlzLl9yZXN1bHRzKTsgfVxuICBnZXQgbGFzdCgpOiBUIHsgcmV0dXJuIExpc3RXcmFwcGVyLmxhc3QodGhpcy5fcmVzdWx0cyk7IH1cblxuICAvKipcbiAgICogcmV0dXJucyBhIG5ldyBhcnJheSB3aXRoIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24gYXBwbGllZCB0byBlYWNoIGVsZW1lbnQuXG4gICAqL1xuICBtYXA8VT4oZm46IChpdGVtOiBUKSA9PiBVKTogVVtdIHsgcmV0dXJuIHRoaXMuX3Jlc3VsdHMubWFwKGZuKTsgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEgZmlsdGVyZWQgYXJyYXkuXG4gICAqL1xuICBmaWx0ZXIoZm46IChpdGVtOiBUKSA9PiBib29sZWFuKTogVFtdIHsgcmV0dXJuIHRoaXMuX3Jlc3VsdHMuZmlsdGVyKGZuKTsgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEgcmVkdWNlZCB2YWx1ZS5cbiAgICovXG4gIHJlZHVjZTxVPihmbjogKGFjYzogVSwgaXRlbTogVCkgPT4gVSwgaW5pdDogVSk6IFUgeyByZXR1cm4gdGhpcy5fcmVzdWx0cy5yZWR1Y2UoZm4sIGluaXQpOyB9XG5cbiAgLyoqXG4gICAqIGV4ZWN1dGVzIGZ1bmN0aW9uIGZvciBlYWNoIGVsZW1lbnQgaW4gYSBxdWVyeS5cbiAgICovXG4gIGZvckVhY2goZm46IChpdGVtOiBUKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX3Jlc3VsdHMuZm9yRWFjaChmbik7IH1cblxuICAvKipcbiAgICogY29udmVydHMgUXVlcnlMaXN0IGludG8gYW4gYXJyYXlcbiAgICovXG4gIHRvQXJyYXkoKTogVFtdIHsgcmV0dXJuIExpc3RXcmFwcGVyLmNsb25lKHRoaXMuX3Jlc3VsdHMpOyB9XG5cbiAgW2dldFN5bWJvbEl0ZXJhdG9yKCldKCk6IGFueSB7IHJldHVybiB0aGlzLl9yZXN1bHRzW2dldFN5bWJvbEl0ZXJhdG9yKCldKCk7IH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fcmVzdWx0cy50b1N0cmluZygpOyB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcmVzZXQocmVzOiBUW10pOiB2b2lkIHsgdGhpcy5fcmVzdWx0cyA9IHJlczsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgbm90aWZ5T25DaGFuZ2VzKCk6IHZvaWQgeyB0aGlzLl9lbWl0dGVyLmVtaXQodGhpcyk7IH1cbn1cbiJdfQ==