'use strict';"use strict";
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('angular2/src/facade/async');
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
var QueryList = (function () {
    function QueryList() {
        this._results = [];
        this._emitter = new async_1.EventEmitter();
    }
    Object.defineProperty(QueryList.prototype, "changes", {
        get: function () { return this._emitter; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryList.prototype, "length", {
        get: function () { return this._results.length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryList.prototype, "first", {
        get: function () { return collection_1.ListWrapper.first(this._results); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryList.prototype, "last", {
        get: function () { return collection_1.ListWrapper.last(this._results); },
        enumerable: true,
        configurable: true
    });
    /**
     * returns a new array with the passed in function applied to each element.
     */
    QueryList.prototype.map = function (fn) { return this._results.map(fn); };
    /**
     * returns a filtered array.
     */
    QueryList.prototype.filter = function (fn) { return this._results.filter(fn); };
    /**
     * returns a reduced value.
     */
    QueryList.prototype.reduce = function (fn, init) { return this._results.reduce(fn, init); };
    /**
     * executes function for each element in a query.
     */
    QueryList.prototype.forEach = function (fn) { this._results.forEach(fn); };
    /**
     * converts QueryList into an array
     */
    QueryList.prototype.toArray = function () { return collection_1.ListWrapper.clone(this._results); };
    QueryList.prototype[lang_1.getSymbolIterator()] = function () { return this._results[lang_1.getSymbolIterator()](); };
    QueryList.prototype.toString = function () { return this._results.toString(); };
    /**
     * @internal
     */
    QueryList.prototype.reset = function (res) { this._results = res; };
    /** @internal */
    QueryList.prototype.notifyOnChanges = function () { this._emitter.emit(this); };
    return QueryList;
}());
exports.QueryList = QueryList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlfbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9xdWVyeV9saXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwyQkFBc0MsZ0NBQWdDLENBQUMsQ0FBQTtBQUN2RSxxQkFBZ0MsMEJBQTBCLENBQUMsQ0FBQTtBQUMzRCxzQkFBdUMsMkJBQTJCLENBQUMsQ0FBQTtBQUduRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFDSDtJQUFBO1FBQ1UsYUFBUSxHQUFhLEVBQUUsQ0FBQztRQUN4QixhQUFRLEdBQUcsSUFBSSxvQkFBWSxFQUFFLENBQUM7SUEyQ3hDLENBQUM7SUF6Q0Msc0JBQUksOEJBQU87YUFBWCxjQUFpQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3hELHNCQUFJLDZCQUFNO2FBQVYsY0FBdUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDckQsc0JBQUksNEJBQUs7YUFBVCxjQUFpQixNQUFNLENBQUMsd0JBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDM0Qsc0JBQUksMkJBQUk7YUFBUixjQUFnQixNQUFNLENBQUMsd0JBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFekQ7O09BRUc7SUFDSCx1QkFBRyxHQUFILFVBQU8sRUFBa0IsSUFBUyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWpFOztPQUVHO0lBQ0gsMEJBQU0sR0FBTixVQUFPLEVBQXdCLElBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUxRTs7T0FFRztJQUNILDBCQUFNLEdBQU4sVUFBVSxFQUEwQixFQUFFLElBQU8sSUFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU1Rjs7T0FFRztJQUNILDJCQUFPLEdBQVAsVUFBUSxFQUFxQixJQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuRTs7T0FFRztJQUNILDJCQUFPLEdBQVAsY0FBaUIsTUFBTSxDQUFDLHdCQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0Qsb0JBQUMsd0JBQWlCLEVBQUUsQ0FBQyxHQUFyQixjQUErQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBaUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFN0UsNEJBQVEsR0FBUixjQUFxQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdkQ7O09BRUc7SUFDSCx5QkFBSyxHQUFMLFVBQU0sR0FBUSxJQUFVLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUU5QyxnQkFBZ0I7SUFDaEIsbUNBQWUsR0FBZixjQUEwQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsZ0JBQUM7QUFBRCxDQUFDLEFBN0NELElBNkNDO0FBN0NZLGlCQUFTLFlBNkNyQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMaXN0V3JhcHBlciwgTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7Z2V0U3ltYm9sSXRlcmF0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge09ic2VydmFibGUsIEV2ZW50RW1pdHRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5cblxuLyoqXG4gKiBBbiB1bm1vZGlmaWFibGUgbGlzdCBvZiBpdGVtcyB0aGF0IEFuZ3VsYXIga2VlcHMgdXAgdG8gZGF0ZSB3aGVuIHRoZSBzdGF0ZVxuICogb2YgdGhlIGFwcGxpY2F0aW9uIGNoYW5nZXMuXG4gKlxuICogVGhlIHR5cGUgb2Ygb2JqZWN0IHRoYXQge0BsaW5rIFF1ZXJ5TWV0YWRhdGF9IGFuZCB7QGxpbmsgVmlld1F1ZXJ5TWV0YWRhdGF9IHByb3ZpZGUuXG4gKlxuICogSW1wbGVtZW50cyBhbiBpdGVyYWJsZSBpbnRlcmZhY2UsIHRoZXJlZm9yZSBpdCBjYW4gYmUgdXNlZCBpbiBib3RoIEVTNlxuICogamF2YXNjcmlwdCBgZm9yICh2YXIgaSBvZiBpdGVtcylgIGxvb3BzIGFzIHdlbGwgYXMgaW4gQW5ndWxhciB0ZW1wbGF0ZXMgd2l0aFxuICogYCpuZ0Zvcj1cIiNpIG9mIG15TGlzdFwiYC5cbiAqXG4gKiBDaGFuZ2VzIGNhbiBiZSBvYnNlcnZlZCBieSBzdWJzY3JpYmluZyB0byB0aGUgY2hhbmdlcyBgT2JzZXJ2YWJsZWAuXG4gKlxuICogTk9URTogSW4gdGhlIGZ1dHVyZSB0aGlzIGNsYXNzIHdpbGwgaW1wbGVtZW50IGFuIGBPYnNlcnZhYmxlYCBpbnRlcmZhY2UuXG4gKlxuICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L1JYOHNKblFZbDlGV3VTQ1dtZTV6P3A9cHJldmlldykpXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBAQ29tcG9uZW50KHsuLi59KVxuICogY2xhc3MgQ29udGFpbmVyIHtcbiAqICAgY29uc3RydWN0b3IoQFF1ZXJ5KEl0ZW0pIGl0ZW1zOiBRdWVyeUxpc3Q8SXRlbT4pIHtcbiAqICAgICBpdGVtcy5jaGFuZ2VzLnN1YnNjcmliZShfID0+IGNvbnNvbGUubG9nKGl0ZW1zLmxlbmd0aCkpO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXJ5TGlzdDxUPiB7XG4gIHByaXZhdGUgX3Jlc3VsdHM6IEFycmF5PFQ+ID0gW107XG4gIHByaXZhdGUgX2VtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgZ2V0IGNoYW5nZXMoKTogT2JzZXJ2YWJsZTxhbnk+IHsgcmV0dXJuIHRoaXMuX2VtaXR0ZXI7IH1cbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fcmVzdWx0cy5sZW5ndGg7IH1cbiAgZ2V0IGZpcnN0KCk6IFQgeyByZXR1cm4gTGlzdFdyYXBwZXIuZmlyc3QodGhpcy5fcmVzdWx0cyk7IH1cbiAgZ2V0IGxhc3QoKTogVCB7IHJldHVybiBMaXN0V3JhcHBlci5sYXN0KHRoaXMuX3Jlc3VsdHMpOyB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSBuZXcgYXJyYXkgd2l0aCB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uIGFwcGxpZWQgdG8gZWFjaCBlbGVtZW50LlxuICAgKi9cbiAgbWFwPFU+KGZuOiAoaXRlbTogVCkgPT4gVSk6IFVbXSB7IHJldHVybiB0aGlzLl9yZXN1bHRzLm1hcChmbik7IH1cblxuICAvKipcbiAgICogcmV0dXJucyBhIGZpbHRlcmVkIGFycmF5LlxuICAgKi9cbiAgZmlsdGVyKGZuOiAoaXRlbTogVCkgPT4gYm9vbGVhbik6IFRbXSB7IHJldHVybiB0aGlzLl9yZXN1bHRzLmZpbHRlcihmbik7IH1cblxuICAvKipcbiAgICogcmV0dXJucyBhIHJlZHVjZWQgdmFsdWUuXG4gICAqL1xuICByZWR1Y2U8VT4oZm46IChhY2M6IFUsIGl0ZW06IFQpID0+IFUsIGluaXQ6IFUpOiBVIHsgcmV0dXJuIHRoaXMuX3Jlc3VsdHMucmVkdWNlKGZuLCBpbml0KTsgfVxuXG4gIC8qKlxuICAgKiBleGVjdXRlcyBmdW5jdGlvbiBmb3IgZWFjaCBlbGVtZW50IGluIGEgcXVlcnkuXG4gICAqL1xuICBmb3JFYWNoKGZuOiAoaXRlbTogVCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9yZXN1bHRzLmZvckVhY2goZm4pOyB9XG5cbiAgLyoqXG4gICAqIGNvbnZlcnRzIFF1ZXJ5TGlzdCBpbnRvIGFuIGFycmF5XG4gICAqL1xuICB0b0FycmF5KCk6IFRbXSB7IHJldHVybiBMaXN0V3JhcHBlci5jbG9uZSh0aGlzLl9yZXN1bHRzKTsgfVxuXG4gIFtnZXRTeW1ib2xJdGVyYXRvcigpXSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fcmVzdWx0c1tnZXRTeW1ib2xJdGVyYXRvcigpXSgpOyB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3Jlc3VsdHMudG9TdHJpbmcoKTsgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHJlc2V0KHJlczogVFtdKTogdm9pZCB7IHRoaXMuX3Jlc3VsdHMgPSByZXM7IH1cblxuICAvKiogQGludGVybmFsICovXG4gIG5vdGlmeU9uQ2hhbmdlcygpOiB2b2lkIHsgdGhpcy5fZW1pdHRlci5lbWl0KHRoaXMpOyB9XG59XG4iXX0=